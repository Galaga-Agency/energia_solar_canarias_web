import { TestimonialsSlider, type TestimonialItem } from '@/components/shared/TestimonialsSlider'

interface HomeTestimonialsProps {
  eyebrow: string
  title:   string
  body:    string
  items:   TestimonialItem[]
}

export function HomeTestimonials({ title, body, items }: HomeTestimonialsProps) {
  return (
    <section className="section-spacing overflow-hidden">
      <div className="section-inner mb-12" data-reveal>
        <div className="max-w-lg">
          <h2 className="text-title mb-4">{title}</h2>
          <p className="text-body">{body}</p>
        </div>
      </div>
      <TestimonialsSlider items={items} />
    </section>
  )
}
