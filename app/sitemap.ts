import fs from "fs";
import path from "path";
import type { MetadataRoute } from "next";
import { getSlugs } from "@/lib/posts";
import { locales, CONTENT_LOCALES } from "@/lib/locales";
import { siteConfig } from "@/lib/site";
import { buildLanguageAlternates } from "@/lib/seo";

// 内容源目录（zh-CN 为源语言，slugs 以此为准）。
const CONTENT_DIR = path.join(process.cwd(), "content", "guides", "zh-CN");

// lastModified 用文件真实 mtime（自查清单 P2：不允许写 now）。
const mtimeCache = new Map<string, Date>();

function contentMtime(slug?: string): Date {
  const key = slug ?? "__home__";
  if (!mtimeCache.has(key)) {
    if (slug) {
      try {
        mtimeCache.set(key, fs.statSync(path.join(CONTENT_DIR, `${slug}.mdx`)).mtime);
      } catch {
        mtimeCache.set(key, new Date(0));
      }
    } else {
      let latest = new Date(0);
      for (const f of fs.readdirSync(CONTENT_DIR)) {
        const m = fs.statSync(path.join(CONTENT_DIR, f)).mtime;
        if (m > latest) latest = m;
      }
      mtimeCache.set(key, latest);
    }
  }
  return mtimeCache.get(key)!;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getSlugs();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    // 目标流量以英文为主，英文版权重略高。
    const weight = locale === "en" ? 1 : 0.9;
    entries.push({
      url: `${siteConfig.siteUrl}/${locale}`,
      lastModified: contentMtime(),
      changeFrequency: "weekly",
      priority: weight,
      alternates: { languages: buildLanguageAlternates("") },
    });
  }

  // 攻略页只提交有真实译文内容的语言（ja/ru/de 壳页移出 sitemap，复盘经验 #6）。
  for (const locale of CONTENT_LOCALES) {
    for (const slug of slugs) {
      entries.push({
        url: `${siteConfig.siteUrl}/${locale}/guide/${slug}`,
        lastModified: contentMtime(slug),
        changeFrequency: "monthly",
        priority: locale === "en" ? 0.8 : 0.7,
        alternates: { languages: buildLanguageAlternates(`guide/${slug}`, true) },
      });
    }
  }
  return entries;
}
