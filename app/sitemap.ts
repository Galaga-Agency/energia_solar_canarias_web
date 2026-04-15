import type { MetadataRoute } from 'next'
import { SITE_URL as BASE } from '@/config/site'

type SitemapEntry = MetadataRoute.Sitemap[number]

function entry(
  esPath: string,
  enPath: string,
  opts: Pick<SitemapEntry, 'changeFrequency' | 'priority' | 'lastModified'>,
): SitemapEntry {
  return {
    url: `${BASE}${esPath}`,
    ...opts,
    alternates: {
      languages: {
        es: `${BASE}${esPath}`,
        en: `${BASE}${enPath}`,
      },
    },
  }
}

const staticPages: MetadataRoute.Sitemap = [
  entry('/',               '/en',           { changeFrequency: 'weekly',  priority: 1.0,  lastModified: new Date() }),
  entry('/soluciones',     '/en/services',  { changeFrequency: 'monthly', priority: 0.9,  lastModified: new Date() }),
  entry('/proyectos',      '/en/projects',  { changeFrequency: 'monthly', priority: 0.8,  lastModified: new Date() }),
  entry('/sobre-nosotros', '/en/about-us',  { changeFrequency: 'monthly', priority: 0.8,  lastModified: new Date() }),
  entry('/blog',           '/en/blog',      { changeFrequency: 'weekly',  priority: 0.7,  lastModified: new Date() }),
  entry('/contacto',       '/en/contact',   { changeFrequency: 'monthly', priority: 0.7,  lastModified: new Date() }),
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // TODO: replace with real blog post fetch when CMS is wired up
    // const posts = await getAllBlogPosts()
    // const blogEntries = posts.map(p => entry(`/blog/${p.slug}`, `/en/blog/${p.slug}`, {
    //   changeFrequency: 'weekly',
    //   priority: 0.6,
    //   lastModified: new Date(p.updatedAt),
    // }))
    // return [...staticPages, ...blogEntries]

    return staticPages
  } catch {
    return staticPages
  }
}
