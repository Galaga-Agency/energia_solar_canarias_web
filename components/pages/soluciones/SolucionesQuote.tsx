import { useTranslations } from 'next-intl'

export function SolucionesQuote() {
  const t = useTranslations('soluciones.quote')

  return (
    <section
      className="relative overflow-hidden section-spacing-both"
      style={{ backgroundColor: 'var(--color-surface-dark)' }}
    >
      <div className="section-inner grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative" data-reveal>
        <div>
          <span className="text-label block mb-4" style={{ color: 'var(--color-text-on-dark)' }}>{t('eyebrow')}</span>
          <blockquote>
            <p
              className="text-heading mb-6"
              style={{ fontWeight: 'var(--font-weight-semibold)', fontStyle: 'italic', color: 'var(--color-text-on-dark)' }}
            >
              &quot;{t('quote')}&quot;
            </p>
          </blockquote>
          <p className="text-body" style={{ color: 'var(--color-text-on-dark)', opacity: 0.8 }}>{t('body')}</p>
        </div>
        <div className="w-full aspect-square rounded-2xl bg-[var(--color-surface-dark-2)]" />
      </div>
    </section>
  )
}
