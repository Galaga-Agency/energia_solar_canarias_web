'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Article } from '@/types/article'
import { useState, useEffect } from 'react'
import { usePageReady } from '@/hooks/usePageReady'
import { useRegisterAlternateLocale } from '@/contexts/AlternateLocaleContext'
import { ArticleLoader } from './ArticleLoader'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { PaperTexture } from '@/components/ui/PaperTexture'
import { TagChip } from '@/components/ui/TagChip'
import { ArticleBody } from './ArticleBody'

function formatDate(iso: string, locale: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString(locale === 'en' ? 'en-GB' : 'es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

interface ArticlePostProps {
  article: Article
  body: DefaultTypedEditorState | null
  altPaths?: { es: string; en: string }
}

export function ArticlePost({ article, body, altPaths }: ArticlePostProps) {
  usePageReady()
  useRegisterAlternateLocale(altPaths ?? null)
  const nav = useTranslations('nav')
  const t   = useTranslations('blog')

  // Loader covers the article until the hero image is decoded (or there's no
  // hero), preventing the image/body pop-in flash on navigation.
  const [heroLoaded, setHeroLoaded] = useState(!article.image)
  useEffect(() => {
    // Safety net: never let the loader hang if onLoad never fires (cache, error).
    const fallback = setTimeout(() => setHeroLoaded(true), 2500)
    return () => clearTimeout(fallback)
  }, [])

  return (
    <article className="relative isolate bg-(--color-bg)">
      <ArticleLoader ready={heroLoaded} />
      <PaperTexture className="z-0" />
      <Breadcrumbs items={[
        { label: nav('home'),     href: '/' },
        { label: nav('blog'),     href: '/blog' },
        { label: article.title,   href: `/blog/${article.slug}` },
      ]} />

      {/* Header */}
      <header className="section-inner relative z-10 pt-[clamp(5rem,10vw,8rem)] pb-10 md:pb-14">
        <div className="max-w-[100ch]">
          <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            {article.categoryLabel && (
              <span className="text-label font-mono text-primary!">{article.categoryLabel}</span>
            )}
            <span aria-hidden className="text-ink/25">·</span>
            <span className="text-label font-mono text-ink/45!">{article.readTime} min</span>
          </div>

          <h1 className="text-display">{article.title}</h1>
          <p className="mt-6 text-body text-ink/70 max-w-[52ch]">{article.excerpt}</p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-ink/12 pt-6">
            <span className="text-label font-mono text-ink/55!">{article.author}</span>
            <span className="text-label font-mono text-ink/40!">{formatDate(article.publishedAt, 'es')}</span>
            {article.updatedLabel && (
              <span className="text-label font-mono italic text-ink/40!">
                {t('post.updated')} {formatDate(article.updatedLabel, 'es')}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Hero image — full width */}
      {article.image && (
        <figure className="relative mb-12 h-[clamp(18rem,45vh,34rem)] w-full overflow-hidden md:mb-16">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: article.imagePosition ?? 'center' }}
            onLoad={() => setHeroLoaded(true)}
          />
          {article.imageCaption && (
            <figcaption className="section-inner absolute inset-x-0 bottom-0 py-3 text-label font-mono text-[#f4f1ea]! [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
              {article.imageCaption}
            </figcaption>
          )}
        </figure>
      )}

      {/* Body */}
      <div className="section-inner relative z-10 pb-[clamp(4rem,9vw,8rem)]">
        <div className="max-w-[68ch]">
          <ArticleBody body={body} />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-14 flex flex-wrap gap-2.5 border-t border-ink/15 pt-8">
              {article.tags.map((tag) => (
                <TransitionLink key={tag.slug} href="/blog" className="keyboard-focus-ring" aria-label={tag.name}>
                  <TagChip label={tag.name} as="span" />
                </TransitionLink>
              ))}
            </div>
          )}

          {/* Back to blog */}
          <div className="mt-12">
            <TransitionLink href="/blog" className="inline-flex items-center gap-2 text-label font-mono text-primary!">
              <span aria-hidden>←</span> {t('post.back')}
            </TransitionLink>
          </div>
        </div>
      </div>
    </article>
  )
}
