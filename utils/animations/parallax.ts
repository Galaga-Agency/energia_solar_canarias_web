'use client'

import { gsap, ScrollTrigger } from '@/lib/gsap'

export function initParallax(root: HTMLElement | Document = document): () => void {
  const elements = (root as Element).querySelectorAll<HTMLElement>('[data-speed]')

  elements.forEach((el) => {
    const speed  = parseFloat(el.dataset.speed ?? '1')
    const offset = (1 - speed) * 100

    gsap.fromTo(
      el,
      { yPercent: -offset / 2 },
      {
        yPercent: offset / 2,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    )
  })

  return () => ScrollTrigger.getAll().forEach((t) => t.kill())
}
