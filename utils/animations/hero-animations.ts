'use client'

import { gsap } from '@/lib/gsap'

export function initHeroAnimations(): void {
  const hero = document.querySelector('[data-hero]')
  if (!hero) return

  const elements = hero.querySelectorAll('[data-hero-item]')
  if (!elements.length) return

  const heroImage = hero.querySelector<HTMLElement>('[data-hero-image]')
  if (heroImage) {
    gsap.fromTo(heroImage, { scale: 1.12 }, { scale: 1, duration: 3, ease: 'power3.out' })
  }

  gsap.fromTo(
    elements,
    { opacity: 0, y: 40 },
    {
      opacity:  1,
      y:        0,
      duration: 0.8,
      ease:     'power3.out',
      stagger:  0.12,
    },
  )
}
