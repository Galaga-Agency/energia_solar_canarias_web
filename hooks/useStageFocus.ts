'use client'

import { useEffect } from 'react'

export function useStageFocus(selector: string) {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(selector)
    el?.focus()
  }, [selector])
}
