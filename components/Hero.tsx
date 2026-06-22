import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import InkReveal from "@/components/ui/ink-reveal";

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: "100svh", display: "flex", flexDirection: "column" }}
    >
      {/* ── 레이어 1: 실제 한의원 사진 ── */}
      <Image
        src="/hero-clinic.jpg"
        alt="루원365한의원 치료실"
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center 30%" }}
      />

      {/* ── 레이어 2: 그라디언트 오버레이 (텍스트 가독성 + 브랜드 톤) ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(115deg, rgba(42,28,20,0.92) 0%, rgba(42,28,20,0.65) 42%, rgba(42,28,20,0.2) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── 레이어 3: InkReveal 캔버스 — 전체 화면 먹물 효과 ──
           maskColor = 히어로 배경색 #2A1C14(=rgb 42,28,20)
           마우스를 움직이면 아래 실제 한의원 사진이 먹물처럼 번져 나옴 */}
      <InkReveal
        maskColor={[42, 28, 20]}
        brushSize={160}
        lifetime={550}
        rStart={12}
        rVary={0.45}
        stampStep={14}
        maxStamps={100}
        segments={22}
        wobble={[0.14, 0.08, 0.04]}
        gradientInnerRadius={0.2}
        gradientStops={[0.92, 0.84, 0]}
        style={{ cursor: "default" }}
      />

      {/* ── 레이어 4: 텍스트 콘텐츠 ── */}
      <div
        className="relative flex-1 flex items-center"
        style={{ zIndex: 10, pointerEvents: "none" }}
      >
        <div className="max-w-6xl mx-auto w-full px-6 sm:px-8 lg:px-12 py-24">
          <div className="max-w-2xl">

            {/* 아이브로우 */}
            <div className="hero-eyebrow flex items-center gap-3 mb-8">
              <div className="w-10 h-px" style={{ backgroundColor: "#C8A882" }} />
              <p
                className="text-xs font-medium tracking-[3px] uppercase"
                style={{ color: "#C8A882" }}
              >
                Inwon 365 Oriental Medicine Clinic
              </p>
            </div>

            {/* 헤드라인 */}
            <h1
              className="hero-headline font-bold leading-tight mb-6"
              style={{
                fontSize: "clamp(2.6rem, 5.5vw, 3.8rem)",
                color: "#FAF6F1",
                letterSpacing: "-0.5px",
                textShadow: "0 4px 32px rgba(20,12,8,0.7)",
              }}
            >
              일상 속 건강을
              <br />
              세심하게 살피는
              <br />
              <span style={{ color: "#C8A882" }}>루원365한의원</span>
            </h1>

            {/* 구분선 */}
            <div
              className="hero-divider w-14 h-0.5 mb-6"
              style={{ backgroundColor: "#C8A882", opacity: 0.55 }}
            />

            {/* 서브텍스트 */}
            <p
              className="hero-sub text-base sm:text-lg leading-relaxed mb-10 max-w-md"
              style={{
                color: "#C4B4A8",
                textShadow: "0 2px 12px rgba(20,12,8,0.6)",
              }}
            >
              교통사고 후유증부터 척추·관절 클리닉,
              <br />
              추나요법, 입원치료까지.
              <br />
              <span style={{ color: "#D8C8BC" }}>
                4명의 한의사가 365일 함께합니다.
              </span>
            </p>

            {/* CTA 버튼 */}
            <div
              className="hero-cta flex flex-col sm:flex-row gap-3"
              style={{ pointerEvents: "auto" }}
            >
              <Link href="/services" className="btn-gold">
                진료 안내 보기
              </Link>
              <Link href="/contact" className="btn-outline-cream">
                오시는 길 확인하기
              </Link>
            </div>

            {/* 힌트 */}
            <p
              className="mt-14 text-xs flex items-center gap-2"
              style={{ color: "#5A4A3C" }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "18px",
                  height: "18px",
                  border: "1px solid #5A4A3C",
                  borderRadius: "50%",
                  lineHeight: "18px",
                  textAlign: "center",
                  fontSize: "10px",
                }}
              >
                ✦
              </span>
              화면 위에서 마우스를 움직여보세요
            </p>
          </div>
        </div>
      </div>

      {/* ── 레이어 5: 하단 정보 바 ── */}
      <div
        className="hero-infobar relative"
        style={{
          zIndex: 10,
          borderTop: "1px solid rgba(200,168,130,0.15)",
          backgroundColor: "rgba(20,10,5,0.45)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
          <div
            className="flex flex-wrap items-center gap-x-8 gap-y-1.5"
            style={{ pointerEvents: "auto" }}
          >
            <span
              className="text-xs flex items-center gap-1.5"
              style={{ color: "#9E8676" }}
            >
              <span style={{ color: "#C8A882" }}>📍</span>
              {siteConfig.address}
            </span>
            <span
              className="text-xs flex items-center gap-1.5"
              style={{ color: "#9E8676" }}
            >
              <span style={{ color: "#C8A882" }}>📞</span>
              <a
                href={`tel:${siteConfig.phone}`}
                className="font-semibold hover:underline"
                style={{ color: "#C8A882" }}
              >
                {siteConfig.phone}
              </a>
            </span>
            <span className="text-xs" style={{ color: "#706050" }}>
              평일 09:30–21:00 &nbsp;·&nbsp; 주말·공휴일 09:00–16:00
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
