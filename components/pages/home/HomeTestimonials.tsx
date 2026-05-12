'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

export function HomeTestimonials() {
  const t     = useTranslations('home.testimonials')
  const items = t.raw('items') as { name: string; role: string; quote: string }[]
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % items.length), 7000)
    return () => clearInterval(id)
  }, [items.length])

  return (
    <section className="section-spacing relative isolate overflow-hidden bg-[#d8cbb5] text-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 mix-blend-multiply opacity-25 bg-[url('/assets/images/common/white-paper-texture.jpg')] bg-cover bg-center bg-fixed"
      />
      <div className="section-inner relative z-10">

        {/* Top bar — eyebrow */}
        <div
          className="flex items-center gap-3 font-mono text-[13px] uppercase tracking-[0.18em] text-primary"
          data-reveal
        >
          {t('title')}
        </div>

        <hr className="mt-6 border-t border-ink/15" />

        {/* Body */}
        <div className="relative pt-12 md:pt-24" data-reveal>

          {/* Decorative quote glyph */}
          <span
            aria-hidden
            className="pointer-events-none absolute -left-2 -top-6 select-none font-serif text-[clamp(8rem,18vw,18rem)] leading-none text-primary/20 md:-left-4 md:-top-12"
          >
            “
          </span>

          <div className="relative">
            <div className="relative grid">
              {items.map((item, i) => (
                <blockquote
                  key={i}
                  className={`col-start-1 row-start-1 flex flex-col gap-6 transition-all duration-700 ease-out md:gap-10 ${
                    i === idx
                      ? 'pointer-events-auto translate-y-0 opacity-100'
                      : 'pointer-events-none translate-y-3 opacity-0'
                  }`}
                  aria-hidden={i !== idx}
                >
                  <p className="max-w-[44ch] text-title italic leading-relaxed md:text-title">
                    {item.quote}
                  </p>
                  <footer className="font-mono text-[12px] uppercase tracking-[0.18em] text-ink/55 md:text-[13px]">
                    — {item.name} · {item.role}
                  </footer>
                </blockquote>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2 md:mt-14">
              {items.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Reseña ${i + 1}`}
                  onClick={() => setIdx(i)}
                  className="group flex h-11 items-center justify-center"
                >
                  <span
                    className={`block h-0.5 transition-all duration-300 ${
                      i === idx ? 'w-12 bg-primary' : 'w-7 bg-ink/20 group-hover:bg-ink/40'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
