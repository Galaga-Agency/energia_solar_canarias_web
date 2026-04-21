'use client'

import type { ReactNode } from 'react'
import { Navbar2 as Navbar }  from '@/components/layout/Navbar2'
import { Footer }  from '@/components/layout/Footer'

export function LocaleShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  )
}
