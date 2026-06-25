"use client"

import { useEffect, useState } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

interface FootnoteEntry {
  number: number
  anchoredText: string
  text: string
}

function collectFootnotes(editorState: unknown): FootnoteEntry[] {
  const entries: FootnoteEntry[] = []
  let n = 0

  function walk(node: unknown) {
    if (!node || typeof node !== "object") return
    const obj = node as Record<string, unknown>
    if (
      obj.type === "inlineBlock" &&
      (obj.fields as { blockType?: string } | undefined)?.blockType === "footnote"
    ) {
      const f    = obj.fields as { text?: string; anchoredText?: string }
      const text = String(f.text ?? "").trim()
      if (text) {
        n += 1
        entries.push({
          number:       n,
          anchoredText: String(f.anchoredText ?? "").trim(),
          text,
        })
      }
    }
    const children = obj.children
    if (Array.isArray(children)) children.forEach(walk)
  }

  try {
    const state = editorState as { _nodeMap?: Map<string, unknown> }
    if (state._nodeMap) {
      state._nodeMap.forEach((node) => walk(node))
    }
  } catch {
    // ignore
  }

  return entries
}

export function FootnoteListPlugin() {
  const [editor] = useLexicalComposerContext()
  const [footnotes, setFootnotes] = useState<FootnoteEntry[]>([])

  useEffect(() => {
    const update = () => {
      editor.getEditorState().read(() => {
        const json = editor.getEditorState().toJSON()
        const entries: FootnoteEntry[] = []
        let n = 0

        function walk(node: unknown) {
          if (!node || typeof node !== "object") return
          const obj = node as Record<string, unknown>
          if (
            obj.type === "inlineBlock" &&
            (obj.fields as { blockType?: string } | undefined)?.blockType === "footnote"
          ) {
            const f    = obj.fields as { text?: string; anchoredText?: string }
            const text = String(f.text ?? "").trim()
            if (text) {
              n += 1
              entries.push({
                number:       n,
                anchoredText: String(f.anchoredText ?? "").trim(),
                text,
              })
            }
          }
          const children = obj.children
          if (Array.isArray(children)) children.forEach(walk)
        }

        walk((json as { root?: unknown }).root)
        setFootnotes(entries)
      })
    }

    update()
    return editor.registerUpdateListener(update)
  }, [editor])

  if (footnotes.length === 0) return null

  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Notas al pie
      </p>
      <ol className="flex flex-col gap-1" style={{ listStyle: "none", padding: 0 }}>
        {footnotes.map(({ number, anchoredText, text }) => (
          <li key={number} className="flex gap-2 text-sm text-gray-600">
            <span className="shrink-0 font-semibold">{number}.</span>
            <span>
              {anchoredText && (
                <em className="text-gray-400">[{anchoredText}]</em>
              )}{anchoredText ? " " : ""}{text}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
