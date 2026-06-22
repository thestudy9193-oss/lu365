import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "오시는 길 · 문의",
  description:
    "루원365한의원 오시는 길. 인천 서구 염곡로464번길 15 쓰리엠타워 3층. 가정역 6번 출구 도보 5분. 전화 0507-1323-4975.",
};

const hoursData = [
  {
    days: "월요일 - 금요일",
    time: "09:30 - 21:00",
    lunch: "점심 13:00 - 14:00",
    closing: "접수마감 20:30",
    isHoliday: false,
  },
  {
    days: "토요일 · 일요일 · 공휴일",
    time: "09:00 - 16:00",
    lunch: "점심 12:00 - 12:30",
    closing: "접수마감 15:30",
    isHoliday: false,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* 페이지 헤더 */}
      <section
        className="bg-canvas-soft py-14 px-4 text-center"
        style={{ borderBottom: "1px solid rgba(32,21,21,0.08)" }}
      >
        <p className="eyebrow mb-3">찾아오시는 길</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-4">
          오시는 길 · 문의
        </h1>
        <p className="text-body text-sm sm:text-base max-w-xl mx-auto">
          진료 예약 및 문의, 위치를 안내해드립니다.
        </p>
      </section>

      {/* 연락처 & 진료시간 */}
      <section className="py-14 px-4 bg-canvas">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* 연락처 */}
            <div className="card-bordered">
              <h2 className="text-sm font-bold text-ink mb-5 flex items-center gap-2">
                <span className="text-xl">📞</span> 연락처
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-mute mb-1">전화 문의</p>
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="text-2xl font-bold text-primary hover:underline"
                  >
                    {siteConfig.phone}
                  </a>
                </div>
                <div style={{ borderTop: "1px solid rgba(32,21,21,0.08)", paddingTop: "16px" }}>
                  <p className="text-xs text-mute mb-1">주소</p>
                  <p className="text-sm font-semibold text-ink">{siteConfig.address}</p>
                  <p className="text-xs text-body mt-1">{siteConfig.addressDetail}</p>
                </div>
                <div>
                  <p className="text-xs text-mute mb-1">주차 안내</p>
                  <p className="text-xs text-body leading-relaxed">{siteConfig.parking}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="btn-primary text-sm"
                >
                  📞 전화하기
                </a>
                {siteConfig.kakaoLink ? (
                  <a
                    href={siteConfig.kakaoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#FEE500] text-[#3C1E1E] font-semibold px-4 py-3 rounded-xl text-sm hover:bg-[#F6DC00] transition-colors"
                  >
                    카카오톡으로 문의하기
                  </a>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-sm font-medium px-4 py-3 rounded-xl"
                    style={{ backgroundColor: "rgba(254,229,0,0.12)", color: "#a8920a" }}>
                    카카오톡 상담 (준비 중)
                  </div>
                )}
              </div>
            </div>

            {/* 진료시간 */}
            <div className="card-bordered">
              <h2 className="text-sm font-bold text-ink mb-5 flex items-center gap-2">
                <span className="text-xl">⏰</span> 진료시간
              </h2>
              <ul className="space-y-4">
                {hoursData.map((row) => (
                  <li
                    key={row.days}
                    className="pb-4"
                    style={{ borderBottom: "1px solid rgba(32,21,21,0.08)" }}
                  >
                    <p className="text-xs text-mute mb-1">{row.days}</p>
                    <p className="text-base font-bold text-ink">{row.time}</p>
                    <p className="text-xs text-body-mid mt-0.5">
                      {row.lunch} &nbsp;/&nbsp; {row.closing}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 mt-4">
                <span className="w-5 h-5 rounded-full bg-primary-light text-primary flex items-center justify-center text-[10px] flex-shrink-0">✓</span>
                <p className="text-xs text-body">{siteConfig.hours.note}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 지도 */}
      <section className="py-10 px-4 bg-canvas-soft">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-bold text-ink mb-4">📍 찾아오시는 길</h2>

          <div
            className="rounded-xl flex items-center justify-center h-64"
            style={{
              backgroundColor: "#f0fdfa",
              border: "1px solid rgba(13,148,136,0.15)",
            }}
          >
            {siteConfig.naverMapLink ? (
              <a
                href={siteConfig.naverMapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 text-primary font-semibold text-sm hover:underline"
              >
                <span className="text-4xl">🗺️</span>
                네이버 지도에서 보기
              </a>
            ) : (
              <div className="text-center">
                <p className="text-4xl mb-3">🗺️</p>
                <p className="text-sm font-semibold text-ink mb-1">{siteConfig.address}</p>
                <p className="text-xs text-body">{siteConfig.addressDetail}</p>
                <p className="text-xs text-mute mt-3">네이버 지도 링크 등록 예정</p>
              </div>
            )}
          </div>

          {/* 교통 안내 */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card-bordered">
              <h3 className="text-xs font-bold text-ink mb-2 flex items-center gap-1.5">
                <span>🚇</span> 지하철
              </h3>
              <p className="text-xs text-body leading-relaxed">
                인천 2호선 <strong className="text-ink">가정역 6번 출구</strong>(기존 4번 출구)<br />
                [쓰리엠타워] 3층 도보 약 5분
              </p>
            </div>
            <div className="card-bordered">
              <h3 className="text-xs font-bold text-ink mb-2 flex items-center gap-1.5">
                <span>🚗</span> 주차
              </h3>
              <p className="text-xs text-body leading-relaxed">
                본원 건물 주차장 이용<br />
                만차 시 <strong className="text-ink">에이스타워</strong>(맞은편) 또는<br />
                <strong className="text-ink">엔시티타워</strong> 주차 이용 가능
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
