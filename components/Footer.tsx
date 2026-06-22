import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#201515" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* 병원 정보 */}
          <div>
            <p className="text-sm font-bold text-canvas-soft mb-1 tracking-tight">
              루원365한의원
            </p>
            <p className="eyebrow mb-4 text-primary-light">
              4명의 한의사 · 365일 진료
            </p>
            <ul className="space-y-1.5 text-sm text-mute">
              <li>{siteConfig.address}</li>
              <li className="text-[#939084]">{siteConfig.addressDetail}</li>
              <li className="mt-2">
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="text-canvas-soft font-semibold hover:text-white transition-colors"
                >
                  📞 {siteConfig.phone}
                </a>
              </li>
            </ul>
          </div>

          {/* 진료시간 */}
          <div>
            <p className="text-sm font-bold text-canvas-soft mb-4">진료시간</p>
            <ul className="space-y-2 text-sm text-mute">
              <li className="flex flex-col gap-0.5">
                <span className="text-[#939084]">평일 (월~금)</span>
                <span className="text-canvas-soft">09:30 - 21:00</span>
                <span className="text-xs text-mute">점심 13:00 - 14:00 / 접수마감 20:30</span>
              </li>
              <li className="flex flex-col gap-0.5 mt-3">
                <span className="text-[#939084]">토·일·공휴일</span>
                <span className="text-canvas-soft">09:00 - 16:00</span>
                <span className="text-xs text-mute">점심 12:00 - 12:30 / 접수마감 15:30</span>
              </li>
            </ul>
          </div>

          {/* 바로가기 */}
          <div>
            <p className="text-sm font-bold text-canvas-soft mb-4">바로가기</p>
            <ul className="space-y-2 text-sm text-mute">
              {[
                { href: "/about", label: "한의원 소개" },
                { href: "/services", label: "진료 안내" },
                { href: "/columns", label: "건강 칼럼" },
                { href: "/contact", label: "오시는 길" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-canvas-soft transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 하단 고지 */}
        <div
          className="mt-10 pt-8 text-xs leading-relaxed"
          style={{ borderTop: "1px solid rgba(248,244,240,0.08)", color: "#605d52" }}
        >
          <p>
            본 사이트의 내용은 의료 정보 제공을 목적으로 하며, 개인의 증상에 대한 진단·치료를 대체하지 않습니다.
            증상이 있으신 경우 의료기관 방문 후 전문 의료진의 상담을 받으시기 바랍니다.
          </p>
          <p className="mt-2" style={{ color: "#3f3c35" }}>
            © {new Date().getFullYear()} 루원365한의원. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
