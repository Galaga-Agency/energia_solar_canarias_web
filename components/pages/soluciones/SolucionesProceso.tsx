'use client'

import { useTranslations } from 'next-intl'

type Step = { n: string; title: string; body: string }

function splitTail(text: string): { lead: string; tail: string } {
  const trimmed = text.replace(/\.$/, '')
  const idx     = trimmed.lastIndexOf(' ')
  if (idx === -1) return { lead: '', tail: text }
  const dot = text.endsWith('.') ? '.' : ''
  return { lead: trimmed.slice(0, idx), tail: trimmed.slice(idx + 1) + dot }
}

export function SolucionesProceso() {
  const t     = useTranslations('soluciones.proceso')
  const items = t.raw('items') as Step[]
  const tt    = splitTail(t('titleLead') + ' ' + t('titleTail'))

  return (
    <section className="relative isolate overflow-hidden bg-(--color-bg) section-spacing">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 mix-blend-multiply opacity-25 bg-[url('/assets/images/common/white-paper-texture.jpg')] bg-cover bg-center bg-fixed"
      />
      <div className="section-inner relative z-10">
        {/* Split header — title left, body right on one line (breaks the stacked pattern) */}
        <div className="mb-12 grid grid-cols-1 gap-8 md:mb-16 md:grid-cols-12 md:items-end md:gap-12" data-reveal>
          <div className="md:col-span-7">
            <span className="text-label text-primary! mb-4 block">{t('eyebrow')}</span>
            <h2 className="text-title max-w-[22ch]">
              {tt.lead}{' '}
              <em className="not-italic md:italic md:font-normal md:text-primary">{tt.tail}</em>
            </h2>
          </div>
          <p className="text-body text-ink/70 md:col-span-5 md:justify-self-end md:text-right max-w-[40ch]">{t('body')}</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((s) => (
            <article key={s.n} className="flex flex-col gap-4 border border-ink/12 bg-white/40 p-7" data-reveal>
              <span className="text-title text-primary! leading-none">{s.n}</span>
              <h3 className="card-title text-ink!">{s.title}</h3>
              <p className="card-content text-ink/65!">{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
