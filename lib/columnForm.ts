import { MAX_BODY_IMAGES, type NewColumnInput } from "@/lib/columns";

type Parsed = { input: NewColumnInput } | { error: string };

/** 글쓰기/수정 폼(FormData) → createColumn/updateColumn 입력값 */
export async function parseColumnForm(form: FormData): Promise<Parsed> {
  const title = String(form.get("title") || "").trim();
  const summary = String(form.get("summary") || "").trim();
  const category = String(form.get("category") || "일반").trim();
  const body = String(form.get("body") || "").trim();
  const publishAt = String(form.get("publishAt") || "").trim();
  const tags = String(form.get("tags") || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (!title || !body) return { error: "제목과 본문은 필수입니다." };

  // 이미지는 /api/uploads 에서 먼저 업로드하고 URL 만 전달받는다
  const hasThumbnailField = form.has("thumbnail");
  const thumbnail = hasThumbnailField ? String(form.get("thumbnail") || "").trim() : undefined;

  let images: string[] | undefined;
  if (form.has("images")) {
    try {
      const parsed = JSON.parse(String(form.get("images") || "[]"));
      if (!Array.isArray(parsed)) return { error: "본문 이미지 목록 형식이 올바르지 않습니다." };
      images = parsed.map(String).filter(Boolean).slice(0, MAX_BODY_IMAGES);
    } catch {
      return { error: "본문 이미지 목록 형식이 올바르지 않습니다." };
    }
  }

  return {
    input: { title, summary, category, tags, body, thumbnail, images, publishAt: publishAt || undefined },
  };
}
