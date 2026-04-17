'use client'

import { useEffect, useState } from 'react'
import { useAppReady } from '@/hooks/useAppReady'
import { Logo } from '@/components/shared/Logo'

export function PageLoader() {
  const loadingComplete = useAppReady()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (loadingComplete) {
      const timer = setTimeout(() => setVisible(false), 600)
      return () => clearTimeout(timer)
    }
  }, [loadingComplete])

  if (!visible) return null

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 flex items-center justify-center transition-opacity duration-500"
      style={{
        backgroundColor: 'var(--color-bg)',
        zIndex: 'var(--z-overlay)',
        opacity: loadingComplete ? 0 : 1,
        pointerEvents: loadingComplete ? 'none' : 'auto',
      }}
    >
      <Logo width={260} />
    </div>
  )
}
