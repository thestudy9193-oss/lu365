"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Props = { authenticated: boolean };

/** 우측 상단 '글쓰기' 버튼 — 비밀번호 확인 후 /columns/write 이동 */
export default function WriteButton({ authenticated }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleClick = () => {
    if (authenticated) {
      router.push("/columns/write");
      return;
    }
    setError("");
    setPassword("");
    setOpen(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "비밀번호가 올바르지 않습니다.");
        setLoading(false);
        return;
      }
      setOpen(false);
      router.push("/columns/write");
      router.refresh();
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.refresh();
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {authenticated && (
          <button onClick={logout} className="text-xs px-3 py-2 transition-opacity hover:opacity-70" style={{ color: "#9E8676" }}>
            로그아웃
          </button>
        )}
        <button onClick={handleClick} className="btn-primary !py-3 !px-5 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          글쓰기
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center px-4"
          style={{ backgroundColor: "rgba(32,21,21,0.6)", backdropFilter: "blur(6px)" }}
          onClick={() => setOpen(false)}
        >
          <form
            onSubmit={submit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm p-6 sm:p-8"
            style={{ backgroundColor: "#FAF6F1", boxShadow: "0 24px 80px rgba(20,12,8,0.4)" }}
          >
            <p className="font-display italic text-xs mb-2" style={{ color: "#9E8676" }}>Editor Access</p>
            <h2 className="font-serif-kr text-xl sm:text-2xl font-semibold" style={{ color: "#2A1C14" }}>비밀번호를 입력해 주세요</h2>
            <p className="text-sm mt-2" style={{ color: "#705C4F" }}>건강 이야기 글 작성은 관리자만 가능합니다.</p>

            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              autoComplete="current-password"
              className="mt-5 sm:mt-6 w-full px-4 py-3.5 text-[16px] outline-none"
              style={{ border: `1px solid ${error ? "#c0392b" : "rgba(42,28,20,0.2)"}`, backgroundColor: "#fff", color: "#2A1C14" }}
            />
            {error && <p className="mt-2 text-xs" style={{ color: "#c0392b" }}>{error}</p>}

            <div className="mt-5 flex gap-2">
              <button type="button" onClick={() => setOpen(false)} className="btn-outline-ink flex-1 !py-3 text-sm">
                취소
              </button>
              <button type="submit" disabled={loading || !password} className="btn-primary flex-1 !py-3 text-sm disabled:opacity-50">
                {loading ? "확인 중…" : "확인"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
