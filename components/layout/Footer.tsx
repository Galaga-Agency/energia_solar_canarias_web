'use client'

import Image from 'next/image'
import { type ElementType } from 'react'
import { useTranslations } from 'next-intl'
import { FOOTER_SOCIAL, FOOTER_NAV, FOOTER_LEGAL } from '@/constants/footer.constants'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { FaInstagram, FaLinkedin } from '@/components/ui/Icons'
import { PaperTexture } from '@/components/ui/PaperTexture'

const socialIconMap: Record<string, ElementType> = {
  FaInstagram,
  FaLinkedin,
}

const ADDRESS_LINES = ['C. las Mimosas, 65', '35118 Agüimes — Las Palmas']
const PHONE_LABEL   = '+34 623 57 47 50'
const PHONE_HREF    = 'tel:+34623574750'
const EMAIL_LABEL   = 'info@energiasolarcanarias.es'
const EMAIL_HREF    = 'mailto:info@energiasolarcanarias.es'

export function Footer() {
  const t = useTranslations()

  return (
    <footer className="relative isolate overflow-hidden bg-[#1f3a34] text-[#f4f1ea]">
      <span aria-hidden className="absolute inset-x-0 top-0 z-10 block h-px bg-primary/70" />
      <PaperTexture className="z-0" opacityClassName="opacity-35" />

      <div className="section-inner relative z-10 pt-14 pb-8 md:pt-20">

        {/* ── Statement + CTA ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-10 pb-14 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div>
            <span className="text-label text-primary! mb-5 block">{t('footer.eyebrow')}</span>
            <h2 className="text-title text-[#f4f1ea]! max-w-[20ch]">
              {t('footer.taglineLead')}{' '}
              <em className="italic font-normal text-primary">{t('footer.taglineEm')}</em>{' '}
              {t('footer.taglineTail')}
            </h2>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-4 lg:items-end lg:text-right">
            <TransitionLink
              href="/contacto"
              className="group inline-flex items-center gap-5 bg-primary px-9 py-5 transition-colors hover:bg-primary-hover"
            >
              <span className="text-label text-[#f4f1ea]!">{t('footer.cta')}</span>
              <span aria-hidden className="font-mono text-lg text-[#f4f1ea] transition-transform duration-300 group-hover:translate-x-1">↗</span>
            </TransitionLink>
            <p className="text-label text-[#f4f1ea]/55! italic max-w-[26ch]">{t('footer.ctaNote')}</p>
          </div>
        </div>

        {/* ── Info: three columns, spread edge-to-edge ───────────────────── */}
        <div className="flex flex-col gap-12 border-t border-[#f4f1ea]/15 py-14 md:flex-row md:justify-between md:gap-16">

          {/* Brand + contact */}
          <div className="flex flex-col">
            <Image
              src="/assets/logos/svg/logo-horizontal-orange.svg"
              alt="Energía Solar Canarias"
              width={341}
              height={125}
              className="h-24 w-auto self-start -mt-6"
            />
            <address className="mt-7 flex flex-col gap-1 not-italic">
              <span className="card-content text-[#f4f1ea]/60!">{ADDRESS_LINES.join(', ')}</span>
              <a href={PHONE_HREF} className="card-content mt-2 w-fit text-[#f4f1ea]! transition-colors hover:text-primary">{PHONE_LABEL}</a>
              <a href={EMAIL_HREF} className="card-content w-fit text-[#f4f1ea]! transition-colors hover:text-primary">{EMAIL_LABEL}</a>
            </address>
            <div className="mt-7 flex items-center gap-3">
              {FOOTER_SOCIAL.map(({ label, href, icon }) => {
                const Icon = socialIconMap[icon]
                if (!Icon) return null
                return (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center border border-[#f4f1ea]/20 text-[#f4f1ea]/80 transition-colors hover:border-primary hover:bg-primary hover:text-[#f4f1ea]"
                  >
                    <Icon aria-hidden="true" className="h-[1.1rem] w-[1.1rem]" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label={t('footer.sections.sitemap')} className="flex flex-col">
            <span className="text-label text-primary! mb-5 block">{t('footer.sections.sitemap')}</span>
            <ul className="flex flex-col gap-3">
              {FOOTER_NAV.map(({ labelKey, href }) => (
                <li key={href}>
                  <TransitionLink href={href} className="card-content w-fit text-[#f4f1ea]/80! transition-colors hover:text-primary">
                    {t(labelKey)}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Award */}
          <div className="flex flex-col">
            <span className="text-label text-primary! mb-5 block">{t('footer.awardHeader')}</span>
            <Image
              src="/assets/images/common/eupd-installer-award-2026.png"
              alt="EUPD Research — Instalador Excelente España 2026"
              width={1139}
              height={1392}
              className="h-24 w-auto max-w-[5rem] shrink-0 self-start object-contain"
            />
            <span className="card-content mt-4 text-[#f4f1ea]/60! max-w-[24ch]">{t('footer.awardText')}</span>
          </div>
        </div>

        {/* ── Bottom bar: copyright + legal (once) ───────────────────────── */}
        <div className="flex flex-col gap-4 border-t border-[#f4f1ea]/15 pt-7 lg:flex-row lg:items-center lg:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#f4f1ea]/50">
            {t('footer.copyright')}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {FOOTER_LEGAL.map(({ labelKey, href }) => (
              <TransitionLink
                key={href}
                href={href}
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#f4f1ea]/55 transition-colors hover:text-primary"
              >
                {t(labelKey)}
              </TransitionLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
