import { MetadataRoute } from "next";
import { getAllColumns } from "@/lib/columns";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.seo.siteUrl;
  const columns = getAllColumns();

  const staticPages = [
    { url: baseUrl, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/services`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/columns`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  const columnPages = columns.map((column) => ({
    url: `${baseUrl}/columns/${column.slug}`,
    lastModified: column.date ? new Date(column.date) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...columnPages];
}
