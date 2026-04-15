import { buildOgImage, ogSize, ogContentType } from '@/utils/og-image'
import type { Language } from '@/config/i18n.config'
import blogEs from '@/locales/es/blog.json'
import blogEn from '@/locales/en/blog.json'

export const size        = ogSize
export const contentType = ogContentType

export default async function Image({ params }: { params: Promise<{ locale: Language; slug: string }> }) {
  const { locale, slug } = await params
  const articles = locale === 'en' ? blogEn.articles : blogEs.articles
  const post = articles.find((a) => a.slug === slug)

  return buildOgImage(
    post?.title ?? 'Blog',
    post?.excerpt ?? '',
  )
}
