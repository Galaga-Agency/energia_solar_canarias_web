'use client'

import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/utils/device'

const DEFAULT_LEFT = '82%'
const DEFAULT_TOP  = '14%'

export function initCtaGlow(section: HTMLElement): () => void {
  if (prefersReducedMotion()) return () => {}

  const glow    = section.querySelector<HTMLElement>('[data-cta-glow]')
  const trigger = section.querySelector<HTMLElement>('[data-cta-trigger]')
  if (!glow || !trigger) return () => {}

  gsap.set(glow, { left: DEFAULT_LEFT, top: DEFAULT_TOP })

  function onEnter() {
    const sR = section.getBoundingClientRect()
    const tR = trigger!.getBoundingClientRect()
    const x  = ((tR.left + tR.width  / 2 - sR.left) / sR.width)  * 100
    const y  = ((tR.top  + tR.height / 2 - sR.top)  / sR.height) * 100
    gsap.to(glow, { left: `${x}%`, top: `${y}%`, opacity: 1, duration: 0.75, ease: 'power3.out' })
  }

  function onLeave() {
    gsap.to(glow, { left: DEFAULT_LEFT, top: DEFAULT_TOP, opacity: 0.85, duration: 0.75, ease: 'power3.out' })
  }

  trigger.addEventListener('mouseenter', onEnter)
  trigger.addEventListener('mouseleave', onLeave)

  return () => {
    trigger.removeEventListener('mouseenter', onEnter)
    trigger.removeEventListener('mouseleave', onLeave)
  }
}
