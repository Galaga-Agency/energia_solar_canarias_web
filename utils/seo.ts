import type { Metadata } from 'next'

const BASE_URL = 'https://www.energiasolarcanarias.es'

export function generatePageMetadata(
  title: string,
  description: string,
): Metadata {
  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    openGraph: {
      title,
      description,
      url:       BASE_URL,
      siteName:  'Energía Solar Canarias',
      locale:    'es_ES',
      type:      'website',
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
    },
  }
}
