'use client'

import type { ReactNode } from 'react'
import { AppReadyProvider }        from '@/contexts/AppReadyContext'
import { TransitionProvider }      from '@/contexts/TransitionContext'
import { ScrollProvider }          from '@/contexts/ScrollContext'
import { MotionPreferenceProvider } from '@/contexts/MotionPreferenceContext'
import { LiveRegion }              from '@/components/ui/LiveRegion'
import { Toaster }                 from '@/components/ui/Toaster'
import { PageShell }               from '@/components/layout/PageShell'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppReadyProvider>
      <MotionPreferenceProvider>
        <TransitionProvider>
          <ScrollProvider>
            <LiveRegion />
            <Toaster />
            <PageShell>
              {children}
            </PageShell>
          </ScrollProvider>
        </TransitionProvider>
      </MotionPreferenceProvider>
    </AppReadyProvider>
  )
}
