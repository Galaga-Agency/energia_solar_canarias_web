'use client'

import dynamic             from 'next/dynamic'
import { useEffect }       from 'react'
import { useMarkReady }    from '@/hooks/useAppReady'
import { useGSAPAnimations } from '@/hooks/useGSAPAnimations'
import { ContactoSection } from '@/components/pages/contacto/ContactoSection'
import { FAQ_ITEMS }       from '@/constants/faq.constants'
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
}

export function ContactoClient({ messages }: { messages: ContactoMessages }) {
  const markReady = useMarkReady()

  useEffect(() => {
    document.fonts.ready.then(() => {
      const t = setTimeout(markReady, 600)
      return () => clearTimeout(t)
    })
  }, [markReady])

  useGSAPAnimations(() => ({
    critical: [initHeroAnimations],
    timeout:  [initScrollRevealSections, initFAQAccordion],
  }))

  return (
    <>
      <ContactoSection {...messages.section} />
      <FAQAccordion items={FAQ_ITEMS} />
    </>
  )
}
