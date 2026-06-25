"use client"

import { createClientFeature } from "@payloadcms/richtext-lexical/client"
import { FootnoteSelectionPlugin } from "./FootnoteSelectionPlugin"
import { FootnoteListPlugin } from "./FootnoteListPlugin"

export const FootnoteSelectionFeatureClient = createClientFeature({
  plugins: [
    {
      Component: FootnoteSelectionPlugin,
      position: "normal",
    },
    {
      Component: FootnoteListPlugin,
      position: "belowContainer",
    },
  ],
})
