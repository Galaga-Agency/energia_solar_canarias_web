import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             'Energía Solar Canarias',
    short_name:       'ESCanarias',
    description:      'Diseñamos tu independencia energética. Fotovoltaica, almacenamiento y consultoría en Canarias.',
    start_url:        '/',
    scope:            '/',
    display:          'standalone',
    theme_color:      '#e4572c',
    background_color: '#0a0a0a',
    icons: [
      {
        src:     '/assets/icons/icon-192.png',
        sizes:   '192x192',
        type:    'image/png',
      },
      {
        src:     '/assets/icons/icon-512.png',
        sizes:   '512x512',
        type:    'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
