'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'

export function HomeCTA() {
  const t = useTranslations('home.cta')

  return (
    <section
      data-cta-section
      className="section-spacing-both relative isolate overflow-hidden bg-[#e4572c]"
    >
      {/* Paper texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-35 bg-[url('/assets/images/common/white-paper-texture.jpg')] bg-cover bg-center"
      />

      <div className="section-inner relative z-10">
        <div className="flex flex-col">

          <span data-cta-item className="text-label text-white/75! mb-8 block font-mono">
            {t('secondary')}
          </span>

          <h2 data-cta-title className="text-display text-white! mb-14 max-w-[18ch]">
            {t('title')}
          </h2>

          {/* Action + trust row */}
          <div data-cta-item className="flex flex-col gap-8 md:flex-row md:items-center md:gap-x-12">
            <Button variant="white-filled" href="/contacto">
              {t('primary')}
            </Button>

            <span className="text-label text-white/70! font-mono">
              {t('trust')}
            </span>
          </div>

          {/* Faint signature line */}
          <div data-cta-item className="mt-24 border-t border-white/15 pt-6">
            <span className="text-label text-white/55! font-mono">
              {t('signRole')}
            </span>
          </div>

        </div>
      </div>
    </section>
  )
}
