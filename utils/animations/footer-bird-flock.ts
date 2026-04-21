'use client'

import { initBirdFlockAnimation } from '@/utils/animations/bird-flock'

const FOOTER_BIRD_FILL = '#121c18'

export function initFooterBirdFlockAnimation() {
  const stage = document.querySelector<HTMLElement>('[data-footer-bird-flock-stage]')

  return initBirdFlockAnimation(stage, {
    fill: FOOTER_BIRD_FILL,
    rootMargin: '500px',
    scrollStart: 'top bottom',
    scrollEnd: 'bottom top',
    opacityMin: 0.3,
    opacityMax: 0.34,
    animatedOpacityCap: 0.58,
  })
}
