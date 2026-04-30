'use client'

import Image                  from 'next/image'
import { useTranslations }    from 'next-intl'
import { Button }             from '@/components/ui/Button'
import { useGSAPAnimations }  from '@/hooks/useGSAPAnimations'
import { initHighlightDraw }  from '@/utils/animations/highlight-draw'

export function HomeFounder() {
  const t = useTranslations('home.founder')

  useGSAPAnimations(() => ({
    critical: [() => initHighlightDraw()],
  }))

  const name = t('name')

  return (
    <section className="section-spacing bg-bg">
      <div className="section-inner" data-reveal>

        <div className="flex flex-col items-center text-center gap-4 mb-12 max-w-3xl mx-auto">
          <span className="text-label text-primary!">{t('eyebrow')}</span>
          <h2 className="text-title">{t('title')}</h2>
        </div>

        <div className="border border-border rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

          <div className="p-8 md:p-10 flex flex-col gap-8 justify-between bg-white">
            <div className="flex flex-col gap-5">
              <span className="card-eyebrow">{t('role')}</span>
              <p className="card-title">
                <mark data-highlight-draw className="relative inline-block py-0.5 text-ink">
                  {name},
                  <span aria-hidden="true" className="highlight-overlay absolute -inset-x-2 inset-y-0 bg-primary text-text-on-primary overflow-hidden flex items-center px-2">{name},</span>
                </mark>
                {' '}{t('quote')}
              </p>
              <p className="card-content">{t('body1')}</p>
            </div>
            <div>
              <Button variant="green-dark" href="/sobre-nosotros">{t('link')}</Button>
            </div>
          </div>

          <div className="relative min-h-80 md:min-h-144">
            <div className="absolute inset-x-[-2px] inset-y-[-10%]" data-speed="0.85">
              <Image
                src="/assets/images/home/carla-portrait.webp"
                alt={name}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
            <div className="absolute inset-0 bg-orange-500/30 mix-blend-multiply pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  )
}
