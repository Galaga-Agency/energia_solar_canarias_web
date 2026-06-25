"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useField, useFormFields } from "@payloadcms/ui"

export function HeroImagePositionField() {
  const { value, setValue } = useField<string>({ path: "heroImagePosition" })

  const heroImageField = useFormFields(([fields]) => fields["heroImage"])
  const heroImageValue = heroImageField?.value

  function extractId(val: unknown): string | null {
    if (!val) return null
    if (typeof val === "string" || typeof val === "number") return String(val)
    if (typeof val === "object") {
      const obj = val as Record<string, unknown>
      if (obj.id != null) return String(obj.id)
      if (obj.value != null) return extractId(obj.value)
    }
    return null
  }

  const mediaId = extractId(heroImageValue)
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!mediaId) { setImageSrc(null); return }
    let cancelled = false
    fetch(`/api/media/${mediaId}`)
      .then(r => r.ok ? r.json() : null)
      .then((data: { filename?: string } | null) => {
        if (!cancelled && data?.filename) setImageSrc(`/api/media/file/${data.filename}`)
      })
      .catch(() => null)
    return () => { cancelled = true }
  }, [mediaId])

  function parsePosition(val: string): { x: number; y: number } {
    if (!val || val === "center") return { x: 0.5, y: 0.5 }
    const parts = val.trim().split(/\s+/)
    const p = (s: string) => {
      if (s === "left" || s === "top") return 0
      if (s === "right" || s === "bottom") return 1
      if (s === "center") return 0.5
      if (s.endsWith("%")) return parseFloat(s) / 100
      return 0.5
    }
    return parts.length === 1 ? { x: 0.5, y: p(parts[0]) } : { x: p(parts[0]), y: p(parts[1]) }
  }

  const [pos, setPos] = useState(() => parsePosition(value ?? "center"))
  const containerRef  = useRef<HTMLDivElement>(null)
  const dragStart     = useRef<{ mx: number; my: number; px: number; py: number } | null>(null)

  useEffect(() => {
    setPos(parsePosition(value ?? "center"))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const commit = useCallback((x: number, y: number) => {
    const cx = Math.round(Math.max(0, Math.min(1, x)) * 100)
    const cy = Math.round(Math.max(0, Math.min(1, y)) * 100)
    setPos({ x: cx / 100, y: cy / 100 })
    setValue(`${cx}% ${cy}%`)
  }, [setValue])

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y }
  }

  useEffect(() => {
    const el = containerRef.current

    const onMove = (e: MouseEvent) => {
      if (!dragStart.current || !el) return
      const rect  = el.getBoundingClientRect()
      const dx    = (e.clientX - dragStart.current.mx) / rect.width
      const dy    = (e.clientY - dragStart.current.my) / rect.height
      // dragging right → image moves right → focal point moves left
      commit(dragStart.current.px - dx, dragStart.current.py - dy)
    }

    const onUp = () => { dragStart.current = null }

    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup",   onUp)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup",   onUp)
    }
  }, [commit])

  const xPct = Math.round(pos.x * 100)
  const yPct = Math.round(pos.y * 100)

  return (
    <div className="field-type" style={{ marginBottom: "1.5rem" }}>
      <label className="field-label">Encuadre de la imagen principal</label>
      <p className="field-description" style={{ marginBottom: "0.75rem" }}>
        Arrastra la imagen para elegir qué parte se ve en la cabecera.
      </p>

      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        style={{
          position:     "relative",
          width:        "100%",
          aspectRatio:  "16/7",
          borderRadius: "0.5rem",
          overflow:     "hidden",
          background:   "#111",
          border:       "1px solid var(--theme-elevation-150, #ddd)",
          cursor:       dragStart.current ? "grabbing" : "grab",
          userSelect:   "none",
        }}
      >
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt=""
            draggable={false}
            style={{
              position:       "absolute",
              inset:          0,
              width:          "100%",
              height:         "100%",
              objectFit:      "cover",
              objectPosition: `${xPct}% ${yPct}%`,
              pointerEvents:  "none",
              userSelect:     "none",
            }}
          />
        ) : (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#666", fontSize: "0.8rem",
          }}>
            {mediaId ? "Cargando imagen…" : "Selecciona primero la imagen principal"}
          </div>
        )}
      </div>

      <p style={{ marginTop: "0.4rem", fontSize: "0.75rem", color: "#888" }}>
        {xPct}% horizontal · {yPct}% vertical
      </p>
    </div>
  )
}
