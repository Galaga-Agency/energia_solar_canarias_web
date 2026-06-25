import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { Language } from "@/config/i18n.config"
import { SITE_URL, SITE_NAME } from "@/config/site"
import { getArticleWithBody, getArticleBySlug, getAllSlugs, getArticleSlugs } from "@/lib/articles"
import { ArticlePost } from "@/components/pages/blog/ArticlePost"

interface BlogPostPageProps {
  params: Promise<{ locale: Language; slug: string }>
}

export const dynamic = "force-static"
export const revalidate = 300

export async function generateStaticParams() {
  try {
    return await getAllSlugs()
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getArticleBySlug(slug, locale === "en" ? "en" : "es")
  if (!post) return {}

  const url = `${SITE_URL}${locale === "en" ? "/en" : ""}/blog/${post.slug}`

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
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedLabel ?? post.publishedAt,
      authors: [post.author],
      images: post.image ? [{ url: post.image, width: 1200, height: 630, alt: post.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params
  const loc = locale === "en" ? "en" : "es"
  const data = await getArticleWithBody(slug, loc)
  if (!data) notFound()
  const { article, body } = data

  const slugs = await getArticleSlugs(slug, loc)
  const altPaths = slugs ? { es: `/blog/${slugs.es}`, en: `/blog/${slugs.en}` } : undefined

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/blog/${article.slug}/#article`,
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.publishedAt,
    dateModified: article.updatedLabel ?? article.publishedAt,
    author: { "@type": "Organization", name: article.author },
    url: `${SITE_URL}/blog/${article.slug}`,
    isPartOf: { "@id": `${SITE_URL}/blog/#page` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: locale === "en" ? "en" : "es-ES",
    articleSection: article.categoryLabel ?? article.category,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ArticlePost article={article} body={body} altPaths={altPaths} />
    </>
  )
}
