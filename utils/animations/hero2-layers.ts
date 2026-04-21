'use client'

import { gsap, ScrollTrigger } from '@/lib/gsap'

const SCROLL = [
  { key: '4', scrollY: 180 },
  { key: '3', scrollY: 120 },
  { key: '2', scrollY: 70  },
  { key: '1', scrollY: 25  },
]

export function initHero2Animations(): () => void {
  const hero = document.querySelector<HTMLElement>('[data-hero2]')
  if (!hero) return () => {}

  const tweens: gsap.core.Tween[] = []
  const triggers: ScrollTrigger[] = []

  SCROLL.forEach(({ key, scrollY }) => {
    const el = hero.querySelector<HTMLElement>(`[data-layer-scroll="${key}"]`)
    if (!el) return
    const half = scrollY / 2
    const t = gsap.fromTo(el,
      { y: -half },
      {
        y: half,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 3,
        },
      },
    )
    tweens.push(t)
  })

  // Text entrance — staggered
  const items = hero.querySelectorAll<HTMLElement>('[data-hero2-item]')
  if (items.length) {
    gsap.set(items, { autoAlpha: 0, y: 30 })
    gsap.to(items, {
      autoAlpha: 1,
      y: 0,
      duration: 0.85,
      ease: 'power3.out',
      stagger: 0.12,
      delay: 0.6,
      overwrite: 'auto',
    })
  }

  return () => {
    tweens.forEach(t => t.kill())
    triggers.forEach(t => t.kill())
  }
}
