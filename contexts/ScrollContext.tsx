'use client'

import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { initLenis, destroyLenis, getLenis } from '@/lib/lenis'
import type Lenis from 'lenis'

const ScrollContext = createContext<{ lenis: Lenis | null }>({ lenis: null })

export function ScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Own scroll restoration here (NOT via a pre-hydration <script>, which Next 15+/16
    // never runs on the client). The PageLoader overlay masks any one-frame flash.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    const onPageShow = (e: PageTransitionEvent) => { if (e.persisted) window.scrollTo(0, 0) }
    window.addEventListener('pageshow', onPageShow)

    const isDesktop = window.matchMedia('(min-width: 1024px)').matches
    if (isDesktop) initLenis()
    return () => {
      window.removeEventListener('pageshow', onPageShow)
      destroyLenis()
    }
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
