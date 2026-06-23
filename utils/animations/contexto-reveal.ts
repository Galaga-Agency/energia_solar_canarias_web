'use client'

import { gsap, ScrollTrigger } from '@/lib/gsap'

function formatFromTarget(target: string, value: number): string {
  const decimals = (target.split(',')[1] || target.split('.')[1] || '').length
  if (decimals) return value.toFixed(decimals).replace('.', ',')
  return Math.round(value).toString()
}

/** Contexto stats — number count-up only, no fade/stagger entrance. */
export function initContextoReveal(): () => void {
  const section = document.querySelector<HTMLElement>('[data-contexto-section]')
  if (!section) return () => {}

  const values = Array.from(section.querySelectorAll<HTMLElement>('[data-contexto-value]'))
  if (!values.length) return () => {}

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return () => {}

  values.forEach((el) => { el.textContent = '0' })

  const tl = gsap.timeline({
    scrollTrigger: { trigger: section, start: 'top 75%', once: true },
  })

  values.forEach((el, i) => {
    const target = el.getAttribute('data-target') || '0'
    const num    = parseFloat(target.replace(',', '.'))
    if (isNaN(num)) return
    const obj = { v: 0 }
    tl.to(obj, {
      v: num,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate() { el.textContent = formatFromTarget(target, obj.v) },
    }, i * 0.12)
  })

  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
    values.forEach((el) => { el.textContent = el.getAttribute('data-target') || '' })
    ScrollTrigger.refresh()
  }
}
