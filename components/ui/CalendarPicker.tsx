"use client"
import { createPortal } from "react-dom"
import { HiChevronDown } from "@/components/ui/Icons"
import { useCalendarPicker } from "@/hooks/useCalendarPicker"
import { MONTHS_ES, toISO, WEEKDAYS } from "@/utils/calendar-picker"

interface CalendarPickerProps {
  start: string | null
  end: string | null
  onApply: (start: string, end: string) => void
  onClose: () => void
  anchorLabel: string
}

export function CalendarPicker({ start, end, onApply, onClose, anchorLabel }: CalendarPickerProps) {
  const {
    canApply,
    from,
    grid,
    inRange,
    isEdge,
    pick,
    ref,
    shift,
    to,
    today,
    view,
  } = useCalendarPicker({ end, onClose, start })

  const apply = () => {
    if (!from || !to) return
    onApply(toISO(from), toISO(to))
  }

  return createPortal(
    <div className="fixed inset-0 z-picker grid place-items-center px-4">
      <div aria-hidden="true" className="absolute inset-0 bg-ink/30" onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={anchorLabel}
        className="relative bg-bg text-ink border border-border shadow-lg p-[clamp(1.4rem,2.5vw,2rem)] w-[min(360px,calc(100vw-2rem))]"
      >
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            onClick={() => shift(-1)}
            aria-label="Mes anterior"
            className="keyboard-focus-ring grid place-items-center w-9 h-9 text-text-subtle hover:text-ink transition-colors duration-300 rotate-90"
          >
            <HiChevronDown className="w-[1.1rem] h-[1.1rem]" aria-hidden="true" />
          </button>
          <span className="text-body text-ink tabular-nums">
            {MONTHS_ES[view.month]} {view.year}
          </span>
          <button
            type="button"
            onClick={() => shift(1)}
            aria-label="Mes siguiente"
            className="keyboard-focus-ring grid place-items-center w-9 h-9 text-text-subtle hover:text-ink transition-colors duration-300 -rotate-90"
          >
            <HiChevronDown className="w-[1.1rem] h-[1.1rem]" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((w) => (
            <span key={w} className="text-label text-text-subtle text-center">{w}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {grid.map((d, i) => {
            if (!d) return <span key={i} />
            const future = d > today
            const edge = isEdge(d)
            const mid = inRange(d) && !edge
            return (
              <button
                key={i}
                type="button"
                disabled={future}
                onClick={() => pick(d)}
                aria-label={toISO(d)}
                className={`keyboard-focus-ring h-9 text-body-sm tabular-nums transition-colors duration-200 ${
                  edge
                    ? "bg-primary text-text-on-primary"
                    : mid
                    ? "bg-primary/15 text-ink"
                    : "text-ink hover:bg-surface"
                } ${future ? "opacity-30 cursor-not-allowed" : ""}`}
              >
                {d.getDate()}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          disabled={!canApply}
          onClick={apply}
          className="keyboard-focus-ring w-full mt-6 px-6 py-3 bg-ink text-text-on-dark border border-ink hover:bg-transparent hover:text-ink transition-colors duration-300 text-body disabled:opacity-40"
        >
          Aplicar
        </button>
      </div>
    </div>,
    document.body
  )
}
