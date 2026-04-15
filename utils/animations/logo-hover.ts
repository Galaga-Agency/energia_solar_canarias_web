import { gsap } from '@/lib/gsap'

// Each wisp gets its own repeating timeline stored here so handleLeave can kill them.
const activeTls: gsap.core.Timeline[] = []

export function animateWispsIn(
  wisps: (SVGPathElement | null)[],
  delays: number[],
) {
  // Kill any previous cycle first
  activeTls.forEach((tl) => tl.kill())
  activeTls.length = 0

  wisps.forEach((el, i) => {
    if (!el) return

    // Reset starting state
    gsap.set(el, { strokeDashoffset: 1, opacity: 0 })

    const tl = gsap.timeline({ repeat: -1, delay: delays[i] })
    tl
      // Draw the path upward (bottom → top via strokeDashoffset)
      .to(el, {
        strokeDashoffset: 0,
        opacity: 0.7,
        duration: 1.0,
        ease: 'power1.out',
      })
      // Fade out at the top
      .to(el, { opacity: 0, duration: 0.45, ease: 'power2.in' }, '-=0.3')
      // Brief pause then reset for next loop
      .set(el, { strokeDashoffset: 1 })
      .to(el, {}, '+=0.35')

    activeTls.push(tl)
  })
}

export function animateWispsOut(wisps: (SVGPathElement | null)[]) {
  activeTls.forEach((tl) => tl.kill())
  activeTls.length = 0

  wisps.forEach((el) => {
    if (!el) return
    gsap.to(el, { opacity: 0, duration: 0.3, ease: 'power2.out' })
  })
}
