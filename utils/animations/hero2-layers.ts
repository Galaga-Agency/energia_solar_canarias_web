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
    gsap.set(el, { y: -half, force3D: true })
    const t = gsap.fromTo(el,
      { y: -half },
      {
        y: half,
        ease: 'none',
        force3D: true,
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

  // Brand mark drifts in from above
  const logo = hero.querySelector<HTMLElement>('[data-hero2-logo]')
  if (logo) {
    gsap.set(logo, { autoAlpha: 0, y: -32 })
    gsap.to(logo, {
      autoAlpha: 1,
      y: 0,
      duration: 1.1,
      ease: 'power3.out',
      delay: 0.4,
      overwrite: 'auto',
    })
  }

  // Text content rises from below with stagger
  const items = hero.querySelectorAll<HTMLElement>('[data-hero2-item]')
  if (items.length) {
    gsap.set(items, { autoAlpha: 0, y: 48 })
    gsap.to(items, {
      autoAlpha: 1,
      y: 0,
      duration: 1.0,
      ease: 'power4.out',
      stagger: 0.14,
      delay: 0.5,
      overwrite: 'auto',
    })
  }

  return () => {
    tweens.forEach(t => t.kill())
    triggers.forEach(t => t.kill())
  }
}
