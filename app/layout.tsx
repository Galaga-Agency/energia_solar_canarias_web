import type { Metadata, Viewport } from 'next'
import localFont         from 'next/font/local'
import { Providers }     from '@/components/layout/Providers'
import { SITE_URL, SITE_NAME } from '@/config/site'
import '@/globals.css'

const acumin = localFont({
  variable: '--font-acumin',
  display:  'swap',
  src: [
    {
      path: '../public/assets/fonts/Acumin-RPro.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/assets/fonts/Acumin-ItPro.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/assets/fonts/Acumin-BdPro.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/assets/fonts/Acumin-BdItPro.otf',
      weight: '700',
      style: 'italic',
    },
  ],
})

export const viewport: Viewport = {
  themeColor: '#F97316',
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:  SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: 'Diseñamos tu independencia energética. Soluciones fotovoltaicas, almacenamiento y consultoría energética en Canarias.',
  authors:   [{ name: SITE_NAME }],
  creator:   SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:              true,
      follow:             true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet':       -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      es: SITE_URL,
      en: `${SITE_URL}/en`,
    },
  },
  icons: {
    icon:  '/assets/icons/favicon.svg',
    apple: '/assets/icons/favicon.svg',
  },
}

const BASE = SITE_URL

const address = {
  '@type':         'PostalAddress',
  streetAddress:   'C. las Mimosas, 65',
  addressLocality: 'Agüimes',
  postalCode:      '35118',
  addressRegion:   'Las Palmas',
  addressCountry:  'ES',
}

const orgSchema = {
  '@context':    'https://schema.org',
  '@type':       'Organization',
  '@id':         `${BASE}/#organization`,
  name:          'Energía Solar Canarias',
  url:           BASE,
  logo: {
    '@type': 'ImageObject',
    url:     `${BASE}/assets/icons/favicon.svg`,
  },
  telephone:     '+34623574750',
  email:         'info@energiasolarcanarias.es',
  description:   'Diseñamos tu independencia energética. Soluciones fotovoltaicas, almacenamiento y consultoría energética en Canarias.',
  foundingDate:  '2015',
  address,
  areaServed: [
    { '@type': 'Place', name: 'Gran Canaria' },
    { '@type': 'Place', name: 'Tenerife' },
    { '@type': 'Place', name: 'Islas Canarias' },
  ],
  serviceType: [
    'Instalación fotovoltaica',
    'Almacenamiento de energía',
    'Consultoría energética',
    'Auditoría energética',
  ],
  sameAs: [
    'https://www.instagram.com/energiasolarcanarias',
    'https://www.linkedin.com/company/energiasolarcanarias',
  ],
}

const websiteSchema = {
  '@context':   'https://schema.org',
  '@type':      'WebSite',
  '@id':        `${BASE}/#website`,
  url:          BASE,
  name:         'Energía Solar Canarias',
  description:  'Soluciones de energía solar en Canarias',
  publisher:    { '@id': `${BASE}/#organization` },
  inLanguage:   ['es-ES', 'en'],
}

const localBusinessSchema = {
  '@context':  'https://schema.org',
  '@type':     'LocalBusiness',
  '@id':       `${BASE}/#localbusiness`,
  name:        'Energía Solar Canarias',
  url:         BASE,
  telephone:   '+34623574750',
  email:       'info@energiasolarcanarias.es',
  image:       `${BASE}/assets/icons/favicon.svg`,
  address,
  geo: {
    '@type':    'GeoCoordinates',
    latitude:   27.9277,
    longitude:  -15.4467,
  },
  openingHoursSpecification: [
    {
      '@type':     'OpeningHoursSpecification',
      dayOfWeek:   ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens:       '09:00',
      closes:      '18:00',
    },
  ],
  priceRange: '€€',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={acumin.variable}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
