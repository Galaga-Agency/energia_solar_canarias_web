'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

export function HomeStats() {
  const t     = useTranslations('home.stats')
  const items = t.raw('items') as { value: string; suffix: string; label: string; body: string }[]

  return (
    <section
      data-stats-section
      className="relative isolate flex min-h-svh items-center overflow-hidden bg-[#1c1c1a] text-[#f4f1ea]"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/images/common/lanzarote-volcanic-coast.webp"
          alt=""
          fill
          className="object-cover object-center"
          aria-hidden
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,28,26,0.55)_0%,rgba(28,28,26,0.72)_55%,rgba(28,28,26,0.92)_100%)]" />
      </div>

      <div className="section-inner relative z-10 w-full section-spacing-both">
        <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end md:gap-12">
          <div className="md:col-span-8" data-stats-title-wrap>
            <span className="mb-5 block font-mono text-[13px] uppercase tracking-[0.18em] text-primary">
              {t('eyebrow')}
            </span>
            <h2 className="text-title text-[#f4f1ea]! max-w-[26ch]">{t('title')}</h2>
          </div>
          <span
            className="font-mono text-[12px] uppercase tracking-[0.22em] text-[#f4f1ea]/40 md:col-span-4 md:justify-self-end md:text-right"
            data-stats-meta
          >
            Datos auditables · Canarias 2026
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <div
              key={i}
              data-stat-item
              className="group flex flex-col justify-between gap-8 border-t border-[#f4f1ea]/15 py-10 lg:border-l lg:border-t-0 lg:px-8 lg:py-2 first:lg:border-l-0 first:lg:pl-0"
            >
              <div className="flex items-baseline text-[#f4f1ea]">
                <span
                  className="text-stat text-[#f4f1ea]!"
                  data-stat-value
                  data-target={item.value}
                >
                  {item.value}
                </span>
                <span className="ml-[0.1em] text-[clamp(1.4rem,3vw,2.4rem)] font-semibold leading-none tracking-[-0.04em] text-primary">
                  {item.suffix}
                </span>
              </div>
              <div className="flex flex-col gap-2 lg:max-w-[24ch]">
                <span className="font-mono text-[13px] uppercase tracking-[0.18em] text-primary">
                  {item.label}
                </span>
                <p className="text-[0.95rem] leading-snug text-[#f4f1ea]/65">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
