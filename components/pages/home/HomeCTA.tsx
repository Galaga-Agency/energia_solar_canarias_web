'use client'

import { useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { Button } from '@/components/ui/Button'

function buildBg(x: number, y: number) {
  return `radial-gradient(ellipse 80% 80% at ${x}% ${y}%, #ffffff 0%, #fbf9f6 25%, #f7e4dc 55%, #f2c5b2 80%, #e8a690 100%)`
}

interface HomeCTAProps {
  title:         string
  body:          string
  secondary:     string
  secondaryHref: string
}

export function HomeCTA({ title, body, secondary, secondaryHref }: HomeCTAProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const pos        = useRef({ x: 15, y: 10 })
  const tween      = useRef<gsap.core.Tween | null>(null)

  function animateTo(tx: number, ty: number) {
    tween.current?.kill()
    tween.current = gsap.to(pos.current, {
      x: tx,
      y: ty,
      duration: 0.7,
      ease: 'power3.out',
      onUpdate() {
        if (sectionRef.current) {
          sectionRef.current.style.background = buildBg(pos.current.x, pos.current.y)
        }
      },
    })
  }

  function onEnter() {
    if (!sectionRef.current || !triggerRef.current) return
    const sr = sectionRef.current.getBoundingClientRect()
    const tr = triggerRef.current.getBoundingClientRect()
    const tx = ((tr.left + tr.width  / 2 - sr.left) / sr.width)  * 100
    const ty = ((tr.top  + tr.height / 2 - sr.top)  / sr.height) * 100
    animateTo(tx, ty)
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
          onMouseLeave={() => animateTo(15, 10)}
        >
          <Button variant="filled" href={secondaryHref}>
            {secondary}
          </Button>
        </div>
      </div>
    </section>
  )
}
