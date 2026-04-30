'use client'

import type { CSSProperties } from 'react'
import { useEffect } from 'react'
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

const ALL_LINKS = [{ labelKey: 'home' as const, href: '/' }, ...NAV_LINKS]
const ITEM_COUNT = ALL_LINKS.length

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname()
  const locale   = getLocaleFromPathname(pathname)
  const messages = locale === 'en' ? commonEn : commonEs

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menú de navegación"
      aria-hidden={!open}
      data-open={open ? 'true' : 'false'}
      className="mob-nav-panel lg:hidden"
    >
      <div className="mob-nav-inner">
        <nav aria-label="Menú móvil">
          {ALL_LINKS.map(({ labelKey, href }, i) => {
            const localizedHref = getLocalizedHref(href, locale)
            const isActive      = pathname === localizedHref || pathname.startsWith(`${localizedHref}/`)
            // CodePen stagger: last item opens first (unfurls bottom-up)
            const openDelay  = (ITEM_COUNT - 1 - i) * 50
            // Close: first item closes first (folds top-down)
            const closeDelay = i * 50

            return (
              <TransitionLink
                key={href}
                href={localizedHref}
                onClick={onClose}
                aria-current={isActive ? 'page' : undefined}
                className="mob-nav-item"
                style={{
                  '--open-delay':  `${openDelay}ms`,
                  '--close-delay': `${closeDelay}ms`,
                } as CSSProperties}
              >
                {messages.nav[labelKey]}
              </TransitionLink>
            )
          })}
        </nav>

        <div className="mob-nav-cta mt-8">
          <Button
            variant="filled"
            href={getLocalizedHref('/contacto', locale)}
            onClick={onClose}
            className="w-full justify-center"
          >
            {messages.nav.cta}
          </Button>
        </div>
      </div>
    </div>
  )
}
