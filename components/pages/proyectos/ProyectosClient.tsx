'use client'

import dynamic             from 'next/dynamic'
import { usePageReady }    from '@/hooks/usePageReady'
import { useGSAPAnimations } from '@/hooks/useGSAPAnimations'
import { useTranslation }  from '@/contexts/TranslationContext'
import { ProyectosHero }   from '@/components/pages/proyectos/ProyectosHero'
import { Breadcrumbs }     from '@/components/shared/Breadcrumbs'
import type { Project }    from '@/types/project'
import { initHeroAnimations }         from '@/utils/animations/hero-animations'
import { initStatsCounterAnimations } from '@/utils/animations/stats-counter'
import { initScrollRevealSections }   from '@/utils/animations/scroll-reveal'
import { initMarqueeAnimation }       from '@/utils/animations/marquee'

const ProyectosGrid     = dynamic(() => import('./ProyectosGrid').then(m => m.ProyectosGrid))
const ProyectosStats    = dynamic(() => import('./ProyectosStats').then(m => m.ProyectosStats))
const ClientsMarquee    = dynamic(() => import('@/components/shared/ClientsMarquee').then(m => m.ClientsMarquee), { ssr: false })
const CTABanner         = dynamic(() => import('@/components/shared/CTABanner').then(m => m.CTABanner), { ssr: false })
const TestimonialSingle = dynamic(() => import('@/components/shared/TestimonialSingle').then(m => m.TestimonialSingle), { ssr: false })

interface ProyectosClientProps {
  projects: Project[]
  messages: {
    hero: { eyebrow: string; title: string; body: string }
    grid: { readMore: string; seeAll: string }
    testimonial: { quote: string; name: string; role: string; companyLogo: string; avatar: string }
    stats: { title: string; body: string; items: { value: string; suffix: string; label: string; body: string }[] }
    cta: { title: string; body: string; primary: string; secondary: string }
  }
}

export function ProyectosClient({ projects, messages }: ProyectosClientProps) {
  usePageReady()
  const { t } = useTranslation()

  useGSAPAnimations(() => ({
    critical: [initHeroAnimations],
    raf:      [initStatsCounterAnimations],
    timeout:  [initScrollRevealSections, initMarqueeAnimation],
  }))

  return (
    <>
      <Breadcrumbs items={[
        { label: t('nav.home'),     href: '/' },
        { label: t('nav.projects'), href: '/proyectos' },
      ]} />
      <ProyectosHero {...messages.hero} />
      <ProyectosGrid projects={projects} readMore={messages.grid.readMore} seeAll={messages.grid.seeAll} />
      <TestimonialSingle {...messages.testimonial} />
      <ProyectosStats {...messages.stats} />
      <ClientsMarquee />
      <CTABanner
        title={messages.cta.title}
        body={messages.cta.body}
        primaryLabel={messages.cta.primary}
        primaryHref="/contacto"
        secondaryLabel={messages.cta.secondary}
        secondaryHref="/contacto"
      />
    </>
  )
}
