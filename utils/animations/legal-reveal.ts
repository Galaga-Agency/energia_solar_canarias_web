'use client'

import { gsap, ScrollTrigger } from '@/lib/gsap'

/**
 * Entrance for legal / prose pages. One coherent motion:
 *  - Every [data-legal-item] starts hidden.
 *  - Items already in the viewport on load fade up in a stagger (like a hero).
 *  - Items below the fold fade up as they scroll into view.
 * Fixes the "only the title + first block animate, the rest stay static" feel:
 * ScrollTrigger.batch evaluates in-view elements immediately AND on scroll.
 */
export function initLegalReveal(): () => void {
  const items = gsap.utils.toArray<HTMLElement>('[data-legal-item]')
  if (!items.length) return () => {}

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) {
    gsap.set(items, { opacity: 1, y: 0 })
    return () => {}
  }

  gsap.set(items, { opacity: 0, y: 28 })

  const triggers = ScrollTrigger.batch(items, {
    start: 'top 92%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.1,
        overwrite: true,
      }),
  })

  // Make sure in-view items on first paint are evaluated.
  ScrollTrigger.refresh()

  return () => {
    triggers.forEach((t) => t.kill())
    gsap.set(items, { clearProps: 'all' })
  }
}
