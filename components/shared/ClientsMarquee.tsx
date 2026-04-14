'use client'

const PLACEHOLDER_LOGOS = [
  'Cliente 1', 'Cliente 2', 'Cliente 3', 'Cliente 4',
  'Cliente 5', 'Cliente 6', 'Cliente 7', 'Cliente 8',
]

export function ClientsMarquee() {
  const doubled = [...PLACEHOLDER_LOGOS, ...PLACEHOLDER_LOGOS]

  return (
    <section
      aria-hidden="true"
      className="overflow-hidden section-spacing"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div
        data-marquee-track
        className="flex gap-12 w-max"
        style={{ willChange: 'transform' }}
      >
        {doubled.map((name, i) => (
          <div
            key={i}
            className="flex items-center justify-center px-6 py-3 rounded-lg opacity-40"
            style={{
              backgroundColor: 'var(--color-surface)',
              minWidth:        '140px',
              color:           'var(--color-ink)',
            }}
          >
            <span className="text-label">{name}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
