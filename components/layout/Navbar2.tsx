'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { MobileMenu }     from '@/components/layout/MobileMenu'
import { MenuToggle }     from '@/components/layout/MenuToggle'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { Logo }           from '@/components/shared/Logo'
import { Button }         from '@/components/ui/Button'
import { NAV_LINKS }      from '@/constants/nav.constants'
import { getLocaleFromPathname, getLocalizedHref, stripLocaleFromPathname } from '@/config/i18n.config'
import commonEs from '@/locales/es/common.json'
import commonEn from '@/locales/en/common.json'

export function Navbar2() {
  const headerHeight = 72
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled,   setScrolled]   = useState(false)
  const pathname = usePathname()

  const locale   = getLocaleFromPathname(pathname)
  const messages = locale === 'en' ? commonEn : commonEs
  const isHome   = stripLocaleFromPathname(pathname) === '/'

  useEffect(() => {
    const check = () => setScrolled(window.scrollY > window.innerHeight * 0.6)
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])

  const transparent = isHome && !scrolled

  // test

  return (
    <>
      <header
        style={{ height: `${headerHeight}px` }}
        className="fixed inset-x-0 top-0 z-100 px-4 pt-3 md:px-6 lg:px-8"
      >
        <div className={`brand-radius navbar-shell navbar-shell-layout mx-auto flex h-[72px] items-center gap-4 px-5 md:px-6 ${transparent ? 'navbar-shell--hero' : 'navbar-shell--scrolled'}`}>
          <TransitionLink
            href="/"
            aria-label="Energía Solar Canarias — inicio"
            className={`shrink-0 transition-opacity duration-500 ${transparent ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <Logo width={150} className="transition-all duration-300" />
          </TransitionLink>

          <nav
            aria-label="Navegación principal"
            className="navbar-desktop hidden md:flex"
          >
            {NAV_LINKS.map(({ labelKey, href }) => {
              const localizedHref = getLocalizedHref(href, locale)
              const isActive = pathname === localizedHref || pathname.startsWith(`${localizedHref}/`)
              return (
                <TransitionLink
                  key={href}
                  href={localizedHref}
                  aria-current={isActive ? 'page' : undefined}
                  className={`navbar-link ${isActive ? 'navbar-link--active' : ''} ${transparent ? 'navbar-link--hero' : 'navbar-link--scrolled'}`}
                >
                  {messages.nav[labelKey]}
                </TransitionLink>
              )
            })}
          </nav>

          <div className="hidden md:flex ml-auto">
            <div
              className={`transition-all duration-300 ${
                transparent ? 'opacity-0 pointer-events-none -translate-y-1' : 'opacity-100 translate-y-0'
              }`}
            >
              <Button variant="filled" href={getLocalizedHref('/contacto', locale)}>
                {messages.nav.cta}
              </Button>
            </div>
          </div>

          <div className="md:hidden ml-auto">
            <MenuToggle
              open={mobileOpen}
              onToggle={() => setMobileOpen((v) => !v)}
            />
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        headerHeight={headerHeight}
      />
    </>
  )
}
