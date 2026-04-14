'use client'

import { gsap } from '@/lib/gsap'

export function initFAQAccordion(): () => void {
  const triggers = document.querySelectorAll<HTMLElement>('[data-accordion-trigger]')

  const listeners: Array<{ el: HTMLElement; fn: () => void }> = []

  triggers.forEach((trigger) => {
    const panel = document.getElementById(trigger.dataset.accordionTrigger ?? '')
    if (!panel) return

    const handleClick = () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true'

      // Close all others
      triggers.forEach((t) => {
        if (t === trigger) return
        const p = document.getElementById(t.dataset.accordionTrigger ?? '')
        if (!p) return
        t.setAttribute('aria-expanded', 'false')
        gsap.to(p, { height: 0, duration: 0.3, ease: 'power2.inOut' })
      })

      if (isOpen) {
        trigger.setAttribute('aria-expanded', 'false')
        gsap.to(panel, { height: 0, duration: 0.3, ease: 'power2.inOut' })
      } else {
        trigger.setAttribute('aria-expanded', 'true')
        gsap.set(panel, { height: 'auto' })
        const h = panel.offsetHeight
        gsap.fromTo(panel, { height: 0 }, { height: h, duration: 0.4, ease: 'power2.out' })
      }
    }

    trigger.addEventListener('click', handleClick)
    listeners.push({ el: trigger, fn: handleClick })
  })

  return () => {
    listeners.forEach(({ el, fn }) => el.removeEventListener('click', fn))
  }
}
