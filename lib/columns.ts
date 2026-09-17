import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { del, list, put } from "@vercel/blob";

/**
 * 칼럼 저장소
 * - BLOB_READ_WRITE_TOKEN 이 있으면(Vercel 배포) Vercel Blob에 저장
 * - 없으면(로컬 개발) content/columns, content/uploads 파일로 저장
 */
const columnsDirectory = path.join(process.cwd(), "content/columns");
export const uploadsDirectory = path.join(process.cwd(), "content/uploads");
const BLOB_PREFIX = "columns/";
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

// ── 원본 md 읽기/쓰기 (저장 방식별) ─────────────────────────────

/** Blob 저장소가 정지(billing 미활성)되면 CDN이 403 + "Your store is blocked" 본문을 돌려준다 */
async function fetchBlobText(url: string): Promise<string> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(
      `Vercel Blob 저장소에 접근할 수 없습니다 (HTTP ${res.status}). Vercel 대시보드에서 Blob 스토어 상태를 확인해 주세요.`
    );
  }
  return res.text();
}

async function readAllRaw(): Promise<{ slug: string; file: string }[]> {
  if (useBlob()) {
    const out: { slug: string; file: string }[] = [];
    let cursor: string | undefined;
    do {
      const res = await list({ prefix: BLOB_PREFIX, cursor, limit: 1000 });
      const items = await Promise.all(
        res.blobs
          .filter((b) => b.pathname.endsWith(".md"))
          .map(async (b) => {
            const slug = decodeURIComponent(b.pathname.slice(BLOB_PREFIX.length, -3));
            try {
              return { slug, file: await fetchBlobText(b.url) };
            } catch (e) {
              console.error(`[columns] ${slug} 읽기 실패:`, e);
              return null;
            }
          })
      );
      out.push(...items.filter((x): x is { slug: string; file: string } => x !== null));
      cursor = res.hasMore ? res.cursor : undefined;
    } while (cursor);
    return out;
  }
  if (!fs.existsSync(columnsDirectory)) return [];
  return fs
    .readdirSync(columnsDirectory)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ slug: f.replace(/\.md$/, ""), file: fs.readFileSync(path.join(columnsDirectory, f), "utf8") }));
}

async function readRaw(slug: string): Promise<string | null> {
  if (!isValidSlug(slug)) return null;
  if (useBlob()) {
    const res = await list({ prefix: `${BLOB_PREFIX}${slug}.md`, limit: 1 });
    const b = res.blobs.find((x) => x.pathname === `${BLOB_PREFIX}${slug}.md`);
    if (!b) return null;
    return fetchBlobText(b.url);
  }
  const fullPath = path.join(columnsDirectory, `${slug}.md`);
  return fs.existsSync(fullPath) ? fs.readFileSync(fullPath, "utf8") : null;
}

async function existsRaw(slug: string): Promise<boolean> {
  if (!isValidSlug(slug)) return false;
  if (useBlob()) {
    const res = await list({ prefix: `${BLOB_PREFIX}${slug}.md`, limit: 1 });
    return res.blobs.some((x) => x.pathname === `${BLOB_PREFIX}${slug}.md`);
  }
  return fs.existsSync(path.join(columnsDirectory, `${slug}.md`));
}

async function writeRaw(slug: string, file: string) {
  if (useBlob()) {
    await put(`${BLOB_PREFIX}${slug}.md`, file, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "text/markdown; charset=utf-8",
      cacheControlMaxAge: 60,
    });
    return;
  }
  ensureDirs();
  fs.writeFileSync(path.join(columnsDirectory, `${slug}.md`), file, "utf8");
}

async function removeRaw(slug: string): Promise<boolean> {
  if (useBlob()) {
    const res = await list({ prefix: `${BLOB_PREFIX}${slug}.md`, limit: 1 });
    const b = res.blobs.find((x) => x.pathname === `${BLOB_PREFIX}${slug}.md`);
    if (!b) return false;
    await del(b.url);
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
  const raws = await readAllRaw();
  const columns = raws.map(({ slug, file }) => toMeta(slug, matter(file).data));
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
