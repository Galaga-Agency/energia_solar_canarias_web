interface SobreNosotrosNarrativeProps {
  title: string
  paragraphs: string[]
}

export function SobreNosotrosNarrative({ title, paragraphs }: SobreNosotrosNarrativeProps) {
  return (
    <section className="section-spacing" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="section-inner" data-reveal>
        <h2 className="text-heading mb-8 max-w-lg">{title}</h2>
        <div className="max-w-2xl flex flex-col gap-6 mb-12">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-body">{paragraph}</p>
          ))}
        </div>
        <div className="w-full aspect-video rounded-2xl bg-[var(--color-surface)]" />
      </div>
    </section>
  )
}
