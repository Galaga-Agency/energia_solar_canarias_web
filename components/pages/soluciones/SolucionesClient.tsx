'use client'

import dynamic             from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { usePageReady }    from '@/hooks/usePageReady'
import { useGSAPAnimations } from '@/hooks/useGSAPAnimations'
import { FAQ_SOLUCIONES_KEYS } from '@/constants/faq.constants'
import { SolucionesHero }  from '@/components/pages/soluciones/SolucionesHero'
import { Breadcrumbs }     from '@/components/shared/Breadcrumbs'
import { PaperTexture }    from '@/components/ui/PaperTexture'
import { initHeroAnimations }        from '@/utils/animations/hero-animations'
import { initDrawArrowAnimation }    from '@/utils/animations/draw-arrow'
import { initScrollRevealSections }  from '@/utils/animations/scroll-reveal'
import { initFAQAccordion }          from '@/utils/animations/faq-accordion'
import { initContextoReveal }        from '@/utils/animations/contexto-reveal'
import { initSolucionesReveal }      from '@/utils/animations/soluciones-reveal'
import { initSolucionCardsAnimation } from '@/utils/animations/solucion-cards'
import { initCtaRevealAnimation }    from '@/utils/animations/cta-reveal'

const SolucionesContexto     = dynamic(() => import('./SolucionesContexto').then(m => m.SolucionesContexto))
const SolucionesSectores     = dynamic(() => import('./SolucionesSectores').then(m => m.SolucionesSectores))
const SolucionesArquitectura = dynamic(() => import('./SolucionesArquitectura').then(m => m.SolucionesArquitectura))
const SolucionesProceso      = dynamic(() => import('./SolucionesProceso').then(m => m.SolucionesProceso))
const SolucionesPilares      = dynamic(() => import('./SolucionesPilares').then(m => m.SolucionesPilares))
const SolucionesFAQ          = dynamic(() => import('./SolucionesFAQ').then(m => m.SolucionesFAQ), { ssr: false })
const SolucionesCTA          = dynamic(() => import('./SolucionesCTA').then(m => m.SolucionesCTA), { ssr: false })
const ClientsMarquee         = dynamic(() => import('@/components/shared/ClientsMarquee').then(m => m.ClientsMarquee), { ssr: false })
const MouseReactiveFlock     = dynamic(() => import('@/components/shared/MouseReactiveFlock').then(m => m.MouseReactiveFlock), { ssr: false })

export function SolucionesClient() {
  usePageReady()
  const nav = useTranslations('nav')
  const t   = useTranslations('soluciones')

  useGSAPAnimations(() => ({
    critical: [initHeroAnimations],
    raf:      [initDrawArrowAnimation],
    timeout:  [initScrollRevealSections, initFAQAccordion, initContextoReveal, initSolucionesReveal, initSolucionCardsAnimation, initCtaRevealAnimation],
  }))

  return (
    <>
      <Breadcrumbs items={[
        { label: nav('home'),      href: '/' },
        { label: nav('solutions'), href: '/soluciones' },
      ]} />

      {/* Hero (cream + texture, no flock) */}
      <div className="relative isolate overflow-hidden bg-[#f4f1ea]">
        <PaperTexture className="z-0" />
        <SolucionesHero />
      </div>

      <SolucionesContexto />

      {/* Cream group — Sectores */}
      <div className="relative isolate overflow-hidden bg-[#f4f1ea]">
        <PaperTexture className="z-0" />
        <MouseReactiveFlock className="pointer-events-none absolute inset-0 z-0 h-full w-full" birds={35} />
        <SolucionesSectores />
      </div>

      <SolucionesArquitectura />

      {/* Cream group — Proceso + Pilares + FAQ */}
      <div className="relative isolate overflow-hidden bg-[#f4f1ea]">
        <PaperTexture className="z-0" />
        <MouseReactiveFlock className="pointer-events-none absolute inset-0 z-0 h-full w-full" birds={45} />
        <SolucionesProceso />
        <SolucionesPilares />
        <SolucionesFAQ
          label={t('faq.label')}
          items={FAQ_SOLUCIONES_KEYS.map(key => ({
            question: t(`faq.items.${key}.question`),
            answer:   t(`faq.items.${key}.answer`),
          }))}
        />
      </div>

      <SolucionesCTA />
    </>
  )
}
