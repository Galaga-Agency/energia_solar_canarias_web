'use client'

import dynamic            from 'next/dynamic'
import { usePageReady }   from '@/hooks/usePageReady'
import { useGSAPAnimations } from '@/hooks/useGSAPAnimations'
import { HomeHero }       from '@/components/pages/home/HomeHero'
import { initHeroAnimations }         from '@/utils/animations/hero-animations'
import { initStatsCounterAnimations } from '@/utils/animations/stats-counter'
import { initScrollRevealSections }   from '@/utils/animations/scroll-reveal'
import { initMarqueeAnimation }       from '@/utils/animations/marquee'
import { initBlobAnimation }          from '@/utils/animations/blob'

const HomeSoluciones   = dynamic(() => import('./HomeSoluciones').then(m => m.HomeSoluciones))
const HomeBeneficios   = dynamic(() => import('./HomeBeneficios').then(m => m.HomeBeneficios))
const HomeProyectos    = dynamic(() => import('./HomeProyectos').then(m => m.HomeProyectos))
const HomeStats        = dynamic(() => import('./HomeStats').then(m => m.HomeStats))
const HomeFounder      = dynamic(() => import('./HomeFounder').then(m => m.HomeFounder))
const HomeTestimonials = dynamic(() => import('./HomeTestimonials').then(m => m.HomeTestimonials))
const ClientsMarquee   = dynamic(() => import('@/components/shared/ClientsMarquee').then(m => m.ClientsMarquee), { ssr: false })
const CTABanner        = dynamic(() => import('@/components/shared/CTABanner').then(m => m.CTABanner), { ssr: false })

interface SolucionItem { label: string; desc: string }
interface StatItem     { value: string; suffix: string; label: string; desc: string }
interface TestimonialItem { name: string; role: string; quote: string }
interface BeneficioItem   { label: string; desc: string }

interface HomeMessages {
  hero:         { eyebrow: string; title: string; body: string; cta1: string; cta2: string }
  solutions:    { eyebrow: string; title: string; link: string; empresas: SolucionItem; instalaciones: SolucionItem; hogares: SolucionItem }
  benefits:     { eyebrow: string; title: string; body: string; items: BeneficioItem[] }
  projects:     { title: string; body: string; cta: string }
  stats:        { quote: string; items: StatItem[] }
  founder:      { eyebrow: string; title: string; role: string; name: string; body1: string; quote: string; link: string }
  testimonials: { eyebrow: string; title: string; body: string; items: TestimonialItem[] }
  cta:          { title: string; body: string; primary: string; secondary: string }
}

export function HomeClient({ messages }: { messages: HomeMessages }) {
  usePageReady()

  useGSAPAnimations(() => ({
    critical: [initHeroAnimations],
    raf:      [initStatsCounterAnimations],
    timeout:  [initScrollRevealSections, initMarqueeAnimation, initBlobAnimation],
  }))

  const { hero, solutions, benefits, projects, stats, founder, testimonials, cta } = messages

  return (
    <>
      <HomeHero {...hero} />
      <HomeSoluciones {...solutions} />
      <HomeBeneficios {...benefits} />
      <HomeProyectos {...projects} />
      <ClientsMarquee />
      <HomeStats {...stats} />
      <HomeFounder {...founder} />
      <HomeTestimonials {...testimonials} />
      <CTABanner
        title={cta.title}
        body={cta.body}
        primaryLabel={cta.primary}
        primaryHref="/contacto"
        secondaryLabel={cta.secondary}
        secondaryHref="/contacto"
      />
    </>
  )
}
