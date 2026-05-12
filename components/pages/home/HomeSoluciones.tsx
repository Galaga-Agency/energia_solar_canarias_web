'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'
import { Button } from '@/components/ui/Button'
import { TransitionLink } from '@/components/ui/TransitionLink'

type SectorKey = 'hoteles' | 'industria' | 'retail' | 'agro'

const SECTOR_IMAGES: Record<SectorKey, string> = {
  hoteles:   '/assets/images/common/lanzarote-beach-sunset.webp',
  industria: '/assets/images/home/aerial-solar-panel-rows.webp',
  retail:    '/assets/images/common/terraced-coastal-fields.webp',
  agro:      '/assets/images/home/cactus-mountain-landscape.webp',
}

const FEATURED: SectorKey[] = ['hoteles', 'agro', 'industria']

const PANEL_VARIANTS = [
  // 0 — dark forest, panel anchored to the bottom (overflows below)
  {
    panel:       'bg-[#1f3a34] text-[#f4f1ea]',
    titleCls:    'card-title text-[#f4f1ea]!',
    descCls:     'card-content text-[#f4f1ea]/70!',
    position:    'absolute bottom-0 left-5 right-12 lg:left-7 lg:right-16',
    cardPadding: 'pb-12 lg:pb-16',
  },
  // 1 — cream, panel anchored to the top (overflows above)
  {
    panel:       'bg-[#f4f1ea] text-ink border border-ink/10',
    titleCls:    'card-title',
    descCls:     'card-content text-ink/72!',
    position:    'absolute top-0 right-5 left-12 lg:right-7 lg:left-16',
    cardPadding: 'pt-12 lg:pt-16',
  },
  // 2 — warm beige, panel anchored to the bottom (continuity with HomeBeneficios's last tile)
  {
    panel:       'bg-[#d8cbb5] text-ink',
    titleCls:    'card-title',
    descCls:     'card-content text-ink/72!',
    position:    'absolute bottom-0 left-5 right-12 lg:left-7 lg:right-16',
    cardPadding: 'pb-12 lg:pb-16',
  },
] as const

type Item = { key: SectorKey; label: string; title: string; desc: string; metric: string }

function splitLastWord(label: string): { lead: string; tail: string } {
  const idx = label.lastIndexOf(' ')
  if (idx === -1) return { lead: '', tail: label }
  return { lead: label.slice(0, idx), tail: label.slice(idx + 1) }
}

function TiltCard({ item, variant }: { item: Item; variant: number }) {
  const v = PANEL_VARIANTS[variant % PANEL_VARIANTS.length]
  const cardRef = useRef<HTMLElement>(null)
  const imgRef  = useRef<HTMLDivElement>(null)

  const rXTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null)
  const rYTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null)
  const iXTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null)
  const iYTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null)

  useEffect(() => {
    if (!cardRef.current || !imgRef.current) return
    rXTo.current = gsap.quickTo(cardRef.current, 'rotationX', { duration: 0.7, ease: 'power3' })
    rYTo.current = gsap.quickTo(cardRef.current, 'rotationY', { duration: 0.7, ease: 'power3' })
    iXTo.current = gsap.quickTo(imgRef.current,  'x',         { duration: 0.7, ease: 'power3' })
    iYTo.current = gsap.quickTo(imgRef.current,  'y',         { duration: 0.7, ease: 'power3' })

    gsap.set(cardRef.current, { transformPerspective: 1200, transformOrigin: '50% 50%' })
  }, [])

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const dx = (e.clientX - (rect.left + rect.width / 2))  / (rect.width  / 2)
    const dy = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2)

    rXTo.current?.(-dy * 9)
    rYTo.current?.( dx * 9)
    iXTo.current?.( dx * 18)
    iYTo.current?.( dy * 18)
  }

  const handleLeave = () => {
    rXTo.current?.(0)
    rYTo.current?.(0)
    iXTo.current?.(0)
    iYTo.current?.(0)
  }

  const { lead, tail } = splitLastWord(item.title)

  return (
    <article
      ref={cardRef}
      data-solucion-card
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`group relative cursor-pointer will-change-transform ${v.cardPadding}`}
    >
      {/* Image container — own clipping, holds the parallax-shifted image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <div
          ref={imgRef}
          className="absolute -inset-6 will-change-transform"
          data-solucion-media
        >
          <Image
            src={SECTOR_IMAGES[item.key]}
            alt={item.title}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="solucion-card-image object-cover"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(15,24,20,0.25)_0%,transparent_55%)]" />
      </div>

      {/* Offset content panel — overflows top or bottom depending on variant */}
      <div
        data-solucion-copy
        className={`z-10 p-5 lg:p-6 ${v.position} ${v.panel}`}
      >
        <span className="font-mono text-[11px] uppercase italic tracking-[0.26em] text-primary md:text-[12px]">
          {item.label}
        </span>

        <h3 className={`${v.titleCls} mt-3`}>
          {lead && <>{lead} </>}
          <em className="not-italic md:italic md:font-normal md:text-primary">{tail}</em>
        </h3>

        <p className={`${v.descCls} mt-3`}>{item.desc}</p>

        <p className="mt-4 font-mono text-[10px] uppercase italic tracking-[0.22em] text-primary">
          {item.metric}
        </p>
      </div>
    </article>
  )
}

function WideSolutionCard({ item, variant, className }: { item: Item; variant: number; className?: string }) {
  const v = PANEL_VARIANTS[variant % PANEL_VARIANTS.length]
  const { lead, tail } = splitLastWord(item.title)
  return (
    <article className={`relative pr-10 sm:pr-14 ${className ?? ''}`}>
      <div className="relative aspect-[4/2] overflow-hidden">
        <Image
          src={SECTOR_IMAGES[item.key]}
          alt={item.title}
          fill
          sizes="(max-width: 1024px) 90vw, 30vw"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_left,rgba(15,24,20,0.25)_0%,transparent_55%)]" />
      </div>

      <div className={`absolute right-0 top-5 bottom-5 z-10 w-2/5 max-w-[22rem] p-5 sm:p-6 ${v.panel}`}>
        <span className="font-mono text-[11px] uppercase italic tracking-[0.26em] text-primary sm:text-[12px]">
          {item.label}
        </span>
        <h3 className={`${v.titleCls} mt-3`}>
          {lead && <>{lead} </>}
          <em className="not-italic sm:italic sm:font-normal sm:text-primary">{tail}</em>
        </h3>
        <p className={`${v.descCls} mt-3`}>{item.desc}</p>
        <p className="mt-4 font-mono text-[10px] uppercase italic tracking-[0.22em] text-primary">
          {item.metric}
        </p>
      </div>
    </article>
  )
}

export function HomeSoluciones() {
  const t        = useTranslations('home.sectores')
  const allItems = t.raw('items') as Item[]
  const items    = FEATURED.map(k => allItems.find(i => i.key === k)!).filter(Boolean)

  const titleStr  = t('title')
  const titleNode = (() => {
    const trimmed = titleStr.replace(/\.$/, '')
    const idx = trimmed.lastIndexOf(' ')
    if (idx === -1) return <>{titleStr}</>
    const lead = trimmed.slice(0, idx)
    const tail = trimmed.slice(idx + 1)
    const dot  = titleStr.endsWith('.') ? '.' : ''
    return (
      <>
        {lead}{' '}
        <em className="not-italic md:italic md:font-normal md:text-primary">{tail}</em>{dot}
      </>
    )
  })()

  return (
    <section className="section-spacing relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 mix-blend-multiply opacity-25 bg-[url('/assets/images/common/white-paper-texture.jpg')] bg-cover bg-center bg-fixed"
      />
      <div className="section-inner relative z-10">
        <div className="mb-16 grid grid-cols-1 gap-10 md:mb-20 md:grid-cols-12 md:items-start md:gap-x-12 lg:gap-x-16" data-reveal>
          <div className="flex flex-col gap-6 md:col-span-5 md:order-1">
            <span className="text-label text-primary!">{t('eyebrow')}</span>
            <p className="text-body max-w-[34ch]">{t('body')}</p>
            <Button variant="outlined" href="/soluciones" className="self-start">{t('cta')} ↗</Button>
          </div>

          <h2 className="text-title max-w-[22ch] md:col-span-7 md:order-2 md:justify-self-end md:text-right">
            {titleNode}
          </h2>
        </div>

        <div
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10"
          data-soluciones-grid
          style={{ perspective: '1200px' }}
        >
          {items.map((item, i) => {
            const isLast  = i === items.length - 1
            const variant = i === 0 ? 2 : i === 1 ? 1 : 0
            if (!isLast) {
              return <TiltCard key={item.key} item={item} variant={variant} />
            }
            return (
              <div key={item.key} className="sm:col-span-2 lg:col-span-1">
                <WideSolutionCard item={item} variant={variant} className="hidden sm:block lg:hidden" />
                <div className="sm:hidden lg:block">
                  <TiltCard item={item} variant={variant} />
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-3 md:mt-24 md:grid-cols-12 md:items-center md:gap-6">
          <span className="text-label text-primary! md:col-span-3">{t('hogares.label')}</span>
          <p className="card-content md:col-span-6">{t('hogares.title')}</p>
          <TransitionLink
            href="/soluciones#hogares"
            className="font-mono text-[12px] uppercase tracking-[0.22em] text-ink transition-colors hover:text-primary md:col-span-3 md:justify-self-end"
          >
            {t('hogares.cta')}
          </TransitionLink>
        </div>
      </div>
    </section>
  )
}
