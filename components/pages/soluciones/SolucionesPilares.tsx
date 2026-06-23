'use client'

import { useTranslations } from 'next-intl'

type Pilar = { tag: string; title: string; body: string }

function splitTail(text: string): { lead: string; tail: string } {
  const trimmed = text.replace(/\.$/, '')
  const idx     = trimmed.lastIndexOf(' ')
  if (idx === -1) return { lead: '', tail: text }
  const dot = text.endsWith('.') ? '.' : ''
  return { lead: trimmed.slice(0, idx), tail: trimmed.slice(idx + 1) + dot }
}

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
      {/* Header band */}
      <div className="bg-(--color-bg) section-spacing relative isolate overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 mix-blend-multiply opacity-25 bg-[url('/assets/images/common/white-paper-texture.jpg')] bg-cover bg-center bg-fixed"
        />
        <div className="section-inner relative z-10" data-reveal>
          <span className="text-label text-primary! mb-4 block">{t('eyebrow')}</span>
          <h2 className="text-title max-w-[22ch]">
            {tt.lead}{' '}
            <em className="not-italic md:italic md:font-normal md:text-primary">{tt.tail}</em>
          </h2>
          <p className="mt-6 max-w-[55ch] text-body text-ink/70">{t('body')}</p>
        </div>
      </div>

      {/* Full-bleed 2x2 color quadrants */}
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {items.map((p, i) => {
          const q = QUAD[i % QUAD.length]
          return (
            <article
              key={p.tag}
              className={`flex min-h-[44vh] flex-col justify-between gap-10 p-8 md:p-14 ${q.bg}`}
              data-reveal
            >
              <span className="text-label font-mono text-primary!">{p.tag}</span>
              <div>
                <h3 className={`text-title ${q.text}!`}>{p.title}</h3>
                <p className={`mt-4 text-body ${q.sub} max-w-[40ch]`}>{p.body}</p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
