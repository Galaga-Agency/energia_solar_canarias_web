export const locales        = ['es', 'en'] as const
export const defaultLocale  = 'es'         as const
export type  Language       = (typeof locales)[number]

export const languageNames: Record<Language, string> = {
  es: 'Español',
  en: 'English',
}

export const routeTranslations: Record<Language, Record<string, string>> = {
  es: {
    services:  'soluciones',
    projects:  'proyectos',
    'about-us':'sobre-nosotros',
    contact:   'contacto',
    blog:      'blog',
  },
  en: {
    soluciones:       'services',
    proyectos:        'projects',
    'sobre-nosotros': 'about-us',
    contacto:         'contact',
    blog:             'blog',
  },
}

export function isLocale(value: string): value is Language {
  return locales.includes(value as Language)
}

export function getLocaleFromPathname(pathname: string): Language {
  const firstSegment = pathname.split('/').filter(Boolean)[0]
  return isLocale(firstSegment) ? firstSegment : defaultLocale
}

export function stripLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  if (isLocale(segments[0])) segments.shift()
  return `/${segments.join('/')}`.replace(/\/$/, '') || '/'
}

export function translateSlug(slug: string, locale: Language): string {
  return routeTranslations[locale][slug] ?? slug
}

export function getLocalizedHref(href: string, locale: Language): string {
  const normalized = stripLocaleFromPathname(href)
  if (normalized === '/') return locale === defaultLocale ? '/' : `/${locale}`

  const [slug, ...rest] = normalized.split('/').filter(Boolean)
  const translated = translateSlug(slug, locale)
  const path = `/${[translated, ...rest].join('/')}`

  return locale === defaultLocale ? path : `/${locale}${path}`
}

export function getLocalizedCanonicalPath(pathname: string, locale: Language): string {
  const normalized = stripLocaleFromPathname(pathname)
  return getLocalizedHref(normalized, locale)
}
