'use client'

import { useTranslations } from 'next-intl'

export function HomeBeneficios() {
  const t     = useTranslations('home.benefits')
  const items = t.raw('items') as { num: string; label: string; desc: string }[]

  return (
    <section className="section-spacing relative isolate overflow-hidden">
      <div className="section-inner relative z-10">
        <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end md:gap-12" data-reveal>
          <div className="md:col-span-7">
            <span className="text-label text-primary! mb-4 block">{t('eyebrow')}</span>
            <h2 className="text-title max-w-[24ch]">{t('title')}</h2>
          </div>
          <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-ink/45 md:col-span-5 md:justify-self-end md:text-right">
            Un socio energético
          </span>
        </div>

        <ul data-reveal>
          {items.map((item) => (
            <li
              key={item.label}
              className="group grid grid-cols-1 items-start gap-x-12 gap-y-3 border-t border-[#d8cbb5]/55 py-10 transition-[padding] duration-500 ease-out last:border-b last:border-[#d8cbb5]/55 md:grid-cols-[1fr_2fr_auto] md:py-12 md:hover:pl-3"
            >
              <h3 className="self-center text-[clamp(1.2rem,1.8vw,1.6rem)] leading-[1.15] tracking-[-0.018em] text-ink">
                {item.label}
              </h3>

              <p className="max-w-[58ch] text-[clamp(0.98rem,1.2vw,1.1rem)] leading-relaxed text-ink/65">
                {item.desc}
              </p>

              <span
                aria-hidden
                className="hidden self-center justify-self-end font-mono text-[18px] text-ink/35 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-primary md:block"
              >
                ↗
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
