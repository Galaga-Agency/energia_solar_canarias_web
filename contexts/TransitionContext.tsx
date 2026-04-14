'use client'

import { createContext, useContext, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { exitPage, enterPage } from '@/utils/animations/pageTransitions'
import { getLenis } from '@/lib/lenis'

interface TransitionContextValue {
  isTransitioning: boolean
  startTransition: (href: string) => void
}

const TransitionContext = createContext<TransitionContextValue | null>(null)

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const pendingHref = useRef<string | null>(null)

  const scrollToTop = useCallback(() => {
    getLenis()?.scrollTo(0, { immediate: true })
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  const startTransition = useCallback((href: string) => {
    if (isTransitioning) return
    if (href === pathname) {
      scrollToTop()
      return
    }

    pendingHref.current = href
    setIsTransitioning(true)
    exitPage(() => {
      scrollToTop()
      router.push(href, { scroll: false })
    })
  }, [isTransitioning, pathname, router, scrollToTop])

  useEffect(() => {
    if (!isTransitioning || pendingHref.current !== pathname) return

    scrollToTop()
    requestAnimationFrame(() => {
      enterPage(() => {
        pendingHref.current = null
        setIsTransitioning(false)
      })
    })
  }, [isTransitioning, pathname, scrollToTop])

  return (
    <TransitionContext.Provider value={{ isTransitioning, startTransition }}>
      {children}
    </TransitionContext.Provider>
  )
}

export function useTransitionContext(): TransitionContextValue {
  const ctx = useContext(TransitionContext)
  if (!ctx) throw new Error('useTransitionContext must be inside TransitionProvider')
  return ctx
}
