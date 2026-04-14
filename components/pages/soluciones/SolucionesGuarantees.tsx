interface SolucionesGuaranteesProps {
  items: { title: string; body: string }[]
}

export function SolucionesGuarantees({ items }: SolucionesGuaranteesProps) {
  return (
    <section className="section-spacing" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="section-inner grid grid-cols-1 md:grid-cols-2 gap-12 items-center" data-reveal>
        <div className="w-full aspect-[4/3] rounded-2xl bg-[var(--color-border)]" />
        <div className="flex flex-col gap-10">
          {items.map(({ title, body }) => (
            <div key={title}>
              <h3 className="text-subheading mb-3">{title}</h3>
              <p className="text-body">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
