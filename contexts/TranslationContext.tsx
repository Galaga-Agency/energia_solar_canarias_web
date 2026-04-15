'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import {
  locales,
  routeTranslations,
  type Language,
} from '@/config/i18n.config'

type Messages = Record<string, unknown>

interface TranslationContextValue {
  language:       Language
  changeLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t:              (key: string) => string
}

const TranslationContext = createContext<TranslationContextValue | null>(null)

function getNestedValue(obj: Messages, key: string): string {
  const parts  = key.split('.')
  let   cursor: unknown = obj
  for (const part of parts) {
    if (typeof cursor !== 'object' || cursor === null) return key
    cursor = (cursor as Messages)[part]
  }
  return typeof cursor === 'string' ? cursor : key
}

interface TranslationProviderProps {
  children:     ReactNode
  locale:       Language
  initialPages: Messages[]
}

export function TranslationProvider({
  children,
  locale,
  initialPages,
}: TranslationProviderProps) {
  const [language,  setLanguage]  = useState<Language>(locale)
  const [messages,  setMessages]  = useState<Messages>(() =>
    Object.assign({}, ...initialPages),
  )

  const loadMessages = useCallback(async (lang: Language, pageName: string) => {
    try {
      const [common, page] = await Promise.all([
        import(`@/locales/${lang}/common.json`),
        import(`@/locales/${lang}/${pageName}.json`).catch(() => ({ default: {} })),
      ])
      setMessages(Object.assign({}, common.default, page.default))
    } catch {
      // fall back to existing messages
    }
  }, [])

  const changeLanguage = useCallback(
    (lang: Language) => {
      if (!locales.includes(lang)) return

      setLanguage(lang)
      document.documentElement.setAttribute('lang', lang)

      const { pathname } = window.location
      const segments = pathname.split('/').filter(Boolean)
      const currentLang = segments[0] as Language
      const currentSlug = segments[1] ?? ''

      const translations = routeTranslations[lang]
      const newSlug = translations[currentSlug] ?? currentSlug

      const hasLang = locales.includes(currentLang)
      const newPath = hasLang
        ? `/${lang}${newSlug ? '/' + newSlug : ''}`
        : `/${lang}${pathname}`

      window.history.replaceState(null, '', newPath)
    },
    [],
  )

  const toggleLanguage = useCallback(() => {
    const next = language === 'es' ? 'en' : 'es'
    changeLanguage(next)
  }, [language, changeLanguage])

  const t = useCallback(
    (key: string): string => getNestedValue(messages, key),
    [messages],
  )

  // Re-load messages when language changes
  useEffect(() => {
    document.documentElement.setAttribute('lang', language)
    const pageName = window.location.pathname.split('/').filter(Boolean)[1] ?? 'home'
    loadMessages(language, pageName)
  }, [language, loadMessages])

  return (
    <TranslationContext.Provider value={{ language, changeLanguage, toggleLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation(): TranslationContextValue {
  const ctx = useContext(TranslationContext)
  if (!ctx) throw new Error('useTranslation must be used inside TranslationProvider')
  return ctx
}
