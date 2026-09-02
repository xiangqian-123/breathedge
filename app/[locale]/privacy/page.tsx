import { notFound } from "next/navigation";
import { isValidLocale } from "@/lib/locales";

export default function PrivacyPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  return (
    <article className="guide">
      <header className="guide-header">
        <h1>Privacy Policy</h1>
      </header>
      <div className="prose">
        <p>
          This is a fan-made community wiki. We do not collect personal data
          beyond standard, anonymized analytics used to understand site traffic.
        </p>
        <p>
          {"Breathedge 2"} and all related trademarks are the property of{" "}
          {"RedRuins Softworks"}.
          This site is not affiliated with {"RedRuins Softworks"}.
        </p>
      </div>
    </article>
  );
}
