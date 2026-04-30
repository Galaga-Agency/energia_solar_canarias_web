'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

const IMAGES = [
  { src: '/assets/images/home/solar-panel-laptop-workspace.webp',            alt: 'Persona trabajando con paneles solares' },
  { src: '/assets/images/home/solar-engineers-inspecting-installation.webp', alt: 'Ingenieros inspeccionando instalación solar' },
  { src: '/assets/images/home/solar-panel-planning-meeting.webp',            alt: 'Reunión de planificación de proyecto solar' },
  { src: '/assets/images/home/aerial-coastal-neighborhood.webp',             alt: 'Vista aérea de barrio costero en Canarias' },
]

export function HomeBeneficios() {
  const t = useTranslations('home.benefits')
  const items = t.raw('items') as { label: string; desc: string }[]

  return (
    <section className="section-spacing relative z-20" data-home-panel-end>
      <div className="section-inner">
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10" data-reveal>
          <span className="text-label text-primary! block mb-2">{t('eyebrow')}</span>
          <h2 className="text-title">{t('title')}</h2>
          <p className="text-body mt-4">
            {t('body')}
          </p>
        </div>

        <div className="mx-auto max-w-5xl" data-reveal>
          <div className="divide-y divide-border/80 border-y border-border/80">
            {items.map((item, i) => (
              <article
                key={item.label}
                className="grid grid-cols-1 gap-4 py-5 sm:grid-cols-[minmax(0,1fr)_10rem] sm:items-center sm:gap-6 sm:py-6 lg:grid-cols-[minmax(0,1fr)_13rem] lg:gap-8"
              >
                <div className="min-w-0">
                  <h3 className="card-title text-[1.15rem] leading-[1.06] tracking-[-0.03em] sm:text-[1.25rem] lg:text-[1.35rem]">
                    {item.label}
                  </h3>
                  <p className="text-body mt-2 max-w-2xl text-[0.94rem] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-[rgba(18,28,24,0.06)]">
                  <Image
                    src={IMAGES[i % IMAGES.length].src}
                    alt={IMAGES[i % IMAGES.length].alt}
                    fill
                    className="object-cover transition-transform duration-700"
                    sizes="(min-width: 1024px) 13rem, (min-width: 640px) 10rem, 100vw"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/6" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
