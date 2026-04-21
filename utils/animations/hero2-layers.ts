'use client'

import { gsap, ScrollTrigger } from '@/lib/gsap'

const SCROLL = [
  { key: '4', scrollY: 180 },
  { key: '3', scrollY: 120 },
  { key: '2', scrollY: 70  },
  { key: '1', scrollY: 25  },
]

const DRIFT = [
  { key: '4', x:  22, y: -16, xDur: 26, yDur: 20, delay: 0.0 },
  { key: '3', x: -16, y: -12, xDur: 20, yDur: 16, delay: 0.5 },
  { key: '2', x:  12, y:  -8, xDur: 16, yDur: 13, delay: 1.0 },
  { key: '1', x:  -8, y:  -5, xDur: 13, yDur: 10, delay: 1.5 },
]

let _callCount = 0

export function initHero2Animations(): () => void {
  const hero = document.querySelector<HTMLElement>('[data-hero2]')
  if (!hero) return () => {}

  const call = ++_callCount
  const t0 = performance.now()
  const l1 = hero.querySelector<HTMLElement>('[data-layer-scroll="1"]')
  console.log(`[hero#${call}] init at ${t0.toFixed(0)}ms | layer-1 opacity="${l1 ? getComputedStyle(l1).opacity : 'null'}" vis="${l1?.style.visibility}"`)

  setTimeout(() => {
    console.log(`[hero#${call}] +1s | layer-1 opacity="${l1 ? getComputedStyle(l1).opacity : 'null'}" vis="${l1?.style.visibility}" transform="${l1?.style.transform}"`)
  }, 1000)

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

  DRIFT.forEach(({ key, x, y, xDur, yDur, delay }) => {
    const el = hero.querySelector<HTMLElement>(`[data-layer-drift="${key}"]`)
    if (!el) return
    tweens.push(
      gsap.to(el, { x, duration: xDur, ease: 'sine.inOut', repeat: -1, yoyo: true, delay }),
      gsap.to(el, { y, duration: yDur, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: delay + 0.3 }),
    )
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
    console.log(`[hero#${call}] cleanup`)
    tweens.forEach(t => t.kill())
    triggers.forEach(t => t.kill())
  }
}
