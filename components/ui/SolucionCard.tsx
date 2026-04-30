'use client'

import Image from 'next/image'

interface SolucionCardProps {
  index: number
  label: string
  title: string
  desc: string
  image: string
  className?: string
}

const VARIANTS = [
  {
    imageArea:   'absolute left-0 right-0 top-0 bottom-[42%] overflow-hidden brand-radius',
    imagePos:    'object-center',
    panelClass:  'absolute z-10 top-[45%] left-4 right-4 bottom-4 sm:right-16 p-5 lg:p-6 brand-radius bg-[rgba(24,39,32,0.90)] backdrop-blur-md',
    labelClass:  'card-eyebrow text-white/55!',
    titleClass:  'card-title text-white!',
    descClass:   'card-content text-white/65!',
    divider:     'bg-white/15',
    innerHeight: 'min-h-96 sm:min-h-136 lg:min-h-152',
  },
  {
    imageArea:   'absolute left-0 right-0 top-[42%] bottom-0 overflow-hidden brand-radius',
    imagePos:    'object-[58%_center]',
    panelClass:  'absolute z-10 top-4 left-4 right-4 bottom-[45%] sm:left-16 p-5 lg:p-6 brand-radius bg-[rgba(244,241,234,0.95)] shadow-[0_20px_60px_rgba(18,28,24,0.10)] backdrop-blur-sm',
    labelClass:  'card-eyebrow',
    titleClass:  'card-title',
    descClass:   'card-content',
    divider:     'bg-ink/10',
    innerHeight: 'min-h-96 sm:min-h-136 lg:min-h-152',
  },
  {
    imageArea:   'absolute left-0 right-0 top-0 bottom-[42%] sm:bottom-0 sm:right-[42%] overflow-hidden brand-radius',
    imagePos:    'object-[44%_center]',
    panelClass:  'absolute z-10 top-[45%] left-4 right-4 bottom-4 sm:inset-y-4 sm:left-[44%] p-5 sm:p-6 lg:p-8 brand-radius bg-[rgba(24,39,32,0.90)] backdrop-blur-md',
    labelClass:  'card-eyebrow text-white/55!',
    titleClass:  'card-title text-white!',
    descClass:   'card-content text-white/65!',
    divider:     'bg-white/15',
    innerHeight: 'min-h-96 sm:min-h-64 lg:min-h-72',
  },
]

export function SolucionCard({ index, label, title, desc, image, className = '' }: SolucionCardProps) {
  const v = VARIANTS[index]

  return (
    <article className={`isolate relative ${className}`} data-solucion-card>
      <div className={`relative ${v.innerHeight} bg-bg`}>

        <div className={v.imageArea} data-solucion-media>
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
