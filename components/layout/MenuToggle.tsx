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
      className={`ml-auto flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 md:hidden ${
        open
          ? 'bg-[#533557] shadow-[0_0_0_8px_rgba(236,114,99,0.10)]'
          : 'bg-white/6 backdrop-blur-sm'
      }`}
    >
      <span className="relative block h-4.5 w-5">
        <span
          className={`absolute left-0 top-1/2 block h-0.5 w-5 rounded-full transition-all duration-300 ${
            open ? 'translate-y-0 rotate-45 bg-[#ec7263]' : '-translate-y-[6px] bg-[#ec7263]'
          }`}
        />
        <span
          className={`absolute left-0 top-1/2 block h-0.5 rounded-full transition-all duration-300 ${
            open ? 'w-0 opacity-0' : 'w-5 -translate-y-1/2 bg-[#ec7263]'
          }`}
        />
        <span
          className={`absolute left-0 top-1/2 block h-0.5 w-5 rounded-full transition-all duration-300 ${
            open ? 'translate-y-0 -rotate-45 bg-[#ec7263]' : 'translate-y-[5px] bg-[#ec7263]'
          }`}
        />
      </span>
    </button>
  )
}
