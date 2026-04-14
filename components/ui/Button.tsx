'use client'

import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getLocaleFromPathname, getLocalizedHref } from '@/config/i18n.config'

type Variant = 'filled' | 'outlined' | 'outlined-on-dark'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant
  href?:     never
  children:  ReactNode
}

interface AnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant
  href:     string
  children: ReactNode
}

type Props = ButtonProps | AnchorProps

function variantClass(v: Variant = 'filled') {
  return `btn-base ${
    v === 'filled'           ? 'btn-filled' :
    v === 'outlined'         ? 'btn-outlined' :
                               'btn-outlined-on-dark'
  }`
}

export function Button({ variant = 'filled', children, ...props }: Props) {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)

  if ('href' in props && props.href) {
    const { href, ...rest } = props as AnchorProps
    const localizedHref = href.startsWith('/') ? getLocalizedHref(href, locale) : href
    return (
      <Link href={localizedHref} className={variantClass(variant)} {...rest}>
        {children}
      </Link>
    )
  }

  const { ...rest } = props as ButtonProps
  return (
    <button className={variantClass(variant)} {...rest}>
      {children}
    </button>
  )
}
