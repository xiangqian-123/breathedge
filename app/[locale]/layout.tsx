import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { isValidLocale, locales } from "@/lib/locales";
import { getMessages } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
import { HREFLANG } from "@/lib/seo";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { PopunderAd } from "@/components/Ads";

// 根布局下沉到 [locale]：<html lang> 按路由语言在 SSR 阶段直接输出，
// 不再用浏览器 JS 事后修正（爬虫只读 SSR HTML）。
export const metadata: Metadata = {
  // 有了 metadataBase，OG 图 / canonical 里的相对路径才能解析成绝对地址。
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.defaultTitle,
    template: `%s | ${siteConfig.siteName}`,
  },
  description: siteConfig.defaultDescription,
  openGraph: {
    type: "website",
    siteName: siteConfig.siteName,
    locale: "en_US",
    alternateLocale: [],
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isValidLocale(params.locale)) notFound();
  const messages = getMessages(params.locale);
  // 仅英文，原样输出。
  const lang = HREFLANG[params.locale] ?? params.locale;

  return (
    <html lang={lang}>
      <body>
        <GoogleAnalytics gaId={siteConfig.gaId} />
        <Nav locale={params.locale} messages={messages} />
        <main>{children}</main>
        <PopunderAd />
        <Footer
          locale={params.locale}
          messages={messages}
          siteUrl={siteConfig.siteUrl}
        />
      </body>
    </html>
  );
}
