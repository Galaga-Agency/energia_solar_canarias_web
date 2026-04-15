import { buildOgImage, ogSize, ogContentType } from '@/utils/og-image'
import type { Language } from '@/config/i18n.config'

export const size        = ogSize
export const contentType = ogContentType

export default async function Image({ params }: { params: Promise<{ locale: Language }> }) {
  const { locale } = await params
  const isEn = locale === 'en'

  return buildOgImage(
    isEn ? 'Our Projects' : 'Nuestros Proyectos',
    isEn
      ? 'Success stories of companies that have transformed their energy model with us.'
      : 'Casos de éxito de empresas que han transformado su modelo energético con nosotros.',
  )
}
