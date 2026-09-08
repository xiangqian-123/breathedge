/**
 * SEO 工具集 —— hreflang / OpenGraph / JSON-LD 结构化数据
 *
 * 换游戏时只需改 HOME_META 里的标题描述；hreflang 与结构化数据逻辑与语言无关。
 */
import { locales } from "@/lib/locales";
import { siteConfig } from "@/lib/site";

/** 站内 locale → hreflang 语言代码（Google 支持 zh-CN / zh-TW 地区写法）。 */
export const HREFLANG: Record<string, string> = {
  "zh-CN": "zh-Hans",
  "zh-TW": "zh-Hant",
  en: "en",
  ja: "ja",
  ru: "ru",
  de: "de",
};

/** 各语言首页的标题 / 描述（内容页用 MDX frontmatter，不走这里）。 */
export const HOME_META: Record<
  string,
  { title: string; description: string }
> = {
  "zh-CN": {
    title: "Breathedge 2 Wiki — 呼吸边缘2 攻略：新手入门、制作配方、生存、主线流程",
    description:
      "Breathedge 2（呼吸边缘2）粉丝攻略维基：新手入门、主线流程、生存系统、制作与升级、材料图鉴、成就一览、发售日期、价格、平台与配置要求，全部基于 2026-08-31 抢先体验版整理。",
  },
  "zh-TW": {
    title: "Breathedge 2 Wiki — 呼吸邊緣2 攻略：新手入門、製作配方、生存、主線流程",
    description:
      "Breathedge 2（呼吸邊緣2）粉絲攻略維基：新手入門、主線流程、生存系統、製作與升級、材料圖鑑、成就一覽、發售日期、價格、平台與配置需求，全部基於 2026-08-31 搶先體驗版整理。",
  },
  en: {
    title: "Breathedge 2 Wiki — Beginner Guide, Crafting Recipes, Survival & Walkthrough",
    description:
      "Fan-made Breathedge 2 wiki: beginner guide, chapter 1 walkthrough, survival systems, crafting & upgrades, materials, achievements, release date, price, platforms and PC requirements — all verified against the Aug 31, 2026 Early Access build.",
  },
  ja: {
    title: "Breathedge 2 Wiki — 初心者ガイド・クラフト・サバイバル・攻略チャート",
    description:
      "Breathedge 2 のファン制作的攻略Wiki：初心者ガイド、第1章攻略チャート、サバイバルシステム、クラフトとアップグレード、素材図鑑、実績、発売日、価格、対応プラットフォーム、必要動作環境まで。2026年8月31日のアーリーアクセス版に基づいています。",
  },
  ru: {
    title: "Breathedge 2 Wiki — гайд для новичков, крафт, выживание и прохождение",
    description:
      "Фан-вики по Breathedge 2: гайд для новичков, прохождение главы 1, системы выживания, крафт и улучшения, ресурсы, достижения, дата выхода, цена, платформы и системные требования. Всё проверено на версии раннего доступа от 31 августа 2026 года.",
  },
  de: {
    title: "Breathedge 2 Wiki — Einsteiger-Guide, Crafting, Survival & Walkthrough",
    description:
      "Fan-Wiki zu Breathedge 2: Einsteiger-Guide, Walkthrough zu Kapitel 1, Survival-Systeme, Crafting & Upgrades, Materialien, Erfolge, Release-Datum, Preis, Plattformen und Systemanforderungen — geprüft mit der Early-Access-Version vom 31. August 2026.",
  },
};

/** 默认 OG 图（官方胶囊图，1200x630 规格外的方形图亦可，Google/社交均可识别）。 */
export const DEFAULT_OG_IMAGE = "/images/guides/capsule.jpg";

/**
 * 生成 hreflang alternates。
 * @param pathWithoutLocale 形如 ""（首页）或 "guide/beginner"
 */
export function buildLanguageAlternates(pathWithoutLocale: string) {
  const languages: Record<string, string> = {};
  for (const loc of locales) {
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
 * 只取以「数字. 」开头的 h3 作为问题（faq.mdx 的书写规范）。
 */
export function faqJsonLdFromMdx(content: string, url: string, locale: string) {
  const lines = content.split("\n");
  const items: { q: string; a: string }[] = [];
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
    if (/^###\s+/.test(line)) {
      flush();
      curQ = line
        .replace(/^###\s+/, "")
        .replace(/^\d+[.、]\s*/, "")
        .replace(/[*_`]/g, "")
        .trim();
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
