'use client'

import { gsap, ScrollTrigger } from '@/lib/gsap'

export function initTestimonialsCardsAnimation(): () => void {
  const section = document.querySelector<HTMLElement>('[data-testimonials-section]')
  const track   = document.querySelector<HTMLElement>('[data-testimonials-track]')
  if (!section || !track) return () => {}

  const cards = Array.from(track.children) as HTMLElement[]
  if (cards.length < 2) return () => {}

  const viewportCenter = window.innerWidth / 2
  const mid            = (cards.length - 1) / 2
  const rects          = cards.map((c) => c.getBoundingClientRect())
  const xOffsets       = rects.map((r) => viewportCenter - (r.left + r.width / 2))

  section.style.overflow = 'visible'
  track.style.overflow   = 'visible'

  cards.forEach((card, i) => {
    gsap.set(card, {
      x:               xOffsets[i],
      y:               120,
      opacity:         0,
      rotation:        (i - mid) * 6,
      transformOrigin: '50% 100%',
    })
  })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start:   'top 82%',
      once:    true,
    },
  })

  // Pile rises as one solid object
  tl.to(cards, {
    y:        0,
    opacity:  1,
    duration: 0.65,
    ease:     'power3.out',
    stagger:  0,
  })

  // All cards spread simultaneously — same duration = all land at the same moment
  .to(cards, {
    x:        0,
    rotation: 0,
    duration: 0.8,
    ease:     'power4.out',
    stagger:  0,
    onComplete() {
      section.style.removeProperty('overflow')
      track.style.removeProperty('overflow')
    },
  }, '+=0.06')

  const st = tl.scrollTrigger

  return () => {
    tl.kill()
    if (st) st.kill()
    section.style.removeProperty('overflow')
    track.style.removeProperty('overflow')
    cards.forEach((card) => gsap.set(card, { clearProps: 'all' }))
  }
}
