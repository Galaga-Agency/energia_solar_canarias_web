import { buildOgImage, ogSize, ogContentType } from '@/utils/og-image'
import type { Language } from '@/config/i18n.config'

export const size        = ogSize
export const contentType = ogContentType

export default async function Image({ params }: { params: Promise<{ locale: Language }> }) {
  const { locale } = await params
  const isEn = locale === 'en'

  return buildOgImage(
    isEn ? 'Contact Us' : 'Contacto',
    isEn
      ? 'Talk to our team in Agüimes, Las Palmas. Request your free energy audit.'
      : 'Habla con nuestro equipo en Agüimes. Solicita tu auditoría energética gratuita.',
  )
}
