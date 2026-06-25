const PLACEHOLDER = "/assets/images/placeholders/placeholder-2.webp"

/** Resolve a Payload media doc / upload field to a usable URL. Client-safe (no server imports). */
export function mediaUrl(f: unknown): string {
  if (!f || typeof f !== "object") return PLACEHOLDER
  const img = f as { url?: string | null; filename?: string | null }
  if (img.url) return img.url // S3 storage returns an absolute url
  return img.filename ? `/api/media/file/${img.filename}` : PLACEHOLDER
}
