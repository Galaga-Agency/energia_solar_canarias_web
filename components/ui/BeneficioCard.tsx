import Image from 'next/image'

interface BeneficioCardProps {
  label: string
  desc:  string
  image: string
  alt:   string
}

export function BeneficioCard({ label, desc, image, alt }: BeneficioCardProps) {
  return (
    <article className="flex flex-col brand-radius overflow-hidden bg-white border border-border">
      <div className="relative aspect-video w-full shrink-0">
        <Image
          src={image}
          alt={alt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      <div className="flex flex-col gap-3 p-6">
        <h3 className="card-title">{label}</h3>
        <p className="text-body-sm">{desc}</p>
      </div>
    </article>
  )
}
