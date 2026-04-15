'use client'

import { createContext, useState, useCallback, useEffect, type ReactNode } from 'react'

interface AppReadyContextValue {
  appReady:  boolean
  markReady: () => void
}

export const AppReadyContext = createContext<AppReadyContextValue | null>(null)

export function AppReadyProvider({ children }: { children: ReactNode }) {
  const [appReady, setAppReady] = useState(false)

  const markReady = useCallback(() => {
    setAppReady(true)
  }, [])

  useEffect(() => {
    if (appReady) {
      document.body.style.overflow = ''
    } else {
      document.body.style.overflow = 'hidden'
    }
    return () => { document.body.style.overflow = '' }
  }, [appReady])

  return (
    <AppReadyContext.Provider value={{ appReady, markReady }}>
      {children}
    </AppReadyContext.Provider>
  )
}

