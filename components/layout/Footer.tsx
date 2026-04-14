'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { BlobDecor } from '@/components/ui/BlobDecor'
import { FOOTER_SOCIAL } from '@/constants/footer.constants'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { getLocaleFromPathname, getLocalizedHref } from '@/config/i18n.config'
import commonEs from '@/messages/es/common.json'
import commonEn from '@/messages/en/common.json'
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
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const messages = locale === 'en' ? commonEn : commonEs
  const soluciones = locale === 'en'
    ? [
        { label: 'Companies', href: '/soluciones' },
        { label: 'Success stories', href: '/proyectos' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contacto' },
        { label: 'About us', href: '/sobre-nosotros' },
      ]
    : [
        { label: 'Empresas', href: '/soluciones' },
        { label: 'Casos de éxito', href: '/proyectos' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contacto', href: '/contacto' },
        { label: 'Sobre nosotros', href: '/sobre-nosotros' },
      ]
  const recursos = locale === 'en'
    ? [
        { label: 'Energy audit', href: '/contacto' },
        { label: 'Sustainability', href: '/soluciones' },
        { label: 'Regulations', href: '/blog' },
        { label: 'Financing', href: '/soluciones' },
        { label: 'Implementation', href: '/soluciones' },
      ]
    : [
        { label: 'Auditoría energética', href: '/contacto' },
        { label: 'Sostenibilidad', href: '/soluciones' },
        { label: 'Normativas', href: '/blog' },
        { label: 'Financiamiento', href: '/soluciones' },
        { label: 'Implementación', href: '/soluciones' },
      ]
  const legal = locale === 'en'
    ? [
        { label: 'Privacy', href: '/privacidad' },
        { label: 'Terms', href: '/terminos' },
        { label: 'Cookies', href: '/cookies' },
        { label: 'Support', href: '/contacto' },
        { label: 'Newsletter', href: '/contacto' },
      ]
    : [
        { label: 'Privacidad', href: '/privacidad' },
        { label: 'Términos', href: '/terminos' },
        { label: 'Cookies', href: '/cookies' },
        { label: 'Soporte', href: '/contacto' },
        { label: 'Boletín', href: '/contacto' },
      ]

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
            <p className="text-label mb-4" style={{ color: 'var(--color-text-on-dark)' }}>{messages.nav.solutions}</p>
            <ul className="flex flex-col gap-3">
              {soluciones.map(({ label, href }) => (
                <li key={label}>
                  <TransitionLink href={getLocalizedHref(href, locale)} className="text-body-sm hover:text-[var(--color-primary)] transition-colors"
                    style={{ color: 'var(--color-text-on-dark)' }}>
                    {label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <p className="text-label mb-4" style={{ color: 'var(--color-text-on-dark)' }}>Recursos</p>
            <ul className="flex flex-col gap-3">
              {recursos.map(({ label, href }) => (
                <li key={label}>
                  <TransitionLink href={getLocalizedHref(href, locale)} className="text-body-sm hover:text-[var(--color-primary)] transition-colors"
                    style={{ color: 'var(--color-text-on-dark)' }}>
                    {label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-label mb-4" style={{ color: 'var(--color-text-on-dark)' }}>Legal</p>
            <ul className="flex flex-col gap-3">
              {legal.map(({ label, href }) => (
                <li key={label}>
                  <TransitionLink href={getLocalizedHref(href, locale)} className="text-body-sm hover:text-[var(--color-primary)] transition-colors"
                    style={{ color: 'var(--color-text-on-dark)' }}>
                    {label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-label mb-4" style={{ color: 'var(--color-text-on-dark)' }}>{messages.footer.subscribe}</p>
            <p className="text-body-sm mb-4" style={{ color: 'var(--color-text-on-dark)' }}>
              {messages.footer.newsletter}
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={messages.footer.email}
                aria-label={messages.footer.email}
                inputMode="email"
                autoComplete="email"
                className="flex-1 px-3 py-2 rounded-full text-body-sm"
                style={{
                  backgroundColor: 'var(--color-surface-dark-2)',
                  color:           'var(--color-text-on-dark)',
                  border:          '1px solid var(--color-surface-dark-2)',
                }}
              />
              <button type="submit" className="btn-base btn-filled text-xs px-4">{messages.footer.send}</button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: '1px solid var(--color-surface-dark-2)' }}
        >
          <p className="text-body-sm" style={{ color: 'var(--color-text-on-dark)' }}>
            © 2026 Carla. {messages.footer.rights}
          </p>

          <div className="flex gap-4">
            {(locale === 'en' ? ['Privacy policy', 'Terms of service', 'Cookie settings'] : ['Política de privacidad', 'Términos de servicio', 'Configuración de cookies']).map((item) => (
              <TransitionLink key={item} href="#" className="text-body-sm hover:text-[var(--color-primary)] transition-colors"
                style={{ color: 'var(--color-text-on-dark)' }}>
                {item}
              </TransitionLink>
            ))}
          </div>

          <div className="flex gap-4">
            {FOOTER_SOCIAL.map(({ label, href, icon }) => {
              const Icon = socialIconMap[icon]
              return (
                <a key={label} href={href} aria-label={label}
                  target="_blank" rel="noopener noreferrer"
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
