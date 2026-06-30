import type { AdminViewServerProps } from "payload"
import { DefaultTemplate } from "@payloadcms/next/templates"
import { AdminDashboard } from "@/components/admin/AdminDashboard"

// Custom Payload admin view mounted at /admin/analitica. Renders inside the
// regular admin panel chrome (sidebar + header) via DefaultTemplate, so it is
// behind Payload's own auth — no separate password. The dashboard itself is a
// client component that fetches /api/analytics (also Payload-auth-guarded).
export default function AnaliticaView({
  initPageResult,
  params,
  searchParams,
}: AdminViewServerProps) {
  const { req, visibleEntities } = initPageResult

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={req.user ?? undefined}
      visibleEntities={visibleEntities}
   >
      <AdminDashboard />
    </DefaultTemplate>
  )
}
