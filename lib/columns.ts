import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { del, list, put } from "@vercel/blob";
import { commitFiles, existsInRepo, isEphemeral, readFromRepo, useGithub } from "@/lib/githubStore";

/**
 * 칼럼 저장소 — 우선순위는 GitHub > Vercel Blob > 로컬 파일
 *
 * - GITHUB_TOKEN·GITHUB_REPO 가 있으면 글·이미지를 레포에 커밋한다(권장).
 *   읽기는 배포된 번들의 content/columns 를 그대로 쓰므로 외부 호출이 없다.
 * - BLOB_READ_WRITE_TOKEN 만 있으면 기존 Vercel Blob 방식으로 동작한다.
 *   (무료 플랜 operation 한도를 넘기면 스토어가 정지되니 GitHub 방식을 권장)
 * - 둘 다 없으면 로컬 개발용으로 content/ 아래 파일에 저장한다.
 */
const columnsDirectory = path.join(process.cwd(), "content/columns");
export const uploadsDirectory = path.join(process.cwd(), "content/uploads");
const BLOB_PREFIX = "columns/";
/** GitHub 모드에서 글·이미지가 놓이는 레포 경로 */
const REPO_COLUMNS = "content/columns";
const REPO_UPLOADS = "public/uploads";
const useBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

/** 본문에 넣을 수 있는 이미지 장수 (썸네일 1장 + 본문 4장 = 총 5장) */
export const MAX_BODY_IMAGES = 4;
export const MAX_IMAGES = MAX_BODY_IMAGES + 1;

export type ColumnMeta = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  tags: string[];
  thumbnail?: string;
  /** 본문 삽입용 이미지 URL (최대 4장) */
  images: string[];
  /** 공개 예정 일시 (ISO8601, KST 오프셋 포함) */
  publishAt: string;
  /** 아직 공개 시각이 되지 않은 예약글 */
  scheduled: boolean;
};

export type Column = ColumnMeta & {
  content: string; // rendered HTML
  raw: string; // markdown source
};

function ensureDirs() {
  if (!fs.existsSync(columnsDirectory)) fs.mkdirSync(columnsDirectory, { recursive: true });
  if (!fs.existsSync(uploadsDirectory)) fs.mkdirSync(uploadsDirectory, { recursive: true });
}

// ── 예약 발행 시각 (KST 기준) ───────────────────────────────────

const KST_OFFSET = "+09:00";

/** "2026-09-20T14:00" (datetime-local, KST) → "2026-09-20T14:00:00+09:00" */
export function normalizePublishAt(value: string | undefined, fallbackDate?: string): string {
  const raw = (value || "").trim();
  if (raw) {
    // 이미 오프셋/Z 가 붙어 있으면 그대로 사용
    if (/[Z+]|-\d{2}:\d{2}$/.test(raw.slice(10))) {
      const d = new Date(raw);
      if (!Number.isNaN(d.getTime())) return raw;
    }
    const m = raw.match(/^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2})(?::(\d{2}))?)?$/);
    if (m) {
      const [, day, time = "00:00", sec = "00"] = m;
      return `${day}T${time}:${sec}${KST_OFFSET}`;
    }
  }
  const day = (fallbackDate || new Date().toISOString().slice(0, 10)).slice(0, 10);
  return `${day}T00:00:00${KST_OFFSET}`;
}

/** publishAt → "YYYY-MM-DD" (KST 기준 날짜) */
export function publishDate(publishAt: string): string {
  const d = new Date(publishAt);
  if (Number.isNaN(d.getTime())) return publishAt.slice(0, 10);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/** publishAt → datetime-local 입력값 "YYYY-MM-DDTHH:mm" (KST) */
export function toDateTimeLocal(publishAt: string): string {
  const d = new Date(publishAt);
  if (Number.isNaN(d.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

/** 예약 시각을 사람이 읽는 형태로 — "2026년 9월 20일 오후 2:00" */
export function formatPublishAt(publishAt: string): string {
  const d = new Date(publishAt);
  if (Number.isNaN(d.getTime())) return publishAt;
  return d.toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const isScheduled = (publishAt: string) => {
  const t = new Date(publishAt).getTime();
  return !Number.isNaN(t) && t > Date.now();
};

// ── frontmatter ↔ 메타 ─────────────────────────────────────────

function toMeta(slug: string, data: Record<string, unknown>): ColumnMeta {
  const date = String(data.date ?? "");
  const publishAt = normalizePublishAt(data.publishAt ? String(data.publishAt) : undefined, date);
  return {
    slug,
    title: String(data.title ?? ""),
    summary: String(data.summary ?? ""),
    category: String(data.category ?? "일반"),
    date: date || publishDate(publishAt),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    thumbnail: data.thumbnail ? String(data.thumbnail) : undefined,
    images: Array.isArray(data.images) ? data.images.map(String).slice(0, MAX_BODY_IMAGES) : [],
    publishAt,
    scheduled: isScheduled(publishAt),
  };
}

const isValidSlug = (slug: string) => /^[\p{L}\p{N}-]+$/u.test(slug);

// ── Blob 접근 (list() 없이 고정 URL 로 직접 읽기) ───────────────
//
// Vercel Blob 의 advanced operation(list·put·del·copy)은 Hobby 플랜에서 월 2,000회뿐이다.
// 예전 구현은 페이지를 열 때마다 list() 를 불러 방문 1회당 1~2회를 소모했고, 그 때문에
// 스토어가 한도 초과로 정지됐다. 이제 목록은 columns/index.json 한 파일로 관리하고
// 본문은 공개 URL 로 직접 fetch 한다 — 읽기는 데이터 전송(월 10GB)만 쓰고
// advanced operation 은 글을 쓸 때만(글 1건당 2회) 소모한다.

const INDEX_PATH = "columns/index.json";

type IndexEntry = {
  slug: string;
  /** 마지막 저장 시각 — CDN 캐시 우회용 쿼리스트링에 사용 */
  updatedAt: string;
  /** frontmatter 원본 */
  data: Record<string, unknown>;
};

/** 공개 블롭 호스트 — 토큰(vercel_blob_rw_<storeId>_<secret>)에서 유도 */
function blobBase(): string {
  const explicit = process.env.BLOB_BASE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const storeId = (process.env.BLOB_READ_WRITE_TOKEN || "").split("_")[3];
  if (!storeId) throw new Error("BLOB_READ_WRITE_TOKEN 형식을 해석할 수 없습니다. BLOB_BASE_URL 을 지정해 주세요.");
  return `https://${storeId.toLowerCase()}.public.blob.vercel-storage.com`;
}

function blobUrl(pathname: string, version?: string): string {
  const encoded = pathname.split("/").map(encodeURIComponent).join("/");
  return `${blobBase()}/${encoded}${version ? `?v=${encodeURIComponent(version)}` : ""}`;
}

/**
 * 공개 URL 직접 fetch — 블롭 operation 을 소모하지 않는다.
 * 없으면 null, 스토어 정지(403) 등 그 외 실패는 예외.
 */
async function fetchBlobText(pathname: string, version?: string): Promise<string | null> {
  const res = await fetch(blobUrl(pathname, version), { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(
      `Vercel Blob 저장소에 접근할 수 없습니다 (HTTP ${res.status}). Vercel 대시보드에서 Blob 스토어 상태(사용량 한도)를 확인해 주세요.`
    );
  }
  return res.text();
}

async function readIndex(): Promise<IndexEntry[] | null> {
  let raw: string | null;
  try {
    raw = await fetchBlobText(INDEX_PATH);
  } catch (e) {
    // 스토어 정지·네트워크 오류 등 — 페이지는 비우고 살려 둔다
    console.error("[columns] index.json 읽기 실패:", e);
    return null;
  }
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.entries) ? (parsed.entries as IndexEntry[]) : null;
  } catch {
    console.error("[columns] index.json 을 해석할 수 없습니다. 재색인이 필요합니다.");
    return null;
  }
}

/** advanced operation 1회 */
async function writeIndex(entries: IndexEntry[]) {
  await put(INDEX_PATH, JSON.stringify({ version: 1, updatedAt: new Date().toISOString(), entries }, null, 0), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json; charset=utf-8",
    cacheControlMaxAge: 60,
  });
}

async function upsertIndex(slug: string, file: string) {
  const entries = (await readIndex()) ?? [];
  const entry: IndexEntry = { slug, updatedAt: new Date().toISOString(), data: matter(file).data };
  const i = entries.findIndex((e) => e.slug === slug);
  if (i >= 0) entries[i] = entry;
  else entries.push(entry);
  await writeIndex(entries);
}

/**
 * index.json 이 없으면 list() 로 한 번만 자동 재생성한다.
 * (스토어 정지가 풀리는 순간 첫 방문에서 스스로 복구되도록 — 실패하면 5분간 재시도 안 함)
 */
let reindexAttemptedAt = 0;
let reindexInFlight: Promise<IndexEntry[] | null> | null = null;

async function readIndexOrHeal(): Promise<IndexEntry[] | null> {
  const entries = await readIndex();
  if (entries) return entries;
  if (reindexInFlight) return reindexInFlight;
  if (Date.now() - reindexAttemptedAt < 5 * 60 * 1000) return null;
  reindexAttemptedAt = Date.now();
  reindexInFlight = (async () => {
    try {
      console.warn("[columns] index.json 이 없어 자동 재색인을 시도합니다.");
      await reindexColumns();
      return await readIndex();
    } catch (e) {
      console.error("[columns] 자동 재색인 실패:", e);
      return null;
    } finally {
      reindexInFlight = null;
    }
  })();
  return reindexInFlight;
}

async function removeFromIndex(slug: string) {
  const entries = await readIndex();
  if (!entries) return;
  await writeIndex(entries.filter((e) => e.slug !== slug));
}

/**
 * list() 로 index.json 을 한 번에 다시 만든다 (advanced operation 사용).
 * 스토어를 새로 연결했거나 색인이 깨졌을 때 관리자가 1회만 실행한다.
 */
export async function reindexColumns(): Promise<{ count: number }> {
  if (!useBlob()) return { count: 0 };
  const entries: IndexEntry[] = [];
  let cursor: string | undefined;
  do {
    const res = await list({ prefix: BLOB_PREFIX, cursor, limit: 1000 });
    for (const b of res.blobs) {
      if (!b.pathname.endsWith(".md")) continue;
      const slug = decodeURIComponent(b.pathname.slice(BLOB_PREFIX.length, -3));
      const file = await fetchBlobText(b.pathname);
      if (file === null) continue;
      entries.push({ slug, updatedAt: new Date(b.uploadedAt).toISOString(), data: matter(file).data });
    }
    cursor = res.hasMore ? res.cursor : undefined;
  } while (cursor);
  await writeIndex(entries);
  return { count: entries.length };
}

// ── 원본 md 읽기/쓰기 (저장 방식별) ─────────────────────────────

/** 목록용 메타 — blob 모드에서는 index.json 하나만 읽는다 (본문 fetch 없음) */
async function readAllMeta(): Promise<ColumnMeta[]> {
  if (useBlob() && !useGithub()) {
    const entries = await readIndexOrHeal();
    if (entries) return entries.map((e) => toMeta(e.slug, e.data));
    // 스토어 정지·색인 손상 등 — 레포에 커밋된 사본이라도 보여 준다.
    // (2026-09 에 Blob 스토어가 한도 초과로 정지되면서 칼럼이 통째로 사라진 적이 있다)
    console.error("[columns] Blob 색인을 읽지 못해 content/columns 사본으로 대체합니다.");
  }
  if (!fs.existsSync(columnsDirectory)) return [];
  return fs
    .readdirSync(columnsDirectory)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      const file = fs.readFileSync(path.join(columnsDirectory, f), "utf8");
      return toMeta(slug, matter(file).data);
    });
}

async function readRaw(slug: string): Promise<string | null> {
  if (!isValidSlug(slug)) return null;
  if (useGithub()) {
    const fullPath = path.join(columnsDirectory, `${slug}.md`);
    if (fs.existsSync(fullPath)) return fs.readFileSync(fullPath, "utf8");
    // 방금 발행해 아직 재배포 전인 글은 번들에 없다 — 레포에서 바로 읽어 준다
    return readFromRepo(`${REPO_COLUMNS}/${slug}.md`);
  }
  const fullPath = path.join(columnsDirectory, `${slug}.md`);
  const fromDisk = () => (fs.existsSync(fullPath) ? fs.readFileSync(fullPath, "utf8") : null);

  if (useBlob()) {
    const entries = await readIndexOrHeal();
    const version = entries?.find((e) => e.slug === slug)?.updatedAt;
    try {
      const file = await fetchBlobText(`${BLOB_PREFIX}${slug}.md`, version);
      if (file !== null) return file;
    } catch (e) {
      // 스토어 정지 등 — 레포에 커밋된 사본으로 대체한다
      console.error(`[columns] ${slug} 블롭 읽기 실패, content/columns 사본을 씁니다:`, e);
    }
    return fromDisk();
  }
  return fromDisk();
}

async function existsRaw(slug: string): Promise<boolean> {
  if (!isValidSlug(slug)) return false;
  if (useGithub()) {
    if (fs.existsSync(path.join(columnsDirectory, `${slug}.md`))) return true;
    return existsInRepo(`${REPO_COLUMNS}/${slug}.md`);
  }
  const onDisk = () => fs.existsSync(path.join(columnsDirectory, `${slug}.md`));
  if (useBlob()) {
    const entries = await readIndexOrHeal();
    if (entries?.some((e) => e.slug === slug)) return true;
    // 색인에 없더라도 실제 파일이 있을 수 있으므로 URL 로 한 번 더 확인
    try {
      if ((await fetchBlobText(`${BLOB_PREFIX}${slug}.md`)) !== null) return true;
    } catch (e) {
      console.error(`[columns] ${slug} 블롭 확인 실패:`, e);
    }
    return onDisk();
  }
  return onDisk();
}

/** advanced operation 2회 (md 1 + index 1) */
async function writeRaw(slug: string, file: string) {
  if (useGithub()) {
    await commitFiles(
      [{ path: `${REPO_COLUMNS}/${slug}.md`, content: file, encoding: "utf-8" }],
      [],
      `content: 칼럼 저장 — ${slug}`
    );
    return;
  }
  if (isEphemeral()) {
    throw new Error(
      "저장소가 연결되어 있지 않습니다. 배포 환경에서는 글이 저장되지 않으니 GITHUB_TOKEN·GITHUB_REPO 환경변수를 설정해 주세요."
    );
  }
  if (useBlob()) {
    await put(`${BLOB_PREFIX}${slug}.md`, file, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "text/markdown; charset=utf-8",
      cacheControlMaxAge: 60,
    });
    await upsertIndex(slug, file);
    return;
  }
  ensureDirs();
  fs.writeFileSync(path.join(columnsDirectory, `${slug}.md`), file, "utf8");
}

async function removeRaw(slug: string): Promise<boolean> {
  if (useGithub()) {
    if (!(await existsRaw(slug))) return false;
    await commitFiles([], [`${REPO_COLUMNS}/${slug}.md`], `content: 칼럼 삭제 — ${slug}`);
    return true;
  }
  if (useBlob()) {
    if (!(await existsRaw(slug))) return false;
    await del(`${BLOB_PREFIX}${slug}.md`);
    await removeFromIndex(slug);
    return true;
  }
  const fullPath = path.join(columnsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return false;
  fs.unlinkSync(fullPath);
  return true;
}

// ── 공개 API ────────────────────────────────────────────────────

type ListOptions = {
  /** 관리자 화면에서만 true — 예약글(공개 시각 전)도 함께 반환 */
  includeScheduled?: boolean;
};

export async function getAllColumns(options: ListOptions = {}): Promise<ColumnMeta[]> {
  const columns = await readAllMeta();
  const visible = options.includeScheduled ? columns : columns.filter((c) => !c.scheduled);
  return visible.sort((a, b) => new Date(b.publishAt).getTime() - new Date(a.publishAt).getTime());
}

export async function getColumnBySlug(slug: string): Promise<Column | null> {
  const file = await readRaw(slug);
  if (file === null) return null;
  const { data, content } = matter(file);
  const htmlContent = await marked(content);
  return { ...toMeta(slug, data), content: htmlContent, raw: content };
}

/** 제목 → URL 슬러그 (한글 유지, 공백·특수문자 제거) */
export function slugify(title: string): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return base || `column-${Date.now()}`;
}

export type NewColumnInput = {
  title: string;
  summary: string;
  category: string;
  tags: string[];
  body: string;
  /** 새 URL, 빈 문자열/null = 썸네일 제거, undefined = 기존 유지 */
  thumbnail?: string | null;
  images?: string[];
  /** datetime-local("YYYY-MM-DDTHH:mm", KST) 또는 ISO8601 */
  publishAt?: string;
};

function serialize(input: NewColumnInput, publishAt: string, thumbnail?: string) {
  const images = (input.images ?? []).slice(0, MAX_BODY_IMAGES);
  return matter.stringify(input.body.replace(/\r\n/g, "\n").trim() + "\n", {
    title: input.title,
    summary: input.summary,
    category: input.category,
    date: publishDate(publishAt),
    publishAt,
    tags: input.tags,
    ...(thumbnail ? { thumbnail } : {}),
    ...(images.length ? { images } : {}),
  });
}

export async function createColumn(input: NewColumnInput): Promise<ColumnMeta> {
  const base = slugify(input.title);
  let slug = base;
  let i = 2;
  while (await existsRaw(slug)) slug = `${base}-${i++}`;
  const publishAt = normalizePublishAt(input.publishAt);
  const thumbnail = input.thumbnail || undefined;
  await writeRaw(slug, serialize(input, publishAt, thumbnail));
  return {
    slug,
    title: input.title,
    summary: input.summary,
    category: input.category,
    date: publishDate(publishAt),
    tags: input.tags,
    thumbnail,
    images: (input.images ?? []).slice(0, MAX_BODY_IMAGES),
    publishAt,
    scheduled: isScheduled(publishAt),
  };
}

export async function updateColumn(slug: string, input: NewColumnInput): Promise<ColumnMeta | null> {
  const existing = await readRaw(slug);
  if (existing === null) return null;
  const { data } = matter(existing);
  const previous = toMeta(slug, data);
  const publishAt = input.publishAt ? normalizePublishAt(input.publishAt) : previous.publishAt;
  const thumbnail = input.thumbnail === undefined ? previous.thumbnail : input.thumbnail || undefined;
  const images = input.images ?? previous.images;
  await writeRaw(slug, serialize({ ...input, images }, publishAt, thumbnail));
  return {
    slug,
    title: input.title,
    summary: input.summary,
    category: input.category,
    date: publishDate(publishAt),
    tags: input.tags,
    thumbnail,
    images: images.slice(0, MAX_BODY_IMAGES),
    publishAt,
    scheduled: isScheduled(publishAt),
  };
}

export async function deleteColumn(slug: string): Promise<boolean> {
  if (!isValidSlug(slug)) return false;
  return removeRaw(slug);
}

/** 업로드 이미지 저장 → 공개 URL 반환 (Blob URL 또는 /api/uploads/파일명) */
export async function saveUpload(file: File): Promise<string> {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const allowed = ["jpg", "jpeg", "png", "webp", "gif"];
  if (!allowed.includes(ext)) throw new Error("이미지 파일(jpg, png, webp, gif)만 업로드할 수 있습니다.");
  if (file.size > 8 * 1024 * 1024) throw new Error("이미지는 8MB 이하만 업로드할 수 있습니다.");
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  if (useGithub()) {
    const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
    await commitFiles(
      [{ path: `${REPO_UPLOADS}/${name}`, content: base64, encoding: "base64" }],
      [],
      `content: 이미지 업로드 — ${name}`
    );
    // public/ 아래라 배포 후 정적 파일로 바로 서빙된다
    return `/uploads/${name}`;
  }
  if (isEphemeral()) {
    throw new Error(
      "저장소가 연결되어 있지 않습니다. 배포 환경에서는 이미지가 저장되지 않으니 GITHUB_TOKEN·GITHUB_REPO 환경변수를 설정해 주세요."
    );
  }
  if (useBlob()) {
    const blob = await put(`uploads/${name}`, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type || `image/${ext === "jpg" ? "jpeg" : ext}`,
    });
    return blob.url;
  }
  ensureDirs();
  fs.writeFileSync(path.join(uploadsDirectory, name), Buffer.from(await file.arrayBuffer()));
  return `/api/uploads/${name}`;
}

export function formatDate(date: string, style: "dot" | "long" = "dot"): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  if (style === "long") {
    return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
  }
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}`;
}
