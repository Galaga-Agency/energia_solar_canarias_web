'use client'

import { useTranslations } from 'next-intl'
import { AnimatedBrandBlob } from '@/components/ui/AnimatedBrandBlob'

function splitLastWord(text: string): { lead: string; tail: string } {
  const trimmed = text.replace(/\.$/, '')
  const idx     = trimmed.lastIndexOf(' ')
  if (idx === -1) return { lead: '', tail: text }
  const lead    = trimmed.slice(0, idx)
  const dot     = text.endsWith('.') ? '.' : ''
  return { lead, tail: trimmed.slice(idx + 1) + dot }
}

export function HomeManifestoStrip() {
  const t            = useTranslations('home.manifesto')
  const { lead, tail } = splitLastWord(t('statement'))

  return (
    <section className="relative flex min-h-[78vh] items-center overflow-hidden bg-[#f4f1ea] pb-24 pt-0 md:pt-32 md:pb-32 -mt-px">
      <AnimatedBrandBlob className="pointer-events-none absolute right-[-6%] top-[-8%] md:-top-[14%] z-0 h-[560px] w-[820px] -translate-y-1/2 opacity-30" />

      <div className="section-inner relative z-10">
        <div className="flex flex-col gap-12 md:max-w-4xl" data-reveal>
          <span className="font-mono text-[13px] uppercase tracking-[0.28em] text-primary">
            {t('eyebrow')}
          </span>

          <p className="manifesto-statement italic">
            &ldquo;{lead && <>{lead} </>}
            <em className="not-italic md:italic md:font-normal md:text-primary">{tail}</em>
            &rdquo;
          </p>

          <p className="mt-4 max-w-[44ch] text-[clamp(1rem,1.3vw,1.2rem)] leading-relaxed text-ink/70">
            {t('note')}
          </p>
        </div>

        <span
          className="mt-12 block font-mono text-[12px] uppercase tracking-[0.28em] text-ink/45 lg:absolute lg:right-12 lg:bottom-12 lg:mt-0"
          data-reveal
        >
          {t('label')}
        </span>
      </div>
    </section>
  )
}
