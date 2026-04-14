const isDev = process.env.NODE_ENV === 'development'

export const logger = {
  log:   (...args: unknown[]) => { if (isDev) console.log('[ESC]', ...args) },
  warn:  (...args: unknown[]) => { if (isDev) console.warn('[ESC]', ...args) },
  error: (...args: unknown[]) => console.error('[ESC]', ...args),
}
