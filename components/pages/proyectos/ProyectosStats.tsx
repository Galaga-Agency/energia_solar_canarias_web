import { useTranslations } from 'next-intl'
import { PaperTexture } from '@/components/ui/PaperTexture'

export function ProyectosStats() {
  const t     = useTranslations('proyectos.stats')
  const items = t.raw('items') as { value: string; suffix: string; label: string; body: string }[]

  return (
    <section className="section-spacing relative isolate overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>
      <PaperTexture className="z-0" />
      <div className="section-inner relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center" data-reveal>
        <div>
          <h2 className="text-heading mb-6">{t('title')}</h2>
          <p className="text-body">{t('body')}</p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {items.map(({ value, suffix, label, body }) => (
            <div key={label} className="bg-surface rounded-2xl overflow-hidden p-6">
              <p className="text-title mb-1" style={{ color: 'var(--color-primary)' }}>
                <span data-counter={value}>0</span>{suffix}
              </p>
              <h4 className="text-subheading">{label}</h4>
              <p className="text-body-sm">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
