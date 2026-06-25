import type { CollectionConfig } from "payload"

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export const Tags: CollectionConfig = {
  slug: "tags",
  labels: { singular: "Etiqueta", plural: "Etiquetas" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug"],
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.name && !data.slug) data.slug = slugify(data.name)
        return data
      },
    ],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      localized: true,
      label: "Nombre",
      admin: { description: "Ej: fermentación, temporada, productores" },
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      label: "Slug (URL)",
      admin: {
        description: "Se genera automáticamente desde el nombre. Ej: fermentacion",
      },
    },
  ],
}
