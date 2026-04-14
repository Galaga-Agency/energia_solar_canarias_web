'use client'

import { Button } from '@/components/ui/Button'

interface HomeProyectosProps {
  title: string
  body:  string
  cta:   string
}

export function HomeProyectos({ title, body, cta }: HomeProyectosProps) {
  return (
    <section className="section-spacing" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="section-inner" data-reveal>
        <h2 className="text-heading mb-4 max-w-xl">{title}</h2>
        <p className="text-body mb-8 max-w-xl">{body}</p>
        <Button variant="outlined" href="/proyectos">{cta}</Button>
      </div>
    </section>
  )
}
