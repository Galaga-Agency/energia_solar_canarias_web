import type { MetadataRoute } from 'next'
import { SITE_URL as BASE } from '@/config/site'

export default function robots(): MetadataRoute.Robots {
  if (process.env.NODE_ENV !== 'production') {
    return {
      rules:   { userAgent: '*', disallow: '/' },
      sitemap: `${BASE}/sitemap.xml`,
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/', '/404', '/500'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  }
}
