'use client'

import { gsap, ScrollTrigger } from '@/lib/gsap'

/**
 * Pure fade-in for every `[data-reveal]` element — NO upward (y) motion.
 * Things still animate in on scroll, they just don't fade UP (the user hates that).
 */
export function initScrollRevealSections(): () => void {
  const elements = document.querySelectorAll<HTMLElement>('[data-reveal]')

  elements.forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0 },
      {
        opacity:  1,
        duration: 0.7,
        ease:     'power2.out',
        scrollTrigger: {
          trigger: el,
          start:   'top 85%',
          once:    true,
        },
      },
    )
  })

  return () => {
    ScrollTrigger.getAll().forEach((t) => t.kill())
  }
}
