import type { Metadata } from "next";
import SectionTitle from "@/components/SectionTitle";
import CTASection from "@/components/CTASection";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "한의원 소개",
  description:
    "루원365한의원 소개. 4명의 한의사가 365일 진료. 교통사고 후유증, 척추·관절, 입원치료 운영. 인천 가정역 6번 출구.",
};

export default function AboutPage() {
  return (
    <>
      {/* 페이지 헤더 */}
      <section
        className="py-20 px-4 relative overflow-hidden"
        style={{ backgroundColor: "#2A1C14" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 100% at 60% 50%, #4A2C1C 0%, #2A1C14 60%)",
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="section-label justify-center mb-4" style={{ color: "#C8A882" }}>
            <span>About</span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: "#FAF6F1", letterSpacing: "-0.5px" }}
          >
            루원365한의원 소개
          </h1>
          <p className="text-sm" style={{ color: "#9E8676" }}>
            4명의 한의사 · 365일 연중무휴 · 인천 가정역 6번 출구
          </p>
        </div>
      </section>

      {/* 주요 숫자 */}
      <section className="py-14 px-4" style={{ backgroundColor: "#FAF6F1" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { num: "4명", label: "한의사 상주" },
              { num: "365일", label: "연중무휴 진료" },
              { num: "3층", label: "외래 진료" },
              { num: "6층", label: "입원실 운영" },
            ].map((s) => (
              <div key={s.label} className="card text-center" style={{ backgroundColor: "#F0E8DE" }}>
                <p className="text-2xl font-bold mb-1" style={{ color: "#0d9488" }}>{s.num}</p>
                <p className="text-xs" style={{ color: "#9E8676" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 투컬럼 소개 */}
      <section className="py-20 px-4" style={{ backgroundColor: "#FAF6F1" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="section-label mb-4" style={{ color: "#9E8676" }}>
                <span>Our Philosophy</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-5 leading-snug" style={{ color: "#2A1C14" }}>
                세심한 상담,
                <br />개인 맞춤 진료
              </h2>
              <div className="space-y-4 text-sm leading-relaxed" style={{ color: "#705C4F" }}>
                <p>
                  루원365한의원은 환자분 한 분 한 분의 상태를 세심하게 살피는 것을 진료의 기본으로 삼습니다.
                  증상을 완화하는 데 그치지 않고, 불편감의 원인을 함께 파악하며 개인에 맞는 진료 방향을 안내해드립니다.
                </p>
                <p>
                  일상 속 건강을 지속적으로 관리할 수 있도록 생활습관 개선에 관한 정보도 함께 안내해드립니다.
                  환자분이 편안하게 이야기할 수 있는 진료 환경을 만들기 위해 노력합니다.
                </p>
                <div
                  className="rounded-xl p-4 text-xs leading-relaxed"
                  style={{ backgroundColor: "#F0E8DE", color: "#9E8676" }}
                >
                  ※ 진료는 의학적 정보 제공을 포함하며, 모든 진단과 치료 결정은 의료진과의 충분한 상담을 바탕으로 이루어집니다.
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {siteConfig.features.map((f) => (
                <div
                  key={f.title}
                  className="flex gap-4 p-5 rounded-xl"
                  style={{ backgroundColor: "#F0E8DE" }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#F0FDFA" }}
                  >
                    <svg className="w-4 h-4" style={{ color: "#0d9488" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold mb-0.5" style={{ color: "#2A1C14" }}>{f.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "#9E8676" }}>{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 시설 */}
      <section className="py-20 px-4" style={{ backgroundColor: "#F0E8DE" }}>
        <div className="max-w-5xl mx-auto">
          <SectionTitle en="Facilities" title="시설 안내" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="card-white">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: "#2A1C14" }}>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: "#2A1C14", color: "#FAF6F1" }}>3F</span>
                외래 진료 (3층)
              </h3>
              <ul className="text-sm space-y-2" style={{ color: "#705C4F" }}>
                {siteConfig.facilities.third_floor.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#0d9488" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-white">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: "#2A1C14" }}>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: "#0d9488", color: "#fff" }}>6F</span>
                입원 치료 (6층)
              </h3>
              <ul className="text-sm space-y-2" style={{ color: "#705C4F" }}>
                {siteConfig.facilities.sixth_floor.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#0d9488" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 진료시간 */}
      <section className="py-20 px-4" style={{ backgroundColor: "#FAF6F1" }}>
        <div className="max-w-5xl mx-auto">
          <SectionTitle en="Hours & Location" title="진료시간 · 오시는 길" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="card-white">
              <h3 className="text-sm font-bold mb-4" style={{ color: "#2A1C14" }}>⏰ 진료시간</h3>
              <ul className="space-y-3 text-sm">
                {[
                  { day: "평일 (월~금)", time: "09:30 – 21:00", note: "점심 13:00-14:00 / 접수마감 20:30" },
                  { day: "토·일·공휴일", time: "09:00 – 16:00", note: "점심 12:00-12:30 / 접수마감 15:30" },
                ].map((r) => (
                  <li key={r.day} className="pb-3" style={{ borderBottom: "1px solid rgba(42,28,20,0.07)" }}>
                    <p className="text-xs mb-0.5" style={{ color: "#9E8676" }}>{r.day}</p>
                    <p className="font-bold" style={{ color: "#2A1C14" }}>{r.time}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#C4B4A8" }}>{r.note}</p>
                  </li>
                ))}
                <li className="text-xs flex items-center gap-2" style={{ color: "#9E8676" }}>
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px]"
                    style={{ backgroundColor: "#F0FDFA", color: "#0d9488" }}>✓</span>
                  365일 연중무휴
                </li>
              </ul>
            </div>
            <div className="card-white">
              <h3 className="text-sm font-bold mb-4" style={{ color: "#2A1C14" }}>📍 위치 & 연락처</h3>
              <ul className="space-y-3 text-sm">
                <li><p className="text-xs mb-0.5" style={{ color: "#9E8676" }}>주소</p>
                  <p className="font-semibold" style={{ color: "#2A1C14" }}>{siteConfig.address}</p></li>
                <li><p className="text-xs mb-0.5" style={{ color: "#9E8676" }}>지하철</p>
                  <p style={{ color: "#705C4F" }}>{siteConfig.addressDetail}</p></li>
                <li><p className="text-xs mb-0.5" style={{ color: "#9E8676" }}>전화</p>
                  <a href={`tel:${siteConfig.phone}`} className="text-lg font-bold hover:underline"
                    style={{ color: "#0d9488" }}>{siteConfig.phone}</a></li>
              </ul>
              <Link href="/contact" className="mt-5 inline-flex items-center gap-1 text-xs font-semibold hover:underline"
                style={{ color: "#705C4F" }}>
                자세한 오시는 길 보기 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
