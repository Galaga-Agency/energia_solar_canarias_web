import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'

export function SobreNosotrosBenefits() {
  const t     = useTranslations('sobre-nosotros.benefits')
  const items = t.raw('items') as { title: string; body: string }[]

  return (
    <section className="section-spacing" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="section-inner" data-reveal>
        <span className="text-label block mb-4">{t('eyebrow')}</span>
        <h2 className="text-heading mb-4">{t('title')}</h2>
        <p className="text-body mb-12 max-w-xl">{t('body')}</p>

        <div className="flex flex-col gap-12 mb-12">
          {items.map((item) => (
            <div key={item.title} className="flex gap-6 items-start">
              <div
                aria-hidden="true"
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-on-primary)' }}
              >
                ✓
              </div>
              <div>
                <h3 className="text-subheading mb-2">{item.title}</h3>
                <p className="text-body">{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-surface rounded-2xl overflow-hidden p-8 md:p-12">
          <div
            aria-hidden="true"
            className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-on-primary)', fontSize: '2rem' }}
          >
            🏝
          </div>
          <h3 className="text-subheading mb-4">{t('cardTitle')}</h3>
          <p className="text-body mb-6">{t('cardBody')}</p>
          <Button variant="outlined" href="/proyectos">{t('cta')}</Button>
        </div>
      </div>
    </section>
  )
}
