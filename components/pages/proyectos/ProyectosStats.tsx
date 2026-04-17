interface ProyectosStatsProps {
  title: string
  body: string
  items: { value: string; suffix: string; label: string; body: string }[]
}

export function ProyectosStats({ title, body, items }: ProyectosStatsProps) {
  return (
    <section className="section-spacing" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="section-inner grid grid-cols-1 md:grid-cols-2 gap-12 items-center" data-reveal>
        <div>
          <h2 className="text-heading mb-6">{title}</h2>
          <p className="text-body">{body}</p>
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
