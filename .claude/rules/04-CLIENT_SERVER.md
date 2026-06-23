# CLIENT_SERVER.md — "use client" Rules & Imports

---

## Default: Server Component

Every file is a Server Component unless it needs one of these:
- Any React hook (`useState`, `useEffect`, `useRef`, `useContext`, …)
- Any browser API (`window`, `document`, `navigator`, `localStorage`, …)
- Event listeners or DOM manipulation
- GSAP, Lenis, or any animation library
- Context provider or consumer
- `react-hook-form`

`"use client"` must be the very first line. Nothing before it.

---

## Always "use client" (no exceptions)

- All files in `contexts/`
- All files in `hooks/`
- All files in `lib/`
- All files in `utils/animations/`

## Never "use client"

- `app/layout.tsx` and `app/*/page.tsx` — Server Components
- `utils/logger.ts` — pure logic
- `services/` files — unless exclusively client-side

---

## PageClient Pattern (required for every page)

```tsx
// app/about/page.tsx — Server Component, NO directive
import { AboutPageClient } from "@/components/pages/AboutPageClient"
export default async function AboutPage() {
  const data = await fetchAboutData()
  return <AboutPageClient data={data} />
}

// components/pages/about/AboutPageClient.tsx
"use client"
// All hooks, GSAP, refs, markReady() live here
```

---

## One File, One Component — Always

```tsx
// ❌ Wrong
// Navbar.tsx — two components in one file
const MobileMenu = () => { ... }
export const Navbar = () => { ... }

// ✅ Right — two files
// MobileMenu.tsx
export const MobileMenu = () => { ... }

// Navbar.tsx
import { MobileMenu } from "@/components/layout/MobileMenu"
export const Navbar = () => { ... }
```

No exceptions. Applies to every folder.

---

## IMPORTS.md inline — Import Rules

### Always use @/ aliases
```tsx
// ❌ Never
import { Button } from "../../components/ui/Button"

// ✅ Always
import { Button } from "@/components/ui/Button"
```

### Library imports — always through lib/
```tsx
// ❌ Direct library imports
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"
import { FiMenu } from "react-icons/fi"
import Link from "next/link"

// ✅ Through lib/ or Icons.tsx
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap"
import { Lenis } from "@/lib/lenis"
import { IconMenu } from "@/components/ui/Icons"
import { TransitionLink } from "@/components/ui/TransitionLink"
```

### Environment variables — only in config/
```tsx
// ❌ anywhere else
process.env.NEXT_PUBLIC_API_URL

// ✅ only in config/app.config.ts, then import the value
import { appConfig } from "@/config/app.config"
```

### Logging — never console.*
```tsx
// ❌
console.log("error", e)
console.error(e)

// ✅
import { logger } from "@/utils/logger"
logger.error(e)
```

---

## File Naming Convention

| Location | Convention | Examples |
|---|---|---|
| `components/` | PascalCase | `PageLoader.tsx`, `HomeHero.tsx` |
| `utils/`, `hooks/`, `lib/`, `config/`, `contexts/`, `services/` | kebab-case | `page-transitions.ts`, `loader-animations.ts`, `app.config.ts` |
| `types/`, `constants/` | kebab-case | `index.ts`, `nav.ts` |

```
✅ utils/animations/page-transitions.ts
✅ hooks/usePageReady.ts          ← hooks are the exception: camelCase with "use" prefix
✅ components/layout/PageShell.tsx
✅ lib/gsap.ts

❌ utils/animations/pageTransitions.ts
❌ components/layout/page-shell.tsx
```

Hooks (`hooks/`) use camelCase with the `use` prefix by React convention — that's the only exception.

---

## Provider Tree (Providers.tsx)

```tsx
// app/layout.tsx — Server Component
import { Providers } from "@/components/layout/Providers"
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body><Providers>{children}</Providers></body>
    </html>
  )
}

// components/layout/Providers.tsx — "use client"
<AppReadyProvider>
  <ScrollProvider>
    <TransitionProvider>
      <MotionPreferenceProvider>
        <InputModalityTracker />
        <PageLoader />
        <PageShell>{children}</PageShell>
        <TransitionOverlay />   {/* MANDATORY */}
        <Toaster />
        <LiveRegion />
      </MotionPreferenceProvider>
    </TransitionProvider>
  </ScrollProvider>
</AppReadyProvider>
```

---

## lib/ files

```ts
// lib/gsap.ts  "use client"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
gsap.registerPlugin(ScrollTrigger, useGSAP)
export { gsap, ScrollTrigger, useGSAP }

// lib/lenis.ts  "use client"
import Lenis from "lenis"
export { Lenis }

// lib/store.ts  "use client"
// All Zustand stores created and exported here.
```
