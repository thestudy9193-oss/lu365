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
    ],
    sitemap: `${siteConfig.seo.siteUrl}/sitemap.xml`,
    host: siteConfig.seo.siteUrl,
  };
}
