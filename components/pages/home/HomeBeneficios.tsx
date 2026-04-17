'use client'

import { BeneficioCard } from '@/components/ui/BeneficioCard'

interface BeneficioItem { label: string; desc: string }

interface HomeBeneficiosProps {
  eyebrow: string
  title:   string
  body:    string
  items:   BeneficioItem[]
}

const IMAGES = [
  { src: '/assets/images/home/solar-panel-laptop-workspace.webp',        alt: 'Persona trabajando con paneles solares' },
  { src: '/assets/images/home/solar-engineers-inspecting-installation.webp', alt: 'Ingenieros inspeccionando instalación solar' },
  { src: '/assets/images/home/solar-panel-planning-meeting.webp',         alt: 'Reunión de planificación de proyecto solar' },
  { src: '/assets/images/home/aerial-coastal-neighborhood.webp',          alt: 'Vista aérea de barrio costero en Canarias' },
]

export function HomeBeneficios({ eyebrow, title, body, items }: HomeBeneficiosProps) {
  return (
    <section className="section-spacing relative z-20" data-home-panel-end>
      <div className="section-inner relative z-10" data-reveal>

        <div className="flex flex-col items-center text-center gap-6 mb-12 max-w-2xl mx-auto">
          <span className="text-label text-primary!">{eyebrow}</span>
          <h2 className="text-title">{title}</h2>
          <p className="text-body">{body}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <BeneficioCard
              key={item.label}
              label={item.label}
              desc={item.desc}
              image={IMAGES[i]?.src ?? ''}
              alt={IMAGES[i]?.alt ?? item.label}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
