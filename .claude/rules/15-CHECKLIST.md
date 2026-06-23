# CHECKLIST.md — Per-File Enforcement

Run this after writing EVERY file. Every answer must be NO. Fix before moving on.

---

## A. Structure

- [ ] More than one component exported from this file? → Split.
- [ ] Component defined inside another component or function? → Extract.
- [ ] Page `app/*/page.tsx` contains hooks/refs/browser APIs? → Extract to `*Client.tsx`.
- [ ] File in `components/pages/[page]/` not named `[Page][Section].tsx` or `[Page]Client.tsx`? → Rename.
- [ ] File in `utils/animations/` named after a page or section (e.g. `home-hero.ts`, `trabajar-hero.ts`)? → Rename to describe the behavior: `verb-ticker.ts`, `image-reveal-drag.ts`, `scroll-reveal.ts`.
- [ ] Modal not using `createPortal`? → All modals must use React Portal.
- [ ] Form and its modal in the same file? → Split them.
- [ ] `middleware.ts` exists? → Delete. Use `proxy.ts` at project root.
- [ ] `tailwind.config.ts` exists? → Delete. Tailwind v4 is CSS-only.
- [ ] `*.module.css` file exists? → Delete. No CSS modules.
- [ ] `app/globals.css` exists? → Delete. `globals.css` is at project root.

## B. Imports

- [ ] Any `../../` relative import? → Replace with `@/`.
- [ ] Direct import from `gsap` or `gsap/ScrollTrigger`? → Use `@/lib/gsap`.
- [ ] Direct import from `lenis`? → Use `@/lib/lenis`.
- [ ] Direct import from `react-icons/*`? → Use `@/components/ui/Icons`.
- [ ] Using `next/link` directly in app code? → Use `TransitionLink`.
- [ ] Reading `process.env.*` outside `config/app.config.ts`? → Move to config.
- [ ] Importing from headless-ui, shadcn, radix, or any third-party component lib? → Remove.
- [ ] Importing `globals.css` anywhere other than `app/layout.tsx`? → Remove.

## C. "use client"

- [ ] Has `"use client"` but uses no hooks, browser APIs, GSAP, Lenis, context, or react-hook-form? → Remove directive.
- [ ] `"use client"` is not the very first line? → Move to line 1.
- [ ] File in `contexts/` or `hooks/` or `lib/` or `utils/animations/` without `"use client"`? → Add it.
- [ ] `utils/logger.ts` has `"use client"`? → Remove.
- [ ] `app/layout.tsx` or `app/*/page.tsx` has `"use client"`? → Remove. Extract client logic.
- [ ] Executable inline `<script dangerouslySetInnerHTML={{__html: "...runnable JS..."}}>` (or with JS children) in any RSC/layout/page? → Remove. Next 15+/16 never runs it on the client and React warns at runtime. Move the logic to a `useEffect` in a client context, or use `next/script strategy="beforeInteractive"`. (A `<script type="application/ld+json">` data block is exempt.)

## D. CSS & Tokens — INLINE STYLES ARE BANNED

**`style={{}}` props are COMPLETELY FORBIDDEN in JSX. No exceptions.**

One option only: **Tailwind utility class**. Use arbitrary values `[value]` for anything not in the scale (e.g. `pt-[clamp(6rem,14vh,8rem)]`, `max-w-[52ch]`). Use arbitrary properties `[property:value]` for any CSS property Tailwind doesn't have a named utility for (e.g. `[grid-template-columns:1fr_240px]`). Use `(--var)` syntax for CSS variables (e.g. `pt-(--pad)`). There is no fallback CSS file.

**Never write `style={{ anything }}`.**

- [ ] Any `style={{}}` prop in JSX? → Move to Tailwind arbitrary class. No exceptions.
- [ ] `position: "relative/absolute/fixed"` inline? → `relative` / `absolute` / `fixed`
- [ ] `overflow: "hidden"` inline? → `overflow-hidden`
- [ ] `display: "flex/grid"` inline? → `flex` / `grid`
- [ ] `objectFit: "cover"` inline? → `object-cover`
- [ ] `inset: 0` inline? → `inset-0`
- [ ] `width/height: "100%"` inline? → `w-full` / `h-full`
- [ ] `height: "100vh"` inline? → `h-screen`
- [ ] `opacity` inline? → `opacity-80` etc.
- [ ] `color: "var(--color-*)"` inline? → `text-primary`, `text-paper`, `text-ink` etc.
- [ ] `clamp()` value inline? → `pt-[clamp(6rem,14vh,8rem)]` arbitrary Tailwind value
- [ ] `alignItems/justifyContent/flexDirection` inline? → `items-*` / `justify-*` / `flex-col`
- [ ] Any CSS property not covered by a named Tailwind utility? → Use `[property:value]` arbitrary syntax.
- [ ] Hardcoded hex color anywhere? → Replace with CSS variable / Tailwind utility.
- [ ] Hardcoded font name in class or CSS rule? → Use `var(--font-sans)` via Tailwind arbitrary.
- [ ] Any Tailwind typography utility in JSX? (`text-xl`, `font-bold`, `text-gray-*`) → Use semantic class from `base.css`.
- [ ] `sm:` prefix anywhere? → Remove. Banned permanently.
- [ ] Arbitrary z-index? (`z-[10]`) → Use named class from `base.css`.
- [ ] `styles/theme.css` missing the `@theme {}` block? → Add it.
- [ ] `styles/components.css` exists? → Delete it. It has no purpose.

## E. UI Primitives

- [ ] Native `<select>`? → Use `<Dropdown>`.
- [ ] `<input type="checkbox">`? → Use `<Checkbox>`.
- [ ] `<input type="date">`? → Use `<CalendarPicker>`.
- [ ] Bare `<button>` outside `components/ui/Button.tsx`? → Use `<Button>`.
- [ ] `<div>` or `<span>` with `onClick`? → Use `<button>` or `<a>`.
- [ ] Local success/error banner instead of `showToast()`? → Remove. Use `showToast()`.
- [ ] Database write without `showToast()`? → Add toast for every mutation.

## F. Navigation & Transitions

- [ ] `router.push()` for internal navigation? → Use `navigateTo()`.
- [ ] Consumer side-effect runs before `navigateTo()` resolves? → Run it after.
- [ ] `enterPage()` called outside `PageShell.tsx`? → Remove.
- [ ] Navigation effect depends only on mount, not `usePathname()`? → Key effect on `pathname`.
- [ ] `Navbar` or `Footer` inside the animated container? → Move outside as siblings of PageShell.
- [ ] `TransitionOverlay` missing from `Providers.tsx`? → Add as sibling of PageShell.
- [ ] `TransitionContext.navigateTo` calls `router.push()` without global GSAP teardown first? → Add teardown.
- [ ] `TransitionContext.navigateTo` calls `window.scrollTo(0,0)`? → Remove. Belongs in PageShell.
- [ ] `TransitionLink` missing same-page guard? → Add: if same page, scrollTo top, return.
- [ ] Animation init function creates ScrollTrigger/tween without returning cleanup? → Add cleanup.
- [ ] `PageShell` missing `ScrollTrigger.refresh()` after `enterPage` resolves? → Add it.

## G. Accessibility

- [ ] Icon without `aria-hidden="true"`? → Add it.
- [ ] Icon-only button/link without `aria-label`? → Add it.
- [ ] Any interactive element without `className="keyboard-focus-ring"`? → Add it.
- [ ] `<label>` without matching `htmlFor`? → Add it.
- [ ] Placeholder used instead of visible label? → Add real `<label>`.
- [ ] Input/textarea without `id` and `name`? → Add both.
- [ ] Error input without `aria-invalid` + `aria-describedby`? → Add both.
- [ ] Error message without `role="alert"`? → Add it.
- [ ] Form submission without `announce()` call? → Add announce on every outcome.
- [ ] Toggle button without `aria-pressed`? → Add it.
- [ ] Nav link without `aria-current={isActive ? "page" : undefined}`? → Add it.
- [ ] `tabIndex` greater than 0? → Remove. Only 0 and -1 allowed.
- [ ] `<nav>`, `<header>`, `<aside>`, `<section>` without `aria-label`/`aria-labelledby`? → Add one.
- [ ] More than one `<main>` per page? → Fix.
- [ ] More than one `<h1>` per page? → Fix.
- [ ] Heading levels skip? → Fix hierarchy.
- [ ] Decorative element not wrapped in `aria-hidden="true"` + `pointer-events-none`? → Wrap it.
- [ ] Inactive panel using only `display:none` without `aria-hidden` + `inert`? → Add both.
- [ ] Modal/dialog without `role="dialog"`, `aria-modal="true"`, `aria-labelledby`? → Add all three.
- [ ] `<input type="email">` without `inputMode="email"`? Or tel/numeric equivalent? → Add it.
- [ ] Form input without `autoComplete`? → Add appropriate value.
- [ ] `SkipLink` not first in DOM order? → Move before Navbar.
- [ ] `<html>` without `lang` attribute? → Add it.

## H. Animations & App Ready

- [ ] GSAP animation without checking `useAppReady()` first? → Gate it.
- [ ] Animated element missing `className="opacity-0"` on initial render? → Add it.
- [ ] `markReady()` called synchronously? → Wrap in `useEffect`.
- [ ] `markReady()` called without `document.fonts.ready`? → Use `usePageReady()` or include in `Promise.all`.
- [ ] `markReady()` called without 600ms minimum delay? → Add the delay to `Promise.all`.
- [ ] `catch` block doesn't call `markReady()`? → Add it. Loader must never hang.
- [ ] `ScrollContext` initializes Lenis below 1280px? → Desktop only.
- [ ] `ScrollContext` destroys Lenis without both `lenis.destroy()` AND `gsap.ticker.remove()`? → Add both.

## I. i18n (skip if no i18n)

- [ ] Translation strings passed as props to page section components? → Remove. Sections call `useTranslations()` directly.
- [ ] `useTranslations()` with wrong namespace pattern? → Use `'[page].[section]'`.
- [ ] Translated text in a `constants/` file? → Move to locale JSON.
- [ ] Structural data (keys, hrefs, order) in a locale JSON file? → Move to constants.
- [ ] Locale folder named `messages/`? → Rename to `locales/`.
- [ ] `changeLanguage()` uses `window.history.replaceState()`? → Replace with `router.push()`. replaceState swaps the URL but does NOT re-resolve next-intl messages — language never changes.
- [ ] `changeLanguage()` navigates without first setting the `NEXT_LOCALE` cookie? → Add `document.cookie = "NEXT_LOCALE=…"` BEFORE `router.push()`. Otherwise switching to the default (unprefixed) locale silently bounces back via the middleware. (See 09-I18N.md.)
- [ ] Current locale derived by parsing `usePathname()` instead of `useLocale()`? → Use `useLocale()` — pathname parsing causes hydration mismatches.
- [ ] Physical route folder for a translated slug? → Delete. proxy.ts handles slug translation.
- [ ] `proxy.ts` response without `withLocaleHeader()`? → Wrap every response.

## J. Logging

- [ ] Direct `console.*` call? → Replace with `logger.*` from `@/utils/logger`.
- [ ] Empty `catch` block or swallowed error? → Add `logger.error(error)`.

## K. Performance

- [ ] First visible `<Image>` on page missing `priority` prop? → Add it.
- [ ] Lazy-loading Navbar, PageLoader, PageShell, Providers, LiveRegion, Toaster, or markReady() components? → Remove dynamic import.
- [ ] `next/dynamic` with `ssr: false` for component that doesn't use window/document at module level? → Remove `ssr: false`.
- [ ] Asset placed directly in `public/` root (not in `public/assets/`)? → Move it.

## L. SEO

- [ ] Manual `<head>` tags (`<title>`, `<meta>`, `<link rel="canonical">`)? → Remove. Use Metadata API.
- [ ] `metadata.metadataBase` hardcoded instead of `appConfig.siteUrl`? → Use `appConfig`.

## M. TypeScript

- [ ] Any `any` type? → Replace with proper type.
- [ ] Shared type defined locally instead of in `types/`? → Move it.
- [ ] Non-null assertion (`!`) without prior null check? → Add null guard.
- [ ] `npx tsc --noEmit` reports new errors? → Fix all. Zero errors required.

## N. Code Quality

- [ ] Commented-out code added by you (not pre-existing)? → Remove.
- [ ] Comments describing what code does (not why)? → Remove.
- [ ] `TODO`/`FIXME`/`HACK` without explanation? → Resolve now or document in MEMORY.md.

---

## Final Gate

All boxes above: NO. `npx tsc --noEmit` passes with zero new errors. → Move to next file.
