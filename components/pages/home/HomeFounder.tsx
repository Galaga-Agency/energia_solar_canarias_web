'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'

export function HomeFounder() {
  const t = useTranslations('home.founder')

  return (
    <section data-founder-section className="section-spacing relative isolate overflow-hidden bg-[#ece7db]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 mix-blend-multiply opacity-35 bg-[url('/assets/images/common/white-paper-texture.jpg')] bg-cover bg-center"
      />
      <div className="section-inner relative z-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:items-stretch md:gap-16 lg:gap-20">
          <div className="relative order-2 flex flex-col gap-10 md:order-1 md:col-span-7 md:py-4">
            <span data-founder-item className="text-label text-primary! block">{t('eyebrow')}</span>

            <blockquote className="relative flex flex-col gap-10">
              <span
                aria-hidden
                className="pointer-events-none absolute -left-4 -top-12 select-none font-serif text-[clamp(8rem,14vw,14rem)] leading-none text-primary/12 md:-left-6 md:-top-16"
              >
                “
              </span>
              <p data-founder-item className="relative text-title max-w-[26ch] italic">
                {t('quote')}
              </p>

              <div data-founder-item className="flex items-start gap-5">
                <span className="mt-3 block h-px w-12 shrink-0 bg-ink/25" />
                <div className="flex flex-col gap-2">
                  <cite className="not-italic">
                    <span className="font-mono text-[13px] uppercase tracking-[0.22em] text-ink">
                      {t('name')}
                    </span>
                  </cite>
                  <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-ink/55">
                    {t('role')}
                  </span>
                  <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-primary">
                    {t('credentials')}
                  </span>
                </div>
              </div>
            </blockquote>

            <div data-founder-item className="mt-2">
              <Button variant="green-dark" href="/sobre-nosotros">{t('link')} →</Button>
            </div>
          </div>

          <div className="relative order-1 md:order-2 md:col-span-5" data-founder-portrait>
            <div className="relative aspect-[4/5] overflow-hidden md:aspect-auto md:h-full">
              <Image
                src="/assets/images/home/carla-portrait.webp"
                alt={t('name')}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 42vw, 100vw"
                priority={false}
                data-founder-portrait-img
              />
              <div className="pointer-events-none absolute inset-0 bg-orange-500/15 mix-blend-multiply" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_top,rgba(15,24,20,0.45)_0%,transparent_100%)]" />
            </div>

            <span
              data-founder-stamp
              aria-hidden
              className="absolute right-4 top-4 font-mono text-[12px] uppercase tracking-[0.24em] text-[#f4f1ea]/85 md:right-6 md:top-6"
            >
              CEO · ESC · 2026
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
