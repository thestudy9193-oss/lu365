"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

/**
 * 데스크톱: 우측 세로 퀵메뉴 (가까이한의원 스타일)
 * 모바일: 하단 고정 액션바 — 본문을 가리지 않도록
 */
export default function QuickMenu() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ── 모바일: 하단 고정 바 ── */}
      <div
        className="lg:hidden fixed inset-x-0 bottom-0 z-40"
        style={{
          backgroundColor: "rgba(42,28,20,0.96)",
          backdropFilter: "blur(10px)",
          paddingBottom: "env(safe-area-inset-bottom)",
          borderTop: "1px solid rgba(250,246,241,0.12)",
        }}
      >
        <div className="grid grid-cols-4">
          <a href={`tel:${siteConfig.phone}`} className="bar-item" style={{ color: "#FAF6F1" }}>
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>전화 문의</span>
          </a>
          <a
            href={siteConfig.kakaoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bar-item"
            style={{ color: "#FEE500" }}
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.48 3 2 6.6 2 11c0 2.8 1.86 5.26 4.66 6.67l-1.1 4.05 4.66-3.09c.58.08 1.17.13 1.78.13 5.52 0 10-3.6 10-8S17.52 3 12 3z" />
            </svg>
            <span>카톡 상담</span>
          </a>
          <a href="/#info" className="bar-item" style={{ color: "#FAF6F1" }}>
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>오시는 길</span>
          </a>
          <Link href="/columns" className="bar-item" style={{ color: "#C8A882" }}>
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>건강이야기</span>
          </Link>
        </div>
      </div>

      {/* 모바일 TOP 버튼 — 하단 바 위에 작게 */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="lg:hidden fixed right-3 z-40 w-10 h-10 grid place-items-center rounded-full shadow-lg transition-all duration-300"
        style={{
          bottom: "calc(66px + env(safe-area-inset-bottom))",
          backgroundColor: "rgba(250,246,241,0.95)",
          color: "#2A1C14",
          border: "1px solid rgba(42,28,20,0.12)",
          opacity: show ? 1 : 0,
          pointerEvents: show ? "auto" : "none",
        }}
        aria-label="맨 위로"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* ── 데스크톱: 우측 세로 퀵메뉴 ── */}
      <div
        className="hidden lg:flex fixed right-5 bottom-5 z-40 flex-col items-center gap-2 transition-all duration-300"
        style={{
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(12px)",
          pointerEvents: show ? "auto" : "none",
        }}
      >
        <div
          className="flex flex-col items-center py-2 shadow-lg"
          style={{
            backgroundColor: "rgba(250,246,241,0.96)",
            border: "1px solid rgba(42,28,20,0.1)",
            borderRadius: 999,
            backdropFilter: "blur(10px)",
          }}
        >
          <a href={siteConfig.kakaoLink} target="_blank" rel="noopener noreferrer" className="quick-item" title="카톡 상담">
            <span className="w-9 h-9 grid place-items-center rounded-full" style={{ backgroundColor: "#FEE500", color: "#3C1E1E" }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.48 3 2 6.6 2 11c0 2.8 1.86 5.26 4.66 6.67l-1.1 4.05 4.66-3.09c.58.08 1.17.13 1.78.13 5.52 0 10-3.6 10-8S17.52 3 12 3z" />
              </svg>
            </span>
            <span>카톡 상담</span>
          </a>
          <a href={`tel:${siteConfig.phone}`} className="quick-item" title="전화">
            <span className="w-9 h-9 grid place-items-center rounded-full" style={{ backgroundColor: "#2A1C14", color: "#FAF6F1" }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </span>
            <span>전화</span>
          </a>
          <Link href="/columns" className="quick-item" title="건강이야기">
            <span className="w-9 h-9 grid place-items-center rounded-full" style={{ backgroundColor: "#0d9488", color: "#fff" }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </span>
            <span>건강이야기</span>
          </Link>
        </div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-11 h-11 grid place-items-center rounded-full shadow-lg"
          style={{ backgroundColor: "#2A1C14", color: "#FAF6F1" }}
          aria-label="맨 위로"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
    </>
  );
}
