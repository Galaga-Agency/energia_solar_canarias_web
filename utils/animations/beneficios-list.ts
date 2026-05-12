'use client'

import { gsap, ScrollTrigger } from '@/lib/gsap'

const DIRECTIONS = [
  { x: -80, y: 0   }, // Card 0 — slides in from the LEFT
  { x: 0,   y: -80 }, // Card 1 — slides in from the TOP
  { x: 0,   y: 80  }, // Card 2 — slides in from the BOTTOM
  { x: 80,  y: 0   }, // Card 3 — slides in from the RIGHT
] as const

export function initBeneficiosListAnimation(): () => void {
  const section = document.querySelector<HTMLElement>('[data-bene-section]')
  if (!section) return () => {}

  const items = Array.from(section.querySelectorAll<HTMLElement>('[data-bene-item]'))
  if (!items.length) return () => {}

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return () => {}

  items.forEach((item, i) => {
    const dir = DIRECTIONS[i % DIRECTIONS.length]
    gsap.set(item, { x: dir.x, y: dir.y, opacity: 0 })
  })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start:   'top 60%',
      once:    true,
    },
  })

  items.forEach((item, i) => {
    tl.to(item, {
      x:        0,
      y:        0,
      opacity:  1,
      duration: 1.4,
      ease:     'expo.out',
    }, i * 0.18)
  })

  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
    items.forEach((item) => gsap.set(item, { clearProps: 'all' }))
  }
}
