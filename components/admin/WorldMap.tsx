"use client"
import { useEffect, useRef } from "react"
import "jsvectormap/dist/jsvectormap.css"
import {
  buildWorldMapValues,
  getCountryNameFromIso,
  getWorldMapPrimaryColor,
  renderWorldMapTooltip,
  type WorldMapCountry,
} from "@/utils/world-map"

export function WorldMap({ countries }: { countries: WorldMapCountry[] }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<{ destroy: () => void } | null>(null)

  useEffect(() => {
    if (!mapRef.current) return
    let cancelled = false

    ;(async () => {
      // @ts-expect-error - jsvectormap ships no types
      const { default: jsVectorMap } = await import("jsvectormap")
      // @ts-expect-error - world map registers as a side-effect
      await import("jsvectormap/dist/maps/world")
      if (cancelled || !mapRef.current) return

      if (mapInstance.current) {
        try { mapInstance.current.destroy() } catch { /* noop */ }
        mapInstance.current = null
      }
      // Strict Mode runs effects twice; wipe any SVG left by a prior run.
      mapRef.current.innerHTML = ""

      const values = buildWorldMapValues(countries)
      const primary = getWorldMapPrimaryColor()

      mapInstance.current = new jsVectorMap({
        selector: mapRef.current,
        map: "world",
        backgroundColor: "transparent",
        visualizeData: { scale: ["#d8cbb5", primary], values },
        regionStyle: {
          initial: { fill: "var(--color-surface)", stroke: "var(--color-bg)", strokeWidth: 1 },
          hover: { fillOpacity: 0.85, cursor: "pointer" },
        },
        onRegionTooltipShow(
          event: Event,
          tooltip: { text: (s: string, html?: boolean) => void },
          code: string
        ) {
          const name = getCountryNameFromIso(code)
          const users = values[code]
          if (users && name) {
            tooltip.text(renderWorldMapTooltip(name, users), true)
          } else {
            event.preventDefault()
          }
        },
        zoomOnScroll: false,
        zoomButtons: false,
      })
    })()

    const node = mapRef.current
    return () => {
      cancelled = true
      if (mapInstance.current) {
        try { mapInstance.current.destroy() } catch { /* noop */ }
        mapInstance.current = null
      }
      if (node) node.innerHTML = ""
    }
  }, [countries])

  return (
    <div className="relative h-full flex flex-col border-t border-ink/10 pt-4">
      <div ref={mapRef} className="w-full flex-1 min-h-[clamp(300px,42vh,520px)]" />
      {countries.length === 0 && (
        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-text-subtle mt-3">
          Sin datos geográficos en este periodo
        </p>
      )}
    </div>
  )
}
