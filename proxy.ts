import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { defaultLocale, isLocale, routeTranslations } from '@/config/i18n.config'

const englishToCanonical = Object.fromEntries(
  Object.entries(routeTranslations.en)
    // Skip self-mappings (e.g. blog → blog): they are not English aliases, so the
    // proxy must NOT redirect them — doing so 307s /blog → /es/blog and drops slugs.
    .filter(([canonical, translated]) => canonical !== translated)
    .map(([canonical, translated]) => [translated, canonical]),
)

function withLocaleHeader(response: NextResponse, locale: string): NextResponse {
  response.headers.set('x-next-intl-locale', locale)
  return response
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]
  const secondSegment = segments[1]

  if (!firstSegment) {
    req.nextUrl.pathname = `/${defaultLocale}`
    return withLocaleHeader(NextResponse.rewrite(req.nextUrl), defaultLocale)
  }

  if (isLocale(firstSegment)) {
    if (firstSegment === 'en' && secondSegment && secondSegment in englishToCanonical) {
      segments[1] = englishToCanonical[secondSegment]
      req.nextUrl.pathname = `/${segments.join('/')}`
      return withLocaleHeader(NextResponse.rewrite(req.nextUrl), firstSegment)
    }

    return withLocaleHeader(NextResponse.next(), firstSegment)
  }

  if (firstSegment in englishToCanonical) {
    req.nextUrl.pathname = `/${defaultLocale}/${englishToCanonical[firstSegment]}`
    return withLocaleHeader(NextResponse.redirect(req.nextUrl), defaultLocale)
  }

  req.nextUrl.pathname = `/${defaultLocale}${pathname}`
  return withLocaleHeader(NextResponse.rewrite(req.nextUrl), defaultLocale)
}

export const config = {
  // Exclude Payload's own routes (/admin, /api, /media) and static assets so
  // next-intl never rewrites them to a locale-prefixed path.
  matcher: ['/((?!_next|api|admin|media|favicon.ico|assets|.*\\..*).*)'],
}
