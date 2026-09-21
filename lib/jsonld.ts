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
  images?: string[];
  tags?: string[];
  wordCount?: number;
}) {
  const abs = (u: string) => (u.startsWith("http") ? u : `${url}${u}`);
  const images = [a.image, ...(a.images ?? [])].filter(Boolean) as string[];
  const lead = siteConfig.doctors[0];
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    dateModified: a.date,
    inLanguage: "ko-KR",
    mainEntityOfPage: `${url}/columns/${encodeURIComponent(a.slug)}`,
    image: images.length ? images.map(abs) : [`${url}${siteConfig.seo.ogImage}`],
    // 의료 글은 작성·감수 주체가 드러나야 검색엔진과 AI가 신뢰도(E-E-A-T)를 인정한다
    author: lead
      ? { "@type": "Physician", name: lead.name, jobTitle: lead.position, worksFor: { "@id": `${url}/#clinic` } }
      : { "@type": "Organization", name: siteConfig.name, url },
    reviewedBy: { "@id": `${url}/#clinic` },
    publisher: { "@id": `${url}/#clinic` },
    about: { "@type": "MedicalCondition", name: "교통사고 후유증" },
    audience: { "@type": "Patient", geographicArea: { "@type": "City", name: "인천광역시 서구" } },
    ...(a.tags?.length ? { keywords: a.tags.join(", ") } : {}),
    ...(a.wordCount ? { wordCount: a.wordCount } : {}),
    // 음성 비서·AI 요약이 우선 읽을 영역
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".prose-column h2", ".prose-column blockquote"] },
  };
}

/** 마크다운 문법을 걷어내고 평문만 남긴다 (구조화 데이터용) */
const stripMd = (s: string) =>
  s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[*_`#]/g, "")
    .replace(/^[-–]\s+/, "")
    .trim();

/**
 * 본문 마크다운의 "자주 묻는 질문" 섹션에서 Q&A 를 뽑는다.
 * `## 자주 묻는 질문` 아래의 `### 질문` + 이어지는 문단을 한 쌍으로 본다.
 */
export function extractFaq(markdown: string): { q: string; a: string }[] {
  const lines = (markdown || "").replace(/\r\n/g, "\n").split("\n");
  const start = lines.findIndex((l) => /^##\s+.*(자주\s*묻는\s*질문|자주\s*하는\s*질문|FAQ)/i.test(l));
  if (start === -1) return [];

  const out: { q: string; a: string }[] = [];
  let q = "";
  let buf: string[] = [];
  const flush = () => {
    const a = buf.join(" ").replace(/\s+/g, " ").trim();
    if (q && a) out.push({ q, a });
    q = "";
    buf = [];
  };

  for (const line of lines.slice(start + 1)) {
    if (/^##\s/.test(line)) break; // 다음 대제목에서 섹션 종료
    if (/^###\s+/.test(line)) {
      flush();
      q = stripMd(line.replace(/^###\s+/, ""));
      continue;
    }
    if (/^(---|>)/.test(line)) continue;
    if (q && line.trim()) buf.push(stripMd(line));
  }
  flush();
  return out.slice(0, 10);
}

/** 칼럼 본문에서 뽑은 Q&A → FAQPage (구글 리치결과 · AI 답변 인용 대상) */
export function columnFaqJsonLd(slug: string, qa: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}/columns/${encodeURIComponent(slug)}#faq`,
    mainEntity: qa.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/**
 * 네이버 캐러셀 (ListItem) — 검색결과에 카드 목록으로 노출되는 구조화 데이터.
 * 네이버 가이드: image 만 필수, 1페이지에 1개 목록, 항목·이미지 중복 금지,
 * 로고나 기본 이미지는 쓰지 않는다. url 은 절대 경로로 넣는다.
 * https://searchadvisor.naver.com/guide/structured-data-carousel
 */
export function carouselJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${url}/#carousel`,
    itemListElement: siteConfig.carousel.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      image: `${url}${c.image}`,
      url: `${url}${c.path}`,
    })),
  };
}

export function jsonLdScript(data: object) {
  return { __html: JSON.stringify(data) };
}
