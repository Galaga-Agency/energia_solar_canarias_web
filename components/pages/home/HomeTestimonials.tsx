'use client'

import { useTranslations } from 'next-intl'
import { TestimonialsSlider, type TestimonialItem } from '@/components/shared/TestimonialsSlider'

export function HomeTestimonials() {
  const t     = useTranslations('home.testimonials')
  const items = t.raw('items') as TestimonialItem[]

  return (
    <section className="section-spacing overflow-hidden" data-testimonials-section>
      <div className="section-inner mb-12" data-reveal>
        <div className="max-w-lg">
          <h2 className="text-title mb-4">{t('title')}</h2>
          <p className="text-body">{t('body')}</p>
        </div>
      </div>
      <TestimonialsSlider items={items} />
    </section>
  )
}
