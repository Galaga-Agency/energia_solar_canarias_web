'use client'

import dynamic            from 'next/dynamic'
import { usePageReady }   from '@/hooks/usePageReady'
import { useGSAPAnimations } from '@/hooks/useGSAPAnimations'
import { HomeHero }       from '@/components/pages/home/HomeHero'
import { initParallax }               from '@/utils/animations/parallax'
import { initHeroAnimations }         from '@/utils/animations/hero-animations'
import { initStatsCounterAnimations } from '@/utils/animations/stats-counter'
import { initScrollRevealSections }   from '@/utils/animations/scroll-reveal'
import { initMarqueeAnimation }       from '@/utils/animations/marquee'
import { initBlobAnimation }          from '@/utils/animations/blob'
import { initScrollMarqueeAnimation } from '@/utils/animations/scroll-marquee'
import { initPanelStackAnimation }      from '@/utils/animations/panel-stack'
import { initBirdFlockAnimation }       from '@/utils/animations/bird-flock'
import { Marquee }                    from '@/components/shared/Marquee'
import { AnimatedBirdFlock }          from '@/components/shared/AnimatedBirdFlock'

const HomeSoluciones   = dynamic(() => import('./HomeSoluciones').then(m => m.HomeSoluciones))
const HomeBeneficios   = dynamic(() => import('./HomeBeneficios').then(m => m.HomeBeneficios))
const HomeProyectos    = dynamic(() => import('./HomeProyectos').then(m => m.HomeProyectos))
const HomeStats        = dynamic(() => import('./HomeStats').then(m => m.HomeStats))
const HomeFounder      = dynamic(() => import('./HomeFounder').then(m => m.HomeFounder))
const HomeTestimonials = dynamic(() => import('./HomeTestimonials').then(m => m.HomeTestimonials))
const CTABanner        = dynamic(() => import('@/components/shared/CTABanner').then(m => m.CTABanner), { ssr: false })
const PerfMonitor      = process.env.NODE_ENV === 'development'
  ? dynamic(() => import('@/components/dev/PerfMonitor'), { ssr: false })
  : null

interface SolucionItem { label: string; title: string; desc: string }
interface StatItem     { value: string; suffix: string; label: string; desc: string }
interface TestimonialItem { name: string; role: string; quote: string }
interface BeneficioItem   { label: string; desc: string }

interface HomeMessages {
  hero:         { eyebrow: string; title: string; body: string; cta1: string; cta2: string }
  solutions:    { eyebrow: string; title: string; body: string; cta: string; link: string; empresas: SolucionItem; instalaciones: SolucionItem; hogares: SolucionItem }
  benefits:     { eyebrow: string; title: string; body: string; items: BeneficioItem[] }
  projects:     { title: string; body: string; cta: string }
  stats:        { eyebrow: string; quote: string; items: StatItem[] }
  founder:      { eyebrow: string; title: string; role: string; name: string; body1: string; quote: string; link: string }
  testimonials: { eyebrow: string; title: string; body: string; items: TestimonialItem[] }
  cta:          { title: string; body: string; primary: string; secondary: string }
}

const HOMEPAGE_MARQUEE_ITEMS = [
  'Energía solar en Canarias',
  'Instalaciones certificadas',
  'Ahorra en tu factura',
  'Sistemas fotovoltaicos',
  'Autoconsumo inteligente',
  'Soluciones industriales',
  'Retorno garantizado',
  'Ingeniería local',
]

const initHomePanelStackAnimation = () =>
  initPanelStackAnimation({
    triggerSelector: '[data-home-panel-pin]',
    endTriggerSelector: '[data-home-panel-end]',
    triggerId: 'home-panel-stack',
    start: 'bottom bottom',
  })

export function HomeClient({ messages }: { messages: HomeMessages }) {
  usePageReady()

  useGSAPAnimations(() => ({
    critical: [initHeroAnimations, initParallax],
    raf:      [initStatsCounterAnimations],
    timeout:  [initScrollRevealSections, initMarqueeAnimation, initBlobAnimation, initScrollMarqueeAnimation, initHomePanelStackAnimation, initBirdFlockAnimation],
  }))

  const { hero, solutions, benefits, projects, stats, founder, testimonials, cta } = messages

  return (
    <>
      <HomeHero {...hero} />
      <div className="relative isolate z-0 overflow-visible" data-home-panel-stack>
        <HomeSoluciones {...solutions} />
        <div className="relative z-10">
          <Marquee items={HOMEPAGE_MARQUEE_ITEMS} />
        </div>
        <div className="home-bird-flock-stage panel-surface relative overflow-hidden" data-bird-flock-stage>
          <AnimatedBirdFlock className="home-bird-flock-backdrop" />
          <div className="relative z-10">
            <HomeBeneficios {...benefits} />
            <HomeProyectos {...projects} marqueeItems={HOMEPAGE_MARQUEE_ITEMS} />
          </div>
        </div>
      </div>
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
      {/* {PerfMonitor && <PerfMonitor />} */}
    </>
  )
}
