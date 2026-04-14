'use client'

import { useState, useRef, useEffect } from 'react'
import { HiChevronDown } from '@/components/ui/Icons'

interface DropdownProps {
  label:    string
  options:  string[]
  value:    string
  onChange: (v: string) => void
}

export function Dropdown({ label, options, value, onChange }: DropdownProps) {
  const [open, setOpen]     = useState(false)
  const containerRef        = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-body-sm font-semibold border"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
      >
        {value || label}
        <HiChevronDown aria-hidden="true" />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute left-0 top-full mt-2 min-w-[160px] rounded-lg shadow-lg overflow-hidden"
          style={{ backgroundColor: 'var(--color-bg)', zIndex: 'var(--z-dropdown)', border: '1px solid var(--color-border)' }}
        >
          {options.map((opt) => (
            <li
              key={opt}
              role="option"
              aria-selected={opt === value}
              onClick={() => { onChange(opt); setOpen(false) }}
              className="px-4 py-3 cursor-pointer text-body-sm hover:bg-[var(--color-surface)]"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
