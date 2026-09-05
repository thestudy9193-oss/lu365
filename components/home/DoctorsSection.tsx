"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import FadeIn from "@/components/animations/FadeIn";
import { siteConfig } from "@/config/site";

/** 의료진 4명 — 좌우 롤링 캐러셀 (드래그·스와이프·버튼) */
export default function DoctorsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".carousel-item");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  return (
    <section id="doctors" className="relative py-16 sm:py-24 lg:py-32 bg-canvas scroll-mt-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <FadeIn>
          <SectionTitle
            en="Medical Staff"
            title="365일 건강 지키미, 루원365 의료진"
            subtitle="최경준·박수민·유시헌·오용환 4명의 한의사가 365일 진료합니다. 교통사고 후유증과 디스크, 협착증, 체형교정을 통해 환자분들 몸의 wellness를 유지하도록 노력합니다."
          />
        </FadeIn>

        {/* 좌우 버튼 */}
        <div className="flex justify-end gap-2 mb-4 sm:mb-5">
          <CarouselButton dir="prev" disabled={atStart} onClick={() => scrollBy(-1)} />
          <CarouselButton dir="next" disabled={atEnd} onClick={() => scrollBy(1)} />
        </div>
      </div>

      {/* 트랙 — 좌측 여백 유지하며 우측으로 넘침 */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div ref={trackRef} className="carousel-track">
          {siteConfig.doctors.map((d) => (
            <article
              key={d.name + d.position}
              className="carousel-item card-white !p-0 overflow-hidden flex flex-col w-[252px] sm:w-[300px] lg:w-[calc((100%-72px)/4)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden" style={{ backgroundColor: "#F0E8DE" }}>
                <Image
                  src={d.photo}
                  alt={`${d.name} ${d.position}`}
                  fill
                  sizes="(max-width: 640px) 252px, 320px"
                  className="object-cover object-top"
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-32"
                  style={{ background: "linear-gradient(180deg, transparent, rgba(42,28,20,0.75))" }}
                />
                <div className="absolute left-5 sm:left-6 bottom-5">
                  <p className="font-display italic text-xs mb-1" style={{ color: "#E8D5B8" }}>
                    {d.position === "대표원장" ? "Chief Director" : "Director"}
                  </p>
                  <p className="font-serif-kr text-xl sm:text-2xl font-semibold" style={{ color: "#FAF6F1" }}>
                    {d.name}
                    <span className="text-base font-medium ml-1.5" style={{ color: "#E8D5B8" }}>
                      {d.position}
                    </span>
                  </p>
                </div>
              </div>
              <ul className="p-5 sm:p-6 space-y-2 flex-1">
                {d.careers.map((c) => (
                  <li key={c} className="flex gap-2.5 text-[13.5px] leading-relaxed text-pretty-ko" style={{ color: "#705C4F" }}>
                    <span className="mt-[9px] w-1 h-1 shrink-0" style={{ backgroundColor: "#C8A882" }} />
                    {c}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CarouselButton({ dir, disabled, onClick }: { dir: "prev" | "next"; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "이전 의료진" : "다음 의료진"}
      className="w-12 h-12 grid place-items-center transition-all disabled:opacity-30"
      style={{ border: "1px solid rgba(42,28,20,0.2)", color: "#2A1C14" }}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d={dir === "prev" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
      </svg>
    </button>
  );
}
