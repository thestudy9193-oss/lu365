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

export type ColumnMeta = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  tags: string[];
  thumbnail?: string;
};

export type Column = ColumnMeta & {
  content: string; // rendered HTML
  raw: string; // markdown source
};

function ensureDirs() {
  if (!fs.existsSync(columnsDirectory)) fs.mkdirSync(columnsDirectory, { recursive: true });
  if (!fs.existsSync(uploadsDirectory)) fs.mkdirSync(uploadsDirectory, { recursive: true });
}

function toMeta(slug: string, data: Record<string, unknown>): ColumnMeta {
  return {
    slug,
    title: String(data.title ?? ""),
    summary: String(data.summary ?? ""),
    category: String(data.category ?? "일반"),
    date: String(data.date ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    thumbnail: data.thumbnail ? String(data.thumbnail) : undefined,
  };
}

const isValidSlug = (slug: string) => /^[\p{L}\p{N}-]+$/u.test(slug);

// ── 원본 md 읽기/쓰기 (저장 방식별) ─────────────────────────────

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
            const file = await (await fetch(b.url, { cache: "no-store" })).text();
            return { slug, file };
          })
      );
      out.push(...items);
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
    return (await fetch(b.url, { cache: "no-store" })).text();
  }
  const fullPath = path.join(columnsDirectory, `${slug}.md`);
  return fs.existsSync(fullPath) ? fs.readFileSync(fullPath, "utf8") : null;
}

async function existsRaw(slug: string): Promise<boolean> {
  return (await readRaw(slug)) !== null;
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

export async function getAllColumns(): Promise<ColumnMeta[]> {
  const raws = await readAllRaw();
  const columns = raws.map(({ slug, file }) => toMeta(slug, matter(file).data));
  return columns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
  thumbnail?: string;
  date?: string;
};

function serialize(input: NewColumnInput, date: string, thumbnail?: string) {
  return matter.stringify(input.body.replace(/\r\n/g, "\n").trim() + "\n", {
    title: input.title,
    summary: input.summary,
    category: input.category,
    date,
    tags: input.tags,
    ...(thumbnail ? { thumbnail } : {}),
  });
}

export async function createColumn(input: NewColumnInput): Promise<ColumnMeta> {
  const base = slugify(input.title);
  let slug = base;
  let i = 2;
  while (await existsRaw(slug)) slug = `${base}-${i++}`;
  const date = input.date || new Date().toISOString().slice(0, 10);
  await writeRaw(slug, serialize(input, date, input.thumbnail));
  return { slug, title: input.title, summary: input.summary, category: input.category, date, tags: input.tags, thumbnail: input.thumbnail };
}

export async function updateColumn(slug: string, input: NewColumnInput): Promise<ColumnMeta | null> {
  const existing = await readRaw(slug);
  if (existing === null) return null;
  const { data } = matter(existing);
  const date = input.date || String(data.date ?? new Date().toISOString().slice(0, 10));
  const thumbnail = input.thumbnail ?? (data.thumbnail ? String(data.thumbnail) : undefined);
  await writeRaw(slug, serialize(input, date, thumbnail));
  return { slug, title: input.title, summary: input.summary, category: input.category, date, tags: input.tags, thumbnail };
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
