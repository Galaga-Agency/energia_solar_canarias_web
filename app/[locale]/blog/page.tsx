import type { Metadata } from "next";
import { BlogClient } from "@/components/pages/blog/BlogClient";
import { generatePageMetadata } from "@/utils/seo";
import type { Language } from "@/config/i18n.config";
import { SITE_URL } from "@/config/site";
import blogEs from "@/locales/es/blog.json";
import blogEn from "@/locales/en/blog.json";
import { BLOG_ARTICLES_ES } from "@/data/blog/es";
import { BLOG_ARTICLES_EN } from "@/data/blog/en";

interface BlogPageProps {
  params: Promise<{ locale: Language }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return generatePageMetadata(
    isEn ? "Blog — Solar Energy Canarias" : "Blog — Energía Solar Canarias",
    isEn
      ? "Articles on renewable energy, Canarian regulations and energy sector trends."
      : "Artículos sobre energía renovable, normativas canarias y tendencias del sector energético.",
    { slug: 'blog' },
  );
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  const isEn = locale === "en";
  const messages = isEn ? blogEn : blogEs;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog/#page`,
    name: isEn ? "Solar Energy Canarias Blog" : "Blog de Energía Solar Canarias",
    description: isEn
      ? "Articles on renewable energy, Canarian regulations and energy sector trends."
      : "Artículos sobre energía renovable, normativas canarias y tendencias del sector energético.",
    url: `${SITE_URL}/blog`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: isEn ? "en" : "es-ES",
  };

  const articles = isEn ? BLOG_ARTICLES_EN : BLOG_ARTICLES_ES;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <BlogClient articles={articles} messages={messages} />
    </>
  );
}
