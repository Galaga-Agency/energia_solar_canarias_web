'use client'

import Image from 'next/image'
import { useTranslation } from '@/contexts/TranslationContext'
import { BlobDecor } from '@/components/ui/BlobDecor'
import {
  FOOTER_SOCIAL,
  FOOTER_SOLUCIONES,
  FOOTER_RECURSOS,
  FOOTER_LEGAL,
  FOOTER_BOTTOM_LINKS,
} from '@/constants/footer.constants'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { getLocalizedHref } from '@/config/i18n.config'
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaXTwitter,
} from '@/components/ui/Icons'

const socialIconMap: Record<string, React.ElementType> = {
  FaFacebook,
  FaInstagram,
  FaXTwitter,
  FaLinkedin,
  FaYoutube,
}

export function Footer() {
  const { t, language } = useTranslation()

  return (
    <footer
      className="relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-surface-dark)', color: 'var(--color-text-on-dark)' }}
    >
      <BlobDecor className="bottom-0 right-0 w-96 h-96 opacity-10" />

      <div className="section-inner section-spacing-both relative">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          {/* Logo */}
          <div className="md:col-span-1">
            <Image
              src="/assets/icons/logo-white.svg"
              alt="Energía Solar Canarias"
              width={160}
              height={36}
            />
          </div>

          {/* Soluciones */}
          <div>
            <p className="text-label mb-4" style={{ color: 'var(--color-text-on-dark)' }}>
              {t('footer.sections.solutions')}
            </p>
            <ul className="flex flex-col gap-3">
              {FOOTER_SOLUCIONES.map(({ labelKey, href }) => (
                <li key={labelKey}>
                  <TransitionLink
                    href={getLocalizedHref(href, language)}
                    className="text-body-sm hover:text-[var(--color-primary)] transition-colors"
                    style={{ color: 'var(--color-text-on-dark)' }}
                  >
                    {t(labelKey)}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <p className="text-label mb-4" style={{ color: 'var(--color-text-on-dark)' }}>
              {t('footer.sections.resources')}
            </p>
            <ul className="flex flex-col gap-3">
              {FOOTER_RECURSOS.map(({ labelKey, href }) => (
                <li key={labelKey}>
                  <TransitionLink
                    href={getLocalizedHref(href, language)}
                    className="text-body-sm hover:text-[var(--color-primary)] transition-colors"
                    style={{ color: 'var(--color-text-on-dark)' }}
                  >
                    {t(labelKey)}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-label mb-4" style={{ color: 'var(--color-text-on-dark)' }}>
              {t('footer.sections.legal')}
            </p>
            <ul className="flex flex-col gap-3">
              {FOOTER_LEGAL.map(({ labelKey, href }) => (
                <li key={labelKey}>
                  <TransitionLink
                    href={getLocalizedHref(href, language)}
                    className="text-body-sm hover:text-[var(--color-primary)] transition-colors"
                    style={{ color: 'var(--color-text-on-dark)' }}
                  >
                    {t(labelKey)}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-label mb-4" style={{ color: 'var(--color-text-on-dark)' }}>
              {t('footer.subscribe')}
            </p>
            <p className="text-body-sm mb-4" style={{ color: 'var(--color-text-on-dark)' }}>
              {t('footer.newsletter')}
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t('footer.email')}
                aria-label={t('footer.email')}
                inputMode="email"
                autoComplete="email"
                className="flex-1 px-3 py-2 rounded-full text-body-sm"
                style={{
                  backgroundColor: 'var(--color-surface-dark-2)',
                  color:           'var(--color-text-on-dark)',
                  border:          '1px solid var(--color-surface-dark-2)',
                }}
              />
              <button type="submit" className="btn-base btn-filled text-xs px-4">
                {t('footer.send')}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: '1px solid var(--color-surface-dark-2)' }}
        >
          <p className="text-body-sm" style={{ color: 'var(--color-text-on-dark)' }}>
            {t('footer.copyright')}
          </p>

          <div className="flex gap-4 flex-wrap">
            {FOOTER_BOTTOM_LINKS.map(({ labelKey, href }) => (
              <TransitionLink
                key={labelKey}
                href={getLocalizedHref(href, language)}
                className="text-body-sm hover:text-[var(--color-primary)] transition-colors"
                style={{ color: 'var(--color-text-on-dark)' }}
              >
                {t(labelKey)}
              </TransitionLink>
            ))}
          </div>

          <div className="flex gap-4">
            {FOOTER_SOCIAL.map(({ label, href, icon }) => {
              const Icon = socialIconMap[icon]
              return (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--color-primary)] transition-colors"
                  style={{ color: 'var(--color-text-on-dark)' }}
                >
                  {Icon && <Icon aria-hidden="true" className="w-5 h-5" />}
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
