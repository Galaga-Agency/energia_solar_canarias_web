"use client"
import { Link } from "@payloadcms/ui"
import { usePathname } from "next/navigation"

// Injected via admin.components.beforeNavLinks, above Payload's collection groups.
// Renders as its own "Analítica" group (heading + link) so it reads as a sidebar
// tab, mirroring the collapsible collection groups below it.
export function AnaliticaNavLink() {
  const pathname = usePathname()
  const active = pathname?.endsWith("/admin/analitica")

  return (
    <div className="nav-group" style={{ marginBottom: "calc(var(--base) * 0.5)" }}>
      <div className="nav-group__label" style={{ pointerEvents: "none", paddingBottom: "8px" }}>
        Analítica
      </div>
      <div className="nav-group__content">
        <Link
          href="/admin/analitica"
          className={`nav__link${active ? " nav__link--active active" : ""}`}
        >
          {active && <div className="nav__link-indicator" />}
          <span className="nav__link-label">Panel</span>
        </Link>
      </div>
    </div>
  )
}
