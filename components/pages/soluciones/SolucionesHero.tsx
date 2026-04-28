import { useTranslations } from 'next-intl'

export function SolucionesHero() {
  const t     = useTranslations('soluciones.hero')
  const items = t.raw('items') as { label: string; title: string; body: string }[]

  return (
    <section data-hero className="section-spacing-both" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="section-inner">
        <span className="text-label block mb-4" data-hero-item>{t('eyebrow')}</span>
        <h1 className="text-title mb-6 max-w-2xl" data-hero-item>{t('title')}</h1>
        <p className="text-body mb-12 max-w-xl" data-hero-item>{t('body')}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={item.label} className={`card p-8 flex flex-col gap-4 ${i === 2 ? 'md:col-span-1 md:row-span-2' : ''}`}>
              <div className="w-full aspect-video rounded-lg bg-[var(--color-border)]" />
              <span className="text-label">{item.label}</span>
              <h3 className="text-subheading">{item.title}</h3>
              <p className="text-body">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
