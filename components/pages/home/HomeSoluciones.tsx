'use client'

import { useState } from 'react'
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
  const [openIndex, setOpenIndex] = useState(0)
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
      <div className="section-inner" data-reveal>
        <div className="flex flex-col items-center text-center gap-6 mb-12 max-w-2xl mx-auto">
          <span className="text-label text-primary!">{t('eyebrow')}</span>
          <h2 className="text-title">{t('title')}</h2>
          <p className="text-body">{t('body')}</p>
          <Button variant="green-dark" href="/soluciones">
            {t('cta')}
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:h-115 gap-4">
          {items.map((item, i) => (
            <SolucionCard
              key={item.label}
              label={item.label}
              title={item.title}
              desc={item.desc}
              image={IMAGES[i]}
              isOpen={openIndex === i}
              onSelect={() => setOpenIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
