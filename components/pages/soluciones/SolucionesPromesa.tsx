'use client'

import { useTranslations } from 'next-intl'
import { splitTail } from '@/utils/text'

type Promise = { key: string; label: string; body: string }

export function SolucionesPromesa() {
  const t     = useTranslations('soluciones.promesa')
  const items = t.raw('items') as Promise[]
  const tt    = splitTail(t('titleLead') + ' ' + t('titleTail'))

  return (
    <section className="relative isolate overflow-hidden bg-(--color-bg) section-spacing">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 mix-blend-multiply opacity-25 bg-[url('/assets/images/common/white-paper-texture.jpg')] bg-cover bg-center bg-fixed"
      />

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

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
          {items.map((p, i) => (
            <article
              key={p.key}
              className="flex flex-col gap-5 border border-ink/15 bg-(--color-bg) p-7 md:p-9"
              data-reveal
            >
              <span className="text-label font-mono italic text-primary!">
                0{i + 1}
              </span>
              <h3 className="card-title text-primary">{p.label}</h3>
              <p className="card-content text-ink/65!">{p.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-ink/15 pt-10 md:mt-20" data-reveal>
          <p className="text-subheading italic text-ink leading-snug max-w-[34ch]">
            &ldquo;{t('tagline')}&rdquo;
          </p>
          <span className="text-label font-mono text-primary!">{t('signature')}</span>
        </div>
      </div>
    </section>
  )
}
