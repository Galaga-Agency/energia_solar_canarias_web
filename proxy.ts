import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { defaultLocale, isLocale, routeTranslations } from '@/config/i18n.config'

const englishToCanonical = Object.fromEntries(
  Object.entries(routeTranslations.en).map(([canonical, translated]) => [translated, canonical]),
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
  matcher: ['/((?!_next|api|favicon.ico|assets|.*\\..*).*)'],
}
