'use client'

import { useTranslations } from 'next-intl'
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

function splitLastWord(label: string): { lead: string; tail: string } {
  const idx = label.lastIndexOf(' ')
  if (idx === -1) return { lead: '', tail: label }
  return { lead: label.slice(0, idx), tail: label.slice(idx + 1) }
}

export function SolucionesSectores() {
  const t       = useTranslations('soluciones.sectores')
  const sectors = t.raw('items') as Sector[]
  const tt      = splitLastWord(t('titleLead') + ' ' + t('titleTail'))

  return (
    <section id="sectores" className="section-spacing relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 mix-blend-multiply opacity-25 bg-[url('/assets/images/common/white-paper-texture.jpg')] bg-cover bg-center bg-fixed"
      />
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
        >
          {sectors.map((item, i) => (
            <SectorCard key={item.key} item={item} variant={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
