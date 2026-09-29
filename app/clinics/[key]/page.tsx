import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ColumnCard from "@/components/columns/ColumnCard";
import { getAllColumns } from "@/lib/columns";
import { siteConfig } from "@/config/site";
import { clinicPages, getClinicPage } from "@/config/clinicPages";
import { breadcrumbJsonLd, clinicPageJsonLd, jsonLdScript } from "@/lib/jsonld";

// 관련 칼럼이 예약 발행으로 늘어나므로 요청 시 렌더링
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ key: string }> };

export function generateStaticParams() {
  return clinicPages.map((p) => ({ key: p.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getClinicPage((await params).key);
  if (!page) return {};
  return {
    title: page.seoTitle,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: `/clinics/${page.key}` },
    openGraph: {
      title: `${page.h1} | ${siteConfig.name}`,
      description: page.description,
      type: "website",
      images: [page.carousel.image],
    },
  };
}

export default async function ClinicPage({ params }: Props) {
  const page = getClinicPage((await params).key);
  if (!page) notFound();

  const columns = (await getAllColumns()).filter((c) => page.columnCategories.includes(c.category)).slice(0, 3);
  const others = clinicPages.filter((p) => p.key !== page.key);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(clinicPageJsonLd(page))} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: page.h1, path: `/clinics/${page.key}` },
          ])
        )}
      />

      {/* 헤더 */}
      <section className="relative pt-28 sm:pt-36 pb-14 sm:pb-20 px-5 sm:px-8 overflow-hidden" style={{ backgroundColor: "#2A1C14" }}>
        <Image
          src={page.hero}
          alt={page.h1}
          fill
          sizes="100vw"
          priority
          className="object-cover"
          style={{ opacity: 0.35, objectPosition: page.heroPosition }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(42,28,20,0.55) 0%, rgba(42,28,20,0.92) 100%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <Link href="/#clinics" className="inline-flex items-center gap-2 text-xs tracking-wide hover:opacity-70 mb-8" style={{ color: "#C8A882" }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            진료 안내
          </Link>
          <p className="font-display italic text-sm" style={{ color: "#C8A882" }}>{page.en}</p>
          <h1 className="mt-3 font-serif-kr text-[1.8rem] sm:text-4xl lg:text-[2.8rem] font-semibold leading-tight text-pretty-ko" style={{ color: "#FAF6F1", letterSpacing: "-0.5px" }}>
            {page.h1}
          </h1>
          <p className="mt-5 text-[14.5px] sm:text-base leading-relaxed text-pretty-ko" style={{ color: "rgba(250,246,241,0.78)" }}>{page.lead}</p>
        </div>
      </section>

      <article className="px-5 sm:px-8 bg-canvas">
        <div className="max-w-3xl mx-auto py-14 sm:py-20">
          <h2 className="font-serif-kr text-xl sm:text-2xl font-semibold mb-5" style={{ color: "#2A1C14" }}>이런 분께 권합니다</h2>
          <ul className="space-y-2.5">
            {page.symptoms.map((s) => (
              <li key={s} className="flex gap-3 text-[15px] leading-relaxed" style={{ color: "#4A3A30" }}>
                <span className="mt-2 w-1.5 h-1.5 shrink-0 rounded-full" style={{ backgroundColor: "#C8A882" }} />
                {s}
              </li>
            ))}
          </ul>

          <h2 className="mt-14 font-serif-kr text-xl sm:text-2xl font-semibold mb-5" style={{ color: "#2A1C14" }}>이렇게 치료합니다</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {page.approach.map((a, i) => (
              <div key={a.title} className="p-5" style={{ backgroundColor: "#F0E8DE" }}>
                <p className="font-display text-xs" style={{ color: "#9E8676" }}>0{i + 1}</p>
                <h3 className="mt-1 font-semibold text-[15.5px]" style={{ color: "#2A1C14" }}>{a.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed" style={{ color: "#705C4F" }}>{a.text}</p>
              </div>
            ))}
          </div>

          {page.body.map((b) => (
            <section key={b.heading} className="mt-14">
              <h2 className="font-serif-kr text-xl sm:text-2xl font-semibold mb-4" style={{ color: "#2A1C14" }}>{b.heading}</h2>
              {b.paragraphs.map((p) => (
                <p key={p} className="mt-3 text-[15.5px] leading-[1.85] text-pretty-ko" style={{ color: "#4A3A30" }}>{p}</p>
              ))}
            </section>
          ))}

          <section className="mt-14">
            <h2 className="font-serif-kr text-xl sm:text-2xl font-semibold mb-4" style={{ color: "#2A1C14" }}>자주 묻는 질문</h2>
            {page.faq.map((f) => (
              <div key={f.q} className="py-5" style={{ borderBottom: "1px solid rgba(42,28,20,0.1)" }}>
                <h3 className="font-semibold text-[15.5px]" style={{ color: "#2A1C14" }}>Q. {f.q}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: "#705C4F" }}>{f.a}</p>
              </div>
            ))}
          </section>

          <section className="mt-14 p-6 sm:p-8" style={{ backgroundColor: "#2A1C14" }}>
            <h2 className="font-serif-kr text-lg sm:text-xl font-semibold" style={{ color: "#FAF6F1" }}>{siteConfig.name} {siteConfig.branch}</h2>
            <dl className="mt-4 space-y-1.5 text-[14px]" style={{ color: "rgba(250,246,241,0.78)" }}>
              <div><dt className="inline" style={{ color: "#C8A882" }}>진료 </dt><dd className="inline">{siteConfig.hours.weekday.label} {siteConfig.hours.weekday.time} · {siteConfig.hours.weekend.label} {siteConfig.hours.weekend.time}</dd></div>
              <div><dt className="inline" style={{ color: "#C8A882" }}>위치 </dt><dd className="inline">{siteConfig.address} ({siteConfig.addressDetail})</dd></div>
              <div><dt className="inline" style={{ color: "#C8A882" }}>전화 </dt><dd className="inline">{siteConfig.phone}</dd></div>
            </dl>
            <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
              <a href={`tel:${siteConfig.phone}`} className="btn-gold flex-1">예약 및 상담 {siteConfig.phoneLabel}</a>
              <a href={siteConfig.kakaoLink} target="_blank" rel="noopener noreferrer" className="btn-outline-ink flex-1" style={{ color: "#FAF6F1", borderColor: "rgba(250,246,241,0.4)" }}>카카오톡 상담</a>
            </div>
          </section>

          <p className="mt-10 text-xs leading-relaxed" style={{ color: "#9E8676" }}>
            치료 효과와 기간은 개인의 상태에 따라 차이가 있을 수 있습니다. 정확한 진단은 내원 진료를 통해 받으시기 바랍니다.
          </p>
        </div>
      </article>

      {columns.length > 0 && (
        <section className="py-14 sm:py-20 px-5 sm:px-8 bg-canvas-soft">
          <div className="max-w-7xl mx-auto">
            <p className="font-display italic text-sm mb-2" style={{ color: "#9E8676" }}>Stories</p>
            <h2 className="font-serif-kr text-2xl font-semibold mb-8" style={{ color: "#2A1C14" }}>{page.h1} 관련 건강 이야기</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7 sm:gap-8">
              {columns.map((c) => <ColumnCard key={c.slug} column={c} variant="grid" />)}
            </div>
          </div>
        </section>
      )}

      <nav className="py-12 px-5 sm:px-8 bg-canvas" aria-label="다른 진료 과목">
        <div className="max-w-3xl mx-auto flex flex-wrap gap-2">
          {others.map((p) => (
            <Link key={p.key} href={`/clinics/${p.key}`} className="text-[13.5px] px-4 py-2 hover:opacity-70" style={{ border: "1px solid rgba(42,28,20,0.15)", color: "#4A3A30" }}>
              {p.h1}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
