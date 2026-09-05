import Image from "next/image";
import FadeIn from "@/components/animations/FadeIn";
import { siteConfig } from "@/config/site";

/** 가까이 '공간을 넘어…' 갤러리 — 영상 1 + 사진 그리드 */
export default function FacilitySection() {
  const items = siteConfig.facilities;
  return (
    <section id="tour" className="relative py-16 sm:py-24 lg:py-32 px-5 sm:px-8 scroll-mt-16" style={{ backgroundColor: "#2A1C14" }}>
      <div className="grain-overlay" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <FadeIn>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8 sm:mb-12">
            <div>
              <p className="font-display italic text-sm mb-3" style={{ color: "#C8A882" }}>Luwon 365 Tour</p>
              <h2 className="font-serif-kr text-[1.7rem] sm:text-3xl lg:text-[2.6rem] font-semibold leading-tight" style={{ color: "#FAF6F1", letterSpacing: "-0.5px" }}>
                공간을 넘어, 건강한 삶의
                <br />
                시작이 되는 곳
              </h2>
            </div>
            <p className="text-[14.5px] sm:text-[15px] leading-relaxed max-w-md text-pretty-ko" style={{ color: "rgba(250,246,241,0.65)" }}>
              300여 평 규모의 데스크·홀, 진료실, 추나·비만 치료실, 물리치료 라운지, 입원실과 북카페 휴게공간까지.
              쓰리엠타워 3층에서 만나보세요.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 [grid-auto-rows:130px] sm:[grid-auto-rows:180px] lg:[grid-auto-rows:220px]">
          {/* 영상 타일 */}
          <FadeIn className="col-span-2 row-span-2">
            <div className="relative w-full h-full overflow-hidden group">
              <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline poster="/lobby.jpg" aria-hidden="true">
                <source src="/lobby-video.mp4" type="video/mp4" />
              </video>
              <span className="absolute left-3 sm:left-4 bottom-3 sm:bottom-4 text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5" style={{ backgroundColor: "rgba(42,28,20,0.75)", color: "#FAF6F1" }}>
                접수 · 로비
              </span>
            </div>
          </FadeIn>

          {items.map((f, i) => (
            <FadeIn key={f.src} delay={i * 0.04} className={f.wide ? "col-span-2" : ""}>
              <div className="relative w-full h-full overflow-hidden group">
                <Image
                  src={f.src}
                  alt={f.label}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[900ms] group-hover:scale-105"
                />
                <span className="absolute left-3 sm:left-4 bottom-3 sm:bottom-4 text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5" style={{ backgroundColor: "rgba(42,28,20,0.75)", color: "#FAF6F1" }}>
                  {f.label}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
