import { MetadataRoute } from "next";
import { getAllColumns } from "@/lib/columns";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.seo.siteUrl;
  const columns = await getAllColumns();

  const staticPages = [
    { url: baseUrl, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/columns`, changeFrequency: "weekly" as const, priority: 0.9 },
  ];

  const columnPages = columns.map((column) => ({
    url: `${baseUrl}/columns/${encodeURIComponent(column.slug)}`,
    lastModified: column.date ? new Date(column.date) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...columnPages];
}
