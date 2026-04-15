import { buildOgImage, ogSize, ogContentType } from '@/utils/og-image'
import type { Language } from '@/config/i18n.config'

export const size        = ogSize
export const contentType = ogContentType

export default async function Image({ params }: { params: Promise<{ locale: Language }> }) {
  const { locale } = await params
  const isEn = locale === 'en'

  return buildOgImage(
    isEn ? 'Energy Solutions' : 'Soluciones energéticas',
    isEn
      ? 'Photovoltaic systems, storage and energy consulting tailored to your business.'
      : 'Sistemas fotovoltaicos, almacenamiento y consultoría adaptados a tu operativa.',
  )
}
