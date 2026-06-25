import type { Metadata } from "next";
import { BlogClient } from "@/components/pages/blog/BlogClient";
import { generatePageMetadata } from "@/utils/seo";
import type { Language } from "@/config/i18n.config";
import { SITE_URL } from "@/config/site";
import { getArticles, getCategories } from "@/lib/articles";

interface BlogPageProps {
  params: Promise<{ locale: Language }>;
}

// ISR: render on-demand at runtime (where PAYLOAD_SECRET/DB exist), cache 5 min.
// NOT force-static — that prerenders at build time when the secret is absent.
export const revalidate = 300;

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return generatePageMetadata(
    isEn
      ? "The Observatory — Canary Islands Solar Energy"
      : "El Observatorio de Energía Solar en Canarias",
    isEn
      ? "Local data, real projects and analysis of the Canary Islands energy sector."
      : "Datos locales, casos reales y análisis del sector energético insular.",
    { slug: "blog" },
  );
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  const isEn = locale === "en";

  const [articles, categories] = await Promise.all([
    getArticles(isEn ? "en" : "es"),
    getCategories(isEn ? "en" : "es"),
  ]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog/#page`,
    name: isEn
      ? "Canary Islands Solar Energy Observatory"
      : "El Observatorio de Energía Solar en Canarias",
    description: isEn
      ? "Local data, real projects and analysis of the Canary Islands energy sector."
      : "Datos locales, casos reales y análisis del sector energético insular.",
    url: `${SITE_URL}/blog`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: isEn ? "en" : "es-ES",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <BlogClient articles={articles} categories={categories} />
    </>
  );
}
