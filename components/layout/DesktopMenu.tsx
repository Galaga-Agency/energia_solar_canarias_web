'use client'

import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '@/constants/nav.constants'
import { Button } from '@/components/ui/Button'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { getLocaleFromPathname, getLocalizedHref } from '@/config/i18n.config'
import commonEs from '@/locales/es/common.json'
import commonEn from '@/locales/en/common.json'

export function DesktopMenu() {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const messages = locale === 'en' ? commonEn : commonEs

  return (
    <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-8">
      {NAV_LINKS.map(({ labelKey, href }) => {
        const localizedHref = getLocalizedHref(href, locale)
        const isActive = pathname === localizedHref || pathname.startsWith(`${localizedHref}/`)

        return (
        <TransitionLink
          key={href}
          href={localizedHref}
          aria-current={isActive ? 'page' : undefined}
          className="text-body-sm font-semibold transition-colors hover:text-[var(--color-primary)]"
          style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text)' }}
        >
          {messages.nav[labelKey]}
        </TransitionLink>
        )
      })}

      <div className="flex items-center gap-3 ml-4">
        <Button variant="outlined" href={getLocalizedHref('/contacto', locale)}>{messages.nav.contact}</Button>
        <Button variant="filled" href={getLocalizedHref('/contacto', locale)}>{messages.nav.cta}</Button>
      </div>
    </nav>
  )
}
