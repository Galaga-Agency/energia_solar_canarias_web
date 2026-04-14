'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface MotionPreferenceContextValue {
  reducedMotion: boolean
}

const MotionPreferenceContext = createContext<MotionPreferenceContextValue>({ reducedMotion: false })

export function MotionPreferenceProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <MotionPreferenceContext.Provider value={{ reducedMotion }}>
      {children}
    </MotionPreferenceContext.Provider>
  )
}

export function useMotionPreferenceContext() {
  return useContext(MotionPreferenceContext)
}
