'use client'

import { gsap } from '@/lib/gsap'

function formatFromTarget(target: string, value: number): string {
  const match = target.match(/[.,](\d+)$/)
  const decimals = match ? match[1].length : 0
  const hasThousands = /\d\.\d{3}(\D|$)/.test(target)

  if (decimals) {
    return value.toFixed(decimals).replace('.', ',')
  }
  let s = Math.round(value).toString()
  if (hasThousands && value >= 1000) {
    s = s.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }
  return s
}

export function initStatsRevealAnimation(): () => void {
  const section = document.querySelector<HTMLElement>('[data-stats-section]')
  if (!section) return () => {}

  const titleWrap = section.querySelector<HTMLElement>('[data-stats-title-wrap]')
  const meta      = section.querySelector<HTMLElement>('[data-stats-meta]')
  const stats     = Array.from(section.querySelectorAll<HTMLElement>('[data-stat-item]'))
  const values    = Array.from(section.querySelectorAll<HTMLElement>('[data-stat-value]'))
  if (!titleWrap || !stats.length) return () => {}

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return () => {}

  // Measure travel: from final position to section's center
  const sectionRect = section.getBoundingClientRect()
  const titleRect   = titleWrap.getBoundingClientRect()
  const travelY     = (sectionRect.top + sectionRect.height / 2) - (titleRect.top + titleRect.height / 2)
  const travelX     = (sectionRect.left + sectionRect.width / 2) - (titleRect.left + titleRect.width / 2)

  gsap.set(titleWrap, { x: travelX, y: travelY, scale: 1.15, transformOrigin: '50% 50%' })
  if (meta) gsap.set(meta, { opacity: 0, y: 24 })
  gsap.set(stats, { opacity: 0, y: 28 })
  values.forEach(el => { el.textContent = '0' })

  const tl = gsap.timeline({
    scrollTrigger: { trigger: section, start: 'top 70%', once: true },
  })

  tl.to(titleWrap, {
    x: 0, y: 0, scale: 1,
    duration: 1.2,
    ease: 'power3.inOut',
  })

  if (meta) {
    tl.to(meta, {
      opacity: 1, y: 0,
      duration: 0.5,
      ease: 'power3.out',
    }, '-=0.5')
  }

  tl.to(stats, {
    opacity: 1, y: 0,
    duration: 0.65,
    stagger: 0.15,
    ease: 'power3.out',
  }, '-=0.45')

  const statsStartAt = tl.recent().startTime()

  values.forEach((el, i) => {
    const target  = el.getAttribute('data-target') || '0'
    const cleaned = target.replace(/\./g, '').replace(',', '.')
    const num     = parseFloat(cleaned)
    if (isNaN(num)) return

    const obj = { v: 0 }
    tl.to(obj, {
      v: num,
      duration: 1.4,
      ease: 'power2.out',
      onUpdate() { el.textContent = formatFromTarget(target, obj.v) },
    }, statsStartAt + i * 0.15)
  })

  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
    gsap.set([titleWrap, ...(meta ? [meta] : []), ...stats], { clearProps: 'all' })
    values.forEach((el, i) => { el.textContent = el.getAttribute('data-target') || '' })
  }
}
