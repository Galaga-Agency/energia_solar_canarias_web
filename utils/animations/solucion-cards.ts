'use client'

import { gsap, ScrollTrigger } from '@/lib/gsap'

export function initSolucionCardsAnimation(): () => void {
  const grid  = document.querySelector<HTMLElement>('[data-soluciones-grid]')
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-solucion-card]'))
  if (!cards.length) return () => {}

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return () => {}

  // Per-card setup: media + copy move in opposite directions, flipping per card.
  cards.forEach((card, i) => {
    const media = card.querySelector<HTMLElement>('[data-solucion-media]')
    const copy  = card.querySelector<HTMLElement>('[data-solucion-copy]')

    const reversed = i % 2 === 1
    const mediaY   = reversed ? 60 : -60   // image slides up (reversed) or down (default)
    const copyY    = reversed ? -60 : 60   // copy slides opposite

    if (media) gsap.set(media, { y: mediaY, opacity: 0 })
    if (copy)  gsap.set(copy,  { y: copyY,  opacity: 0 })
  })

  const tl = gsap.timeline({
    scrollTrigger: { trigger: grid ?? cards[0], start: 'top 70%', once: true },
  })

  cards.forEach((card, i) => {
    const media = card.querySelector<HTMLElement>('[data-solucion-media]')
    const copy  = card.querySelector<HTMLElement>('[data-solucion-copy]')
    const at    = i * 0.22

    if (media) {
      tl.to(media, {
        y:        0,
        opacity:  1,
        duration: 1.3,
        ease:     'expo.out',
      }, at)
    }
    if (copy) {
      tl.to(copy, {
        y:        0,
        opacity:  1,
        duration: 1.3,
        ease:     'expo.out',
      }, at + 0.1)
    }
  })

  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
    cards.forEach((card) => {
      card.querySelectorAll<HTMLElement>('[data-solucion-media],[data-solucion-copy]').forEach((el) => {
        gsap.set(el, { clearProps: 'all' })
      })
    })
    ScrollTrigger.refresh()
  }
}
