"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EditorActions({ slug }: { slug: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    setBusy(true);
    const res = await fetch(`/api/columns/${encodeURIComponent(slug)}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/columns");
      router.refresh();
    } else {
      setBusy(false);
      setConfirming(false);
    }
  };

  return (
    <div className="flex items-center gap-2 text-xs">
      <Link href={`/columns/write?edit=${encodeURIComponent(slug)}`} className="px-3 py-1.5" style={{ border: "1px solid rgba(250,246,241,0.3)", color: "#FAF6F1" }}>
        수정
      </Link>
      {confirming ? (
        <>
          <button onClick={remove} disabled={busy} className="px-3 py-1.5" style={{ backgroundColor: "#c0392b", color: "#fff" }}>
            {busy ? "삭제 중…" : "정말 삭제"}
          </button>
          <button onClick={() => setConfirming(false)} className="px-3 py-1.5" style={{ color: "rgba(250,246,241,0.6)" }}>취소</button>
        </>
      ) : (
        <button onClick={() => setConfirming(true)} className="px-3 py-1.5" style={{ border: "1px solid rgba(250,246,241,0.3)", color: "rgba(250,246,241,0.7)" }}>
          삭제
        </button>
      )}
    </div>
  );
}
