'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { AnimatedBrandBlob } from '@/components/ui/AnimatedBrandBlob'

export function SolucionesCTA() {
  const t = useTranslations('soluciones.cta')

  return (
    <section className="relative isolate overflow-hidden bg-[#d8cbb5] section-spacing-both">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 mix-blend-multiply opacity-25 bg-[url('/assets/images/common/white-paper-texture.jpg')] bg-cover bg-center bg-fixed"
      />

      <AnimatedBrandBlob className="pointer-events-none absolute -right-[10%] -top-[15%] z-0 h-auto w-[55%] opacity-55 md:w-[42%] lg:w-[34%]" />

      <div className="section-inner relative z-10">
        <div className="flex flex-col gap-8 md:max-w-3xl lg:max-w-4xl" data-reveal>
          <span className="text-label text-primary!">{t('eyebrow')}</span>

          <h2 className="text-display max-w-[16ch]">
            Solicita tu estudio de{' '}
            <em className="not-italic md:italic md:font-normal md:text-primary">ahorro gratuito.</em>
          </h2>

          <p className="text-body max-w-[52ch] text-ink/75">
            {t('body')}
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button variant="filled" href="/contacto">
              {t('primary')} <span aria-hidden>↗</span>
            </Button>
            <Button variant="outlined" href="/contacto">
              {t('secondary')}
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-4 border-t border-ink/20 pt-6">
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
