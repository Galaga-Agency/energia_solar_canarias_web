'use client'

import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { AnimatedBrandBlob } from '@/components/ui/AnimatedBrandBlob'

const MouseReactiveFlock = dynamic(() => import('@/components/shared/MouseReactiveFlock').then(m => m.MouseReactiveFlock), { ssr: false })

type Fact = { lead: string; label: string }

export function ProyectosHero() {
  const t     = useTranslations('proyectos.hero')
  const facts = t.raw('facts') as Fact[]

  const ticker = Array.from({ length: 4 }).flatMap(() => facts)

  return (
    <section
      data-hero
      data-nav-theme="light"
      className="relative isolate flex min-h-svh flex-col justify-between overflow-hidden bg-[#d8cbb5] pt-24 pb-14 md:pt-28 md:pb-20 lg:pt-32 lg:pb-24"
    >
      <MouseReactiveFlock className="pointer-events-none absolute inset-0 z-0 h-full w-full" birds={45} />
      <AnimatedBrandBlob className="pointer-events-none absolute -right-[12%] top-[10%] z-0 h-auto w-[55%] opacity-40 md:-right-[6%] md:w-[34%] lg:w-[26%]" />

      {/* Top edge — mono labels */}
      <div className="section-inner relative z-10 flex items-center justify-between">
        <span data-hero-item className="opacity-0 text-label text-primary!">{t('eyebrow')}</span>
        <span data-hero-item className="opacity-0 ml-4 text-label text-ink/45!">{t('meta')}</span>
      </div>

      {/* Middle — title + intro */}
      <div className="section-inner relative z-10 my-12 grid grid-cols-1 gap-x-16 gap-y-8 md:my-0 md:grid-cols-12 md:items-end">
        <h1 data-hero-item className="opacity-0 text-display max-w-[14ch] md:col-span-7">
          {t('titleLead')}{' '}
          <em className="italic font-normal text-primary">{t('titleTail')}</em>
        </h1>
        <p data-hero-item className="opacity-0 max-w-[44ch] text-body text-ink/75 md:col-span-5 md:pb-2">
          {t('body')}
        </p>
      </div>

      {/* Bottom — marquee of real facts */}
      <div data-hero-item className="opacity-0 relative z-10 overflow-hidden border-y border-ink/20 py-5">
        <div className="marquee-track items-baseline gap-[3vw] whitespace-nowrap">
          {ticker.map((f, i) => (
            <span key={i} className="flex shrink-0 items-baseline gap-3">
              <span className="text-subheading text-ink!">{f.lead}</span>
              <span className="text-label text-ink/50!">{f.label}</span>
              <span aria-hidden className="ml-[3vw] text-subheading text-primary!">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
