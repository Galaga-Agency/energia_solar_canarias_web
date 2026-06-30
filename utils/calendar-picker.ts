export const MONTHS_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
]

export const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"]

export function toISO(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

export function buildCalendarGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1)
  const offset = (first.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (Date | null)[] = []

  for (let i = 0; i < offset; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(year, month, day))

  return cells
}

export function shiftCalendarView(
  view: { year: number; month: number },
  delta: number
): { year: number; month: number } {
  const month = view.month + delta
  return {
    year: view.year + Math.floor(month / 12),
    month: ((month % 12) + 12) % 12,
  }
}
