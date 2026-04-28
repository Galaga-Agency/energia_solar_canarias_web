'use client'

import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { ContactForm } from '@/components/forms/ContactForm'
import { CONTACT_INFO } from '@/constants/contact.constants'
import { HiPhone, HiMail, HiLocationMarker, HiClock } from '@/components/ui/Icons'

const MapEmbed = dynamic(() => import('@/components/ui/MapEmbed').then(m => m.MapEmbed), { ssr: false })

export function ContactoSection() {
  const t = useTranslations('contacto.section')

  return (
    <section data-hero className="section-spacing-both" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="section-inner">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div data-hero-item>
            <h2 className="text-heading mb-4">{t('title')}</h2>
            <p className="text-body mb-4">{t('body')}</p>
            <p className="text-body" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
              {t('emphasis')}
            </p>
          </div>

          <div data-hero-item>
            <ContactForm />
          </div>

          <div data-hero-item className="flex flex-col gap-5">
            <h3 className="text-subheading">{t('officeTitle')}</h3>
            <p className="text-body">{t('officeBody')}</p>
            <div className="flex gap-3 items-start">
              <HiClock aria-hidden="true" className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
              <div>
                <p className="text-body-sm">{CONTACT_INFO.hours.weekdays}</p>
                <p className="text-body-sm">{CONTACT_INFO.hours.friday}</p>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <HiPhone aria-hidden="true" className="w-5 h-5 shrink-0" style={{ color: 'var(--color-primary)' }} />
              <a href={`tel:${CONTACT_INFO.phone}`} className="text-body-sm">{CONTACT_INFO.phone}</a>
            </div>
            <div className="flex gap-3 items-center">
              <HiMail aria-hidden="true" className="w-5 h-5 shrink-0" style={{ color: 'var(--color-primary)' }} />
              <a href={`mailto:${CONTACT_INFO.email}`} className="text-body-sm">{CONTACT_INFO.email}</a>
            </div>
            <div className="flex gap-3 items-start">
              <HiLocationMarker aria-hidden="true" className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
              <p className="text-body-sm">{CONTACT_INFO.address}</p>
            </div>
          </div>

          <div data-hero-item>
            <MapEmbed />
          </div>
        </div>
      </div>
    </section>
  )
}
