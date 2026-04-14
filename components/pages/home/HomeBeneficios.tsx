'use client'

interface BeneficioItem { label: string; desc: string }

interface HomeBeneficiosProps {
  eyebrow: string
  title:   string
  body:    string
  items:   BeneficioItem[]
}

export function HomeBeneficios({ eyebrow, title, body, items }: HomeBeneficiosProps) {
  return (
    <section className="section-spacing" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="section-inner" data-reveal>
        <span className="text-label block mb-4">{eyebrow}</span>
        <h2 className="text-heading mb-4 max-w-lg">{title}</h2>
        <p className="text-body mb-12 max-w-xl">{body}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {items.map(({ label, desc }) => (
            <div key={label} className="flex flex-col gap-3">
              <h3 className="text-subheading">{label}</h3>
              <p className="text-body-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
