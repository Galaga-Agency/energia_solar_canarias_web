'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { getLocaleFromPathname, getLocalizedHref } from '@/config/i18n.config'
import { useTransitionContext } from '@/contexts/TransitionContext'

interface TransitionLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href:     string
  children: ReactNode
}

export function TransitionLink({ href, children, onClick, ...props }: TransitionLinkProps) {
  const pathname = usePathname()
  const { isTransitioning, startTransition } = useTransitionContext()
  const locale = getLocaleFromPathname(pathname)
  const localizedHref = href.startsWith('/') ? getLocalizedHref(href, locale) : href

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented) return
    if (
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0 ||
      localizedHref.startsWith('#')
    ) {
      return
    }

    e.preventDefault()
    startTransition(localizedHref)
  }

  return (
    <Link
      href={localizedHref}
      onClick={handleClick}
      aria-disabled={isTransitioning ? true : undefined}
      {...props}
    >
      {children}
    </Link>
  )
}
