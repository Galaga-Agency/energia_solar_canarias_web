import { useTranslations } from 'next-intl'
import { PaperTexture } from '@/components/ui/PaperTexture'

export function SobreNosotrosHero() {
  const t = useTranslations('sobre-nosotros.hero')

  return (
    <section
      data-hero
      className="relative isolate overflow-hidden section-spacing-both"
      style={{ backgroundColor: 'var(--color-surface-dark)' }}
    >
      <PaperTexture className="z-0" opacityClassName="opacity-35" />
      <div className="section-inner relative z-10">
        <h1 className="text-display mb-6 max-w-2xl" data-hero-item style={{ color: 'var(--color-text-on-dark)' }}>
          {t('title')}
        </h1>
        <p className="text-body max-w-xl" data-hero-item style={{ color: 'var(--color-text-on-dark)', opacity: 0.8 }}>
          {t('body')}
        </p>
      </div>
    </section>
  )
}
