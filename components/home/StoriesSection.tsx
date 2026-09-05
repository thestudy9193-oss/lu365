import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";
import ColumnCard from "@/components/columns/ColumnCard";
import type { ColumnMeta } from "@/lib/columns";

export default function StoriesSection({ columns }: { columns: ColumnMeta[] }) {
  return (
    <section className="relative py-16 sm:py-24 lg:py-32 px-5 sm:px-8 bg-canvas-soft">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
            <div>
              <p className="font-display italic text-sm mb-3" style={{ color: "#9E8676" }}>Luwon Story</p>
              <h2 className="font-serif-kr text-[1.7rem] sm:text-3xl lg:text-[2.4rem] font-semibold leading-tight" style={{ color: "#2A1C14", letterSpacing: "-0.5px" }}>
                교통사고·통증 치료,
                <br />
                루원365 건강 이야기
              </h2>
            </div>
            <Link href="/columns" className="btn-outline-ink self-start sm:self-auto">
              건강 이야기 보러가기
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </FadeIn>

        {columns.length === 0 ? (
          <p className="text-center py-16 text-sm" style={{ color: "#9E8676" }}>아직 등록된 글이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 sm:gap-8">
            {columns.slice(0, 3).map((c, i) => (
              <FadeIn key={c.slug} delay={i * 0.08}>
                <ColumnCard column={c} variant="grid" />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
