'use client'

import { useEffect } from 'react'
import { useMarkReady } from '@/hooks/useAppReady'

/**
 * Call once at the top of every page client component.
 * Waits for fonts + 600 ms minimum, then signals the app is ready
 * so the loader exits and animations can fire.
 */
export function usePageReady() {
  const markReady = useMarkReady()

  useEffect(() => {
    const min = new Promise<void>(r => setTimeout(r, 600))
    Promise.all([document.fonts.ready, min]).then(() => markReady())
  }, [markReady])
}
