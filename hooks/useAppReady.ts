'use client'

import { useContext } from 'react'
import { AppReadyContext } from '@/contexts/AppReadyContext'

export function useAppReady(): boolean {
  const ctx = useContext(AppReadyContext)
  if (!ctx) throw new Error('useAppReady must be used inside AppReadyProvider')
  return ctx.appReady
}

export function useMarkReady(): () => void {
  const ctx = useContext(AppReadyContext)
  if (!ctx) throw new Error('useMarkReady must be used inside AppReadyProvider')
  return ctx.markReady
}
