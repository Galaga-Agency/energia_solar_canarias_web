'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { PaperTexture } from '@/components/ui/PaperTexture'

const MouseReactiveFlock = dynamic(() => import('@/components/shared/MouseReactiveFlock').then(m => m.MouseReactiveFlock), { ssr: false })

type Pillar = { tag: string; title: string; body: string }

// Per-pillar bento span + tone (cream section bg → tiles contrast: green / black / sand).
const PILLARS = [
  { span: 'md:col-span-7 md:row-span-2', bg: 'bg-[#1f3a34]', title: 'text-[#f4f1ea]', body: 'text-[#f4f1ea]/70!' },
  { span: 'md:col-span-5',               bg: 'bg-[#1c1c1a]', title: 'text-[#f4f1ea]', body: 'text-[#f4f1ea]/70!' },
  { span: 'md:col-span-4',               bg: 'bg-[#d8cbb5]', title: 'text-ink',       body: 'text-ink/65!' },
  { span: 'md:col-span-7',               bg: 'bg-white',     title: 'text-ink',       body: 'text-ink/65!' },
] as const

// Image tiles slotted into the bento gaps.
const IMG_AFTER_2 = { src: '/assets/images/common/lanzarote-beach-sunset.webp',   span: 'md:col-span-3' }
const IMG_BEFORE_4 = { src: '/assets/images/common/coastal-rocks-and-sea.webp',      span: 'md:col-span-5' }

export function SobreNosotrosBenefits() {
  const t     = useTranslations('sobre-nosotros.pillars')
  const items = t.raw('items') as Pillar[]

  const renderPillar = (p: Pillar, i: number) => {
    const tone = PILLARS[i]
    return (
      <article key={p.tag} data-bento-tile className={`flex flex-col justify-between gap-6 p-8 md:p-10 ${tone.span} ${tone.bg}`}>
        <div className="flex items-baseline justify-between">
          <span className="text-stat leading-none text-primary!">{String(i + 1).padStart(2, '0')}</span>
          <span className={`text-label ${tone.body}`}>{p.tag.split('/').pop()?.trim()}</span>
        </div>
        <div>
          <h3 className={`text-subheading ${tone.title}!`}>{p.title}</h3>
          <p className={`mt-3 max-w-[44ch] text-body ${tone.body}`}>{p.body}</p>
        </div>
      </article>
    )
  }

  const ImgTile = ({ src, span }: { src: string; span: string }) => (
    <div data-bento-tile className={`relative h-full min-h-56 overflow-hidden ${span}`}>
      <Image src={src} alt="" fill sizes="(max-width:768px) 100vw, 40vw" className="object-cover" aria-hidden />
    </div>
  )

  return (
    <section className="relative isolate overflow-hidden bg-[#f4f1ea] text-ink section-spacing-both">
      <PaperTexture className="z-0" />
      <MouseReactiveFlock className="pointer-events-none absolute inset-0 z-0 h-full w-full" birds={45} />
      <div className="section-inner relative z-10">
        <div className="grid auto-rows-[minmax(11rem,auto)] grid-cols-1 gap-4 md:grid-cols-12">
          {/* Intro tile — no card, sits on the cream bg */}
          <div className="flex flex-col justify-between gap-8 p-2 md:col-span-5 md:row-span-2 md:p-4" data-reveal>
            <span className="text-label text-primary!">{t('eyebrow')}</span>
            <h2 className="text-display text-ink">
              {t('titleLead')}{' '}
              <em className="not-italic md:italic md:font-normal md:text-primary">{t('titleTail')}</em>
            </h2>
            <p className="max-w-[34ch] text-body text-ink/65">{t('body')}</p>
          </div>

          {items[0] && renderPillar(items[0], 0)}
          {items[1] && renderPillar(items[1], 1)}
          <ImgTile {...IMG_AFTER_2} />
          {items[2] && renderPillar(items[2], 2)}
          <ImgTile {...IMG_BEFORE_4} />
          {items[3] && renderPillar(items[3], 3)}
        </div>
      </div>
    </section>
  )
}
