'use client'

import { gsap } from '@/lib/gsap'

const MEDIA_CLIP_FROM = [
  'inset(0% 0% 100% 0%)',
  'inset(100% 0% 0% 0%)',
  'inset(0% 100% 0% 0%)',
]

const PANEL_FROM = [
  { y:  28 },
  { y: -28 },
  { x:  28 },
]

export function initSolucionCardsAnimation(): () => void {
  const grid  = document.querySelector<HTMLElement>('[data-soluciones-grid]')
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-solucion-card]'))
  if (!cards.length) return () => {}

  const mediaElems = cards.map(c => c.querySelector<HTMLElement>('[data-solucion-media]'))
  const copyElems  = cards.map(c => c.querySelector<HTMLElement>('[data-solucion-copy]'))
  const imageElems = cards.map(c => c.querySelector<HTMLElement>('.solucion-card-image'))

  gsap.set(cards, { opacity: 0, y: 32, scale: 0.97 })
  mediaElems.forEach((el, i) => { if (el) gsap.set(el, { clipPath: MEDIA_CLIP_FROM[i % MEDIA_CLIP_FROM.length] }) })
  imageElems.forEach(el => { if (el) gsap.set(el, { scale: 1.1 }) })
  copyElems.forEach((el, i) => { if (el) gsap.set(el, { opacity: 0, ...PANEL_FROM[i % PANEL_FROM.length] }) })

  const tl = gsap.timeline({
    scrollTrigger: { trigger: grid ?? cards[0], start: 'top 95%', once: true },
  })

  cards.forEach((card, i) => {
    const t     = i * 0.22
    const media = mediaElems[i]
    const copy  = copyElems[i]
    const image = imageElems[i]

    tl.to(card,  { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: 'power4.out' }, t)
    if (media) tl.to(media, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.out' }, t + 0.1)
    if (image) tl.to(image, { scale: 1, duration: 1.6, ease: 'power4.out' }, t + 0.08)
    if (copy)  tl.to(copy,  { opacity: 1, y: 0, x: 0, duration: 1.0, ease: 'power4.out' }, t + 0.4)
  })

  const cleanups: Array<() => void> = []

  if (window.matchMedia('(hover: hover) and (min-width: 768px)').matches) {
    cards.forEach(card => {
      const img = card.querySelector<HTMLElement>('.solucion-card-image')
      let drift: gsap.core.Tween | null = null

      const onEnter = () => {
        gsap.to(card, { y: -6, duration: 0.3, ease: 'power2.out' })
        if (img) drift = gsap.to(img, { scale: 1.06, duration: 0.5, ease: 'power2.out' })
      }
      const onLeave = () => {
        gsap.to(card, { y: 0, duration: 0.5, ease: 'power2.inOut' })
        if (img) { drift?.kill(); drift = null; gsap.to(img, { scale: 1, duration: 0.5, ease: 'power2.inOut' }) }
      }

      card.addEventListener('mouseenter', onEnter)
      card.addEventListener('mouseleave', onLeave)
      cleanups.push(() => {
        card.removeEventListener('mouseenter', onEnter)
        card.removeEventListener('mouseleave', onLeave)
      })
    })
  }

  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
    cleanups.forEach(fn => fn())
    gsap.set(cards,      { clearProps: 'all' })
    gsap.set(mediaElems, { clearProps: 'all' })
    gsap.set(copyElems,  { clearProps: 'all' })
    gsap.set(imageElems, { clearProps: 'all' })
  }
}
