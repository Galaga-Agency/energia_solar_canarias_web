'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { PaperTexture } from '@/components/ui/PaperTexture'
import { BRANDS } from '@/constants/brands.constants'

export function SolucionesBrands() {
  const t = useTranslations('soluciones.brands')

  return (
    <section className="relative isolate overflow-hidden bg-[#f4f1ea] text-ink section-spacing">
      <PaperTexture className="z-0" />

      <div className="section-inner relative z-10">
        <div className="mb-16 text-center" data-reveal>
          <span className="block text-label text-primary!">{t('label')}</span>
          <h2 className="mx-auto mt-5 text-title max-w-[22ch]">{t('sub')}</h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-[clamp(2.5rem,7vw,6rem)] gap-y-12" data-reveal>
          {BRANDS.map((brand) => (
            <span key={brand.name} className="relative flex h-10 w-36 items-center justify-center">
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                sizes="160px"
                className="object-contain opacity-55 brightness-0 transition-opacity duration-300 hover:opacity-100"
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
