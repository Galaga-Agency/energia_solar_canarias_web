'use client'

import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '@/constants/nav.constants'
import { Button } from '@/components/ui/Button'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { getLocaleFromPathname, getLocalizedHref } from '@/config/i18n.config'
import commonEs from '@/locales/es/common.json'
import commonEn from '@/locales/en/common.json'

interface MobileMenuProps {
  open:    boolean
  onClose: () => void
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const messages = locale === 'en' ? commonEn : commonEs

  if (!open) return null

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menú de navegación"
      className="fixed inset-0 flex flex-col px-6 py-8 md:hidden"
      style={{
        backgroundColor: 'var(--color-bg)',
        zIndex: 'var(--z-overlay)',
      }}
    >
      <nav aria-label="Menú móvil" className="flex flex-col gap-6 mt-16">
        {NAV_LINKS.map(({ labelKey, href }) => {
          const localizedHref = getLocalizedHref(href, locale)
          const isActive = pathname === localizedHref || pathname.startsWith(`${localizedHref}/`)

          return (
          <TransitionLink
            key={href}
            href={localizedHref}
            onClick={onClose}
            aria-current={isActive ? 'page' : undefined}
            className="text-heading"
            style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-ink)' }}
          >
            {messages.nav[labelKey]}
          </TransitionLink>
          )
        })}
      </nav>

      <div className="flex flex-col gap-4 mt-10">
        <Button variant="outlined" href={getLocalizedHref('/contacto', locale)} onClick={onClose}>{messages.nav.contact}</Button>
        <Button variant="filled" href={getLocalizedHref('/contacto', locale)} onClick={onClose}>{messages.nav.cta}</Button>
      </div>
    </div>
  )
}
