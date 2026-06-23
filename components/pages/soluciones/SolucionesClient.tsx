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
import { initFAQAccordion }          from '@/utils/animations/faq-accordion'

const SolucionesContexto     = dynamic(() => import('./SolucionesContexto').then(m => m.SolucionesContexto))
const SolucionesSectores     = dynamic(() => import('./SolucionesSectores').then(m => m.SolucionesSectores))
const SolucionesArquitectura = dynamic(() => import('./SolucionesArquitectura').then(m => m.SolucionesArquitectura))
const SolucionesPilares      = dynamic(() => import('./SolucionesPilares').then(m => m.SolucionesPilares))
const SolucionesProceso      = dynamic(() => import('./SolucionesProceso').then(m => m.SolucionesProceso))
const SolucionesGuarantees   = dynamic(() => import('./SolucionesGuarantees').then(m => m.SolucionesGuarantees))
const SolucionesPromesa      = dynamic(() => import('./SolucionesPromesa').then(m => m.SolucionesPromesa))
const SolucionesFAQ          = dynamic(() => import('./SolucionesFAQ').then(m => m.SolucionesFAQ), { ssr: false })
const SolucionesCTA          = dynamic(() => import('./SolucionesCTA').then(m => m.SolucionesCTA), { ssr: false })
const ClientsMarquee         = dynamic(() => import('@/components/shared/ClientsMarquee').then(m => m.ClientsMarquee), { ssr: false })

export function SolucionesClient() {
  usePageReady()
  const nav = useTranslations('nav')
  const t   = useTranslations('soluciones')

  useGSAPAnimations(() => ({
    critical: [initHeroAnimations],
    raf:      [initDrawArrowAnimation],
    timeout:  [initScrollRevealSections, initFAQAccordion],
  }))

  return (
    <>
      <Breadcrumbs items={[
        { label: nav('home'),      href: '/' },
        { label: nav('solutions'), href: '/soluciones' },
      ]} />
      <SolucionesHero />
      <SolucionesContexto />
      <SolucionesSectores />
      <SolucionesArquitectura />
      <SolucionesPilares />
      <SolucionesProceso />
      <SolucionesGuarantees />
      <SolucionesPromesa />
      <ClientsMarquee />
      <SolucionesFAQ
        label={t('faq.label')}
        items={FAQ_SOLUCIONES_KEYS.map(key => ({
          question: t(`faq.items.${key}.question`),
          answer:   t(`faq.items.${key}.answer`),
        }))}
      />
      <SolucionesCTA />
    </>
  )
}
