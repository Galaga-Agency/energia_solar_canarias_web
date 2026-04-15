import type { ReactNode }         from 'react'
import { notFound }               from 'next/navigation'
import { TranslationProvider }    from '@/contexts/TranslationContext'
import { LocaleShell }            from '@/components/layout/LocaleShell'
import { isLocale, locales, type Language } from '@/config/i18n.config'
import commonEs from '@/locales/es/common.json'
import commonEn from '@/locales/en/common.json'

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

  const common = locale === 'en' ? commonEn : commonEs

  return (
    <TranslationProvider locale={locale as Language} initialPages={[common]}>
      <LocaleShell>
        {children}
      </LocaleShell>
    </TranslationProvider>
  )
}
