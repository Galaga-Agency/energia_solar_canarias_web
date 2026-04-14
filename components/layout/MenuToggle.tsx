'use client'

import { HiMenu, HiX } from '@/components/ui/Icons'

interface MenuToggleProps {
  open:     boolean
  onToggle: () => void
}

export function MenuToggle({ open, onToggle }: MenuToggleProps) {
  return (
    <button
      type="button"
      aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
      aria-expanded={open}
      aria-controls="mobile-menu"
      onClick={onToggle}
      className="p-2 rounded-md md:hidden"
    >
      {open
        ? <HiX    aria-hidden="true" className="w-6 h-6" />
        : <HiMenu aria-hidden="true" className="w-6 h-6" />
      }
    </button>
  )
}
