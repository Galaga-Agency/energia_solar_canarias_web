'use client'

interface PaperTextureProps {
  className?: string
  blendClassName?: string
  opacityClassName?: string
  mode?: 'cover' | 'tile'
}

export function PaperTexture({
  className = '',
  blendClassName = 'mix-blend-multiply',
  opacityClassName = 'opacity-25',
  mode = 'tile',
}: PaperTextureProps) {
  const textureClassName =
    mode === 'tile'
      ? "bg-[url('/assets/images/common/white-paper-texture.jpg')] bg-[length:100%_auto] bg-repeat-y bg-top"
      : "bg-[url('/assets/images/common/white-paper-texture.jpg')] bg-cover bg-center"

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${blendClassName} ${opacityClassName} ${textureClassName} ${className}`.trim()}
    />
  )
}
