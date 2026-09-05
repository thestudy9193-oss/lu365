"use client";

import { marked } from "marked";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Initial = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  tags: string;
  date: string;
  body: string;
  thumbnail?: string;
};

type Props = { categories: string[]; initial?: Initial };

const TEMPLATE = `## 이런 증상, 그냥 두어도 될까요?

첫 문단에서 독자가 겪는 불편함을 짚어주세요.

## 원인은 무엇일까요?

- 원인 1
- 원인 2

## 루원365한의원에서는 이렇게 진료합니다

**추나요법**, **약침**, **한약** 등 치료 방향을 설명해 주세요.

> 치료 결과는 개인의 체질과 상태에 따라 차이가 있을 수 있습니다.
`;

export default function ColumnEditor({ categories, initial }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [category, setCategory] = useState(initial?.category ?? categories[0]);
  const [tags, setTags] = useState(initial?.tags ?? "");
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10));
  const [body, setBody] = useState(initial?.body ?? TEMPLATE);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initial?.thumbnail ?? null);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const html = useMemo(() => marked.parse(body) as string, [body]);

  const onThumb = (f: File | null) => {
    setThumbnail(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("제목과 본문을 입력해 주세요.");
      return;
    }
    setSaving(true);
    setError("");
    const fd = new FormData();
    fd.set("title", title.trim());
    fd.set("summary", summary.trim());
    fd.set("category", category);
    fd.set("tags", tags);
    fd.set("date", date);
    fd.set("body", body);
    if (thumbnail) fd.set("thumbnail", thumbnail);

    const url = initial ? `/api/columns/${encodeURIComponent(initial.slug)}` : "/api/columns";
    const res = await fetch(url, { method: initial ? "PUT" : "POST", body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      setError(data.error || "저장에 실패했습니다.");
      setSaving(false);
      return;
    }
    router.push(`/columns/${data.slug}`);
    router.refresh();
  };

  const field = "w-full px-4 py-3 text-[15px] outline-none focus:border-[#2A1C14] transition-colors";
  const fieldStyle = { border: "1px solid rgba(42,28,20,0.18)", backgroundColor: "#fff", color: "#2A1C14" };
  const label = "block text-xs tracking-wide mb-2";

  return (
    <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
      {/* 좌: 메타 */}
      <aside className="lg:col-span-4 space-y-5">
        <div>
          <label className={label} style={{ color: "#9E8676" }}>제목 *</label>
          <input className={field} style={fieldStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예) 교통사고 후 '이 증상' 나타난다면 확인하세요" required />
        </div>
        <div>
          <label className={label} style={{ color: "#9E8676" }}>요약 (목록에 표시)</label>
          <textarea className={field} style={{ ...fieldStyle, minHeight: 96 }} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="두세 문장으로 글의 핵심을 요약해 주세요." />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label} style={{ color: "#9E8676" }}>카테고리</label>
            <select className={field} style={fieldStyle} value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={label} style={{ color: "#9E8676" }}>날짜</label>
            <input type="date" className={field} style={fieldStyle} value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
        <div>
          <label className={label} style={{ color: "#9E8676" }}>태그 (쉼표로 구분)</label>
          <input className={field} style={fieldStyle} value={tags} onChange={(e) => setTags(e.target.value)} placeholder="교통사고, 후유증, 추나" />
        </div>
        <div>
          <label className={label} style={{ color: "#9E8676" }}>썸네일 이미지</label>
          <label className="block cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onThumb(e.target.files?.[0] ?? null)} />
            <div className="relative aspect-[16/10] overflow-hidden grid place-items-center text-xs" style={{ border: "1px dashed rgba(42,28,20,0.3)", backgroundColor: "#F0E8DE", color: "#9E8676" }}>
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="썸네일 미리보기" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <span>클릭해서 이미지 선택 (jpg · png · webp, 8MB 이하)</span>
              )}
            </div>
          </label>
          {preview && (
            <button type="button" onClick={() => { setThumbnail(null); setPreview(initial?.thumbnail ?? null); }} className="mt-2 text-xs" style={{ color: "#9E8676" }}>
              선택 취소
            </button>
          )}
        </div>

        {error && <p className="text-sm p-3" style={{ backgroundColor: "#fdecea", color: "#c0392b" }}>{error}</p>}

        <div className="flex gap-2 pt-2">
          <button type="button" onClick={() => router.back()} className="btn-outline-ink flex-1 !py-3 text-sm">취소</button>
          <button type="submit" disabled={saving} className="btn-primary flex-1 !py-3 text-sm disabled:opacity-50">
            {saving ? "저장 중…" : initial ? "수정 저장" : "발행하기"}
          </button>
        </div>
      </aside>

      {/* 우: 본문 */}
      <div className="lg:col-span-8 order-first lg:order-none">
        <div className="flex items-center gap-1 mb-2">
          {(["write", "preview"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="text-sm px-4 py-2"
              style={{ backgroundColor: tab === t ? "#2A1C14" : "transparent", color: tab === t ? "#FAF6F1" : "#705C4F", border: "1px solid rgba(42,28,20,0.15)" }}
            >
              {t === "write" ? "작성" : "미리보기"}
            </button>
          ))}
          <span className="ml-auto text-xs" style={{ color: "#9E8676" }}>{body.length.toLocaleString()}자</span>
        </div>

        {tab === "write" ? (
          <textarea
            className={`${field} font-mono text-[14px] leading-relaxed`}
            style={{ ...fieldStyle, minHeight: 380, resize: "vertical" }}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            spellCheck={false}
          />
        ) : (
          <div className="p-6 sm:p-8 min-h-[380px] sm:min-h-[620px]" style={{ backgroundColor: "#fff", border: "1px solid rgba(42,28,20,0.18)" }}>
            <h1 className="font-serif-kr text-2xl sm:text-3xl font-semibold mb-5 sm:mb-6" style={{ color: "#2A1C14" }}>{title || "제목"}</h1>
            <div className="prose-column" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        )}
      </div>
    </form>
  );
}
