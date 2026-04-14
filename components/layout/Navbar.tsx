'use client'

import { useState } from 'react'
import Image from 'next/image'
import { DesktopMenu } from '@/components/layout/DesktopMenu'
import { MobileMenu }  from '@/components/layout/MobileMenu'
import { MenuToggle }  from '@/components/layout/MenuToggle'
import { TransitionLink } from '@/components/ui/TransitionLink'

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
          <Image
            src="/assets/icons/logo.svg"
            alt="Energía Solar Canarias"
            width={180}
            height={40}
            priority
          />
        </TransitionLink>

        <DesktopMenu />
        <MenuToggle open={mobileOpen} onToggle={() => setMobileOpen((v) => !v)} />
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
