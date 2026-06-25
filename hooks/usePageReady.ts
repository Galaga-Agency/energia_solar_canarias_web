'use client'

import { useLayoutEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useMarkReady } from '@/hooks/useAppReady'
import { ScrollTrigger } from '@/lib/gsap'
import { getLenis } from '@/lib/lenis'

/**
 * Call once at the top of every page client component.
 * Waits for fonts + 600 ms minimum, then signals the app is ready
 * so the loader exits and animations can fire.
 */
export function usePageReady() {
  const markReady = useMarkReady()
  const pathname = usePathname()

  useLayoutEffect(() => {
    let cancelled = false

    const resetScroll = () => {
      // Keep native scroll, Lenis, and ScrollTrigger aligned before any page
      // animations mount; otherwise pinned sections can initialize against the
      // previous route's scroll state and briefly unpin/re-pin on return navs.
      getLenis()?.scrollTo(0, { immediate: true })
      window.scrollTo(0, 0)
    }

    // Reset BOTH the native scroll and Lenis. Lenis owns scrolling, so on a
    // client-side nav back it keeps the previous page's scroll value while
    // window.scrollTo resets native scroll — that mismatch makes pinned
    // ScrollTriggers strobe. scrollTo(0, immediate) keeps them in sync.
    resetScroll()

    const refreshId = requestAnimationFrame(() => {
      if (cancelled) return
      resetScroll()
      getLenis()?.resize()
      ScrollTrigger.refresh()
    })

    const min = new Promise<void>(r => setTimeout(r, 600))
    Promise.all([document.fonts.ready, min]).then(() => {
      if (!cancelled) markReady()
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(refreshId)
    }
  }, [markReady, pathname])
}
