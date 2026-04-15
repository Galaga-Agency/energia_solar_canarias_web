export const FAQ_SOLUCIONES_KEYS = [
  'timeline',
  'guarantees',
  'financing',
  'savings',
  'audit',
] as const

export const FAQ_CONTACTO_KEYS = [
  'timeline',
  'guarantees',
  'financing',
  'savings',
  'audit',
] as const

export type FAQSolucionesKey = typeof FAQ_SOLUCIONES_KEYS[number]
export type FAQContactoKey   = typeof FAQ_CONTACTO_KEYS[number]
