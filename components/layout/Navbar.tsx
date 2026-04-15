'use client'

import { useState } from 'react'
import { DesktopMenu } from '@/components/layout/DesktopMenu'
import { MobileMenu }  from '@/components/layout/MobileMenu'
import { MenuToggle }  from '@/components/layout/MenuToggle'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { Logo } from '@/components/shared/Logo'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header
        className="sticky top-0 w-full px-6 flex items-center justify-between"
        style={{
          backgroundColor: 'var(--color-bg)',
          borderBottom:    '1px solid var(--color-border)',
          height:          '64px',
          zIndex:          'var(--z-drawer)',
        }}
      >
        <TransitionLink href="/" aria-label="Energía Solar Canarias — inicio">
          <Logo width={180} />
        </TransitionLink>

        <DesktopMenu />
        <MenuToggle open={mobileOpen} onToggle={() => setMobileOpen((v) => !v)} />
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
