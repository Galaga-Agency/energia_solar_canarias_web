'use client'

import { gsap, ScrollTrigger } from '@/lib/gsap'

interface PanelStackAnimationOptions {
  triggerSelector: string
  endTriggerSelector: string
  triggerId?: string
  minWidth?: number
  start?: string
  end?: string
}

const DEFAULT_TRIGGER_ID = 'panel-stack'

const killPanelStackTriggers = (triggerId: string) => {
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.vars.id === triggerId) {
      trigger.kill()
    }
  })
}

export function initPanelStackAnimation({
  triggerSelector,
  endTriggerSelector,
  triggerId = DEFAULT_TRIGGER_ID,
  minWidth = 1024,
  start = 'top top',
  end = 'top top',
}: PanelStackAnimationOptions): () => void {
  killPanelStackTriggers(triggerId)

  const media = gsap.matchMedia()

  media.add(`(min-width: ${minWidth}px)`, () => {
    const panels = document.querySelectorAll<HTMLElement>(triggerSelector)
    const endPanel = document.querySelector<HTMLElement>(endTriggerSelector)

    if (!panels.length || !endPanel) return

    const triggers = Array.from(panels).map((panel) =>
      ScrollTrigger.create({
        id: triggerId,
        trigger: panel,
        pin: true,
        pinType: 'transform',
        pinSpacing: false,
        scrub: 1,
        start,
        endTrigger: endPanel,
        end,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      }),
    )

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })
    })

    return () => {
      triggers.forEach((trigger) => trigger.kill())
    }
  })

  return () => {
    media.revert()
    killPanelStackTriggers(triggerId)
  }
}
