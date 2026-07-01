'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { PaperTexture } from '@/components/ui/PaperTexture'

export function SobreNosotrosAward() {
  const t = useTranslations('sobre-nosotros.award')

  return (
    <section
      aria-label={t('eyebrow')}
      className="relative isolate overflow-hidden bg-[#1f3a34] text-[#f4f1ea]"
    >
      <PaperTexture className="z-0" opacityClassName="opacity-30" />

      <div className="section-inner relative z-10 flex flex-col items-center gap-8 py-[clamp(3rem,7vw,5rem)] md:flex-row md:items-center md:gap-12">
        {/* Seal */}
        <Image
          src="/assets/images/common/eupd-installer-award-2026.png"
          alt="EUPD Research — Instalador Excelente España 2026"
          width={200}
          height={240}
          className="h-32 w-auto shrink-0 md:h-40"
          data-reveal
        />

        {/* Copy */}
        <div className="flex flex-col gap-4 text-center md:text-left" data-reveal>
          <span className="text-label text-primary!">{t('eyebrow')}</span>
          <h2 className="text-title text-[#f4f1ea]! max-w-[22ch] mx-auto md:mx-0">
            {t('titleLead')}{' '}
            <em className="not-italic md:italic md:font-normal md:text-primary">{t('titleEm')}</em>
          </h2>
          <p className="max-w-[54ch] text-body text-[#f4f1ea]/70! mx-auto md:mx-0">
            {t('body')}
          </p>
        </div>
      </div>
    </section>
  )
}
