'use client'

// App-wide Zustand store.
// appReady state is owned by AppReadyContext — do not duplicate it here.
// Add slices here for UI state that needs to be shared across the tree
// without lifting into a context (e.g. active modal ID, toast queue, etc.).

import { create } from 'zustand'

interface UIState {
  activeModalId: string | null
  openModal:     (id: string) => void
  closeModal:    () => void
}

export const useUIStore = create<UIState>((set) => ({
  activeModalId: null,
  openModal:     (id) => set({ activeModalId: id }),
  closeModal:    ()   => set({ activeModalId: null }),
}))
