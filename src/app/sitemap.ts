import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shelfmark.app";
  const date = new Date("2026-03-01");

  return [
    {
      url: baseUrl,
      lastModified: date,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/methodology`,
      lastModified: date,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: date,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: date,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: date,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
