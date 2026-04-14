'use client'

interface BlobDecorProps {
  className?: string
}

export function BlobDecor({ className = '' }: BlobDecorProps) {
  return (
    <div
      aria-hidden="true"
      data-blob-decor
      className={`pointer-events-none absolute select-none ${className}`}
    >
      <svg
        viewBox="0 0 600 600"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        fill="var(--color-primary)"
      >
        <path d="M300,50 C420,50 530,120 550,250 C570,380 490,490 360,530 C230,570 100,500 70,380 C40,260 80,130 180,80 C230,55 265,50 300,50 Z" />
      </svg>
    </div>
  )
}
