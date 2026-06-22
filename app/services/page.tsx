import type { Metadata } from "next";
import ServiceCard from "@/components/ServiceCard";
import SectionTitle from "@/components/SectionTitle";
import CTASection from "@/components/CTASection";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "진료 안내",
  description:
    "루원365한의원 진료 안내. 교통사고 후유증, 척추·관절 클리닉, 추나요법, 비만·다이어트, 어린이 클리닉, 입원치료.",
};

const additionalInfo = [
  {
    title: "교통사고 한방 진료",
    content:
      "교통사고 이후 발생하는 근골격계 불편감 및 신경계 증상에 대해 한방 진료를 통해 관리받으실 수 있습니다. 자동차 보험 적용 가능 여부는 내원 시 안내해드립니다.",
  },
  {
    title: "초진 상담 절차",
    content:
      "처음 방문하시는 분들은 충분한 상담을 통해 현재 불편하신 증상과 생활패턴 등을 파악합니다. 진료 계획은 상담 내용을 바탕으로 함께 논의합니다.",
  },
  {
    title: "추나요법 안내",
    content:
      "추나요법은 척추와 관절의 구조적 불균형을 교정하는 한방 수기 요법입니다. 건강보험 적용이 가능한 경우가 있으며, 자세한 내용은 내원 상담 시 안내해드립니다.",
  },
  {
    title: "입원치료",
    content:
      "6층에 1~3인실 입원실을 운영합니다. 교통사고 후유증, 수술 후 재활, 척추 질환 등 집중 관리가 필요한 분께 적합합니다.",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* 페이지 헤더 */}
      <section
        className="bg-canvas-soft py-14 px-4 text-center"
        style={{ borderBottom: "1px solid rgba(32,21,21,0.08)" }}
      >
        <p className="eyebrow mb-3">진료 안내</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-4">
          주요 진료 분야
        </h1>
        <p className="text-body text-sm sm:text-base max-w-xl mx-auto">
          교통사고부터 어린이 클리닉까지 다양한 분야의 한방 진료를 안내합니다.
        </p>
      </section>

      {/* 진료 분야 카드 */}
      <section className="py-14 px-4 bg-canvas">
        <div className="max-w-6xl mx-auto">
          <SectionTitle
            en="Services"
            title="루원365한의원 진료 분야"
            subtitle="아래 분야 외에도 다양한 한방 진료에 대해 상담해드립니다."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {siteConfig.services.map((service) => (
              <ServiceCard
                key={service.title}
                title={service.title}
                description={service.description}
                icon={service.icon}
              />
            ))}
          </div>
          <p className="mt-5 text-center text-xs text-mute">
            ※ 진료 분야는 참고용 안내이며, 정확한 진료 내용은 내원 상담을 통해 확인해 주시기 바랍니다.
          </p>
        </div>
      </section>

      {/* 추가 안내 */}
      <section className="py-14 px-4 bg-canvas-soft">
        <div className="max-w-4xl mx-auto">
          <SectionTitle en="Notice" title="진료 관련 안내" />
          <div className="space-y-3">
            {additionalInfo.map((info) => (
              <div key={info.title} className="card-bordered">
                <h3 className="font-bold text-ink mb-2 text-sm">{info.title}</h3>
                <p className="text-xs text-body leading-relaxed">{info.content}</p>
              </div>
            ))}
          </div>
          <div
            className="mt-6 p-5 rounded-xl text-xs text-body leading-relaxed"
            style={{ backgroundColor: "#fff8e6", border: "1px solid rgba(200,150,0,0.15)" }}
          >
            <strong className="text-ink">안내</strong> — 진료 효과는 개인의 상태에 따라 다를 수 있습니다.
            증상이 지속되거나 악화되는 경우 반드시 의료진과 상담하시기 바랍니다.
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
