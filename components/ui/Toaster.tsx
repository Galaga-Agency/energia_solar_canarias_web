'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id:      number
  message: string
  type:    ToastType
}

let showToast: (message: string, type?: ToastType) => void = () => {}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)

  const add = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++counter.current
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  useEffect(() => { showToast = add }, [add])

  if (!toasts.length) return null

  return createPortal(
    <div
      className="fixed bottom-6 right-6 flex flex-col gap-3"
      style={{ zIndex: 'var(--z-toast)' }}
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="px-5 py-3 rounded-lg text-body-sm font-semibold shadow-lg"
          style={{
            backgroundColor: t.type === 'error' ? 'var(--color-danger)' : 'var(--color-surface-dark)',
            color: 'var(--color-text-on-dark)',
          }}
        >
          {t.message}
        </div>
      ))}
    </div>,
    document.body,
  )
}

export { showToast }
