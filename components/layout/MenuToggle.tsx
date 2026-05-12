'use client'

interface MenuToggleProps {
  open:      boolean
  onToggle:  () => void
  heroMode?: boolean
}

export function MenuToggle({ open, onToggle }: MenuToggleProps) {
  return (
    <button
      type="button"
      aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
      aria-expanded={open}
      aria-controls="mobile-menu"
      onClick={onToggle}
      className="ml-auto flex h-11 w-11 items-center justify-center bg-transparent transition-colors duration-200 lg:hidden"
    >
      <span className="relative block h-4.5 w-5">
        <span
          className={`absolute left-0 top-1/2 block h-0.5 w-5 transition-all duration-300 ${
            open ? 'translate-y-0 rotate-45 bg-(--color-primary)' : '-translate-y-1.5 bg-(--color-primary)'
          }`}
        />
        <span
          className={`absolute left-0 top-1/2 block h-0.5 transition-all duration-300 ${
            open ? 'w-0 opacity-0' : 'w-5 -translate-y-1/2 bg-(--color-primary)'
          }`}
        />
        <span
          className={`absolute left-0 top-1/2 block h-0.5 w-5 transition-all duration-300 ${
            open ? 'translate-y-0 -rotate-45 bg-(--color-primary)' : 'translate-y-1.25 bg-(--color-primary)'
          }`}
        />
      </span>
    </button>
  )
}
