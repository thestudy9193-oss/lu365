import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Footer() {
  const { hours } = siteConfig;
  return (
    <footer style={{ backgroundColor: "#201515" }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-9 sm:gap-10">
          {/* 대표전화 + 상호 */}
          <div className="md:col-span-5">
            <Image src="/logo-light.png" alt="루원365한의원" width={800} height={108} className="h-[26px] w-auto mb-7 opacity-90" />
            <p className="text-xs tracking-[0.2em] mb-3" style={{ color: "#9E8676" }}>대표전화</p>
            <a href={`tel:${siteConfig.phone}`} className="font-display text-[2.1rem] sm:text-4xl lg:text-5xl leading-none" style={{ color: "#FAF6F1" }}>
              {siteConfig.phoneLabel}
            </a>
            <dl className="mt-8 grid grid-cols-[92px_1fr] gap-y-1.5 text-[13px]" style={{ color: "#9E8676" }}>
              <dt>상호명</dt><dd style={{ color: "#C4B4A8" }}>{siteConfig.name}</dd>
              <dt>대표자</dt><dd style={{ color: "#C4B4A8" }}>{siteConfig.businessOwner}</dd>
              <dt>사업자등록번호</dt><dd style={{ color: "#C4B4A8" }}>{siteConfig.businessNo}</dd>
            </dl>
          </div>

          {/* 진료시간 */}
          <div className="md:col-span-3">
            <p className="text-xs tracking-[0.2em] mb-3" style={{ color: "#9E8676" }}>진료시간 안내</p>
            <ul className="space-y-3 text-[13px]" style={{ color: "#C4B4A8" }}>
              <li className="flex justify-between gap-4"><span style={{ color: "#9E8676" }}>평일</span><span className="font-display">{hours.weekday.time}</span></li>
              <li className="flex justify-between gap-4"><span style={{ color: "#9E8676" }}>주말/공휴일</span><span className="font-display">{hours.weekend.time}</span></li>
              <li className="flex justify-between gap-4"><span style={{ color: "#9E8676" }}>점심(평일)</span><span className="font-display">13:00 - 14:00</span></li>
              <li className="flex justify-between gap-4"><span style={{ color: "#9E8676" }}>점심(주말)</span><span className="font-display">12:00 - 12:30</span></li>
            </ul>
            <p className="mt-4 text-xs" style={{ color: "#705C4F" }}>* 365일 연중무휴 진료</p>
          </div>

          {/* 오시는 길 + 바로가기 */}
          <div className="md:col-span-4">
            <p className="text-xs tracking-[0.2em] mb-3" style={{ color: "#9E8676" }}>오시는 길</p>
            <p className="text-[13px] leading-relaxed" style={{ color: "#C4B4A8" }}>{siteConfig.address}</p>
            <p className="text-xs mt-1" style={{ color: "#705C4F" }}>{siteConfig.addressDetail}</p>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13px]" style={{ color: "#9E8676" }}>
              <li><a href="/#clinics" className="hover:text-white transition-colors">진료과목</a></li>
              <li><a href="/#doctors" className="hover:text-white transition-colors">의료진</a></li>
              <li><a href="/#tour" className="hover:text-white transition-colors">둘러보기</a></li>
              <li><Link href="/columns" className="hover:text-white transition-colors">건강이야기</Link></li>
              <li><a href={siteConfig.kakaoLink} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">카카오톡 상담</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 pt-7 sm:pt-8 text-[11.5px] sm:text-xs leading-relaxed text-pretty-ko" style={{ borderTop: "1px solid rgba(248,244,240,0.08)", color: "#605d52" }}>
          <p>
            본 사이트의 내용은 의료 정보 제공을 목적으로 하며, 개인의 증상에 대한 진단·치료를 대체하지 않습니다. 치료 결과는 개인의 체질과
            건강 상태에 따라 차이가 있을 수 있습니다.
          </p>
          <p className="mt-2" style={{ color: "#3f3c35" }}>
            Copyright © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
