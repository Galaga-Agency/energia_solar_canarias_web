'use client'

import { useTranslations } from 'next-intl'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { useGSAPAnimations } from '@/hooks/useGSAPAnimations'
import type { Article }   from '@/types/article'
import { initScrollRevealSections } from '@/utils/animations/scroll-reveal'

interface BlogArticlesProps {
  articles: Article[]
  viewMode: 'grid' | 'list'
}

export function BlogArticles({ articles, viewMode }: BlogArticlesProps) {
  const t           = useTranslations('blog')
  const articleKeys = articles.map((article) => article.id).join('|')

  useGSAPAnimations(() => ({
    timeout: [initScrollRevealSections],
  }), { dependencies: [articleKeys, viewMode] })

  return (
    <section className="section-spacing-both" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="section-inner">
        <div
          className={viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
            : 'flex flex-col gap-6'
          }
        >
          {articles.map((article) => (
            <article
              key={article.id}
              className={`card flex ${viewMode === 'list' ? 'flex-row' : 'flex-col'}`}
              data-reveal
            >
              <div
                className={`bg-[var(--color-border)] shrink-0 ${
                  viewMode === 'list' ? 'w-48 aspect-square' : 'w-full aspect-video'
                }`}
              />
              <div className="p-6 flex flex-col gap-3 flex-1">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-surface text-text">{article.category}</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-surface text-text">{article.readTime}</span>
                </div>
                <h2 className="text-subheading">{article.title}</h2>
                <p className="text-body flex-1">{article.excerpt}</p>
                <TransitionLink
                  href={`/blog/${article.slug}`}
                  className="text-body-sm font-semibold"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {t('readMore')}
                </TransitionLink>
              </div>
            </article>
          ))}
        </div>

        {articles.length === 0 && (
          <p className="text-body text-center py-12">{t('empty')}</p>
        )}
      </div>
    </section>
  )
}
