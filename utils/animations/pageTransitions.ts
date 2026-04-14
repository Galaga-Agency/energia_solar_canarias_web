'use client'

import { gsap } from '@/lib/gsap'

export function exitPage(onComplete: () => void): void {
  gsap.killTweensOf('#main-content')
  gsap.to('#main-content', {
    opacity:  0,
    y:        -20,
    duration: 0.3,
    ease:     'power2.in',
    onComplete,
  })
}

export function enterPage(onComplete?: () => void): void {
  gsap.killTweensOf('#main-content')
  gsap.fromTo(
    '#main-content',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', onComplete },
  )
}
