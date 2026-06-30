'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { AnimatedBrandBlob } from '@/components/ui/AnimatedBrandBlob'
import { PaperTexture } from '@/components/ui/PaperTexture'

export function ProyectosCTA() {
  const t = useTranslations('proyectos.cta')

  return (
    <section data-cta-section className="relative isolate overflow-hidden bg-brand-bg section-spacing-both">
      <PaperTexture className="z-0" />

      <AnimatedBrandBlob className="pointer-events-none absolute -right-[10%] top-[15%] z-0 h-auto w-[55%] opacity-55 md:w-[42%] lg:w-[34%]" />

      <div className="section-inner relative z-10">
        <div className="flex flex-col gap-8 md:max-w-3xl lg:max-w-4xl">
          <span data-cta-item className="text-label text-primary!">{t('eyebrow')}</span>

          <h2 data-cta-title className="text-display max-w-[16ch]">
            {t('titleLead')}{' '}
            <em className="not-italic md:italic md:font-normal md:text-primary">{t('titleEm')}</em>
          </h2>

          <p data-cta-item className="text-body max-w-[52ch] text-ink/75">
            {t('body')}
          </p>

          <div data-cta-item className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button variant="filled" href="/contacto">
              {t('primary')} <span aria-hidden>↗</span>
            </Button>
            <Button variant="outlined" href="/contacto">
              {t('secondary')} <span aria-hidden>↗</span>
            </Button>
          </div>

          <div data-cta-item className="mt-6 flex items-center gap-4 border-t border-ink/20 pt-6">
            <span aria-hidden className="h-2 w-2 bg-primary" />
            <span className="text-label font-mono text-ink/60!">
              {t('trust')}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
