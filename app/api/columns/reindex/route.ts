import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isEditor } from "@/lib/auth";
import { reindexColumns } from "@/lib/columns";

/** columns/index.json 재생성 — 스토어를 새로 붙였거나 색인이 깨졌을 때 1회만 */
export async function POST() {
  if (!(await isEditor())) {
    return NextResponse.json({ ok: false, error: "로그인이 필요합니다." }, { status: 401 });
  }
  try {
    const { count } = await reindexColumns();
    revalidatePath("/");
    revalidatePath("/columns");
    return NextResponse.json({ ok: true, count });
  } catch (e) {
    const message = e instanceof Error ? e.message : "재색인에 실패했습니다.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
