import { useTranslations } from 'next-intl'
import { PaperTexture } from '@/components/ui/PaperTexture'

export function ProyectosHero() {
  const t = useTranslations('proyectos.hero')

  return (
    <section data-hero className="section-spacing-both relative isolate overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>
      <PaperTexture className="z-0" />
      <div className="section-inner relative z-10">
        <span className="text-label block mb-4" data-hero-item>{t('eyebrow')}</span>
        <h1 className="text-display mb-6" data-hero-item>{t('title')}</h1>
        <p className="text-body max-w-xl" data-hero-item>{t('body')}</p>
      </div>
    </section>
  )
}
