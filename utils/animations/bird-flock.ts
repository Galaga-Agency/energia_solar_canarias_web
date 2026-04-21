'use client'

import { ScrollTrigger }        from '@/lib/gsap'
import { prefersReducedMotion } from '@/utils/animations/motionPrefs'

const FLOCK_SRC = '/assets/images/home/new-birds.svg'
const DEFAULT_VIEW_BOX = '0 0 1440 1546'
const BIRD_FILL = '#593C3C'
const CANVAS_DPR_LIMIT = 1.25
const SVG_NS = 'http://www.w3.org/2000/svg'

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

const maskPolygon = (
  context: CanvasRenderingContext2D,
  points: Array<{ x: number; y: number }>,
) => {
  context.beginPath()
  context.moveTo(points[0].x, points[0].y)
  for (let index = 1; index < points.length; index += 1) {
    context.lineTo(points[index].x, points[index].y)
  }
  context.closePath()
  context.fill()
}

const clearRect = (
  context: CanvasRenderingContext2D,
  rect: { x: number; y: number; width: number; height: number },
) => {
  context.clearRect(rect.x, rect.y, rect.width, rect.height)
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
  const viewBox = svg?.getAttribute('viewBox') ?? DEFAULT_VIEW_BOX
  const viewBoxRect = parseViewBox(viewBox)
  const reduceMotion = prefersReducedMotion()
  const measurerHost = document.createElementNS(SVG_NS, 'svg')
  measurerHost.setAttribute('viewBox', viewBox)
  measurerHost.setAttribute('width', '0')
  measurerHost.setAttribute('height', '0')
  measurerHost.style.position = 'absolute'
  measurerHost.style.left = '-9999px'
  measurerHost.style.top = '-9999px'
  measurerHost.style.opacity = '0'
  measurerHost.style.pointerEvents = 'none'
  document.body.appendChild(measurerHost)
  const birds = splitPathIntoBirds(pathData).map((path, index) => {
    const seed = getStablePathScore(path, index)
    const measurePath = document.createElementNS(SVG_NS, 'path')
    measurePath.setAttribute('d', path)
    measurerHost.appendChild(measurePath)
    const bounds = measurePath.getBBox()
    measurerHost.removeChild(measurePath)

    const padding = Math.max(Math.ceil(Math.max(bounds.width, bounds.height) * 0.08), 4)
    const drawX = bounds.x - padding
    const drawY = bounds.y - padding
    const layerWidth = bounds.width + padding * 2
    const layerHeight = bounds.height + padding * 2
    const originX = -drawX
    const originY = -drawY
    const birdSize = Math.max(bounds.width, bounds.height)
    const shouldAnimate = birdSize >= 18
    const leftWingRect = {
      x: 0,
      y: 0,
      width: Math.max(bounds.width * 0.5, 10),
      height: Math.max(bounds.height * 0.42, 8),
    }
    const rightWingRect = {
      x: Math.max(layerWidth - Math.max(bounds.width * 0.5, 10), 0),
      y: 0,
      width: Math.max(bounds.width * 0.5, 10),
      height: Math.max(bounds.height * 0.42, 8),
    }
    const leftWingPivot = {
      x: bounds.x + bounds.width * 0.36,
      y: bounds.y + bounds.height * 0.2,
    }
    const rightWingPivot = {
      x: bounds.x + bounds.width * 0.64,
      y: bounds.y + bounds.height * 0.2,
    }

    const shape = new Path2D(path)
    const fullLayer = createLayerCanvas(layerWidth, layerHeight)
    const fullContext = fullLayer.getContext('2d')!

    fullContext.fillStyle = BIRD_FILL
    fullContext.translate(originX, originY)
    fullContext.fill(shape)

    const bodyLayer = createLayerCanvas(layerWidth, layerHeight)
    const bodyContext = bodyLayer.getContext('2d')!
    bodyContext.drawImage(fullLayer, 0, 0)
    if (shouldAnimate) {
      clearRect(bodyContext, leftWingRect)
      clearRect(bodyContext, rightWingRect)
    }

    const leftWingLayer = createLayerCanvas(layerWidth, layerHeight)
    const leftWingContext = leftWingLayer.getContext('2d')!
    leftWingContext.drawImage(fullLayer, 0, 0)
    leftWingContext.globalCompositeOperation = 'destination-in'
    leftWingContext.fillStyle = '#000'
    if (shouldAnimate) {
      maskPolygon(leftWingContext, [
        { x: 0, y: 0 },
        { x: leftWingRect.width, y: 0 },
        { x: leftWingRect.width * 0.82, y: leftWingRect.height },
        { x: 0, y: leftWingRect.height * 0.72 },
      ])
    } else {
      clearRect(leftWingContext, { x: 0, y: 0, width: layerWidth, height: layerHeight })
    }

    const rightWingLayer = createLayerCanvas(layerWidth, layerHeight)
    const rightWingContext = rightWingLayer.getContext('2d')!
    rightWingContext.drawImage(fullLayer, 0, 0)
    rightWingContext.globalCompositeOperation = 'destination-in'
    rightWingContext.fillStyle = '#000'
    if (shouldAnimate) {
      maskPolygon(rightWingContext, [
        { x: rightWingRect.x + rightWingRect.width * 0.18, y: 0 },
        { x: rightWingRect.x + rightWingRect.width, y: 0 },
        { x: rightWingRect.x + rightWingRect.width, y: rightWingRect.height * 0.72 },
        { x: rightWingRect.x, y: rightWingRect.height },
      ])
    } else {
      clearRect(rightWingContext, { x: 0, y: 0, width: layerWidth, height: layerHeight })
    }

    return {
      bodyLayer,
      leftWingLayer,
      rightWingLayer,
      drawX,
      drawY,
      leftWingPivot,
      rightWingPivot,
      shouldAnimate,
      finalOpacity: seededRange(seed, 1, 0.08, 0.16),
      revealStart: seededRange(seed, 2, 0.05, 0.38),
      revealDuration: seededRange(seed, 3, 0.08, 0.18),
      flightX: seededRange(seed, 4, -860, -360),
      flightY: seededRange(seed, 5, -20, 20),
      flightStart: seededRange(seed, 6, 0, 0.06),
      flightDuration: seededRange(seed, 7, 0.68, 1.12),
      flapOffset: seededRange(seed, 8, 0, Math.PI * 2),
      flapAngle: seededRange(seed, 9, 0.28, 0.55),
      flapLift: seededRange(seed, 10, 0.8, 3.2),
      flapCycles: seededRange(seed, 11, 7.5, 12),
    }
  })

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
    context.fillStyle = BIRD_FILL

    birds.forEach((bird) => {
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
      context.globalAlpha = bird.finalOpacity * revealProgress
      context.translate(bird.flightX * flightProgress, bird.flightY * flightProgress)
      context.drawImage(bird.bodyLayer, bird.drawX, bird.drawY)

      if (bird.shouldAnimate) {
        context.save()
        context.translate(bird.leftWingPivot.x, bird.leftWingPivot.y)
        context.rotate(-flapWave * bird.flapAngle)
        context.translate(0, -Math.abs(flapWave) * bird.flapLift)
        context.translate(-bird.leftWingPivot.x, -bird.leftWingPivot.y)
        context.drawImage(bird.leftWingLayer, bird.drawX, bird.drawY)
        context.restore()

        context.save()
        context.translate(bird.rightWingPivot.x, bird.rightWingPivot.y)
        context.rotate(flapWave * bird.flapAngle)
        context.translate(0, -Math.abs(flapWave) * bird.flapLift)
        context.translate(-bird.rightWingPivot.x, -bird.rightWingPivot.y)
        context.drawImage(bird.rightWingLayer, bird.drawX, bird.drawY)
        context.restore()
      }

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
    start: 'top 45%',
    end: 'bottom top',
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
