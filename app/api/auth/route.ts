import { NextResponse } from "next/server";
import { AUTH_COOKIE, checkPassword, cookieOptions, expectedToken, verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const token = cookie.match(new RegExp(`${AUTH_COOKIE}=([^;]+)`))?.[1];
  return NextResponse.json({ authenticated: verifyToken(token) });
}

export async function POST(request: Request) {
  const { password } = (await request.json().catch(() => ({}))) as { password?: string };
  if (!process.env.COLUMN_PASSWORD) {
    return NextResponse.json(
      { ok: false, error: "서버에 COLUMN_PASSWORD 환경변수가 설정되지 않았습니다." },
      { status: 500 }
    );
  }
  if (!password || !checkPassword(password)) {
    return NextResponse.json({ ok: false, error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, expectedToken(), cookieOptions());
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
  return res;
}
