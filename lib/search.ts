import { getPayloadClient } from "@/lib/payload"
import { embed, cosine } from "@/lib/embeddings"
import { toArticle } from "@/lib/articles"
import type { Article } from "@/types/article"

export interface SearchHit extends Article {
  score: number
}

type Locale = "es" | "en"

/** Semantic search over published posts using the stored e5 embeddings. */
export async function searchArticles(query: string, limit = 10, locale: Locale = "es"): Promise<SearchHit[]> {
  const trimmed = query.trim()
  if (!trimmed) return []

  const queryVec = await embed(trimmed, "query")

  const payload = await getPayloadClient()
  const result  = await payload.find({
    collection: "posts",
    locale,
    fallbackLocale: "es",
    where: { and: [{ hidden: { not_equals: true } }, { _status: { equals: "published" } }] },
    limit:  500,
    depth:  1,
    sort:   "-publishedAt",
  })

  const scored: SearchHit[] = []
  for (const doc of result.docs as Record<string, unknown>[]) {
    const raw = doc.embedding
    if (typeof raw !== "string" || !raw) continue
    let vec: number[]
    try { vec = JSON.parse(raw) } catch { continue }
    if (!Array.isArray(vec) || vec.length !== queryVec.length) continue
    const score = cosine(queryVec, vec)
    scored.push({ ...toArticle(doc), score })
  }

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, limit)
}
