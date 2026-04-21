'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { initCtaGlow } from '@/utils/animations/cta-glow'

interface HomeCTAProps {
  title:          string
  body:           string
  secondaryLabel: string
  secondaryHref:  string
}

export function HomeCTA({
  title,
  body,
  secondaryLabel,
  secondaryHref,
}: HomeCTAProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    return initCtaGlow(sectionRef.current)
  }, [])

  const titleWords  = title.split(' ')
  const accentStart = Math.max(0, titleWords.length - 2)
  const titleLead   = titleWords.slice(0, accentStart).join(' ')
  const titleAccent = titleWords.slice(accentStart).join(' ')

  return (
    <section ref={sectionRef} className="home-cta-section section-spacing-both">
      <div className="home-cta-glow" data-cta-glow aria-hidden="true" />
      <div className="section-inner relative z-10 text-center" data-reveal>
        <h2 className="mx-auto mb-5 max-w-3xl text-[3rem] max-md:text-[2.25rem] leading-none font-normal tracking-[0] text-ink">
          {titleLead}
          {titleLead ? ' ' : ''}
          <span className="text-primary">{titleAccent}</span>
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-base leading-normal tracking-[0] text-[#5f514d]">
          {body}
        </p>
        <div className="home-cta-action" data-cta-trigger>
          <Button variant="filled" href={secondaryHref}>
            {secondaryLabel}
          </Button>
        </div>
      </div>
    </section>
  )
}
