'use client'

import { gsap, ScrollTrigger } from '@/lib/gsap'

export function initProyectosCardsAnimation(): () => void {
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-proyecto-card]'))
  if (!cards.length) return () => {}

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return () => {}

  gsap.set(cards, { y: 48, opacity: 0 })

  const tl = gsap.timeline({
    scrollTrigger: { trigger: cards[0], start: 'top 70%', once: true },
  })

  cards.forEach((card, i) => {
    tl.to(card, {
      y:        0,
      opacity:  1,
      duration: 0.9,
      ease:     'power3.out',
    }, i * 0.18)
  })

  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
    cards.forEach((card) => gsap.set(card, { clearProps: 'all' }))
    ScrollTrigger.refresh()
  }
}
