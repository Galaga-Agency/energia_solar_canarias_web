'use client'

import { useTranslations } from 'next-intl'
import { HiSearch } from '@/components/ui/Icons'

interface BlogSearchProps {
  value: string
  onChange: (v: string) => void
}

export function BlogSearch({ value, onChange }: BlogSearchProps) {
  const t = useTranslations('blog.search')

  return (
    <div className="flex items-center gap-3 border-b-2 border-text-on-dark/25 transition-colors focus-within:border-primary">
      <HiSearch aria-hidden="true" className="size-5 shrink-0 text-primary" />
      <label htmlFor="blog-search" className="sr-only">{t('label')}</label>
      <input
        id="blog-search"
        name="q"
        type="search"
        inputMode="search"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('placeholder')}
        className="text-body w-full bg-transparent py-3 text-text-on-dark! placeholder:text-text-on-dark/35"
      />
    </div>
  )
}
