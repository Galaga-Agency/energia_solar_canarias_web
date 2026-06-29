'use client'

import { gsap, ScrollTrigger } from '@/lib/gsap'

/**
 * Staggered entrances for the soluciones page. Each `data-sol-stagger` group's
 * direct `data-sol-item` children un-mask upward (clip wipe) with a small rise
 * when the group scrolls in. Matches the refined homepage card reveals.
 */
export function initSolucionesReveal(): () => void {
  const groups = Array.from(document.querySelectorAll<HTMLElement>('[data-sol-stagger]'))
  if (!groups.length) return () => {}

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return () => {}

  const tweens: gsap.core.Tween[] = []

  groups.forEach((group) => {
    const items = Array.from(group.querySelectorAll<HTMLElement>('[data-sol-item]'))
      .filter((el) => el.closest('[data-sol-stagger]') === group)
    if (!items.length) return

    // Card rise — matches the homepage cards (rise + fade, staggered).
    gsap.set(items, { opacity: 0, y: 48 })

    const tw = gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.18,
      ease: 'power3.out',
      scrollTrigger: { trigger: group, start: 'top 75%', once: true },
    })
    tweens.push(tw)
  })

  return () => {
    tweens.forEach((t) => {
      t.scrollTrigger?.kill()
      t.kill()
    })
    groups.forEach((g) =>
      g.querySelectorAll<HTMLElement>('[data-sol-item]').forEach((el) => gsap.set(el, { clearProps: 'all' })),
    )
    ScrollTrigger.refresh()
  }
}
