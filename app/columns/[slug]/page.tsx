import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllColumnSlugs, getColumnBySlug } from "@/lib/columns";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllColumnSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const column = await getColumnBySlug(slug);
  if (!column) return {};
  return {
    title: column.title,
    description: column.summary,
    openGraph: {
      title: column.title,
      description: column.summary,
      type: "article",
      publishedTime: column.date,
    },
  };
}

export default async function ColumnDetailPage({ params }: Props) {
  const { slug } = await params;
  const column = await getColumnBySlug(slug);
  if (!column) notFound();

  const dateFormatted = column.date
    ? new Date(column.date).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <>
      {/* 헤더 */}
      <section
        className="py-20 px-4 relative overflow-hidden"
        style={{ backgroundColor: "#2A1C14" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 100% at 60% 50%, #4A2C1C 0%, #2A1C14 65%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/columns" className="text-xs hover:underline" style={{ color: "#9E8676" }}>
              ← 칼럼 목록
            </Link>
            <span style={{ color: "#52392C" }}>·</span>
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "rgba(200,168,130,0.15)", color: "#C8A882" }}
            >
              {column.category}
            </span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold leading-snug mb-4"
            style={{ color: "#FAF6F1", letterSpacing: "-0.3px" }}
          >
            {column.title}
          </h1>
          <p className="text-xs" style={{ color: "#705C4F" }}>{dateFormatted}</p>
        </div>
      </section>

      {/* 본문 */}
      <section className="py-14 px-4" style={{ backgroundColor: "#FAF6F1" }}>
        <div className="max-w-3xl mx-auto">
          {/* 요약 */}
          <div
            className="p-5 mb-8 text-sm leading-relaxed"
            style={{
              backgroundColor: "#F0FDFA",
              borderLeft: "3px solid #0d9488",
              color: "#2A4A48",
            }}
          >
            {column.summary}
          </div>

          {/* 마크다운 본문 */}
          <article
            className="prose-column"
            dangerouslySetInnerHTML={{ __html: column.content }}
          />

          {/* 면책 고지 */}
          <div
            className="mt-10 p-5 rounded-xl text-xs leading-relaxed"
            style={{ backgroundColor: "#F0E8DE", color: "#9E8676" }}
          >
            <strong style={{ color: "#705C4F" }}>안내</strong> — 본 칼럼의 내용은 일반적인 건강
            정보 제공을 목적으로 작성되었으며, 개인의 증상에 대한 의료적 진단이나 치료를 대체하지
            않습니다. 증상이 있거나 건강에 이상이 느껴지시는 경우 의료기관에서 전문 의료진의
            상담을 받으시기 바랍니다.
          </div>

          {/* 하단 네비 */}
          <div
            className="mt-8 pt-6 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(42,28,20,0.1)" }}
          >
            <Link
              href="/columns"
              className="text-sm font-medium hover:underline"
              style={{ color: "#9E8676" }}
            >
              ← 칼럼 목록
            </Link>
            <Link
              href="/contact"
              className="text-sm font-semibold hover:underline"
              style={{ color: "#0d9488" }}
            >
              진료 문의하기 →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
