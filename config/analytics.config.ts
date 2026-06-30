export const analyticsConfig = {
  gtmId:  process.env.NEXT_PUBLIC_GTM_ID  ?? "GTM-XXXXXXX",
  ga4Id:  process.env.NEXT_PUBLIC_GA4_ID  ?? "G-XXXXXXXXXX",
  // True only when a real container id has been provided via env.
  enabled: Boolean(process.env.NEXT_PUBLIC_GTM_ID) &&
           process.env.NEXT_PUBLIC_GTM_ID !== "GTM-XXXXXXX",
} as const
