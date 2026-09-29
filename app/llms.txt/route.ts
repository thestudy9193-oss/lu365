import { getAllColumns } from "@/lib/columns";
import { siteConfig } from "@/config/site";
import { clinicPages } from "@/config/clinicPages";

/**
 * /llms.txt — ChatGPT·Perplexity·Claude 등 AI 검색이 사이트를 요약할 때 읽는 안내 파일 (GEO).
 * https://llmstxt.org 형식. 칼럼은 예약 발행되므로 요청 시 공개된 글만 싣는다.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const url = siteConfig.seo.siteUrl;
  const columns = await getAllColumns();
  const { hours } = siteConfig;

  const body = `# ${siteConfig.name} ${siteConfig.branch}

> ${siteConfig.description}

- 주소: ${siteConfig.address} (지번 ${siteConfig.addressOld}) — ${siteConfig.addressDetail}
- 전화: ${siteConfig.phone}
- 진료시간: ${hours.weekday.label} ${hours.weekday.time} (${hours.weekday.lunch}), ${hours.weekend.label} ${hours.weekend.time} (${hours.weekend.lunch}). ${hours.note}
- 주차: ${siteConfig.parking.map((p) => `${p.name}(${p.note})`).join(", ")}
- 의료진: ${siteConfig.doctors.map((d) => `${d.name} ${d.position}`).join(", ")}
- 교통사고 치료는 자동차보험 적용으로 본인부담금 0원, 1~3인 입원실 운영

## 진료 안내

${clinicPages.map((p) => `- [${p.h1}](${url}/clinics/${p.key}): ${p.description}`).join("\n")}

## 자주 묻는 질문

${siteConfig.faq.map((f) => `- ${f.q} — ${f.a}`).join("\n")}

## 건강 칼럼

${columns.map((c) => `- [${c.title}](${url}/columns/${encodeURIComponent(c.slug)}): ${c.summary}`).join("\n")}

## Optional

- [홈](${url}/)
- [건강 이야기 전체](${url}/columns)
- [네이버 지도](${siteConfig.naverMapLink})
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
