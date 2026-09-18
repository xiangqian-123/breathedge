import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale } from "@/lib/locales";

// 法律页不进索引（自查清单 P1.5）。
export function generateMetadata(): Metadata {
  return { robots: { index: false, follow: true } };
}

export default function TermsPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  return (
    <article className="guide">
      <header className="guide-header">
        <h1>Terms of Service</h1>
      </header>
      <div className="prose">
        <p>
          This fan-made community wiki is provided for informational purposes
          only. Guides and data are community-maintained and may contain
          inaccuracies.
        </p>
        <p>
          {"Breathedge 2"} and all related trademarks are the property of{" "}
          {"RedRuins Softworks"}.
          This site is not affiliated with or endorsed by {"RedRuins Softworks"}.
        </p>
      </div>
    </article>
  );
}
