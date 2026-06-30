/**
 * Equipment manufacturer brands shown on the proyectos page.
 * Structural data → constants (per I18N rule). Logos live in
 * /public/assets/logos/brands/ (white-background removed, webp).
 */
export interface Brand {
  name: string
  logo: string
}

export const BRANDS: Brand[] = [
  { name: 'Victron Energy',  logo: '/assets/logos/brands/victron.webp' },
  { name: 'SolarEdge',       logo: '/assets/logos/brands/solaredge.webp' },
  { name: 'SMA',             logo: '/assets/logos/brands/sma.webp' },
  { name: 'Fronius',         logo: '/assets/logos/brands/fronius.webp' },
  { name: 'Sungrow',         logo: '/assets/logos/brands/sungrow.webp' },
  { name: 'Trina Solar',     logo: '/assets/logos/brands/trina-solar.webp' },
  { name: 'LONGi',           logo: '/assets/logos/brands/longi.webp' },
  { name: 'Tesla Powerwall', logo: '/assets/logos/brands/tesla-powerwall.webp' },
  { name: 'Bluetti',         logo: '/assets/logos/brands/bluetti.webp' },
  { name: 'Sigenergy',       logo: '/assets/logos/brands/sigenergy.webp' },
  { name: 'Sonnen',          logo: '/assets/logos/brands/sonnen.webp' },
  { name: 'GoodWe',          logo: '/assets/logos/brands/goodwe.webp' },
  { name: 'Canadian Solar',  logo: '/assets/logos/brands/canadian-solar.webp' },
]
