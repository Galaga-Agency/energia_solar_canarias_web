'use client'

import { useState }     from 'react'
import { Button }       from '@/components/ui/Button'
import { SolucionCard } from '@/components/ui/SolucionCard'

interface SolucionItem {
  label: string
  title: string
  desc:  string
}

interface HomeSolucionesProps {
  eyebrow:       string
  title:         string
  body:          string
  cta:           string
  empresas:      SolucionItem
  instalaciones: SolucionItem
  hogares:       SolucionItem
}

const IMAGES = [
  '/assets/images/home/cactus-mountain-landscape.webp',
  '/assets/images/home/maspalomas-sand-dunes.webp',
  '/assets/images/home/aerial-solar-panel-rows.webp',
]

export function HomeSoluciones({ eyebrow, title, body, cta, empresas, instalaciones, hogares }: HomeSolucionesProps) {
  const [openIndex, setOpenIndex] = useState(0)
  const items = [empresas, instalaciones, hogares]

  return (
    <section className="section-spacing home-soluciones-panel panel-surface relative z-0" data-home-panel-pin>
<div className="section-inner" data-reveal>

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-6 mb-12 max-w-2xl mx-auto">
          <span className="text-label text-primary!">{eyebrow}</span>
          <h2 className="text-title">{title}</h2>
          <p className="text-body">{body}</p>
          <Button variant="green-dark" href="/soluciones">{cta}</Button>
        </div>

        {/* Cards */}
        <div className="flex flex-col md:flex-row md:h-115 gap-4">
          {items.map((item, i) => (
            <SolucionCard
              key={item.label}
              label={item.label}
              title={item.title}
              desc={item.desc}
              image={IMAGES[i]}
              isOpen={openIndex === i}
              onSelect={() => setOpenIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
