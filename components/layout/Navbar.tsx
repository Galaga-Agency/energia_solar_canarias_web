'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { DesktopMenu }   from '@/components/layout/DesktopMenu'
import { MobileMenu }    from '@/components/layout/MobileMenu'
import { MenuToggle }    from '@/components/layout/MenuToggle'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { Logo }          from '@/components/shared/Logo'
import { stripLocaleFromPathname } from '@/config/i18n.config'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled,   setScrolled]   = useState(false)
  const pathname = usePathname()

  const isHome  = stripLocaleFromPathname(pathname) === '/'
  const showCta = !isHome || scrolled

  useEffect(() => {
    const check = () => setScrolled(window.scrollY > window.innerHeight * 0.85)
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])

  return (
    <>
      <header className="fixed top-0 w-full px-6 flex items-center h-16 z-100 bg-(--color-bg) border-b border-(--color-border)">
        <TransitionLink href="/" aria-label="Energía Solar Canarias — inicio">
          <Logo width={180} />
        </TransitionLink>

        <DesktopMenu showCta={showCta} />
        <MenuToggle open={mobileOpen} onToggle={() => setMobileOpen((v) => !v)} />
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
