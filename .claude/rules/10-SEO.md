# SEO.md — SEO & Metadata

All SEO via the Next.js Metadata API. No manual `<head>` tags. No external SEO packages.

---

## Root Metadata (app/layout.tsx)

```ts
export const metadata: Metadata = {
  metadataBase: new URL(appConfig.siteUrl),
  title: { default: "Your Business | Service", template: "%s | Your Business" },
  description: "Compelling description under 160 characters.",
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website", locale: "en_US",
    url: appConfig.siteUrl, title: "Your Business", description: "OG description",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "..." }],
    siteName: "Your Business",
  },
  twitter: { card: "summary_large_image", title: "Your Business",
             description: "Twitter description", images: ["/og-image.jpg"] },
  alternates: { canonical: appConfig.siteUrl },
}
```

---

## utils/seo.ts — Page Metadata Helper

```ts
export function generatePageMetadata({ title, description, keywords = [],
  canonical, images = ["/og-image.jpg"], type = "website" }: SEOProps): Metadata {
  return {
    title, description,
    openGraph: { title, description, type,
      images: images.map(url => ({ url, width: 1200, height: 630, alt: title })) },
    twitter: { card: "summary_large_image", title, description, images: [images[0]] },
    alternates: canonical ? { canonical } : undefined,
  }
}
```

Use `generatePageMetadata` as the default helper for all page-level metadata.

---

## app/sitemap.ts

```ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = appConfig.siteUrl
  const staticPages = [
    { url: base, priority: 1.0, changeFrequency: "weekly" },
    { url: `${base}/about`, priority: 0.9, changeFrequency: "monthly" },
  ].map(p => ({ ...p, lastModified: new Date() }))

  try {
    const posts = await fetchPosts()
    return [...staticPages, ...posts.map(p => ({
      url: `${base}/blog/${p.slug}`, lastModified: new Date(p.updatedAt),
      changeFrequency: "weekly", priority: 0.6,
    }))]
  } catch { return staticPages }
}
```

---

## app/robots.ts

```ts
export default function robots(): MetadataRoute.Robots {
  const base = appConfig.siteUrl
  const isProd = process.env.NODE_ENV === "production"
  if (!isProd) return { rules: { userAgent: "*", disallow: "/" } }
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/", "/_next/", "/private/"] },
      { userAgent: "Googlebot", allow: "/", disallow: ["/api/", "/admin/", "/_next/"] },
      { userAgent: ["AhrefsBot", "SemrushBot"], disallow: "/" },
    ],
    sitemap: `${base}/sitemap.xml`, host: base,
  }
}
```

Note: `process.env.NODE_ENV` is allowed here — it's a build-time constant, not an env variable.

---

## Organization Schema (app/layout.tsx)

```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
  "@context": "https://schema.org", "@type": "Organization",
  "@id": `${appConfig.siteUrl}/#organization`,
  "name": "Your Business", "url": appConfig.siteUrl,
  "logo": { "@type": "ImageObject", "url": `${appConfig.siteUrl}/logo.png` },
  "sameAs": ["https://linkedin.com/company/..."],
})}} />
```

---

## Image Performance

```tsx
// First visible <Image> on each page gets priority
<Image src="/assets/images/home/hero.jpg" priority alt="..." />

// utils/preload-images.ts — call once in root/home client component
export function preloadImages(): void {
  if (typeof window === "undefined") return
  const paths = ["/assets/images/home/hero.jpg", ...]
  const run = () => paths.forEach(src => { const img = new window.Image(); img.src = src })
  "requestIdleCallback" in window ? requestIdleCallback(run) : setTimeout(run, 2000)
}
// useEffect(() => { preloadImages() }, [])
```

---

## Lazy Loading Rules

```tsx
// Lazy-load: below-fold sections, modals, heavy widgets
const ProjectsSection = dynamic(() => import("@/components/sections/ProjectsSection"))

// Never lazy-load: Navbar, PageLoader, PageShell, Providers, LiveRegion, Toaster,
// or any component that calls markReady()

// ssr: false only for module-level browser API access — not just convenience
```

---

## Public Assets Structure

```
public/
  favicon.ico
  assets/images/common/, [page-name]/
  assets/videos/
  assets/icons/
  assets/fonts/  (.woff2 only — if not using next/font)
```

Nothing at `public/` root except `favicon.ico` and manifest icons.
