'use client'

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
      className="ml-auto flex items-center justify-center w-10 h-10 md:hidden"
    >
      <span className="relative flex flex-col justify-between w-6 h-4.5">
        <span className={`block h-0.5 w-6 bg-ink rounded-full transition-all duration-300 ease-in-out origin-center ${open ? 'translate-y-2 rotate-45' : ''}`} />
        <span className={`block h-0.5 bg-ink rounded-full transition-all duration-300 ease-in-out origin-center ${open ? 'w-0 opacity-0' : 'w-6'}`} />
        <span className={`block h-0.5 w-6 bg-ink rounded-full transition-all duration-300 ease-in-out origin-center ${open ? '-translate-y-2 -rotate-45' : ''}`} />
      </span>
    </button>
  )
}
