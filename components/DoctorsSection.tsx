"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";

type Rot = { x: number; y: number };

const visuals = [
  {
    icon: "🦴",
    photo: "/doctor-oh.jpg",
    positionEn: "Head Director",
    cardBg: "linear-gradient(150deg, #5C3A26 0%, #3D2419 55%, #2A1C14 100%)",
    accent: "#C8A882",
    topOffset: 0,
    initRot: -2.5,
  },
  {
    icon: "🤲",
    positionEn: "Director",
    cardBg: "linear-gradient(150deg, #1E3835 0%, #112220 55%, #0a1816 100%)",
    accent: "#4DB6AC",
    topOffset: 52,
    initRot: 2,
  },
  {
    icon: "🌿",
    positionEn: "Director",
    cardBg: "linear-gradient(150deg, #4A3020 0%, #301C10 55%, #1e100a 100%)",
    accent: "#E8D5B8",
    topOffset: 20,
    initRot: -1.5,
  },
  {
    icon: "🌱",
    positionEn: "Director",
    cardBg: "linear-gradient(150deg, #2C3044 0%, #1A1E30 55%, #10121e 100%)",
    accent: "#C8A882",
    topOffset: 72,
    initRot: 3,
  },
];

export default function DoctorsSection() {
  const doctors = siteConfig.doctors;
  const [rots, setRots] = useState<Rot[]>(doctors.map(() => ({ x: 0, y: 0 })));
  const [hovered, setHovered] = useState<number | null>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>, i: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = -((e.clientY - cy) / (rect.height / 2)) * 14;
    const ry = ((e.clientX - cx) / (rect.width / 2)) * 14;
    setRots((prev) => prev.map((r, idx) => (idx === i ? { x: rx, y: ry } : r)));
    setHovered(i);
  };

  const onLeave = (i: number) => {
    setRots((prev) => prev.map((r, idx) => (idx === i ? { x: 0, y: 0 } : r)));
    setHovered(null);
  };

  return (
    <section className="py-20 sm:py-28 px-4 overflow-hidden" style={{ backgroundColor: "#F0E8DE" }}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-16 sm:mb-20">
          <div>
            <div className="section-label mb-3" style={{ color: "#9E8676" }}>
              <span>Our Doctors</span>
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: "#2A1C14", letterSpacing: "-0.3px" }}
            >
              의료진 소개
            </h2>
          </div>
          <p
            className="hidden sm:block text-xs leading-relaxed text-right"
            style={{ color: "#9E8676", maxWidth: "180px" }}
          >
            4명의 한의사가
            <br />
            365일 함께합니다
          </p>
        </div>

        {/* Desktop: staggered tilt cards */}
        <div
          className="hidden sm:flex gap-4 lg:gap-5 items-start"
          style={{ perspective: "1400px", paddingBottom: "80px" }}
        >
          {doctors.map((doc, i) => {
            const v = visuals[i];
            const active = hovered === i;
            return (
              <div
                key={i}
                className="flex-1 cursor-pointer select-none"
                style={{ marginTop: `${v.topOffset}px` }}
                onMouseMove={(e) => onMove(e, i)}
                onMouseLeave={() => onLeave(i)}
              >
                <div
                  style={{
                    transform: active
                      ? `perspective(1400px) rotateX(${rots[i].x}deg) rotateY(${rots[i].y}deg) scale(1.04) rotateZ(0deg)`
                      : `perspective(1400px) rotateZ(${v.initRot}deg)`,
                    transition: active
                      ? "transform 0.07s linear, box-shadow 0.25s ease"
                      : "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease",
                    transformStyle: "preserve-3d",
                    willChange: "transform",
                    boxShadow: active
                      ? "0 40px 70px rgba(42,28,20,0.4), 0 12px 24px rgba(42,28,20,0.25)"
                      : "0 8px 32px rgba(42,28,20,0.18)",
                  }}
                >
                  {/* Photo area */}
                  <div
                    className="relative overflow-hidden flex flex-col justify-between"
                    style={{ background: v.cardBg, height: "290px", padding: "22px" }}
                  >
                    {/* Radial glow top */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: `radial-gradient(ellipse 110% 70% at 50% -10%, ${v.accent}20 0%, transparent 60%)`,
                        pointerEvents: "none",
                      }}
                    />

                    {/* Top label */}
                    <p
                      className="text-[10px] font-medium tracking-[2.5px] uppercase relative z-10"
                      style={{ color: v.accent, opacity: 0.65 }}
                    >
                      {v.positionEn}
                    </p>

                    {/* Center: 사진 있으면 사진, 없으면 아이콘 */}
                    <div className="flex items-center justify-center flex-1 relative z-10 overflow-hidden">
                      {"photo" in v && v.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={v.photo}
                          alt={doc.name || doc.position}
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center 10%",
                            opacity: 0.9,
                            mixBlendMode: "luminosity",
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: "72px", opacity: 0.18, lineHeight: 1 }}>
                          {v.icon}
                        </span>
                      )}
                    </div>

                    {/* Bottom info */}
                    <div className="relative z-10">
                      <p
                        className="text-[11px] font-semibold mb-1"
                        style={{ color: v.accent }}
                      >
                        {doc.specialty}
                      </p>
                      <p
                        className="text-base font-bold leading-snug"
                        style={{ color: "#FAF6F1" }}
                      >
                        {doc.name ? `${doc.name} ` : ""}
                        {doc.position}
                      </p>
                    </div>

                    {/* Bottom fade overlay */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "45%",
                        background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent)",
                        pointerEvents: "none",
                      }}
                    />
                  </div>

                  {/* Info panel */}
                  <div
                    style={{
                      backgroundColor: "#2A1C14",
                      padding: "16px 22px 20px",
                      borderTop: `1px solid ${v.accent}20`,
                    }}
                  >
                    <p className="text-xs leading-relaxed" style={{ color: "#9E8676" }}>
                      {doc.bio}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: 2×2 grid */}
        <div className="sm:hidden grid grid-cols-2 gap-3">
          {doctors.map((doc, i) => {
            const v = visuals[i];
            return (
              <div key={i} style={{ boxShadow: "0 4px 20px rgba(42,28,20,0.18)" }}>
                <div
                  className="relative overflow-hidden flex flex-col justify-between"
                  style={{ background: v.cardBg, height: "180px", padding: "16px" }}
                >
                  <p
                    className="text-[9px] font-medium tracking-[2px] uppercase"
                    style={{ color: v.accent, opacity: 0.65 }}
                  >
                    {v.positionEn}
                  </p>
                  <div>
                    <p className="text-[11px] font-semibold mb-0.5" style={{ color: v.accent }}>
                      {doc.specialty}
                    </p>
                    <p className="text-sm font-bold" style={{ color: "#FAF6F1" }}>
                      {doc.name ? `${doc.name} ` : ""}
                      {doc.position}
                    </p>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0, left: 0, right: 0, height: "40%",
                      background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
                <div style={{ backgroundColor: "#2A1C14", padding: "12px 16px" }}>
                  <p className="text-xs leading-relaxed" style={{ color: "#9E8676" }}>
                    {doc.bio}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Placeholder note */}
        {doctors.every((d) => !d.name) && (
          <p className="mt-10 text-center text-xs" style={{ color: "#C4B4A8" }}>
            ※ 원장님 성함은{" "}
            <code className="text-xs" style={{ color: "#9E8676" }}>config/site.ts</code>
            의 <code className="text-xs" style={{ color: "#9E8676" }}>doctors[].name</code>에 입력해 주세요.
          </p>
        )}
      </div>
    </section>
  );
}
