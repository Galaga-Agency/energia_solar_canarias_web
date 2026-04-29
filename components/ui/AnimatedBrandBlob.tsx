'use client'

import { useCallback, useEffect, useId, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { useMotionPreferenceContext } from '@/contexts/MotionPreferenceContext'
import { BLOB_PATHS } from '@/utils/animations/logo-blob-paths'

interface AnimatedBrandBlobProps {
  className?: string
}

const NUMBER_PATTERN = /-?\d*\.?\d+/g
const PATH_TEMPLATE = BLOB_PATHS[0].split(NUMBER_PATTERN)
const PATH_VALUES = BLOB_PATHS.map((path) => (path.match(NUMBER_PATTERN) ?? []).map(Number))
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

export function AnimatedBrandBlob({ className }: AnimatedBrandBlobProps) {
  const { reducedMotion } = useMotionPreferenceContext()
  const svgId = useId().replace(/:/g, '')
  const pathRef = useRef<SVGPathElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const currentValuesRef = useRef(PATH_VALUES[0])
  const filterId = `hero-blob-smoke-${svgId}`

  const setBlobValues = useCallback((values: number[]) => {
    currentValuesRef.current = values
    pathRef.current?.setAttribute('d', buildPath(values))
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
    if (!pathRef.current) return

    tlRef.current?.kill()

    const timeline = gsap.timeline({ repeat: -1 })

    if (!reducedMotion) {
      addMorph(timeline, PATH_VALUES[0], PATH_VALUES[1], MORPH_DURATIONS[0])
      addMorph(timeline, PATH_VALUES[1], PATH_VALUES[2], MORPH_DURATIONS[1])
      addMorph(timeline, PATH_VALUES[2], PATH_VALUES[3], MORPH_DURATIONS[2])
      addMorph(timeline, PATH_VALUES[3], PATH_VALUES[0], MORPH_DURATIONS[3])
      timeline.to(pathRef.current, {
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
    }

    tlRef.current = timeline
  }, [addMorph, reducedMotion])

  useEffect(() => {
    setBlobValues(PATH_VALUES[0])

    gsap.set(svgRef.current, {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      transformOrigin: '50% 50%',
    })

    if (reducedMotion) {
      gsap.set(pathRef.current, {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        transformOrigin: '70px 62px',
      })
      return
    }

    const intro = gsap.fromTo(svgRef.current, {
      opacity: 0,
      scale: 0.88,
      x: -18,
      y: 14,
    }, {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      duration: 1.1,
      ease: 'power3.out',
    })

    startBlobLoop()

    return () => {
      intro.kill()
      tlRef.current?.kill()
    }
  }, [reducedMotion, setBlobValues, startBlobLoop])

  return (
    <svg
      ref={svgRef}
      aria-hidden
      viewBox="0 0 341.35 124.81"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id={filterId} x="-35%" y="-35%" width="170%" height="170%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8.5" />
        </filter>
      </defs>

      <path
        ref={pathRef}
        d={BLOB_PATHS[0]}
        fill="#e15025"
        filter={`url(#${filterId})`}
      />
    </svg>
  )
}
