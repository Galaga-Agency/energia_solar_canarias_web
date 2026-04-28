'use client'

import dynamic             from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { usePageReady }    from '@/hooks/usePageReady'
import { useGSAPAnimations } from '@/hooks/useGSAPAnimations'
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

export function SolucionesClient() {
  usePageReady()
  const nav = useTranslations('nav')
  const t   = useTranslations('soluciones')

  useGSAPAnimations(() => ({
    critical: [initHeroAnimations],
    raf:      [initDrawArrowAnimation],
    timeout:  [initScrollRevealSections, initProcessStepsAnimation, initFAQAccordion],
  }))

  return (
    <>
      <Breadcrumbs items={[
        { label: nav('home'),      href: '/' },
        { label: nav('solutions'), href: '/soluciones' },
      ]} />
      <SolucionesHero />
      <SolucionesPainPoints />
      <SolucionesQuote />
      <SolucionesDifferentiator />
      <SolucionesProcess />
      <SolucionesGuarantees />
      <ClientsMarquee />
      <FAQAccordion
        label={t('faq.label')}
        items={FAQ_SOLUCIONES_KEYS.map(key => ({
          question: t(`faq.items.${key}.question`),
          answer:   t(`faq.items.${key}.answer`),
        }))}
      />
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
