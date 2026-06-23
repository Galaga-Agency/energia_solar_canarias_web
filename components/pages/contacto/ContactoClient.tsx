'use client'

import { useTranslations } from 'next-intl'
import { usePageReady }    from '@/hooks/usePageReady'
import { useGSAPAnimations } from '@/hooks/useGSAPAnimations'
import { ContactoSection } from '@/components/pages/contacto/ContactoSection'
import { Breadcrumbs }     from '@/components/shared/Breadcrumbs'
import { initHeroAnimations }       from '@/utils/animations/hero-animations'
import { initScrollRevealSections } from '@/utils/animations/scroll-reveal'

export function ContactoClient() {
  usePageReady()
  const nav = useTranslations('nav')

  useGSAPAnimations(() => ({
    critical: [initHeroAnimations],
    timeout:  [initScrollRevealSections],
  }))

  return (
    <>
      <Breadcrumbs items={[
        { label: nav('home'),    href: '/' },
        { label: nav('contact'), href: '/contacto' },
      ]} />
      <ContactoSection />
    </>
  )
}
