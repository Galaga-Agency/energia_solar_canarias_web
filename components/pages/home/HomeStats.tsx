'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

export function HomeStats() {
  const t     = useTranslations('home.stats')
  const items = t.raw('items') as { value: string; suffix: string; label: string; desc: string }[]

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-x-0 inset-y-[-20%] z-0" data-speed="0.8">
        <Image
          src="/assets/images/home/lanzarote-volcanic-vineyard-palms.webp"
          alt=""
          fill
          className="object-cover object-center"
          aria-hidden="true"
          priority={false}
        />
        <div className="absolute inset-0 bg-[#111]/55" />
      </div>

      <div className="relative z-10 section-inner py-[clamp(4rem,8vw,8rem)]">
        <div className="mb-12 md:mb-16 max-w-3xl" data-reveal>
          <p className="text-label text-white/60! mb-4">{t('eyebrow')}</p>
          <h2 className="text-title text-white! font-semibold leading-snug">{t('quote')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" data-reveal>
          {items.map(({ value, suffix, label, desc }) => {
            const numericValue = value.replace(',', '.')
            return (
              <div key={label} className="bg-white rounded-2xl p-7 md:p-8 flex flex-col">
                <h3 className="text-subheading font-semibold text-ink mb-6 leading-snug">{label}</h3>
                <p
                  className="font-light leading-none text-primary mb-5"
                  style={{ fontSize: 'clamp(3.5rem, 7vw, 5.5rem)' }}
                >
                  <span data-counter={numericValue}>0</span>{suffix}
                </p>
                <hr className="border-sand-200 mb-5" />
                <p className="text-body-sm">{desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
