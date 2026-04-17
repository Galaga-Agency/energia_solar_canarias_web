interface SolucionesQuoteProps {
  eyebrow: string
  quote: string
  body: string
}

export function SolucionesQuote({ eyebrow, quote, body }: SolucionesQuoteProps) {
  return (
    <section
      className="relative overflow-hidden section-spacing-both"
      style={{ backgroundColor: 'var(--color-surface-dark)' }}
    >
      <div className="section-inner grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative" data-reveal>
        <div>
          <span className="text-label block mb-4" style={{ color: 'var(--color-text-on-dark)' }}>{eyebrow}</span>
          <blockquote>
            <p
              className="text-heading mb-6"
              style={{ fontWeight: 'var(--font-weight-semibold)', fontStyle: 'italic', color: 'var(--color-text-on-dark)' }}
            >
              &quot;{quote}&quot;
            </p>
          </blockquote>
          <p className="text-body" style={{ color: 'var(--color-text-on-dark)', opacity: 0.8 }}>{body}</p>
        </div>
        <div className="w-full aspect-square rounded-2xl bg-[var(--color-surface-dark-2)]" />
      </div>
    </section>
  )
}
