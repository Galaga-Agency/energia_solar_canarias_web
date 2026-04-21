'use client'

import { ScrollTrigger }          from '@/lib/gsap'
import { prefersReducedMotion }   from '@/utils/animations/motionPrefs'

const FLOCK_SRC = '/assets/images/home/new-birds.svg'
const DEFAULT_VIEW_BOX = '0 0 1440 1546'
const BIRD_FILL = '#593C3C'
const CANVAS_DPR_LIMIT = 1.25

const splitPathIntoBirds = (pathData: string) =>
  pathData.match(/M[^M]+/g)
    ?.map((path) => path.trim())
    .filter((path) => path.length > 0 && !path.startsWith('M1440 '))
    ?? []

const getStablePathScore = (path: string, index: number) => {
  let hash = index + 1

  for (let i = 0; i < path.length; i += 17) {
    hash = (hash * 31 + path.charCodeAt(i)) % 1000003
  }

  return hash
}

const seededRange = (seed: number, salt: number, min: number, max: number) => {
  const value = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453
  const normalized = value - Math.floor(value)

  return min + normalized * (max - min)
}

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1)

const smoothstep = (value: number) => {
  const clamped = clamp01(value)

  return clamped * clamped * (3 - 2 * clamped)
}

const parseViewBox = (value: string) => {
  const [x = 0, y = 0, width = 1440, height = 1546] = value
    .split(/\s+/)
    .map((part) => Number.parseFloat(part))

  return { x, y, width, height }
}

const SVG_NS = 'http://www.w3.org/2000/svg'

const getPathBounds = (svg: SVGSVGElement, path: string) => {
  const element = document.createElementNS(SVG_NS, 'path')
  element.setAttribute('d', path)
  svg.appendChild(element)
  const bounds = element.getBBox()
  svg.removeChild(element)

  return bounds
}

export function initBirdFlockAnimation(): () => void {
  const root = document.querySelector<HTMLElement>('[data-bird-flock]')
  const canvas = root?.querySelector<HTMLCanvasElement>('[data-bird-flock-canvas]')
  const triggerElement = root?.closest<HTMLElement>('[data-bird-flock-stage]') ?? root

  if (!root || !canvas || !triggerElement) return () => {}

  const abortController = new AbortController()
  let cleanup: (() => void) | undefined

  const load = () => {
    fetch(FLOCK_SRC, { signal: abortController.signal })
      .then((response) => response.text())
      .then((svgText) => {
        if (abortController.signal.aborted) return
        cleanup = initBirdFlockCanvas({ canvas, svgText, triggerElement })
      })
      .catch(() => {})
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        observer.disconnect()
        load()
      }
    },
    { rootMargin: '300px' },
  )
  observer.observe(triggerElement)

  return () => {
    observer.disconnect()
    abortController.abort()
    cleanup?.()
  }
}

function initBirdFlockCanvas({
  canvas,
  svgText,
  triggerElement,
}: {
  canvas: HTMLCanvasElement
  svgText: string
  triggerElement: HTMLElement
}) {
  const context = canvas.getContext('2d')

  if (!context) return () => {}

  const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml')
  const svg = doc.querySelector('svg')
  const birdLayer = doc.querySelector('path')
  const pathData = birdLayer?.getAttribute('d') ?? ''
  const viewBoxRect = parseViewBox(svg?.getAttribute('viewBox') ?? DEFAULT_VIEW_BOX)

  if (!svg) return () => {}

  const reduceMotion = prefersReducedMotion()
  const birds = splitPathIntoBirds(pathData).map((path, index) => {
    const seed = getStablePathScore(path, index)
    const bounds = getPathBounds(svg, path)
    const hingeX = bounds.x + bounds.width * 0.5
    const hingeY = bounds.y + bounds.height * 0.38
    const bodyWidth = Math.max(bounds.width * 0.14, 3)

    return {
      bounds,
      hingeX,
      hingeY,
      bodyWidth,
      shape: new Path2D(path),
      finalOpacity: seededRange(seed, 1, 0.08, 0.16),
      revealStart: seededRange(seed, 2, 0.05, 0.38),
      revealDuration: seededRange(seed, 3, 0.08, 0.18),
      flightX: seededRange(seed, 4, -860, -360),
      flightY: seededRange(seed, 5, -20, 20),
      flightStart: seededRange(seed, 6, 0, 0.06),
      flightDuration: seededRange(seed, 7, 0.68, 1.12),
      flapSpeed: seededRange(seed, 8, 2.8, 4.4),
      flapOffset: seededRange(seed, 9, 0, Math.PI * 2),
      flapAngle: seededRange(seed, 10, 0.09, 0.22),
      flapLift: seededRange(seed, 11, 0.02, 0.08),
    }
  })

  let targetProgress = 0
  let currentProgress = 0
  let maxRevealProgress = reduceMotion ? 1 : 0
  let frame: number | null = null
  let lastTimestamp = 0
  let elapsedTime = 0
  let canvasWidth = 0
  let canvasHeight = 0
  let pixelRatio = 1
  let isActive = false

  const resizeCanvas = () => {
    const rect = canvas.getBoundingClientRect()
    pixelRatio = Math.min(window.devicePixelRatio || 1, CANVAS_DPR_LIMIT)
    canvasWidth = rect.width
    canvasHeight = rect.height
    canvas.width = Math.max(Math.round(canvasWidth * pixelRatio), 1)
    canvas.height = Math.max(Math.round(canvasHeight * pixelRatio), 1)
  }

  const draw = (time: number) => {
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.save()
    context.scale(pixelRatio, pixelRatio)

    const scale = Math.max(canvasWidth / viewBoxRect.width, canvasHeight / viewBoxRect.height)
    const xOffset = (canvasWidth - viewBoxRect.width * scale) / 2 - viewBoxRect.x * scale
    const yOffset = (canvasHeight - viewBoxRect.height * scale) / 2 - viewBoxRect.y * scale

    context.translate(xOffset, yOffset)
    context.scale(scale, scale)
    context.fillStyle = BIRD_FILL

    birds.forEach((bird) => {
      const revealProgress = reduceMotion
        ? 1
        : smoothstep((maxRevealProgress - bird.revealStart) / bird.revealDuration)

      if (revealProgress <= 0) return

      const flightProgress = reduceMotion
        ? 0
        : clamp01((currentProgress - bird.flightStart) / bird.flightDuration)
      const flap = reduceMotion ? 0 : Math.sin(time * bird.flapSpeed + bird.flapOffset)
      const flapAngle = flap * bird.flapAngle * smoothstep(revealProgress)
      const flapLift = Math.abs(flap) * bird.bounds.height * bird.flapLift

      context.save()
      context.globalAlpha = bird.finalOpacity * revealProgress
      context.translate(bird.flightX * flightProgress, bird.flightY * flightProgress)

      context.save()
      context.beginPath()
      context.rect(
        bird.bounds.x,
        bird.bounds.y,
        Math.max(bird.hingeX - bird.bodyWidth * 0.5 - bird.bounds.x, 1),
        bird.bounds.height,
      )
      context.clip()
      context.translate(bird.hingeX, bird.hingeY)
      context.rotate(-flapAngle)
      context.translate(0, -flapLift)
      context.translate(-bird.hingeX, -bird.hingeY)
      context.fill(bird.shape)
      context.restore()

      context.save()
      context.beginPath()
      context.rect(
        bird.hingeX + bird.bodyWidth * 0.5,
        bird.bounds.y,
        Math.max(bird.bounds.x + bird.bounds.width - (bird.hingeX + bird.bodyWidth * 0.5), 1),
        bird.bounds.height,
      )
      context.clip()
      context.translate(bird.hingeX, bird.hingeY)
      context.rotate(flapAngle)
      context.translate(0, -flapLift)
      context.translate(-bird.hingeX, -bird.hingeY)
      context.fill(bird.shape)
      context.restore()

      context.save()
      context.beginPath()
      context.rect(
        bird.hingeX - bird.bodyWidth * 0.5,
        bird.bounds.y,
        bird.bodyWidth,
        bird.bounds.height,
      )
      context.clip()
      context.fill(bird.shape)
      context.restore()

      context.restore()
    })

    context.restore()
  }

  const tick = (timestamp: number) => {
    frame = null
    if (lastTimestamp === 0) lastTimestamp = timestamp
    const delta = Math.min((timestamp - lastTimestamp) / 1000, 0.05)
    lastTimestamp = timestamp
    elapsedTime += delta
    currentProgress += (targetProgress - currentProgress) * 0.08
    draw(elapsedTime)

    const isSettling = Math.abs(targetProgress - currentProgress) > 0.001
    if (isActive || isSettling) frame = requestAnimationFrame(tick)
  }

  const requestDraw = () => {
    if (frame === null) frame = requestAnimationFrame(tick)
  }

  resizeCanvas()
  draw(elapsedTime)

  const resizeObserver = new ResizeObserver(() => {
    resizeCanvas()
    draw(elapsedTime)
  })

  resizeObserver.observe(canvas)

  const trigger = ScrollTrigger.create({
    trigger: triggerElement,
    start: 'top 45%',
    end: 'bottom top',
    onToggle: (self) => {
      isActive = self.isActive
      requestDraw()
    },
    onUpdate: (self) => {
      targetProgress = self.progress
      maxRevealProgress = Math.max(maxRevealProgress, self.progress)
      requestDraw()
    },
  })

  isActive = trigger.isActive
  targetProgress = trigger.progress
  currentProgress = trigger.progress
  maxRevealProgress = Math.max(maxRevealProgress, trigger.progress)
  draw(elapsedTime)

  return () => {
    if (frame !== null) cancelAnimationFrame(frame)
    resizeObserver.disconnect()
    trigger.kill()
  }
}
