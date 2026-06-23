# ANIMATIONS.md — GSAP & Animation Rules

---

## Core Rules

- All animation functions live in `utils/animations/` — pure functions, no React, no hooks
- All animation init functions that create ScrollTriggers or long-running tweens MUST return a cleanup function
- No GSAP animation runs before `appReady` is `true` (scroll/always-on animations). First-paint **entrance** animations gate on `loaderGone` instead — see "AppReadyContext Rules" — so they don't fire under the still-visible loader.
- **NEVER use `useRef` to pass DOM elements to GSAP.** Always use `data-anim` attributes and `querySelector` inside the animation function.
- **Animation files MUST be named after what they DO, never after a page or section.**
  - `verb-ticker.ts` ✅ — `trabajar-hero.ts` ❌
  - `image-reveal-drag.ts` ✅ — `pensar-hero.ts` ❌
  - `scroll-reveal.ts` ✅ — `home-animations.ts` ❌
  - Ask: "Could this animation appear on a different page?" If yes (almost always), the page name is wrong.

---

## GSAP Targeting — data-anim Pattern (mandatory)

```tsx
// ✅ In JSX — mark elements with data-anim
<div data-anim="hero-title" />
<path data-anim="loader-body" />

// ✅ In utils/animations/*.ts — query from a root element
function q(root: HTMLElement, name: string) {
  return root.querySelector(`[data-anim="${name}"]`)
}

export function initHero(root: HTMLElement) {
  const title = q(root, "hero-title")
  gsap.from(title, { opacity: 0, y: 20 })
}

// ❌ NEVER — useRef for GSAP targets
const titleRef = useRef<HTMLDivElement>(null)
gsap.from(titleRef.current, { opacity: 0 })  // BANNED
```

The component only passes its root container ref (one `useRef` per component max). Everything inside is found via `data-anim`.

---

## Preventing Flash Before Animation

Use `className="invisible"` (Tailwind's `visibility: hidden`) on elements GSAP will animate in. Never use `opacity-0` — it reserves space differently and can cause layout shifts. Never use inline styles.

```tsx
// Elements that GSAP will animate in
<div data-anim="content" className="invisible">
  ...
</div>

// In the animation function — make visible before animating
gsap.set(content, { visibility: "visible" })
// then start your tween
```

---

## Mandatory Cleanup Contract

Every `init*` function that creates ScrollTriggers or long-running tweens **must**
return its own cleanup function. The cleanup is returned at the end of the utility
file — never inline at the call site.

```ts
// ❌ WRONG — no cleanup, leaks ScrollTriggers across navigations
export function initScrollReveal() {
  document.querySelectorAll("[data-reveal]").forEach(el => {
    ScrollTrigger.create({ trigger: el, onEnter: () => gsap.to(el, { opacity: 1 }) })
  })
}

// ❌ WRONG — cleanup extracted inline at the call site
useGSAPAnimations(() => ({
  timeout: [() => { initParallax(); return killParallax }],  // BANNED
}))

// ✅ RIGHT — init returns its own cleanup, call site is clean
export function initScrollReveal(): () => void {
  const elements = document.querySelectorAll<HTMLElement>("[data-reveal]")
  const triggers: ScrollTrigger[] = []
  elements.forEach((el) => {
    triggers.push(ScrollTrigger.create({
      trigger: el, start: "top 88%",
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }),
    }))
  })
  return () => {
    triggers.forEach(t => t.kill())
    elements.forEach(el => gsap.killTweensOf(el))
  }
}
```

The kill/cleanup function lives at the **bottom of the same utility file** as the
init function. It is never exported separately and never referenced at the call site.

---

## useGSAPAnimations Hook — Usage Pattern

Each tier takes an array of `AnimationFn`: a function that runs the animation and
returns its cleanup. Pass the `init*` function directly — it already returns the cleanup.

```tsx
// ✅ Correct — init function passed directly, returns its own cleanup
useGSAPAnimations(() => ({
  critical: [initHeroAnimations],
  raf:      [initScrollReveal],
  timeout:  [initParallax],
}))

// ❌ BANNED — wrapping init to bolt on an external kill function
useGSAPAnimations(() => ({
  timeout: [() => { initParallax(); return killParallax }],
}))

// ❌ BANNED — importing killParallax at the page level
import { initParallax, killParallax } from "@/utils/animations/parallax"
```

Priority tiers:
| Tier | When | Use for |
|------|------|---------|
| `critical` | Immediately | Hero, above-fold entrance |
| `raf` | Next frame | Draws, counters needing one paint cycle |
| `timeout` | After tick | Below-fold decorative, carousels, parallax |

---

## Animation Gating Pattern

```tsx
// Hook gates automatically on appReady — no manual check needed in the component
useGSAPAnimations(() => ({
  critical: [initHeroAnimations],
}))
```

---

## AppReadyContext Rules

- `appReady` starts `false`. `markReady()` is idempotent.
- While `false`: `overflow: hidden` on body (locked here, not in components).
- Minimum display time: 600ms — prevents flicker on fast connections.
- `markReady()` only called after:
  - Component is mounted (inside `useEffect`)
  - `document.fonts.ready` has resolved
  - Any async data has resolved or errored gracefully
  - Any critical media has loaded

### `appReady` ≠ `loaderGone` — gate entrance animations on the right signal

There are TWO distinct moments, and confusing them makes hero/entrance animations
fire **underneath the still-visible PageLoader**:

- **`appReady`** — content is ready (fonts/data loaded). Fires early, ~600ms in.
  This only *permits* the loader to begin its exit; the loader is **still on screen**.
- **`loaderGone`** — the PageLoader's exit (curtain wipe) has fully completed and it
  has unmounted. Fires much later: `MIN_DURATION` (1800ms) + the exit animation (~700ms).

`AppReadyContext` exposes both: `appReady`/`markReady` AND `loaderGone`/`markLoaderGone`.
The PageLoader calls `markLoaderGone()` in its exit `onComplete`. Hooks live in
`hooks/useAppReady.ts`: `useAppReady()`, `useLoaderGone()`, `useMarkLoaderGone()`.

```tsx
// ❌ WRONG — fires ~600ms in, while the loader still covers the page
useGSAPAnimations(() => ({ raf: [initBrushDraw] }))   // gated on appReady only

// ✅ RIGHT — a post-loader entrance (hero reveal, brush draw, title intro)
const loaderGone = useLoaderGone()
useEffect(() => {
  if (!loaderGone) return
  return initBrushDraw()        // init returns its own cleanup (ANIMATIONS.md contract)
}, [loaderGone])
```

Rule of thumb: **scroll-triggered** and **always-on** animations gate on `appReady`
(via `useGSAPAnimations`). **First-paint entrance** animations that must not be hidden
by the loader gate on `loaderGone`.

---

## usePageReady Hook — Full Spec

```tsx
"use client"
import { useEffect } from "react"
import { useMarkReady } from "@/hooks/useMarkReady"

export function usePageReady() {
  const markReady = useMarkReady()
  useEffect(() => {
    let cancelled = false
    const minDelay = new Promise<void>(r => setTimeout(r, 600))
    Promise.all([document.fonts.ready, minDelay]).then(() => {
      if (!cancelled) markReady()
    }).catch(() => {
      if (!cancelled) markReady()
    })
    return () => { cancelled = true }
  }, [])
}
```

Manual pattern for data-dependent pages:
```tsx
useEffect(() => {
  const min = new Promise<void>(r => setTimeout(r, 600))
  Promise.all([document.fonts.ready, min, fetchData()])
    .then(([,, data]) => { setData(data); markReady() })
    .catch(() => markReady())
}, [])
```

---

## Reduced Motion — Three Layers

```tsx
const { preference } = useMotionPreference()
const isReduced = preference === "reduced"
gsap.to(element, {
  duration: isReduced ? 0  : 0.6,
  y:        isReduced ? 0  : -20,
  opacity: 1,
})
```

```css
/* styles/animations.css */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

MotionPreferenceContext layers:
1. System: `prefers-reduced-motion` on mount
2. App override: visible UI toggle
3. Persistent: `localStorage "motion-preference"`

---

## Lenis — ScrollContext Rules

- Desktop only: `≥ 1280px`. Return `null` on mobile.
- `gsap.ticker.add((time) => lenis.raf(time * 1000))`
- `gsap.ticker.lagSmoothing(0)`
- On unmount: `lenis.destroy()` AND `gsap.ticker.remove()` — both required.
