'use client'

import { useTranslations } from 'next-intl'

type Stat = { value: string; label: string; source: string }

function splitTail(text: string): { lead: string; tail: string } {
  const trimmed = text.replace(/\.$/, '')
  const idx     = trimmed.lastIndexOf(' ')
  if (idx === -1) return { lead: '', tail: text }
  const dot = text.endsWith('.') ? '.' : ''
  return { lead: trimmed.slice(0, idx), tail: trimmed.slice(idx + 1) + dot }
}

export function SolucionesContexto() {
  const t     = useTranslations('soluciones.insight')
  const stats = t.raw('stats') as Stat[]
  const tt    = splitTail(t('quoteLead') + ' ' + t('quoteTail'))

  return (
    <section className="relative isolate overflow-hidden bg-[#1f3a34] text-[#f4f1ea] section-spacing">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 mix-blend-multiply opacity-35 bg-[url('/assets/images/common/white-paper-texture.jpg')] bg-cover bg-center bg-fixed"
      />

      <div className="section-inner relative z-10">
        <div className="flex flex-col gap-8 md:grid md:grid-cols-12 md:items-start md:gap-12" data-reveal>
          <div className="md:col-span-7">
            <span className="text-label text-primary! mb-5 block">{t('eyebrow')}</span>
            <h2 className="text-title text-[#f4f1ea]! max-w-[18ch]">
              {tt.lead}{' '}
              <em className="not-italic md:italic md:font-normal md:text-primary">{tt.tail}</em>
            </h2>
          </div>
          <p className="text-body text-[#f4f1ea]/75 max-w-[42ch] md:col-span-5 md:pt-2">
            {t('body')}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-[#f4f1ea]/15 bg-[#f4f1ea]/10 sm:grid-cols-3 md:mt-20">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-3 bg-[#1f3a34] p-7 md:p-9" data-reveal>
              <span className="text-[clamp(2.6rem,5vw,3.8rem)] font-bold leading-none tracking-[-0.04em] text-primary">
                {s.value}
              </span>
              <p className="card-content text-[#f4f1ea]/80!">{s.label}</p>
              <span className="mt-auto text-label font-mono text-[#f4f1ea]/40!">{s.source}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
