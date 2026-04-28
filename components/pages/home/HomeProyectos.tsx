'use client'

import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { Marquee } from '@/components/shared/Marquee'

const ClientsMarquee = dynamic(
  () => import('@/components/shared/ClientsMarquee').then(m => m.ClientsMarquee),
  { ssr: false },
)

const MARQUEE_ITEMS = [
  'Energía solar en Canarias',
  'Instalaciones certificadas',
  'Ahorra en tu factura',
  'Sistemas fotovoltaicos',
  'Autoconsumo inteligente',
  'Soluciones industriales',
  'Retorno garantizado',
  'Ingeniería local',
]

export function HomeProyectos() {
  const t = useTranslations('home.projects')

  return (
    <>
      <section className="section-spacing relative z-10">
        <div className="section-inner relative z-10" data-reveal>
          <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
            <h2 className="text-title">{t('title')}</h2>
            <p className="text-body">{t('body')}</p>
            <Button variant="green-dark" href="/proyectos">{t('cta')}</Button>
          </div>
        </div>
        <ClientsMarquee />
      </section>
      <Marquee items={MARQUEE_ITEMS} />
    </>
  )
}
