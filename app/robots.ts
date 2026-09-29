import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/columns/write"] },
      // 네이버 검색로봇
      { userAgent: "Yeti", allow: "/", disallow: ["/api/", "/columns/write"] },
      // 다음 검색로봇
      { userAgent: "Daum", allow: "/", disallow: ["/api/", "/columns/write"] },
      // AI 검색·답변 엔진 (GEO) — 인용되려면 수집을 명시적으로 허용한다
      {
        userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Bingbot"],
        allow: "/",
        disallow: ["/api/", "/columns/write"],
      },
    ],
    sitemap: `${siteConfig.seo.siteUrl}/sitemap.xml`,
    host: siteConfig.seo.siteUrl,
  };
}
