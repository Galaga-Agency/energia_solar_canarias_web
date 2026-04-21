import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Language } from "@/config/i18n.config";
import { SITE_URL, SITE_NAME } from "@/config/site";
import { BLOG_ARTICLES_EN } from "@/data/blog/en";
import { BLOG_ARTICLES_ES } from "@/data/blog/es";

interface BlogPostPageProps {
  params: Promise<{ locale: Language; slug: string }>;
}

function getPost(locale: Language, slug: string) {
  const articles = locale === "en" ? BLOG_ARTICLES_EN : BLOG_ARTICLES_ES;
  return articles.find((a) => a.slug === slug) ?? null;
}

export async function generateStaticParams() {
  const slugsEs = BLOG_ARTICLES_ES.map((a) => ({ locale: "es", slug: a.slug }));
  const slugsEn = BLOG_ARTICLES_EN.map((a) => ({ locale: "en", slug: a.slug }));
  return [...slugsEs, ...slugsEn];
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(locale, slug);
  if (!post) return {};

  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
      languages: {
        es: `${SITE_URL}/blog/${post.slug}`,
        en: `${SITE_URL}/en/blog/${post.slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url,
      siteName: SITE_NAME,
      images: post.image ? [{ url: post.image, width: 1200, height: 630, alt: post.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  const post = getPost(locale, slug);
  if (!post) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/blog/${post.slug}/#article`,
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    dateModified: post.updatedAt,
    url: `${SITE_URL}/blog/${post.slug}`,
    isPartOf: { "@id": `${SITE_URL}/blog/#page` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: locale === "en" ? "en" : "es-ES",
    articleSection: post.category,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {/* TODO: wire up BlogPostClient when the full article body is available */}
      <main style={{ padding: "120px 24px", maxWidth: "800px", margin: "0 auto" }}>
        <h1>{post.title}</h1>
        <p>{post.excerpt}</p>
      </main>
    </>
  );
}
