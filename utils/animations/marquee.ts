'use client'

import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/utils/device'

export function initMarqueeAnimation(): () => void {
  if (prefersReducedMotion()) return () => {}

  const tracks = document.querySelectorAll<HTMLElement>('[data-marquee-track]')
  const tweens: gsap.core.Tween[] = []

  tracks.forEach((track) => {
    const tween = gsap.fromTo(
      track,
      { xPercent: -50 },
      { xPercent: 0, duration: 60, ease: 'none', repeat: -1 },
    )
    tweens.push(tween)
  })

  return () => {
    tweens.forEach((t) => t.kill())
  }
}
