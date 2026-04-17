'use client'

import { gsap, ScrollTrigger } from '@/lib/gsap'
import { prefersReducedMotion } from '@/utils/device'

export function initScrollMarqueeAnimation(): () => void {
  if (prefersReducedMotion()) return () => {}

  const tracks = document.querySelectorAll<HTMLElement>('[data-scroll-marquee-track]')
  if (!tracks.length) return () => {}

  const tweens: gsap.core.Tween[] = []
  const triggers: ScrollTrigger[] = []

  tracks.forEach((track) => {
    const tween = gsap.to(track, {
      xPercent: -50,
      duration:  60,
      ease:      'none',
      repeat:    -1,
    })
    // Barely perceptible at rest — speeds up with scroll
    tween.timeScale(0.12)
    tweens.push(tween)

    const st = ScrollTrigger.create({
      onUpdate(self) {
        const velocity  = self.getVelocity()
        const absV      = Math.abs(velocity)
        const direction = velocity < 0 ? -1 : 1
        const scale     = direction * Math.max(0.12, Math.min(6, absV / 250))
        gsap.to(tween, { timeScale: scale, duration: 0.4, overwrite: true })
      },
    })
    triggers.push(st)
  })

  const decayToIdle = () => {
    tweens.forEach((t) => {
      if (Math.abs(t.timeScale()) > 0.15) {
        gsap.to(t, { timeScale: 0.12, duration: 1.2, overwrite: false })
      }
    })
  }

  let decayTimeout: ReturnType<typeof setTimeout> | null = null
  const onScrollEnd = () => {
    if (decayTimeout) clearTimeout(decayTimeout)
    decayTimeout = setTimeout(decayToIdle, 150)
  }

  window.addEventListener('scrollend', onScrollEnd, { passive: true })
  // fallback for browsers without scrollend
  window.addEventListener('scroll', onScrollEnd, { passive: true })

  return () => {
    tweens.forEach((t) => t.kill())
    triggers.forEach((t) => t.kill())
    window.removeEventListener('scrollend', onScrollEnd)
    window.removeEventListener('scroll', onScrollEnd)
    if (decayTimeout) clearTimeout(decayTimeout)
  }
}