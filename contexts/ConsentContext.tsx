"use client"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface ConsentPrefs {
  analytics: boolean
}

interface StoredConsent extends ConsentPrefs {
  decided: true
}

interface ConsentContextValue {
  // false = no decision yet (banner should show)
  decided: boolean
  prefs: ConsentPrefs
  acceptAll: () => void
  rejectAll: () => void
  save: (prefs: ConsentPrefs) => void
}

const ConsentContext = createContext<ConsentContextValue | null>(null)

const STORAGE_KEY = "cookie-consent"
const DEFAULT_PREFS: ConsentPrefs = { analytics: false }

function updateGoogleConsent(prefs: ConsentPrefs) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return
  window.gtag("consent", "update", {
    analytics_storage: prefs.analytics ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  })
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [decided, setDecided] = useState(false)
  const [prefs, setPrefs] = useState<ConsentPrefs>(DEFAULT_PREFS)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const stored = JSON.parse(raw) as StoredConsent
      if (stored.decided) {
        setPrefs({ analytics: !!stored.analytics })
        setDecided(true)
        updateGoogleConsent({ analytics: !!stored.analytics })
      }
    } catch {
      /* corrupt value — show banner again */
    }
  }, [])

  const commit = (next: ConsentPrefs) => {
    setPrefs(next)
    setDecided(true)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ decided: true, ...next }))
    updateGoogleConsent(next)
  }

  return (
    <ConsentContext.Provider
      value={{
        decided,
        prefs,
        acceptAll: () => commit({ analytics: true }),
        rejectAll: () => commit({ analytics: false }),
        save: commit,
      }}
    >
      {children}
    </ConsentContext.Provider>
  )
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext)
  if (!ctx) throw new Error("useConsent must be used inside ConsentProvider")
  return ctx
}
