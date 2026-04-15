import { buildOgImage, ogSize, ogContentType } from '@/utils/og-image'
import type { Language } from '@/config/i18n.config'

export const size        = ogSize
export const contentType = ogContentType

export default async function Image({ params }: { params: Promise<{ locale: Language }> }) {
  const { locale } = await params
  const isEn = locale === 'en'

  return buildOgImage(
    'Blog',
    isEn
      ? 'Articles on renewable energy, Canarian regulations and energy sector trends.'
      : 'Artículos sobre energía renovable, normativas canarias y tendencias del sector.',
  )
}
