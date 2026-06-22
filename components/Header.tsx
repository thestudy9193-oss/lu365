"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/config/site";

const navLinks = [
  { href: "/", label: "홈" },
  { href: "/about", label: "한의원 소개" },
  { href: "/services", label: "진료 안내" },
  { href: "/columns", label: "건강 칼럼" },
  { href: "/contact", label: "오시는 길" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: "#FAF6F1" }}>

      {/* 상단 정보 바 */}
      <div
        className="hidden md:block"
        style={{
          backgroundColor: "#2A1C14",
          borderBottom: "1px solid rgba(200,168,130,0.15)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6 text-xs" style={{ color: "#9E8676" }}>
            <span>📍 {siteConfig.address}</span>
            <span>⏰ 평일 09:30 - 21:00 &nbsp;|&nbsp; 주말·공휴일 09:00 - 16:00</span>
          </div>
          <a
            href={`tel:${siteConfig.phone}`}
            className="flex items-center gap-1.5 text-xs font-semibold"
            style={{ color: "#C8A882" }}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            {siteConfig.phone}
          </a>
        </div>
      </div>

      {/* 메인 네비 */}
      <div style={{ borderBottom: "1px solid rgba(42,28,20,0.08)", backgroundColor: "#FAF6F1" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 로고 */}
            <Link href="/" className="flex items-center">
              <span className="font-bold tracking-tight" style={{ color: "#2A1C14", fontSize: "17px" }}>
                루원365<span style={{ color: "#0d9488" }}>한의원</span>
              </span>
            </Link>

            {/* 데스크탑 네비 */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-primary border-b-2 border-primary pb-0.5"
                      : ""
                  }`}
                  style={
                    pathname !== link.href
                      ? { color: "#705C4F" }
                      : {}
                  }
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* 예약/문의 CTA */}
            <a
              href={`tel:${siteConfig.phone}`}
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl transition-colors"
              style={{ backgroundColor: "#0d9488", color: "#fff" }}
            >
              지금 전화 문의
            </a>

            {/* 모바일 햄버거 */}
            <button
              className="md:hidden p-2 rounded-lg"
              style={{ color: "#705C4F" }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="메뉴"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {menuOpen && (
        <div style={{ backgroundColor: "#FAF6F1", borderBottom: "1px solid rgba(42,28,20,0.08)" }}>
          <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 text-sm font-medium"
                style={{
                  borderBottom: "1px solid rgba(42,28,20,0.06)",
                  color: pathname === link.href ? "#0d9488" : "#2A1C14",
                }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${siteConfig.phone}`}
              className="mt-3 mb-2 flex items-center justify-center gap-2 text-sm font-bold px-4 py-3 rounded-xl"
              style={{ backgroundColor: "#2A1C14", color: "#FAF6F1" }}
            >
              📞 {siteConfig.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
