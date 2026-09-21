import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ColumnCard from "@/components/columns/ColumnCard";
import EditorActions from "@/components/columns/EditorActions";
import { formatDate, formatPublishAt, getAllColumns, getColumnBySlug } from "@/lib/columns";
import { isEditor } from "@/lib/auth";
import { siteConfig } from "@/config/site";
import { articleJsonLd, breadcrumbJsonLd, columnFaqJsonLd, extractFaq, jsonLdScript } from "@/lib/jsonld";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const column = await getColumnBySlug(decodeURIComponent(slug));
  if (!column) return {};
  return {
    title: column.title,
    robots: column.scheduled ? { index: false, follow: false } : undefined,
    description: column.summary || siteConfig.seo.defaultDescription,
    keywords: [...column.tags, "교통사고한의원", "인천 한의원", column.category],
    alternates: { canonical: `/columns/${encodeURIComponent(slug)}` },
    openGraph: {
      title: column.title,
      description: column.summary,
      type: "article",
      publishedTime: column.date,
      images: column.thumbnail ? [column.thumbnail] : [siteConfig.seo.ogImage],
    },
  };
}

export default async function ColumnDetailPage({ params }: Props) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const column = await getColumnBySlug(slug);
  if (!column) notFound();

  const authenticated = await isEditor();
  // 예약 발행 대기 중인 글은 관리자에게만 보인다
  if (column.scheduled && !authenticated) notFound();
  const related = (await getAllColumns())
    .filter((c) => c.slug !== slug)
    .sort((a, b) => (a.category === column.category ? -1 : 0) - (b.category === column.category ? -1 : 0))
    .slice(0, 3);

  // 본문에 "자주 묻는 질문" 섹션이 있으면 FAQ 구조화 데이터로도 내보낸다
  const faq = extractFaq(column.raw);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          articleJsonLd({
            title: column.title,
            description: column.summary,
            date: column.date,
            slug,
            image: column.thumbnail,
            images: column.images,
            tags: column.tags,
            wordCount: column.raw.replace(/\s/g, "").length,
          })
        )}
      />
      {faq.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(columnFaqJsonLd(slug, faq))} />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: "건강 이야기", path: "/columns" },
            { name: column.title, path: `/columns/${encodeURIComponent(slug)}` },
          ])
        )}
      />

      {/* 헤더 */}
      <section className="relative pt-28 sm:pt-36 pb-12 sm:pb-16 px-5 sm:px-8 overflow-hidden" style={{ backgroundColor: "#2A1C14" }}>
        <div className="grain-overlay" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-8">
            <Link href="/columns" className="inline-flex items-center gap-2 text-xs tracking-wide hover:opacity-70" style={{ color: "#C8A882" }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              건강 이야기
            </Link>
            {authenticated && <EditorActions slug={slug} />}
          </div>
          {column.scheduled && (
            <p className="mb-5 px-4 py-3 text-[13px]" style={{ backgroundColor: "rgba(200,168,130,0.16)", color: "#E8D5B8" }}>
              예약 발행 대기 중 — {formatPublishAt(column.publishAt)}에 자동 공개됩니다. 지금은 관리자에게만 보입니다.
            </p>
          )}
          <p className="flex items-center gap-3 text-sm" style={{ color: "#C8A882" }}>
            <span className="font-display">{formatDate(column.date)}</span>
            <span className="w-px h-3" style={{ backgroundColor: "currentColor", opacity: 0.4 }} />
            <span>{column.category}</span>
          </p>
          <h1 className="mt-4 font-serif-kr text-[1.6rem] sm:text-3xl lg:text-[2.6rem] font-semibold leading-tight text-pretty-ko" style={{ color: "#FAF6F1", letterSpacing: "-0.5px" }}>
            {column.title}
          </h1>
          {column.summary && (
            <p className="mt-4 sm:mt-5 text-[14px] sm:text-[15px] leading-relaxed text-pretty-ko" style={{ color: "rgba(250,246,241,0.7)" }}>{column.summary}</p>
          )}
        </div>
      </section>

      {/* 본문 */}
      <article className="px-5 sm:px-8 bg-canvas">
        <div className="max-w-3xl mx-auto">
          {column.thumbnail && (
            <div className="relative aspect-[16/9] -mt-6 sm:-mt-8 mb-8 sm:mb-12 overflow-hidden" style={{ boxShadow: "0 20px 60px rgba(42,28,20,0.18)" }}>
              <Image src={column.thumbnail} alt={column.title} fill sizes="768px" className="object-cover" priority unoptimized={column.thumbnail.startsWith("/api/")} />
            </div>
          )}
          <div className={`prose-column text-[15.5px] sm:text-[16px] ${column.thumbnail ? "" : "pt-10 sm:pt-14"}`} dangerouslySetInnerHTML={{ __html: column.content }} />

          {column.tags.length > 0 && (
            <p className="mt-12 flex flex-wrap gap-2">
              {column.tags.map((t) => (
                <span key={t} className="text-xs px-3 py-1.5" style={{ backgroundColor: "#F0E8DE", color: "#705C4F" }}>#{t}</span>
              ))}
            </p>
          )}

          <div className="mt-12 p-6 text-xs leading-relaxed" style={{ backgroundColor: "#F0E8DE", color: "#705C4F" }}>
            본 글은 건강 정보 제공을 목적으로 작성되었으며 개인의 증상에 대한 진단·치료를 대체하지 않습니다. 증상이 있으신 경우 내원 상담을 권장합니다.
          </div>

          <div className="mt-9 mb-16 sm:mb-20 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <a href={`tel:${siteConfig.phone}`} className="btn-gold flex-1">예약 및 상담 {siteConfig.phoneLabel}</a>
            <Link href="/columns" className="btn-outline-ink flex-1">목록으로</Link>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="py-14 sm:py-20 px-5 sm:px-8 bg-canvas-soft">
          <div className="max-w-7xl mx-auto">
            <p className="font-display italic text-sm mb-2" style={{ color: "#9E8676" }}>More Stories</p>
            <h2 className="font-serif-kr text-2xl font-semibold mb-8" style={{ color: "#2A1C14" }}>함께 읽어보세요</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7 sm:gap-8">
              {related.map((c) => <ColumnCard key={c.slug} column={c} variant="grid" />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
