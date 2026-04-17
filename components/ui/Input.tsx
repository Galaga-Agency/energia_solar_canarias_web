'use client'

import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label:  string
  name:   string
  error?: string
  hint?:  string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, name, error, hint, required, ...props }, ref) {
    const descId  = hint  ? `${name}-hint`  : undefined
    const errorId = error ? `${name}-error` : undefined
    const ariaDesc = [descId, errorId].filter(Boolean).join(' ') || undefined

    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={name} className="block text-sm font-semibold text-text mb-2">
          {label}{required && <span aria-hidden="true"> *</span>}
        </label>

        <input
          id={name}
          name={name}
          required={required}
          aria-invalid={!!error}
          aria-describedby={ariaDesc}
          className="w-full py-3 px-4 border-[1.5px] border-border rounded-md bg-bg text-text font-sans text-base transition-[border-color] duration-150 ease-out focus:outline-none focus:border-primary aria-invalid:border-danger"
          ref={ref}
          {...props}
        />

        {hint && !error && (
          <p id={descId} className="text-caption">{hint}</p>
        )}

        {error && (
          <p id={errorId} role="alert" className="text-xs text-danger mt-1">{error}</p>
        )}
      </div>
    )
  }
)
