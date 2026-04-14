import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { defaultLocale, isLocale, routeTranslations } from '@/config/i18n.config'

const englishToCanonical = Object.fromEntries(
  Object.entries(routeTranslations.en).map(([canonical, translated]) => [translated, canonical]),
)

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]
  const secondSegment = segments[1]

  if (!firstSegment) {
    req.nextUrl.pathname = `/${defaultLocale}`
    return NextResponse.rewrite(req.nextUrl)
  }

  if (isLocale(firstSegment)) {
    if (firstSegment === 'en' && secondSegment && secondSegment in englishToCanonical) {
      segments[1] = englishToCanonical[secondSegment]
      req.nextUrl.pathname = `/${segments.join('/')}`
      return NextResponse.rewrite(req.nextUrl)
    }

    return NextResponse.next()
  }

  if (firstSegment in englishToCanonical) {
    req.nextUrl.pathname = `/${defaultLocale}/${englishToCanonical[firstSegment]}`
    return NextResponse.redirect(req.nextUrl)
  }

  req.nextUrl.pathname = `/${defaultLocale}${pathname}`
  return NextResponse.rewrite(req.nextUrl)
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|assets|.*\\..*).*)'],
}
