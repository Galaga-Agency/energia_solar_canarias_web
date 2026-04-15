'use client'

/**
 * Returns true if the user has requested reduced motion via OS settings
 * or the in-app motion preference toggle.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Returns a duration in milliseconds scaled by motion preference.
 * Full motion gets the requested duration; reduced motion gets 0.
 */
export function motionDuration(ms: number): number {
  return prefersReducedMotion() ? 0 : ms
}

/**
 * Returns a delay in milliseconds scaled by motion preference.
 * Full motion gets the requested delay; reduced motion gets 0.
 */
export function motionDelay(ms: number): number {
  return prefersReducedMotion() ? 0 : ms
}
