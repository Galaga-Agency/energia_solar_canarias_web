'use client'

import { gsap, ScrollTrigger } from '@/lib/gsap'

/**
 * Staggered entrances for the soluciones page. Each element marked
 * `data-sol-stagger` is a group whose direct `data-sol-item` children
 * animate up in sequence when the group scrolls into view. Mirrors the
 * homepage's card/list stagger feel (fade + rise, expo.out).
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

    gsap.set(items, { opacity: 0, y: 44 })

    const tw = gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'expo.out',
      scrollTrigger: { trigger: group, start: 'top 80%', once: true },
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
