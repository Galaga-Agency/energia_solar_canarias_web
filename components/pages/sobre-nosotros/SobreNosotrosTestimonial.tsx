'use client'

import { useTranslations } from 'next-intl'
import { TestimonialSingle } from '@/components/shared/TestimonialSingle'

export function SobreNosotrosTestimonial() {
  const t = useTranslations('sobre-nosotros.testimonial')
  return (
    <TestimonialSingle
      quote={t('quote')}
      name={t('name')}
      role={t('role')}
      companyLogo={t('companyLogo')}
      avatar={t('avatar')}
    />
  )
}
