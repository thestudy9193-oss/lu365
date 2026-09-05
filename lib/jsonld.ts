import { siteConfig } from "@/config/site";

const url = siteConfig.seo.siteUrl;

/** 병원 정보 — 네이버·구글의 지역 검색(로컬 SEO) 대상 */
export function clinicJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalClinic", "LocalBusiness"],
    "@id": `${url}/#clinic`,
    name: `${siteConfig.name} ${siteConfig.branch}`,
    alternateName: ["루원365한의원", "인천 교통사고한의원", "가정동 한의원", "루원시티 한의원"],
    description: siteConfig.seo.defaultDescription,
    url,
    telephone: siteConfig.phone,
    image: [`${url}${siteConfig.seo.ogImage}`, `${url}/hero-clinic.jpg`],
    logo: `${url}/logo-dark.png`,
    priceRange: "₩₩",
    currenciesAccepted: "KRW",
    paymentAccepted: "현금, 신용카드, 자동차보험",
    address: {
      "@type": "PostalAddress",
      streetAddress: "염곡로464번길 15 쓰리엠타워 3층",
      addressLocality: "서구",
      addressRegion: "인천광역시",
      postalCode: "22883",
      addressCountry: "KR",
    },
    geo: { "@type": "GeoCoordinates", latitude: siteConfig.geo.lat, longitude: siteConfig.geo.lng },
    hasMap: siteConfig.googleMapLink,
    areaServed: [
      { "@type": "City", name: "인천광역시 서구" },
      { "@type": "Place", name: "가정동" },
      { "@type": "Place", name: "루원시티" },
      { "@type": "Place", name: "청라국제도시" },
      { "@type": "Place", name: "검단" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:30",
        closes: "21:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday", "PublicHolidays"],
        opens: "09:00",
        closes: "16:00",
      },
    ],
    medicalSpecialty: ["TraditionalChinese", "PhysicalTherapy", "Rehabilitation"],
    availableService: siteConfig.clinics.map((c) => ({
      "@type": "MedicalTherapy",
      name: c.title,
      description: c.description,
    })),
    employee: siteConfig.doctors.map((d) => ({
      "@type": "Physician",
      name: d.name,
      jobTitle: d.position,
      medicalSpecialty: "TraditionalChinese",
    })),
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "1~3인 입원실", value: true },
      { "@type": "LocationFeatureSpecification", name: "자동차보험 진료", value: true },
      { "@type": "LocationFeatureSpecification", name: "주차 가능", value: true },
      { "@type": "LocationFeatureSpecification", name: "365일 진료", value: true },
    ],
    sameAs: [siteConfig.naverMapLink, siteConfig.kakaoLink].filter(Boolean),
  };
}

/** 자주 묻는 질문 — 검색 스니펫 및 AI 답변(AEO) 대상 */
export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}/#faq`,
    mainEntity: siteConfig.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    url,
    name: `${siteConfig.name} - 교통사고한의원`,
    inLanguage: "ko-KR",
    publisher: { "@id": `${url}/#clinic` },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${url}${it.path}`,
    })),
  };
}

export function articleJsonLd(a: {
  title: string;
  description: string;
  date: string;
  slug: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    dateModified: a.date,
    inLanguage: "ko-KR",
    mainEntityOfPage: `${url}/columns/${encodeURIComponent(a.slug)}`,
    image: a.image ? [a.image.startsWith("http") ? a.image : `${url}${a.image}`] : [`${url}${siteConfig.seo.ogImage}`],
    author: { "@type": "Organization", name: siteConfig.name, url },
    publisher: { "@id": `${url}/#clinic` },
    about: { "@type": "MedicalCondition", name: "교통사고 후유증" },
  };
}

export function jsonLdScript(data: object) {
  return { __html: JSON.stringify(data) };
}
