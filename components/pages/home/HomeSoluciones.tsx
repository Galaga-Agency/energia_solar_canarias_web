'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { SolucionCard } from '@/components/ui/SolucionCard'

type SectorKey = 'hoteles' | 'industria' | 'retail' | 'agro'

const SECTOR_IMAGES: Record<SectorKey, string> = {
  hoteles:   '/assets/images/common/lanzarote-beach-sunset.webp',
  industria: '/assets/images/home/aerial-solar-panel-rows.webp',
  retail:    '/assets/images/common/terraced-coastal-fields.webp',
  agro:      '/assets/images/home/cactus-mountain-landscape.webp',
}

const FEATURED: SectorKey[] = ['hoteles', 'industria', 'agro']

export function HomeSoluciones() {
  const t        = useTranslations('home.sectores')
  const allItems = t.raw('items') as { key: SectorKey; label: string; title: string; desc: string; metric: string }[]
  const items    = FEATURED.map(k => allItems.find(i => i.key === k)!).filter(Boolean)

  return (
    <section className="section-spacing relative isolate overflow-hidden">
      <div className="section-inner">
        <div className="flex flex-col gap-16 md:flex-row md:gap-12 lg:gap-20">
          <div className="shrink-0 md:sticky md:top-32 md:w-[240px] md:self-start lg:w-[300px]" data-reveal>
            <span className="text-label text-primary! mb-5 block">{t('eyebrow')}</span>
            <h2 className="text-title mb-8">{t('title')}</h2>
            <p className="text-body mb-10 max-w-[30ch]">{t('body')}</p>
            <Button variant="outlined" href="/soluciones">{t('cta')} ↗</Button>

            <div className="mt-10 border-t border-ink/15 pt-6">
              <span className="block font-mono text-[12px] uppercase tracking-[0.22em] text-ink/45">
                {t('hogares.label')}
              </span>
              <a
                href="/soluciones#hogares"
                className="mt-3 inline-flex items-center gap-2 text-[0.95rem] leading-snug text-ink transition-colors hover:text-primary"
              >
                {t('hogares.cta')}
              </a>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-8" data-soluciones-grid>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {items.slice(0, 2).map((item, i) => (
                <SolucionCard
                  key={item.key}
                  index={i}
                  image={SECTOR_IMAGES[item.key]}
                  label={item.label}
                  title={item.title}
                  desc={item.desc}
                  metric={item.metric}
                />
              ))}
            </div>
            {items[2] && (
              <SolucionCard
                index={2}
                image={SECTOR_IMAGES[items[2].key]}
                label={items[2].label}
                title={items[2].title}
                desc={items[2].desc}
                metric={items[2].metric}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
