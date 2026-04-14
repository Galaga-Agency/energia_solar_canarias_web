'use client'

import type { InputHTMLAttributes } from 'react'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  name:  string
}

export function Checkbox({ label, name, ...props }: CheckboxProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer text-body-sm">
      <input
        type="checkbox"
        id={name}
        name={name}
        className="w-4 h-4 accent-[var(--color-primary)] rounded"
        {...props}
      />
      {label}
    </label>
  )
}
