'use client'

import { gsap } from '@/lib/gsap'

export function initProcesoTimelineAnimation(): () => void {
  const section = document.querySelector<HTMLElement>('[data-proceso-section]')
  if (!section) return () => {}

  const pinEl   = section.querySelector<HTMLElement>('[data-proceso-pin]')
  const track   = section.querySelector<HTMLElement>('[data-proceso-track]')
  const cards   = Array.from(section.querySelectorAll<HTMLElement>('[data-proceso-card]'))
  const header  = section.querySelector<HTMLElement>('h2')
  const current = section.querySelector<HTMLElement>('[data-proceso-current]')
  if (!pinEl || !track || !cards.length) return () => {}

  const mm = gsap.matchMedia()

  mm.add('(min-width: 768px)', () => {
    /* ── Entrance: cards slide in horizontally, foreshadowing the scrub ── */
    gsap.set(cards, { opacity: 0, x: 120 })
    if (header) gsap.set(header, { opacity: 0, x: -24 })

    const entrance = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start:   'top 78%',
        once:    true,
      },
    })

    if (header) {
      entrance.to(header, {
        opacity: 1, x: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
    }

    entrance.to(cards, {
      opacity: 1, x: 0,
      duration: 0.9,
      stagger: 0.10,
      ease: 'power3.out',
    }, header ? '-=0.5' : 0)

    /* ── Pin + horizontal scrub ── */
    const measure = () => {
      const vw       = window.innerWidth
      const padRight = parseFloat(getComputedStyle(track).paddingRight) || 0
      const lastRight = track.scrollWidth - padRight
      return Math.max(0, lastRight - (vw - padRight))
    }

    // Cache the distance and only re-measure on real viewport resizes, not on
    // every global ScrollTrigger.refresh() (which fire as unrelated images
    // load after a client-side nav). A jittering distance makes the pin
    // boundary move under the cursor and the pin strobes active/inactive.
    let distance = measure()
    let lastVW   = window.innerWidth
    const getDistance = () => {
      if (window.innerWidth !== lastVW) {
        lastVW = window.innerWidth
        distance = measure()
      }
      return distance
    }

    const tween = gsap.to(track, {
      x: () => -getDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger:              section,
        pin:                  pinEl,
        start:                'top top',
        end:                  () => `+=${getDistance()}`,
        scrub:                0.6,
        onUpdate: (self) => {
          if (current) {
            const idx = Math.min(cards.length - 1, Math.floor(self.progress * cards.length))
            current.textContent = String(idx + 1).padStart(2, '0')
          }
        },
      },
    })

    return () => {
      entrance.scrollTrigger?.kill()
      entrance.kill()
      tween.scrollTrigger?.kill()
      tween.kill()
      gsap.set(track, { clearProps: 'all' })
      gsap.set(cards, { clearProps: 'all' })
      if (header) gsap.set(header, { clearProps: 'all' })
    }
  })

  return () => mm.revert()
}
