'use client'

import { useTranslations } from 'next-intl'
import { splitLastWord } from '@/utils/text'
import { SectorCard } from './SectorCard'

type Sector = {
  key: string
  tag: string
  title: string
  context: string
  offer: string
  decisores: string
  metric: string
}

export function SolucionesSectores() {
  const t       = useTranslations('soluciones.sectores')
  const sectors = t.raw('items') as Sector[]
  const tt      = splitLastWord(t('titleLead') + ' ' + t('titleTail'))

  return (
    <section id="sectores" className="section-spacing relative overflow-hidden">
      <div className="section-inner relative z-10">
        {/* Centered header — different rhythm from the other sections */}
        <div className="mx-auto mb-20 max-w-[46ch] text-center md:mb-28" data-reveal>
          <span className="text-label text-primary! mb-4 block">{t('eyebrow')}</span>
          <h2 className="text-title">
            {tt.lead}{' '}
            <em className="not-italic md:italic md:font-normal md:text-primary">{tt.tail}</em>
          </h2>
          <p className="mt-6 text-body text-ink/70">{t('body')}</p>
        </div>

        <div
          className="grid grid-cols-1 gap-y-20 gap-x-12 sm:grid-cols-2 lg:gap-x-20 lg:gap-y-28"
          style={{ perspective: '1200px' }}
          data-soluciones-grid
        >
          {sectors.map((item, i) => (
            <div key={item.key}>
              <SectorCard item={item} variant={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
