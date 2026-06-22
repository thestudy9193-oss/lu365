import type { Metadata } from "next";
import Image from "next/image";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import ColumnCard from "@/components/ColumnCard";
import CTASection from "@/components/CTASection";
import SectionTitle from "@/components/SectionTitle";
import DoctorsSection from "@/components/DoctorsSection";
import FadeIn from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { siteConfig } from "@/config/site";
import { getAllColumns } from "@/lib/columns";
import Link from "next/link";

export const metadata: Metadata = {
  title: siteConfig.seo.defaultTitle,
  description: siteConfig.seo.defaultDescription,
};

export default function HomePage() {
  const recentColumns = getAllColumns().slice(0, 3);

  return (
    <>
      {/* ── 히어로 ─────────────────────────────────── */}
      <Hero />

      {/* ── About 컨셉 섹션 (투컬럼) ────────────────── */}
      <section className="py-20 sm:py-24 px-4" style={{ backgroundColor: "#FAF6F1" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* 텍스트 */}
            <FadeIn direction="up">
              <div>
                <div className="section-label mb-4" style={{ color: "#9E8676" }}>
                  <span>About</span>
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-bold mb-5 leading-snug"
                  style={{ color: "#2A1C14", letterSpacing: "-0.3px" }}
                >
                  진료가 필요한 분들 곁에서
                  <br />
                  365일 함께합니다
                </h2>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "#705C4F" }}>
                  루원365한의원은 환자분 한 분 한 분의 상태를 세심하게 살피는 것을
                  진료의 기본으로 삼고 있습니다. 불편감의 원인을 함께 파악하고
                  개인에 맞는 진료 방향을 안내해드립니다.
                </p>
                <p className="text-sm leading-relaxed mb-8" style={{ color: "#9E8676" }}>
                  4명의 한의사가 공휴일 포함 365일 진료합니다.
                  교통사고, 척추·관절, 입원치료까지 폭넓게 안내해드립니다.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/about" className="btn-outline-ink text-sm">
                    한의원 소개 →
                  </Link>
                  <Link href="/contact" className="btn-primary text-sm">
                    오시는 길
                  </Link>
                </div>
              </div>
            </FadeIn>

            {/* 한의원 라운지 사진 + 통계 카드 */}
            <FadeIn direction="right" delay={0.15}>
              <div className="relative pb-8">
                <div className="relative overflow-hidden h-80"
                  style={{ border: "1px solid rgba(42,28,20,0.08)" }}>
                  <Image
                    src="/clinic-lounge.jpg"
                    alt="루원365한의원 대기실"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    style={{ objectFit: "cover", objectPosition: "center 40%" }}
                  />
                  {/* 하단 그라디언트 */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                    style={{ background: "linear-gradient(to top, rgba(42,28,20,0.55), transparent)" }}
                  />
                  {/* 우하단 라벨 */}
                  <div className="absolute bottom-4 left-5 z-10">
                    <p className="text-xs font-medium tracking-[2px] uppercase" style={{ color: "#C8A882" }}>
                      루원365한의원
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(250,246,241,0.6)" }}>
                      인천 서구 가정동
                    </p>
                  </div>
                </div>

                {/* 통계 카드 - 오버레이 */}
                <div className="absolute -bottom-2 -left-4 grid grid-cols-2 gap-2">
                  {[
                    { num: "4명", label: "한의사" },
                    { num: "365일", label: "연중무휴" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="px-5 py-4 text-center shadow-lg"
                      style={{ backgroundColor: "#fff", border: "1px solid rgba(42,28,20,0.08)" }}
                    >
                      <p className="text-xl font-bold" style={{ color: "#0d9488" }}>{s.num}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#9E8676" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── 의료진 소개 ────────────────────────────── */}
      <DoctorsSection />

      {/* ── 진료 분야 ──────────────────────────────── */}
      <section className="relative py-20 sm:py-24 px-4 overflow-hidden">
        {/* 배경 사진 */}
        <Image
          src="/clinic-consult.jpg"
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 30%" }}
          aria-hidden
        />
        {/* 오버레이 — 브랜드 베이지 톤 유지하며 이미지 살짝 비춤 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(240,232,222,0.88) 0%, rgba(240,232,222,0.92) 60%, rgba(240,232,222,0.97) 100%)",
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto">
          <FadeIn>
            <SectionTitle
              en="Services"
              title="주요 진료 분야"
              subtitle="교통사고부터 어린이 클리닉까지 폭넓은 한방 진료를 안내합니다."
            />
          </FadeIn>
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {siteConfig.services.map((service) => (
              <StaggerItem key={service.title} className="h-full">
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  href="/services"
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
          <FadeIn delay={0.3}>
            <div className="text-center mt-8">
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
                style={{ color: "#705C4F" }}
              >
                진료 안내 전체 보기 →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 입원치료 피처 섹션 ──────────────────────── */}
      <section className="py-20 sm:py-24 px-4" style={{ backgroundColor: "#FAF6F1" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* 시설 카드 */}
            <FadeIn direction="left">
              <div className="grid grid-cols-2 gap-3">
                {/* 입원실 사진 카드 */}
                <div
                  className="col-span-2 relative overflow-hidden"
                  style={{ minHeight: "180px" }}
                >
                  <Image
                    src="/clinic-inpatient.jpg"
                    alt="루원365한의원 입원실"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                  {/* 다크 오버레이 */}
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to right, rgba(42,28,20,0.75) 0%, rgba(42,28,20,0.3) 100%)" }}
                  />
                  {/* 텍스트 */}
                  <div className="absolute inset-0 p-5 flex flex-col justify-end z-10">
                    <p className="text-xs font-medium mb-1" style={{ color: "#C8A882" }}>
                      6층 입원실
                    </p>
                    <p className="text-xl font-bold mb-1" style={{ color: "#FAF6F1" }}>
                      1~3인실 입원치료
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(200,168,130,0.8)" }}>
                      교통사고 후유증 · 수술 후 재활 · 척추 질환
                    </p>
                  </div>
                </div>

                {/* 치료실 사진 카드 */}
                <div className="relative overflow-hidden" style={{ minHeight: "130px" }}>
                  <Image
                    src="/clinic-treatment.jpg"
                    alt="루원365한의원 치료실"
                    fill
                    sizes="(max-width: 1024px) 50vw, 20vw"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "rgba(42,28,20,0.55)" }}
                  />
                  <div className="absolute inset-0 p-4 flex flex-col justify-end z-10">
                    <p className="text-xs mb-1 font-medium" style={{ color: "#C8A882" }}>3층 외래</p>
                    <ul className="text-xs space-y-0.5" style={{ color: "rgba(250,246,241,0.75)" }}>
                      <li>추나치료실</li>
                      <li>비만치료실</li>
                      <li>체형측정실</li>
                    </ul>
                  </div>
                </div>

                <div className="card" style={{ backgroundColor: "#F0E8DE" }}>
                  <p className="text-xs mb-1" style={{ color: "#9E8676" }}>치료 장비</p>
                  <ul className="text-xs space-y-1" style={{ color: "#705C4F" }}>
                    <li>인바디·엑스바디</li>
                    <li>심부고주파</li>
                    <li>추나 전용장비</li>
                  </ul>
                </div>
              </div>
            </FadeIn>

            {/* 텍스트 */}
            <FadeIn direction="right" delay={0.15}>
              <div>
                <div className="section-label mb-4" style={{ color: "#9E8676" }}>
                  <span>Inpatient Care</span>
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-bold mb-5 leading-snug"
                  style={{ color: "#2A1C14", letterSpacing: "-0.3px" }}
                >
                  집중 관리가 필요한 분을 위한
                  <br />
                  입원치료 시설 운영
                </h2>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "#705C4F" }}>
                  6층에 1~3인실 입원실을 운영하며, 교통사고 후유증,
                  수술 후 재활, 척추 질환 등 외래 진료만으로는 부족한
                  경우 입원치료를 안내해드릴 수 있습니다.
                </p>
                <Link href="/services" className="btn-outline-ink text-sm">
                  시설 안내 보기 →
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── 건강 칼럼 ──────────────────────────────── */}
      {recentColumns.length > 0 && (
        <section className="py-20 sm:py-24 px-4" style={{ backgroundColor: "#F0E8DE" }}>
          <div className="max-w-6xl mx-auto">
            <FadeIn>
              <div className="flex items-end justify-between mb-12">
                <div>
                  <div className="section-label mb-3" style={{ color: "#9E8676" }}>
                    <span>Column</span>
                  </div>
                  <h2
                    className="text-2xl sm:text-3xl font-bold"
                    style={{ color: "#2A1C14", letterSpacing: "-0.3px" }}
                  >
                    건강 칼럼
                  </h2>
                </div>
                <Link
                  href="/columns"
                  className="hidden sm:flex items-center gap-1.5 text-sm font-semibold hover:underline"
                  style={{ color: "#705C4F" }}
                >
                  전체 보기 →
                </Link>
              </div>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recentColumns.map((column) => (
                <StaggerItem key={column.slug}>
                  <ColumnCard column={column} />
                </StaggerItem>
              ))}
            </StaggerContainer>
            <div className="text-center mt-8 sm:hidden">
              <Link
                href="/columns"
                className="text-sm font-semibold hover:underline"
                style={{ color: "#705C4F" }}
              >
                칼럼 전체 보기 →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── 오시는 길 스트립 ───────────────────────── */}
      <section
        className="py-14 px-4"
        style={{ backgroundColor: "#3D2C22" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: "📍",
                label: "주소",
                primary: siteConfig.address,
                secondary: siteConfig.addressDetail,
                delay: 0,
              },
              {
                icon: "⏰",
                label: "진료시간",
                primary: "평일 09:30 – 21:00",
                secondary: "토·일·공휴일 09:00 – 16:00",
                extra: "연중무휴 365일 진료",
                delay: 0.1,
              },
            ].map((item) => (
              <FadeIn key={item.label} direction="up" delay={item.delay}>
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium mb-1" style={{ color: "#C8A882" }}>
                    {item.icon} {item.label}
                  </p>
                  <p className="text-sm font-semibold" style={{ color: "#FAF6F1" }}>
                    {item.primary}
                  </p>
                  <p className="text-xs" style={{ color: "#9E8676" }}>{item.secondary}</p>
                  {"extra" in item && (
                    <p className="text-xs" style={{ color: "#705C4F" }}>{(item as { extra: string }).extra}</p>
                  )}
                </div>
              </FadeIn>
            ))}
            <FadeIn direction="up" delay={0.2}>
              <div className="flex flex-col gap-3">
                <p className="text-xs font-medium" style={{ color: "#C8A882" }}>
                  📞 전화 문의
                </p>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="text-xl font-bold hover:underline"
                  style={{ color: "#FAF6F1" }}
                >
                  {siteConfig.phone}
                </a>
                <Link href="/contact" className="btn-gold text-sm self-start">
                  오시는 길 자세히 →
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────── */}
      <CTASection />
    </>
  );
}
