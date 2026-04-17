'use client'

import Image from 'next/image'

interface SolucionCardProps {
  label:   string
  title:   string
  desc:    string
  image:   string
  isOpen:  boolean
  onSelect: () => void
}

export function SolucionCard({ label, title, desc, image, isOpen, onSelect }: SolucionCardProps) {
  return (
    <article
      onClick={onSelect}
      onMouseEnter={onSelect}
      className={`relative overflow-hidden brand-radius bg-white border border-border cursor-pointer solucion-card${isOpen ? ' solucion-card--open' : ''}`}
    >
      {/* Mobile */}
      <div className="flex flex-col md:hidden">
        <div className="p-6 flex flex-col gap-3">
          <span className="card-eyebrow">{label}</span>
          <h3 className="card-title">{title}</h3>
          <p className="card-content">{desc}</p>
        </div>
        <div className="relative aspect-video">
          <Image src={image} alt={title} fill className="object-cover" sizes="100vw" />
        </div>
      </div>

      {/* Desktop — closed state */}
      <div className="solucion-card-closed-panel hidden md:flex md:flex-col absolute inset-0 overflow-hidden">
        <div className="solucion-card-closed-text bg-white p-6 flex flex-col gap-2 h-[60%] overflow-hidden">
          <div className="max-w-52.5">
            <span className="card-eyebrow">{label}</span>
            <h3 className="card-title mt-1">{title}</h3>
            <p className="card-content mt-2">{desc}</p>
          </div>
        </div>
        <div className="relative h-[40%] overflow-hidden">
          <div className="absolute inset-x-0 inset-y-[-12%]" data-speed="0.85">
            <Image src={image} alt="" fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
        </div>
      </div>

      {/* Desktop — open state */}
      <div className="solucion-card-open-panel hidden md:grid absolute inset-0 bg-white">
        <div className="solucion-card-open-text p-8 flex flex-col justify-center gap-4">
          <span className="card-eyebrow">{label}</span>
          <h3 className="card-title">{title}</h3>
          <p className="card-content">{desc}</p>
        </div>
        <div className="relative min-w-0 overflow-hidden">
          <div className="absolute inset-x-0 inset-y-[-12%]" data-speed="0.85">
            <Image src={image} alt={title} fill className="object-cover" sizes="(min-width: 768px) 35vw, 100vw" />
          </div>
        </div>
      </div>
    </article>
  )
}
