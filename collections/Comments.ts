import type { CollectionConfig } from "payload"

export const Comments: CollectionConfig = {
  slug: "comments",
  labels: { singular: "Comentario", plural: "Comentarios" },
  admin: {
    group: { es: "Blog", en: "Blog" },
    useAsTitle: "name",
    defaultColumns: ["name", "post", "status", "createdAt"],
    description: "Comentarios de los lectores. Aprueba o rechaza antes de que sean visibles.",
  },
  fields: [
    {
      name: "post",
      type: "relationship",
      relationTo: "posts",
      required: true,
      label: "Artículo",
    },
    {
      name: "name",
      type: "text",
      required: true,
      label: "Nombre",
    },
    {
      name: "email",
      type: "email",
      label: "Email",
    },
    {
      name: "content",
      type: "textarea",
      required: true,
      label: "Comentario",
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending",
      label: "Estado",
      admin: { position: "sidebar" },
      options: [
        { label: "⏳ Pendiente",  value: "pending"  },
        { label: "✅ Aprobado",   value: "approved" },
        { label: "❌ Rechazado",  value: "rejected" },
      ],
    },
  ],
  timestamps: true,
}
