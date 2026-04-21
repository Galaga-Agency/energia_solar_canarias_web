'use client'

import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/Button'
import { Marquee } from '@/components/shared/Marquee'

const ClientsMarquee = dynamic(
  () => import('@/components/shared/ClientsMarquee').then(m => m.ClientsMarquee),
  { ssr: false },
)

interface HomeProyectosProps {
  title:        string
  body:         string
  cta:          string
  marqueeItems: string[]
}

export function HomeProyectos({ title, body, cta, marqueeItems }: HomeProyectosProps) {
  return (
    <>
      <section className="section-spacing relative z-10">
        <div className="section-inner relative z-10" data-reveal>
          <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
            <h2 className="text-title">{title}</h2>
            <p className="text-body">{body}</p>
            <Button variant="green-dark" href="/proyectos">{cta}</Button>
          </div>
        </div>
        <ClientsMarquee />
      </section>
      <Marquee items={marqueeItems} />
    </>
  )
}
