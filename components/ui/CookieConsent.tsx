"use client"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/Button"
import { Switch } from "@/components/ui/Switch"
import { TransitionLink } from "@/components/ui/TransitionLink"
import { useConsent } from "@/contexts/ConsentContext"

export function CookieConsent() {
  const t = useTranslations("consent")
  const { decided, prefs, acceptAll, rejectAll, save } = useConsent()
  const [open, setOpen] = useState(false)
  const [analytics, setAnalytics] = useState(prefs.analytics)

  if (decided) return null

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-consent bg-ink/10 backdrop-blur-xs"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("eyebrow")}
        className="fixed bottom-6 right-6 z-consent w-[min(520px,calc(100vw-3rem))] bg-bg text-ink border border-border shadow-lg p-8 flex flex-col gap-6 max-[520px]:bottom-3 max-[520px]:left-3 max-[520px]:right-3 max-[520px]:w-auto max-[520px]:p-6"
      >
        <div className="flex flex-col gap-3">
          <span className="text-label text-primary block">{t("eyebrow")}</span>
          <h2 className="text-heading text-ink">{t("title")}</h2>
          <p className="text-body text-ink/70 leading-normal">
            {t("message")}{" "}
            <TransitionLink
              href="/cookies"
              className="keyboard-focus-ring text-primary underline underline-offset-2 hover:opacity-80 transition-opacity duration-300"
            >
              {t("policy")}
            </TransitionLink>
          </p>
        </div>

        {open && (
          <div
            id="consent-prefs"
            className="flex flex-col gap-4 border-t border-border pt-6"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-body text-ink block">{t("necessaryName")}</span>
                <span className="text-body-sm text-ink/55">{t("necessaryDesc")}</span>
              </div>
              <span className="text-label text-ink/50 shrink-0">{t("always")}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-body text-ink block">{t("analyticsName")}</span>
                <span className="text-body-sm text-ink/55">{t("analyticsDesc")}</span>
              </div>
              <Switch checked={analytics} onChange={setAnalytics} label={t("analyticsName")} />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 max-[400px]:grid-cols-1">
            {open ? (
              <>
                <Button variant="outlined" onClick={() => setOpen(false)}>
                  {t("back")}
                </Button>
                <Button variant="filled" onClick={() => save({ analytics })}>
                  {t("save")}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outlined" onClick={rejectAll}>
                  {t("reject")}
                </Button>
                <Button variant="filled" onClick={acceptAll}>
                  {t("accept")}
                </Button>
              </>
            )}
          </div>

          {!open && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="consent-prefs"
              className="keyboard-focus-ring text-label text-ink/55 hover:text-ink transition-colors duration-300 self-start"
            >
              {t("customize")}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
