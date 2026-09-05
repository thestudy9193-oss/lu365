import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const AUTH_COOKIE = "luwon_editor";
const MAX_AGE = 60 * 60 * 12; // 12시간

function secret() {
  return process.env.COLUMN_SECRET || process.env.COLUMN_PASSWORD || "luwon365-dev-secret";
}

export function expectedToken(): string {
  return createHmac("sha256", secret()).update("editor-session-v1").digest("hex");
}

export function checkPassword(input: string): boolean {
  const pw = process.env.COLUMN_PASSWORD;
  if (!pw) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(pw);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function verifyToken(token?: string | null): boolean {
  if (!token) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(expectedToken());
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isEditor(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(AUTH_COOKIE)?.value);
}

export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  };
}
