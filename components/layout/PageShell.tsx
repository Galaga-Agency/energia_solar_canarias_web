'use client'

import type { ReactNode } from 'react'
import { Navbar }     from '@/components/layout/Navbar'
import { Footer }     from '@/components/layout/Footer'
import { PageLoader } from '@/components/layout/PageLoader'
import { SkipLink }   from '@/components/ui/SkipLink'

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink />
      <PageLoader />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  )
}
