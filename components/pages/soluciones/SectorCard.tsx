'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import { splitLastWord } from '@/utils/text'
import { PlaceholderImage } from '@/components/shared/PlaceholderImage'

export interface SectorCardItem {
  key: string
  tag: string
  title: string
  offer: string
  metric: string
}

const SECTOR_IMAGES: Record<string, string> = {
  hoteles:   '/assets/images/common/lanzarote-beach-sunset.webp',
  industria: '/assets/images/home/aerial-solar-panel-rows.webp',
  retail:    '/assets/images/common/terraced-coastal-fields.webp',
  agro:      '/assets/images/home/cactus-mountain-landscape.webp',
}

const PANEL_VARIANTS = [
  {
    panel:       'bg-[#1f3a34] text-[#f4f1ea]',
    titleCls:    'card-title text-[#f4f1ea]!',
    descCls:     'card-content text-[#f4f1ea]/70!',
    position:    'absolute bottom-0 left-5 right-12 lg:left-7 lg:right-16',
    cardPadding: 'pb-12 lg:pb-16',
  },
  {
    panel:       'bg-[#f4f1ea] text-ink border border-ink/10',
    titleCls:    'card-title',
    descCls:     'card-content text-ink/72!',
    position:    'absolute top-0 right-5 left-12 lg:right-7 lg:left-16',
    cardPadding: 'pt-12 lg:pt-16',
  },
  {
    panel:       'bg-[#d8cbb5] text-ink',
    titleCls:    'card-title',
    descCls:     'card-content text-ink/72!',
    position:    'absolute bottom-0 left-5 right-12 lg:left-7 lg:right-16',
    cardPadding: 'pb-12 lg:pb-16',
  },
  {
    panel:       'bg-[#1c1c1a] text-[#f4f1ea]',
    titleCls:    'card-title text-[#f4f1ea]!',
    descCls:     'card-content text-[#f4f1ea]/70!',
    position:    'absolute top-0 right-5 left-12 lg:right-7 lg:left-16',
    cardPadding: 'pt-12 lg:pt-16',
  },
] as const


export function SectorCard({ item, variant }: { item: SectorCardItem; variant: number }) {
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
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`group relative cursor-pointer will-change-transform ${v.cardPadding}`}
      data-solucion-card
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <div ref={imgRef} className="absolute -inset-6 will-change-transform" data-solucion-media>
          <PlaceholderImage
            src={SECTOR_IMAGES[item.key]}
            alt={item.title}
            fill
            sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(15,24,20,0.25)_0%,transparent_55%)]" />
      </div>

      <div className={`z-10 p-5 lg:p-6 ${v.position} ${v.panel}`} data-solucion-copy>
        <span className="font-mono text-[11px] uppercase italic tracking-[0.26em] text-primary md:text-[12px]">
          {item.tag}
        </span>
        <h3 className={`${v.titleCls} mt-3`}>
          {lead && <>{lead} </>}
          <em className="not-italic md:italic md:font-normal md:text-primary">{tail}</em>
        </h3>
        <p className={`${v.descCls} mt-3`}>{item.offer}</p>
        <p className="mt-4 font-mono text-[10px] uppercase italic tracking-[0.22em] text-primary">
          {item.metric}
        </p>
      </div>
    </article>
  )
}
