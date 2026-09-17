import { NextResponse } from "next/server";
import { isEditor } from "@/lib/auth";
import { saveUpload } from "@/lib/columns";

/** 에디터에서 이미지 1장 업로드 → 공개 URL 반환 */
export async function POST(request: Request) {
  if (!(await isEditor())) {
    return NextResponse.json({ ok: false, error: "로그인이 필요합니다." }, { status: 401 });
  }
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ ok: false, error: "이미지 파일을 선택해 주세요." }, { status: 400 });
    }
    const url = await saveUpload(file);
    return NextResponse.json({ ok: true, url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "업로드에 실패했습니다.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
