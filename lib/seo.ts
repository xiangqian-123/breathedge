/**
 * SEO 工具集 —— hreflang / OpenGraph / JSON-LD 结构化数据
 *
 * 换游戏时只需改 HOME_META 里的标题描述；hreflang 与结构化数据逻辑与语言无关。
 */
import { locales, CONTENT_LOCALES } from "@/lib/locales";
import { siteConfig } from "@/lib/site";

/** 站内 locale → hreflang 语言代码。 */
export const HREFLANG: Record<string, string> = {
  en: "en",
};

/** 各语言首页的标题 / 描述（内容页用 MDX frontmatter，不走这里）。 */
export const HOME_META: Record<
  string,
  { title: string; description: string }
> = {
  en: {
    title: "Breathedge 2 Wiki — Beginner Guide, Crafting Recipes, Survival & Walkthrough",
    description:
      "Fan-made Breathedge 2 wiki: beginner guide, chapter 1 walkthrough, survival systems, crafting & upgrades, materials, achievements, release date, price, platforms and PC requirements — all verified against the Aug 31, 2026 Early Access build.",
  },
};

/** 默认 OG 图（官方胶囊图，1200x630 规格外的方形图亦可，Google/社交均可识别）。 */
export const DEFAULT_OG_IMAGE = "/images/guides/capsule.jpg";

/**
 * 生成 hreflang alternates。
 * @param pathWithoutLocale 形如 ""（首页）或 "guide/beginner"
 * @param contentOnly true 时只列有真实译文内容的语言（攻略页用；首页走全部语言）
 */
export function buildLanguageAlternates(
  pathWithoutLocale: string,
  contentOnly = false
) {
  const languages: Record<string, string> = {};
  const target = contentOnly ? CONTENT_LOCALES : locales;
  for (const loc of target) {
    const code = HREFLANG[loc] ?? loc;
    languages[code] = pathWithoutLocale
      ? `${siteConfig.siteUrl}/${loc}/${pathWithoutLocale}`
      : `${siteConfig.siteUrl}/${loc}`;
  }
  // x-default 指向英文版（目标流量以英文为主）。
  languages["x-default"] = pathWithoutLocale
    ? `${siteConfig.siteUrl}/en/${pathWithoutLocale}`
    : `${siteConfig.siteUrl}/en`;
  return languages;
}

/** 站点级 WebSite + Organization 结构化数据。 */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.siteName,
    url: siteConfig.siteUrl,
    description: siteConfig.defaultDescription,
    inLanguage: locales.slice(),
    publisher: {
      "@type": "Organization",
      name: siteConfig.siteName,
      url: siteConfig.siteUrl,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.siteUrl}/en?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** 攻略页 Article + BreadcrumbList 结构化数据。 */
export function articleJsonLd(opts: {
  title: string;
  description: string;
  url: string;
  locale: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}) {
  const date = opts.datePublished ?? "2026-08-31";
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: opts.title,
      description: opts.description,
      image: opts.image ? [absoluteUrl(opts.image)] : undefined,
      mainEntityOfPage: { "@type": "WebPage", "@id": opts.url },
      inLanguage: HREFLANG[opts.locale] ?? opts.locale,
      datePublished: date,
      dateModified: opts.dateModified ?? date,
      author: {
        "@type": "Organization",
        name: siteConfig.siteName,
        url: siteConfig.siteUrl,
      },
      publisher: {
        "@type": "Organization",
        name: siteConfig.siteName,
        url: siteConfig.siteUrl,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: siteConfig.siteName,
          item: `${siteConfig.siteUrl}/${opts.locale}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: opts.title,
          item: opts.url,
        },
      ],
    },
  ];
}

/**
 * 从 FAQ 的 MDX 正文里抽取 ### 问题 + 答案，生成 FAQPage 结构化数据。
 * 只在「## FAQ」h2 区块内取以「数字. 」开头的 h3 作为问题（faq.mdx 的书写规范，
 * 其他攻略页在 FAQ 区块内沿用同一规范即可获得 FAQPage 富结果）。
 */
export function faqJsonLdFromMdx(content: string, url: string, locale: string) {
  const lines = content.split("\n");
  const items: { q: string; a: string }[] = [];
  let inFaq = false;
  let curQ: string | null = null;
  let buf: string[] = [];

  const flush = () => {
    if (!curQ) return;
    const a = buf
      .join(" ")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // markdown 链接 → 纯文本
      .replace(/[*_`>#]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (a) items.push({ q: curQ, a });
    curQ = null;
    buf = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (/^##\s+/.test(line)) {
      flush();
      inFaq = /^##\s+FAQ\b/i.test(line);
    } else if (/^###\s+/.test(line)) {
      flush();
      if (inFaq) {
        curQ = line
          .replace(/^###\s+/, "")
          .replace(/^\d+[.、]\s*/, "")
          .replace(/[*_`]/g, "")
          .trim();
      }
    } else if (curQ) {
      if (/^#{1,6}\s+/.test(line)) {
        flush();
      } else if (line) {
        buf.push(line);
      }
    }
  }
  flush();

  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    inLanguage: HREFLANG[locale] ?? locale,
    mainEntity: items.slice(0, 30).map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

/** 相对路径 → 绝对 URL（OG 图必须是绝对地址）。 */
export function absoluteUrl(p: string): string {
  if (/^https?:\/\//.test(p)) return p;
  return `${siteConfig.siteUrl}${p.startsWith("/") ? p : `/${p}`}`;
}
