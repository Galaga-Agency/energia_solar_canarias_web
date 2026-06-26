import { getPayloadClient } from "@/lib/payload"
import { mediaUrl } from "@/lib/media-url"
import type { Article, ArticleCategory, CategoryInfo } from "@/types/article"
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical"
import type { Where } from "payload"

export { mediaUrl }

type LexicalNode = Record<string, unknown>
type Locale = "es" | "en"

type CategoryDoc = { id?: unknown; slug?: string | null; label?: string | null }

function resolveCategory(raw: unknown): { category: string; categoryLabel?: string } {
  if (raw && typeof raw === "object") {
    const c = raw as CategoryDoc
    return { category: String(c.slug ?? ""), categoryLabel: c.label ?? undefined }
  }
  return { category: typeof raw === "string" ? raw : "" }
}

function resolveTags(raw: unknown): Article["tags"] {
  if (!Array.isArray(raw)) return undefined
  const tags = raw
    .filter((t): t is { name?: string; slug?: string } => !!t && typeof t === "object")
    .map((t) => ({ name: t.name ?? "", slug: t.slug ?? "" }))
    .filter((t) => t.name && t.slug)
  return tags.length > 0 ? tags : undefined
}

export function toArticle(p: Record<string, unknown>): Article {
  return {
    id:            String(p.id),
    slug:          String(p.slug ?? ""),
    title:         String(p.title ?? ""),
    excerpt:       String(p.excerpt ?? ""),
    image:         mediaUrl(p.heroImage),
    imageCaption:  p.heroImageCaption  ? String(p.heroImageCaption)  : undefined,
    imagePosition: p.heroImagePosition ? String(p.heroImagePosition) : "center",
    readTime:      Number(p.readTime ?? 1),
    likes:         Number(p.likes ?? 0),
    author:        String(p.author ?? "Energía Solar Canarias"),
    publishedAt:   p.publishedAt ? String(p.publishedAt).slice(0, 10) : String(p.updatedAt ?? "").slice(0, 10),
    updatedLabel:  p.updatedLabel ? String(p.updatedLabel).slice(0, 10) : undefined,
    tags:          resolveTags(p.tags),
    ...resolveCategory(p.category),
  }
}

const PUBLISHED_AND: Where[] = [
  { hidden:  { not_equals: true } },
  { _status: { equals: "published" } },
]
const PUBLISHED: Where = { and: PUBLISHED_AND }

/** All published articles, newest first. Degrades to [] if Payload/DB is unavailable. */
export async function getArticles(locale: Locale = "es"): Promise<Article[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: "posts",
      locale,
      fallbackLocale: "es",
      where: PUBLISHED,
      limit: 200,
      depth: 1,
      sort: "-publishedAt",
    })
    return result.docs.map(toArticle)
  } catch (e) {
    console.error("[getArticles] Payload query failed:", e)
    return []
  }
}

/** Single article meta by slug (no body). */
export async function getArticleBySlug(slug: string, locale: Locale = "es"): Promise<Article | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "posts",
    locale,
    fallbackLocale: "es",
    where: { and: [{ slug: { equals: slug } }, ...PUBLISHED_AND] },
    limit: 1,
    depth: 1,
  })
  const doc = result.docs[0]
  return doc ? toArticle(doc as Record<string, unknown>) : null
}

/** Single article WITH its Lexical body (uploads populated). */
export async function getArticleWithBody(
  slug: string,
  locale: Locale = "es",
): Promise<{ article: Article; body: DefaultTypedEditorState | null } | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "posts",
    locale,
    fallbackLocale: "es",
    where: { and: [{ slug: { equals: slug } }, ...PUBLISHED_AND] },
    limit: 1,
    depth: 2,
  })
  const doc = result.docs[0]
  if (!doc) return null
  const body = await populateBodyUploads(payload, (doc as Record<string, unknown>).body, locale)
  return { article: toArticle(doc as Record<string, unknown>), body }
}

/** Given a post's slug in one locale, return its slug in BOTH locales.
 *  Used by the language switcher so /es/blog/<es-slug> maps to /en/blog/<en-slug>. */
export async function getArticleSlugs(slug: string, locale: Locale = "es"): Promise<{ es: string; en: string } | null> {
  const payload = await getPayloadClient()
  const found = await payload.find({
    collection: "posts",
    locale,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  const doc = found.docs[0] as Record<string, unknown> | undefined
  if (!doc) return null

  const id = doc.id
  const out: { es: string; en: string } = { es: "", en: "" }
  for (const loc of ["es", "en"] as const) {
    const res = await payload.find({
      collection: "posts",
      locale: loc,
      fallbackLocale: "es",
      where: { id: { equals: id } },
      limit: 1,
      depth: 0,
    })
    out[loc] = String((res.docs[0] as Record<string, unknown> | undefined)?.slug ?? slug)
  }
  return out
}

/** All categories, ordered — for the filter bar. Degrades to [] on failure. */
export async function getCategories(locale: Locale = "es"): Promise<CategoryInfo[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: "categories",
      locale,
      fallbackLocale: "es",
      where: { hidden: { not_equals: true } },
      limit: 50,
      depth: 0,
      sort: "order",
    })
    return result.docs.map((c: Record<string, unknown>) => ({
      id:          c.id as number | string,
      slug:        String(c.slug ?? ""),
      label:       String(c.label ?? c.title ?? c.slug ?? ""),
      description: c.description ? String(c.description) : undefined,
      tagline:     c.tagline ? String(c.tagline) : undefined,
      order:       c.order != null ? Number(c.order) : undefined,
    }))
  } catch (e) {
    console.error("[getCategories] Payload query failed:", e)
    return []
  }
}

export async function getArticlesByCategory(slug: ArticleCategory, locale: Locale = "es"): Promise<Article[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "posts",
    locale,
    fallbackLocale: "es",
    where: { and: [{ "category.slug": { equals: slug } }, ...PUBLISHED_AND] },
    limit: 100,
    depth: 1,
    sort: "-publishedAt",
  })
  return result.docs.map(toArticle)
}

/** All published slugs — for generateStaticParams. */
export async function getAllSlugs(): Promise<{ slug: string; locale: Locale }[]> {
  const out: { slug: string; locale: Locale }[] = []
  const payload = await getPayloadClient()
  for (const locale of ["es", "en"] as const) {
    const result = await payload.find({
      collection: "posts",
      locale,
      fallbackLocale: "es",
      where: PUBLISHED,
      limit: 500,
      depth: 0,
    })
    for (const d of result.docs) {
      const slug = String((d as Record<string, unknown>).slug ?? "")
      if (slug) out.push({ slug, locale })
    }
  }
  return out
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function populateBodyUploads(payload: any, body: unknown, locale: Locale): Promise<DefaultTypedEditorState | null> {
  if (body == null) return null
  const tree = JSON.parse(JSON.stringify(body)) as { root: LexicalNode }

  const ids = new Set<number>()
  function collect(node: LexicalNode) {
    if (node.type === "upload" && node.value && typeof node.value === "object") {
      const id = (node.value as { id?: unknown }).id
      if (id != null) ids.add(Number(id))
    }
    const children = node.children as LexicalNode[] | undefined
    if (children) children.forEach(collect)
  }
  collect(tree.root)

  if (ids.size === 0) return tree as unknown as DefaultTypedEditorState

  const result = await payload.find({
    collection: "media",
    locale,
    fallbackLocale: "es",
    where: { id: { in: [...ids] } },
    limit: ids.size + 10,
  })

  const mediaById = new Map<number, LexicalNode>()
  for (const doc of result.docs) mediaById.set(Number(doc.id), doc as LexicalNode)

  function populate(node: LexicalNode) {
    if (node.type === "upload" && node.value && typeof node.value === "object") {
      const doc = mediaById.get(Number((node.value as { id?: unknown }).id))
      if (doc) node.value = doc
    }
    const children = node.children as LexicalNode[] | undefined
    if (children) children.forEach(populate)
  }
  populate(tree.root)

  return tree as unknown as DefaultTypedEditorState
}
