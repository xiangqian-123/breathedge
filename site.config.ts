/**
 * 站点级配置中心 —— Breathedge 2 Wiki
 *
 * 换游戏时只需改这里 + 替换 content/ 目录的 MDX。
 */
export interface SiteConfig {
  /** 站点名（用于标题、OpenGraph、JSON-LD）。 */
  siteName: string;
  /** 站点根网址（用于 canonical、hreflang、sitemap、robots）。 */
  siteUrl: string;
  /** 游戏名（用于默认标题/描述等文案）。 */
  gameName: string;
  /** Google Analytics 4 衡量 ID（G- 开头）。 */
  gaId: string;
  /** 默认页面标题（各页面未单独定义 metadata 时使用）。 */
  defaultTitle: string;
  /** 默认页面描述。 */
  defaultDescription: string;
  /** OpenGraph 的备选语言（除默认 locale 外）。 */
  ogLocales: string[];
}

export const siteConfig: SiteConfig = {
  siteName: 'Breathedge 2 Wiki',
  siteUrl: 'https://breathedge-iota.vercel.app',
  gameName: 'Breathedge 2',
  // GA4 衡量 ID：优先读环境变量 NEXT_PUBLIC_GA_ID，未设置时用下方写死的值
  gaId: process.env.NEXT_PUBLIC_GA_ID || 'G-RR4RZ8RLVD',
  defaultTitle: 'Breathedge 2 Wiki — Survival Guide, Crafting, Walkthrough & More',
  defaultDescription:
    'Breathedge 2 Wiki — the fan guide to the retro-futuristic space survival game by RedRuins Softworks: beginner guide, crafting recipes, survival systems, walkthrough, materials, and more.',
  ogLocales: ['en', 'ja', 'ru', 'de', 'zh-TW'],
};
