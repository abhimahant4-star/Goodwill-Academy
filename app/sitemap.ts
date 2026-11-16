import type { MetadataRoute } from "next";
import { getCategories, getCourses } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, courses] = await Promise.all([getCategories(), getCourses()]);
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/courses`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/certificate`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    ...categories.map((c) => ({
      url: `${SITE_URL}/courses/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...courses.map((c) => ({
      url: `${SITE_URL}/courses/${c.categorySlug}/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
