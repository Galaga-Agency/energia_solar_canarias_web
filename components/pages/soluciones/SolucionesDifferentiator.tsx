import { Button } from '@/components/ui/Button'

interface SolucionesDifferentiatorProps {
  titleStart: string
  titleBrand: string
  titleEnd: string
  body: string
  primary: string
  secondary: string
}

export function SolucionesDifferentiator({
  titleStart,
  titleBrand,
  titleEnd,
  body,
  primary,
  secondary,
}: SolucionesDifferentiatorProps) {
  return (
    <section className="section-spacing" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="section-inner" data-reveal>
        <h2 className="text-heading mb-4 max-w-lg">{titleStart} <span className="brand-canarias">{titleBrand}</span>{titleEnd}</h2>
        <p className="text-body mb-8 max-w-xl">{body}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outlined" href="/contacto">{primary}</Button>
          <Button variant="filled" href="/contacto">{secondary}</Button>
        </div>
      </div>
    </section>
  )
}
