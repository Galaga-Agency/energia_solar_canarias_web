'use client'

import { useTranslations } from 'next-intl'
import { splitTail } from '@/utils/text'

type Step = { n: string; title: string; body: string }

export function SolucionesProceso() {
  const t     = useTranslations('soluciones.proceso')
  const items = t.raw('items') as Step[]
  const tt    = splitTail(t('titleLead') + ' ' + t('titleTail'))

  return (
    <section className="relative overflow-hidden section-spacing">
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

        {/* Connected timeline — a line runs through the step numbers */}
        <div className="relative">
          {/* The track: horizontal on desktop, vertical on mobile */}
          <span
            aria-hidden
            className="absolute bg-primary/25 left-[1.1rem] top-0 bottom-0 w-px md:left-0 md:right-0 md:top-[1.6rem] md:h-px md:w-auto"
          />
          <ol className="grid grid-cols-1 gap-y-12 md:grid-cols-4 md:gap-x-8 md:gap-y-0" data-sol-stagger>
            {items.map((s) => (
              <li key={s.n} className="relative pl-12 md:pl-0 md:pt-16" data-sol-item>
                {/* Node — number sits on the track */}
                <span className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full bg-(--color-bg) ring-1 ring-primary/40 md:h-12 md:w-12">
                  <span className="text-label font-mono text-primary!">{s.n}</span>
                </span>
                <h3 className="card-title text-ink! md:mt-0">{s.title}</h3>
                <p className="card-content text-ink/65! mt-3 max-w-[34ch]">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
