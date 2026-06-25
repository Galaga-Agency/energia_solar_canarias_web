'use client'

import { useEffect } from 'react'
import { useMarkReady } from '@/hooks/useAppReady'
import { getLenis } from '@/lib/lenis'

/**
 * Call once at the top of every page client component.
 * Waits for fonts + 600 ms minimum, then signals the app is ready
 * so the loader exits and animations can fire.
 */
export function usePageReady() {
  const markReady = useMarkReady()

  useEffect(() => {
    // Reset BOTH the native scroll and Lenis. Lenis owns scrolling, so on a
    // client-side nav back it keeps the previous page's scroll value while
    // window.scrollTo resets native scroll — that mismatch makes pinned
    // ScrollTriggers strobe. scrollTo(0, immediate) keeps them in sync.
    getLenis()?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
    const min = new Promise<void>(r => setTimeout(r, 600))
    Promise.all([document.fonts.ready, min]).then(() => markReady())
  }, [markReady])
}
