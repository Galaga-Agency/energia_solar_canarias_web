import Link from 'next/link'

export interface BreadcrumbItem {
  label: string
  href:  string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.energiasolarcanarias.es'

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schema = {
    '@context':       'https://schema.org',
    '@type':          'BreadcrumbList',
    itemListElement:  items.map((item, index) => ({
      '@type':   'ListItem',
      position:  index + 1,
      name:      item.label,
      item:      `${BASE}${item.href}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className="sr-only">
        <ol>
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            return (
              <li key={item.href}>
                {isLast ? (
                  <span aria-current="page">{item.label}</span>
                ) : (
                  <Link href={item.href}>{item.label}</Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
