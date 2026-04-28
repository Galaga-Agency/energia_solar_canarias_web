'use client'

import dynamic             from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { usePageReady }    from '@/hooks/usePageReady'
import { useGSAPAnimations } from '@/hooks/useGSAPAnimations'
import { SobreNosotrosHero } from '@/components/pages/sobre-nosotros/SobreNosotrosHero'
import { Breadcrumbs }     from '@/components/shared/Breadcrumbs'
import { initHeroAnimations }       from '@/utils/animations/hero-animations'
import { initScrollRevealSections } from '@/utils/animations/scroll-reveal'
import { initBlobAnimation }        from '@/utils/animations/blob'

const SobreNosotrosNarrative   = dynamic(() => import('./SobreNosotrosNarrative').then(m => m.SobreNosotrosNarrative))
const SobreNosotrosBenefits    = dynamic(() => import('./SobreNosotrosBenefits').then(m => m.SobreNosotrosBenefits))
const SobreNosotrosLeadership  = dynamic(() => import('./SobreNosotrosLeadership').then(m => m.SobreNosotrosLeadership))
const SobreNosotrosTestimonial = dynamic(() => import('./SobreNosotrosTestimonial').then(m => m.SobreNosotrosTestimonial), { ssr: false })

export function SobreNosotrosClient() {
  usePageReady()
  const nav = useTranslations('nav')

  useGSAPAnimations(() => ({
    critical: [initHeroAnimations],
    timeout:  [initScrollRevealSections, initBlobAnimation],
  }))

  return (
    <>
      <Breadcrumbs items={[
        { label: nav('home'),  href: '/' },
        { label: nav('about'), href: '/sobre-nosotros' },
      ]} />
      <SobreNosotrosHero />
      <SobreNosotrosNarrative />
      <SobreNosotrosBenefits />
      <SobreNosotrosLeadership />
      <SobreNosotrosTestimonial />
    </>
  )
}
