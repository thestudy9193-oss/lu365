import Image from "next/image";
import FadeIn from "@/components/animations/FadeIn";
import { siteConfig } from "@/config/site";

/** 입원실 + 교통사고 0원 — 가까이 '치료 결과로 증명합니다' 위치의 증거 섹션 */
export default function InpatientSection() {
  return (
    <section id="inpatient" className="relative py-16 sm:py-24 lg:py-32 px-5 sm:px-8 bg-canvas-soft scroll-mt-16 overflow-hidden">
      <span className="deco-numeral hidden lg:block" style={{ top: -20, left: 0, fontSize: 200, color: "rgba(42,28,20,0.05)" }}>
        365
      </span>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-9 lg:gap-12 items-center">
        {/* 좌 — 텍스트 */}
        <FadeIn className="lg:col-span-5">
          <p className="font-display italic text-sm mb-4" style={{ color: "#9E8676" }}>Inpatient Care · Auto Insurance</p>
          <h2 className="font-serif-kr text-[1.7rem] sm:text-3xl lg:text-[2.6rem] font-semibold leading-tight" style={{ color: "#2A1C14", letterSpacing: "-0.5px" }}>
            교통사고 1~3인 입원실,
            <br />
            집중 입원치료가 가능합니다.
          </h2>
          <p className="mt-5 sm:mt-6 text-[14.5px] sm:text-[15px] leading-[1.85] text-pretty-ko" style={{ color: "#705C4F" }}>
            교통사고를 비롯하여 각종 디스크, 협착증, 기타 통증 질환과 같은 만성질환의 치료를 입원을 통해 조금 더 전문적이고
            집중적으로 받아 볼 수 있습니다. 교통사고(자동차보험 적용 시)에는 침 · 부항 · 물리치료 · 추나치료와 입원비까지
            보험사가 부담합니다.
          </p>

          <dl className="mt-7 sm:mt-9 grid grid-cols-2 gap-x-5 gap-y-6 sm:gap-y-7">
            {[
              ["Rx-550", "최고급 전동베드"],
              ["32inch", "개인용 TV"],
              ["0원", "교통사고 본인부담금"],
              ["1~3인실", "입원실 운영"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="font-display text-2xl sm:text-3xl" style={{ color: "#2A1C14" }}>{v}</dt>
                <dd className="text-xs mt-1 tracking-wide" style={{ color: "#9E8676" }}>{l}</dd>
              </div>
            ))}
          </dl>
        </FadeIn>

        {/* 우 — 사진 2장 + STEP */}
        <div className="lg:col-span-7">
          <FadeIn direction="right">
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-3 relative aspect-[4/3] overflow-hidden">
                <Image src="/clinic-inpatient.jpg" alt="루원365한의원 입원실" fill sizes="50vw" className="object-cover" />
              </div>
              <div className="col-span-2 relative overflow-hidden">
                <Image src="/treatment-room.jpg" alt="루원365한의원 치료실" fill sizes="30vw" className="object-cover" />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="mt-5 sm:mt-6 p-6 sm:p-8" style={{ backgroundColor: "#2A1C14" }}>
              <p className="font-display italic text-xs mb-5" style={{ color: "#C8A882" }}>
                교통사고 후유증 진료 안내 — 자동차보험으로 &apos;0&apos;원 한방치료
              </p>
              <ol className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-6">
                {siteConfig.accidentSteps.map((s) => (
                  <li key={s.step}>
                    <p className="font-display text-lg sm:text-xl" style={{ color: "#C8A882" }}>STEP {s.step}</p>
                    <p className="font-semibold text-[15px] mt-1" style={{ color: "#FAF6F1" }}>{s.title}</p>
                    <p className="text-[12px] sm:text-[12.5px] leading-relaxed mt-1.5 text-pretty-ko" style={{ color: "rgba(250,246,241,0.65)" }}>{s.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
