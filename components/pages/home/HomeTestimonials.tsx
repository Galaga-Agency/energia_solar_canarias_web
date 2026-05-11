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

  const total = items.length.toString().padStart(2, '0')

  return (
    <section className="section-spacing bg-[#f4f1ea]">
      <div className="section-inner">

        {/* Top bar — eyebrow */}
        <div
          className="flex items-center gap-3 font-mono text-[13px] uppercase tracking-[0.18em] text-primary"
          data-reveal
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {t('title')}
        </div>

        <hr className="mt-6 border-t border-ink/15" />

        {/* Body — single-column on mobile, 12-col grid from md */}
        <div
          className="relative grid grid-cols-1 gap-y-8 pt-12 md:grid-cols-12 md:gap-x-12 md:gap-y-0 md:pt-24"
          data-reveal
        >

          {/* Decorative quote glyph */}
          <span
            aria-hidden
            className="pointer-events-none absolute -left-2 -top-6 select-none font-serif text-[clamp(8rem,18vw,18rem)] leading-none text-primary/12 md:left-[20%] md:-top-12"
          >
            “
          </span>

          {/* Counter */}
          <div className="relative flex flex-col gap-2 md:col-span-3 md:gap-3 md:pt-3">
            <span className="font-mono text-[13px] uppercase tracking-[0.22em] text-primary">
              Reseña
            </span>
            <span className="font-mono text-[24px] font-bold leading-none tracking-tight text-ink md:text-[28px]">
              {String(idx + 1).padStart(2, '0')}
              <span className="text-ink/35"> / {total}</span>
            </span>
          </div>

          {/* Quote + pagination */}
          <div className="relative md:col-span-9">
            <div className="relative min-h-[200px] md:min-h-[240px]">
              {items.map((item, i) => (
                <blockquote
                  key={i}
                  className={`absolute inset-0 flex flex-col gap-6 transition-all duration-700 ease-out md:gap-10 ${
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

            <div className="mt-10 flex gap-3 md:mt-14">
              {items.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Reseña ${i + 1}`}
                  onClick={() => setIdx(i)}
                  className={`h-0.5 transition-all duration-300 ${
                    i === idx ? 'w-12 bg-primary' : 'w-7 bg-ink/20 hover:bg-ink/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
