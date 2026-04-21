'use client'

import { ScrollTrigger }        from '@/lib/gsap'
import { prefersReducedMotion } from '@/utils/animations/motionPrefs'

const FLOCK_SRC = '/assets/images/home/new-birds.svg'
const DEFAULT_VIEW_BOX = '0 0 1440 1546'
const BIRD_FILL = '#593C3C'
const CANVAS_DPR_LIMIT = 1.25
const SVG_NS = 'http://www.w3.org/2000/svg'
const ANIMATED_BIRD_COUNT = 12

interface BirdFlockOptions {
  fill?: string
  rootMargin?: string
  scrollStart?: string
  scrollEnd?: string
  opacityMin?: number
  opacityMax?: number
  animatedOpacityCap?: number
}

type BirdBase = {
  pathData: string
  shape: Path2D
  finalOpacity: number
  revealStart: number
  revealDuration: number
  flightX: number
  flightY: number
  flightStart: number
  flightDuration: number
}

type AnimatedBird = BirdBase & {
  size: number
  drawX: number
  drawY: number
  layerWidth: number
  layerHeight: number
  sourceLayer: HTMLCanvasElement
  bodyLayer: HTMLCanvasElement
  leftWingRect: { x: number; y: number; width: number; height: number }
  rightWingRect: { x: number; y: number; width: number; height: number }
  flapOffset: number
  flapCycles: number
  flapShift: number
  flapLift: number
}

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

const createLayerCanvas = (width: number, height: number) => {
  const layer = document.createElement('canvas')
  layer.width = Math.max(Math.ceil(width), 1)
  layer.height = Math.max(Math.ceil(height), 1)
  return layer
}

const isHTMLElement = (value: unknown): value is HTMLElement => value instanceof HTMLElement

const createMeasurerHost = (viewBox: string) => {
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('viewBox', viewBox)
  svg.setAttribute('width', '0')
  svg.setAttribute('height', '0')
  svg.style.position = 'absolute'
  svg.style.left = '-9999px'
  svg.style.top = '-9999px'
  svg.style.opacity = '0'
  svg.style.pointerEvents = 'none'
  document.body.appendChild(svg)

  return svg
}

const measurePath = (host: SVGSVGElement, pathData: string) => {
  const path = document.createElementNS(SVG_NS, 'path')
  path.setAttribute('d', pathData)
  host.appendChild(path)
  const bounds = path.getBBox()
  host.removeChild(path)
  return bounds
}

const drawWingSlices = ({
  context,
  source,
  rect,
  flapWave,
  flapShift,
  flapLift,
  side,
}: {
  context: CanvasRenderingContext2D
  source: HTMLCanvasElement
  rect: { x: number; y: number; width: number; height: number }
  flapWave: number
  flapShift: number
  flapLift: number
  side: 'left' | 'right'
}) => {
  const rowCount = Math.max(Math.floor(rect.height), 1)

  for (let row = 0; row < rowCount; row += 1) {
    const t = rowCount <= 1 ? 1 : row / (rowCount - 1)
    const influence = smoothstep(1 - t)
    const horizontal = flapWave * flapShift * influence * (side === 'left' ? -1 : 1)
    const vertical = -Math.abs(flapWave) * flapLift * influence
    const sourceY = rect.y + row
    const sourceH = Math.min(1, rect.y + rect.height - sourceY)

    if (sourceH <= 0) continue

    const shrink = 1 - Math.abs(flapWave) * 0.18 * influence
    const destWidth = rect.width * shrink
    const widthDelta = rect.width - destWidth
    const anchorOffset = side === 'left' ? widthDelta : 0

    context.drawImage(
      source,
      rect.x,
      sourceY,
      rect.width,
      sourceH,
      rect.x + horizontal + anchorOffset,
      sourceY + vertical,
      destWidth,
      sourceH,
    )
  }
}

export function initBirdFlockAnimation(scope?: ParentNode | null, options: BirdFlockOptions = {}): () => void {
  const defaultHomeStage = document.querySelector<HTMLElement>('[data-home-bird-flock-stage]')
  const root = scope instanceof Element && scope.matches('[data-bird-flock]')
    ? scope
    : scope?.querySelector<HTMLElement>('[data-bird-flock]')
      ?? defaultHomeStage?.querySelector<HTMLElement>('[data-bird-flock]')
      ?? document.querySelector<HTMLElement>('[data-bird-flock]')
  const canvas = root?.querySelector<HTMLCanvasElement>('[data-bird-flock-canvas]')
  const triggerElement = root?.closest<HTMLElement>('[data-bird-flock-stage]')
    ?? (scope instanceof HTMLElement && scope.matches('[data-bird-flock-stage]') ? scope : null)
    ?? (scope instanceof Element ? scope.querySelector<HTMLElement>('[data-bird-flock-stage]') : null)
    ?? defaultHomeStage
    ?? (isHTMLElement(root) ? root : null)

  if (!root || !canvas || !triggerElement) return () => {}

  const abortController = new AbortController()
  let cleanup: (() => void) | undefined

  const load = () => {
    fetch(FLOCK_SRC, { signal: abortController.signal })
      .then((response) => response.text())
      .then((svgText) => {
        if (abortController.signal.aborted) return
        cleanup = initBirdFlockCanvas({
          canvas,
          svgText,
          triggerElement,
          fill: options.fill ?? BIRD_FILL,
          scrollStart: options.scrollStart,
          scrollEnd: options.scrollEnd,
          opacityMin: options.opacityMin,
          opacityMax: options.opacityMax,
          animatedOpacityCap: options.animatedOpacityCap,
        })
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
    { rootMargin: options.rootMargin ?? '300px' },
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
  fill,
  scrollStart,
  scrollEnd,
  opacityMin,
  opacityMax,
  animatedOpacityCap,
}: {
  canvas: HTMLCanvasElement
  svgText: string
  triggerElement: HTMLElement
  fill: string
  scrollStart?: string
  scrollEnd?: string
  opacityMin?: number
  opacityMax?: number
  animatedOpacityCap?: number
}) {
  const context = canvas.getContext('2d')

  if (!context) return () => {}

  const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml')
  const svg = doc.querySelector('svg')
  const flockPath = doc.querySelector('path')
  const flockPathData = flockPath?.getAttribute('d') ?? ''
  const viewBox = svg?.getAttribute('viewBox') ?? DEFAULT_VIEW_BOX
  const viewBoxRect = parseViewBox(viewBox)
  const reduceMotion = prefersReducedMotion()
  const measurerHost = createMeasurerHost(viewBox)

  const birds: BirdBase[] = splitPathIntoBirds(flockPathData).map((pathData, index) => {
    const seed = getStablePathScore(pathData, index)

    return {
      pathData,
      shape: new Path2D(pathData),
      finalOpacity: seededRange(seed, 1, opacityMin ?? 0.08, opacityMax ?? 0.16),
      revealStart: seededRange(seed, 2, 0.05, 0.38),
      revealDuration: seededRange(seed, 3, 0.08, 0.18),
      flightX: seededRange(seed, 4, -860, -360),
      flightY: seededRange(seed, 5, -20, 20),
      flightStart: seededRange(seed, 6, 0, 0.06),
      flightDuration: seededRange(seed, 7, 0.68, 1.12),
    }
  })

  const animatedBirds: AnimatedBird[] = birds
    .map((bird, index) => {
      const bounds = measurePath(measurerHost, bird.pathData)
      const seed = getStablePathScore(bird.pathData, index)
      const size = Math.max(bounds.width, bounds.height)
      const padding = Math.max(Math.ceil(size * 0.08), 4)
      const drawX = bounds.x - padding
      const drawY = bounds.y - padding
      const layerWidth = bounds.width + padding * 2
      const layerHeight = bounds.height + padding * 2
      const originX = -drawX
      const originY = -drawY

      const leftWingRect = {
        x: 0,
        y: 0,
        width: Math.max(bounds.width * 0.62, 12),
        height: Math.max(bounds.height * 0.5, 10),
      }
      const rightWingRect = {
        x: Math.max(layerWidth - Math.max(bounds.width * 0.62, 12), 0),
        y: 0,
        width: Math.max(bounds.width * 0.62, 12),
        height: Math.max(bounds.height * 0.5, 10),
      }

      const sourceLayer = createLayerCanvas(layerWidth, layerHeight)
      const sourceContext = sourceLayer.getContext('2d')!
      sourceContext.fillStyle = fill
      sourceContext.translate(originX, originY)
      sourceContext.fill(bird.shape)

      const bodyLayer = createLayerCanvas(layerWidth, layerHeight)
      const bodyContext = bodyLayer.getContext('2d')!
      bodyContext.drawImage(sourceLayer, 0, 0)
      bodyContext.clearRect(leftWingRect.x, leftWingRect.y, leftWingRect.width, leftWingRect.height)
      bodyContext.clearRect(rightWingRect.x, rightWingRect.y, rightWingRect.width, rightWingRect.height)

      return {
        ...bird,
        size,
        drawX,
        drawY,
        layerWidth,
        layerHeight,
        sourceLayer,
        bodyLayer,
        leftWingRect,
        rightWingRect,
        flapOffset: seededRange(seed, 8, 0, Math.PI * 2),
        flapShift: seededRange(seed, 9, bounds.width * 0.22, bounds.width * 0.38),
        flapLift: seededRange(seed, 10, Math.max(bounds.height * 0.08, 2.5), Math.max(bounds.height * 0.18, 7)),
        flapCycles: seededRange(seed, 11, 9, 15),
      } satisfies AnimatedBird
    })
    .sort((a, b) => b.size - a.size)
    .slice(0, ANIMATED_BIRD_COUNT)

  const animatedBirdSet = new Set(animatedBirds.map((bird) => bird.pathData))

  let targetProgress = 0
  let currentProgress = 0
  let maxRevealProgress = reduceMotion ? 1 : 0
  let frame: number | null = null
  let canvasWidth = 0
  let canvasHeight = 0
  let pixelRatio = 1

  const resizeCanvas = () => {
    const rect = canvas.getBoundingClientRect()
    pixelRatio = Math.min(window.devicePixelRatio || 1, CANVAS_DPR_LIMIT)
    canvasWidth = rect.width
    canvasHeight = rect.height
    canvas.width = Math.max(Math.round(canvasWidth * pixelRatio), 1)
    canvas.height = Math.max(Math.round(canvasHeight * pixelRatio), 1)
  }

  const draw = () => {
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.save()
    context.scale(pixelRatio, pixelRatio)

    const scale = Math.max(canvasWidth / viewBoxRect.width, canvasHeight / viewBoxRect.height)
    const xOffset = (canvasWidth - viewBoxRect.width * scale) / 2 - viewBoxRect.x * scale
    const yOffset = (canvasHeight - viewBoxRect.height * scale) / 2 - viewBoxRect.y * scale

    context.translate(xOffset, yOffset)
    context.scale(scale, scale)
    context.fillStyle = fill

    birds.forEach((bird) => {
      if (animatedBirdSet.has(bird.pathData)) return

      const revealProgress = reduceMotion
        ? 1
        : smoothstep((maxRevealProgress - bird.revealStart) / bird.revealDuration)

      if (revealProgress <= 0) return

      const flightProgress = reduceMotion
        ? 0
        : clamp01((currentProgress - bird.flightStart) / bird.flightDuration)

      context.save()
      context.globalAlpha = bird.finalOpacity * revealProgress
      context.translate(bird.flightX * flightProgress, bird.flightY * flightProgress)
      context.fill(bird.shape)
      context.restore()
    })

    animatedBirds.forEach((bird) => {
      const revealProgress = reduceMotion
        ? 1
        : smoothstep((maxRevealProgress - bird.revealStart) / bird.revealDuration)

      if (revealProgress <= 0) return

      const flightProgress = reduceMotion
        ? 0
        : clamp01((currentProgress - bird.flightStart) / bird.flightDuration)
      const flapWave = reduceMotion
        ? 0
        : Math.sin(currentProgress * bird.flapCycles * Math.PI * 2 + bird.flapOffset)

      context.save()
      context.globalAlpha = Math.min(bird.finalOpacity * revealProgress * 2.4, animatedOpacityCap ?? 0.5)
      context.translate(bird.flightX * flightProgress, bird.flightY * flightProgress)

      context.drawImage(bird.bodyLayer, bird.drawX, bird.drawY)

      drawWingSlices({
        context,
        source: bird.sourceLayer,
        rect: bird.leftWingRect,
        flapWave,
        flapShift: bird.flapShift,
        flapLift: bird.flapLift,
        side: 'left',
      })

      drawWingSlices({
        context,
        source: bird.sourceLayer,
        rect: bird.rightWingRect,
        flapWave,
        flapShift: bird.flapShift,
        flapLift: bird.flapLift,
        side: 'right',
      })

      context.restore()
    })

    context.restore()
  }

  const tick = () => {
    frame = null
    currentProgress += (targetProgress - currentProgress) * 0.08
    draw()

    if (Math.abs(targetProgress - currentProgress) > 0.001) {
      frame = requestAnimationFrame(tick)
    }
  }

  const requestDraw = () => {
    if (frame === null) frame = requestAnimationFrame(tick)
  }

  resizeCanvas()
  draw()

  const resizeObserver = new ResizeObserver(() => {
    resizeCanvas()
    draw()
  })

  resizeObserver.observe(canvas)

  const trigger = ScrollTrigger.create({
    trigger: triggerElement,
    start: scrollStart ?? 'top 45%',
    end: scrollEnd ?? 'bottom top',
    onUpdate: (self) => {
      targetProgress = self.progress
      maxRevealProgress = Math.max(maxRevealProgress, self.progress)
      requestDraw()
    },
  })

  targetProgress = trigger.progress
  currentProgress = trigger.progress
  maxRevealProgress = Math.max(maxRevealProgress, trigger.progress)
  draw()

  return () => {
    if (frame !== null) cancelAnimationFrame(frame)
    measurerHost.remove()
    resizeObserver.disconnect()
    trigger.kill()
  }
}
