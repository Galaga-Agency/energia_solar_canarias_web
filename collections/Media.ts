import type { CollectionConfig } from "payload"
import path from "path"
import { fileURLToPath } from "url"
import sharp from "sharp"

const filename = fileURLToPath(import.meta.url)
const dirname  = path.dirname(filename)

const CONVERTIBLE = new Set(["image/jpeg", "image/jpg", "image/png", "image/avif", "image/gif"])

function sanitizeFilename(name: string): string {
  const dot  = name.lastIndexOf(".")
  const base = dot > 0 ? name.slice(0, dot) : name
  const ext  = dot > 0 ? name.slice(dot)     : ""
  const clean = base
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
  return (clean || "imagen") + ext.toLowerCase()
}

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Medio", plural: "Medios" },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "alt",
  },
  hooks: {
    beforeOperation: [
      async ({ args, operation }) => {
        if (operation !== "create" && operation !== "update") return args
        const file = args.req?.file
        if (!file) return args

        // Always sanitize the filename first — strips spaces, accents, parens, etc.
        // so the file URL never breaks regardless of what the user uploaded.
        const safeName = sanitizeFilename(file.name)

        // Convert to WebP if needed, and cap the master file at 1600px wide.
        // Anything above that is wasted bytes for a magazine site — biggest
        // viewport image is ~1200px wide.
        if (CONVERTIBLE.has(file.mimetype) || file.mimetype === "image/webp") {
          try {
            const webp = await sharp(file.data)
              .resize({ width: 1600, withoutEnlargement: true })
              .webp({ quality: 82 })
              .toBuffer()
            args.req.file = {
              ...file,
              data:     webp,
              mimetype: "image/webp",
              name:     safeName.replace(/\.[^.]+$/, "") + ".webp",
              size:     webp.length,
            }
            return args
          } catch {
            // conversion failed — fall through and keep the original file but renamed
          }
        }

        args.req.file = { ...file, name: safeName }
        return args
      },
    ],
  },
  upload: {
    staticDir: path.resolve(dirname, "../public/media"),
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      localized: true,
      label: "Texto alternativo",
    },
    {
      name: "caption",
      type: "text",
      localized: true,
      label: "Pie de foto",
      admin: { description: "Opcional. Incluye la fuente o crédito de la imagen." },
    },
  ],
}
