'use client'

import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getLocaleFromPathname, getLocalizedHref } from '@/config/i18n.config'

type Variant = 'filled' | 'outlined' | 'white-filled' | 'green-dark'

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

const BASE =
  'group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 ' +
  'text-base font-normal font-sans leading-none tracking-normal no-underline ' +
  'rounded-none border whitespace-nowrap cursor-pointer ' +
  'transition-[background-color,color,border-color] duration-300 ease-out ' +
  '[&_[aria-hidden]]:inline-block [&_[aria-hidden]]:transition-transform ' +
  '[&_[aria-hidden]]:duration-300 [&_[aria-hidden]]:ease-out ' +
  'hover:[&_[aria-hidden]]:translate-x-1'

const VARIANTS: Record<Variant, string> = {
  'filled':
    'border-primary bg-primary text-text-on-primary ' +
    'hover:bg-primary-hover hover:border-primary-hover',
  'outlined':
    'border-primary bg-transparent text-primary ' +
    'hover:bg-primary hover:text-text-on-primary',
  'white-filled':
    'border-white bg-white text-primary ' +
    'hover:bg-transparent hover:border-white hover:text-white',
  'green-dark':
    'border-surface-dark bg-surface-dark text-text-on-dark ' +
    'hover:bg-surface-dark-2 hover:border-surface-dark-2',
}

export function Button({ variant = 'filled', children, ...props }: Props) {
  const pathname = usePathname()
  const locale   = getLocaleFromPathname(pathname)

  if ('href' in props && props.href) {
    const { href, className, ...rest } = props as AnchorProps
    const localizedHref = href.startsWith('/') ? getLocalizedHref(href, locale) : href
    return (
      <Link href={localizedHref} className={`${BASE} ${VARIANTS[variant]}${className ? ` ${className}` : ''}`} {...rest}>
        {children}
      </Link>
    )
  }

  const { className, ...rest } = props as ButtonProps

  return (
    <button className={`${BASE} ${VARIANTS[variant]}${className ? ` ${className}` : ''}`} {...rest}>
      {children}
    </button>
  )
}
