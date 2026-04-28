import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'

export function SolucionesPainPoints() {
  const t    = useTranslations('soluciones.painPoints')
  const tags = t.raw('tags') as string[]

  return (
    <section className="section-spacing" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="section-inner" data-reveal>
        <span className="text-label block mb-4">{t('eyebrow')}</span>
        <h2 className="text-heading mb-4 max-w-lg">{t('title')}</h2>
        <p className="text-body mb-8 max-w-xl">{t('body')}</p>
        <div className="flex flex-wrap gap-3 mb-8">
          {tags.map((tag) => (
            <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-surface text-text">{tag}</span>
          ))}
        </div>
        <Button variant="outlined" href="/proyectos">{t('cta')}</Button>
      </div>
    </section>
  )
}
