'use client'

import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'

let lenisInstance: Lenis | null = null
let tickerCallback: ((time: number) => void) | null = null

export function getLenis(): Lenis | null {
  return lenisInstance
}

export function initLenis(): Lenis {
  if (lenisInstance) return lenisInstance

  lenisInstance = new Lenis({
    duration:    1.2,
    easing:      (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })

  // Drive Lenis from GSAP's ticker so ScrollTrigger stays frame-accurate.
  // Without this, Lenis and ScrollTrigger run on separate rAF loops and
  // produce out-of-sync scroll positions that strobe every scrub animation.
  lenisInstance.on('scroll', ScrollTrigger.update)

  tickerCallback = (time: number) => { lenisInstance?.raf(time * 1000) }
  gsap.ticker.add(tickerCallback)
  gsap.ticker.lagSmoothing(0)

  return lenisInstance
}

export function destroyLenis() {
  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback)
    tickerCallback = null
  }
  lenisInstance?.destroy()
  lenisInstance = null
}
