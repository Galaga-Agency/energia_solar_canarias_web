'use client'

import { gsap } from '@/lib/gsap'

export function initCtaRevealAnimation(): () => void {
  const section = document.querySelector<HTMLElement>('[data-cta-section]')
  if (!section) return () => {}

  const titleEl = section.querySelector<HTMLElement>('[data-cta-title]')
  const items   = Array.from(section.querySelectorAll<HTMLElement>('[data-cta-item]'))
  const phone   = section.querySelector<HTMLElement>('[data-cta-phone]')
  if (!titleEl) return () => {}

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return () => {}

  // Measure travel offset to center the title in the section
  const sectionRect = section.getBoundingClientRect()
  const titleRect   = titleEl.getBoundingClientRect()
  const travelY     = (sectionRect.top + sectionRect.height / 2) - (titleRect.top + titleRect.height / 2)
  const travelX     = (sectionRect.left + sectionRect.width / 2) - (titleRect.left + titleRect.width / 2)

  // Set initial state
  gsap.set(titleEl, { x: travelX, y: travelY, scale: 1.15, transformOrigin: '50% 50%' })
  if (items.length) gsap.set(items, { opacity: 0, y: 28 })

  // Phone — wipe text and store original
  const phoneText = phone?.getAttribute('data-target') || phone?.textContent || ''
  if (phone) phone.textContent = ''

  const tl = gsap.timeline({
    scrollTrigger: { trigger: section, start: 'top 70%', once: true },
  })

  // Title travels back to its final position
  tl.to(titleEl, {
    x: 0, y: 0, scale: 1,
    duration: 1.2,
    ease: 'power3.inOut',
  })

  // Items stagger in
  if (items.length) {
    tl.to(items, {
      opacity: 1, y: 0,
      duration: 0.65,
      stagger: 0.13,
      ease: 'power3.out',
    }, '-=0.45')
  }

  // Typewriter the phone number, then scale pop
  if (phone && phoneText) {
    const typeStart = tl.recent().endTime() - 0.25
    const charDelay = 0.045
    const chars = Array.from(phoneText)

    chars.forEach((ch, i) => {
      tl.call(() => {
        phone.textContent = phoneText.slice(0, i + 1)
      }, [], typeStart + i * charDelay)
    })

    // After full text typed, scale up then back down
    const popStart = typeStart + chars.length * charDelay
    tl.to(phone, { scale: 1.18, duration: 0.18, ease: 'power2.out', transformOrigin: 'left center' }, popStart)
      .to(phone, { scale: 1,    duration: 0.22, ease: 'power2.inOut' }, popStart + 0.18)
  }

  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
    gsap.set([titleEl, ...items], { clearProps: 'all' })
    if (phone) {
      gsap.set(phone, { clearProps: 'all' })
      phone.textContent = phoneText
    }
  }
}
