'use client'

import Image from 'next/image'
import { useMemo } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import type { SerializedUploadNode, DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { mediaUrl } from '@/lib/media-url'

/* ── Footnote collection (inline blocks scattered through the body) ───────── */
type FootnoteEntry = { number: number; text: string; anchoredText?: string }
type FootnoteIndex = Map<string, FootnoteEntry>

function collectFootnotes(root: unknown): FootnoteIndex {
  const index: FootnoteIndex = new Map()
  let n = 0
  function walk(node: unknown) {
    if (!node || typeof node !== 'object') return
    const obj = node as Record<string, unknown>
    if (obj.type === 'inlineBlock' && (obj.fields as { blockType?: string } | undefined)?.blockType === 'footnote') {
      const f = obj.fields as Record<string, unknown>
      n += 1
      index.set(String(f.id ?? n), { number: n, text: String(f.text ?? ''), anchoredText: f.anchoredText ? String(f.anchoredText) : undefined })
    }
    ;(obj.children as unknown[] | undefined)?.forEach(walk)
  }
  walk((root as { root?: unknown })?.root)
  return index
}

/* ── Embed URL normalisers ───────────────────────────────────────────────── */
function youtubeEmbed(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.pathname.startsWith('/embed/')) return url
    if (u.hostname.includes('youtu.be')) return `https://www.youtube.com/embed${u.pathname}`
    const id = u.searchParams.get('v')
    return id ? `https://www.youtube.com/embed/${id}` : null
  } catch { return null }
}

function vimeoEmbed(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return m ? `https://player.vimeo.com/video/${m[1]}` : null
}

function instagramUrl(url: string): string | null {
  const m = url.match(/instagram\.com\/(p|reel|tv)\/([A-Za-z0-9_-]+)/)
  return m ? `https://www.instagram.com/${m[1]}/${m[2]}/embed` : null
}

const GALLERY_COLS: Record<string, string> = {
  'row-2':      'grid-cols-2',
  'row-3':      'grid-cols-3',
  'left-stack': 'grid-cols-2',
  'right-stack':'grid-cols-2',
  'grid-2x2':   'grid-cols-2',
}

/* ── Converters ──────────────────────────────────────────────────────────── */
function makeConverters(footnotes: FootnoteIndex): JSXConvertersFunction {
  return ({ defaultConverters }) => ({
    ...defaultConverters,

    // Inline upload (image inside the flow)
    upload: ({ node }: { node: SerializedUploadNode }) => {
      const v = node.value as { url?: string; filename?: string; alt?: string; caption?: string } | undefined
      if (!v) return null
      const src = mediaUrl(v)
      return (
        <figure className="my-10">
          <div className="relative aspect-16/10 overflow-hidden">
            <Image src={src} alt={v.alt ?? ''} fill sizes="(min-width:768px) 70vw, 100vw" className="object-cover" />
          </div>
          {v.caption && <figcaption className="mt-3 text-label font-mono text-ink/45!">{v.caption}</figcaption>}
        </figure>
      )
    },

    inlineBlocks: {
      footnote: ({ node }: { node: { fields: Record<string, unknown> } }) => {
        const id = String(node.fields.id ?? '')
        const entry = footnotes.get(id) ?? footnotes.get(String(node.fields.text ?? ''))
        if (!entry) return null
        return (
          <sup id={`fn-ref-${entry.number}`} className="text-primary">
            <a href={`#fn-${entry.number}`} className="font-mono no-underline hover:underline">[{entry.number}]</a>
          </sup>
        )
      },
    },

    blocks: {
      youtube: ({ node }: { node: { fields: Record<string, unknown> } }) => {
        const src = youtubeEmbed(String(node.fields.url ?? ''))
        if (!src) return null
        return (
          <div className="relative my-10 aspect-video overflow-hidden bg-ink/5">
            <iframe src={src} title="YouTube" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full" />
          </div>
        )
      },
      vimeo: ({ node }: { node: { fields: Record<string, unknown> } }) => {
        const src = vimeoEmbed(String(node.fields.url ?? ''))
        if (!src) return null
        return (
          <div className="relative my-10 aspect-video overflow-hidden bg-ink/5">
            <iframe src={src} title="Vimeo" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full" />
          </div>
        )
      },
      instagram: ({ node }: { node: { fields: Record<string, unknown> } }) => {
        const src = instagramUrl(String(node.fields.url ?? ''))
        if (!src) return null
        return (
          <div className="my-10 flex justify-center">
            <iframe src={src} title="Instagram" className="aspect-4/5 w-full max-w-md border border-ink/10" />
          </div>
        )
      },
      authorNote: ({ node }: { node: { fields: Record<string, unknown> } }) => (
        <aside className="my-10 border-l-2 border-primary pl-6">
          <p className="text-subheading italic text-ink/80 leading-snug">{String(node.fields.text ?? '')}</p>
        </aside>
      ),
      gallery: ({ node }: { node: { fields: Record<string, unknown> } }) => {
        const layout = String(node.fields.layout ?? 'row-2')
        const images = Array.isArray(node.fields.images) ? node.fields.images : []
        const caption = node.fields.caption ? String(node.fields.caption) : undefined
        return (
          <figure className="my-10">
            <div className={`grid gap-3 ${GALLERY_COLS[layout] ?? 'grid-cols-2'}`}>
              {images.map((row: unknown, i: number) => {
                const img = (row as { image?: unknown }).image
                const src = mediaUrl(img)
                const wide = (layout === 'left-stack' && i === 0) || (layout === 'right-stack' && i === images.length - 1)
                return (
                  <div key={i} className={`relative aspect-4/3 overflow-hidden ${wide ? 'row-span-2 aspect-auto' : ''}`}>
                    <Image src={src} alt="" fill sizes="(min-width:768px) 35vw, 50vw" className="object-cover" />
                  </div>
                )
              })}
            </div>
            {caption && <figcaption className="mt-3 text-label font-mono text-ink/45!">{caption}</figcaption>}
          </figure>
        )
      },
    },
  })
}

export function ArticleBody({ body }: { body: DefaultTypedEditorState | null }) {
  const footnotes = useMemo(() => collectFootnotes(body), [body])
  const converters = useMemo(() => makeConverters(footnotes), [footnotes])
  if (!body) return null

  const notes = [...footnotes.values()].sort((a, b) => a.number - b.number)

  return (
    <div className="article-prose">
      <RichText data={body} converters={converters} />

      {notes.length > 0 && (
        <section className="mt-16 border-t border-ink/15 pt-8">
          <h2 className="text-label font-mono text-primary! mb-5">Notas</h2>
          <ol className="flex flex-col gap-3">
            {notes.map((f) => (
              <li id={`fn-${f.number}`} key={f.number} className="flex gap-3 text-body text-ink/70">
                <a href={`#fn-ref-${f.number}`} className="font-mono text-primary no-underline">{f.number}.</a>
                <span>{f.text}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  )
}
