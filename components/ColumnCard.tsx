"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ColumnMeta } from "@/lib/columns";

const categoryColors: Record<string, string> = {
  "진료 안내": "#E8F5F3",
  "교통사고": "#FEF3E8",
  "통증 관리": "#F0EBF8",
  "추나요법": "#E8F2FE",
  "체력·건강": "#F5F0E8",
};

export default function ColumnCard({ column }: { column: ColumnMeta }) {
  const dateFormatted = column.date
    ? new Date(column.date).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const bgColor = categoryColors[column.category] ?? "#F0E8DE";

  return (
    <Link href={`/columns/${column.slug}`} className="block h-full group">
      <motion.article
        className="h-full flex flex-col overflow-hidden border"
        style={{ backgroundColor: "#fff", borderColor: "rgba(42,28,20,0.08)" }}
        whileHover={{
          y: -6,
          boxShadow: "0 20px 48px rgba(42,28,20,0.12)",
          borderColor: "rgba(200,168,130,0.35)",
        }}
        transition={{ duration: 0.28, ease: "easeOut" }}
      >
        {/* 썸네일 영역 */}
        <div
          className="h-36 flex items-center justify-center flex-shrink-0 relative overflow-hidden"
          style={{ backgroundColor: bgColor }}
        >
          <motion.span
            className="text-5xl"
            style={{ opacity: 0.3 }}
            whileHover={{ opacity: 0.45, scale: 1.08 }}
            transition={{ duration: 0.3 }}
          >
            🌿
          </motion.span>
          <div
            className="absolute bottom-0 left-0 right-0 h-8"
            style={{ background: "linear-gradient(to top, rgba(255,255,255,0.5), transparent)" }}
          />
          <span
            className="absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.8)", color: "#705C4F" }}
          >
            {column.category}
          </span>
        </div>

        {/* 콘텐츠 */}
        <div className="p-5 flex flex-col flex-1">
          <h3
            className="text-sm font-bold leading-snug mb-2 transition-colors group-hover:text-primary"
            style={{ color: "#2A1C14" }}
          >
            {column.title}
          </h3>
          <p
            className="text-xs leading-relaxed flex-1 line-clamp-3"
            style={{ color: "#9E8676" }}
          >
            {column.summary}
          </p>
          <div
            className="mt-4 pt-3 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(42,28,20,0.07)" }}
          >
            <span className="text-xs" style={{ color: "#C4B4A8" }}>
              {dateFormatted}
            </span>
            <span
              className="text-xs font-semibold transition-colors group-hover:text-primary"
              style={{ color: "#C8A882" }}
            >
              자세히 →
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
