"use client"

interface SwitchProps {
  checked: boolean
  label: string
  onChange: (value: boolean) => void
}

export function Switch({ checked, label, onChange }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="keyboard-focus-ring grid place-items-center shrink-0 bg-transparent w-11 h-11 -my-3"
    >
      <span
        aria-hidden="true"
        className={`relative block w-9 h-5 rounded-full transition-colors duration-300 ${
          checked ? "bg-primary" : "bg-border"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-bg shadow-sm transition-transform duration-300 ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </span>
    </button>
  )
}
