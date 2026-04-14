'use client'

import { gsap, ScrollTrigger } from '@/lib/gsap'

export function initStatsCounterAnimations(): () => void {
  const counters = document.querySelectorAll<HTMLElement>('[data-counter]')

  counters.forEach((el) => {
    const target  = parseFloat(el.dataset.counter ?? '0')
    const isFloat = !Number.isInteger(target)
    const obj     = { val: 0 }

    gsap.to(obj, {
      val:      target,
      duration: 2,
      ease:     'power2.out',
      scrollTrigger: {
        trigger: el,
        start:   'top 85%',
        once:    true,
      },
      onUpdate() {
        el.textContent = isFloat
          ? obj.val.toFixed(1)
          : Math.round(obj.val).toString()
      },
    })
  })

  return () => {
    ScrollTrigger.getAll().forEach((t) => t.kill())
  }
}
