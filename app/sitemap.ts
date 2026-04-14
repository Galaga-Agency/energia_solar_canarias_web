import type { MetadataRoute } from 'next'

const BASE = 'https://www.energiasolarcanarias.es'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,                       lastModified: new Date(), changeFrequency: 'weekly',  priority: 1 },
    { url: `${BASE}/soluciones`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/proyectos`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/sobre-nosotros`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/blog`,             lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/contacto`,         lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.9 },
  ]
}
