'use client'

import type { ReactNode } from 'react'
import { PageLoader }        from '@/components/layout/PageLoader'
import { SkipLink }           from '@/components/ui/SkipLink'
import { ScrollToTopButton }  from '@/components/ui/ScrollToTopButton'

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink />
      <PageLoader />
      {children}
      <ScrollToTopButton />
    </>
  )
}
