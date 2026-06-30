"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  buildCalendarGrid,
  shiftCalendarView,
  toISO,
} from "@/utils/calendar-picker"

interface UseCalendarPickerOptions {
  end: string | null
  onClose: () => void
  start: string | null
}

export function useCalendarPicker({ end, onClose, start }: UseCalendarPickerOptions) {
  const today = useMemo(() => new Date(), [])
  const ref = useRef<HTMLDivElement>(null)
  const [view, setView] = useState(() => {
    const base = start ? new Date(start) : today
    return { year: base.getFullYear(), month: base.getMonth() }
  })
  const [from, setFrom] = useState<Date | null>(start ? new Date(start) : null)
  const [to, setTo] = useState<Date | null>(end ? new Date(end) : null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }

    document.addEventListener("keydown", onKey)
    document.addEventListener("mousedown", onClick)

    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("mousedown", onClick)
    }
  }, [onClose])

  const pick = (date: Date) => {
    if (!from || (from && to)) {
      setFrom(date)
      setTo(null)
    } else if (date < from) {
      setTo(from)
      setFrom(date)
    } else {
      setTo(date)
    }
  }

  const inRange = (date: Date) => from && to && date >= from && date <= to
  const isEdge = (date: Date) =>
    (from && toISO(date) === toISO(from)) || (to && toISO(date) === toISO(to))

  const shift = (delta: number) => {
    setView((current) => shiftCalendarView(current, delta))
  }

  const grid = buildCalendarGrid(view.year, view.month)
  const canApply = Boolean(from && to)

  return {
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
  }
}
