const isDev = process.env.NODE_ENV === 'development'

export const debug = {
  start:  (prefix: string) => { if (isDev) console.groupCollapsed(`[${prefix}]`) },
  mark:   (prefix: string, msg: string) => { if (isDev) console.log(`[${prefix}] ${msg}`) },
  error:  (prefix: string, msg: string, err?: unknown) => { if (isDev) console.error(`[${prefix}] ${msg}`, err) },
  end:    (prefix: string) => { if (isDev) { console.groupEnd(); void prefix } },
}
