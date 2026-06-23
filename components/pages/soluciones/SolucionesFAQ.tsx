'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

type Item = { question: string; answer: string }

export function SolucionesFAQ({ items, label }: { items: Item[]; label: string }) {
  const [open, setOpen] = useState<number | null>(0)
  const t = useTranslations('soluciones.faq')

  return (
    <section
      aria-label={label}
      className="relative overflow-hidden section-spacing"
    >
      <div className="section-inner relative z-10">
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:grid md:grid-cols-12 md:items-end md:gap-12" data-reveal>
          <div className="md:col-span-7">
            <span className="text-label text-primary! mb-4 block">{label}</span>
            <h2 className="text-title max-w-[22ch]">
              Lo que más nos{' '}
              <em className="not-italic md:italic md:font-normal md:text-primary">preguntan.</em>
            </h2>
          </div>
          <p className="text-body max-w-[42ch] text-ink/70 md:col-span-5 md:justify-self-end md:text-right">
            Si no encuentras tu duda aquí, escríbenos. Respondemos en menos de 24 horas con datos reales de tu caso.
          </p>
        </div>

        <dl className="border-t border-ink/15">
          {items.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                className="group border-b border-ink/15 transition-colors hover:bg-ink/[0.02]"
              >
                <dt>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-start justify-between gap-6 px-4 py-7 text-left md:gap-10 md:px-6 md:py-8"
                  >
                    <span className="flex-1 text-heading text-ink!">{item.question}</span>
                    <span
                      aria-hidden
                      className={`mt-2 font-mono text-2xl leading-none text-primary transition-transform duration-300 ${
                        isOpen ? 'rotate-45' : 'rotate-0'
                      }`}
                    >
                      +
                    </span>
                  </button>
                </dt>

                <dd
                  id={`faq-panel-${i}`}
                  className="faq-collapse"
                  data-open={isOpen ? 'true' : 'false'}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 pb-8 md:px-6 md:pb-10">
                      <p className="card-content text-ink/70! max-w-[64ch]">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
