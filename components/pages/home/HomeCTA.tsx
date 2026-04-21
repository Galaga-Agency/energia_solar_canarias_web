'use client'

import { useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { Button } from '@/components/ui/Button'

const BG_BASE = 'linear-gradient(90deg, #f2c5b2 0%, #f7e4dc 18%, #fbf9f6 38%, #ffffff 50%, #fbf9f6 62%, #f7e4dc 82%, #f2c5b2 100%)'

function buildBg(x: number, y: number, rx: number, ry: number) {
  return [
    `radial-gradient(ellipse ${rx}% ${ry}% at ${x}% ${y}%, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.55) 50%, transparent 80%)`,
    BG_BASE,
  ].join(', ')
}

const DEFAULT = { x: 50, y: 50, rx: 95, ry: 95 }

interface HomeCTAProps {
  title:         string
  body:          string
  secondary:     string
  secondaryHref: string
}

export function HomeCTA({ title, body, secondary, secondaryHref }: HomeCTAProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const pos        = useRef({ ...DEFAULT })
  const tween      = useRef<gsap.core.Tween | null>(null)

  function sync() {
    if (sectionRef.current) {
      sectionRef.current.style.background = buildBg(pos.current.x, pos.current.y, pos.current.rx, pos.current.ry)
    }
  }

  function onEnter() {
    if (!sectionRef.current || !triggerRef.current) return
    const sr = sectionRef.current.getBoundingClientRect()
    const tr = triggerRef.current.getBoundingClientRect()
    const tx = ((tr.left + tr.width  / 2 - sr.left) / sr.width)  * 100
    const ty = ((tr.top  + tr.height / 2 - sr.top)  / sr.height) * 100
    tween.current?.kill()
    tween.current = gsap.to(pos.current, { x: tx, y: ty, rx: 28, ry: 28, duration: 0.7, ease: 'power3.out', onUpdate: sync })
  }

  function onLeave() {
    tween.current?.kill()
    tween.current = gsap.to(pos.current, { ...DEFAULT, duration: 0.7, ease: 'power3.out', onUpdate: sync })
  }

  const titleWords  = title.split(' ')
  const accentStart = Math.max(0, titleWords.length - 2)
  const titleLead   = titleWords.slice(0, accentStart).join(' ')
  const titleAccent = titleWords.slice(accentStart).join(' ')

  return (
    <section ref={sectionRef} className="home-cta-section section-spacing-both">
      <div className="section-inner relative z-10 text-center" data-reveal>
        <h2 className="mx-auto mb-5 max-w-3xl text-[3rem] max-md:text-[2.25rem] leading-none font-normal tracking-[0] text-ink">
          {titleLead}
          {titleLead ? ' ' : ''}
          <span className="text-primary">{titleAccent}</span>
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-base leading-normal tracking-[0] text-[#5f514d]">
          {body}
        </p>
        <div
          ref={triggerRef}
          className="home-cta-action"
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          <Button variant="filled" href={secondaryHref}>
            {secondary}
          </Button>
        </div>
      </div>
    </section>
  )
}
