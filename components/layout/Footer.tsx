'use client'

import Image from 'next/image'
import { type ElementType } from 'react'
import { useTranslations } from 'next-intl'
import {
  FOOTER_SOCIAL,
  FOOTER_SECCIONES,
  FOOTER_RECURSOS,
  FOOTER_LEGAL,
  FOOTER_BOTTOM_LINKS,
} from '@/constants/footer.constants'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { FaInstagram, FaLinkedin } from '@/components/ui/Icons'

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
  const footerColumns = [
    { title: t('footer.sections.sections'),  links: FOOTER_SECCIONES },
    { title: t('footer.sections.legal'),     links: FOOTER_LEGAL },
    { title: t('footer.sections.resources'), links: FOOTER_RECURSOS },
  ] as const

  return (
    <footer className="relative isolate overflow-hidden bg-[#1f3a34] text-[#f4f1ea]">
      <span aria-hidden className="absolute inset-x-0 top-0 z-10 block h-px bg-primary/70" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[url('/assets/images/common/white-paper-texture.jpg')] bg-cover bg-center bg-fixed opacity-35 mix-blend-multiply"
      />

      <div className="section-inner relative z-10 pt-12 pb-6 md:pt-16 md:pb-8">

        {/* ── Editorial top slab ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-8 border-b border-[#f4f1ea]/15 pb-10 lg:grid lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-8">
            <span className="text-label text-primary! mb-3 block">{t('footer.eyebrow')}</span>
            <h2 className="text-title text-[#f4f1ea]! max-w-[26ch]">
              {t('footer.taglineLead')}{' '}
              <em className="not-italic lg:italic lg:font-normal lg:text-primary">
                {t('footer.taglineEm')}
              </em>{' '}
              {t('footer.taglineTail')}
            </h2>
          </div>

          <div className="lg:col-span-4 lg:justify-self-end lg:text-right">
            <TransitionLink
              href="/contacto"
              className="group inline-flex w-full items-center justify-between gap-3 border border-[#f4f1ea]/25 px-6 py-4 transition-colors hover:border-primary hover:bg-primary lg:w-auto lg:justify-start"
            >
              <span className="text-label text-[#f4f1ea]! transition-colors group-hover:text-[#f4f1ea]">
                {t('footer.cta')}
              </span>
              <span aria-hidden className="font-mono text-base text-[#f4f1ea] transition-transform duration-300 group-hover:translate-x-1">↗</span>
            </TransitionLink>
            <p className="mt-4 text-label text-[#f4f1ea]/55 italic">
              {t('footer.ctaNote')}
            </p>
          </div>
        </div>

        {/* ── Middle: brand block + link columns + newsletter ────────────── */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-10 sm:grid-cols-3 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-8">

          {/* Brand block */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-3">
            <Image
              src="/assets/logos/svg/logo-white.svg"
              alt="Energía Solar Canarias"
              width={64}
              height={64}
              className="h-14 w-auto"
            />

            <div className="mt-6 flex flex-col gap-6 md:mt-7 md:gap-5">
              <div>
                <span className="text-label text-primary! mb-2 block">{t('footer.addressHeader')}</span>
                <address className="not-italic">
                  {ADDRESS_LINES.map((line) => (
                    <p key={line} className="card-content text-[#f4f1ea]/80!">{line}</p>
                  ))}
                </address>
              </div>

              <div>
                <span className="text-label text-primary! mb-2 block">{t('footer.contactHeader')}</span>
                <a
                  href={PHONE_HREF}
                  className="card-content block py-1 text-[#f4f1ea]/80! transition-colors hover:text-primary"
                >
                  {PHONE_LABEL}
                </a>
                <a
                  href={EMAIL_HREF}
                  className="card-content block py-1 text-[#f4f1ea]/80! transition-colors hover:text-primary"
                >
                  {EMAIL_LABEL}
                </a>
              </div>
            </div>
          </div>

          {/* Link columns — direct grid children, responsive spans */}
          {footerColumns.map((column) => (
            <div key={column.title} className="col-span-1 lg:col-span-2">
              <span className="text-label text-primary! mb-3 block">{column.title}</span>
              <ul className="flex flex-col gap-2.5">
                {column.links.map(({ labelKey, href }) => (
                  <li key={labelKey}>
                    <TransitionLink
                      href={href}
                      className="card-content inline-block py-1 text-[#f4f1ea]/80! transition-colors hover:text-primary"
                    >
                      {t(labelKey)}
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-3">
            <span className="text-label text-primary! mb-3 block">{t('footer.links.newsletter')}</span>
            <p className="card-content text-[#f4f1ea]/80! mb-4 max-w-[28ch]">
              {t('footer.newsletter')}
            </p>

            <form
              className="flex flex-col gap-3"
              onSubmit={(event) => event.preventDefault()}
            >
              <label className="block border-b border-[#f4f1ea]/30 pb-3 transition-colors focus-within:border-primary">
                <span className="sr-only">{t('footer.email')}</span>
                <input
                  type="email"
                  placeholder={t('footer.email')}
                  aria-label={t('footer.email')}
                  inputMode="email"
                  autoComplete="email"
                  className="w-full bg-transparent card-content text-[#f4f1ea] placeholder:text-[#f4f1ea]/45 focus:outline-none"
                />
              </label>

              <button
                type="submit"
                className="group inline-flex items-center gap-2 self-start py-2 text-label text-primary! transition-colors hover:text-[#f4f1ea]"
              >
                <span>{t('footer.send')}</span>
                <span aria-hidden className="font-mono text-sm transition-transform duration-300 group-hover:translate-x-1">↗</span>
              </button>
            </form>

            <p className="mt-5 text-sm leading-relaxed text-[#f4f1ea]/55 md:text-xs">
              {t('footer.disclaimer')}
            </p>
          </div>
        </div>

        {/* ── Bottom strip ───────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6 border-t border-[#f4f1ea]/15 pt-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-3">
            <p className="text-sm text-[#f4f1ea]/65 lg:text-xs">
              {t('footer.copyright')}
            </p>
            <span aria-hidden className="hidden h-px w-6 bg-[#f4f1ea]/20 lg:block" />
            <p className="text-sm italic text-[#f4f1ea]/65 lg:text-xs">
              {t('footer.rights')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            {FOOTER_BOTTOM_LINKS.map(({ labelKey, href }) => (
              <TransitionLink
                key={labelKey}
                href={href}
                className="py-1 text-sm text-[#f4f1ea]/75 transition-colors hover:text-primary lg:text-xs"
              >
                {t(labelKey)}
              </TransitionLink>
            ))}
          </div>

          <div className="flex items-center gap-5">
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
                  className="flex h-10 w-10 items-center justify-center text-[#f4f1ea]/80 transition-colors hover:text-primary"
                >
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
