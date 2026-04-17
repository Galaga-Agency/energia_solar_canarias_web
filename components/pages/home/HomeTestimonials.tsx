'use client'

interface TestimonialItem { name: string; role: string; quote: string }

interface HomeTestimonialsProps {
  eyebrow: string
  title:   string
  body:    string
  items:   TestimonialItem[]
}

export function HomeTestimonials({ eyebrow, title, body, items }: HomeTestimonialsProps) {
  return (
    <section className="section-spacing" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="section-inner" data-reveal>
        <span className="text-label block mb-4">{eyebrow}</span>
        <h2 className="text-heading mb-4">{title}</h2>
        <p className="text-body mb-12 max-w-xl">{body}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(({ name, role, quote }) => (
            <div key={name} className="bg-surface rounded-2xl overflow-hidden p-8 flex flex-col gap-6">
              <div className="flex gap-1 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} aria-hidden="true">★</span>
                ))}
                <span className="sr-only">5 de 5 estrellas</span>
              </div>
              <blockquote>
                <p className="text-body" style={{ fontStyle: 'italic' }}>&quot;{quote}&quot;</p>
              </blockquote>
              <div>
                <p className="text-body" style={{ fontWeight: 'var(--font-weight-semibold)' }}>{name}</p>
                <p className="text-body-sm">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
