import { useTranslations } from 'next-intl'
import { TransitionLink } from '@/components/ui/TransitionLink'

export function SobreNosotrosLeadership() {
  const t = useTranslations('sobre-nosotros.leadership')

  return (
    <section className="section-spacing" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="section-inner" data-reveal>
        <span className="text-label block mb-4">{t('eyebrow')}</span>
        <h2 className="text-heading mb-8">{t('title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="w-full aspect-[3/4] rounded-2xl bg-[var(--color-border)]" />
          <div>
            <h3 className="text-subheading mb-6">{t('quote')}</h3>
            <p className="text-body mb-6">{t('body')}</p>
            <TransitionLink href="/sobre-nosotros" style={{ color: 'var(--color-primary)' }} className="text-body-sm font-semibold">
              {t('link')}
            </TransitionLink>
          </div>
        </div>
      </div>
    </section>
  )
}
