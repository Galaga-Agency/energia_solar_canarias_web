'use client'

import { gsap } from '@/lib/gsap'

const ENTER_FROM = [
  { x: -40, y: 72, rotation: -5, scale: 0.9 },
  { x:   0, y: 86, rotation:  0, scale: 0.86 },
  { x:  40, y: 72, rotation:  5, scale: 0.9 },
]

const MEDIA_REVEAL_FROM = [
  'polygon(0 100%, 0 100%, 0 100%, 0 100%)',
  'polygon(50% 100%, 50% 100%, 50% 100%, 50% 100%)',
  'polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)',
]

const COPY_Y_FROM = [28, 32, 28]
const SEQ = 0.16

export function initSolucionCardsAnimation(): () => void {
  const grid  = document.querySelector<HTMLElement>('[data-soluciones-grid]')
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-solucion-card]'))
  if (!cards.length) return () => {}

  const mediaElems = cards.map(c => c.querySelector<HTMLElement>('[data-solucion-media]'))
  const copyElems = cards.map(c => c.querySelector<HTMLElement>('[data-solucion-copy]'))
  const imageElems = cards.map(c => c.querySelector<HTMLElement>('.solucion-card-image'))

  cards.forEach((card, i) => {
    gsap.set(card, {
      ...ENTER_FROM[i],
      opacity: 0,
      transformOrigin: '50% 100%',
      filter: 'blur(14px)',
      rotateX: i === 1 ? -10 : -14,
      transformPerspective: 1200,
    })
  })
  mediaElems.forEach((el, i) => {
    if (el) {
      gsap.set(el, {
        clipPath: MEDIA_REVEAL_FROM[i],
        scale: 1.08,
      })
    }
  })
  copyElems.forEach((el, i) => {
    if (el) gsap.set(el, { opacity: 0, y: COPY_Y_FROM[i], filter: 'blur(10px)', scale: 0.94 })
  })
  imageElems.forEach((el, i) => {
    if (el) gsap.set(el, { scale: 1.2, yPercent: i === 1 ? -10 : 10, rotation: i === 1 ? 0 : i === 0 ? -1.2 : 1.2 })
  })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: grid ?? cards[0],
      start:   'top 78%',
      once:    true,
    },
  })

  cards.forEach((card, i) => {
    const t    = i * SEQ
    const media = mediaElems[i]
    const copy = copyElems[i]
    const image = imageElems[i]

    tl.to(card, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      rotateX: 0,
      duration: 1.05,
      ease: 'expo.out',
    }, t)

    if (media) tl.to(media, {
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      scale: 1,
      duration: 0.92,
      ease: 'expo.out',
    }, t + 0.08)

    if (image) tl.to(image, {
      scale: 1,
      yPercent: 0,
      rotation: 0,
      duration: 1.18,
      ease: 'expo.out',
    }, t + 0.02)

    if (copy) tl.to(copy, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.7,
      ease: 'expo.out',
    }, t + 0.44)
  })

  const cleanups: Array<() => void> = []

  if (window.matchMedia('(hover: hover) and (min-width: 768px)').matches) {
    cards.forEach((card) => {
      const img = card.querySelector<HTMLElement>('.solucion-card-image')
      let drift: gsap.core.Tween | null = null

      const onEnter = () => {
        gsap.to(card, { y: -8, duration: 0.25, ease: 'power2.out' })
        if (img) {
          drift = gsap.to(img, {
            scale: 1.07,
            duration: 0.45,
            ease: 'power2.out',
          })
        }
      }

      const onLeave = () => {
        gsap.to(card, { y: 0, duration: 0.4, ease: 'power2.inOut' })
        if (img) {
          drift?.kill()
          drift = null
          gsap.to(img, { scale: 1, duration: 0.4, ease: 'power2.inOut' })
        }
      }

      card.addEventListener('mouseenter', onEnter)
      card.addEventListener('mouseleave', onLeave)
      cleanups.push(() => {
        card.removeEventListener('mouseenter', onEnter)
        card.removeEventListener('mouseleave', onLeave)
      })
    })
  }

  const st = tl.scrollTrigger
  return () => {
    tl.kill()
    if (st) st.kill()
    cleanups.forEach((fn) => fn())
    gsap.set(cards, { clearProps: 'all' })
    gsap.set(mediaElems, { clearProps: 'all' })
    gsap.set(copyElems, { clearProps: 'all' })
    gsap.set(imageElems, { clearProps: 'all' })
  }
}
