'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'

const IMAGES = [
  { src: '/assets/images/common/lanzarote-beach-sunset.webp',   alt: 'Hotel en el sur de Tenerife' },
  { src: '/assets/images/home/aerial-solar-panel-rows.webp',    alt: 'Instalación industrial Polígono Arinaga' },
  { src: '/assets/images/common/terraced-coastal-fields.webp',  alt: 'Bombeo solar agrícola en Gáldar' },
]

type Caso = { tag: string; title: string; detail: string }

export function HomeProyectos() {
  const t     = useTranslations('home.casos')
  const items = t.raw('items') as Caso[]

  // Diagonal cascade — each card steps right AND down. Same width, same aspect.
  const PIECES = [
    { col: 'md:col-span-4 md:col-start-1', mt: 'md:mt-0',  aspect: 'aspect-[4/5]' },
    { col: 'md:col-span-4 md:col-start-5', mt: 'md:mt-24', aspect: 'aspect-[4/5]' },
    { col: 'md:col-span-4 md:col-start-9', mt: 'md:mt-48', aspect: 'aspect-[4/5]' },
  ]

  return (
    <section className="section-spacing relative isolate">
      <div className="section-inner">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6 md:mb-20" data-reveal>
          <div>
            <span className="text-label text-primary! mb-4 block">{t('eyebrow')}</span>
            <h2 className="text-title italic">{t('title')}</h2>
          </div>
          <Button variant="outlined" href="/proyectos">{t('cta')} ↗</Button>
        </div>

        <div className="grid grid-cols-12 gap-y-14 md:gap-x-8 md:gap-y-0">
          {items.map((item, i) => {
            const p = PIECES[i]
            return (
              <figure
                key={i}
                className={`group relative col-span-12 ${p.col} ${p.mt}`}
                data-reveal
              >
                <div className={`relative w-full overflow-hidden brand-radius bg-[#e1d8c7] ${p.aspect}`}>
                  <Image
                    src={IMAGES[i].src}
                    alt={IMAGES[i].alt}
                    fill
                    className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]"
                    sizes="(min-width: 1024px) 28vw, (min-width: 768px) 32vw, 100vw"
                  />
                </div>

                <figcaption className="mt-5 flex flex-col gap-2.5">
                  <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-primary">
                    {item.tag}
                  </span>
                  <h3 className="text-[clamp(1.05rem,1.35vw,1.25rem)] italic leading-[1.2] tracking-[-0.018em] text-ink">
                    {item.title}
                  </h3>
                  <p className="max-w-[34ch] text-[0.92rem] leading-relaxed text-ink/60">
                    {item.detail}
                  </p>
                </figcaption>
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
