import FadeIn from "@/components/animations/FadeIn";
import { siteConfig } from "@/config/site";

export default function InfoSection() {
  const { hours } = siteConfig;
  // 구글 지도: Embed API 키가 있으면 공식 방식(안정적), 없으면 키 없는 임베드로 폴백
  const gkey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  const mapSrc = gkey
    ? `https://www.google.com/maps/embed/v1/place?key=${gkey}&q=place_id:${siteConfig.googlePlaceIdShort}&language=ko&region=KR&zoom=17`
    : `${siteConfig.mapEmbedBase}${Date.now()}${siteConfig.mapEmbedSuffix}`;
  return (
    <section id="info" className="relative py-16 sm:py-24 lg:py-32 px-5 sm:px-8 bg-canvas scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-9 sm:mb-14">
            <p className="font-display italic text-sm mb-3" style={{ color: "#9E8676" }}>Information</p>
            <h2 className="font-serif-kr text-[1.7rem] sm:text-3xl lg:text-[2.4rem] font-semibold" style={{ color: "#2A1C14", letterSpacing: "-0.5px" }}>
              진료안내 · 오시는 길
            </h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* 진료시간 */}
          <FadeIn>
            <div className="card-bordered h-full !p-6 sm:!p-8">
              <p className="section-label" style={{ color: "#2A1C14" }}><span>진료시간</span></p>
              <div className="mt-6 space-y-6">
                {[hours.weekday, hours.weekend].map((h) => (
                  <div key={h.label}>
                    <p className="text-sm" style={{ color: "#9E8676" }}>{h.label}</p>
                    <p className="font-display text-2xl sm:text-3xl mt-1" style={{ color: "#2A1C14" }}>{h.time}</p>
                    <p className="text-xs mt-1" style={{ color: "#9E8676" }}>{h.lunch}</p>
                  </div>
                ))}
              </div>
              <p className="mt-7 pt-5 text-xs leading-relaxed" style={{ color: "#9E8676", borderTop: "1px solid rgba(42,28,20,0.08)" }}>
                {hours.note}
              </p>
            </div>
          </FadeIn>

          {/* 전화 */}
          <FadeIn delay={0.08}>
            <div className="card-dark h-full !p-6 sm:!p-8 flex flex-col">
              <p className="section-label" style={{ color: "#F0E8DE" }}><span>예약 및 상담</span></p>
              <a href={`tel:${siteConfig.phone}`} className="font-display text-[2.3rem] sm:text-5xl mt-5 sm:mt-6 leading-none" style={{ color: "#FAF6F1" }}>
                {siteConfig.phoneLabel}
              </a>
              <p className="text-sm mt-4 leading-relaxed" style={{ color: "rgba(240,232,222,0.7)" }}>
                교통사고 · 입원 상담은 전화로 먼저 문의해 주세요. 자동차보험 치료임을 미리 알려주시면 접수가 빠릅니다.
              </p>
              <div className="mt-auto pt-8 flex flex-col gap-2">
                <a href={siteConfig.kakaoLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-sm font-bold py-3.5" style={{ backgroundColor: "#FEE500", color: "#3C1E1E" }}>
                  카카오톡 입원상담 문의
                </a>
                <a href={`tel:${siteConfig.phone}`} className="btn-outline-cream w-full">
                  전화 걸기
                </a>
              </div>
            </div>
          </FadeIn>

          {/* 오시는 길 */}
          <FadeIn delay={0.16}>
            <div className="card-bordered h-full !p-6 sm:!p-8">
              <p className="section-label" style={{ color: "#2A1C14" }}><span>오시는 길</span></p>
              <p className="mt-6 text-lg font-semibold leading-snug" style={{ color: "#2A1C14" }}>{siteConfig.address}</p>
              <p className="text-sm mt-1" style={{ color: "#9E8676" }}>({siteConfig.addressOld})</p>
              <p className="mt-4 text-sm leading-relaxed text-pretty-ko" style={{ color: "#705C4F" }}>
                인천2호선 <strong style={{ color: "#2A1C14" }}>가정역 6번 출구 401m</strong>. 쓰리엠타워로 오시면 3층에 위치하고 있습니다.
              </p>

              <p className="mt-6 text-xs tracking-[0.2em]" style={{ color: "#9E8676" }}>PARKING</p>
              <ul className="mt-2 space-y-2">
                {siteConfig.parking.map((p) => (
                  <li key={p.no} className="flex items-center gap-3 text-sm" style={{ color: "#705C4F" }}>
                    <span className="font-display text-xs w-6 h-6 grid place-items-center rounded-full" style={{ backgroundColor: "#2A1C14", color: "#FAF6F1" }}>{p.no.slice(1)}</span>
                    <span className="font-medium" style={{ color: "#2A1C14" }}>{p.name}</span>
                    <span className="text-xs" style={{ color: "#9E8676" }}>{p.note}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 sm:mt-7 flex gap-2">
                <a href={siteConfig.naverMapLink} target="_blank" rel="noopener noreferrer" className="btn-outline-ink flex-1 !px-4 !py-3 text-sm">
                  네이버 지도
                </a>
                <a href={siteConfig.kakaoMapLink} target="_blank" rel="noopener noreferrer" className="btn-outline-ink flex-1 !px-4 !py-3 text-sm">
                  카카오맵
                </a>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* 지도 */}
        <FadeIn delay={0.1}>
          <div className="mt-5">
            <div className="relative w-full overflow-hidden h-[280px] sm:h-[380px] lg:h-[460px]" style={{ border: "1px solid rgba(42,28,20,0.12)" }}>
              <iframe
                title="루원365한의원 위치 — 구글 지도"
                src={mapSrc}
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5">
              <p className="text-sm text-pretty-ko" style={{ color: "#705C4F" }}>
                <strong style={{ color: "#2A1C14" }}>{siteConfig.address}</strong>
                <span className="mx-2" style={{ color: "#C4B4A8" }}>|</span>
                가정역 6번 출구 401m
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                <a href={siteConfig.googleMapLink} target="_blank" rel="noopener noreferrer" className="btn-outline-ink !py-3 text-sm">
                  구글 지도로 크게 보기
                </a>
                <a href={siteConfig.naverMapLink} target="_blank" rel="noopener noreferrer" className="btn-outline-ink !py-3 text-sm">
                  네이버 지도로 길찾기
                </a>
                <a href={`tel:${siteConfig.phone}`} className="btn-gold !py-3">
                  예약 및 상담 {siteConfig.phoneLabel}
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
