import FadeIn from "@/components/animations/FadeIn";
import SectionTitle from "@/components/SectionTitle";
import { siteConfig } from "@/config/site";

/** 자주 묻는 질문 — 검색 스니펫·AI 답변(AEO) 노출용 */
export default function FaqSection() {
  return (
    <section id="faq" className="relative py-16 sm:py-24 lg:py-32 px-5 sm:px-8 bg-canvas scroll-mt-16">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <SectionTitle
            en="FAQ"
            title="교통사고 한의원, 자주 묻는 질문"
            subtitle="교통사고 후유증 치료와 자동차보험 적용, 입원치료에 대해 가장 많이 문의하시는 내용을 정리했습니다."
          />
        </FadeIn>

        <div style={{ borderTop: "1px solid rgba(42,28,20,0.12)" }}>
          {siteConfig.faq.map((f, i) => (
            <FadeIn key={f.q} delay={i * 0.05}>
              <details className="group py-6" style={{ borderBottom: "1px solid rgba(42,28,20,0.12)" }}>
                <summary className="flex items-start gap-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="font-display text-sm mt-0.5 shrink-0" style={{ color: "#C8A882" }}>
                    Q{i + 1}
                  </span>
                  <h3
                    className="flex-1 font-serif-kr text-[1.05rem] sm:text-xl font-semibold leading-snug text-pretty-ko"
                    style={{ color: "#2A1C14" }}
                  >
                    {f.q}
                  </h3>
                  <span
                    className="shrink-0 mt-1 transition-transform group-open:rotate-180"
                    style={{ color: "#9E8676" }}
                    aria-hidden="true"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p
                  className="mt-4 pl-0 sm:pl-9 text-[14.5px] sm:text-[15px] leading-[1.9] text-pretty-ko"
                  style={{ color: "#705C4F" }}
                >
                  {f.a}
                </p>
              </details>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
