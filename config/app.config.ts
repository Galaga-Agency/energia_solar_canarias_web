export const APP_CONFIG = {
  name:        'Energía Solar Canarias',
  tagline:     'Diseñamos tu independencia energética',
  url:         process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.energiasolarcanarias.es',
  locale:      'es',
  themeColor:  '#e4572c',
} as const
