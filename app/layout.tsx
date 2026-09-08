import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/site";
import GoogleAnalytics from "@/components/GoogleAnalytics";

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
    alternateLocale: siteConfig.ogLocales.map((l) =>
      l === "zh-TW" ? "zh_TW" : l === "ja" ? "ja_JP" : l === "ru" ? "ru_RU" : l === "de" ? "de_DE" : "zh_CN"
    ),
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* 按 URL 首段修正 <html lang>，让爬虫与实际语言一致（SSR 阶段拿不到 locale 参数）。 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=location.pathname.match(/^\\/([a-zA-Z-]+)/);var map={'zh-CN':'zh-Hans','zh-TW':'zh-Hant','en':'en','ja':'ja','ru':'ru','de':'de'};var l=m&&map[m[1]];if(l)document.documentElement.lang=l;}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <GoogleAnalytics gaId={siteConfig.gaId} />
        {children}
      </body>
    </html>
  );
}
