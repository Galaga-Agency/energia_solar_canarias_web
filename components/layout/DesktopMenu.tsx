'use client'

import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '@/constants/nav.constants'
import { Button } from '@/components/ui/Button'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { getLocaleFromPathname, getLocalizedHref } from '@/config/i18n.config'
import commonEs from '@/locales/es/common.json'
import commonEn from '@/locales/en/common.json'

interface DesktopMenuProps {
  showCta: boolean
}

export function DesktopMenu({ showCta }: DesktopMenuProps) {
  const pathname = usePathname()
  const locale   = getLocaleFromPathname(pathname)
  const messages = locale === 'en' ? commonEn : commonEs

  return (
    <>
      {/* Nav links — absolutely centered in the header */}
      <nav
        aria-label="Navegación principal"
        className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8"
      >
        {NAV_LINKS.map(({ labelKey, href }) => {
          const localizedHref = getLocalizedHref(href, locale)
          const isActive = pathname === localizedHref || pathname.startsWith(`${localizedHref}/`)

          return (
            <TransitionLink
              key={href}
              href={localizedHref}
              aria-current={isActive ? 'page' : undefined}
              className={`text-base font-normal transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-ink'}`}
            >
              {messages.nav[labelKey]}
            </TransitionLink>
          )
        })}
      </nav>

      {/* CTA button — right side, fades in once past the hero */}
      <div
        className="hidden md:flex ml-auto items-center"
        aria-hidden={!showCta}
        style={{
          opacity:       showCta ? 1 : 0,
          transform:     showCta ? 'translateY(0)' : 'translateY(-4px)',
          pointerEvents: showCta ? 'auto' : 'none',
          transition:    'opacity 300ms ease-out, transform 300ms ease-out',
        }}
      >
        <Button variant="filled" href={getLocalizedHref('/contacto', locale)}>
          {messages.nav.cta}
        </Button>
      </div>
    </>
  )
}
