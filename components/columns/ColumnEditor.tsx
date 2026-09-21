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

/** 본문 목표 분량 (공백 제외) */
const TARGET_CHARS = 1500;

/** 글자색 팔레트 — 본문에 <span style="color:…"> 로 들어간다 */
const TEXT_COLORS = [
  { name: "포인트 그린", value: "#0f766e" },
  { name: "딥 브라운", value: "#2A1C14" },
  { name: "베이지 브라운", value: "#9E8676" },
  { name: "강조 레드", value: "#C0392B" },
  { name: "차분한 블루", value: "#2C5F8D" },
];

/** 형광펜 팔레트 — <mark style="background:…"> */
const HIGHLIGHTS = [
  { name: "노랑", value: "#FFF3BF" },
  { name: "민트", value: "#CCFBF1" },
  { name: "핑크", value: "#FFE3E3" },
  { name: "베이지", value: "#F0E8DE" },
];

/** 줄머리 표식(제목·인용구·목록)을 걷어내기 위한 패턴 */
const LINE_MARK = /^(#{1,6}\s+|>\s+|-\s+|\d+\.\s+)/;

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

/** 서식 버튼 하나 — 클릭해도 폼이 제출되지 않도록 type="button" 고정 */
function ToolButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className="text-[12px] px-2.5 h-6 transition-colors hover:bg-[#F0E8DE]"
      style={{ border: "1px solid rgba(42,28,20,0.15)", backgroundColor: "#fff", color: "#2A1C14" }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="w-px h-5 mx-1" style={{ backgroundColor: "rgba(42,28,20,0.12)" }} />;
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
  /** 공백 제외 글자수 — 네이버 블로그 기준과 동일하게 센다 */
  const charCount = useMemo(() => body.replace(/\s/g, "").length, [body]);
  const progress = Math.min(100, Math.round((charCount / TARGET_CHARS) * 100));

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

  // ── 본문 서식 도구 ──────────────────────────────────────────
  //
  // textarea 를 직접 편집한다. 선택 영역이 있으면 그 글에 적용하고,
  // 없으면 자리표시 문구를 넣은 뒤 그 부분을 선택 상태로 돌려준다.

  const edit = (make: (sel: { start: number; end: number }) => { text: string; start: number; end: number }) => {
    const el = bodyRef.current;
    if (!el) return;
    const next = make({ start: el.selectionStart ?? body.length, end: el.selectionEnd ?? body.length });
    setBody(next.text);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(next.start, next.end);
    });
  };

  /** 선택 영역을 before/after 로 감싼다 (굵게·색·형광펜) */
  const wrap = (before: string, after: string, placeholder = "내용") =>
    edit(({ start, end }) => {
      const picked = body.slice(start, end) || placeholder;
      const from = start + before.length;
      return {
        text: body.slice(0, start) + before + picked + after + body.slice(end),
        start: from,
        end: from + picked.length,
      };
    });

  /** 선택한 줄들의 머리에 표식을 붙인다 — 이미 같은 표식이면 해제(토글) */
  const prefixLines = (mark: string, placeholder = "내용") =>
    edit(({ start, end }) => {
      const lineStart = body.lastIndexOf("\n", start - 1) + 1;
      const found = body.indexOf("\n", end);
      const lineEnd = found === -1 ? body.length : found;
      const lines = (body.slice(lineStart, lineEnd) || placeholder).split("\n");
      const on = lines.every((l) => l.startsWith(mark));
      const next = lines
        .map((l) => (on ? l.slice(mark.length) : mark + l.replace(LINE_MARK, "")))
        .join("\n");
      return {
        text: body.slice(0, lineStart) + next + body.slice(lineEnd),
        start: lineStart,
        end: lineStart + next.length,
      };
    });

  /** 커서 자리에 블록을 통째로 넣는다 (구분선 등) */
  const insertBlock = (block: string) =>
    edit(({ start, end }) => {
      const snippet = `\n\n${block}\n\n`;
      const pos = start + snippet.length;
      return { text: body.slice(0, start) + snippet + body.slice(end), start: pos, end: pos };
    });

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
          <span className="ml-auto text-xs" style={{ color: charCount >= TARGET_CHARS ? "#0f766e" : "#9E8676" }}>
            공백 제외 <strong>{charCount.toLocaleString()}</strong>자 / 목표 {TARGET_CHARS.toLocaleString()}자
          </span>
        </div>

        {/* 목표 분량 진행바 */}
        <div className="h-1 mb-3" style={{ backgroundColor: "#F0E8DE" }}>
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${progress}%`, backgroundColor: charCount >= TARGET_CHARS ? "#0f766e" : "#C8A882" }}
          />
        </div>

        {tab === "write" && (
          <div className="flex flex-wrap items-center gap-1 mb-2 p-2" style={{ border: "1px solid rgba(42,28,20,0.15)", backgroundColor: "#FAF6F1" }}>
            <ToolButton label="큰 소제목" onClick={() => prefixLines("## ", "소제목")}>H2</ToolButton>
            <ToolButton label="작은 소제목" onClick={() => prefixLines("### ", "소제목")}>H3</ToolButton>
            <Divider />
            <ToolButton label="굵게" onClick={() => wrap("**", "**", "굵은 글씨")}>
              <strong>B</strong>
            </ToolButton>
            <ToolButton label="기울임" onClick={() => wrap("*", "*", "기울인 글씨")}>
              <em>I</em>
            </ToolButton>
            <Divider />
            <ToolButton label="인용구" onClick={() => prefixLines("> ", "인용할 문장")}>❝ 인용구</ToolButton>
            <ToolButton label="목록" onClick={() => prefixLines("- ", "항목")}>• 목록</ToolButton>
            <ToolButton label="구분선" onClick={() => insertBlock("---")}>— 구분선</ToolButton>
            <Divider />

            {/* 글자색 */}
            <span className="text-[11px] px-1" style={{ color: "#9E8676" }}>글자색</span>
            {TEXT_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                title={`글자색 — ${c.name}`}
                onClick={() => wrap(`<span style="color:${c.value}">`, "</span>", "색을 넣을 글")}
                className="w-6 h-6 grid place-items-center text-[13px] font-bold"
                style={{ border: "1px solid rgba(42,28,20,0.15)", backgroundColor: "#fff", color: c.value }}
              >
                가
              </button>
            ))}
            <Divider />

            {/* 형광펜 */}
            <span className="text-[11px] px-1" style={{ color: "#9E8676" }}>형광펜</span>
            {HIGHLIGHTS.map((c) => (
              <button
                key={c.value}
                type="button"
                title={`형광펜 — ${c.name}`}
                onClick={() => wrap(`<mark style="background:${c.value}">`, "</mark>", "강조할 글")}
                className="w-6 h-6"
                style={{ border: "1px solid rgba(42,28,20,0.15)", backgroundColor: c.value }}
              />
            ))}
          </div>
        )}

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
