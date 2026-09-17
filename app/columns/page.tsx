import type { Metadata } from "next";
import Link from "next/link";
import ColumnCard from "@/components/columns/ColumnCard";
import WriteButton from "@/components/columns/WriteButton";
import { getAllColumns } from "@/lib/columns";
import { isEditor } from "@/lib/auth";
import { siteConfig } from "@/config/site";
import { breadcrumbJsonLd, jsonLdScript } from "@/lib/jsonld";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "건강 이야기 · 교통사고 후유증 정보",
  description:
    "인천 교통사고한의원 루원365한의원이 전하는 건강 이야기. 교통사고 후유증과 자동차보험 한방치료, 목·허리 디스크, 추나요법, 체형교정, 다이어트 정보를 한의사가 직접 안내합니다.",
  keywords: ["교통사고한의원", "교통사고 후유증", "자동차보험 한의원", "추나요법", "인천 한의원"],
  alternates: { canonical: "/columns" },
  openGraph: { images: [siteConfig.seo.ogImage] },
};

type Props = { searchParams: Promise<{ category?: string }> };

export default async function ColumnsPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const authenticated = await isEditor();
  const all = await getAllColumns({ includeScheduled: authenticated });
  const categories = Array.from(new Set(all.map((c) => c.category)));
  const columns = category ? all.filter((c) => c.category === category) : all;
  const scheduledCount = all.filter((c) => c.scheduled).length;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: "건강 이야기", path: "/columns" },
          ])
        )}
      />

      {/* 페이지 헤더 — 다크 밴드 */}
      <section className="relative pt-28 sm:pt-36 pb-14 sm:pb-20 px-5 sm:px-8 overflow-hidden" style={{ backgroundColor: "#2A1C14" }}>
        <div className="grain-overlay" />
        <span className="deco-hanja hidden xl:block" style={{ top: 40, right: 24, fontSize: 170, color: "rgba(250,246,241,0.03)" }}>
          健康
        </span>
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="font-display italic text-sm mb-3" style={{ color: "#C8A882" }}>Luwon Story</p>
            <h1 className="font-serif-kr text-[1.8rem] sm:text-3xl lg:text-[2.8rem] font-semibold leading-tight" style={{ color: "#FAF6F1", letterSpacing: "-0.5px" }}>
              루원365에서 알려주는
              <br />
              건강 이야기
            </h1>
            <p className="mt-4 text-[13.5px] sm:text-[15px] max-w-xl leading-relaxed text-pretty-ko" style={{ color: "rgba(250,246,241,0.65)" }}>
              한의사가 직접 전하는 통증·척추·체형·다이어트 정보. 정보 제공을 목적으로 작성된 글이며 의료 상담을 대체하지 않습니다.
            </p>
          </div>
          <WriteButton authenticated={authenticated} />
        </div>
      </section>

      {/* 카테고리 필터 + 목록 */}
      <section className="py-10 sm:py-16 lg:py-20 px-5 sm:px-8 bg-canvas">
        <div className="max-w-7xl mx-auto">
          {authenticated && scheduledCount > 0 && (
            <p className="mb-5 px-4 py-3 text-[13px]" style={{ backgroundColor: "#F0E8DE", color: "#705C4F" }}>
              예약 발행 대기 중인 글 {scheduledCount}건이 있습니다. 관리자에게만 보이며, 예약 시각이 지나면 자동으로 공개됩니다.
            </p>
          )}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <FilterChip href="/columns" active={!category} label={`전체 ${all.length}`} />
            {categories.map((c) => (
              <FilterChip key={c} href={`/columns?category=${encodeURIComponent(c)}`} active={category === c} label={c} />
            ))}
          </div>

          {columns.length === 0 ? (
            <p className="text-center py-24 text-sm" style={{ color: "#9E8676" }}>
              아직 등록된 글이 없습니다. 우측 상단 <strong>글쓰기</strong>로 첫 글을 남겨보세요.
            </p>
          ) : (
            <div style={{ borderTop: "1px solid rgba(42,28,20,0.12)" }}>
              {columns.map((column) => (
                <ColumnCard key={column.slug} column={column} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function FilterChip({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className="text-[13px] px-4 py-2.5 transition-colors whitespace-nowrap shrink-0"
      style={{
        backgroundColor: active ? "#2A1C14" : "transparent",
        color: active ? "#FAF6F1" : "#705C4F",
        border: `1px solid ${active ? "#2A1C14" : "rgba(42,28,20,0.15)"}`,
      }}
    >
      {label}
    </Link>
  );
}
