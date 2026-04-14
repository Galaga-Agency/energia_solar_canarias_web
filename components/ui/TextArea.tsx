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
        <label htmlFor={name} className="field-label">
          {label}{required && <span aria-hidden="true"> *</span>}
        </label>

        <textarea
          id={name}
          name={name}
          required={required}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className="field-input min-h-[140px] resize-y"
          rows={5}
          ref={ref}
          {...props}
        />

        {error && (
          <p id={errorId} role="alert" className="field-error">{error}</p>
        )}
      </div>
    )
  }
)
