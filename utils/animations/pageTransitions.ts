'use client'

import { gsap } from '@/lib/gsap'

export function exitPage(onComplete: () => void): void {
  gsap.killTweensOf('#main-content')
  gsap.to('#main-content', {
    opacity:  0,
    duration: 0.3,
    ease:     'power2.in',
    clearProps: 'transform',
    onComplete,
  })
}

export function enterPage(onComplete?: () => void): void {
  gsap.killTweensOf('#main-content')
  gsap.fromTo(
    '#main-content',
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out',
      clearProps: 'opacity,transform',
      onComplete,
    },
  )
}
