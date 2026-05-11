'use client'

import { useTranslations } from 'next-intl'
import { AnimatedBrandBlob } from '@/components/ui/AnimatedBrandBlob'

export function HomeManifestoStrip() {
  const t = useTranslations('home.manifesto')

  return (
    <section className="relative isolate flex min-h-[78vh] items-center overflow-hidden bg-[#f4f1ea] py-24 md:py-32 -mt-px">
      <AnimatedBrandBlob className="pointer-events-none absolute right-[-6%] top-[-8%] z-0 h-[560px] w-[820px] -translate-y-1/2 opacity-30" />

      <div className="section-inner relative z-10">
        <div className="flex flex-col gap-12 md:max-w-4xl" data-reveal>
          <span className="font-mono text-[13px] uppercase tracking-[0.28em] text-primary">
            {t('eyebrow')}
          </span>

          <p className="manifesto-statement italic">
            &ldquo;{t('statement')}&rdquo;
          </p>

          <div className="mt-4 flex items-start gap-6">
            <span className="mt-3 block h-px w-16 shrink-0 bg-ink/30" />
            <p className="max-w-[44ch] text-[clamp(1rem,1.3vw,1.2rem)] leading-relaxed text-ink/70">
              {t('note')}
            </p>
          </div>
        </div>

        <span
          className="absolute right-6 bottom-6 font-mono text-[12px] uppercase tracking-[0.28em] text-ink/45 md:right-12 md:bottom-12"
          data-reveal
        >
          {t('label')}
        </span>
      </div>
    </section>
  )
}
