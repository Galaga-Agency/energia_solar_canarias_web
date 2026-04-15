'use client'

import dynamic             from 'next/dynamic'
import { usePageReady }    from '@/hooks/usePageReady'
import { useGSAPAnimations } from '@/hooks/useGSAPAnimations'
import { useTranslation }  from '@/contexts/TranslationContext'
import { FAQ_SOLUCIONES_KEYS } from '@/constants/faq.constants'
import { SolucionesHero }  from '@/components/pages/soluciones/SolucionesHero'
import { Breadcrumbs }     from '@/components/shared/Breadcrumbs'
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
  faq: { label: string }
}

export function SolucionesClient({ messages }: { messages: SolucionesMessages }) {
  usePageReady()
  const { t } = useTranslation()

  useGSAPAnimations(() => ({
    critical: [initHeroAnimations],
    raf:      [initDrawArrowAnimation],
    timeout:  [initScrollRevealSections, initProcessStepsAnimation, initFAQAccordion],
  }))

  return (
    <>
      <Breadcrumbs items={[
        { label: t('nav.home'),      href: '/' },
        { label: t('nav.solutions'), href: '/soluciones' },
      ]} />
      <SolucionesHero {...messages.hero} />
      <SolucionesPainPoints {...messages.painPoints} />
      <SolucionesQuote {...messages.quote} />
      <SolucionesDifferentiator {...messages.differentiator} />
      <SolucionesProcess {...messages.process} />
      <SolucionesGuarantees {...messages.guarantees} />
      <ClientsMarquee />
      <FAQAccordion
        label={messages.faq.label}
        items={FAQ_SOLUCIONES_KEYS.map(key => ({
          question: t(`faq.items.${key}.question`),
          answer:   t(`faq.items.${key}.answer`),
        }))}
      />
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
