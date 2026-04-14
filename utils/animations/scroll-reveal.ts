'use client'

import { gsap, ScrollTrigger } from '@/lib/gsap'

export function initScrollRevealSections(): () => void {
  const elements = document.querySelectorAll<HTMLElement>('[data-reveal]')

  elements.forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity:  1,
        y:        0,
        duration: 0.7,
        ease:     'power3.out',
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
