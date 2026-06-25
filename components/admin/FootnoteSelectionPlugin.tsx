"use client"

import { useEffect } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { COMMAND_PRIORITY_CRITICAL, $getSelection, $isRangeSelection } from "lexical"
import { INSERT_INLINE_BLOCK_COMMAND } from "@payloadcms/richtext-lexical/client"

/**
 * When inserting a footnote inline block:
 * 1. Captures the selected text as `anchoredText` and merges it into the fields.
 * 2. Collapses the selection to its end so $insertNodes doesn't delete the text.
 * Returns false so the normal INSERT_INLINE_BLOCK_COMMAND handler still runs.
 */
export function FootnoteSelectionPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      INSERT_INLINE_BLOCK_COMMAND,
      (fields: Record<string, unknown>) => {
        if (fields?.blockType !== "footnote") return false

        const selection = $getSelection()
        if ($isRangeSelection(selection) && !selection.isCollapsed()) {
          const selectedText = selection.getTextContent()
          if (selectedText && !fields.anchoredText) {
            ;(fields as Record<string, unknown>).anchoredText = selectedText
          }
          // Let Lexical replace the selection with the inline block (default behavior)
        }

        return false
      },
      COMMAND_PRIORITY_CRITICAL,
    )
  }, [editor])

  return null
}
