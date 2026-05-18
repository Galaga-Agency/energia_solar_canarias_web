'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

type Sector = { key: string; tag: string; title: string; body: string; metric: string }

const SECTOR_IMAGES: Record<string, string> = {
  hoteles:   '/assets/images/common/lanzarote-beach-sunset.webp',
  industria: '/assets/images/home/aerial-solar-panel-rows.webp',
  retail:    '/assets/images/common/terraced-coastal-fields.webp',
  agro:      '/assets/images/home/cactus-mountain-landscape.webp',
}

function splitTail(text: string): { lead: string; tail: string } {
  const trimmed = text.replace(/\.$/, '')
  const idx     = trimmed.lastIndexOf(' ')
  if (idx === -1) return { lead: '', tail: text }
  const dot = text.endsWith('.') ? '.' : ''
  return { lead: trimmed.slice(0, idx), tail: trimmed.slice(idx + 1) + dot }
}

export function SolucionesSectores() {
  const t       = useTranslations('soluciones.sectores')
  const sectors = t.raw('items') as Sector[]
  const tt      = splitTail(t('titleLead') + ' ' + t('titleTail'))

  return (
    <section
      id="sectores"
      className="relative isolate overflow-hidden bg-(--color-bg) section-spacing"
    >
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

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
          {sectors.map((s) => {
            const ttt = splitTail(s.title)
            return (
              <article
                key={s.key}
                className="group relative isolate flex flex-col overflow-hidden bg-(--color-bg)"
                data-reveal
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={SECTOR_IMAGES[s.key]}
                    alt={s.tag}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                  />
                  <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(33,51,42,0.55)_0%,transparent_55%)]" />
                  <span className="absolute bottom-5 left-5 right-5 text-label font-mono text-white/90!">
                    {s.tag}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-4 border border-t-0 border-ink/10 bg-(--color-bg) p-6 md:p-8">
                  <h3 className="card-title">
                    {ttt.lead && <>{ttt.lead} </>}
                    <em className="italic font-normal text-primary">{ttt.tail}</em>
                  </h3>
                  <p className="card-content text-ink/65!">{s.body}</p>
                  <div className="mt-auto flex items-center gap-3 border-t border-ink/10 pt-4">
                    <span aria-hidden className="h-1.5 w-1.5 bg-primary" />
                    <span className="text-label font-mono italic text-primary!">
                      {s.metric}
                    </span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export { SolucionesSectores as SolucionesQuote }
