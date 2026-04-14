'use client'

import { gsap, ScrollTrigger } from '@/lib/gsap'

export function initProcessStepsAnimation(): () => void {
  const steps = document.querySelectorAll<HTMLElement>('[data-process-step]')

  steps.forEach((step, i) => {
    gsap.fromTo(
      step,
      { opacity: 0, x: -30 },
      {
        opacity:  1,
        x:        0,
        duration: 0.6,
        ease:     'power3.out',
        delay:    i * 0.1,
        scrollTrigger: {
          trigger: step,
          start:   'top 85%',
          once:    true,
        },
      },
    )
  })

  return () => {
    ScrollTrigger.getAll().forEach((t) => t.kill())
  }
}
