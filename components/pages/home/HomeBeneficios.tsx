'use client'

import { useTranslations } from 'next-intl'
import { AnimatedBrandBlob } from '@/components/ui/AnimatedBrandBlob'

type Item = { keyword: string; label: string; desc: string }

function splitLastWord(label: string): { lead: string; tail: string } {
  const idx = label.lastIndexOf(' ')
  if (idx === -1) return { lead: '', tail: label }
  return { lead: label.slice(0, idx), tail: label.slice(idx + 1) }
}

// Brand's poster system — mirrored asymmetric bento (wide/small / small/wide).
const POSTER_VARIANTS = [
  {
    bg:       'bg-[#1f3a34]',                              // Deep forest green
    eyebrow:  'text-primary!',
    title:    'text-[#f4f1ea]!',
    desc:     'text-[#f4f1ea]/70!',
    italic:   'md:text-primary',
    tile:     'aspect-square lg:aspect-auto lg:col-span-2 lg:h-full',  // wide top-left
  },
  {
    bg:       'bg-[#1c1c1a]',                              // Near black
    eyebrow:  'text-primary!',
    title:    'text-[#f4f1ea]!',
    desc:     'text-[#f4f1ea]/65!',
    italic:   'md:text-primary',
    tile:     'aspect-square lg:col-span-1',               // small top-right (sets row height)
  },
  {
    bg:       'bg-[#f4f1ea]',                              // Cream
    eyebrow:  'text-primary!',
    title:    'text-ink!',
    desc:     'text-ink/68!',
    italic:   'md:text-primary',
    tile:     'aspect-square lg:col-span-1',               // small bottom-left (sets row height)
  },
  {
    bg:       'bg-[#d8cbb5]',                              // Warm beige
    eyebrow:  'text-primary!',
    title:    'text-ink!',
    desc:     'text-ink/72!',
    italic:   'md:text-primary',
    tile:     'aspect-square lg:aspect-auto lg:col-span-2 lg:h-full',  // wide bottom-right
  },
] as const

export function HomeBeneficios() {
  const t     = useTranslations('home.benefits')
  const items = t.raw('items') as Item[]

  return (
    <section data-bene-section className="section-spacing relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 mix-blend-multiply opacity-25 bg-[url('/assets/images/common/white-paper-texture.jpg')] bg-cover bg-center bg-fixed"
      />
      <div className="section-inner relative z-10">
        <div className="mb-16 grid grid-cols-1 gap-8 md:mb-20 md:grid-cols-12 md:items-end md:gap-12" data-reveal>
          <div className="md:col-span-7">
            <span className="text-label text-primary! mb-4 block">{t('eyebrow')}</span>
            <h2 className="text-title max-w-[24ch]">{t('title')}</h2>
          </div>
          <span className="text-label md:col-span-5 md:justify-self-end md:text-right italic">
            Un socio energético
          </span>
        </div>

        {/* Poster grid — four cards, brand's canonical poster layout */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {items.map((item, i) => {
            const { lead, tail } = splitLastWord(item.label)
            const v = POSTER_VARIANTS[i % POSTER_VARIANTS.length]
            return (
              <article
                key={item.keyword}
                data-bene-item
                className={`group relative overflow-hidden ${v.bg} ${v.tile}`}
              >
                {/* Brand blob — only on the first card (visual anchor for the bento) */}
                {i === 0 && (
                  <AnimatedBrandBlob
                    className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-auto w-[60%] -translate-x-1/2 -translate-y-1/2 md:top-12 opacity-95"
                  />
                )}

                {/* Top: eyebrow / keyword */}
                <span
                  data-bene-keyword
                  className={`absolute left-6 right-6 top-6 z-10 block font-mono text-[11px] uppercase italic tracking-[0.26em] lg:left-7 lg:right-7 lg:top-7 lg:text-[12px] ${v.eyebrow}`}
                >
                  {item.keyword}
                </span>

                {/* Bottom: title + description */}
                <div className="absolute bottom-6 left-6 right-6 z-10 lg:bottom-7 lg:left-7 lg:right-7">
                  <h3
                    data-bene-label
                    className={`font-sans text-[clamp(1.4rem,1.6vw,1.6rem)] font-bold leading-[1.1] tracking-[-0.02em] ${v.title}`}
                  >
                    {lead && <>{lead} </>}
                    <em className={`not-italic md:italic md:font-normal ${v.italic}`}>{tail}</em>
                  </h3>

                  <p data-bene-desc className={`card-content mt-3 ${v.desc}`}>
                    {item.desc}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
