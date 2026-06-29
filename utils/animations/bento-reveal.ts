'use client'

import { gsap, ScrollTrigger } from '@/lib/gsap'

/**
 * Bento tiles enter with a staggered scale-up + fade — a card-style reveal
 * (cards may move; no fade-up text motion). Each [data-bento-tile] pops in.
 */
export function initBentoReveal(): () => void {
  const tiles = Array.from(document.querySelectorAll<HTMLElement>('[data-bento-tile]'))
  if (!tiles.length) return () => {}

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return () => {}

  gsap.set(tiles, { opacity: 0, scale: 0.92, transformOrigin: '50% 50%' })

  const tw = gsap.to(tiles, {
    opacity: 1,
    scale: 1,
    duration: 0.7,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: tiles[0], start: 'top 78%', once: true },
  })

  return () => {
    tw.scrollTrigger?.kill()
    tw.kill()
    tiles.forEach((el) => gsap.set(el, { clearProps: 'all' }))
    ScrollTrigger.refresh()
  }
}
