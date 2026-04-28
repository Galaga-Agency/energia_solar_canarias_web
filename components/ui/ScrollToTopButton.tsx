'use client'

import { useEffect, useState } from 'react'
import { HiChevronUp }         from '@/components/ui/Icons'
import { getLenis }             from '@/lib/lenis'

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.5)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = () => {
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.4 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Volver al inicio"
      className={[
        'fixed bottom-6 right-6 z-50',
        'w-11 h-11 rounded-full',
        'bg-primary text-text-on-primary',
        'flex items-center justify-center',
        'shadow-md',
        'transition-all duration-300 ease-out',
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none',
      ].join(' ')}
    >
      <HiChevronUp size={20} aria-hidden="true" />
    </button>
  )
}
