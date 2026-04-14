import type { Metadata } from 'next'
import localFont         from 'next/font/local'
import { Providers }     from '@/components/layout/Providers'
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

export const metadata: Metadata = {
  metadataBase: new URL('https://www.energiasolarcanarias.es'),
  icons: {
    icon:  '/assets/icons/favicon.svg',
    apple: '/assets/icons/favicon.svg',
  },
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type':    'Organization',
  name:       'Energía Solar Canarias',
  url:        'https://www.energiasolarcanarias.es',
  telephone:  '+34623574750',
  email:      'info@energiasolarcanarias.es',
  address: {
    '@type':         'PostalAddress',
    streetAddress:   'C. las Mimosas, 65',
    addressLocality: 'Agüimes',
    postalCode:      '35118',
    addressRegion:   'Las Palmas',
    addressCountry:  'ES',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={acumin.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
