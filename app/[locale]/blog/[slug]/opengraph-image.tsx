import { buildOgImage, ogSize, ogContentType } from '@/utils/og-image'
import type { Language } from '@/config/i18n.config'
import { BLOG_ARTICLES_EN } from '@/data/blog/en'
import { BLOG_ARTICLES_ES } from '@/data/blog/es'

export const size        = ogSize
export const contentType = ogContentType

export default async function Image({ params }: { params: Promise<{ locale: Language; slug: string }> }) {
  const { locale, slug } = await params
  const articles = locale === 'en' ? BLOG_ARTICLES_EN : BLOG_ARTICLES_ES
  const post = articles.find((a) => a.slug === slug)

  return buildOgImage(
    post?.title ?? 'Blog',
    post?.excerpt ?? '',
  )
}
