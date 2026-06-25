'use client'

import type { ReactNode } from 'react'

interface TagChipProps {
  label: string
  active?: boolean
  onClick?: () => void
  as?: 'button' | 'span'
}

/** Shared tag chip — used on the blog list (clickable filter) and article page (display). */
export function TagChip({ label, active = false, onClick, as = 'button' }: TagChipProps) {
  const className = `keyboard-focus-ring group/chip inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-mono text-[12px] uppercase tracking-[0.14em] transition-colors ${
    active
      ? 'bg-primary text-text-on-dark'
      : 'bg-ink/5 text-ink/65 hover:bg-primary hover:text-text-on-dark'
  }`

  const inner: ReactNode = (
    <>
      <span aria-hidden className={`transition-colors ${active ? 'text-text-on-dark' : 'text-primary group-hover/chip:text-text-on-dark'}`}>#</span>
      {label}
    </>
  )

  if (as === 'span') {
    return <span className={className}>{inner}</span>
  }

  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={className}>
      {inner}
    </button>
  )
}
