'use client'

import { gsap, ScrollTrigger } from '@/lib/gsap'

export function initProyectosCardsAnimation(): () => void {
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-proyecto-card]'))
  if (!cards.length) return () => {}

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return () => {}

  const triggers: ScrollTrigger[] = []

  // Each card reveals on its own as it scrolls into view — a small, gentle fade-up.
  // (Previously one shared timeline triggered by the first card animated ALL cards
  // from y:48 at once, so the full-bleed image sections lower down lurched in
  // together and read as a jarring shove.)
  cards.forEach((card) => {
    gsap.set(card, { y: 20, opacity: 0 })

    const tween = gsap.to(card, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      ease: 'power2.out',
      paused: true,
    })

    const st = ScrollTrigger.create({
      trigger: card,
      start: 'top 85%',
      once: true,
      onEnter: () => tween.play(),
    })
    triggers.push(st)
  })

  return () => {
    triggers.forEach((st) => st.kill())
    cards.forEach((card) => {
      gsap.killTweensOf(card)
      gsap.set(card, { clearProps: 'all' })
    })
  }
}
