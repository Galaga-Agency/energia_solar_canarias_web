'use client'

import { gsap, useGSAP } from '@/lib/gsap'
import { useAppReady }   from '@/hooks/useAppReady'

export type AnimationInit = () => void | (() => void)

export interface AnimationSchedule {
  critical?: AnimationInit[]
  raf?:      AnimationInit[]
  timeout?:  AnimationInit[] | { actions: AnimationInit[]; delay?: number }[]
}

interface UseGSAPAnimationsOptions {
  delay?:        number
  dependencies?: unknown[]
}

export function useGSAPAnimations(
  init: (() => AnimationSchedule | void | (() => void)) | AnimationSchedule,
  options: UseGSAPAnimationsOptions = {},
) {
  const { delay = 0, dependencies = [] } = options
  const appReady = useAppReady()

  useGSAP(() => {
    if (!appReady) return

    const ctx = gsap.context(() => {
      const cleanupFns: (() => void)[] = []

      const runAnimation = () => {
        const result = typeof init === 'function' ? init() : init
        if (isSchedule(result)) {
          const cleanup = runSchedule(result)
          if (cleanup) cleanupFns.push(cleanup)
        } else if (typeof result === 'function') {
          cleanupFns.push(result)
        }
      }

      if (delay > 0) {
        const timer = window.setTimeout(runAnimation, delay)
        cleanupFns.push(() => clearTimeout(timer))
      } else {
        runAnimation()
      }

      return () => cleanupFns.forEach((fn) => fn())
    })

    return () => ctx.revert()
  }, [appReady, delay, ...dependencies])
}

const isSchedule = (value: unknown): value is AnimationSchedule =>
  typeof value === 'object' &&
  value !== null &&
  ('critical' in (value as object) || 'raf' in (value as object) || 'timeout' in (value as object))

const runSchedule = (schedule: AnimationSchedule) => {
  const rafHandles:     number[]       = []
  const timeoutHandles: number[]       = []
  const cleanupFns:     (() => void)[] = []

  const runActions = (actions: AnimationInit[] | undefined) => {
    if (!actions) return
    actions.forEach((action) => {
      const cleanup = action()
      if (typeof cleanup === 'function') cleanupFns.push(cleanup)
    })
  }

  runActions(schedule.critical)

  schedule.raf?.forEach((action) => {
    rafHandles.push(requestAnimationFrame(() => runActions([action])))
  })

  const timeoutEntries = Array.isArray(schedule.timeout)
    ? schedule.timeout.map((entry) =>
        typeof entry === 'function' ? { actions: [entry], delay: 0 } : entry,
      )
    : []

  timeoutEntries.forEach((entry) => {
    timeoutHandles.push(window.setTimeout(() => runActions(entry.actions), entry.delay ?? 0))
  })

  return () => {
    rafHandles.forEach(cancelAnimationFrame)
    timeoutHandles.forEach(clearTimeout)
    cleanupFns.forEach((fn) => fn())
  }
}
