interface SolucionesProcessProps {
  title: string
  body: string
  items: { n: string; title: string; body: string }[]
}

export function SolucionesProcess({ title, body, items }: SolucionesProcessProps) {
  return (
    <section className="section-spacing" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="section-inner" data-reveal>
        <h2 className="text-heading mb-4">{title}</h2>
        <p className="text-body mb-12 max-w-xl">{body}</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {items.map(({ n, title, body }) => (
            <div key={n} data-process-step className="flex flex-col gap-4">
              <span
                className="text-display"
                style={{ color: 'var(--color-primary)', lineHeight: 1 }}
              >
                {n}
              </span>
              <h3 className="text-subheading">{title}</h3>
              <p className="text-body">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
