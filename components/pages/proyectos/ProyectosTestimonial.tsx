'use client'

import { useTranslations } from 'next-intl'
import { TestimonialSingle } from '@/components/shared/TestimonialSingle'

export function ProyectosTestimonial() {
  const t = useTranslations('proyectos.testimonial')
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
