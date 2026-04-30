import Image from 'next/image'

interface BeneficioCardProps {
  label: string
  desc: string
  image: string
  alt: string
  className?: string
}

export function BeneficioCard({ label, desc, image, alt, className = '' }: BeneficioCardProps) {
  return (
    <article
      className={`group overflow-hidden brand-radius border border-border/80 bg-white shadow-[0_18px_42px_rgba(18,28,24,0.05)] ${className}`}
      data-reveal
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={image}
          alt={alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-103"
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>

      <div className="p-4">
        <div className="mb-2 h-px w-8 bg-primary/35" />

        <div>
          <h3 className="card-title text-[1rem] leading-[1.15] tracking-[-0.02em] text-ink lg:text-[1.05rem]">
            {label}
          </h3>
          <p className="text-body mt-2 text-[0.86rem] leading-relaxed">
            {desc}
          </p>
        </div>
      </div>
    </article>
  )
}
