import Image, { type ImageProps } from 'next/image'

interface PlaceholderImageProps extends ImageProps {
  /** Short note about what real content goes here (shown on the band). */
  note?: string
}

/**
 * TEMPORARY drop-in replacement for <Image>. Renders the (placeholder) image
 * exactly like next/image but stamps a visible "CONTENIDO PENDIENTE" band over
 * it, so stand-in art is never mistaken for final content.
 *
 * Swap `<Image .../>` → `<PlaceholderImage .../>` (same props). When the client
 * delivers the real asset, swap it back. Grep `PlaceholderImage` to find them all.
 */
export function PlaceholderImage({ note, className, alt, ...imageProps }: PlaceholderImageProps) {
  return (
    <span data-placeholder-image className="contents">
      <Image alt={alt} className={className} {...imageProps} />

      {/* Overlay — does not affect layout (absolute inside the image's positioned parent). */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
      >
        {/* Diagonal hazard stripes */}
        <span className="absolute inset-0 opacity-[0.18] bg-[repeating-linear-gradient(45deg,#1f3a34_0_14px,transparent_14px_28px)]" />
        {/* Tint so light images stay legible */}
        <span className="absolute inset-0 bg-[#1f3a34]/25" />

        {/* Centered band */}
        <span className="relative max-w-[88%] -rotate-6 border border-[#f4f1ea]/70 bg-[#e4572c] px-4 py-2 text-center shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
          <span className="block font-mono text-[11px] uppercase leading-tight tracking-[0.22em] text-[#f4f1ea]">
            Imagen de Placeholder
          </span>
          {note && (
            <span className="mt-1 block font-mono text-[10px] uppercase leading-tight tracking-[0.14em] text-[#f4f1ea]/85">
              {note}
            </span>
          )}
        </span>
      </span>
    </span>
  )
}
