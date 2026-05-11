'use client'

import { useEffect, useRef } from 'react'

const SPRITE_SET = { prefix: 'P3', start: 25, end: 46 } as const
const FRAMES_PER_CYCLE = SPRITE_SET.end - SPRITE_SET.start + 1

interface Props {
  birds?:     number
  className?: string
  minSize?:   number
  maxSize?:   number
}

interface Bird {
  px: number
  py: number
  vx: number
  vy: number
  size: number
  frame: number
  frameSpeed: number
  wander: number
}

/* ── Value noise (inline, no deps) ──────────────────────────────────────── */

function hash2(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}
function smoothstep(t: number) { return t * t * (3 - 2 * t) }
function noise2d(x: number, y: number): number {
  const xi = Math.floor(x), yi = Math.floor(y)
  const xf = x - xi,        yf = y - yi
  const a = hash2(xi,     yi    )
  const b = hash2(xi + 1, yi    )
  const c = hash2(xi,     yi + 1)
  const d = hash2(xi + 1, yi + 1)
  const u = smoothstep(xf), v = smoothstep(yf)
  return (1 - v) * ((1 - u) * a + u * b) + v * ((1 - u) * c + u * d)
}

/* 2D curl of a scalar noise field — divergence-free flow */
function curl(x: number, y: number, eps: number): [number, number] {
  const dnDy = (noise2d(x, y + eps) - noise2d(x, y - eps)) / (2 * eps)
  const dnDx = (noise2d(x + eps, y) - noise2d(x - eps, y)) / (2 * eps)
  return [dnDy, -dnDx]
}

export function MouseReactiveFlock({
  birds = 140,
  className = '',
  minSize = 28,
  maxSize = 48,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr     = Math.min(window.devicePixelRatio || 1, 2)

    let width   = 0
    let height  = 0
    let mouseX  = -9999
    let mouseY  = -9999
    let rafId   = 0
    let stopped = false
    let frames: HTMLImageElement[] = []
    const flock: Bird[] = []

    /* ── Flow field ── */
    const NOISE_SCALE = 0.0025     // moderate features → visual variety across canvas
    const TIME_SCALE  = 0.00012
    const NOISE_EPS   = 0.06
    const FLOW_GAIN   = 70
    const DAMP        = 0.93
    const MAX_SPD     = 3.2
    const MIN_SPD     = 1.4

    /* ── Boids ── */
    const NEIGHBOR_R = 380         // wider reach = birds see and group with more peers
    const SEP_R      = 40          // smaller personal space = tighter packing
    const ALIGN_W    = 0.10
    const COH_W      = 0.0006      // ~5× stronger = actual group cohesion
    const SEP_W      = 0.8
    const WANDER_W   = 0.05        // lower wander so birds don't drift away from group
    const WANDER_DRIFT = 0.15

    /* ── Soft center pull (prevents edge sticking) ── */
    const CENTER_PULL = 0.00022

    /* ── Edge handling — soft repulsion ── */
    const EDGE_MARGIN = 120
    const EDGE_W      = 1.8

    /* ── Mouse ── */
    const MOUSE_R = 320      // wider zone of influence
    const MOUSE_F = 4.0      // stronger push

    function resize() {
      const rect = canvas!.getBoundingClientRect()
      width  = rect.width
      height = rect.height
      canvas!.width  = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function spawn() {
      flock.length = 0
      for (let i = 0; i < birds; i++) {
        flock.push({
          px: Math.random() * width,
          py: Math.random() * height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: minSize + Math.random() * (maxSize - minSize),
          frame: Math.random() * FRAMES_PER_CYCLE,
          frameSpeed: 0.22 + Math.random() * 0.12,
          wander: Math.random() * Math.PI * 2,
        })
      }
    }

    function loadFrames(): Promise<HTMLImageElement[]> {
      const imgs: Promise<HTMLImageElement>[] = []
      for (let n = SPRITE_SET.start; n <= SPRITE_SET.end; n++) {
        const img = new Image()
        img.src = `/assets/images/common/pajaros/${SPRITE_SET.prefix}/${SPRITE_SET.prefix}-${String(n).padStart(2, '0')}.png`
        imgs.push(new Promise<HTMLImageElement>((res, rej) => {
          img.onload  = () => res(img)
          img.onerror = () => rej(new Error(img.src))
        }))
      }
      return Promise.all(imgs)
    }

    function step(tMs: number) {
      if (stopped) return
      const t = tMs * TIME_SCALE
      // Lissajous-style time offset — field oscillates in noise space instead of
      // translating linearly, so the curl pattern has no net direction bias.
      const tx = Math.sin(t * 0.6) * 4
      const ty = Math.cos(t * 0.5) * 4

      for (let i = 0; i < flock.length; i++) {
        const b = flock[i]

        // Sample curl noise at bird position (evolves over time without drift)
        const nx = b.px * NOISE_SCALE
        const ny = b.py * NOISE_SCALE
        const [cx, cy] = curl(nx + tx, ny + ty, NOISE_EPS)

        // Pass 1: curl flow drives the smooth underlying current (through damping)
        const targetVx = cx * FLOW_GAIN
        const targetVy = cy * FLOW_GAIN
        b.vx = b.vx * DAMP + targetVx * (1 - DAMP)
        b.vy = b.vy * DAMP + targetVy * (1 - DAMP)

        // Pass 2: boids forces applied DIRECTLY (not damped) for visible wave coherence
        let aliX = 0, aliY = 0
        let cohX = 0, cohY = 0
        let sepX = 0, sepY = 0
        let nCount = 0
        let sCount = 0
        for (let j = 0; j < flock.length; j++) {
          if (i === j) continue
          const o = flock[j]
          const dx = o.px - b.px
          const dy = o.py - b.py
          const d  = Math.hypot(dx, dy)
          if (d < NEIGHBOR_R) {
            aliX += o.vx; aliY += o.vy
            cohX += o.px; cohY += o.py
            nCount++
            if (d < SEP_R && d > 0) {
              const w = (SEP_R - d) / SEP_R
              sepX -= (dx / d) * w
              sepY -= (dy / d) * w
              sCount++
            }
          }
        }

        if (nCount > 0) {
          // Alignment: pull velocity toward avg neighbor velocity
          b.vx += ((aliX / nCount) - b.vx) * ALIGN_W
          b.vy += ((aliY / nCount) - b.vy) * ALIGN_W
          // Cohesion: pull position toward neighbor centroid (small)
          b.vx += ((cohX / nCount) - b.px) * COH_W
          b.vy += ((cohY / nCount) - b.py) * COH_W
        }
        if (sCount > 0) {
          b.vx += sepX * SEP_W
          b.vy += sepY * SEP_W
        }

        // Per-bird wander — random meander to break regular formation
        b.wander += (Math.random() - 0.5) * WANDER_DRIFT
        b.vx += Math.cos(b.wander) * WANDER_W
        b.vy += Math.sin(b.wander) * WANDER_W

        // Soft pull toward canvas center — prevents birds from settling against edges
        b.vx += (width  / 2 - b.px) * CENTER_PULL
        b.vy += (height / 2 - b.py) * CENTER_PULL

        // Birds may overflow 10% on the sides, but never above/below the canvas
        const padX = width * 0.10
        const xMin = -padX, xMax = width + padX
        const yMin = 0,     yMax = height

        // Edge repulsion — engages within EDGE_MARGIN of the extended bounds
        if (b.px > xMax - EDGE_MARGIN) b.vx -= EDGE_W * ((b.px - (xMax - EDGE_MARGIN)) / EDGE_MARGIN)
        if (b.px < xMin + EDGE_MARGIN) b.vx += EDGE_W * (((xMin + EDGE_MARGIN) - b.px) / EDGE_MARGIN)
        if (b.py > yMax - EDGE_MARGIN) b.vy -= EDGE_W * ((b.py - (yMax - EDGE_MARGIN)) / EDGE_MARGIN)
        if (b.py < yMin + EDGE_MARGIN) b.vy += EDGE_W * (((yMin + EDGE_MARGIN) - b.py) / EDGE_MARGIN)

        // Mouse repel
        if (mouseX > -9000) {
          const mdx = b.px - mouseX
          const mdy = b.py - mouseY
          const md  = Math.hypot(mdx, mdy)
          if (md < MOUSE_R && md > 0.01) {
            const f = (1 - md / MOUSE_R) * MOUSE_F
            b.vx += (mdx / md) * f
            b.vy += (mdy / md) * f
          }
        }

        // Mild vertical damping — real birds prefer horizontal travel
        b.vy *= 0.97

        // Speed clamp
        const spd = Math.hypot(b.vx, b.vy)
        if (spd > MAX_SPD) {
          b.vx = (b.vx / spd) * MAX_SPD
          b.vy = (b.vy / spd) * MAX_SPD
        } else if (spd < MIN_SPD) {
          const ang = Math.atan2(b.vy, b.vx)
          b.vx = Math.cos(ang) * MIN_SPD
          b.vy = Math.sin(ang) * MIN_SPD
        }

        b.px += b.vx
        b.py += b.vy

        // Hard clamp at the extended bounds (10% overflow allowed)
        if (b.px < xMin) { b.px = xMin; if (b.vx < 0) b.vx = -b.vx * 0.6 }
        if (b.px > xMax) { b.px = xMax; if (b.vx > 0) b.vx = -b.vx * 0.6 }
        if (b.py < yMin) { b.py = yMin; if (b.vy < 0) b.vy = -b.vy * 0.6 }
        if (b.py > yMax) { b.py = yMax; if (b.vy > 0) b.vy = -b.vy * 0.6 }

        b.frame = (b.frame + b.frameSpeed) % FRAMES_PER_CYCLE
      }

      ctx!.clearRect(0, 0, width, height)
      if (frames.length) {
        for (const b of flock) {
          const img = frames[Math.floor(b.frame) % frames.length]
          if (!img) continue
          // P3 is a SIDE-PROFILE bird with head LEFT, belly DOWN.
          // Horizontal flip handles left/right facing; tilt handles small climb/dive.
          // Clamp tilt to ±~30° — real birds don't face straight up or down even when
          // their trajectory is vertical.
          const rawTilt   = Math.atan2(-b.vy, Math.abs(b.vx))
          const MAX_TILT  = Math.PI / 12 // 15° — birds barely tilt; mostly horizontal
          const tilt      = Math.max(-MAX_TILT, Math.min(MAX_TILT, rawTilt))
          ctx!.save()
          ctx!.translate(b.px, b.py)
          if (b.vx >= 0) ctx!.scale(-1, 1)
          ctx!.rotate(tilt)
          ctx!.drawImage(img, -b.size / 2, -b.size / 2, b.size, b.size)
          ctx!.restore()
        }
      }

      rafId = requestAnimationFrame(step)
    }

    // Window-level mouse tracking — works even when canvas has pointer-events: none
    function onMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      if (x < -50 || x > rect.width + 50 || y < -50 || y > rect.height + 50) {
        mouseX = -9999
        mouseY = -9999
      } else {
        mouseX = x
        mouseY = y
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })

    const ro = new ResizeObserver(() => {
      resize()
      if (flock.length === 0) spawn()
    })
    ro.observe(canvas)
    resize()

    loadFrames()
      .then((imgs) => {
        if (stopped) return
        frames = imgs
        spawn()
        if (!reduced) rafId = requestAnimationFrame(step)
        else step(0)
      })
      .catch(() => { /* silent */ })

    return () => {
      stopped = true
      cancelAnimationFrame(rafId)
      ro.disconnect()
      window.removeEventListener('mousemove', onMove)
    }
  }, [birds, minSize, maxSize])

  return <canvas ref={canvasRef} className={`block ${className}`} />

}
