export interface WorldMapCountry {
  name: string
  users: number
}

const NAME_TO_ISO: Record<string, string> = {
  "United States": "US", "United Kingdom": "GB", "Spain": "ES", "France": "FR",
  "Germany": "DE", "Italy": "IT", "Canada": "CA", "Mexico": "MX", "Brazil": "BR",
  "Argentina": "AR", "Australia": "AU", "Japan": "JP", "China": "CN", "India": "IN",
  "Russia": "RU", "Netherlands": "NL", "Belgium": "BE", "Portugal": "PT", "Sweden": "SE",
  "Norway": "NO", "Denmark": "DK", "Finland": "FI", "Poland": "PL", "Switzerland": "CH",
  "Austria": "AT", "Ireland": "IE", "New Zealand": "NZ", "South Korea": "KR",
  "Singapore": "SG", "Thailand": "TH", "Vietnam": "VN", "Malaysia": "MY",
  "Indonesia": "ID", "Philippines": "PH", "Turkey": "TR", "Saudi Arabia": "SA",
  "United Arab Emirates": "AE", "Israel": "IL", "Egypt": "EG", "South Africa": "ZA",
  "Chile": "CL", "Colombia": "CO", "Peru": "PE", "Venezuela": "VE", "Greece": "GR",
  "Czechia": "CZ", "Hungary": "HU", "Romania": "RO", "Ukraine": "UA", "Morocco": "MA",
}

export function buildWorldMapValues(countries: WorldMapCountry[]): Record<string, number> {
  const values: Record<string, number> = {}

  countries.forEach((country) => {
    const iso = NAME_TO_ISO[country.name]
    if (iso) values[iso] = country.users
  })

  return values
}

export function getCountryNameFromIso(code: string): string | undefined {
  return Object.keys(NAME_TO_ISO).find((name) => NAME_TO_ISO[name] === code)
}

export function getWorldMapPrimaryColor(): string {
  return getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim() || "#e4572c"
}

export function renderWorldMapTooltip(name: string, users: number): string {
  return `<div style="font-family:var(--font-mono);font-size:12px;padding:6px 10px;background:var(--color-ink);color:var(--color-text-on-dark);border:1px solid var(--color-primary)"><b>${name}</b> · ${users.toLocaleString()}</div>`
}
