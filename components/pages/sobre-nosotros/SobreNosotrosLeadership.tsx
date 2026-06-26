'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { PaperTexture } from '@/components/ui/PaperTexture'
import { TransitionLink } from '@/components/ui/TransitionLink'

export function SobreNosotrosLeadership() {
  const t = useTranslations('sobre-nosotros.leadership')

  return (
    <section className="relative isolate overflow-hidden bg-[#d8cbb5] section-spacing-both">
      <PaperTexture className="z-0" />

      <div className="section-inner relative z-10 grid grid-cols-1 items-center gap-x-16 gap-y-10 md:grid-cols-12" data-reveal>
        <figure className="relative md:col-span-5">
          <div className="relative aspect-3/4 w-full overflow-hidden bg-[#1f3a34]">
            <Image
              src="/assets/images/home/carla-portrait.webp"
              alt={t('name')}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-4 flex flex-col gap-1">
            <span className="text-subheading text-ink!">{t('name')}</span>
            <span className="text-label text-ink/55!">{t('role')}</span>
          </figcaption>
        </figure>

        <div className="md:col-span-7">
          <span className="mb-5 block text-label text-primary!">{t('eyebrow')}</span>
          <h2 className="text-title max-w-[18ch]">
            {t('titleLead')}{' '}
            <em className="not-italic md:italic md:font-normal md:text-primary">{t('titleTail')}</em>
          </h2>

          <blockquote className="mt-8 border-l-2 border-primary pl-6 text-heading text-ink!">
            “{t('quote')}”
          </blockquote>

          <p className="mt-8 max-w-[56ch] text-body text-ink/80">{t('body')}</p>

          <TransitionLink
            href="/proyectos"
            className="keyboard-focus-ring mt-8 inline-flex items-center gap-2 text-label text-primary!"
            aria-label={t('link')}
          >
            {t('link')} <span aria-hidden>↗</span>
          </TransitionLink>
        </div>
      </div>
    </section>
  )
}
