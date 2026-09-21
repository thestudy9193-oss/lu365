import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import ClinicsSection from "@/components/home/ClinicsSection";
import DifferentiationSection from "@/components/home/DifferentiationSection";
import InpatientSection from "@/components/home/InpatientSection";
import DoctorsSection from "@/components/home/DoctorsSection";
import FacilitySection from "@/components/home/FacilitySection";
import InfoSection from "@/components/home/InfoSection";
import StoriesSection from "@/components/home/StoriesSection";
import FaqSection from "@/components/home/FaqSection";
import { getAllColumns } from "@/lib/columns";
import { siteConfig } from "@/config/site";
import { carouselJsonLd, clinicJsonLd, faqJsonLd, jsonLdScript, websiteJsonLd } from "@/lib/jsonld";

// 칼럼이 런타임에 추가되므로 요청 시 렌더링
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: siteConfig.seo.defaultTitle,
  description: siteConfig.seo.defaultDescription,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const columns = await getAllColumns();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(clinicJsonLd())} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqJsonLd())} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(websiteJsonLd())} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(carouselJsonLd())} />

      <Hero />
      <ClinicsSection />
      <DifferentiationSection />
      <InpatientSection />
      <DoctorsSection />
      <FacilitySection />
      <FaqSection />
      <StoriesSection columns={columns} />
      <InfoSection />
    </>
  );
}
