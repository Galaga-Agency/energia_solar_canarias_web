'use client'

import { gsap, ScrollTrigger } from '@/lib/gsap'

/**
 * Pinned card stack — each panel pins, the next rises over it. Precise, layered
 * choreography per card driven by ONE timeline tied to the panel's travel into
 * its pinned position, so every element moves in exact lockstep with scroll.
 *
 * Per card (deterministic by index, no Math.random):
 *   media   — eases out of a directional zoom (origin varies) → settles to full.
 *   number  — counts up from a small offset, parallax-faster than the text.
 *   meta    — quick fade/slide from the lead edge.
 *   title   — line-mask rise (clipped), slight overshoot ease.
 *   body    — trails the title with a softer rise.
 * Exit: image width recedes toward its outer corner; height stays 100%.
 * No rotation/skew on any axis. No rounded corners.
 */

const RECIPES = [
  { zoom: 1.22, zOrigin: 'center center', ease: 'power3.out',     metaFrom: -40, exitScaleX: 0.74 },
  { zoom: 1.14, zOrigin: 'left center',   ease: 'expo.out',       metaFrom: 40,  exitScaleX: 0.82 },
  { zoom: 1.30, zOrigin: 'right center',  ease: 'power4.out',     metaFrom: -40, exitScaleX: 0.66 },
  { zoom: 1.18, zOrigin: 'center bottom', ease: 'power2.out',     metaFrom: 40,  exitScaleX: 0.78 },
] as const

export function initStoryStack(root: HTMLElement): () => void {
  const panels = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('[data-story-card]'))
  const endEl  = root.querySelector<HTMLElement>('[data-story-end]')
  if (!panels.length || !endEl) return () => {}
  const reduce  = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const desktop = window.matchMedia('(min-width: 1024px)').matches
  if (reduce || !desktop) return () => {}

  const triggers: ScrollTrigger[] = []

  panels.forEach((panel, i) => {
    const r = RECIPES[i % RECIPES.length]

    const mediaCol = panel.querySelector<HTMLElement>('[data-card-media-col]')
    const num     = panel.querySelector<HTMLElement>('[data-card-num]')
    const meta    = panel.querySelector<HTMLElement>('[data-card-meta]')
    const title   = panel.querySelector<HTMLElement>('[data-card-title]')
    const body    = panel.querySelector<HTMLElement>('[data-card-body]')

    // Pin (stacking mechanic).
    triggers.push(
      ScrollTrigger.create({
        id: 'sn-story',
        trigger: panel,
        pin: true,
        pinType: 'transform',
        pinSpacing: false,
        scrub: 1,
        start: 'bottom bottom',
        endTrigger: endEl,
        end: 'top top',
        invalidateOnRefresh: true,
        anticipatePin: 1,
      }),
    )

    // ── ENTER timeline — scrubbed over the window where THIS card travels from
    // covering the viewport to fully pinned at the top. That window IS on screen,
    // so the choreography is actually seen (the earlier range completed off-view).
    const enter = gsap.timeline({
      defaults: { ease: r.ease },
      scrollTrigger: {
        trigger: panel,
        start: 'top bottom',   // card's top enters the viewport bottom
        end: 'top top',        // card's top reaches the viewport top (pinned)
        scrub: 1,
        invalidateOnRefresh: true,
      },
    })

    if (mediaCol) {
      // Incoming image COLUMN grows in width (its half widens) as the card rises in.
      // The image always fills 100% of this column — only the half's width animates.
      enter.fromTo(mediaCol, { width: '32%' }, { width: '50%', ease: 'none' }, 0)
    }
    // Text elements fade only — NO vertical translation in or out.
    if (num) {
      enter.fromTo(num, { opacity: 0 }, { opacity: 0.08 }, 0.0)
    }
    if (meta) {
      enter.fromTo(meta, { opacity: 0 }, { opacity: 1 }, 0.05)
    }
    if (title) {
      enter.fromTo(title, { opacity: 0 }, { opacity: 1 }, 0.12)
    }
    if (body) {
      enter.fromTo(body, { opacity: 0 }, { opacity: 1 }, 0.24)
    }

    // ── EXIT — outgoing image COLUMN shrinks in width (its half narrows) as the
    // next card rises over it. Image stays 100% of the column; only width animates.
    if (mediaCol && i < panels.length - 1) {
      gsap.fromTo(
        mediaCol,
        { width: '50%' },
        {
          width: '32%',
          ease: 'none',
          scrollTrigger: { trigger: panels[i + 1], start: 'top bottom', end: 'top top', scrub: 1, invalidateOnRefresh: true },
        },
      )
    }
  })

  requestAnimationFrame(() => requestAnimationFrame(() => ScrollTrigger.refresh()))

  return () => {
    triggers.forEach((t) => t.kill())
    ScrollTrigger.getAll().forEach((t) => { if (t.vars.id === 'sn-story') t.kill() })
  }
}
