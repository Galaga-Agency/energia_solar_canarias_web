'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { useLocale } from 'next-intl'
import { locales, routeTranslations, type Language } from '@/config/i18n.config'

interface TranslationContextValue {
  language:       Language
  changeLanguage: (lang: Language) => void
  toggleLanguage: () => void
}

const TranslationContext = createContext<TranslationContextValue | null>(null)

export function TranslationProvider({ children, locale }: { children: ReactNode; locale: Language }) {
  const [language, setLanguage] = useState<Language>(locale)

  const changeLanguage = useCallback((lang: Language) => {
    if (!locales.includes(lang)) return

    setLanguage(lang)
    document.documentElement.setAttribute('lang', lang)

    const { pathname } = window.location
    const segments     = pathname.split('/').filter(Boolean)
    const currentLang  = segments[0] as Language
    const currentSlug  = segments[1] ?? ''

    const newSlug = routeTranslations[lang][currentSlug] ?? currentSlug
    const hasLang = locales.includes(currentLang)
    const newPath = hasLang
      ? `/${lang}${newSlug ? '/' + newSlug : ''}`
      : `/${lang}${pathname}`

    window.history.replaceState(null, '', newPath)
  }, [])

  const toggleLanguage = useCallback(() => {
    changeLanguage(language === 'es' ? 'en' : 'es')
  }, [language, changeLanguage])

  return (
    <TranslationContext.Provider value={{ language, changeLanguage, toggleLanguage }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation(): TranslationContextValue {
  const ctx = useContext(TranslationContext)
  if (!ctx) throw new Error('useTranslation must be used inside TranslationProvider')
  return ctx
}

export function useLanguage(): Language {
  return useLocale() as Language
}
