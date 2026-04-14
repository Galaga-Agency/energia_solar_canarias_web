'use client'

import { useEffect, useRef } from 'react'

let announce: (msg: string, politeness?: 'polite' | 'assertive') => void = () => {}

export function LiveRegion() {
  const politeRef    = useRef<HTMLDivElement>(null)
  const assertiveRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    announce = (msg, politeness = 'polite') => {
      const el = politeness === 'assertive' ? assertiveRef.current : politeRef.current
      if (!el) return
      el.textContent = ''
      requestAnimationFrame(() => { el.textContent = msg })
    }
  }, [])

  return (
    <>
      <div ref={politeRef}    aria-live="polite"    aria-atomic="true" className="live-region" />
      <div ref={assertiveRef} aria-live="assertive" aria-atomic="true" className="live-region" />
    </>
  )
}

export { announce }
