import type { FeatureExtractionPipeline } from "@xenova/transformers"

const MODEL_ID = "Xenova/multilingual-e5-small"

const globalForEmbed = globalThis as typeof globalThis & {
  _embedPipeline:        FeatureExtractionPipeline | null
  _embedPipelinePromise: Promise<FeatureExtractionPipeline> | null
}

if (!globalForEmbed._embedPipeline)        globalForEmbed._embedPipeline = null
if (!globalForEmbed._embedPipelinePromise) globalForEmbed._embedPipelinePromise = null

async function getPipeline(): Promise<FeatureExtractionPipeline> {
  if (globalForEmbed._embedPipeline) return globalForEmbed._embedPipeline
  if (!globalForEmbed._embedPipelinePromise) {
    globalForEmbed._embedPipelinePromise = (async () => {
      const { pipeline } = await import("@xenova/transformers")
      return pipeline("feature-extraction", MODEL_ID) as Promise<FeatureExtractionPipeline>
    })()
  }
  try {
    globalForEmbed._embedPipeline = await globalForEmbed._embedPipelinePromise
  } catch (e) {
    globalForEmbed._embedPipelinePromise = null
    throw e
  }
  return globalForEmbed._embedPipeline
}

export async function embed(text: string, role: "passage" | "query" = "passage"): Promise<number[]> {
  const pipe   = await getPipeline()
  const prefix = role === "query" ? "query: " : "passage: "
  const out    = await pipe(prefix + text, { pooling: "mean", normalize: true })
  return Array.from(out.data as Float32Array)
}

export function cosine(a: number[], b: number[]): number {
  let dot = 0
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i]
  return dot
}
