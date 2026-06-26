'use client'

import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { AnimatedBrandBlob } from '@/components/ui/AnimatedBrandBlob'

const MouseReactiveFlock = dynamic(() => import('@/components/shared/MouseReactiveFlock').then(m => m.MouseReactiveFlock), { ssr: false })

export function SolucionesHero() {
  const t = useTranslations('soluciones.hero')

  const titleLine    = `${t('titleLead')} ${t('titleTail')}`
  const servicesLine = t('services')

  // Repeat enough copies so the marquee track has overflow regardless of viewport width
  const titleCopies    = Array.from({ length: 4 }, (_, i) => i)
  const servicesCopies = Array.from({ length: 6 }, (_, i) => i)

  return (
    <section
      data-hero
      className="relative isolate flex min-h-svh flex-col justify-between overflow-hidden pt-24 pb-14 md:pt-28 md:pb-20 lg:pt-32 lg:pb-24"
    >
      <MouseReactiveFlock className="pointer-events-none absolute inset-0 z-0 h-full w-full" birds={80} />
      <AnimatedBrandBlob className="pointer-events-none absolute -right-[12%] top-[10%] z-0 h-auto w-[55%] opacity-45 md:-right-[6%] md:w-[36%] lg:w-[26%]" />
      <AnimatedBrandBlob className="pointer-events-none absolute -left-[16%] bottom-[12%] z-0 h-auto w-[40%] opacity-25 hidden md:block" />

      {/* Top edge — mono labels (replace centered eyebrow) */}
      <div className="section-inner relative z-10 flex items-center justify-between">
        <span data-hero-item className="opacity-0 text-label text-ink/65!">
          {t('eyebrow')}
        </span>
        <span data-hero-item className="opacity-0 text-label text-ink/35! ml-4">
          04 / sectores · 2026
        </span>
      </div>

      {/* Middle — twin marquees */}
      <div className="relative z-10 my-12 flex flex-col gap-2 md:my-16 lg:my-20">
        {/* Marquee 1 — title, scrolls left */}
        <div data-hero-item className="opacity-0 relative overflow-hidden">
          <div className="marquee-track items-baseline gap-[2vw]">
            {titleCopies.map((i) => (
              <span
                key={`t-${i}`}
                className="shrink-0 whitespace-nowrap text-display"
              >
                {t('titleLead')}{' '}
                <em className="italic font-normal text-primary">{t('titleTail')}</em>
              </span>
            ))}
          </div>
        </div>

        {/* Hairline divider */}
        <div aria-hidden className="my-2 h-px w-full bg-ink/15 md:my-4" />

        {/* Marquee 2 — services line, scrolls right (reverse) */}
        <div data-hero-item className="opacity-0 relative overflow-hidden">
          <div className="marquee-track items-baseline gap-[2vw]" style={{ animationDirection: 'reverse', animationDuration: '40s' }}>
            {servicesCopies.map((i) => (
              <span
                key={`s-${i}`}
                className="shrink-0 whitespace-nowrap text-body font-mono uppercase tracking-[0.32em] text-ink/55"
              >
                {servicesLine}
                <span aria-hidden className="mx-[2vw] text-primary">·</span>
              </span>
            ))}
          </div>
        </div>

        {/* Screen reader-friendly title (visually hidden) */}
        <h1 className="sr-only">{titleLine}</h1>
      </div>

      {/* Bottom — body + CTAs left-aligned, mono caption right */}
      <div className="section-inner relative z-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end md:gap-12">
          <div data-hero-item className="opacity-0 flex flex-col gap-6 md:col-span-7">
            <p className="text-body max-w-[44ch] text-ink/70">
              {t('body')}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Button variant="filled" href="/contacto">
                {t('primary')} <span aria-hidden>↗</span>
              </Button>
              <Button variant="outlined" href="#sectores">
                {t('secondary')} <span aria-hidden>↓</span>
              </Button>
            </div>
          </div>

          <div data-hero-item className="opacity-0 flex flex-col gap-3 md:col-span-5 md:items-end md:text-right">
            <span className="text-label text-ink/35!">Estudios sin coste</span>
            <span className="text-label text-primary!">Respuesta en 24h</span>
          </div>
        </div>
      </div>
    </section>
  )
}
