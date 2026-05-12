'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '@/constants/nav.constants'
import { Button } from '@/components/ui/Button'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { AnimatedBrandBlob } from '@/components/ui/AnimatedBrandBlob'
import {
  getLocaleFromPathname,
  getLocalizedHref,
  getLocalizedCanonicalPath,
} from '@/config/i18n.config'
import { CONTACT_INFO } from '@/constants/contact.constants'
import commonEs from '@/locales/es/common.json'
import commonEn from '@/locales/en/common.json'

interface MobileMenuProps {
  open:    boolean
  onClose: () => void
}

const ALL_LINKS = [{ labelKey: 'home' as const, href: '/' }, ...NAV_LINKS]

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname()
  const locale   = getLocaleFromPathname(pathname)
  const messages = locale === 'en' ? commonEn : commonEs

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', handler)
    }
  }, [open, onClose])

  const eyebrow     = locale === 'en' ? 'Navigation' : 'Navegación'
  const contactKey  = locale === 'en' ? 'Contact'    : 'Contacto'

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label={eyebrow}
      aria-hidden={!open}
      data-open={open ? 'true' : 'false'}
      className="mob-nav-shell lg:hidden"
    >
      <div className="mob-nav-root">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-25 bg-[url('/assets/images/common/white-paper-texture.jpg')] bg-cover bg-center"
        />

        <AnimatedBrandBlob className="pointer-events-none absolute -right-24 top-[18%] h-auto w-72 opacity-55" />

        <div className="relative z-10 flex h-full flex-col px-7 pt-14 pb-6">
          <span className="text-label text-ink/50">{eyebrow}</span>

          <nav aria-label={eyebrow} className="mt-4 flex flex-col gap-1">
            {ALL_LINKS.map(({ labelKey, href }) => {
              const localizedHref = getLocalizedHref(href, locale)
              const isActive      =
                pathname === localizedHref ||
                (href !== '/' && pathname.startsWith(`${localizedHref}/`))

              return (
                <TransitionLink
                  key={href}
                  href={localizedHref}
                  onClick={onClose}
                  aria-current={isActive ? 'page' : undefined}
                  className={`mob-nav-row block py-2 ${isActive ? 'is-active' : ''}`}
                >
                  <span className="text-title md:text-display">{messages.nav[labelKey]}</span>
                </TransitionLink>
              )
            })}
          </nav>

          <div className="flex flex-col gap-6 pt-6">
            <div className="flex items-center gap-6">
              {(['es', 'en'] as const).map((loc, i) => {
                const active = loc === locale
                const href   = getLocalizedCanonicalPath(pathname, loc)
                return (
                  <span key={loc} className="flex items-center gap-6">
                    {i > 0 && <span aria-hidden className="h-5 w-px bg-ink/25" />}
                    <Link
                      href={href}
                      onClick={onClose}
                      aria-current={active ? 'true' : undefined}
                      className={`text-subheading py-2 transition-colors ${
                        active ? 'text-primary' : 'text-ink/55 hover:text-ink'
                      }`}
                    >
                      {loc.toUpperCase()}
                    </Link>
                  </span>
                )
              })}
            </div>

          </div>
        </div>
      </div>

      <div className="mob-nav-card-bottom">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-25 bg-[url('/assets/images/common/white-paper-texture.jpg')] bg-cover bg-center"
        />
        <div className="relative z-10">
          <span className="text-label text-primary/70!">{contactKey}</span>
          <a
            href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`}
            className="mt-3 block text-body font-medium text-white! transition-opacity hover:opacity-75 md:text-subheading"
          >
            {CONTACT_INFO.phone}
          </a>
          <a
            href={`mailto:${CONTACT_INFO.email}`}
            className="mt-1 block text-body lowercase text-white/85! transition-opacity hover:opacity-75 md:text-subheading"
          >
            {CONTACT_INFO.email}
          </a>
          <Button
            variant="filled"
            href={getLocalizedHref('/contacto', locale)}
            onClick={onClose}
            className="mt-5 w-full justify-center"
          >
            {messages.nav.cta}
          </Button>
        </div>
      </div>
    </div>
  )
}
