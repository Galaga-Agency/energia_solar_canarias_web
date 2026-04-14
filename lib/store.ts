'use client'

import { create } from 'zustand'

interface AppState {
  appReady:    boolean
  setAppReady: (v: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  appReady:    false,
  setAppReady: (v) => set({ appReady: v }),
}))
