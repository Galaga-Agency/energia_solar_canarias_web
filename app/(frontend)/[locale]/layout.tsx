import type { ReactNode }      from 'react'
import { notFound }            from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages }         from 'next-intl/server'
import { GoogleTagManager }    from '@next/third-parties/google'
import { TranslationProvider } from '@/contexts/TranslationContext'
import { ConsentProvider }     from '@/contexts/ConsentContext'
import { ConsentInit }         from '@/components/layout/ConsentInit'
import { AnalyticsTracker }    from '@/components/layout/AnalyticsTracker'
import { CookieConsent }       from '@/components/ui/CookieConsent'
import { LocaleShell }         from '@/components/layout/LocaleShell'
import { analyticsConfig }     from '@/config/analytics.config'
import { isLocale, locales, type Language } from '@/config/i18n.config'

interface LocaleLayoutProps {
  children: ReactNode
  params:   Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <TranslationProvider locale={locale as Language}>
        <ConsentProvider>
          {analyticsConfig.enabled && (
            <>
              <ConsentInit />
              <GoogleTagManager gtmId={analyticsConfig.gtmId} />
            </>
          )}
          <AnalyticsTracker />
          <LocaleShell>
            {children}
          </LocaleShell>
          <CookieConsent />
        </ConsentProvider>
      </TranslationProvider>
    </NextIntlClientProvider>
  )
}
