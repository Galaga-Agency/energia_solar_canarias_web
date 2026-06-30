# Analytics — GA4 + GTM + Consent + Admin Dashboard

This project ships the full analytics stack from the gloci reference, adapted so the
admin dashboard lives **inside the existing PayloadCMS admin panel** instead of a
standalone password-gated page. There is no second login: the dashboard and its data
API are guarded by Payload's own auth.

## What's included

- **Consent (GDPR / Consent Mode v2)** — `ConsentContext`, `ConsentInit` (sets denied
  defaults before GTM loads), and the `CookieConsent` banner. GA never fires before the
  user accepts measurement cookies.
- **GTM + GA4** — loaded via `@next/third-parties` in `app/(frontend)/[locale]/layout.tsx`,
  only when `NEXT_PUBLIC_GTM_ID` is a real container id.
- **Event tracking** — `utils/gtm-events.ts`, `useAnalyticsTracking` (delegated
  `data-cta_click` clicks + scroll depth), mounted via `AnalyticsTracker`.
- **Admin dashboard** — a custom Payload admin view at **`/admin/analitica`**
  (sidebar link "Analítica"). Summary stats, daily-visitors sparkline, top pages,
  world map, cities, date-range + custom calendar picker, Excel + PDF export, with a
  true empty state before data flows.
- **Data API** — `app/(payload)/api/analytics/route.ts`, guarded by `payload.auth()`.
- **Legal pages** — `/cookies`, `/privacidad`, `/aviso-legal` (noindex). Copy in
  `locales/{es,en}/legal.json`. **The legal copy is indicative and must be reviewed by
  a lawyer before going live.**

## Environment variables (set in `.env.local`)

```bash
# Frontend tag (public). Until a real GTM id is set, GTM/GA stay disabled.
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX

# GA4 Data API (server-side, for the dashboard)
GA4_PROPERTY_ID=properties/123456789
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account", ...}   # single line
```

`GOOGLE_APPLICATION_CREDENTIALS_JSON` is the **full service-account JSON on one line**
(not a file path, not `GA4_SERVICE_ACCOUNT_KEY`). Without `GA4_PROPERTY_ID` +
credentials the API returns 503 and the dashboard shows its empty state.

## Manual GA4 setup (you do these once)

1. **Service account** — in Google Cloud Console, create a service account, generate a
   JSON key, and paste it (single line) into `GOOGLE_APPLICATION_CREDENTIALS_JSON`.
2. **Enable the API** — enable "Google Analytics Data API" in the GCP project.
3. **Grant the SA read on the GA4 property.** The GA4 UI rejects service-account emails,
   so use the Admin API directly:
   - In the [OAuth Playground](https://developers.google.com/oauthplayground), authorize
     scope `https://www.googleapis.com/auth/analytics.manage.users` **as the property
     owner**, then exchange for an access token.
   - Then:
     ```bash
     curl -X POST \
       "https://analyticsadmin.googleapis.com/v1alpha/properties/PROPERTY_ID/accessBindings" \
       -H "Authorization: Bearer ACCESS_TOKEN" \
       -H "Content-Type: application/json" \
       -d '{"user":"SA@PROJECT.iam.gserviceaccount.com","roles":["predefinedRoles/viewer"]}'
     ```
   - Use **v1alpha** (v1beta 404s). Do **not** use `gcloud auth print-access-token`
     (no scope) or `gcloud auth application-default login --scopes=...` (Google blocks
     the restricted scope).
4. **GTM** — in your GTM container, add the GA4 configuration tag and triggers for the
   custom events (`cta_click`, `scroll_depth`, `project_click`, `external_link`,
   `language_switch`, `contact_start`, `contact_submit`). The dataLayer pushes already
   fire from the app.

## How the dashboard is mounted (Payload, not standalone)

- `payload.config.ts` → `admin.components.views.analitica` registers the view at
  `/admin/analitica`; `admin.components.beforeNavLinks` adds the sidebar link.
- `components/admin/AnaliticaView.tsx` (server) wraps `components/admin/AdminDashboard.tsx`
  (client) in Payload's `DefaultTemplate` so it inherits the panel chrome and auth.
- After changing `admin.components`, regenerate the import map:
  `npm run payload generate:importmap` (the entries are also kept in
  `app/(payload)/admin/importMap.js`). `next build` regenerates it too.

## Tagging conversions

- Buttons/links that count as a conversion: add `data-cta_click="true"`,
  `data-cta_text="..."`, `data-cta_url="..."`.
- Repeated cards (projects/posts): call `trackProjectClick(name, url)` in `onClick`.
- External/social links: call `trackExternalLink(label, url)` in `onClick`.
