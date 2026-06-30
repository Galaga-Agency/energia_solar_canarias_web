"use client"
import { useEffect } from "react"

// Sets Google Consent Mode v2 defaults so GA never fires before the user accepts.
// The gtag('consent','default',...) push must land in the dataLayer before GTM's
// own script runs. GTM is loaded via <GoogleTagManager> in the same layout, after
// this component mounts, so a mount effect is early enough — and unlike running the
// push during render, it doesn't trip React's "state update during render" guard.
export function ConsentInit() {
  useEffect(() => {
    const w = window as typeof window & {
      dataLayer?: unknown[]
      gtag?: (...a: unknown[]) => void
      __consentInit?: boolean
    }
    if (w.__consentInit) return
    w.__consentInit = true
    w.dataLayer = w.dataLayer || []
    w.gtag = function gtag() {
      w.dataLayer!.push(arguments)
    }
    w.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    })
  }, [])

  return null
}
