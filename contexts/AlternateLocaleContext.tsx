'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { Language } from '@/config/i18n.config'

/** Per-locale path overrides for the language switcher.
 *  Pages with locale-specific slugs (e.g. blog articles) register a map like
 *  { es: '/blog/<es-slug>', en: '/blog/<en-slug>' } so switching language lands
 *  on the correct translated URL instead of 404ing on the wrong-locale slug. */
type AlternatePaths = Partial<Record<Language, string>>

interface AlternateLocaleContextValue {
  alternates: AlternatePaths | null
  setAlternates: (paths: AlternatePaths | null) => void
}

const AlternateLocaleContext = createContext<AlternateLocaleContextValue | null>(null)

export function AlternateLocaleProvider({ children }: { children: ReactNode }) {
  const [alternates, setAlternates] = useState<AlternatePaths | null>(null)
  return (
    <AlternateLocaleContext.Provider value={{ alternates, setAlternates }}>
      {children}
    </AlternateLocaleContext.Provider>
  )
}

export function useAlternateLocale(): AlternateLocaleContextValue {
  const ctx = useContext(AlternateLocaleContext)
  if (!ctx) throw new Error('useAlternateLocale must be used inside AlternateLocaleProvider')
  return ctx
}

/** Register per-locale path overrides for the current page; clears them on unmount. */
export function useRegisterAlternateLocale(paths: AlternatePaths | null) {
  const { setAlternates } = useAlternateLocale()
  const key = paths ? JSON.stringify(paths) : null
  const stableSet = useCallback(setAlternates, [setAlternates])
  useEffect(() => {
    stableSet(key ? (JSON.parse(key) as AlternatePaths) : null)
    return () => stableSet(null)
  }, [key, stableSet])
}
