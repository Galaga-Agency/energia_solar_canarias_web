/**
 * Split a phrase into everything-but-the-last-word and the last word,
 * preserving a trailing period. Used to colour/emphasise the final word
 * of section titles (the brand's italic-orange tail).
 */
export function splitTail(text: string): { lead: string; tail: string } {
  const trimmed = text.replace(/\.$/, '')
  const idx     = trimmed.lastIndexOf(' ')
  if (idx === -1) return { lead: '', tail: text }
  const dot = text.endsWith('.') ? '.' : ''
  return { lead: trimmed.slice(0, idx), tail: trimmed.slice(idx + 1) + dot }
}

/** Like splitTail but without the trailing-period handling. */
export function splitLastWord(label: string): { lead: string; tail: string } {
  const idx = label.lastIndexOf(' ')
  if (idx === -1) return { lead: '', tail: label }
  return { lead: label.slice(0, idx), tail: label.slice(idx + 1) }
}

/**
 * Split a stat string into its numeric core and surrounding glyphs.
 * "90%" → { prefix:"", num:"90", suffix:"%" } · "+50%" → { prefix:"+", num:"50", suffix:"%" }
 */
export function splitStat(value: string): { prefix: string; num: string; suffix: string } {
  const m = value.match(/^(\D*)(\d[\d.,]*)(\D*)$/)
  if (!m) return { prefix: '', num: value, suffix: '' }
  return { prefix: m[1], num: m[2], suffix: m[3] }
}
