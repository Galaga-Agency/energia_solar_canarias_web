import { Button } from '@/components/ui/Button'

interface SobreNosotrosBenefitsProps {
  eyebrow: string
  title: string
  body: string
  items: { title: string; body: string }[]
  cardTitle: string
  cardBody: string
  cta: string
}

export function SobreNosotrosBenefits({
  eyebrow,
  title,
  body,
  items,
  cardTitle,
  cardBody,
  cta,
}: SobreNosotrosBenefitsProps) {
  return (
    <section className="section-spacing" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="section-inner" data-reveal>
        <span className="text-label block mb-4">{eyebrow}</span>
        <h2 className="text-heading mb-4">{title}</h2>
        <p className="text-body mb-12 max-w-xl">{body}</p>

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

        <div className="card p-8 md:p-12">
          <div
            aria-hidden="true"
            className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-on-primary)', fontSize: '2rem' }}
          >
            🏝
          </div>
          <h3 className="text-subheading mb-4">{cardTitle}</h3>
          <p className="text-body mb-6">{cardBody}</p>
          <Button variant="outlined" href="/proyectos">{cta}</Button>
        </div>
      </div>
    </section>
  )
}
