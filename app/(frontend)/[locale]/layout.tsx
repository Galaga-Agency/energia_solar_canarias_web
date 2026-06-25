import type { ReactNode }      from 'react'
import { notFound }            from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages }         from 'next-intl/server'
import { TranslationProvider } from '@/contexts/TranslationContext'
import { LocaleShell }         from '@/components/layout/LocaleShell'
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
        <LocaleShell>
          {children}
        </LocaleShell>
      </TranslationProvider>
    </NextIntlClientProvider>
  )
}
