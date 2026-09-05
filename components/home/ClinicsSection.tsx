import Image from "next/image";
import SectionTitle from "@/components/SectionTitle";
import FadeIn from "@/components/animations/FadeIn";
import { siteConfig } from "@/config/site";

export default function ClinicsSection() {
  return (
    <section id="clinics" className="relative py-24 sm:py-32 px-5 sm:px-8 bg-canvas scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <SectionTitle
            en="Luwon 365 Clinics"
            title="교통사고부터 척추·체형까지, 루원365는 이렇게 진료합니다"
            subtitle="인천 교통사고한의원 루원365는 교통사고 후유증부터 목·허리 디스크, 관절, 체형교정, 다이어트, 입원치료까지 통증의 원인을 찾아 1:1 맞춤 진료를 진행합니다."
          />
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {siteConfig.clinics.map((c, i) => (
            <FadeIn key={c.key} delay={i * 0.06}>
              <article className="group relative overflow-hidden h-[280px] sm:h-[340px] lg:h-[380px]" style={{ backgroundColor: "#2A1C14" }}>
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                  style={{ opacity: 0.55 }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(180deg, rgba(42,28,20,0.1) 0%, rgba(42,28,20,0.45) 45%, rgba(42,28,20,0.92) 100%)",
                  }}
                />
                <div className="absolute inset-0 p-5 sm:p-7 flex flex-col justify-end">
                  <p className="font-display italic text-xs tracking-wide mb-2" style={{ color: "#C8A882" }}>
                    Clinic 0{i + 1}
                  </p>
                  <p className="text-[12.5px] mb-1" style={{ color: "rgba(250,246,241,0.7)" }}>{c.sub}</p>
                  <h3 className="font-serif-kr text-xl sm:text-2xl font-semibold mb-2 sm:mb-3" style={{ color: "#FAF6F1" }}>
                    {c.title}
                  </h3>
                  <p
                    className="hover-reveal text-[13px] sm:text-[13.5px] leading-relaxed max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-500 text-pretty-ko"
                    style={{ color: "rgba(250,246,241,0.8)" }}
                  >
                    {c.description}
                  </p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
