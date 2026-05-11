'use client'

import { forwardRef, type TextareaHTMLAttributes } from 'react'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label:  string
  name:   string
  error?: string
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea({ label, name, error, required, ...props }, ref) {
    const errorId = error ? `${name}-error` : undefined

    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={name} className="block text-sm font-semibold text-text mb-2">
          {label}{required && <span aria-hidden="true"> *</span>}
        </label>

        <textarea
          id={name}
          name={name}
          required={required}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className="w-full py-3 px-4 border-[1.5px] border-border bg-bg text-text font-sans text-base transition-[border-color] duration-150 ease-out focus:outline-none focus:border-primary aria-invalid:border-danger min-h-35 resize-y"
          rows={5}
          ref={ref}
          {...props}
        />

        {error && (
          <p id={errorId} role="alert" className="text-xs text-danger mt-1">{error}</p>
        )}
      </div>
    )
  }
)
