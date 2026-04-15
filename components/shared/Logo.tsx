'use client'

import { useRef, useCallback, useEffect, useId } from 'react'
import { gsap } from '@/lib/gsap'
import { useMotionPreferenceContext } from '@/contexts/MotionPreferenceContext'
import { BLOB_PATHS } from '@/utils/animations/logo-blob-paths'

interface LogoProps { width?: number; className?: string }

const NUMBER_PATTERN = /-?\d*\.?\d+/g
const PATH_TEMPLATE = BLOB_PATHS[0].split(NUMBER_PATTERN)
const PATH_VALUES = BLOB_PATHS.map((path) =>
  (path.match(NUMBER_PATTERN) ?? []).map(Number),
)
const MORPH_DURATIONS = [2.4, 2.85, 2.55, 3]
const MORPH_LOOP_DURATION = MORPH_DURATIONS.reduce((total, duration) => total + duration, 0)

function buildPath(values: number[]) {
  let path = PATH_TEMPLATE[0]

  for (let i = 0; i < values.length; i += 1) {
    path += `${values[i].toFixed(2)}${PATH_TEMPLATE[i + 1]}`
  }

  return path
}

function interpolatePathValues(from: number[], to: number[], progress: number) {
  return from.map((value, i) => value + (to[i] - value) * progress)
}

export function Logo({ width = 180, className }: LogoProps) {
  const { reducedMotion } = useMotionPreferenceContext()
  const svgId = useId().replace(/:/g, '')
  const blobRef = useRef<SVGPathElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const currentValuesRef = useRef(PATH_VALUES[0])
  const height  = Math.round((width * 124.81) / 341.35)
  const filterId = `logo-blob-smoke-${svgId}`

  const setBlobValues = useCallback((values: number[]) => {
    currentValuesRef.current = values
    blobRef.current?.setAttribute('d', buildPath(values))
  }, [])

  const addMorph = useCallback((
    timeline: gsap.core.Timeline,
    from: number[],
    to: number[],
    duration: number,
  ) => {
    const state = { progress: 0 }

    timeline.to(state, {
      progress: 1,
      duration,
      ease: 'sine.inOut',
      onUpdate: () => {
        setBlobValues(interpolatePathValues(from, to, state.progress))
      },
      onComplete: () => {
        setBlobValues(to)
      },
    })
  }, [setBlobValues])

  const startBlobLoop = useCallback(() => {
    if (reducedMotion || !blobRef.current) return
    tlRef.current?.kill()

    const timeline = gsap.timeline({ repeat: -1 })
    addMorph(timeline, PATH_VALUES[0], PATH_VALUES[1], MORPH_DURATIONS[0])
    addMorph(timeline, PATH_VALUES[1], PATH_VALUES[2], MORPH_DURATIONS[1])
    addMorph(timeline, PATH_VALUES[2], PATH_VALUES[3], MORPH_DURATIONS[2])
    addMorph(timeline, PATH_VALUES[3], PATH_VALUES[0], MORPH_DURATIONS[3])
    timeline.to(blobRef.current, {
      keyframes: [
        { x: 1.2, y: -0.8, scaleX: 1.018, scaleY: 0.988, rotation: -0.8 },
        { x: -0.7, y: 0.9, scaleX: 0.992, scaleY: 1.014, rotation: 0.7 },
        { x: 0.9, y: 0.4, scaleX: 1.01, scaleY: 1.004, rotation: -0.35 },
        { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
      ],
      duration: MORPH_LOOP_DURATION,
      ease: 'sine.inOut',
      transformOrigin: '70px 62px',
    }, 0)
    tlRef.current = timeline
  }, [addMorph, reducedMotion])

  useEffect(() => {
    if (reducedMotion) {
      tlRef.current?.kill()
      setBlobValues(PATH_VALUES[0])
      gsap.set(blobRef.current, {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        transformOrigin: '70px 62px',
      })
      return
    }

    startBlobLoop()

    return () => {
      tlRef.current?.kill()
    }
  }, [reducedMotion, setBlobValues, startBlobLoop])

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 341.35 124.81"
      width={width}
      height={height}
      className={className}
      aria-label="Energía Solar Canarias"
      role="img"
    >
      <defs>
        <filter id={filterId} x="-35%" y="-35%" width="170%" height="170%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8.5" />
        </filter>
      </defs>

      <path
        ref={blobRef}
        fill="#e15025"
        filter={`url(#${filterId})`}
        d={BLOB_PATHS[0]}
      />

      {/* Wordmark — static, never touched */}
      <g fill="#e15025">
        <path d="M142.84,52.06h-10.66s0,5.65,0,5.65h11.76s-.58,3.94-.58,3.94h-15.87s0-22.27,0-22.27h15.8s0,3.94,0,3.94h-11.12s0,4.75,0,4.75h10.66s0,3.98,0,3.98Z"/>
        <path d="M146.78,49.15c0-1.42,0-2.97-.03-4.23h4.49c.1.45.16,1.62.19,2.13.55-1.03,1.91-2.52,4.85-2.52,3.36,0,5.53,2.3,5.53,6.5v10.63s-4.62,0-4.62,0v-10.11c0-1.91-.61-3.26-2.68-3.26s-3.07,1.1-3.07,4.07v9.31s-4.65,0-4.65,0v-12.51Z"/>
        <path d="M169.6,54.29c0,2.1,1.07,4.14,3.36,4.14,1.94,0,2.49-.78,2.94-1.78h4.62c-.58,2.04-2.42,5.4-7.66,5.4-5.53,0-7.92-4.1-7.92-8.5,0-5.27,2.68-9.02,8.08-9.02,5.72,0,7.69,4.17,7.69,8.34,0,.58,0,.94-.07,1.42h-11.05ZM176.06,51.45c-.03-1.94-.81-3.59-3.07-3.59-2.2,0-3.1,1.52-3.3,3.59h6.37Z"/>
        <path d="M183.95,49.48c0-1.68,0-3.13-.03-4.56h4.56c.06.39.13,2.04.13,2.94.74-1.91,2.52-3.3,5.36-3.33v4.43c-3.36-.1-5.36.81-5.36,5.4v7.3s-4.65,0-4.65,0v-12.18Z"/>
        <path d="M211.55,59.63c0,5.37-1.97,8.76-8.31,8.76-6.11,0-7.3-3.39-7.46-5.3h4.72c.32,1.16,1.16,1.94,2.94,1.94,3,0,3.59-1.84,3.59-5.11v-.81c-.87,1.45-2.26,2.36-4.72,2.36-4.39,0-6.91-3.62-6.91-8.11,0-5.24,3.13-8.82,7.3-8.82,2.88,0,4.07,1.36,4.33,2.13.03-.45.16-1.46.19-1.75h4.36c0,1.52-.03,3.2-.03,4.82v9.89ZM203.63,57.72c2.78,0,3.52-1.91,3.52-4.72s-.48-4.75-3.43-4.75c-2,0-3.59,1.55-3.59,4.91,0,2.88,1.45,4.56,3.49,4.56Z"/>
        <path d="M215.65,44.92h4.65s0,16.74,0,16.74h-4.65s0-16.74,0-16.74ZM225.09,37.75l-5.17,4.78h-4.04s3.72-4.78,3.72-4.78h5.49Z"/>
        <path d="M238.21,57.33c0,1.62.13,3.94.23,4.33h-4.43c-.13-.32-.23-1.23-.23-1.65-.61.94-1.74,2.04-4.72,2.04-4.04,0-5.72-2.65-5.72-5.23,0-3.81,3.04-5.59,7.95-5.59h2.39s0-1,0-1c0-1.19-.42-2.36-2.59-2.36-1.94,0-2.39.81-2.59,2.04h-4.39c.23-2.97,2.07-5.37,7.17-5.36,4.46.03,6.92,1.78,6.92,5.78v7.01ZM233.68,54.04h-1.87c-2.81,0-3.85.87-3.85,2.49,0,1.19.74,2.23,2.42,2.23,2.94,0,3.3-2.07,3.3-4.26v-.45Z"/>
        <path d="M254.04,55.14c.52,2.23,2.1,3.23,4.69,3.23s3.68-1.03,3.68-2.65c0-1.84-1.07-2.62-4.88-3.49-6.08-1.42-7.56-3.65-7.56-6.66,0-3.88,2.91-6.5,8.18-6.5,5.91,0,8.27,3.17,8.6,6.43h-4.85c-.26-1.39-1-2.88-3.88-2.88-1.97,0-3.14.81-3.14,2.39s.94,2.2,4.56,3.01c6.46,1.55,7.89,3.94,7.89,7.11,0,4.04-3.07,6.85-8.95,6.85-5.66,0-8.66-2.78-9.18-6.85h4.85Z"/>
        <path d="M286.42,53.26c0,5.07-3.04,8.79-8.34,8.79s-8.21-3.72-8.21-8.69c0-5.17,3.13-8.82,8.43-8.82,4.91,0,8.11,3.49,8.11,8.73ZM274.56,53.29c0,3.23,1.39,5.14,3.62,5.14,2.29,0,3.55-1.91,3.55-5.11,0-3.49-1.29-5.14-3.62-5.14-2.13,0-3.56,1.58-3.56,5.11Z"/>
        <path d="M289.59,61.67v-23.59s4.66,0,4.66,0v23.59s-4.66,0-4.66,0Z"/>
        <path d="M312.15,57.34c0,1.62.13,3.94.23,4.33h-4.43c-.13-.32-.23-1.23-.23-1.65-.61.94-1.74,2.04-4.72,2.04-4.04,0-5.72-2.65-5.72-5.23,0-3.81,3.04-5.59,7.95-5.59h2.39s0-1,0-1c0-1.19-.42-2.36-2.59-2.36-1.94,0-2.39.81-2.59,2.04h-4.39c.23-2.97,2.07-5.37,7.17-5.36,4.46.03,6.92,1.78,6.92,5.78v7.01ZM307.62,54.04h-1.87c-2.81,0-3.85.87-3.85,2.49,0,1.19.74,2.23,2.42,2.23,2.94,0,3.3-2.07,3.3-4.26v-.45Z"/>
        <path d="M316.31,49.48c0-1.68,0-3.13-.03-4.56h4.56c.06.39.13,2.04.13,2.94.74-1.91,2.52-3.3,5.36-3.33v4.43c-3.36-.1-5.36.81-5.36,5.4v7.3s-4.65,0-4.65,0v-12.18Z"/>
        <path d="M144.71,88.47c-1.62,4.23-4.52,6.95-9.82,6.95-5.69,0-8.18-3.97-8.18-9.05,0-6.63,3.65-14.06,11.47-14.06,4.82,0,7.72,2.71,7.92,7.14h-2.91c-.23-2.78-1.81-4.78-5.3-4.78-5.4,0-8.18,5.95-8.18,11.63,0,3.68,1.52,6.75,5.53,6.76,2.97,0,5.07-1.49,6.5-4.59h2.97Z"/>
        <path d="M160.03,91.06c-.29,1.39-.68,3.43-.78,4.07h-2.62c.06-.61.23-1.62.42-2.52-.81,1.33-2.2,2.84-5.56,2.84s-4.49-2.17-4.49-4.14c0-4.65,4.36-5.69,7.66-6.01,1.71-.13,3.13-.13,3.97-.16l.23-1.1c.29-1.55.19-3.55-2.94-3.56-2.78,0-3.52,1.45-4.01,2.71h-2.75c.58-2.45,2.39-4.78,6.98-4.78,3.75,0,6.2,1.71,5.36,5.62l-1.49,7.01ZM158.22,87.12c-.87.03-1.97.03-3.36.19-2.65.26-5.01,1-5.01,3.62,0,1.23.81,2.29,2.62,2.29,3.59,0,4.98-2.78,5.69-5.85l.07-.26Z"/>
        <path d="M166.66,82.91c.29-1.42.55-2.81.81-4.17h2.62c-.03.52-.39,2.36-.48,2.78.94-1.49,2.49-3.1,5.49-3.1,3.13,0,5.07,1.81,4.07,6.46l-2.13,10.24h-2.68s2.13-10.18,2.13-10.18c.55-2.46-.03-4.17-2.52-4.17-3.04,0-4.78,2.81-5.5,6.14l-1.75,8.21h-2.65s2.59-12.22,2.59-12.22Z"/>
        <path d="M194.61,91.06c-.29,1.39-.68,3.43-.78,4.07h-2.62c.06-.61.23-1.62.42-2.52-.81,1.33-2.2,2.84-5.56,2.84-3.3,0-4.49-2.17-4.49-4.14,0-4.65,4.36-5.69,7.66-6.01,1.71-.13,3.13-.13,3.97-.16l.23-1.1c.29-1.55.19-3.55-2.94-3.56-2.78,0-3.52,1.45-4.01,2.71h-2.75c.58-2.45,2.39-4.78,6.98-4.78,3.75,0,6.2,1.71,5.36,5.62l-1.49,7.01ZM192.8,87.12c-.87.03-1.97.03-3.36.19-2.65.26-5.01,1-5.01,3.62,0,1.23.81,2.29,2.62,2.29,3.59,0,4.98-2.78,5.69-5.85l.07-.26Z"/>
        <path d="M209.19,81.2c-3.13.23-5.46,2.58-6.24,6.27l-1.65,7.66h-2.65s2.46-11.54,2.46-11.54c.32-1.62.68-3.33.94-4.85h2.58c-.03.42-.29,2.07-.61,3.46,1.19-2.33,3.26-3.78,5.75-3.78l-.58,2.78Z"/>
        <path d="M213.16,78.75h2.68s-3.49,16.38-3.49,16.38h-2.65s3.46-16.38,3.46-16.38ZM214.71,71.41h2.68s-.74,3.52-.74,3.52h-2.68s.74-3.52.74-3.52Z"/>
        <path d="M230.19,91.06c-.29,1.39-.68,3.43-.78,4.07h-2.62c.06-.61.23-1.62.42-2.52-.81,1.33-2.2,2.84-5.56,2.84-3.3,0-4.49-2.17-4.49-4.14,0-4.65,4.36-5.69,7.66-6.01,1.71-.13,3.13-.13,3.97-.16l.23-1.1c.29-1.55.19-3.55-2.94-3.56-2.78,0-3.52,1.45-4.01,2.71h-2.75c.58-2.45,2.39-4.78,6.98-4.78,3.75,0,6.2,1.71,5.36,5.62l-1.49,7.01ZM228.38,87.12c-.87.03-1.97.03-3.36.19-2.65.26-5.01,1-5.01,3.62,0,1.23.81,2.29,2.62,2.29,3.59,0,4.98-2.78,5.69-5.85l.07-.26Z"/>
        <path d="M236.3,90.22c.16,1.68,1.2,3.07,3.81,3.07,2.2,0,3.36-1.1,3.36-2.65s-1.1-2.26-3.43-3.1c-3.52-1.23-4.59-2.46-4.59-4.36,0-2.55,1.94-4.75,5.91-4.75,4.23,0,5.82,2.39,5.75,4.72h-2.72c-.1-1.13-.65-2.58-3.3-2.58-1.71,0-2.94.84-2.94,2.33,0,1.13.94,1.68,3.26,2.52,3.43,1.23,4.81,2.62,4.81,4.88,0,3.26-2.62,5.17-6.53,5.17-4.17,0-6.17-2.17-6.17-5.24h2.75Z"/>
      </g>
    </svg>
  )
}
