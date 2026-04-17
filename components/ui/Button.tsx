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

const BASE = 'inline-flex items-center justify-center gap-2 text-base font-normal font-sans leading-[1.1] tracking-[-0.02em] no-underline transition-[background-color,color,border-color,filter,box-shadow] duration-300 ease-out cursor-pointer whitespace-nowrap'

const VARIANTS: Record<Variant, string> = {
  'filled':
    'px-5 py-2 rounded-[8px] border-2 border-[#f49272] bg-[linear-gradient(160deg,#f07248_0%,#e4572c_55%,#c03820_100%)] text-text-on-primary btn-glow-orange ' +
    'hover:bg-[linear-gradient(160deg,#ff8c5a_0%,#f05535_55%,#d04020_100%)] hover:border-[#ff9e82]',
  'outlined':
    'px-5 py-2 rounded-[8px] border-2 border-primary text-primary bg-transparent btn-glow-orange-outline ' +
    'hover:border-[#ff9e82] hover:text-primary',
  'white-filled':
    'px-5 py-2 rounded-[8px] border-2 border-[rgba(244,146,114,0.35)] bg-white text-primary btn-glow-warm ' +
    'hover:border-[rgba(244,146,114,0.55)]',
  'green-dark':
    'px-5 py-2 rounded-[8px] border-2 border-surface-dark bg-surface-dark text-text-on-dark btn-glow-dark ' +
    'hover:bg-surface-dark-2 hover:border-surface-dark-2',
}

export function Button({ variant = 'filled', children, ...props }: Props) {
  const pathname = usePathname()
  const locale   = getLocaleFromPathname(pathname)

  if ('href' in props && props.href) {
    const { href, ...rest } = props as AnchorProps
    const localizedHref = href.startsWith('/') ? getLocalizedHref(href, locale) : href
    return (
      <Link href={localizedHref} className={`${BASE} ${VARIANTS[variant]}`} {...rest}>
        {children}
      </Link>
    )
  }

  return (
    <button className={`${BASE} ${VARIANTS[variant]}`} {...(props as ButtonProps)}>
      {children}
    </button>
  )
}
