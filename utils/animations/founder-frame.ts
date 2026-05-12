'use client'

import { gsap, ScrollTrigger } from '@/lib/gsap'

export function initFounderFrameAnimation(): () => void {
  const section = document.querySelector<HTMLElement>('[data-founder-section]')
  if (!section) return () => {}

  const frame = section.querySelector<HTMLElement>('[data-founder-frame]')
  const quote = section.querySelector<HTMLElement>('[data-founder-quote]')
  if (!frame && !quote) return () => {}

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReduced) {
    if (frame) gsap.set(frame, { x: 24, y: 24, opacity: 1 })
    if (quote) gsap.set(quote, { y: 0, opacity: 1 })
    return () => {}
  }

  if (frame) gsap.set(frame, { x: 0, y: 0, opacity: 0 })
  if (quote) gsap.set(quote, { y: 32, opacity: 0 })

  const tl = gsap.timeline({
    scrollTrigger: { trigger: section, start: 'top 70%', once: true },
  })

  if (frame) {
    tl.to(frame, {
      x:        24,
      y:        24,
      opacity:  1,
      duration: 1.4,
      ease:     'power3.out',
    }, 0)
  }

  if (quote) {
    tl.to(quote, {
      y:        0,
      opacity:  1,
      duration: 0.95,
      ease:     'power3.out',
    }, 0.2)
  }

  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
    if (frame) gsap.set(frame, { clearProps: 'all' })
    if (quote) gsap.set(quote, { clearProps: 'all' })
  }
}
