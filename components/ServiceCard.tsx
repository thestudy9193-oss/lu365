"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type ServiceCardProps = {
  title: string;
  description: string;
  icon: string;
  href?: string;
};

export default function ServiceCard({ title, description, icon, href }: ServiceCardProps) {
  const inner = (
    <motion.div
      className="card-white h-full flex flex-col"
      whileHover={{ y: -5, boxShadow: "0 16px 40px rgba(42,28,20,0.13)" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <motion.div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 flex-shrink-0"
        style={{ backgroundColor: "#FAF6F1" }}
        whileHover={{ scale: 1.15, rotate: 4 }}
        transition={{ duration: 0.2 }}
      >
        {icon}
      </motion.div>
      <h3
        className="text-sm font-bold mb-2"
        style={{ color: "#2A1C14" }}
      >
        {title}
      </h3>
      <p className="text-xs leading-relaxed flex-1" style={{ color: "#9E8676" }}>
        {description}
      </p>
      {href && (
        <p className="mt-3 text-xs font-semibold" style={{ color: "#C8A882" }}>
          자세히 보기 →
        </p>
      )}
    </motion.div>
  );

  if (href) return <Link href={href} className="block h-full">{inner}</Link>;
  return inner;
}
