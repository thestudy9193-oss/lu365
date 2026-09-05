"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

const homeLinks = [
  { href: "/#clinics", label: "진료과목" },
  { href: "/#difference", label: "치료 특장점" },
  { href: "/#inpatient", label: "입원실" },
  { href: "/#doctors", label: "의료진" },
  { href: "/#tour", label: "둘러보기" },
  { href: "/#info", label: "진료안내·오시는길" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  // 홈 히어로 위에서는 투명 + 밝은 글자, 스크롤 후엔 크림 배경
  const solid = !isHome || scrolled || menuOpen;
  const fg = solid ? "#2A1C14" : "#FAF6F1";

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: solid ? "rgba(250,246,241,0.92)" : "transparent",
        backdropFilter: solid ? "blur(14px)" : "none",
        borderBottom: solid ? "1px solid rgba(42,28,20,0.08)" : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-[60px] sm:h-[68px] lg:h-[76px]">
          {/* 로고 */}
          <Link href="/" className="flex items-center shrink-0" aria-label="루원365한의원 홈">
            <Image
              src={solid ? "/logo-dark.png" : "/logo-light.png"}
              alt="루원365한의원"
              width={800}
              height={108}
              priority
              className="h-[20px] sm:h-[26px] lg:h-[30px] w-auto"
            />
          </Link>

          {/* 데스크톱 네비 */}
          <nav className="hidden lg:flex items-center gap-7">
            {homeLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[13.5px] font-medium transition-opacity hover:opacity-70"
                style={{ color: fg }}
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/columns"
              className="text-[13.5px] font-semibold transition-opacity hover:opacity-70 flex items-center gap-1.5"
              style={{ color: pathname.startsWith("/columns") ? "#0d9488" : fg }}
            >
              건강이야기
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "#C8A882" }}
              />
            </Link>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-2">
            <a
              href={`tel:${siteConfig.phone}`}
              className="hidden sm:inline-flex items-center gap-2 text-[12.5px] lg:text-[13px] font-semibold px-3.5 lg:px-4 py-2.5 transition-colors"
              style={{
                border: `1px solid ${solid ? "rgba(42,28,20,0.25)" : "rgba(250,246,241,0.45)"}`,
                color: fg,
                borderRadius: 999,
              }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {siteConfig.phoneLabel}
            </a>
            <a
              href={`tel:${siteConfig.phone}`}
              className="sm:hidden grid place-items-center w-10 h-10"
              style={{ color: fg }}
              aria-label={`전화 ${siteConfig.phoneLabel}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden w-10 h-10 grid place-items-center -mr-2"
              style={{ color: fg }}
              aria-label="메뉴"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {menuOpen && (
        <div style={{ backgroundColor: "#FAF6F1", borderTop: "1px solid rgba(42,28,20,0.06)" }}>
          <nav className="max-w-7xl mx-auto px-5 py-3 flex flex-col max-h-[calc(100svh-60px)] overflow-y-auto">
            {homeLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="py-3 text-[15px] font-medium"
                style={{ borderBottom: "1px solid rgba(42,28,20,0.06)", color: "#2A1C14" }}
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/columns"
              className="py-3 text-[15px] font-semibold"
              style={{ borderBottom: "1px solid rgba(42,28,20,0.06)", color: "#0d9488" }}
            >
              건강이야기
            </Link>
            <a
              href={`tel:${siteConfig.phone}`}
              className="mt-3 mb-2 flex items-center justify-center gap-2 text-sm font-bold px-4 py-3.5"
              style={{ backgroundColor: "#2A1C14", color: "#FAF6F1" }}
            >
              예약 및 상담 {siteConfig.phoneLabel}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
