# SEO Implementation — Energía Solar Canarias

Complete reference for every SEO decision in this project: what was built, why, how it works, and what to never do.

---

## Table of contents

1. [File map](#1-file-map)
2. [Single source of truth — config/site.ts](#2-single-source-of-truth--configsitets)
3. [Root layout — metadata, viewport, global schemas](#3-root-layout--metadata-viewport-global-schemas)
4. [generatePageMetadata — the per-page helper](#4-generatepagemetadata--the-per-page-helper)
5. [Per-page usage — every page.tsx](#5-per-page-usage--every-pagetsx)
6. [Per-page JSON-LD schemas](#6-per-page-json-ld-schemas)
7. [OG images — opengraph-image.tsx](#7-og-images--opengraph-imagetsx)
8. [Sitemap with hreflang alternates](#8-sitemap-with-hreflang-alternates)
9. [robots.ts](#9-robotsts)
10. [Breadcrumbs — invisible, for crawlers only](#10-breadcrumbs--invisible-for-crawlers-only)
11. [Dynamic blog post page](#11-dynamic-blog-post-page)
12. [Component tree — why LocaleShell exists](#12-component-tree--why-localeshell-exists)
13. [Things that are intentionally absent](#13-things-that-are-intentionally-absent)
14. [Pre-launch checklist](#14-pre-launch-checklist)

---

## 1. File map

```
config/
  site.ts                          ← SITE_URL + SITE_NAME, single source of truth

app/
  layout.tsx                       ← root metadata + viewport + 3 global schemas
  sitemap.ts                       ← full sitemap with hreflang alternates
  robots.ts                        ← env-aware crawl rules

  [locale]/
    layout.tsx                     ← TranslationProvider + LocaleShell
    opengraph-image.tsx            ← homepage OG image
    page.tsx                       ← homepage generateMetadata

    soluciones/
      opengraph-image.tsx
      page.tsx                     ← Service schema + generateMetadata

    proyectos/
      opengraph-image.tsx
      page.tsx                     ← CollectionPage schema + generateMetadata

    sobre-nosotros/
      opengraph-image.tsx
      page.tsx                     ← AboutPage schema + generateMetadata

    blog/
      opengraph-image.tsx
      page.tsx                     ← Blog schema + generateMetadata
      [slug]/
        opengraph-image.tsx        ← per-post OG image
        page.tsx                   ← BlogPosting schema + generateMetadata + generateStaticParams

    contacto/
      opengraph-image.tsx
      page.tsx                     ← ContactPage schema + generateMetadata

utils/
  seo.ts                           ← generatePageMetadata helper
  og-image.tsx                     ← shared buildOgImage function

components/
  shared/
    Breadcrumbs.tsx                ← sr-only nav + BreadcrumbList JSON-LD
  layout/
    LocaleShell.tsx                ← wraps Navbar + Footer inside TranslationProvider
    PageShell.tsx                  ← SkipLink + PageLoader + <main> only (no translation deps)
```

---

## 2. Single source of truth — config/site.ts

```ts
export const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.energiasolarcanarias.es'
export const SITE_NAME = 'Energía Solar Canarias'
```

**Every file** that needs the base URL imports from here. Never hardcode the URL string anywhere else. Set `NEXT_PUBLIC_SITE_URL` in `.env.local` for local dev and in your hosting platform's env vars for production.

---

## 3. Root layout — metadata, viewport, global schemas

### Viewport (separate export — required)

`themeColor` must be exported via `Viewport`, not placed in `metadata.other`. This is the correct Next.js API.

```ts
import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: '#e4572c',
}
```

### Root metadata

```ts
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),         // required — makes relative image URLs resolve correctly in OG tags
  title: {
    default:  SITE_NAME,
    template: `%s | ${SITE_NAME}`,         // every page title becomes: "Page Title | Energía Solar Canarias"
  },
  description: 'Diseñamos tu independencia energética. Soluciones fotovoltaicas, almacenamiento y consultoría energética en Canarias.',
  authors:   [{ name: SITE_NAME }],
  creator:   SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      'max-video-preview': -1,
      'max-image-preview': 'large',   // allows Google to show full-size images in results
      'max-snippet':       -1,        // allows Google to show full snippets
    },
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      es: SITE_URL,
      en: `${SITE_URL}/en`,
    },
  },
  icons: {
    icon:  '/assets/icons/favicon.svg',
    apple: '/assets/icons/favicon.svg',
  },
}
```

### Global JSON-LD schemas

Three schemas are injected into `<head>` on every page. They are linked to each other via `@id` — this creates an entity graph Google can traverse.

```tsx
export default function RootLayout({ children }) {
  return (
    <html lang="es" className={acumin.variable}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

#### Organization schema

```ts
const orgSchema = {
  '@context':   'https://schema.org',
  '@type':      'Organization',
  '@id':        `${BASE}/#organization`,      // other schemas reference this @id
  name:         'Energía Solar Canarias',
  url:          BASE,
  logo: {
    '@type': 'ImageObject',
    url:     `${BASE}/assets/icons/favicon.svg`,
  },
  telephone:    '+34623574750',
  email:        'info@energiasolarcanarias.es',
  description:  'Diseñamos tu independencia energética...',
  foundingDate: '2015',
  address: {
    '@type':         'PostalAddress',
    streetAddress:   'C. las Mimosas, 65',
    addressLocality: 'Agüimes',
    postalCode:      '35118',
    addressRegion:   'Las Palmas',
    addressCountry:  'ES',
  },
  areaServed: [
    { '@type': 'Place', name: 'Gran Canaria' },
    { '@type': 'Place', name: 'Tenerife' },
    { '@type': 'Place', name: 'Islas Canarias' },
  ],
  serviceType: ['Instalación fotovoltaica', 'Almacenamiento de energía', 'Consultoría energética', 'Auditoría energética'],
  sameAs: [
    'https://www.instagram.com/energiasolarcanarias',
    'https://www.linkedin.com/company/energiasolarcanarias',
  ],
}
```

#### WebSite schema

```ts
const websiteSchema = {
  '@context':  'https://schema.org',
  '@type':     'WebSite',
  '@id':       `${BASE}/#website`,
  url:         BASE,
  name:        'Energía Solar Canarias',
  description: 'Soluciones de energía solar en Canarias',
  publisher:   { '@id': `${BASE}/#organization` },  // linked to Organization
  inLanguage:  ['es-ES', 'en'],
}
```

#### LocalBusiness schema

```ts
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type':    'LocalBusiness',
  '@id':      `${BASE}/#localbusiness`,
  name:       'Energía Solar Canarias',
  telephone:  '+34623574750',
  email:      'info@energiasolarcanarias.es',
  image:      `${BASE}/assets/icons/favicon.svg`,
  address:    { /* same PostalAddress object */ },
  geo: {
    '@type':    'GeoCoordinates',
    latitude:   27.9277,
    longitude: -15.4467,
  },
  openingHoursSpecification: [{
    '@type':    'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens:      '09:00',
    closes:     '18:00',
  }],
  priceRange: '€€',
  // ⚠️ NEVER add aggregateRating with made-up numbers — Google penalizes this.
  // Only add it when you have real verified reviews feeding it dynamically.
}
```

---

## 4. generatePageMetadata — the per-page helper

**File:** `utils/seo.ts`

The key design decision: you pass the **Spanish slug** (the canonical language), and the function automatically computes:
- The canonical URL (`/soluciones`)
- The English alternate URL (`/en/services`) via `getLocalizedHref`
- Both `hreflang` language alternates

You never pass a raw canonical string. You pass a slug and let the function derive everything.

```ts
import type { Metadata } from 'next'
import { getLocalizedHref } from '@/config/i18n.config'
import { SITE_URL as BASE_URL } from '@/config/site'

interface PageMetadataOptions {
  slug?:    string   // Spanish canonical slug, e.g. 'soluciones'. Omit for homepage.
  ogImage?: string   // Relative path e.g. '/assets/og/soluciones.jpg'. Falls back to default.
}

export function generatePageMetadata(
  title: string,
  description: string,
  { slug, ogImage }: PageMetadataOptions = {},
): Metadata {
  const esPath   = slug ? `/${slug}` : '/'
  const enPath   = slug ? getLocalizedHref(esPath, 'en') : '/en'
  const canonical = `${BASE_URL}${esPath}`
  const image    = ogImage ?? '/assets/og/default.jpg'

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical,
      languages: {
        es: `${BASE_URL}${esPath}`,
        en: `${BASE_URL}${enPath}`,
      },
    },
    openGraph: {
      title,
      description,
      type:     'website',
      url:      canonical,
      siteName: 'Energía Solar Canarias',
      locale:   'es_ES',
      images:   [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      images:      [image],
    },
  }
}
```

**URL mapping** (from `i18n.config.ts`):

| slug passed | es canonical | en alternate |
|---|---|---|
| *(omitted)* | `/` | `/en` |
| `soluciones` | `/soluciones` | `/en/services` |
| `proyectos` | `/proyectos` | `/en/projects` |
| `sobre-nosotros` | `/sobre-nosotros` | `/en/about-us` |
| `blog` | `/blog` | `/en/blog` |
| `contacto` | `/contacto` | `/en/contact` |

---

## 5. Per-page usage — every page.tsx

Each `app/[locale]/*/page.tsx` calls `generatePageMetadata` and injects a page-specific JSON-LD schema. Pattern:

```ts
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params   // params is a Promise in this version of Next.js
  const isEn = locale === 'en'

  return generatePageMetadata(
    isEn ? 'Title EN' : 'Título ES',
    isEn ? 'Description EN' : 'Descripción ES',
    { slug: 'nombre-pagina' },    // always the Spanish slug
  )
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params
  const isEn = locale === 'en'

  const schema = { /* page-specific JSON-LD */ }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <PageClient messages={isEn ? messagesEn : messagesEs} />
    </>
  )
}
```

> **Important:** `params` is typed as `Promise<{ locale: Language }>` and must be awaited. This is a breaking change in this version of Next.js. The old `{ params: { locale: string } }` (synchronous) will not work.

---

## 6. Per-page JSON-LD schemas

### /soluciones — Service

```ts
{
  "@context": "https://schema.org",
  "@type":    "Service",
  "@id":      `${SITE_URL}/soluciones/#service`,
  name:       "Soluciones de Energía Solar",
  description: "...",
  provider:   { "@id": `${SITE_URL}/#organization` },
  areaServed: { "@type": "Place", name: "Islas Canarias" },
  serviceType: "Energía Renovable",
  url:        `${SITE_URL}/soluciones`,
  brand:      { "@type": "Brand", name: SITE_NAME },
}
```

### /proyectos — CollectionPage

```ts
{
  "@context":   "https://schema.org",
  "@type":      "CollectionPage",
  "@id":        `${SITE_URL}/proyectos/#page`,
  name:         "Nuestros Proyectos",
  url:          `${SITE_URL}/proyectos`,
  isPartOf:     { "@id": `${SITE_URL}/#website` },
}
```

### /sobre-nosotros — AboutPage

```ts
{
  "@context":  "https://schema.org",
  "@type":     "AboutPage",
  "@id":       `${SITE_URL}/sobre-nosotros/#page`,
  url:         `${SITE_URL}/sobre-nosotros`,
  isPartOf:    { "@id": `${SITE_URL}/#website` },
  mainEntity:  { "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
}
```

### /blog — Blog

```ts
{
  "@context":  "https://schema.org",
  "@type":     "Blog",
  "@id":       `${SITE_URL}/blog/#page`,
  url:         `${SITE_URL}/blog`,
  isPartOf:    { "@id": `${SITE_URL}/#website` },
  publisher:   { "@id": `${SITE_URL}/#organization` },
  inLanguage:  "es-ES",
}
```

### /contacto — ContactPage

```ts
{
  "@context":  "https://schema.org",
  "@type":     "ContactPage",
  "@id":       `${SITE_URL}/contacto/#page`,
  url:         `${SITE_URL}/contacto`,
  isPartOf:    { "@id": `${SITE_URL}/#website` },
  mainEntity:  { "@id": `${SITE_URL}/#organization` },
}
```

### /blog/[slug] — BlogPosting

```ts
{
  "@context":      "https://schema.org",
  "@type":         "BlogPosting",
  "@id":           `${SITE_URL}/blog/${post.slug}/#article`,
  headline:        post.title,
  description:     post.excerpt,
  image:           post.image,
  dateModified:    post.updatedAt,
  url:             `${SITE_URL}/blog/${post.slug}`,
  isPartOf:        { "@id": `${SITE_URL}/blog/#page` },
  publisher:       { "@id": `${SITE_URL}/#organization` },
  inLanguage:      "es-ES",
  articleSection:  post.category,
}
```

---

## 7. OG images — opengraph-image.tsx

Every route has its own `opengraph-image.tsx`. No static image files needed — they are generated at request time via `ImageResponse`.

### Shared generator — utils/og-image.tsx

```ts
import { ImageResponse } from 'next/og'
import { SITE_URL } from '@/config/site'

export const ogSize        = { width: 1200, height: 630 }
export const ogContentType = 'image/png'

export function buildOgImage(title: string, tagline: string): ImageResponse {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
                    justifyContent: 'space-between', backgroundColor: '#1f3a34', padding: '60px 72px',
                    fontFamily: 'system-ui, sans-serif' }}>
        {/* Brand bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '6px', height: '40px', backgroundColor: '#e4572c', borderRadius: '3px' }} />
          <span style={{ color: '#f4f1ea', fontSize: '22px', letterSpacing: '0.08em', opacity: 0.7 }}>
            ENERGÍA SOLAR CANARIAS
          </span>
        </div>
        {/* Title + tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ width: '80px', height: '4px', backgroundColor: '#e4572c', borderRadius: '2px' }} />
          <div style={{ color: '#f4f1ea', fontSize: '64px', fontWeight: 700, lineHeight: 1.1 }}>
            {title}
          </div>
          <div style={{ color: '#f4f1ea', fontSize: '26px', opacity: 0.65, lineHeight: 1.4 }}>
            {tagline}
          </div>
        </div>
        {/* URL */}
        <div style={{ color: '#f4f1ea', fontSize: '18px', opacity: 0.4 }}>
          {SITE_URL.replace('https://', '')}
        </div>
      </div>
    ),
    { ...ogSize },
  )
}
```

**Colors used:**
- Background: `#1f3a34` (brand dark green — `--color-surface-dark`)
- Accent: `#e4572c` (brand primary — `--color-primary`)
- Text: `#f4f1ea` (off-white — `--color-bg`)

### Per-route file pattern

```ts
// app/[locale]/soluciones/opengraph-image.tsx
import { buildOgImage, ogSize, ogContentType } from '@/utils/og-image'
import type { Language } from '@/config/i18n.config'

export const size        = ogSize
export const contentType = ogContentType

export default async function Image({ params }: { params: Promise<{ locale: Language }> }) {
  const { locale } = await params
  const isEn = locale === 'en'

  return buildOgImage(
    isEn ? 'Energy Solutions' : 'Soluciones energéticas',
    isEn ? 'English tagline...' : 'Tagline en español...',
  )
}
```

### Blog post OG image

Blog posts have their own `opengraph-image.tsx` at `app/[locale]/blog/[slug]/opengraph-image.tsx`. It receives both `locale` and `slug` params, looks up the post from locale JSON, and renders the post's actual title and excerpt.

### How the file convention interacts with generateMetadata

The `opengraph-image.tsx` file convention **takes precedence** over the `images` array in `generateMetadata`. Both are set in this project so that if the file-based generation fails for any reason, the metadata fallback image is still there.

---

## 8. Sitemap with hreflang alternates

**File:** `app/sitemap.ts`

### Why hreflang in the sitemap matters

Without hreflang, Google sees `/soluciones` and `/en/services` as two different pages competing with each other for the same search intent. With hreflang, Google knows they are the same page in different languages and serves the right one to the right user.

### Implementation

```ts
type Entry = MetadataRoute.Sitemap[number]

function entry(esPath: string, enPath: string,
               opts: Pick<Entry, 'changeFrequency' | 'priority'>): Entry {
  return {
    url:          `${BASE}${esPath}`,
    lastModified: new Date(),
    ...opts,
    alternates: {
      languages: {
        es: `${BASE}${esPath}`,
        en: `${BASE}${enPath}`,
      },
    },
  }
}

const staticPages = [
  entry('/',               '/en',          { changeFrequency: 'weekly',  priority: 1.0 }),
  entry('/soluciones',     '/en/services', { changeFrequency: 'monthly', priority: 0.9 }),
  entry('/proyectos',      '/en/projects', { changeFrequency: 'monthly', priority: 0.8 }),
  entry('/sobre-nosotros', '/en/about-us', { changeFrequency: 'monthly', priority: 0.8 }),
  entry('/blog',           '/en/blog',     { changeFrequency: 'weekly',  priority: 0.7 }),
  entry('/contacto',       '/en/contact',  { changeFrequency: 'monthly', priority: 0.7 }),
]
```

### Priority rules

| Value | Used for |
|---|---|
| 1.0 | Homepage only |
| 0.9 | Main conversion page (soluciones) |
| 0.8 | Important supporting pages |
| 0.7 | Content/utility pages |
| 0.6 | Individual blog posts |

Priority only communicates hierarchy within your own site. It does not influence how your pages rank against other websites.

### Dynamic blog entries

The function is `async`. When a CMS is wired up:

```ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const posts = await fetchBlogPosts()
    const blogEntries = posts.map(p =>
      entry(`/blog/${p.slug}`, `/en/blog/${p.slug}`, {
        changeFrequency: 'weekly',
        priority: 0.6,
        lastModified: new Date(p.updatedAt),   // use real dates, not new Date()
      })
    )
    return [...staticPages, ...blogEntries]
  } catch {
    return staticPages   // always return at minimum the static pages
  }
}
```

---

## 9. robots.ts

```ts
export default function robots(): MetadataRoute.Robots {
  if (process.env.NODE_ENV !== 'production') {
    // Block all crawlers on dev and staging — never index non-production environments
    return {
      rules:   { userAgent: '*', disallow: '/' },
      sitemap: `${BASE}/sitemap.xml`,
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow:     '/',
        disallow:  ['/api/', '/_next/', '/admin/', '/404', '/500'],
      },
      {
        userAgent: 'Googlebot',
        allow:     '/',
        disallow:  ['/api/', '/_next/', '/admin/'],
        // No crawlDelay — Google ignores it. Only some minor crawlers respect it.
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    // No `host` directive — it is not a W3C standard and Google ignores it.
  }
}
```

**What is NOT in robots.txt and why:**
- No `crawlDelay` — Google officially ignores this directive
- No `host` directive — only Yandex ever used it; Google ignores it
- No blocking of Ahrefs/Semrush bots — these are SEO analysis tools, blocking them reduces your discoverability in agency dashboards

---

## 10. Breadcrumbs — invisible, for crawlers only

**File:** `components/shared/Breadcrumbs.tsx`

The `<nav>` is `sr-only` — visually hidden but present in the DOM. The `BreadcrumbList` JSON-LD `<script>` is always rendered and visible to Google. This gives you the structured data benefit (Google showing breadcrumb trails in search results) without adding visual noise to the design.

```tsx
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context':      'https://schema.org',
    '@type':         'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type':   'ListItem',
      position:  index + 1,
      name:      item.label,
      item:      `${BASE}${item.href}`,
    })),
  }

  return (
    <>
      <script type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <nav aria-label="Breadcrumb" className="sr-only">
        {/* visible to screen readers and crawlers, invisible on screen */}
        <ol>
          {items.map((item, index) => (
            <li key={item.href}>
              {index === items.length - 1
                ? <span aria-current="page">{item.label}</span>
                : <Link href={item.href}>{item.label}</Link>}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
```

### Usage in each client component

```tsx
// Inside each *Client.tsx (not homepage)
const { t } = useTranslation()

<Breadcrumbs items={[
  { label: t('nav.home'),      href: '/' },
  { label: t('nav.solutions'), href: '/soluciones' },
]} />
```

Labels come from `nav.*` keys in `locales/es/common.json` and `locales/en/common.json`. The `nav.home` key was added to both files as part of this implementation.

---

## 11. Dynamic blog post page

**File:** `app/[locale]/blog/[slug]/page.tsx`

```ts
// Pre-render all known slugs at build time
export async function generateStaticParams() {
  const slugsEs = blogEs.articles.map(a => ({ locale: 'es', slug: a.slug }))
  const slugsEn = blogEn.articles.map(a => ({ locale: 'en', slug: a.slug }))
  return [...slugsEs, ...slugsEn]
}

// Unique metadata per post
export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale, slug } = await params
  const post = getPost(locale, slug)
  if (!post) return {}

  return {
    title:       post.title,
    description: post.excerpt,
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
      languages: {
        es: `${SITE_URL}/blog/${post.slug}`,
        en: `${SITE_URL}/en/blog/${post.slug}`,
      },
    },
    openGraph: {
      title:       post.title,
      description: post.excerpt,
      type:        'article',               // 'article' type, not 'website'
      images:      [{ url: post.image, width: 1200, height: 630, alt: post.title }],
    },
  }
}
```

When a real CMS is connected, replace the locale JSON lookup (`blogEs.articles.find(...)`) with a fetch to your data source. The metadata and schema structure stays exactly the same.

---

## 12. Component tree — why LocaleShell exists

`Footer` and `Navbar` use `useTranslation()`. `TranslationProvider` lives in `app/[locale]/layout.tsx`. The root `Providers` component is in `app/layout.tsx` — which is a parent, not a child, of `[locale]/layout.tsx` in the render tree.

If `Navbar` and `Footer` lived in `PageShell` (inside `Providers`), they would be outside `TranslationProvider` and crash with `useTranslation must be used inside TranslationProvider`.

The fix: a `LocaleShell` client component that holds `Navbar` and `Footer`, rendered inside `[locale]/layout.tsx` below `TranslationProvider`.

```
app/layout.tsx
  RootLayout
    Providers                    ← AppReady, Motion, Transition, Scroll
      PageShell                  ← SkipLink, PageLoader, <main> only
        app/[locale]/layout.tsx
          TranslationProvider
            LocaleShell          ← Navbar + Footer (need translation context)
              {children}         ← page content
```

`PageShell` no longer contains `Navbar` or `Footer`. It only contains components that have no translation dependency.

---

## 13. Things that are intentionally absent

| Thing | Why it's absent |
|---|---|
| `keywords` meta tag | Google has ignored it since 2009. Zero ranking impact. |
| `geo.*` meta tags (`geo.region`, `geo.placename`, `geo.position`, `ICBM`) | Not supported by Google. These are Netscape-era tags from the 1990s. Use `LocalBusiness` schema for geographic targeting. |
| `aggregateRating` in LocalBusiness | Google penalizes fabricated ratings. Only add when backed by real verified review data fed dynamically. |
| `crawlDelay` in robots | Google ignores it entirely. |
| `host` in robots | Not a W3C standard. Only Yandex ever used it. Google ignores it. |
| Blocking Ahrefs/Semrush in robots | These are SEO auditing tools. Blocking them reduces discoverability in agency reports and dashboards. |
| `dns-prefetch` for Google Fonts | Irrelevant — this project uses `next/font/local`. No Google Fonts requests are made. |
| `<link rel="preload">` for hero images | Heroes are text-based, no images. When real hero images exist, use `<Image priority />` instead — Next.js handles the preload automatically. |
| Per-page `keywords` in `generatePageMetadata` | Same reason as root — Google ignores it. |

---

## 14. Pre-launch checklist

**Environment:**
- [ ] `NEXT_PUBLIC_SITE_URL` set in production env vars

**Verify outputs:**
- [ ] `/sitemap.xml` — all pages listed, hreflang pairs correct for each entry
- [ ] `/robots.txt` — production rules active (not the dev `disallow: /`)
- [ ] `/soluciones/opengraph-image` — renders branded OG image
- [ ] `/en/services/opengraph-image` — renders English variant
- [ ] `/blog/[slug]/opengraph-image` — renders post-specific OG image

**Validate:**
- [ ] [Google's Rich Results Test](https://search.google.com/test/rich-results) — test homepage and /soluciones for valid schemas
- [ ] [Google's Structured Data Testing Tool](https://developers.google.com/search/docs/appearance/structured-data) — verify entity graph links correctly
- [ ] Check that `aggregateRating` is absent from LocalBusiness unless real reviews are wired up

**Submit:**
- [ ] Submit `/sitemap.xml` to Google Search Console
- [ ] Submit `/sitemap.xml` to Bing Webmaster Tools
- [ ] Set up Google Search Console property if not done

**When blog CMS is connected:**
- [ ] Uncomment the dynamic blog entries block in `sitemap.ts`
- [ ] Replace locale JSON lookup in `blog/[slug]/page.tsx` with real data fetch
- [ ] Add `datePublished` to `BlogPosting` schema when publish date is available
