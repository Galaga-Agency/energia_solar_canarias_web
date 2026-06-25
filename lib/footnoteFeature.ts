import { createServerFeature } from "@payloadcms/richtext-lexical"

export const FootnoteSelectionFeature = createServerFeature({
  feature: {
    ClientFeature: "@/components/admin/FootnoteSelectionFeatureClient#FootnoteSelectionFeatureClient",
  },
  key: "footnoteSelection",
})
