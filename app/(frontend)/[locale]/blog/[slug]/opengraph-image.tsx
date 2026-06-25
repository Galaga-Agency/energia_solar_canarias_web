import { buildOgImage, ogSize, ogContentType } from '@/utils/og-image'
import type { Language } from '@/config/i18n.config'
import { getArticleBySlug } from '@/lib/articles'

export const size        = ogSize
export const contentType = ogContentType

export default async function Image({ params }: { params: Promise<{ locale: Language; slug: string }> }) {
  const { locale, slug } = await params
  const post = await getArticleBySlug(slug, locale === 'en' ? 'en' : 'es')

  return buildOgImage(
    post?.title ?? 'El Observatorio',
    post?.excerpt ?? '',
  )
}
