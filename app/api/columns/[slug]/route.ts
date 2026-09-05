import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isEditor } from "@/lib/auth";
import { deleteColumn, saveUpload, updateColumn } from "@/lib/columns";

type Ctx = { params: Promise<{ slug: string }> };

export async function PUT(request: Request, { params }: Ctx) {
  if (!(await isEditor())) {
    return NextResponse.json({ ok: false, error: "로그인이 필요합니다." }, { status: 401 });
  }
  const { slug } = await params;
  try {
    const form = await request.formData();
    const title = String(form.get("title") || "").trim();
    const summary = String(form.get("summary") || "").trim();
    const category = String(form.get("category") || "일반").trim();
    const body = String(form.get("body") || "").trim();
    const date = String(form.get("date") || "").trim();
    const tags = String(form.get("tags") || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (!title || !body) {
      return NextResponse.json({ ok: false, error: "제목과 본문은 필수입니다." }, { status: 400 });
    }
    let thumbnail: string | undefined;
    const file = form.get("thumbnail");
    if (file instanceof File && file.size > 0) thumbnail = await saveUpload(file);

    const meta = await updateColumn(decodeURIComponent(slug), { title, summary, category, tags, body, thumbnail, date: date || undefined });
    if (!meta) return NextResponse.json({ ok: false, error: "글을 찾을 수 없습니다." }, { status: 404 });
    revalidatePath("/");
    revalidatePath("/columns");
    revalidatePath(`/columns/${meta.slug}`);
    return NextResponse.json({ ok: true, slug: meta.slug });
  } catch (e) {
    const message = e instanceof Error ? e.message : "수정 중 오류가 발생했습니다.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Ctx) {
  if (!(await isEditor())) {
    return NextResponse.json({ ok: false, error: "로그인이 필요합니다." }, { status: 401 });
  }
  const { slug } = await params;
  const ok = await deleteColumn(decodeURIComponent(slug));
  if (!ok) return NextResponse.json({ ok: false, error: "글을 찾을 수 없습니다." }, { status: 404 });
  revalidatePath("/");
  revalidatePath("/columns");
  return NextResponse.json({ ok: true });
}
