import { siteConfig } from "@/config/site";

export default function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: "100svh", backgroundColor: "#2A1C14" }}>
      {/* 배경 영상 (힉스필드 생성) */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/hero-clinic.jpg"
        aria-hidden="true"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* 오버레이 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(42,28,20,0.55) 0%, rgba(42,28,20,0.5) 45%, rgba(42,28,20,0.85) 100%)",
        }}
      />
      <div className="grain-overlay" />

      {/* 세로 플로우 — 콘텐츠와 수치바를 flex 로 분리해 겹침 원천 차단 */}
      <div className="relative z-10 flex flex-col pb-[58px] lg:pb-0" style={{ minHeight: "100svh" }}>
        {/* 중앙 텍스트 */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-5 sm:px-6 pt-20 pb-8 sm:pb-14">
          <p
            className="hero-eyebrow text-[12.5px] sm:text-base tracking-[0.08em] sm:tracking-[0.1em] mb-4 sm:mb-6 text-balance-ko"
            style={{ color: "rgba(250,246,241,0.85)" }}
          >
            인천 서구 가정동 · 가정역 6번 출구 401m · 365일 연중무휴 진료
          </p>

          <h1
            className="hero-headline font-serif-kr font-medium leading-[1.25] text-balance-ko"
            style={{
              color: "#FAF6F1",
              fontSize: "clamp(1.7rem, 6.8vw, 4.2rem)",
              letterSpacing: "-1px",
              textShadow: "0 6px 40px rgba(20,12,8,0.55)",
            }}
          >
            인천 교통사고한의원
            <br />
            <span className="inline-flex items-center gap-3 sm:gap-6 mt-1.5 sm:mt-2">
              <span className="hidden sm:inline font-display font-light" style={{ color: "#C8A882", fontSize: "1.1em" }}>
                [
              </span>
              <span>1~3인 입원실 운영</span>
              <span className="hidden sm:inline font-display font-light" style={{ color: "#C8A882", fontSize: "1.1em" }}>
                ]
              </span>
            </span>
          </h1>

          <p
            className="hero-sub mt-4 sm:mt-7 text-[13.5px] sm:text-lg leading-relaxed max-w-[20rem] sm:max-w-2xl text-balance-ko"
            style={{ color: "rgba(250,246,241,0.88)" }}
          >
            교통사고 후유증 치료,{" "}
            <strong style={{ color: "#E8D5B8", fontWeight: 600 }}>자동차보험 적용으로 본인부담금 0원</strong>.{" "}
            <span className="whitespace-nowrap">목·허리 디스크</span>와 <span className="whitespace-nowrap">추나요법</span>,{" "}
            <span className="whitespace-nowrap">체형교정</span>까지 4명의 한의사가 진료합니다.
          </p>

          <p
            className="hero-sub font-display italic mt-2.5 sm:mt-3 text-[11.5px] sm:text-base tracking-wide"
            style={{ color: "rgba(200,168,130,0.9)" }}
          >
            Luwon 365 Korean Medicine Clinic
          </p>

          <div className="hero-cta mt-6 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 w-full max-w-[290px] sm:w-auto sm:max-w-none">
            <a href={`tel:${siteConfig.phone}`} className="btn-gold w-full sm:w-auto">
              예약 및 상담 {siteConfig.phoneLabel}
            </a>
            <a href="#clinics" className="btn-outline-cream w-full sm:w-auto">
              진료과목 보기
            </a>
          </div>

          {/* 스크롤 안내 — 데스크톱만, 플로우에 두어 겹치지 않음 */}
          <div className="hero-infobar hidden lg:flex flex-col items-center gap-2 mt-12">
            <span className="text-[10px] tracking-[0.3em]" style={{ color: "rgba(250,246,241,0.55)" }}>
              SCROLL
            </span>
            <span className="scroll-line" />
          </div>
        </div>

        {/* 하단 수치 바 — 플로우 요소 */}
        <div
          className="hero-infobar grid grid-cols-2 sm:grid-cols-4 w-full max-w-5xl mx-auto shrink-0"
          style={{ borderTop: "1px solid rgba(250,246,241,0.18)" }}
        >
          {siteConfig.stats.map((s, i) => (
            <div
              key={s.label}
              className={[
                "hero-stat py-3.5 sm:py-6 px-3 sm:px-4 text-center",
                i % 2 === 1 ? "border-l" : "",
                i > 1 ? "border-t" : "",
                "sm:border-t-0",
                i > 0 ? "sm:border-l" : "sm:border-l-0",
              ].join(" ")}
            >
              <p className="font-display text-2xl sm:text-3xl lg:text-4xl leading-none" style={{ color: "#FAF6F1" }}>
                {s.value}
                <span className="text-base ml-0.5" style={{ color: "#C8A882" }}>
                  {s.unit}
                </span>
              </p>
              <p
                className="text-[11px] sm:text-xs mt-1.5 tracking-wide text-balance-ko"
                style={{ color: "rgba(250,246,241,0.65)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
