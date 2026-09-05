import Image from "next/image";
import Link from "next/link";
import { formatDate, type ColumnMeta } from "@/lib/columns";

type Props = {
  column: ColumnMeta;
  variant?: "row" | "grid";
  light?: boolean;
};

/** 가까이 '건강 이야기' 카드 — 썸네일 + 날짜 + 제목 + 요약 */
export default function ColumnCard({ column, variant = "row", light = false }: Props) {
  const titleColor = light ? "#FAF6F1" : "#2A1C14";
  const textColor = light ? "rgba(250,246,241,0.65)" : "#705C4F";
  const metaColor = light ? "#C8A882" : "#9E8676";
  const border = light ? "1px solid rgba(250,246,241,0.12)" : "1px solid rgba(42,28,20,0.1)";

  if (variant === "grid") {
    return (
      <Link href={`/columns/${column.slug}`} className="group block h-full">
        <article className="h-full flex flex-col">
          <div className="relative aspect-[16/10] overflow-hidden" style={{ backgroundColor: light ? "rgba(250,246,241,0.06)" : "#F0E8DE" }}>
            {column.thumbnail ? (
              <Image src={column.thumbnail} alt={column.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized={column.thumbnail.startsWith("/api/")} />
            ) : (
              <Placeholder category={column.category} light={light} />
            )}
          </div>
          <div className="pt-5 flex-1 flex flex-col">
            <p className="flex items-center gap-3 text-xs" style={{ color: metaColor }}>
              <span className="font-display">{formatDate(column.date)}</span>
              <span className="w-px h-3" style={{ backgroundColor: "currentColor", opacity: 0.4 }} />
              <span>{column.category}</span>
            </p>
            <h3 className="mt-2 font-serif-kr text-[1.1rem] sm:text-lg font-semibold leading-snug text-pretty-ko group-hover:underline underline-offset-4 decoration-1" style={{ color: titleColor }}>
              {column.title}
            </h3>
            <p className="mt-2 text-[13px] sm:text-[13.5px] leading-relaxed line-clamp-2 text-pretty-ko" style={{ color: textColor }}>{column.summary}</p>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/columns/${column.slug}`} className="group block">
      <article className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-8 py-6 sm:py-8" style={{ borderBottom: border }}>
        <div className="sm:col-span-4 relative aspect-[16/10] overflow-hidden" style={{ backgroundColor: light ? "rgba(250,246,241,0.06)" : "#F0E8DE" }}>
          {column.thumbnail ? (
            <Image src={column.thumbnail} alt={column.title} fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized={column.thumbnail.startsWith("/api/")} />
          ) : (
            <Placeholder category={column.category} light={light} />
          )}
        </div>
        <div className="sm:col-span-8 flex flex-col justify-center">
          <p className="flex items-center gap-3 text-xs" style={{ color: metaColor }}>
            <span className="font-display text-sm">{formatDate(column.date)}</span>
            <span className="w-px h-3" style={{ backgroundColor: "currentColor", opacity: 0.4 }} />
            <span>{column.category}</span>
          </p>
          <h3 className="mt-2.5 sm:mt-3 font-serif-kr text-[1.15rem] sm:text-2xl font-semibold leading-snug text-pretty-ko group-hover:underline underline-offset-4 decoration-1" style={{ color: titleColor }}>
            {column.title}
          </h3>
          <p className="mt-2 sm:mt-3 text-[13.5px] sm:text-[14.5px] leading-relaxed line-clamp-2 text-pretty-ko" style={{ color: textColor }}>{column.summary}</p>
          {column.tags.length > 0 && (
            <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs" style={{ color: metaColor }}>
              {column.tags.slice(0, 5).map((t) => <span key={t}>#{t}</span>)}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}

function Placeholder({ category, light }: { category: string; light: boolean }) {
  return (
    <div className="absolute inset-0 grid place-items-center" style={{ background: light ? "linear-gradient(135deg, rgba(250,246,241,0.08), rgba(250,246,241,0.02))" : "linear-gradient(135deg, #F0E8DE, #E8D5B8)" }}>
      <div className="text-center">
        <p className="font-display italic text-xs" style={{ color: light ? "#C8A882" : "#9E8676" }}>Luwon Story</p>
        <p className="font-serif-kr text-lg font-semibold mt-1" style={{ color: light ? "#FAF6F1" : "#2A1C14" }}>{category}</p>
      </div>
    </div>
  );
}
