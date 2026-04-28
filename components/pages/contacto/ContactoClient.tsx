'use client'

import dynamic             from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { usePageReady }    from '@/hooks/usePageReady'
import { useGSAPAnimations } from '@/hooks/useGSAPAnimations'
import { FAQ_CONTACTO_KEYS } from '@/constants/faq.constants'
import { ContactoSection } from '@/components/pages/contacto/ContactoSection'
import { Breadcrumbs }     from '@/components/shared/Breadcrumbs'
import { initHeroAnimations }       from '@/utils/animations/hero-animations'
import { initScrollRevealSections } from '@/utils/animations/scroll-reveal'
import { initFAQAccordion }         from '@/utils/animations/faq-accordion'

const FAQAccordion = dynamic(() => import('@/components/shared/FAQAccordion').then(m => m.FAQAccordion), { ssr: false })

export function ContactoClient() {
  usePageReady()
  const nav = useTranslations('nav')
  const t   = useTranslations('contacto')

  useGSAPAnimations(() => ({
    critical: [initHeroAnimations],
    timeout:  [initScrollRevealSections, initFAQAccordion],
  }))

  return (
    <>
      <Breadcrumbs items={[
        { label: nav('home'),    href: '/' },
        { label: nav('contact'), href: '/contacto' },
      ]} />
      <ContactoSection />
      <FAQAccordion
        label={t('faq.label')}
        items={FAQ_CONTACTO_KEYS.map(key => ({
          question: t(`faq.items.${key}.question`),
          answer:   t(`faq.items.${key}.answer`),
        }))}
      />
    </>
  )
}
