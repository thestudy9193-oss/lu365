"use client";

import { marked } from "marked";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

type Initial = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  tags: string;
  body: string;
  thumbnail?: string;
  images: string[];
  /** datetime-local 형식 "YYYY-MM-DDTHH:mm" (KST) */
  publishAt: string;
  scheduled: boolean;
};

type Props = { categories: string[]; initial?: Initial; maxBodyImages: number };

const TEMPLATE = `## 이런 증상, 그냥 두어도 될까요?

첫 문단에서 독자가 겪는 불편함을 짚어주세요.

## 원인은 무엇일까요?

- 원인 1
- 원인 2

## 루원365한의원에서는 이렇게 진료합니다

**추나요법**, **약침**, **한약** 등 치료 방향을 설명해 주세요.

> 치료 결과는 개인의 체질과 상태에 따라 차이가 있을 수 있습니다.
`;

/** 현재 시각(KST) → datetime-local 입력값 */
function nowLocalKst(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

export default function ColumnEditor({ categories, initial, maxBodyImages }: Props) {
  const router = useRouter();
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [category, setCategory] = useState(initial?.category ?? categories[0]);
  const [tags, setTags] = useState(initial?.tags ?? "");
  const [body, setBody] = useState(initial?.body ?? TEMPLATE);
  const [thumbnail, setThumbnail] = useState<string | null>(initial?.thumbnail ?? null);
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [mode, setMode] = useState<"now" | "scheduled">(initial?.scheduled ? "scheduled" : "now");
  const [publishAt, setPublishAt] = useState(initial?.publishAt ?? nowLocalKst());
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState<"thumbnail" | "body" | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const html = useMemo(() => marked.parse(body) as string, [body]);

  const upload = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.set("file", file);
    const res = await fetch("/api/uploads", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      setError(data.error || "이미지 업로드에 실패했습니다.");
      return null;
    }
    return data.url as string;
  };

  const onThumb = async (file: File | null) => {
    if (!file) return;
    setError("");
    setUploading("thumbnail");
    const url = await upload(file);
    if (url) setThumbnail(url);
    setUploading(null);
  };

  const onBodyImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError("");
    const room = maxBodyImages - images.length;
    if (room <= 0) {
      setError(`본문 이미지는 최대 ${maxBodyImages}장까지 넣을 수 있습니다.`);
      return;
    }
    setUploading("body");
    const picked = Array.from(files).slice(0, room);
    const urls: string[] = [];
    for (const f of picked) {
      const url = await upload(f);
      if (url) urls.push(url);
    }
    if (urls.length) setImages((prev) => [...prev, ...urls].slice(0, maxBodyImages));
    if (files.length > room) setError(`본문 이미지는 최대 ${maxBodyImages}장까지라 ${picked.length}장만 등록했습니다.`);
    setUploading(null);
  };

  /** 커서 위치에 마크다운 이미지 삽입 */
  const insertImage = (url: string) => {
    const snippet = `\n\n![${title || "이미지"}](${url})\n\n`;
    const el = bodyRef.current;
    if (!el) {
      setBody((prev) => prev + snippet);
      return;
    }
    const start = el.selectionStart ?? body.length;
    const end = el.selectionEnd ?? body.length;
    const next = body.slice(0, start) + snippet + body.slice(end);
    setBody(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + snippet.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((u) => u !== url));
    // 본문에 삽입돼 있으면 함께 제거
    setBody((prev) =>
      prev
        .split("\n")
        .filter((line) => !(line.trim().startsWith("![") && line.includes(`](${url})`)))
        .join("\n")
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("제목과 본문을 입력해 주세요.");
      return;
    }
    if (mode === "scheduled" && !publishAt) {
      setError("예약 발행 일시를 선택해 주세요.");
      return;
    }
    setSaving(true);
    setError("");
    const fd = new FormData();
    fd.set("title", title.trim());
    fd.set("summary", summary.trim());
    fd.set("category", category);
    fd.set("tags", tags);
    fd.set("body", body);
    fd.set("publishAt", mode === "scheduled" ? publishAt : nowLocalKst());
    fd.set("thumbnail", thumbnail ?? "");
    fd.set("images", JSON.stringify(images));

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
        <div>
          <label className={label} style={{ color: "#9E8676" }}>카테고리</label>
          <select className={field} style={fieldStyle} value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* 발행 시점 */}
        <div>
          <label className={label} style={{ color: "#9E8676" }}>발행</label>
          <div className="flex gap-1 mb-2">
            {([["now", "지금 바로"], ["scheduled", "예약 발행"]] as const).map(([value, text]) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className="flex-1 text-[13px] py-2.5"
                style={{
                  backgroundColor: mode === value ? "#2A1C14" : "transparent",
                  color: mode === value ? "#FAF6F1" : "#705C4F",
                  border: "1px solid rgba(42,28,20,0.18)",
                }}
              >
                {text}
              </button>
            ))}
          </div>
          {mode === "scheduled" && (
            <>
              <input
                type="datetime-local"
                className={field}
                style={fieldStyle}
                value={publishAt}
                onChange={(e) => setPublishAt(e.target.value)}
              />
              <p className="mt-2 text-xs leading-relaxed" style={{ color: "#9E8676" }}>
                한국 시간 기준입니다. 이 시각이 지나면 목록·검색에 자동으로 공개됩니다. 그전까지는 관리자에게만 보입니다.
              </p>
            </>
          )}
        </div>

        <div>
          <label className={label} style={{ color: "#9E8676" }}>태그 (쉼표로 구분)</label>
          <input className={field} style={fieldStyle} value={tags} onChange={(e) => setTags(e.target.value)} placeholder="교통사고, 후유증, 추나" />
        </div>

        {/* 썸네일 */}
        <div>
          <label className={label} style={{ color: "#9E8676" }}>대표 이미지 (썸네일)</label>
          <label className="block cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onThumb(e.target.files?.[0] ?? null)} />
            <div className="relative aspect-[16/10] overflow-hidden grid place-items-center text-xs text-center px-4" style={{ border: "1px dashed rgba(42,28,20,0.3)", backgroundColor: "#F0E8DE", color: "#9E8676" }}>
              {thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumbnail} alt="썸네일 미리보기" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <span>{uploading === "thumbnail" ? "업로드 중…" : "클릭해서 이미지 선택 (jpg · png · webp, 8MB 이하)"}</span>
              )}
            </div>
          </label>
          {thumbnail && (
            <button type="button" onClick={() => setThumbnail(null)} className="mt-2 text-xs" style={{ color: "#9E8676" }}>
              대표 이미지 제거
            </button>
          )}
        </div>

        {/* 본문 이미지 */}
        <div>
          <label className={label} style={{ color: "#9E8676" }}>
            본문 이미지 ({images.length}/{maxBodyImages})
          </label>
          {images.length > 0 && (
            <ul className="grid grid-cols-2 gap-2 mb-2">
              {images.map((url) => (
                <li key={url} className="relative">
                  <div className="relative aspect-[16/10] overflow-hidden" style={{ backgroundColor: "#F0E8DE" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="본문 이미지" className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="flex gap-1 mt-1">
                    <button type="button" onClick={() => insertImage(url)} className="flex-1 text-[11px] py-1.5" style={{ backgroundColor: "#2A1C14", color: "#FAF6F1" }}>
                      본문에 삽입
                    </button>
                    <button type="button" onClick={() => removeImage(url)} className="text-[11px] px-2 py-1.5" style={{ border: "1px solid rgba(42,28,20,0.2)", color: "#705C4F" }}>
                      삭제
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {images.length < maxBodyImages && (
            <label className="block cursor-pointer">
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => onBodyImages(e.target.files)} />
              <div className="grid place-items-center text-xs py-5" style={{ border: "1px dashed rgba(42,28,20,0.3)", backgroundColor: "#F0E8DE", color: "#9E8676" }}>
                {uploading === "body" ? "업로드 중…" : `+ 이미지 추가 (최대 ${maxBodyImages}장)`}
              </div>
            </label>
          )}
          <p className="mt-2 text-xs leading-relaxed" style={{ color: "#9E8676" }}>
            올린 뒤 <strong>본문에 삽입</strong>을 누르면 커서 위치에 이미지가 들어갑니다.
          </p>
        </div>

        {error && <p className="text-sm p-3" style={{ backgroundColor: "#fdecea", color: "#c0392b" }}>{error}</p>}

        <div className="flex gap-2 pt-2">
          <button type="button" onClick={() => router.back()} className="btn-outline-ink flex-1 !py-3 text-sm">취소</button>
          <button type="submit" disabled={saving || uploading !== null} className="btn-primary flex-1 !py-3 text-sm disabled:opacity-50">
            {saving ? "저장 중…" : initial ? "수정 저장" : mode === "scheduled" ? "예약 발행" : "발행하기"}
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
            ref={bodyRef}
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
