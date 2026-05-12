'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { AnimatedBrandBlob } from '@/components/ui/AnimatedBrandBlob'

export function HomeCTA() {
  const t = useTranslations('home.cta')

  return (
    <section
      data-cta-section
      className="section-spacing-both relative isolate overflow-hidden bg-[#f4f1ea] text-ink"
    >
      {/* Paper texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-25 bg-[url('/assets/images/common/white-paper-texture.jpg')] bg-cover bg-center bg-fixed"
      />

      {/* Brand blob — top right on mobile, mid-right on desktop */}
      <AnimatedBrandBlob
        className="pointer-events-none absolute -right-[10%] top-8 z-0 h-auto w-[55%] opacity-80 md:w-[42%] lg:top-1/2 lg:w-[36%] lg:-translate-y-1/2"
      />

      <div className="section-inner relative z-10">
        <div className="flex flex-col">

          <span data-cta-item className="text-label text-primary! mb-8 block font-mono">
            {t('secondary')}
          </span>

          <h2 data-cta-title className="text-display mb-14 max-w-[18ch]">
            {t('title')}
          </h2>

          {/* Action + trust row */}
          <div data-cta-item className="flex flex-col gap-8 md:flex-row md:items-center md:gap-x-12">
            <Button variant="filled" href="/contacto">
              {t('primary')}
            </Button>

            <span className="text-label text-ink/55! font-mono">
              {t('trust')}
            </span>
          </div>

          {/* Faint signature line */}
          <div data-cta-item className="mt-24 border-t border-ink/15 pt-6">
            <span className="text-label text-ink/45! font-mono">
              {t('signRole')}
            </span>
          </div>

        </div>
      </div>
    </section>
  )
}
