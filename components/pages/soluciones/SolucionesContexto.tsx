'use client'

import { useTranslations } from 'next-intl'
import { splitTail, splitStat } from '@/utils/text'

type Stat = { value: string; label: string; source: string }

export function SolucionesContexto() {
  const t     = useTranslations('soluciones.insight')
  const stats = t.raw('stats') as Stat[]
  const tt    = splitTail(t('quoteLead') + ' ' + t('quoteTail'))

  return (
    <section
      data-contexto-section
      className="relative isolate overflow-hidden bg-[#1f3a34] text-[#f4f1ea] section-spacing"
    >
      <div className="section-inner relative z-10">
        <div className="flex flex-col gap-8 md:grid md:grid-cols-12 md:items-start md:gap-12">
          <div className="md:col-span-7">
            <span className="text-label text-primary! mb-5 block">{t('eyebrow')}</span>
            <h2 className="text-title text-[#f4f1ea]! max-w-[18ch]">
              {tt.lead}{' '}
              <em className="not-italic md:italic md:font-normal md:text-primary">{tt.tail}</em>
            </h2>
          </div>
          <p className="text-body !text-[#f4f1ea]/75 max-w-[42ch] md:col-span-5 md:pt-2">
            {t('body')}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-[#f4f1ea]/15 bg-[#f4f1ea]/10 sm:grid-cols-3 md:mt-20">
          {stats.map((s) => {
            const { prefix, num, suffix } = splitStat(s.value)
            return (
              <div key={s.label} className="flex flex-col gap-3 bg-[#1f3a34] p-7 md:p-9">
                <span className="text-[clamp(2.6rem,5vw,3.8rem)] font-bold leading-none tracking-[-0.04em] text-primary">
                  {prefix}
                  <span data-contexto-value data-target={num}>{num}</span>
                  {suffix}
                </span>
                <p className="card-content text-[#f4f1ea]/80!">{s.label}</p>
                <span className="mt-auto text-label font-mono text-[#f4f1ea]/40!">{s.source}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
