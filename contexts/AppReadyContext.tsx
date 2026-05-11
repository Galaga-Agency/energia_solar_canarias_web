'use client'

import { createContext, useState, useCallback, useEffect, type ReactNode } from 'react'

interface AppReadyContextValue {
  appReady:       boolean
  markReady:      () => void
  loaderGone:     boolean
  markLoaderGone: () => void
}

export const AppReadyContext = createContext<AppReadyContextValue | null>(null)

export function AppReadyProvider({ children }: { children: ReactNode }) {
  const [appReady, setAppReady]     = useState(false)
  const [loaderGone, setLoaderGone] = useState(false)

  const markReady      = useCallback(() => { setAppReady(true) },     [])
  const markLoaderGone = useCallback(() => { setLoaderGone(true) },   [])

  useEffect(() => {
    if (loaderGone) {
      document.body.style.overflow = ''
    } else {
      document.body.style.overflow = 'hidden'
    }
    return () => { document.body.style.overflow = '' }
  }, [loaderGone])

  return (
    <AppReadyContext.Provider value={{ appReady, markReady, loaderGone, markLoaderGone }}>
      {children}
    </AppReadyContext.Provider>
  )
}
