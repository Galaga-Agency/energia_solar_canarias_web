import { useTranslations } from 'next-intl'

export function ProyectosHero() {
  const t = useTranslations('proyectos.hero')

  return (
    <section data-hero className="section-spacing-both" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="section-inner">
        <span className="text-label block mb-4" data-hero-item>{t('eyebrow')}</span>
        <h1 className="text-title mb-6" data-hero-item>{t('title')}</h1>
        <p className="text-body max-w-xl" data-hero-item>{t('body')}</p>
      </div>
    </section>
  )
}
