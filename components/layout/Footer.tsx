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
import { AnimatedBirdFlock } from '@/components/shared/AnimatedBirdFlock'
import { FaInstagram, FaLinkedin } from '@/components/ui/Icons'

const socialIconMap: Record<string, ElementType> = {
  FaInstagram,
  FaLinkedin,
}

export function Footer() {
  const t = useTranslations()
  const footerColumns = [
    { title: t('footer.sections.sections'), links: FOOTER_SECCIONES },
    { title: t('footer.sections.resources'), links: FOOTER_RECURSOS },
    { title: t('footer.sections.legal'), links: FOOTER_LEGAL },
  ] as const

  return (
    <footer
      className="relative isolate overflow-hidden bg-surface-dark text-white"
      data-footer-bird-flock-stage
      data-bird-flock-stage
    >
      <AnimatedBirdFlock className="absolute inset-0 h-full w-full opacity-100" />

      <div className="section-inner section-spacing-both relative z-10 pt-16 pb-10 md:pt-20 md:pb-12">
        <div className="grid gap-12 border-b border-white/18 pb-14 md:grid-cols-[120px_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(280px,1.35fr)] md:gap-x-8 lg:gap-x-14">
          <div className="pt-1">
            <Image
              src="/assets/logos/svg/logo-white.svg"
              alt="Energía Solar Canarias"
              width={72}
              height={72}
              className="h-[72px] w-[72px]"
            />
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="mb-6 text-base font-semibold leading-tight text-white">{column.title}</p>
              <ul className="flex flex-col gap-4">
                {column.links.map(({ labelKey, href }) => (
                  <li key={labelKey}>
                    <TransitionLink
                      href={href}
                      className="text-base leading-tight text-white transition-colors hover:text-white/80"
                    >
                      {t(labelKey)}
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="max-w-[28rem]">
            <p className="mb-6 text-base font-semibold leading-tight text-white">{t('footer.subscribe')}</p>
            <p className="mb-10 max-w-[24rem] text-base leading-tight text-white">
              {t('footer.newsletter')}
            </p>

            <form
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5"
              onSubmit={(event) => event.preventDefault()}
            >
              <label className="block flex-1 border-b border-white/30 pb-3">
                <span className="sr-only">{t('footer.email')}</span>
                <input
                  type="email"
                  placeholder={t('footer.email')}
                  aria-label={t('footer.email')}
                  inputMode="email"
                  autoComplete="email"
                  className="w-full bg-transparent text-base leading-tight text-white placeholder:text-white/70 focus:outline-none"
                />
              </label>

              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/18 px-5 text-base font-medium text-white transition-colors hover:border-white/30 hover:bg-white/6"
              >
                {t('footer.send')}
              </button>
            </form>

            <p className="mt-4 max-w-[28rem] text-base leading-tight text-white">
              {t('footer.disclaimer')}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5 pt-8 md:flex-row md:items-center md:justify-between md:gap-8">
          <p className="text-base leading-tight text-white">
            {t('footer.copyright')} {t('footer.rights')}
          </p>

          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {FOOTER_BOTTOM_LINKS.map(({ labelKey, href }) => (
              <TransitionLink
                key={labelKey}
                href={href}
                className="text-base leading-tight text-white underline underline-offset-4 transition-colors hover:text-white/80"
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
                  className="text-white transition-colors hover:text-white/80"
                >
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
