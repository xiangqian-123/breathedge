import type { MetadataRoute } from "next";
import { getSlugs } from "@/lib/posts";
import { locales } from "@/lib/locales";
import { siteConfig } from "@/lib/site";
import { buildLanguageAlternates } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getSlugs();
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  for (const locale of locales) {
    // 目标流量以英文为主，英文版权重略高。
    const weight = locale === "en" ? 1 : 0.9;
    entries.push({
      url: `${siteConfig.siteUrl}/${locale}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: weight,
      alternates: { languages: buildLanguageAlternates("") },
    });
    for (const slug of slugs) {
      entries.push({
        url: `${siteConfig.siteUrl}/${locale}/guide/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: locale === "en" ? 0.8 : 0.7,
        alternates: { languages: buildLanguageAlternates(`guide/${slug}`) },
      });
    }
  }
  return entries;
}
