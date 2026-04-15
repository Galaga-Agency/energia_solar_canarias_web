import { buildOgImage, ogSize, ogContentType } from '@/utils/og-image'
import type { Language } from '@/config/i18n.config'

export const size        = ogSize
export const contentType = ogContentType

export default async function Image({ params }: { params: Promise<{ locale: Language }> }) {
  const { locale } = await params
  const isEn = locale === 'en'

  return buildOgImage(
    isEn ? 'Solar Energy Canarias' : 'Energía Solar Canarias',
    isEn
      ? 'Designing your energy independence in the Canary Islands.'
      : 'Diseñamos tu independencia energética en Canarias.',
  )
}
