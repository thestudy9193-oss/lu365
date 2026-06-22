"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { siteConfig } from "@/config/site";

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <section
      className="py-20 px-4 relative overflow-hidden"
      style={{ backgroundColor: "#2A1C14" }}
    >
      {/* 배경 장식 */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(200,168,130,0.08) 0%, transparent 60%)",
          transform: "translate(30%, -30%)",
        }}
      />

      <motion.div
        ref={ref}
        className="max-w-3xl mx-auto text-center relative z-10"
        initial={{ opacity: 0, y: 36 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="section-label justify-center mb-4"
          style={{ color: "#C8A882" }}
        >
          <span>Contact</span>
        </div>

        <h2
          className="text-2xl sm:text-3xl font-bold mb-3"
          style={{ color: "#FAF6F1" }}
        >
          진료 문의
        </h2>
        <p className="text-sm mb-2" style={{ color: "#9E8676" }}>
          전화 또는 카카오톡으로 편하게 연락해 주세요.
        </p>
        <p className="text-xs mb-10" style={{ color: "#706050" }}>
          평일 09:30 - 21:00 &nbsp;·&nbsp; 토·일·공휴일 09:00 - 16:00 &nbsp;·&nbsp; 365일 연중무휴
        </p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.a
            href={`tel:${siteConfig.phone}`}
            className="btn-gold w-full sm:w-auto"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            전화 문의 {siteConfig.phone}
          </motion.a>

          {siteConfig.kakaoLink ? (
            <motion.a
              href={siteConfig.kakaoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 font-bold px-6 py-3 rounded-xl transition-colors text-sm"
              style={{ backgroundColor: "#FEE500", color: "#3C1E1E" }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
            >
              카카오톡 상담
            </motion.a>
          ) : (
            <span
              className="w-full sm:w-auto flex items-center justify-center text-sm font-medium px-6 py-3 rounded-xl"
              style={{ backgroundColor: "rgba(254,229,0,0.1)", color: "#8a7200" }}
            >
              카카오톡 상담 (준비중)
            </span>
          )}

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="w-full sm:w-auto"
          >
            <Link href="/contact" className="btn-outline-cream w-full sm:w-auto block text-center">
              오시는 길 보기
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
