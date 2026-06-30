import type { CollectionConfig } from "payload"

// Slugs reserved by other top-level routes in app/(frontend). A category whose
// slug collides with one of these would never render because the static route
// wins. Validated on save to fail loud instead of silently breaking.
const RESERVED_SLUGS = new Set([
  "articulo",
  "tema",
  "sobre-mp",
  "mas-leidos",
  "tienda",
  "privacidad",
  "cookies",
  "admin",
  "api",
])

export const Categories: CollectionConfig = {
  slug: "categories",
  labels: { singular: "Categoría", plural: "Categorías" },
  admin: {
    group: { es: "Blog", en: "Blog" },
    useAsTitle: "label",
    defaultColumns: ["label", "slug", "order", "hidden", "updatedAt"],
  },
  fields: [
    {
      name: "label",
      type: "text",
      required: true,
      localized: true,
      label: "Nombre",
      admin: { description: "Cómo aparece en la web. Ej: «En la cocina»." },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      localized: true,
      label: "Slug (URL)",
      admin: {
        description:
          "Identificador para la URL. Solo minúsculas, números y guiones. Ej: «en-la-cocina». Localizado: cada idioma tiene su propio slug.",
      },
      validate: (value: unknown) => {
        if (typeof value !== "string" || !value) return "Slug requerido."
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
          return "Solo minúsculas, números y guiones. Ej: en-la-cocina"
        }
        if (RESERVED_SLUGS.has(value)) {
          return `«${value}» está reservado para otra página del sitio.`
        }
        return true
      },
    },
    {
      name: "description",
      type: "textarea",
      localized: true,
      label: "Descripción",
      admin: { description: "Aparece en la cabecera de la página de categoría." },
    },
    {
      name: "tagline",
      type: "text",
      localized: true,
      label: "Lema",
      admin: { description: "Frase corta que acompaña a la sección." },
    },
    {
      name: "icon",
      type: "upload",
      relationTo: "media",
      label: "Icono (SVG)",
      admin: { description: "Sube un SVG. Se renderiza junto al título de la sección." },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      label: "Orden",
      admin: { description: "Menor número aparece antes. Empates ordenan por nombre." },
    },
    {
      name: "hidden",
      type: "checkbox",
      defaultValue: false,
      label: "Ocultar categoría",
      admin: {
        position: "sidebar",
        description: "La categoría no aparece en la web ni en el menú.",
      },
    },
  ],
}
