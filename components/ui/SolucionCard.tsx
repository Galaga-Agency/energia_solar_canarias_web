'use client'

import Image from 'next/image'

interface SolucionCardProps {
  index: number
  label: string
  title: string
  desc: string
  image: string
}

const VARIANTS = [
  {
    offset:      'lg:translate-y-8',
    imageArea:   'absolute left-0 right-0 top-0 bottom-[42%] overflow-hidden brand-radius',
    imagePos:    'object-center',
    panelClass:  'absolute z-10 top-[45%] left-4 right-16 bottom-4 p-5 lg:p-6 brand-radius bg-[rgba(24,39,32,0.90)] backdrop-blur-md',
    labelClass:  'card-eyebrow text-white/55!',
    titleClass:  'card-title text-white!',
    descClass:   'card-content text-white/65!',
    divider:     'bg-white/15',
  },
  {
    offset:      'lg:-translate-y-4',
    imageArea:   'absolute left-0 right-0 top-[42%] bottom-0 overflow-hidden brand-radius',
    imagePos:    'object-[58%_center]',
    panelClass:  'absolute z-10 top-4 left-16 right-4 bottom-[45%] p-5 lg:p-6 brand-radius bg-[rgba(244,241,234,0.95)] shadow-[0_20px_60px_rgba(18,28,24,0.10)] backdrop-blur-sm',
    labelClass:  'card-eyebrow',
    titleClass:  'card-title',
    descClass:   'card-content',
    divider:     'bg-ink/10',
  },
  {
    offset:      'lg:translate-y-16',
    imageArea:   'absolute left-0 right-0 top-0 bottom-[42%] overflow-hidden brand-radius',
    imagePos:    'object-[44%_center]',
    panelClass:  'absolute z-10 top-[45%] left-8 right-12 bottom-4 p-5 lg:p-6 brand-radius bg-[rgba(24,39,32,0.90)] backdrop-blur-md',
    labelClass:  'card-eyebrow text-white/55!',
    titleClass:  'card-title text-white!',
    descClass:   'card-content text-white/65!',
    divider:     'bg-white/15',
  },
] as const

export function SolucionCard({ index, label, title, desc, image }: SolucionCardProps) {
  const v = VARIANTS[index]

  return (
    <article className={`isolate relative ${v.offset}`} data-solucion-card>
      <div className="relative min-h-136 bg-bg lg:min-h-152">

        <div
          className={v.imageArea}
          data-solucion-media
        >
          <Image
            src={image}
            alt={title}
            fill
            className={`${v.imagePos} object-cover solucion-card-image`}
            sizes="(min-width: 1024px) 26vw, (min-width: 768px) 30vw, 100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,24,20,0)_40%,rgba(15,24,20,0.25)_100%)]" />
        </div>

        <div className={v.panelClass} data-solucion-copy>
          <div className="mb-3 flex items-center gap-3">
            <span className={v.labelClass}>{label}</span>
            <div className={`h-px flex-1 ${v.divider}`} />
          </div>
          <h3 className={v.titleClass}>{title}</h3>
          <p className={`${v.descClass} mt-3`}>{desc}</p>
        </div>

      </div>
    </article>
  )
}
