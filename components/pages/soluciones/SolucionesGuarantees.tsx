'use client'

import { useTranslations } from 'next-intl'
import { PaperTexture } from '@/components/ui/PaperTexture'

type Decisor = { role: string; message: string }

function splitTail(text: string): { lead: string; tail: string } {
  const trimmed = text.replace(/\.$/, '')
  const idx     = trimmed.lastIndexOf(' ')
  if (idx === -1) return { lead: '', tail: text }
  const dot = text.endsWith('.') ? '.' : ''
  return { lead: trimmed.slice(0, idx), tail: trimmed.slice(idx + 1) + dot }
}

export function SolucionesDecisores() {
  const t        = useTranslations('soluciones.decisores')
  const decisors = t.raw('items') as Decisor[]
  const tt       = splitTail(t('titleLead') + ' ' + t('titleTail'))

  return (
    <section className="relative isolate overflow-hidden bg-[#d8cbb5] section-spacing">
      <PaperTexture className="z-0" />

      <div className="section-inner relative z-10">
        <div className="mb-14 flex flex-col gap-8 md:mb-20 md:grid md:grid-cols-12 md:items-end md:gap-12" data-reveal>
          <div className="md:col-span-7">
            <span className="text-label text-primary! mb-4 block">{t('eyebrow')}</span>
            <h2 className="text-title max-w-[22ch]">
              {tt.lead}{' '}
              <em className="not-italic md:italic md:font-normal md:text-primary">{tt.tail}</em>
            </h2>
          </div>
          <p className="text-body max-w-[40ch] text-ink/70 md:col-span-5 md:justify-self-end md:text-right">
            {t('body')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
          {decisors.map((d) => (
            <article
              key={d.role}
              className="flex flex-col gap-6 border border-ink/15 bg-(--color-bg) p-7 md:p-9"
              data-reveal
            >
              <span className="text-label font-mono italic text-primary!">
                {d.role}
              </span>

              <p className="text-subheading italic text-ink leading-snug">
                &ldquo;{d.message}&rdquo;
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export { SolucionesDecisores as SolucionesGuarantees }
