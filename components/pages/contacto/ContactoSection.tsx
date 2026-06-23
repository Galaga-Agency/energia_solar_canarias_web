'use client'

import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { ContactForm } from '@/components/forms/ContactForm'
import { CONTACT_INFO } from '@/constants/contact.constants'
import { HiMail, HiLocationMarker, HiClock } from '@/components/ui/Icons'
import { AnimatedBrandBlob } from '@/components/ui/AnimatedBrandBlob'
import { splitTail } from '@/utils/text'

const ContactMap = dynamic(() => import('@/components/pages/contacto/ContactMap').then(m => m.ContactMap), { ssr: false })

export function ContactoSection() {
  const t  = useTranslations('contacto.section')
  const tt = splitTail(t('title'))

  return (
    <>
      {/* Form-first — compact intro, then form (left) + contact info (right) */}
      <section
        data-hero
        className="relative isolate overflow-hidden bg-(--color-bg) pt-[clamp(7rem,13vw,10rem)] pb-[clamp(4rem,8vw,7rem)]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 mix-blend-multiply opacity-25 bg-[url('/assets/images/common/white-paper-texture.jpg')] bg-cover bg-center bg-fixed"
        />
        <AnimatedBrandBlob className="pointer-events-none absolute -right-[10%] top-[10%] z-0 h-auto w-[55%] opacity-30 md:-right-[2%] md:w-[30%] lg:w-[24%]" />

        {/* Big editorial header */}
        <div className="section-inner relative z-10 mb-16 max-w-[20ch] md:mb-24">
          <span data-hero-item className="text-label text-primary! mb-5 block">{t('eyebrow')}</span>
          <h1 data-hero-item className="text-display">
            {tt.lead}{' '}
            <em className="not-italic md:italic md:font-normal md:text-primary">{tt.tail}</em>
          </h1>
          <p data-hero-item className="mt-6 max-w-[46ch] text-body text-ink/68!">{t('body')}</p>
        </div>

        <div className="section-inner relative z-10 grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Form column */}
          <div data-hero-item className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* Info column — phone is the focal "call us" moment */}
          <aside data-hero-item className="lg:col-span-5 lg:pl-10 lg:border-l lg:border-ink/12">
            <span className="text-label text-primary! mb-3 block">{t('callLabel')}</span>
            <a
              href={`tel:${CONTACT_INFO.phone}`}
              className="text-title text-ink! block transition-colors hover:text-primary!"
            >
              {CONTACT_INFO.phone}
            </a>

            <ul className="mt-10 flex flex-col gap-6 border-t border-ink/12 pt-10">
              <li className="flex items-start gap-4">
                <HiMail aria-hidden className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-body text-ink/80! transition-colors hover:text-primary! break-all">
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-4">
                <HiLocationMarker aria-hidden className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <p className="text-body text-ink/80!">{CONTACT_INFO.address}</p>
              </li>
              <li className="flex items-start gap-4">
                <HiClock aria-hidden className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div className="text-body text-ink/80!">
                  <p>{CONTACT_INFO.hours.weekdays}</p>
                  <p>{CONTACT_INFO.hours.friday}</p>
                </div>
              </li>
            </ul>
          </aside>
        </div>
      </section>

      {/* Full-width map band — self-contained component */}
      <ContactMap />
    </>
  )
}
