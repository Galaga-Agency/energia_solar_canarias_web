'use client'

import { gsap, ScrollTrigger } from '@/lib/gsap'

export function initHighlightDraw(selector = '[data-highlight-draw]'): () => void {
  const elements = document.querySelectorAll<HTMLElement>(selector)

  elements.forEach((el) => {
    const overlay = el.querySelector<HTMLElement>('.highlight-overlay')

    const config = {
      duration: 1.4,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 45%', once: true },
    }

    // Overlay is opaque (bg-primary + white text) — clip-path reveals it over the green base text
    gsap.fromTo(overlay, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', ...config })
  })

  return () => ScrollTrigger.getAll().forEach((t) => t.kill())
}
