// 支持的语言与回退逻辑。
export const DEFAULT_LOCALE = "zh-CN";

// 站内实际路由支持的语言（zh-TW 由脚本自动生成）。
export const locales = ["zh-CN", "zh-TW", "en", "ja", "ru", "de"] as const;
export type Locale = (typeof locales)[number];

// 有真实攻略译文内容的语言（ja/ru/de 只有首页翻译，攻略页是 en 回退壳页）。
// 壳页：noindex + 移出 sitemap + 移出 hreflang（复盘经验 #6）。
export const CONTENT_LOCALES = ["zh-CN", "zh-TW", "en"] as const;

export function isValidLocale(l: string): l is Locale {
  return (locales as readonly string[]).includes(l);
}

// 内容回退链：优先本语言 → 英文兜底 → 中文兜底。
export const CONTENT_FALLBACK = ["en", "zh-CN"] as const;

// UI 文案回退链：优先本语言 → 英文兜底。
export const UI_FALLBACK = ["en"] as const;
