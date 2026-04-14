'use client'

import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/utils/device'

export function initBlobAnimation(): () => void {
  if (prefersReducedMotion()) return () => {}

  const blobs = document.querySelectorAll<HTMLElement>('[data-blob-decor]')
  const tweens: gsap.core.Tween[] = []

  blobs.forEach((blob) => {
    const t1 = gsap.to(blob, {
      x:        '+=20',
      y:        '+=15',
      scale:    1.04,
      duration: 8,
      ease:     'sine.inOut',
      yoyo:     true,
      repeat:   -1,
    })

    const t2 = gsap.to(blob, {
      rotate:   '+=5',
      duration: 12,
      ease:     'sine.inOut',
      yoyo:     true,
      repeat:   -1,
    })

    tweens.push(t1, t2)
  })

  return () => {
    tweens.forEach((t) => t.kill())
  }
}
