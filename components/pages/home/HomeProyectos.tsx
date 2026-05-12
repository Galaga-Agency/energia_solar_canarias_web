'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'

const IMAGES = [
  { src: '/assets/images/common/lanzarote-beach-sunset.webp',   alt: 'Hotel en el sur de Tenerife' },
  { src: '/assets/images/home/aerial-solar-panel-rows.webp',    alt: 'Instalación industrial Polígono Arinaga' },
  { src: '/assets/images/common/terraced-coastal-fields.webp',  alt: 'Bombeo solar agrícola en Gáldar' },
]

const CAPTION_VARIANTS = [
  {
    bg:    'bg-[#d8cbb5]',           // warm beige
    title: 'card-title',
    tag:   'text-primary',
    desc:  'card-content text-ink/68!',
  },
  {
    bg:    'bg-[#f4f1ea] border border-ink/10', // cream
    title: 'card-title',
    tag:   'text-primary',
    desc:  'card-content text-ink/68!',
  },
  {
    bg:    'bg-[#1f3a34]',           // dark forest
    title: 'card-title text-[#f4f1ea]!',
    tag:   'text-primary',
    desc:  'card-content text-[#f4f1ea]/72!',
  },
] as const

type Caso = { tag: string; title: string; detail: string }

function splitLastWord(label: string): { lead: string; tail: string } {
  const idx = label.lastIndexOf(' ')
  if (idx === -1) return { lead: '', tail: label }
  return { lead: label.slice(0, idx), tail: label.slice(idx + 1) }
}

export function HomeProyectos() {
  const t     = useTranslations('home.casos')
  const items = t.raw('items') as Caso[]

  // Diagonal cascade — each card steps right AND down. Same width, same aspect.
  const PIECES = [
    { col: 'lg:col-span-4 lg:col-start-1', shift: 'md:ml-0',     mt: 'lg:mt-0',  aspect: 'aspect-[4/5] md:aspect-[4/3] lg:aspect-[4/5]' },
    { col: 'lg:col-span-4 lg:col-start-5', shift: 'md:ml-[10%]', mt: 'lg:mt-24', aspect: 'aspect-[4/5] md:aspect-[4/3] lg:aspect-[4/5]' },
    { col: 'lg:col-span-4 lg:col-start-9', shift: 'md:ml-[20%]', mt: 'lg:mt-48', aspect: 'aspect-[4/5] md:aspect-[4/3] lg:aspect-[4/5]' },
  ]

  return (
    <section className="section-spacing relative overflow-hidden">
      <div className="section-inner relative z-10">
        <div className="mb-16 grid grid-cols-1 gap-6 md:mb-20 md:grid-cols-12 md:items-start md:gap-12" data-reveal>
          <div className="md:col-span-8">
            <span className="text-label text-primary! mb-4 block">{t('eyebrow')}</span>
            <h2 className="text-title italic">{t('title')}</h2>
            <p className="text-body mt-5 max-w-[64ch]">{t('subtitle')}</p>
          </div>
          <div className="md:col-span-4 md:justify-self-end md:pt-9">
            <Button variant="outlined" href="/proyectos">{t('cta')} ↗</Button>
          </div>
        </div>

        <div className="flex flex-col gap-10 md:gap-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0">
          {items.map((item, i) => {
            const p = PIECES[i]
            const v = CAPTION_VARIANTS[i % CAPTION_VARIANTS.length]
            const { lead, tail } = splitLastWord(item.title)
            return (
              <figure
                key={i}
                className={`group relative md:flex md:aspect-[8/3] md:max-w-[80%] md:items-stretch md:overflow-hidden lg:block lg:aspect-auto lg:max-w-none lg:ml-0 lg:overflow-visible ${p.col} ${p.shift} ${p.mt}`}
                data-proyecto-card
              >
                <div className={`relative w-full overflow-hidden brand-radius bg-[#e1d8c7] md:w-1/2 lg:w-full ${p.aspect}`}>
                  <Image
                    src={IMAGES[i].src}
                    alt={IMAGES[i].alt}
                    fill
                    className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]"
                    sizes="(min-width: 1024px) 28vw, (min-width: 768px) 32vw, 100vw"
                  />
                </div>

                <figcaption className={`relative flex flex-col gap-2.5 p-5 md:w-1/2 md:justify-center lg:w-full lg:justify-start lg:p-6 ${v.bg}`}>
                  <span className={`font-mono text-[11px] uppercase italic tracking-[0.24em] md:text-[12px] ${v.tag}`}>
                    {item.tag}
                  </span>
                  <h3 className={v.title}>
                    {lead && <>{lead} </>}
                    <em className="not-italic md:italic md:font-normal md:text-primary">{tail}</em>
                  </h3>
                  <p className={`${v.desc} max-w-[36ch]`}>
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
