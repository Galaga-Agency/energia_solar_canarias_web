import type { Metadata } from 'next'
import { getLocalizedHref } from '@/config/i18n.config'
import { SITE_URL as BASE_URL } from '@/config/site'

interface PageMetadataOptions {
  /** Canonical es slug, e.g. 'soluciones'. Omit for homepage. */
  slug?: string
  /** Relative path to an OG image, e.g. '/assets/og/soluciones.jpg' */
  ogImage?: string
}

export function generatePageMetadata(
  title: string,
  description: string,
  { slug, ogImage }: PageMetadataOptions = {},
): Metadata {
  const esPath  = slug ? `/${slug}` : '/'
  const enPath  = slug ? getLocalizedHref(esPath, 'en') : '/en'
  const canonical = `${BASE_URL}${esPath}`
  const image   = ogImage ?? '/assets/og/default.jpg'

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical,
      languages: {
        es: `${BASE_URL}${esPath}`,
        en: `${BASE_URL}${enPath}`,
      },
    },
    openGraph: {
      title,
      description,
      url:      canonical,
      siteName: 'Energía Solar Canarias',
      locale:   'es_ES',
      type:     'website',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      images:      [image],
    },
  }
}
