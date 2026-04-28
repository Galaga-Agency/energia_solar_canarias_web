import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'

export function SolucionesDifferentiator() {
  const t = useTranslations('soluciones.differentiator')

  return (
    <section className="section-spacing" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="section-inner" data-reveal>
        <h2 className="text-heading mb-4 max-w-lg">
          {t('titleStart')} <span className="brand-canarias">{t('titleBrand')}</span>{t('titleEnd')}
        </h2>
        <p className="text-body mb-8 max-w-xl">{t('body')}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outlined" href="/contacto">{t('primary')}</Button>
          <Button variant="filled" href="/contacto">{t('secondary')}</Button>
        </div>
      </div>
    </section>
  )
}
