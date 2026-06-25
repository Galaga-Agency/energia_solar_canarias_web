import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { PaperTexture } from '@/components/ui/PaperTexture'

export function BlogHero({ children }: { children?: ReactNode }) {
  const t = useTranslations('blog.hero')

  const marqueeCopies = Array.from({ length: 4 }, (_, i) => i)

  return (
    <section
      data-hero
      data-nav-theme="light"
      className="relative isolate flex min-h-[68svh] flex-col justify-between overflow-hidden bg-ink pt-[clamp(8rem,16vh,12rem)] pb-[clamp(2.5rem,6vw,4rem)]"
    >
      <PaperTexture className="z-0" opacityClassName="opacity-35" />

      {/* Top edge — mono labels */}
      <div className="section-inner relative z-10 flex items-center justify-between" data-hero-item>
        <span className="flex items-center gap-3 text-label font-mono text-text-on-dark/70!">
          <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-primary" />
          {t('eyebrow')}
        </span>
        <span className="text-label font-mono text-text-on-dark/35! ml-4">Canarias · 2026</span>
      </div>

      {/* Middle — giant marquee */}
      <div className="relative z-10 my-10 md:my-14" data-hero-item>
        <div className="relative overflow-hidden">
          <div className="marquee-track items-baseline gap-[3vw]">
            {marqueeCopies.map((i) => (
              <span key={i} className="shrink-0 whitespace-nowrap text-display text-text-on-dark!">
                El Observatorio{' '}
                <em className="italic font-normal text-primary">solar</em>
                <span aria-hidden className="ml-[3vw] text-primary">·</span>
              </span>
            ))}
          </div>
        </div>
        <h1 className="sr-only">{t('title')}</h1>
      </div>

      {/* Bottom — subtitle + smart search */}
      <div className="section-inner relative z-10" data-hero-item>
        <div className="grid grid-cols-1 gap-8 border-t border-text-on-dark/15 pt-6 md:grid-cols-12 md:items-start md:gap-12">
          <p className="text-body text-text-on-dark/70! max-w-[52ch] md:col-span-6">{t('body')}</p>
          {children && <div className="md:col-span-6 md:pt-1">{children}</div>}
        </div>
      </div>
    </section>
  )
}
