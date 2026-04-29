'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { SolucionCard } from '@/components/ui/SolucionCard'

const IMAGES = [
  '/assets/images/home/cactus-mountain-landscape.webp',
  '/assets/images/home/maspalomas-sand-dunes.webp',
  '/assets/images/home/aerial-solar-panel-rows.webp',
]

export function HomeSoluciones() {
  const t = useTranslations('home.solutions')
  const items = [
    t.raw('empresas')      as { label: string; title: string; desc: string },
    t.raw('instalaciones') as { label: string; title: string; desc: string },
    t.raw('hogares')       as { label: string; title: string; desc: string },
  ]

  return (
    <section
      className="section-spacing home-soluciones-panel panel-surface relative z-0"
      data-home-panel-pin
    >
      <div className="section-inner">
        <div className="flex flex-col items-center text-center gap-6 mb-20 max-w-2xl mx-auto" data-reveal>
          <span className="text-label text-primary!">{t('eyebrow')}</span>
          <h2 className="text-title">{t('title')}</h2>
          <p className="text-body">{t('body')}</p>
          <Button variant="green-dark" href="/soluciones">
            {t('cta')}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-10" data-soluciones-grid>
          {items.map((item, i) => (
            <SolucionCard
              key={item.label}
              index={i}
              label={item.label}
              title={item.title}
              desc={item.desc}
              image={IMAGES[i]}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
