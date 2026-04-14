'use client'

import { BlobDecor } from '@/components/ui/BlobDecor'

interface StatItem { value: string; suffix: string; label: string; desc: string }

interface HomeStatsProps {
  quote: string
  items: StatItem[]
}

export function HomeStats({ quote, items }: HomeStatsProps) {
  return (
    <section
      className="relative overflow-hidden section-spacing"
      style={{ backgroundColor: 'var(--color-surface-dark)' }}
    >
      <BlobDecor className="right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-20" />
      <div className="section-inner relative" data-reveal>
        <p
          className="text-heading mb-16 max-w-2xl"
          style={{ fontWeight: 'var(--font-weight-semibold)', fontStyle: 'italic', color: 'var(--color-text-on-dark)' }}
        >
          {quote}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {items.map(({ value, suffix, label, desc }) => (
            <div key={label}>
              <p className="text-display mb-2" style={{ color: 'var(--color-primary)' }}>
                <span data-counter={value}>0</span>{suffix}
              </p>
              <h4 className="text-subheading mb-2" style={{ color: 'var(--color-text-on-dark)' }}>{label}</h4>
              <p className="text-body-sm" style={{ color: 'var(--color-text-on-dark)', opacity: 0.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
