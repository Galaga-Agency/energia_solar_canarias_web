'use client'

import dynamic             from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { usePageReady }    from '@/hooks/usePageReady'
import { useGSAPAnimations } from '@/hooks/useGSAPAnimations'
import { ProyectosHero }   from '@/components/pages/proyectos/ProyectosHero'
import { Breadcrumbs }     from '@/components/shared/Breadcrumbs'
import type { Project }    from '@/types/project'
import { initHeroAnimations }         from '@/utils/animations/hero-animations'
import { initScrollRevealSections }   from '@/utils/animations/scroll-reveal'
import { initMarqueeAnimation }       from '@/utils/animations/marquee'
import { initProyectosCardsAnimation } from '@/utils/animations/proyectos-cards'
import { initCtaRevealAnimation }     from '@/utils/animations/cta-reveal'

const ProyectosGrid        = dynamic(() => import('./ProyectosGrid').then(m => m.ProyectosGrid))
const ProyectosCTA         = dynamic(() => import('./ProyectosCTA').then(m => m.ProyectosCTA), { ssr: false })

export function ProyectosClient({ projects }: { projects: Project[] }) {
  usePageReady()
  const nav = useTranslations('nav')

  useGSAPAnimations(() => ({
    critical: [initHeroAnimations],
    raf:      [],
    timeout:  [initScrollRevealSections, initMarqueeAnimation, initProyectosCardsAnimation, initCtaRevealAnimation],
  }))

  return (
    <>
      <Breadcrumbs items={[
        { label: nav('home'),     href: '/' },
        { label: nav('projects'), href: '/proyectos' },
      ]} />
      <ProyectosHero />
      <ProyectosGrid projects={projects} />
      <ProyectosCTA />
    </>
  )
}
