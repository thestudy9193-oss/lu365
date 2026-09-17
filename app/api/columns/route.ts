import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isEditor } from "@/lib/auth";
import { createColumn } from "@/lib/columns";
import { parseColumnForm } from "@/lib/columnForm";

export async function POST(request: Request) {
  if (!(await isEditor())) {
    return NextResponse.json({ ok: false, error: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const parsed = await parseColumnForm(form);
    if ("error" in parsed) {
      return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
    }

    const meta = await createColumn(parsed.input);
    revalidatePath("/");
    revalidatePath("/columns");
    revalidatePath(`/columns/${meta.slug}`);
    return NextResponse.json({ ok: true, slug: meta.slug, scheduled: meta.scheduled, publishAt: meta.publishAt });
  } catch (e) {
    const message = e instanceof Error ? e.message : "저장 중 오류가 발생했습니다.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
