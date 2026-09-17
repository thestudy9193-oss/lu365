import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isEditor } from "@/lib/auth";
import { deleteColumn, updateColumn } from "@/lib/columns";
import { parseColumnForm } from "@/lib/columnForm";

type Ctx = { params: Promise<{ slug: string }> };

export async function PUT(request: Request, { params }: Ctx) {
  if (!(await isEditor())) {
    return NextResponse.json({ ok: false, error: "로그인이 필요합니다." }, { status: 401 });
  }
  const { slug } = await params;
  try {
    const form = await request.formData();
    const parsed = await parseColumnForm(form);
    if ("error" in parsed) {
      return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
    }

    const meta = await updateColumn(decodeURIComponent(slug), parsed.input);
    if (!meta) return NextResponse.json({ ok: false, error: "글을 찾을 수 없습니다." }, { status: 404 });
    revalidatePath("/");
    revalidatePath("/columns");
    revalidatePath(`/columns/${meta.slug}`);
    return NextResponse.json({ ok: true, slug: meta.slug, scheduled: meta.scheduled, publishAt: meta.publishAt });
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
