'use client'

import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/utils/device'

export function initMarqueeAnimation(): () => void {
  if (prefersReducedMotion()) return () => {}

  const tracks = document.querySelectorAll<HTMLElement>('[data-marquee-track]')
  const tweens: gsap.core.Tween[] = []

  tracks.forEach((track) => {
    const tween = gsap.to(track, {
      xPercent: -50,
      duration: 30,
      ease:     'none',
      repeat:   -1,
    })
    tweens.push(tween)
  })

  return () => {
    tweens.forEach((t) => t.kill())
  }
}
