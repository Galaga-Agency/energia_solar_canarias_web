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

  return (
    <>
      <header
        className={`fixed top-0 w-full z-100 h-18 flex items-center px-8 transition-all duration-500 ${
          transparent
            ? 'bg-transparent'
            : 'bg-(--color-bg) border-b border-(--color-border)'
        }`}
      >
        {/* Logo */}
        <TransitionLink href="/" aria-label="Energía Solar Canarias — inicio">
          <Logo
            width={160}
            className={`transition-all duration-500 ${transparent ? '[&_path]:fill-white [&_g_path]:fill-white' : ''}`}
          />
        </TransitionLink>

        {/* Nav links — centered */}
        <nav
          aria-label="Navegación principal"
          className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-10"
        >
          {NAV_LINKS.map(({ labelKey, href }) => {
            const localizedHref = getLocalizedHref(href, locale)
            const isActive = pathname === localizedHref || pathname.startsWith(`${localizedHref}/`)
            return (
              <TransitionLink
                key={href}
                href={localizedHref}
                aria-current={isActive ? 'page' : undefined}
                className={`relative text-sm tracking-wide transition-colors duration-200 group ${
                  transparent
                    ? isActive ? 'text-white' : 'text-white/70 hover:text-white'
                    : isActive ? 'text-primary' : 'text-ink hover:text-primary'
                }`}
              >
                {messages.nav[labelKey]}
                <span className={`absolute -bottom-1 left-0 h-px w-full bg-current scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${isActive ? 'scale-x-100' : ''}`} />
              </TransitionLink>
            )
          })}
        </nav>

        {/* CTA — right */}
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

        {/* Mobile toggle */}
        <div className="md:hidden ml-auto">
          <MenuToggle
            open={mobileOpen}
            onToggle={() => setMobileOpen((v) => !v)}
          />
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
