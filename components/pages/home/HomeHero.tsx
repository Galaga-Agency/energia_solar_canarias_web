'use client'

import { BlobDecor } from '@/components/ui/BlobDecor'
import { Button }    from '@/components/ui/Button'

interface HomeHeroProps {
  eyebrow: string
  title:   string
  body:    string
  cta1:    string
  cta2:    string
}

export function HomeHero({ eyebrow, title, body, cta1, cta2 }: HomeHeroProps) {
  return (
    <section
      data-hero
      className="relative min-h-screen flex items-center overflow-hidden section-spacing"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <BlobDecor className="top-0 left-0 w-[600px] h-[600px] opacity-15 -translate-x-1/4 -translate-y-1/4" />
      <div className="section-inner relative">
        <span className="text-label block mb-4 opacity-0" data-hero-item>{eyebrow}</span>
        <h1 className="text-display mb-6 max-w-3xl opacity-0" data-hero-item>{title}</h1>
        <p className="text-body mb-8 max-w-xl opacity-0" data-hero-item>{body}</p>
        <div className="flex flex-col sm:flex-row gap-4 opacity-0" data-hero-item>
          <Button variant="filled"   href="/contacto">{cta1}</Button>
          <Button variant="outlined" href="/soluciones">{cta2}</Button>
        </div>
      </div>
    </section>
  )
}
