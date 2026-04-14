'use client'

import { TransitionLink } from '@/components/ui/TransitionLink'

interface SolucionItem {
  label: string
  desc:  string
}

interface HomeSolucionesProps {
  eyebrow:      string
  title:        string
  link:         string
  empresas:     SolucionItem
  instalaciones:SolucionItem
  hogares:      SolucionItem
}

export function HomeSoluciones({ eyebrow, title, link, empresas, instalaciones, hogares }: HomeSolucionesProps) {
  const items = [empresas, instalaciones, hogares]

  return (
    <section className="section-spacing" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="section-inner" data-reveal>
        <span className="text-label block mb-4">{eyebrow}</span>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <h2 className="text-heading max-w-lg">{title}</h2>
          <TransitionLink href="/soluciones" className="text-body-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
            {link}
          </TransitionLink>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(({ label, desc }) => (
            <TransitionLink key={label} href="/soluciones" className="card p-8 flex flex-col gap-4">
              <div className="w-full aspect-video rounded-lg" style={{ backgroundColor: 'var(--color-border)' }} />
              <span className="text-label">{label}</span>
              <p className="text-body">{desc}</p>
            </TransitionLink>
          ))}
        </div>
      </div>
    </section>
  )
}
