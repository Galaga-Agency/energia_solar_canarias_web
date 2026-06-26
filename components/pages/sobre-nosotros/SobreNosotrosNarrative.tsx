'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { PaperTexture } from '@/components/ui/PaperTexture'
import { initStoryStack } from '@/utils/animations/story-stack'

type Chapter = { kicker: string; title: string; text: string }

const CARD = [
  { bg: 'bg-[#1f3a34]', text: 'text-[#f4f1ea]', sub: 'text-[#f4f1ea]/70!', img: '/assets/images/common/volcanic-desert-road.webp' },
  { bg: 'bg-[#f4f1ea]', text: 'text-ink',       sub: 'text-ink/70!',       img: '/assets/images/common/volcanic-coastline-hills.webp' },
  { bg: 'bg-[#d8cbb5]', text: 'text-ink',       sub: 'text-ink/70!',       img: '/assets/images/common/cliffside-ocean-view.webp' },
] as const

export function SobreNosotrosNarrative() {
  const t        = useTranslations('sobre-nosotros.narrative')
  const chapters = t.raw('chapters') as Chapter[]
  const rootRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    return initStoryStack(root)
  }, [])

  return (
    <div ref={rootRef} className="relative">
      {chapters.map((c, i) => {
        const q = CARD[i % CARD.length]
        const imgRight = i % 2 === 0
        return (
          <section
            key={c.kicker}
            data-story-card
            data-nav-theme={i === 1 ? 'dark' : 'light'}
            className="relative overflow-hidden lg:min-h-svh"
          >
            {/* Inner wrapper — flex split; the IMAGE COLUMN's width animates, the
                image always fills 100% of that column (no image scaling).
                Mobile: simple stacked block (image, then content). */}
            <div
              data-card-inner
              className={`flex flex-col overflow-hidden lg:min-h-svh lg:flex-row ${q.bg}`}
            >
              {/* Content — vertically centered group. Mobile: image is on top (order-2). */}
              <div data-card-content className={`relative order-2 flex flex-1 flex-col justify-center px-[clamp(1.5rem,7vw,5rem)] py-[clamp(2.5rem,9vw,6rem)] ${imgRight ? 'lg:order-1' : 'lg:order-2'}`}>
                <PaperTexture className="z-0" />
                <div data-card-meta className="relative z-10 flex items-center justify-between">
                  <span className="text-label text-primary!">{c.kicker}</span>
                  <span className={`text-label ${q.sub}`}>{`0${i + 1} — 0${chapters.length}`}</span>
                </div>

                <span
                  data-card-num
                  aria-hidden
                  className={`pointer-events-none relative z-10 mt-4 select-none text-[clamp(4rem,8vw,7rem)] font-[700] leading-[0.85] tracking-[-0.05em] ${q.text}!`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <h3 data-card-title className={`relative z-10 text-display mt-6 max-w-[16ch] ${q.text}!`}>{c.title}</h3>
                <p data-card-body className={`relative z-10 mt-6 max-w-[48ch] text-body ${q.sub}`}>{c.text}</p>
              </div>

              {/* Image column — mobile: fixed-height banner on top (order-1).
                  Desktop: its WIDTH is the animated value (basis 50%). */}
              <div data-card-media-col className={`relative order-1 h-[42vh] w-full overflow-hidden lg:h-auto lg:min-h-0 lg:w-[50%] lg:shrink-0 ${imgRight ? 'lg:order-2' : 'lg:order-1'}`}>
                <div data-card-media className="absolute inset-0 overflow-hidden">
                  <Image
                    src={q.img}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                    aria-hidden
                  />
                </div>
              </div>
            </div>
          </section>
        )
      })}
      <div data-story-end aria-hidden />
    </div>
  )
}
