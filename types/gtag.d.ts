// Augments the Window declared by @next/third-parties with gtag (used for
// Google Consent Mode v2). dataLayer is already declared there — do not redeclare.
export {}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}
