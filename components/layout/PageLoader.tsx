'use client'

import { useContext, useEffect, useRef, useState } from 'react'
import { useAppReady } from '@/hooks/useAppReady'
import { AppReadyContext } from '@/contexts/AppReadyContext'
import { Logo } from '@/components/shared/Logo'

const SIM_TARGET   = 86
const SIM_DURATION = 2200
const SNAP_MS      = 380
const HOLD_MS      = 260
const EXIT_MS      = 950

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

export function PageLoader() {
  const loadingComplete = useAppReady()
  const ctx0 = useContext(AppReadyContext)
  if (!ctx0) throw new Error('PageLoader must be used inside AppReadyProvider')
  const { markLoaderGone } = ctx0
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'loading' | 'exiting' | 'gone'>('loading')
  const progressRef = useRef(0)

  /* ── Counter sim ── */
  useEffect(() => {
    let rafId = 0
    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / SIM_DURATION)
      const value = Math.round(easeOutCubic(t) * SIM_TARGET)
      progressRef.current = value
      setProgress(value)
      if (t < 1 && !loadingComplete) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [loadingComplete])

  /* ── Snap to 100 → hold → curtain rises ── */
  useEffect(() => {
    if (!loadingComplete) return

    let rafId = 0
    const from = progressRef.current
    const start = performance.now()

    const snap = (now: number) => {
      const t = Math.min(1, (now - start) / SNAP_MS)
      const value = Math.round(from + (100 - from) * easeOutCubic(t))
      progressRef.current = value
      setProgress(value)
      if (t < 1) rafId = requestAnimationFrame(snap)
    }
    rafId = requestAnimationFrame(snap)

    const exitTimer   = setTimeout(() => setPhase('exiting'), SNAP_MS + HOLD_MS)
    const removeTimer = setTimeout(() => {
      setPhase('gone')
      markLoaderGone()
    }, SNAP_MS + HOLD_MS + EXIT_MS)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(exitTimer)
      clearTimeout(removeTimer)
    }
  }, [loadingComplete, markLoaderGone])

  if (phase === 'gone') return null

  const exiting = phase === 'exiting'

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden bg-[#f4f1ea] transition-transform ease-[cubic-bezier(0.76,0,0.24,1)]"
      style={{
        zIndex: 'var(--z-overlay)',
        transform: exiting ? 'translateY(-100%)' : 'translateY(0)',
        transitionDuration: `${EXIT_MS}ms`,
      }}
    >
      {/* Paper texture — same overlay as the rest of the site */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-30 bg-[url('/assets/images/common/white-paper-texture.jpg')] bg-cover bg-center"
      />

      <div className="section-inner relative flex h-full flex-col">

        {/* TOP — brand mark */}
        <div className="pt-12 md:pt-20">
          <Logo width={160} />
        </div>

        {/* CENTER — editorial statement */}
        <div className="my-auto max-w-[22ch]">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-label text-ink/65! font-mono">
              Cargando experiencia
            </span>
          </div>

          <h1 className="text-display text-ink!">
            Energía libre.<br />
            <span className="text-primary! italic">Tuya.</span>
          </h1>
        </div>

        {/* BOTTOM — progress hairline + counter */}
        <div className="pb-12 md:pb-20">
          <div className="mb-5 flex items-end justify-between">
            <span className="text-label text-ink/55! font-mono">
              Energía Solar Canarias · 2026
            </span>
            <span
              aria-hidden
              className="text-stat text-ink! font-mono tabular-nums leading-none"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {String(progress).padStart(3, '0')}
              <span className="text-ink/35!">%</span>
            </span>
          </div>

          <div className="relative h-px w-full bg-ink/15">
            <div
              className="absolute inset-y-0 left-0 bg-primary transition-[width] duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  )
}
