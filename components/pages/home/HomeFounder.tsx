'use client'

import { TransitionLink } from '@/components/ui/TransitionLink'

interface HomeFounderProps {
  eyebrow: string
  title:   string
  role:    string
  name:    string
  body1:   string
  quote:   string
  link:    string
}

export function HomeFounder({ eyebrow, title, role, name, body1, quote, link }: HomeFounderProps) {
  return (
    <section className="section-spacing" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="section-inner" data-reveal>
        <span className="text-label block mb-4">{eyebrow}</span>
        <h2 className="text-heading mb-8 max-w-xl">{title}</h2>
        <div className="card p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <span className="text-label block mb-4">{role}</span>
            <h3 className="text-subheading mb-4">{name}</h3>
            <p className="text-body mb-6">{body1}</p>
            <p className="text-body mb-6" style={{ fontWeight: 'var(--font-weight-semibold)', fontStyle: 'italic' }}>
              {quote}
            </p>
            <TransitionLink href="/sobre-nosotros" className="text-body-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
              {link}
            </TransitionLink>
          </div>
          <div className="w-full aspect-[4/3] rounded-xl" style={{ backgroundColor: 'var(--color-border)' }} />
        </div>
      </div>
    </section>
  )
}
