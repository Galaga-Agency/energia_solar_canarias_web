import { buildOgImage, ogSize, ogContentType } from '@/utils/og-image'
import type { Language } from '@/config/i18n.config'

export const size        = ogSize
export const contentType = ogContentType

export default async function Image({ params }: { params: Promise<{ locale: Language }> }) {
  const { locale } = await params
  const isEn = locale === 'en'

  return buildOgImage(
    isEn ? 'About Us' : 'Sobre Nosotros',
    isEn
      ? '20 years building a more sustainable energy model in the Canary Islands.'
      : '20 años construyendo un modelo energético más sostenible en Canarias.',
  )
}
