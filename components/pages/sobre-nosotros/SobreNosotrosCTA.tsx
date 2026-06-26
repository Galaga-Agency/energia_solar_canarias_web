'use client'

import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { AnimatedBrandBlob } from '@/components/ui/AnimatedBrandBlob'
import { PaperTexture } from '@/components/ui/PaperTexture'

const MouseReactiveFlock = dynamic(() => import('@/components/shared/MouseReactiveFlock').then(m => m.MouseReactiveFlock), { ssr: false })

export function SobreNosotrosCTA() {
  const t = useTranslations('sobre-nosotros.cta')

  return (
    <section className="relative isolate overflow-hidden bg-[#f4f1ea] section-spacing-both">
      <PaperTexture className="z-0" />
      <MouseReactiveFlock className="pointer-events-none absolute inset-0 z-0 h-full w-full" birds={70} />
      <AnimatedBrandBlob className="pointer-events-none absolute -right-[10%] top-[12%] z-0 h-auto w-[55%] opacity-55 md:w-[42%] lg:w-[32%]" />

      <div className="section-inner relative z-10" data-reveal>
        <div className="flex flex-col gap-8 md:max-w-3xl lg:max-w-4xl">
          <span className="text-label text-primary!">{t('eyebrow')}</span>
          <h2 className="text-display max-w-[20ch]">
            {t('titleLead')}{' '}
            <em className="not-italic md:italic md:font-normal md:text-primary">{t('titleTail')}</em>
          </h2>
          <p className="max-w-[56ch] text-body text-ink/75">{t('body')}</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button variant="filled" href="/contacto">{t('primary')} <span aria-hidden>↗</span></Button>
            <Button variant="outlined" href="/blog">{t('secondary')} <span aria-hidden>↗</span></Button>
          </div>
          <div className="mt-6 flex items-center gap-4 border-t border-ink/20 pt-6">
            <span aria-hidden className="h-2 w-2 bg-primary" />
            <span className="text-label text-ink/60!">{t('trust')}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
