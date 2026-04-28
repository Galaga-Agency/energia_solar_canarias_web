# Translations

This project uses [next-intl](https://next-intl-docs.vercel.app/) for all translations. The goal is simple: **every component owns its own translations — nothing is passed as props**.

---

## Why next-intl

Before this architecture was locked in, the project used a custom approach: a `TranslationContext` that loaded JSON files in a `useEffect`, exposed a manual `t()` function, and passed translated strings down as props to every section component.

That approach had two fundamental problems.

**The content flash problem.** When translations load inside `useEffect`, the component mounts first with no content, then re-renders after the JSON resolves. On every page load, text flickers in after the fact. SSR renders nothing meaningful because the translation state is empty on the server — the client has to load it all over again. This isn't a performance edge case, it's a structural flaw in loading translations client-side.

**The prop drilling problem.** With the custom approach, every page client component had to import locale files, destructure them, and pass every string down to every section component as a prop. Adding a new field meant touching the JSON, the client component, the section component interface, and every call site. The components had no autonomy — they were just display wrappers that received content from above.

next-intl solves both.

Messages are loaded in `i18n/request.ts`, which runs **on the server** before any component renders. By the time the page reaches the client, messages are already embedded in the `NextIntlClientProvider`. `useTranslations()` reads from that provider synchronously — no async, no flash, no waterfall. SSR works correctly because the server has the messages from the start. Components are self-contained because each one calls `useTranslations()` directly with its own namespace — no props, no imports, no coupling to the parent.

---

## Why this is the right call for accessibility

Translated text in the DOM is not inherently accessible or inaccessible — what matters is that translations are used consistently and completely. Two things make this setup correct.

**`<html lang={locale}>` is always set.** This comes from the `[locale]` URL segment in `app/[locale]/layout.tsx`. It is required by WCAG 3.1.1. Screen readers use it to determine which language engine to apply to the page. It is never missing here because the locale is structural — it is part of the URL, not derived from state.

**`t()` must be used for all text without exception.** This includes visible text, but also `aria-label`, `placeholder`, `alt`, button labels, and any string that reaches the DOM. Hardcoding `aria-label="Close menu"` in English while the page renders in Spanish is a WCAG 3.1.2 violation — the language of a UI part must match the declared language. next-intl makes this easy because `useTranslations()` is available anywhere. There is no excuse for bypassing it.

---

## Honest caveat — `t.raw()` is not type-safe

`t('key')` is typed — next-intl knows it returns a string. But `t.raw('key')` returns `unknown`, and throughout this codebase it is cast with `as { label: string; ... }[]`. This works at runtime but gives up compile-time safety. If a key is renamed in the JSON, TypeScript will not catch it.

next-intl supports full type inference through its [TypeScript integration](https://next-intl-docs.vercel.app/docs/workflows/typescript) — you point it at your message files and it generates the types automatically. This means `t('hero.title')` errors at compile time if `hero.title` does not exist in the JSON, and `t.raw('items')` returns the correct inferred type instead of `unknown`.

This project does not have that set up yet. It is worth adding once the locale files stabilize. Until then, be careful when renaming keys — the compiler will not warn you, only the runtime will.

---

## Folder structure

```
locales/
  es/
    common.json        ← nav, footer, actions, errors (shared across pages)
    home.json          ← homepage sections
    soluciones.json    ← soluciones page sections + faq
    proyectos.json     ← proyectos page sections + faq
    sobre-nosotros.json
    contacto.json
    blog.json
  en/
    common.json
    home.json
    ...                ← mirrors es/ exactly
```

Each file maps to one page. Each page file is namespaced under its page key when loaded (see below). The folder is named `locales/`, not `messages/` — this is intentional.

---

## How messages are loaded

`i18n/request.ts` runs on the server for every request. It imports all per-page locale files and merges them into a single messages object:

```ts
const [common, home, soluciones, ...] = await Promise.all([
  import(`../locales/${locale}/common.json`),
  import(`../locales/${locale}/home.json`),
  ...
])

return {
  messages: {
    ...common.default,        // nav, footer, actions spread at root
    home: home.default,       // { hero: {...}, solutions: {...}, ... }
    soluciones: soluciones.default,
    proyectos: proyectos.default,
    'sobre-nosotros': sobreNosotros.default,
    contacto: contacto.default,
    blog: blog.default,
  }
}
```

The final messages tree looks like:

```
nav.home
nav.solutions
footer.links
home.hero.title
home.hero.body
home.solutions.eyebrow
soluciones.hero.title
soluciones.faq.items.timeline.question
proyectos.stats.items[0].value
```

---

## How components use translations

Each component calls `useTranslations()` with its own namespace. No content is passed as props from parent to child.

```tsx
// components/pages/home/HomeHero2.tsx
import { useTranslations } from 'next-intl'

export function HomeHero2() {
  const t = useTranslations('home.hero')
  return <h1>{t('title')}</h1>
}
```

```tsx
// components/pages/soluciones/SolucionesHero.tsx
import { useTranslations } from 'next-intl'

export function SolucionesHero() {
  const t     = useTranslations('soluciones.hero')
  const items = t.raw('items') as { label: string; title: string; body: string }[]
  return (...)
}
```

Use `t('key')` for strings. Use `t.raw('key')` for objects or arrays.

The client controller renders section components with zero content props:

```tsx
// HomeClient.tsx
export function HomeClient() {
  const nav = useTranslations('nav')
  return (
    <>
      <Breadcrumbs items={[{ label: nav('home'), href: '/' }]} />
      <HomeHero2 />
      <HomeSoluciones />
      <HomeStats />
    </>
  )
}
```

❌ Never: `<HomeHero2 title={t('hero.title')} body={t('hero.body')} />`
✅ Always: `<HomeHero2 />`

The only exception is truly shared layout primitives like `FAQAccordion` and `CTABanner`, which are used across pages with different content. Those legitimately receive data as props — the client component reads the relevant namespace and passes it down. This is acceptable because these are reusable UI components, not page sections.

---

## Namespace map

| Component | Namespace |
|---|---|
| `HomeHero2` | `home.hero` |
| `HomeSoluciones` | `home.solutions` |
| `HomeBeneficios` | `home.benefits` |
| `HomeProyectos` | `home.projects` |
| `HomeStats` | `home.stats` |
| `HomeFounder` | `home.founder` |
| `HomeTestimonials` | `home.testimonials` |
| `HomeCTA` | `home.cta` |
| `SolucionesHero` | `soluciones.hero` |
| `SolucionesPainPoints` | `soluciones.painPoints` |
| `SolucionesQuote` | `soluciones.quote` |
| `SolucionesDifferentiator` | `soluciones.differentiator` |
| `SolucionesProcess` | `soluciones.process` |
| `SolucionesGuarantees` | `soluciones.guarantees` |
| `ProyectosHero` | `proyectos.hero` |
| `ProyectosGrid` | `proyectos.grid` |
| `ProyectosStats` | `proyectos.stats` |
| `ProyectosTestimonial` | `proyectos.testimonial` |
| `SobreNosotrosHero` | `sobre-nosotros.hero` |
| `SobreNosotrosNarrative` | `sobre-nosotros.narrative` |
| `SobreNosotrosBenefits` | `sobre-nosotros.benefits` |
| `SobreNosotrosLeadership` | `sobre-nosotros.leadership` |
| `SobreNosotrosTestimonial` | `sobre-nosotros.testimonial` |
| `ContactoSection` | `contacto.section` |
| `BlogHero` | `blog.hero` |
| `BlogFilterBar` | `blog.filter` |
| `BlogArticles` | `blog` |
| Breadcrumbs nav labels | `nav` (in client component) |
| FAQ accordion (soluciones) | `soluciones.faq` |
| FAQ accordion (contacto) | `contacto.faq` |
| CTA banner (soluciones) | `soluciones.cta` |
| CTA banner (proyectos) | `proyectos.cta` |

---

## Locale detection

`proxy.ts` (Next.js 16's name for middleware) handles locale detection from the URL:

- `/` → Spanish (default)
- `/en/...` → English
- English route names (`/en/about-us`) are rewritten internally to canonical Spanish paths (`/en/sobre-nosotros`)

After resolving the locale, `proxy.ts` sets the `x-next-intl-locale` request header so next-intl knows which locale to use in `getRequestConfig`.

---

## Client provider

`app/[locale]/layout.tsx` wraps every page in `NextIntlClientProvider` with the server-fetched messages, making `useTranslations()` available in all client components:

```tsx
const messages = await getMessages()  // calls i18n/request.ts
return (
  <NextIntlClientProvider messages={messages}>
    {children}
  </NextIntlClientProvider>
)
```

---

## Adding a new translation key

1. Add the key to `locales/es/[page].json`
2. Add the translated value to `locales/en/[page].json`
3. Use it in the component with `useTranslations('[page].[section]')`

No other files need to change.

---

## Adding a new page

1. Create `locales/es/[page].json` and `locales/en/[page].json`
2. Import and merge the new files in `i18n/request.ts`
3. Components on that page use `useTranslations('[page].[section]')`
