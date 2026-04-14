'use client'

import { gsap, ScrollTrigger } from '@/lib/gsap'

export function initDrawArrowAnimation(): () => void {
  const arrows = document.querySelectorAll<SVGPathElement>('[data-draw-arrow]')

  arrows.forEach((arrow) => {
    const length = arrow.getTotalLength?.() ?? 200
    gsap.set(arrow, { strokeDasharray: length, strokeDashoffset: length })

    gsap.to(arrow, {
      strokeDashoffset: 0,
      duration:         1.2,
      ease:             'power2.out',
      scrollTrigger: {
        trigger: arrow,
        start:   'top 80%',
        once:    true,
      },
    })
  })

  return () => {
    ScrollTrigger.getAll().forEach((t) => t.kill())
  }
}
