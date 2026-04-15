'use client'

import dynamic             from 'next/dynamic'
import { usePageReady }    from '@/hooks/usePageReady'
import { useGSAPAnimations } from '@/hooks/useGSAPAnimations'
import { useTranslation }  from '@/contexts/TranslationContext'
import { FAQ_CONTACTO_KEYS } from '@/constants/faq.constants'
import { ContactoSection } from '@/components/pages/contacto/ContactoSection'
import { Breadcrumbs }     from '@/components/shared/Breadcrumbs'
import { initHeroAnimations }       from '@/utils/animations/hero-animations'
import { initScrollRevealSections } from '@/utils/animations/scroll-reveal'
import { initFAQAccordion }         from '@/utils/animations/faq-accordion'

const FAQAccordion = dynamic(() => import('@/components/shared/FAQAccordion').then(m => m.FAQAccordion), { ssr: false })

interface ContactoMessages {
  section: {
    title: string
    body: string
    emphasis: string
    officeTitle: string
    officeBody: string
  }
  faq: { label: string }
}

export function ContactoClient({ messages }: { messages: ContactoMessages }) {
  usePageReady()
  const { t } = useTranslation()

  useGSAPAnimations(() => ({
    critical: [initHeroAnimations],
    timeout:  [initScrollRevealSections, initFAQAccordion],
  }))

  return (
    <>
      <Breadcrumbs items={[
        { label: t('nav.home'),    href: '/' },
        { label: t('nav.contact'), href: '/contacto' },
      ]} />
      <ContactoSection {...messages.section} />
      <FAQAccordion
        label={messages.faq.label}
        items={FAQ_CONTACTO_KEYS.map(key => ({
          question: t(`faq.items.${key}.question`),
          answer:   t(`faq.items.${key}.answer`),
        }))}
      />
    </>
  )
}
