import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getPost, getSlugs } from "@/lib/posts";
import { locales } from "@/lib/locales";
import { siteConfig } from "@/lib/site";
import {
  absoluteUrl,
  articleJsonLd,
  buildLanguageAlternates,
  faqJsonLdFromMdx,
  DEFAULT_OG_IMAGE,
} from "@/lib/seo";
import type { Metadata } from "next";

export function generateStaticParams() {
  const slugs = getSlugs();
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const post = getPost(params.locale, params.slug);
  if (!post) {
    return { title: siteConfig.defaultTitle };
  }
  const url = `${siteConfig.siteUrl}/${params.locale}/guide/${post.slug}`;
  const rawTitle = post.frontmatter.title;
  // 标题里已含游戏名就不再追加站名，避免 SERP 被截断后看不到关键信息。
  const title = /breathedge\s*2/i.test(rawTitle)
    ? rawTitle
    : `${rawTitle} | ${siteConfig.siteName}`;
  const ogImage = absoluteUrl(post.frontmatter.heroImage || DEFAULT_OG_IMAGE);

  return {
    title,
    description: post.frontmatter.description,
    alternates: {
      canonical: url,
      languages: buildLanguageAlternates(`guide/${post.slug}`),
    },
    openGraph: {
      type: "article",
      url,
      title: rawTitle,
      description: post.frontmatter.description,
      siteName: siteConfig.siteName,
      images: [{ url: ogImage, alt: rawTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: rawTitle,
      description: post.frontmatter.description,
      images: [ogImage],
    },
  };
}

// 检查 hero 配图是否已存在于 public 目录（未准备时优雅降级）。
function heroImageExists(src: string): boolean {
  if (!src.startsWith("/")) return false;
  const file = path.join(process.cwd(), "public", src);
  return fs.existsSync(file);
}

export default function GuidePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const post = getPost(params.locale, params.slug);
  if (!post) notFound();

  const fm = post.frontmatter;
  const hasHero = fm.heroImage ? heroImageExists(fm.heroImage) : false;

  const url = `${siteConfig.siteUrl}/${params.locale}/guide/${post.slug}`;
  const jsonLd = articleJsonLd({
    title: fm.title,
    description: fm.description,
    url,
    locale: params.locale,
    image: fm.heroImage || DEFAULT_OG_IMAGE,
  });
  // FAQ 页额外输出 FAQPage 结构化数据，有机会在 SERP 里直接展开问答。
  const faqLd =
    post.slug === "faq"
      ? faqJsonLdFromMdx(post.content, url, params.locale)
      : null;
  const allJsonLd = faqLd ? [...jsonLd, faqLd] : jsonLd;

  return (
    <article className="guide">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(allJsonLd) }}
      />
      <header className="guide-header">
        <span className="eyebrow">{fm.eyebrow}</span>
        <h1>{fm.title}</h1>
        {hasHero && (
          <img
            className="guide-hero"
            src={fm.heroImage}
            alt={fm.heroAlt || fm.title}
          />
        )}
      </header>
      <div className="prose">
        <MDXRemote
          source={post.content}
          options={{
            // remark-gfm@4 需配合 next-mdx-remote@6（内部 @mdx-js/mdx@3，unified@11 生态）。
            // 断言 any 以防传递依赖类型路径不一致（运行时无影响）。
            mdxOptions: { remarkPlugins: [remarkGfm as any] },
          }}
        />
      </div>
    </article>
  );
}
