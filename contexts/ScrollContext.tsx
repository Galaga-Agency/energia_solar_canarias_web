'use client'

import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { initLenis, destroyLenis, getLenis } from '@/lib/lenis'
import type Lenis from 'lenis'

const ScrollContext = createContext<{ lenis: Lenis | null }>({ lenis: null })

export function ScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Only enable smooth scroll on desktop
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches
    if (isDesktop) initLenis()
    return () => { destroyLenis() }
  }, [])

  return (
    <ScrollContext.Provider value={{ lenis: getLenis() }}>
      {children}
    </ScrollContext.Provider>
  )
}

export function useScrollContext() {
  return useContext(ScrollContext)
}
