'use client'

import dynamic             from 'next/dynamic'
import { useEffect }       from 'react'
import { useMarkReady }    from '@/hooks/useAppReady'
import { useGSAPAnimations } from '@/hooks/useGSAPAnimations'
import { SolucionesHero }  from '@/components/pages/soluciones/SolucionesHero'
import { FAQ_ITEMS }       from '@/constants/faq.constants'
import { initHeroAnimations }        from '@/utils/animations/hero-animations'
import { initDrawArrowAnimation }    from '@/utils/animations/draw-arrow'
import { initScrollRevealSections }  from '@/utils/animations/scroll-reveal'
import { initProcessStepsAnimation } from '@/utils/animations/process-steps'
import { initFAQAccordion }          from '@/utils/animations/faq-accordion'

const SolucionesPainPoints     = dynamic(() => import('./SolucionesPainPoints').then(m => m.SolucionesPainPoints))
const SolucionesQuote          = dynamic(() => import('./SolucionesQuote').then(m => m.SolucionesQuote))
const SolucionesDifferentiator = dynamic(() => import('./SolucionesDifferentiator').then(m => m.SolucionesDifferentiator))
const SolucionesProcess        = dynamic(() => import('./SolucionesProcess').then(m => m.SolucionesProcess))
const SolucionesGuarantees     = dynamic(() => import('./SolucionesGuarantees').then(m => m.SolucionesGuarantees))
const ClientsMarquee           = dynamic(() => import('@/components/shared/ClientsMarquee').then(m => m.ClientsMarquee), { ssr: false })
const FAQAccordion             = dynamic(() => import('@/components/shared/FAQAccordion').then(m => m.FAQAccordion), { ssr: false })
const CTABanner                = dynamic(() => import('@/components/shared/CTABanner').then(m => m.CTABanner), { ssr: false })

interface SolucionesMessages {
  hero: {
    eyebrow: string
    title: string
    body: string
    items: { label: string; title: string; body: string }[]
  }
  painPoints: { eyebrow: string; title: string; body: string; tags: string[]; cta: string }
  quote: { eyebrow: string; quote: string; body: string }
  differentiator: {
    titleStart: string
    titleBrand: string
    titleEnd: string
    body: string
    primary: string
    secondary: string
  }
  process: { title: string; body: string; items: { n: string; title: string; body: string }[] }
  guarantees: { items: { title: string; body: string }[] }
  cta: { title: string; body: string; primary: string; secondary: string }
}

export function SolucionesClient({ messages }: { messages: SolucionesMessages }) {
  const markReady = useMarkReady()

  useEffect(() => {
    document.fonts.ready.then(() => {
      const t = setTimeout(markReady, 600)
      return () => clearTimeout(t)
    })
  }, [markReady])

  useGSAPAnimations(() => ({
    critical: [initHeroAnimations],
    raf:      [initDrawArrowAnimation],
    timeout:  [initScrollRevealSections, initProcessStepsAnimation, initFAQAccordion],
  }))

  return (
    <>
      <SolucionesHero {...messages.hero} />
      <SolucionesPainPoints {...messages.painPoints} />
      <SolucionesQuote {...messages.quote} />
      <SolucionesDifferentiator {...messages.differentiator} />
      <SolucionesProcess {...messages.process} />
      <SolucionesGuarantees {...messages.guarantees} />
      <ClientsMarquee />
      <FAQAccordion items={FAQ_ITEMS} />
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
