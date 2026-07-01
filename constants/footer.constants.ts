export const FOOTER_SOCIAL = [
  { label: 'Instagram', href: 'https://instagram.com', icon: 'FaInstagram' },
  { label: 'LinkedIn',  href: 'https://linkedin.com',  icon: 'FaLinkedin'  },
]

export const FOOTER_NAV = [
  { labelKey: 'footer.links.solutions', href: '/soluciones' },
  { labelKey: 'footer.links.projects',  href: '/proyectos' },
  { labelKey: 'footer.links.about',     href: '/sobre-nosotros' },
  { labelKey: 'footer.links.blog',      href: '/blog' },
  { labelKey: 'footer.links.contact',   href: '/contacto' },
] as const

// Legal links live once — in the bottom bar.
export const FOOTER_LEGAL = [
  { labelKey: 'footer.links.privacy',     href: '/privacidad'  },
  { labelKey: 'footer.links.terms',       href: '/terminos'    },
  { labelKey: 'footer.links.cookies',     href: '/cookies'     },
  { labelKey: 'footer.links.legalNotice', href: '/aviso-legal' },
] as const
