import type { CollectionConfig } from "payload"
import {
  lexicalEditor,
  UploadFeature,
  HeadingFeature,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  LinkFeature,
  UnorderedListFeature,
  OrderedListFeature,
  BlockquoteFeature,
  ParagraphFeature,
  BlocksFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  FixedToolbarFeature,
  AlignFeature,
} from "@payloadcms/richtext-lexical"
import { FootnoteSelectionFeature } from "@/lib/footnoteFeature"

type LexicalNode = { type?: string; text?: string; children?: LexicalNode[] }

function lexicalToText(node: LexicalNode): string {
  if (node.type === "text") return String(node.text ?? "")
  return (node.children ?? []).map(lexicalToText).join(" ")
}

function calcReadTime(body: unknown): number {
  if (!body || typeof body !== "object") return 1
  const root = (body as { root?: LexicalNode }).root
  if (!root) return 1
  const words = lexicalToText(root).trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Artículo", plural: "Artículos" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "author", "hidden", "updatedAt"],
    listSearchableFields: ["title", "slug", "excerpt"],
    preview: (doc) => {
      const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      const slug = typeof doc?.slug === "string" ? doc.slug : ""
      return `${site}/blog/${slug}`
    },
  },
  versions: {
    drafts: true,
  },
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (data.body) data.readTime = calcReadTime(data.body)

        const bodyText = data.body
          ? lexicalToText((data.body as { root?: LexicalNode }).root ?? {})
          : ""
        const tagNames = Array.isArray(data.tags)
          ? data.tags
              .map((t: unknown) =>
                t && typeof t === "object" && "name" in t ? String((t as { name?: string }).name ?? "") : ""
              )
              .filter(Boolean)
              .join(" ")
          : ""
        const corpus = [data.title, data.excerpt, tagNames, bodyText]
          .filter(Boolean)
          .join("\n")
          .slice(0, 4000)

        if (corpus.trim()) {
          try {
            const { embed } = await import("@/lib/embeddings")
            const vec = await embed(corpus, "passage")
            data.embedding = JSON.stringify(vec)
          } catch (e) {
            console.error("[embed] failed for post:", data.slug, e)
          }
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
      label: "Título",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      localized: true,
      label: "Slug (URL)",
      admin: {
        description: "Se genera automáticamente desde el título. Ej: el-aceite-de-oliva. Localizado: cada idioma tiene su propio slug.",
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      localized: true,
      label: "Extracto",
      admin: {
        description: "Resumen breve que aparece en las tarjetas de artículo.",
      },
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Imagen principal",
    },
    {
      name: "heroImageCaption",
      type: "text",
      localized: true,
      label: "Pie de la imagen principal",
      admin: { description: "Opcional. Aparece debajo de la imagen del artículo." },
    },
    {
      name: "heroImagePosition",
      type: "text",
      label: "Encuadre de la imagen principal",
      defaultValue: "center",
      admin: {
        components: {
          Field: "@/components/admin/HeroImagePositionField#HeroImagePositionField",
        },
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
      label: "Categoría",
      admin: { description: "Crea o edita categorías en la colección Categorías." },
    },
    {
      name: "publishedAt",
      type: "date",
      required: true,
      label: "Fecha de publicación",
      defaultValue: () => new Date().toISOString(),
      admin: { date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" } },
    },
    {
      name: "updatedLabel",
      type: "date",
      label: "Fecha de actualización",
      admin: {
        description: "Opcional. Si se rellena, aparece como «Actualizado» en el artículo.",
        date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" },
      },
    },
    {
      name: "author",
      type: "text",
      required: true,
      label: "Autora/Autor",
      defaultValue: "Energía Solar Canarias",
      admin: { description: "Nombre de quien firma el artículo." },
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
      label: "Etiquetas",
      admin: { description: "Etiquetas temáticas. Crea nuevas en la colección Tags." },
    },
    {
      name: "readTime",
      type: "number",
      label: "Tiempo de lectura (minutos)",
      admin: {
        readOnly: true,
        position: "sidebar",
        description: "Calculado automáticamente a partir del contenido.",
      },
    },
    {
      name: "likes",
      type: "number",
      defaultValue: 0,
      label: "Likes",
      admin: { position: "sidebar", readOnly: true },
    },
    {
      name: "hidden",
      type: "checkbox",
      defaultValue: false,
      label: "Ocultar artículo",
      admin: {
        position: "sidebar",
        description: "El artículo no aparecerá en el sitio web pero seguirá guardado.",
      },
    },
    {
      name: "embedding",
      type: "textarea",
      admin: { hidden: true },
    },
    {
      name: "body",
      type: "richText",
      required: true,
      localized: true,
      label: "Contenido",
      editor: lexicalEditor({
        features: () => [
          ParagraphFeature(),
          HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4"] }),
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          LinkFeature({
            enabledCollections: ["posts"],
            fields: ({ defaultFields }) => defaultFields,
          }),
          UnorderedListFeature(),
          OrderedListFeature(),
          BlockquoteFeature(),
          HorizontalRuleFeature(),
          InlineToolbarFeature(),
          AlignFeature(),
          FixedToolbarFeature(),
          FootnoteSelectionFeature(),
          BlocksFeature({
            inlineBlocks: [
              {
                slug: "footnote",
                labels: { singular: "Nota al pie", plural: "Notas al pie" },
                fields: [
                  {
                    name: "anchoredText",
                    type: "text",
                    label: "Texto anotado",
                    admin: {
                      description: "El texto seleccionado al que pertenece esta nota.",
                    },
                  },
                  {
                    name: "text",
                    type: "textarea",
                    required: true,
                    label: "Texto de la nota",
                    admin: {
                      description:
                        "La descripción que aparece al final del artículo.",
                    },
                  },
                ],
              },
            ],
            blocks: [
              {
                slug: "youtube",
                labels: { singular: "Video de YouTube", plural: "Videos de YouTube" },
                fields: [
                  {
                    name: "url",
                    type: "text",
                    required: true,
                    label: "URL embed de YouTube",
                    admin: { description: "Ej: https://www.youtube.com/embed/VIDEO_ID" },
                  },
                ],
              },
              {
                slug: "vimeo",
                labels: { singular: "Video de Vimeo", plural: "Videos de Vimeo" },
                fields: [
                  {
                    name: "url",
                    type: "text",
                    required: true,
                    label: "URL del video de Vimeo",
                    admin: { description: "Ej: https://vimeo.com/123456789" },
                  },
                ],
              },
              {
                slug: "instagram",
                labels: { singular: "Publicación de Instagram", plural: "Publicaciones de Instagram" },
                fields: [
                  {
                    name: "url",
                    type: "text",
                    required: true,
                    label: "URL de la publicación de Instagram",
                    admin: { description: "Ej: https://www.instagram.com/p/CODE/ o https://www.instagram.com/reel/CODE/" },
                  },
                ],
              },
              {
                slug: "gallery",
                labels: { singular: "Galería de imágenes", plural: "Galerías de imágenes" },
                fields: [
                  {
                    name: "layout",
                    type: "select",
                    required: true,
                    defaultValue: "row-2",
                    label: "Disposición",
                    options: [
                      { label: "Fila de 2 (mismo tamaño)",            value: "row-2" },
                      { label: "Fila de 3 (mismo tamaño)",            value: "row-3" },
                      { label: "Grande izquierda + 2 pequeñas",       value: "left-stack" },
                      { label: "2 pequeñas + grande derecha",         value: "right-stack" },
                      { label: "Mosaico 2×2 (4 imágenes)",            value: "grid-2x2" },
                    ],
                  },
                  {
                    name: "images",
                    type: "array",
                    required: true,
                    minRows: 2,
                    maxRows: 4,
                    label: "Imágenes",
                    admin: { description: "2 para fila-2 · 3 para fila-3/stack · 4 para mosaico 2×2." },
                    fields: [
                      {
                        name: "image",
                        type: "upload",
                        relationTo: "media",
                        required: true,
                      },
                    ],
                  },
                  {
                    name: "caption",
                    type: "text",
                    label: "Pie de la galería",
                    admin: { description: "Opcional. Aparece debajo de todas las imágenes." },
                  },
                ],
              },
              {
                slug: "authorNote",
                labels: { singular: "Nota de la autora", plural: "Notas de la autora" },
                fields: [
                  {
                    name: "text",
                    type: "textarea",
                    required: true,
                    label: "Texto",
                    admin: { description: "Aparece resaltado con una línea vertical en el color de temporada." },
                  },
                ],
              },
            ],
          }),
          UploadFeature({
            collections: {
              media: {
                fields: [
                  {
                    name: "width",
                    type: "select",
                    label: "Anchura",
                    defaultValue: "full",
                    options: [
                      { label: "Completo (100%)", value: "full" },
                      { label: "Grande (75%)",    value: "large" },
                      { label: "Mediano (50%)",   value: "medium" },
                      { label: "Pequeño (33%)",   value: "small" },
                    ],
                  },
                  {
                    name: "alt",
                    type: "text",
                    label: "Texto alternativo",
                    admin: {
                      description: "Descripción de la imagen para accesibilidad y SEO. Sobreescribe el texto alternativo del archivo.",
                    },
                  },
                  {
                    name: "caption",
                    type: "text",
                    label: "Pie de imagen",
                    admin: {
                      description: "Texto que aparece debajo de la imagen en el artículo. Sobreescribe el pie del archivo.",
                    },
                  },
                ],
              },
            },
          }),
        ],
      }),
    },
  ],
}
