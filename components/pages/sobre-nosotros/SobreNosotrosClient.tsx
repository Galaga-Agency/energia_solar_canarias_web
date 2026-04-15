'use client'

import dynamic             from 'next/dynamic'
import { usePageReady }    from '@/hooks/usePageReady'
import { useGSAPAnimations } from '@/hooks/useGSAPAnimations'
import { useTranslation }  from '@/contexts/TranslationContext'
import { SobreNosotrosHero } from '@/components/pages/sobre-nosotros/SobreNosotrosHero'
import { Breadcrumbs }     from '@/components/shared/Breadcrumbs'
import { initHeroAnimations }       from '@/utils/animations/hero-animations'
import { initScrollRevealSections } from '@/utils/animations/scroll-reveal'
import { initBlobAnimation }        from '@/utils/animations/blob'

const SobreNosotrosNarrative  = dynamic(() => import('./SobreNosotrosNarrative').then(m => m.SobreNosotrosNarrative))
const SobreNosotrosBenefits   = dynamic(() => import('./SobreNosotrosBenefits').then(m => m.SobreNosotrosBenefits))
const SobreNosotrosLeadership = dynamic(() => import('./SobreNosotrosLeadership').then(m => m.SobreNosotrosLeadership))
const TestimonialSingle       = dynamic(() => import('@/components/shared/TestimonialSingle').then(m => m.TestimonialSingle), { ssr: false })

interface SobreNosotrosMessages {
  hero: { title: string; body: string }
  narrative: { title: string; paragraphs: string[] }
  benefits: {
    eyebrow: string
    title: string
    body: string
    items: { title: string; body: string }[]
    cardTitle: string
    cardBody: string
    cta: string
  }
  leadership: { eyebrow: string; title: string; quote: string; body: string; link: string }
  testimonial: { quote: string; name: string; role: string; companyLogo: string; avatar: string }
}

export function SobreNosotrosClient({ messages }: { messages: SobreNosotrosMessages }) {
  usePageReady()
  const { t } = useTranslation()

  useGSAPAnimations(() => ({
    critical: [initHeroAnimations],
    timeout:  [initScrollRevealSections, initBlobAnimation],
  }))

  return (
    <>
      <Breadcrumbs items={[
        { label: t('nav.home'),  href: '/' },
        { label: t('nav.about'), href: '/sobre-nosotros' },
      ]} />
      <SobreNosotrosHero {...messages.hero} />
      <SobreNosotrosNarrative {...messages.narrative} />
      <SobreNosotrosBenefits {...messages.benefits} />
      <SobreNosotrosLeadership {...messages.leadership} />
      <TestimonialSingle {...messages.testimonial} />
    </>
  )
}
