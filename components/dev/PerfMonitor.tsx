'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface Metrics {
  fps: number
  fcp: number | null
  lcp: number | null
  cls: number
  inp: number | null
  ttfb: number | null
  longTasks: number
  memoryMB: number | null
  jsHeapLimitMB: number | null
}

interface LogEntry {
  time: string
  label: string
  value: string
  warn: boolean
}

const THRESHOLDS = {
  fps:       { warn: 30, bad: 20 },
  fcp:       { warn: 1800, bad: 3000 },
  lcp:       { warn: 2500, bad: 4000 },
  cls:       { warn: 0.1,  bad: 0.25 },
  inp:       { warn: 200,  bad: 500 },
  ttfb:      { warn: 800,  bad: 1800 },
  longTasks: { warn: 3,    bad: 8 },
}

function color(metric: keyof typeof THRESHOLDS, val: number): string {
  const t = THRESHOLDS[metric]
  if (val >= t.bad)  return '#f87171'
  if (val >= t.warn) return '#fbbf24'
  return '#4ade80'
}

function fmt(val: number | null, unit: string): string {
  if (val === null) return '–'
  return `${Math.round(val)}${unit}`
}

export default function PerfMonitor() {
  const [metrics, setMetrics] = useState<Metrics>({
    fps: 0, fcp: null, lcp: null, cls: 0,
    inp: null, ttfb: null, longTasks: 0, memoryMB: null, jsHeapLimitMB: null,
  })
  const [log, setLog] = useState<LogEntry[]>([])
  const [open, setOpen] = useState(true)
  const [tab, setTab] = useState<'metrics' | 'log'>('metrics')

  const clsRef      = useRef(0)
  const longRef     = useRef(0)
  const frameRef    = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const frameCount  = useRef(0)

  const addLog = useCallback((label: string, value: string, warn = false) => {
    const time = new Date().toLocaleTimeString('en', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    setLog(prev => [{ time, label, value, warn }, ...prev].slice(0, 60))
  }, [])

  useEffect(() => {
    // FPS loop
    let rafId: number
    function tick(now: number) {
      frameCount.current++
      const elapsed = now - lastTimeRef.current
      if (elapsed >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / elapsed)
        frameCount.current = 0
        lastTimeRef.current = now
        setMetrics(m => ({ ...m, fps }))
        if (fps < THRESHOLDS.fps.warn) addLog('FPS drop', `${fps} fps`, true)

        // memory (Chrome only)
        const mem = (performance as any).memory
        if (mem) {
          const used  = mem.usedJSHeapSize  / 1048576
          const limit = mem.jsHeapSizeLimit / 1048576
          setMetrics(m => ({ ...m, memoryMB: used, jsHeapLimitMB: limit }))
        }
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    // TTFB + FCP from navigation/paint entries
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    if (navEntry) {
      const ttfb = navEntry.responseStart - navEntry.requestStart
      setMetrics(m => ({ ...m, ttfb }))
      addLog('TTFB', `${Math.round(ttfb)}ms`, ttfb > THRESHOLDS.ttfb.warn)
    }

    const paintEntries = performance.getEntriesByType('paint')
    const fcpEntry = paintEntries.find(e => e.name === 'first-contentful-paint')
    if (fcpEntry) {
      setMetrics(m => ({ ...m, fcp: fcpEntry.startTime }))
      addLog('FCP', `${Math.round(fcpEntry.startTime)}ms`, fcpEntry.startTime > THRESHOLDS.fcp.warn)
    }

    // LCP
    let lcpObs: PerformanceObserver | null = null
    try {
      lcpObs = new PerformanceObserver(list => {
        const entries = list.getEntries()
        const last = entries[entries.length - 1] as any
        const val = last.startTime as number
        setMetrics(m => ({ ...m, lcp: val }))
        addLog('LCP', `${Math.round(val)}ms`, val > THRESHOLDS.lcp.warn)
      })
      lcpObs.observe({ type: 'largest-contentful-paint', buffered: true })
    } catch {}

    // CLS
    let clsObs: PerformanceObserver | null = null
    try {
      clsObs = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          const e = entry as any
          if (!e.hadRecentInput) {
            clsRef.current += e.value
            setMetrics(m => ({ ...m, cls: clsRef.current }))
            if (e.value > 0.01) addLog('CLS shift', e.value.toFixed(4), clsRef.current > THRESHOLDS.cls.warn)
          }
        }
      })
      clsObs.observe({ type: 'layout-shift', buffered: true })
    } catch {}

    // INP
    let inpObs: PerformanceObserver | null = null
    try {
      inpObs = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          const e = entry as any
          const dur = e.processingEnd - e.startTime
          setMetrics(m => ({ ...m, inp: dur }))
          if (dur > THRESHOLDS.inp.warn) addLog('INP', `${Math.round(dur)}ms  [${e.name}]`, true)
        }
      })
      inpObs.observe({ type: 'event', buffered: true, durationThreshold: 40 } as any)
    } catch {}

    // Long tasks
    let ltObs: PerformanceObserver | null = null
    try {
      ltObs = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          longRef.current++
          setMetrics(m => ({ ...m, longTasks: longRef.current }))
          addLog('Long task', `${Math.round(entry.duration)}ms`, true)
        }
      })
      ltObs.observe({ type: 'longtask', buffered: true })
    } catch {}

    return () => {
      cancelAnimationFrame(rafId)
      lcpObs?.disconnect()
      clsObs?.disconnect()
      inpObs?.disconnect()
      ltObs?.disconnect()
    }
  }, [addLog])

  const rows: { label: string; val: string; metricKey?: keyof typeof THRESHOLDS; raw?: number }[] = [
    { label: 'FPS',        val: `${metrics.fps}`,                    metricKey: 'fps',       raw: metrics.fps },
    { label: 'FCP',        val: fmt(metrics.fcp, 'ms'),              metricKey: 'fcp',       raw: metrics.fcp ?? 0 },
    { label: 'LCP',        val: fmt(metrics.lcp, 'ms'),              metricKey: 'lcp',       raw: metrics.lcp ?? 0 },
    { label: 'CLS',        val: metrics.cls.toFixed(4),              metricKey: 'cls',       raw: metrics.cls },
    { label: 'INP',        val: fmt(metrics.inp, 'ms'),              metricKey: 'inp',       raw: metrics.inp ?? 0 },
    { label: 'TTFB',       val: fmt(metrics.ttfb, 'ms'),             metricKey: 'ttfb',      raw: metrics.ttfb ?? 0 },
    { label: 'Long tasks', val: `${metrics.longTasks}`,              metricKey: 'longTasks', raw: metrics.longTasks },
    { label: 'JS heap',    val: metrics.memoryMB ? `${metrics.memoryMB.toFixed(1)} / ${metrics.jsHeapLimitMB?.toFixed(0)} MB` : '–' },
  ]

  return (
    <div
      style={{
        position: 'fixed', bottom: 12, right: 12, zIndex: 99999,
        fontFamily: 'monospace', fontSize: 11,
        background: 'rgba(10,10,10,0.92)', border: '1px solid #333',
        borderRadius: 8, minWidth: 220, maxWidth: 280,
        boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
        backdropFilter: 'blur(6px)',
      }}
    >
      {/* header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 10px', cursor: 'pointer', borderBottom: open ? '1px solid #222' : 'none',
          userSelect: 'none',
        }}
      >
        <span style={{ color: '#a3e635', fontWeight: 700, letterSpacing: 1, fontSize: 10 }}>⚡ PERF</span>
        <span style={{ color: '#555' }}>{open ? '▾' : '▸'}</span>
      </div>

      {open && (
        <>
          {/* tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #222' }}>
            {(['metrics', 'log'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1, padding: '4px 0', background: 'none', border: 'none',
                  color: tab === t ? '#fff' : '#555', cursor: 'pointer',
                  borderBottom: tab === t ? '2px solid #a3e635' : '2px solid transparent',
                  fontSize: 10, textTransform: 'uppercase', letterSpacing: 1,
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === 'metrics' && (
            <div style={{ padding: '6px 0' }}>
              {rows.map(({ label, val, metricKey, raw }) => {
                const c = metricKey && raw !== undefined ? color(metricKey, raw) : '#9ca3af'
                return (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 10px' }}>
                    <span style={{ color: '#6b7280' }}>{label}</span>
                    <span style={{ color: c, fontWeight: 600 }}>{val}</span>
                  </div>
                )
              })}
            </div>
          )}

          {tab === 'log' && (
            <div style={{ maxHeight: 200, overflowY: 'auto', padding: '4px 0' }}>
              {log.length === 0 && (
                <div style={{ color: '#4b5563', padding: '6px 10px', fontSize: 10 }}>No events yet</div>
              )}
              {log.map((e, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, padding: '2px 10px', alignItems: 'baseline' }}>
                  <span style={{ color: '#374151', flexShrink: 0 }}>{e.time}</span>
                  <span style={{ color: e.warn ? '#fbbf24' : '#6b7280', flexShrink: 0 }}>{e.label}</span>
                  <span style={{ color: e.warn ? '#f87171' : '#4ade80', marginLeft: 'auto', flexShrink: 0 }}>{e.value}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ padding: '4px 10px', borderTop: '1px solid #1a1a1a' }}>
            <div style={{ display: 'flex', gap: 8, fontSize: 9, color: '#374151' }}>
              <span style={{ color: '#4ade80' }}>● good</span>
              <span style={{ color: '#fbbf24' }}>● warn</span>
              <span style={{ color: '#f87171' }}>● bad</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
