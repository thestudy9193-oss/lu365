import Image from "next/image";
import SectionTitle from "@/components/SectionTitle";
import FadeIn from "@/components/animations/FadeIn";
import { siteConfig } from "@/config/site";

/** 가까이한의원 '이렇게 다릅니다' 레이아웃 — 아치형 사진 + 넘버링 + 큰 타이틀 + 태그 (지그재그) */
export default function DifferentiationSection() {
  return (
    <section id="difference" className="relative py-16 sm:py-24 lg:py-32 px-5 sm:px-8 scroll-mt-16" style={{ backgroundColor: "#2A1C14" }}>
      <div className="grain-overlay" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <FadeIn>
          <SectionTitle
            light
            en="Luwon Korean Medicine Clinic"
            title="인천 교통사고한의원, 루원365는 이렇게 다릅니다"
            subtitle="1~3인 입원실을 갖춘 인천 서구 최대 규모의 한의원. 4명의 한의사가 상주하며 체형·족부 분석기와 추나 전용 장비로 교통사고 후유증과 척추 질환을 진료합니다."
          />
        </FadeIn>

        <div className="mt-4 sm:mt-6 space-y-14 sm:space-y-20 lg:space-y-28">
          {siteConfig.differentiation.map((d, i) => {
            const reverse = i % 2 === 1;
            return (
              <div
                key={d.no}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-16 items-center ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
              >
                {/* 사진 — 상단 아치 */}
                <FadeIn direction={reverse ? "right" : "left"} className="lg:col-span-5">
                  <div
                    className="relative w-full aspect-[5/4] sm:aspect-[4/5] max-w-[300px] sm:max-w-[380px] lg:max-w-[440px] mx-auto overflow-hidden"
                    style={{ borderRadius: "999px 999px 0 0" }}
                  >
                    <Image
                      src={d.image}
                      alt={d.title}
                      fill
                      sizes="(max-width: 1024px) 90vw, 40vw"
                      className="object-cover"
                      style={{ objectPosition: ("imagePosition" in d ? d.imagePosition : undefined) ?? "center" }}
                    />
                    <div className="absolute inset-0 gold-frame" style={{ borderRadius: "999px 999px 0 0" }} />
                  </div>
                </FadeIn>

                {/* 텍스트 */}
                <FadeIn className="lg:col-span-7" delay={0.1}>
                  <div className={`${reverse ? "lg:pr-10" : "lg:pl-10"} relative`}>
                    <div className="hidden lg:block absolute top-0 bottom-0 w-px" style={{ [reverse ? "right" : "left"]: 0, backgroundColor: "rgba(250,246,241,0.12)" }} />
                    <p className="font-display italic text-sm tracking-wide mb-4" style={{ color: "#C8A882" }}>
                      Differentiation {d.no}
                      <span className="mx-3" style={{ color: "rgba(200,168,130,0.4)" }}>|</span>
                      <span className="not-italic" style={{ color: "rgba(250,246,241,0.55)" }}>{d.en}</span>
                    </p>
                    <h3 className="font-serif-kr text-[1.7rem] sm:text-3xl lg:text-[2.6rem] font-semibold leading-tight" style={{ color: "#FAF6F1", letterSpacing: "-0.5px" }}>
                      {d.title}
                    </h3>
                    <p className="mt-3 sm:mt-4 text-[16px] sm:text-lg font-medium text-balance-ko" style={{ color: "#E8D5B8" }}>{d.lead}</p>
                    <p className="mt-4 text-[15px] leading-[1.9] max-w-xl text-pretty-ko" style={{ color: "rgba(250,246,241,0.72)" }}>
                      {d.body}
                    </p>
                    <ul className="mt-5 sm:mt-7 flex flex-wrap gap-2">
                      {d.tags.map((t) => (
                        <li
                          key={t}
                          className="text-[12px] sm:text-[13px] px-3 sm:px-4 py-1.5 sm:py-2"
                          style={{ backgroundColor: "rgba(250,246,241,0.07)", color: "#FAF6F1", border: "1px solid rgba(250,246,241,0.14)" }}
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeIn>
              </div>
            );
          })}
        </div>

        {/* 추나 치료 POINT */}
        <FadeIn>
          <div className="mt-16 sm:mt-24 lg:mt-28 pt-10 sm:pt-14" style={{ borderTop: "1px solid rgba(250,246,241,0.12)" }}>
            <div className="text-center mb-10">
              <p className="font-display italic text-sm mb-3" style={{ color: "#C8A882" }}>Chuna Point</p>
              <h3 className="font-serif-kr text-2xl sm:text-3xl font-semibold" style={{ color: "#FAF6F1" }}>
                치료효과 <span style={{ color: "#C8A882" }}>UP!</span> 재발가능성 <span style={{ color: "#C8A882" }}>DOWN!</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {siteConfig.chunaPoints.map((p) => (
                <div key={p.no} className="p-7" style={{ backgroundColor: "rgba(250,246,241,0.05)", border: "1px solid rgba(250,246,241,0.1)" }}>
                  <p className="font-display text-xs tracking-[0.2em] mb-3" style={{ color: "#C8A882" }}>{p.no}</p>
                  <p className="text-[15px] leading-relaxed text-pretty-ko" style={{ color: "rgba(250,246,241,0.85)" }}>{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
