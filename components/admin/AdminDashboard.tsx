"use client"
import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/Button"
import { WorldMap } from "@/components/admin/WorldMap"
import { CalendarPicker } from "@/components/ui/CalendarPicker"
import { exportToExcel, exportToPDF } from "@/utils/analytics-export"
import { splitStat } from "@/utils/text"

interface SeriesPoint {
  date: string
  value: number
}

interface AnalyticsData {
  configured: boolean
  users: string
  pageviews: string
  bounceRate: string
  avgSession: string
  series: SeriesPoint[]
  topPages: { path: string; views: string }[]
  countries: { name: string; users: number }[]
  cities: { city: string; country: string; users: string }[]
}

const RANGES = [
  { key: "7d", label: "7 días" },
  { key: "28d", label: "28 días" },
  { key: "90d", label: "90 días" },
  { key: "365d", label: "12 meses" },
] as const

const EMPTY: AnalyticsData = {
  configured: false,
  users: "0",
  pageviews: "0",
  bounceRate: "0%",
  avgSession: "0m 0s",
  series: [],
  topPages: [],
  countries: [],
  cities: [],
}

/** Mono orange eyebrow — the site's signature kicker. */
function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="block font-mono text-[12px] uppercase tracking-[0.18em] text-primary">
      {children}
    </span>
  )
}

/** Stat treated like HomeStats: huge value + orange suffix, hairline-divided. */
function Stat({
  label,
  value,
  muted,
  first,
}: {
  label: string
  value: string
  muted: boolean
  first: boolean
}) {
  const { prefix, num, suffix } = splitStat(value)
  return (
    <div
      className={`flex flex-col justify-between gap-7 border-t border-ink/12 py-9 lg:border-l lg:border-t-0 lg:px-8 lg:py-2 ${
        first ? "lg:border-l-0 lg:pl-0" : ""
      }`}
    >
      <div className="flex items-baseline text-ink">
        <span className={`text-stat ${muted ? "text-ink/30!" : "text-ink!"}`}>
          {prefix}
          {num}
        </span>
        {suffix && (
          <span className="ml-[0.1em] text-[clamp(1.2rem,2.6vw,2rem)] font-semibold leading-none tracking-[-0.04em] text-primary">
            {suffix}
          </span>
        )}
      </div>
      <Kicker>{label}</Kicker>
    </div>
  )
}

function Sparkline({ series, dark }: { series: SeriesPoint[]; dark: boolean }) {
  const empty = series.length === 0
  const max = empty ? 1 : Math.max(...series.map((p) => p.value), 1)
  const pts = empty ? [] : series
  const step = pts.length > 1 ? 100 / (pts.length - 1) : 0
  const line = pts.map((p, i) => `${i * step},${40 - (p.value / max) * 38}`).join(" ")
  const area = pts.length
    ? `0,40 ${line} ${(pts.length - 1) * step},40`
    : ""

  return (
    <div className="h-[clamp(140px,24vh,220px)] w-full">
      {empty ? (
        <div className={`h-full grid place-items-center border-t ${dark ? "border-[#f4f1ea]/15" : "border-ink/10"}`}>
          <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-text-subtle">
            Sin datos en este periodo
          </span>
        </div>
      ) : (
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full" aria-hidden="true">
          <polygon points={area} fill="var(--color-primary)" opacity="0.08" />
          <polyline
            points={line}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
    </div>
  )
}

export function AdminDashboard() {
  const [range, setRange] = useState<string>("28d")
  const [custom, setCustom] = useState<{ start: string; end: string } | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async (query: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/analytics?${query}`, { cache: "no-store" })
      if (res.ok) setData((await res.json()) as AnalyticsData)
      else setData(EMPTY)
    } catch {
      setData(EMPTY)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (custom) load(`start=${custom.start}&end=${custom.end}`)
    else load(`range=${range}`)
  }, [range, custom, load])

  const d = data ?? EMPTY
  const muted = !d.configured

  const rangeLabel = custom
    ? `${custom.start}_${custom.end}`
    : RANGES.find((r) => r.key === range)?.label.replace(/\s/g, "") ?? range

  const exportData = () => ({
    rangeLabel,
    summary: [
      { label: "Visitantes", value: d.users },
      { label: "Páginas vistas", value: d.pageviews },
      { label: "Tasa de rebote", value: d.bounceRate },
      { label: "Sesión media", value: d.avgSession },
    ],
    topPages: d.topPages,
    countries: d.countries,
    cities: d.cities,
  })

  const stats = [
    { label: "Visitantes", value: d.users },
    { label: "Páginas vistas", value: d.pageviews },
    { label: "Tasa de rebote", value: d.bounceRate },
    { label: "Sesión media", value: d.avgSession },
  ]

  return (
    <div className="bg-bg text-ink">
      {/* ── Header band ─────────────────────────────────────── */}
      <div className="px-[clamp(1.4rem,4vw,3rem)] pt-[clamp(1.8rem,5vh,3rem)] pb-[clamp(1.4rem,3vh,2rem)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <div>
            <Kicker>Panel · GA4</Kicker>
            <h1 className="mt-4 text-display max-w-[14ch]">
              Analítica
            </h1>
          </div>
          <div className="flex items-center gap-2 md:pb-2">
            <Button variant="outlined" onClick={() => exportToExcel(exportData())} className="shrink-0">
              Excel
            </Button>
            <Button variant="outlined" onClick={() => exportToPDF(exportData())} className="shrink-0">
              PDF
            </Button>
          </div>
        </div>

        {/* Range selector */}
        <div role="group" aria-label="Rango de fechas" className="mt-9 flex flex-wrap items-center gap-1">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => { setCustom(null); setRange(r.key) }}
              aria-pressed={!custom && range === r.key}
              className={`keyboard-focus-ring font-mono text-[12px] uppercase tracking-[0.14em] px-4 py-2.5 border transition-colors duration-200 ${
                !custom && range === r.key
                  ? "bg-primary border-primary text-text-on-primary"
                  : "border-ink/15 text-ink/55 hover:text-ink hover:border-ink"
              }`}
            >
              {r.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            aria-pressed={!!custom}
            className={`keyboard-focus-ring font-mono text-[12px] uppercase tracking-[0.14em] px-4 py-2.5 border transition-colors duration-200 ${
              custom
                ? "border-primary text-primary"
                : "border-ink/15 text-ink/55 hover:text-ink hover:border-ink"
            }`}
          >
            {custom ? `${custom.start} → ${custom.end}` : "Personalizado"}
          </button>
          {loading && (
            <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-text-subtle self-center ml-2">
              cargando…
            </span>
          )}
        </div>

        {!d.configured && (
          <p className="mt-7 max-w-[64ch] border-l-2 border-primary pl-4 text-body text-ink/65 leading-relaxed">
            Aún no hay datos conectados. Cuando la propiedad de GA4 esté configurada
            y la cuenta de servicio tenga acceso, las métricas aparecerán aquí.
          </p>
        )}
      </div>

      {pickerOpen && (
        <CalendarPicker
          start={custom?.start ?? null}
          end={custom?.end ?? null}
          anchorLabel="Rango personalizado"
          onClose={() => setPickerOpen(false)}
          onApply={(start, end) => {
            setCustom({ start, end })
            setPickerOpen(false)
          }}
        />
      )}

      {/* ── Stats band — dark, full-bleed, like HomeStats ───── */}
      <section
        aria-label="Resumen"
        className="relative isolate overflow-hidden bg-surface/40 text-ink px-[clamp(1.4rem,4vw,3rem)] py-[clamp(2.2rem,5vh,3.5rem)]"
      >
        <div className="mb-10 flex items-end justify-between gap-8">
          <Kicker>Resumen del periodo</Kicker>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/40 text-right">
            Datos GA4 · Canarias
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Stat key={s.label} label={s.label} value={s.value} muted={muted} first={i === 0} />
          ))}
        </div>
      </section>

      {/* ── Visitors over time ──────────────────────────────── */}
      <section
        aria-label="Visitantes por día"
        className="px-[clamp(1.4rem,4vw,3rem)] py-[clamp(2.2rem,5vh,3.5rem)]"
      >
        <div className="mb-7 flex items-end justify-between gap-8">
          <Kicker>Visitantes por día</Kicker>
        </div>
        <Sparkline series={d.series} dark={false} />
      </section>

      {/* ── Top pages — sand band ───────────────────────────── */}
      <section
        aria-label="Páginas más vistas"
        className="bg-surface/40 text-ink px-[clamp(1.4rem,4vw,3rem)] py-[clamp(2.2rem,5vh,3.5rem)]"
      >
        <div className="mb-8">
          <Kicker>Páginas más vistas</Kicker>
        </div>
        {d.topPages.length > 0 ? (
          <ul className="flex flex-col" role="list">
            {d.topPages.map((p, i) => (
              <li
                key={p.path}
                className={`flex items-baseline justify-between gap-4 py-4 ${
                  i < d.topPages.length - 1 ? "border-b border-ink/12" : ""
                }`}
              >
                <span className="flex items-baseline gap-4 truncate">
                  <span className="font-mono text-[12px] text-primary tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-ink/90 truncate">{p.path}</span>
                </span>
                <span className="text-stat text-[clamp(1.4rem,2.4vw,1.9rem)]! text-ink! tabular-nums shrink-0">
                  {p.views}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`flex items-baseline justify-between gap-4 py-4 text-ink/30 ${
                  i < 2 ? "border-b border-ink/12" : ""
                }`}
              >
                <span className="font-mono">—</span>
                <span className="tabular-nums">0</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Geography — map + cities ────────────────────────── */}
      <section
        aria-label="Procedencia"
        className="px-[clamp(1.4rem,4vw,3rem)] py-[clamp(2.2rem,5vh,3.5rem)] grid grid-cols-[1.5fr_1fr] items-stretch gap-[clamp(1.5rem,3vw,2.5rem)] max-[860px]:grid-cols-1"
      >
        <div className="flex flex-col">
          <div className="mb-7">
            <Kicker>De dónde nos visitan</Kicker>
          </div>
          <div className="flex-1">
            <WorldMap countries={d.countries} />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-7">
            <Kicker>Ciudades</Kicker>
          </div>
          <div className="flex-1 border-t border-ink/10">
            {d.cities.length > 0 ? (
              <ul className="flex flex-col" role="list">
                {d.cities.map((c, i) => (
                  <li
                    key={`${c.city}-${c.country}`}
                    className={`flex items-baseline justify-between gap-4 py-3.5 text-body ${
                      i < d.cities.length - 1 ? "border-b border-ink/10" : ""
                    }`}
                  >
                    <span className="truncate">
                      {c.city}
                      <span className="text-text-subtle"> · {c.country}</span>
                    </span>
                    <span className="font-mono tabular-nums text-primary shrink-0">{c.users}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`flex items-baseline justify-between gap-4 py-3.5 text-text-subtle ${
                      i < 4 ? "border-b border-ink/10" : ""
                    }`}
                  >
                    <span>—</span>
                    <span className="tabular-nums">0</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
