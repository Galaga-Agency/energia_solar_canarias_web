'use client'

import { useTranslations } from 'next-intl'
import { splitTail } from '@/utils/text'

type Pilar = { tag: string; title: string; body: string }

export function SolucionesPilares() {
  const t     = useTranslations('soluciones.pilares')
  const items = t.raw('items') as Pilar[]
  const tt    = splitTail(t('titleLead') + ' ' + t('titleTail'))

  const QUAD = [
    { bg: 'bg-[#1f3a34]',                   text: 'text-[#f4f1ea]', sub: 'text-[#f4f1ea]/70!' }, // brand-dark
    { bg: 'bg-[#d8cbb5]',                   text: 'text-ink',       sub: 'text-ink/65!' },       // brand-surface
    { bg: 'bg-[#1c1c1a]',                   text: 'text-[#f4f1ea]', sub: 'text-[#f4f1ea]/70!' }, // near-black
    { bg: 'bg-[#f4f1ea] border-l border-ink/10', text: 'text-ink',  sub: 'text-ink/65!' },       // brand-bg / cream
  ] as const

  return (
    <section className="relative isolate overflow-hidden">
      {/* Header — full-width strip, clearly the section intro (not a cell) */}
      <div className="relative overflow-hidden py-16 md:py-20">
        <div className="section-inner relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12" data-reveal>
          <div>
            <span className="text-label text-primary! mb-4 block">{t('eyebrow')}</span>
            <h2 className="text-display max-w-[16ch]">
              {tt.lead}{' '}
              <em className="not-italic md:italic md:font-normal md:text-primary">{tt.tail}</em>
            </h2>
          </div>
          <p className="max-w-[40ch] text-body text-ink/70 md:pb-2">{t('body')}</p>
        </div>
      </div>

      {/* Full-bleed 4 reasons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" data-sol-stagger>
        {items.map((p, i) => {
          const q = QUAD[i % QUAD.length]
          return (
            <article
              key={p.tag}
              className={`flex min-h-[44vh] flex-col p-8 md:p-12 ${q.bg}`}
              data-sol-item
            >
              <span className="text-label font-mono text-primary! mb-10">{p.tag}</span>
              <h3 className={`card-title ${q.text}! min-h-[2lh]`}>{p.title}</h3>
              <p className={`mt-4 text-body ${q.sub} max-w-[34ch]`}>{p.body}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
