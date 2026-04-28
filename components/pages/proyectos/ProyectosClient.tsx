'use client'

import dynamic             from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { usePageReady }    from '@/hooks/usePageReady'
import { useGSAPAnimations } from '@/hooks/useGSAPAnimations'
import { ProyectosHero }   from '@/components/pages/proyectos/ProyectosHero'
import { Breadcrumbs }     from '@/components/shared/Breadcrumbs'
import type { Project }    from '@/types/project'
import { initHeroAnimations }         from '@/utils/animations/hero-animations'
import { initStatsCounterAnimations } from '@/utils/animations/stats-counter'
import { initScrollRevealSections }   from '@/utils/animations/scroll-reveal'
import { initMarqueeAnimation }       from '@/utils/animations/marquee'

const ProyectosGrid        = dynamic(() => import('./ProyectosGrid').then(m => m.ProyectosGrid))
const ProyectosStats       = dynamic(() => import('./ProyectosStats').then(m => m.ProyectosStats))
const ProyectosTestimonial = dynamic(() => import('./ProyectosTestimonial').then(m => m.ProyectosTestimonial), { ssr: false })
const ClientsMarquee       = dynamic(() => import('@/components/shared/ClientsMarquee').then(m => m.ClientsMarquee), { ssr: false })
const CTABanner            = dynamic(() => import('@/components/shared/CTABanner').then(m => m.CTABanner), { ssr: false })

export function ProyectosClient({ projects }: { projects: Project[] }) {
  usePageReady()
  const nav = useTranslations('nav')
  const t   = useTranslations('proyectos')

  useGSAPAnimations(() => ({
    critical: [initHeroAnimations],
    raf:      [initStatsCounterAnimations],
    timeout:  [initScrollRevealSections, initMarqueeAnimation],
  }))

  return (
    <>
      <Breadcrumbs items={[
        { label: nav('home'),     href: '/' },
        { label: nav('projects'), href: '/proyectos' },
      ]} />
      <ProyectosHero />
      <ProyectosGrid projects={projects} />
      <ProyectosTestimonial />
      <ProyectosStats />
      <ClientsMarquee />
      <CTABanner
        title={t('cta.title')}
        body={t('cta.body')}
        primaryLabel={t('cta.primary')}
        primaryHref="/contacto"
        secondaryLabel={t('cta.secondary')}
        secondaryHref="/contacto"
      />
    </>
  )
}
