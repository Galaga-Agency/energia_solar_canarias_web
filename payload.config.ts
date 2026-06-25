import { buildConfig } from "payload"
import { sqliteAdapter } from "@payloadcms/db-sqlite"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { s3Storage } from "@payloadcms/storage-s3"
import { es } from "@payloadcms/translations/languages/es"
import { en } from "@payloadcms/translations/languages/en"
import sharp from "sharp"

import { Posts } from "./collections/Posts"
import { Categories } from "./collections/Categories"
import { Media } from "./collections/Media"
import { Users } from "./collections/Users"
import { Tags } from "./collections/Tags"
import { Comments } from "./collections/Comments"

// S3 is enabled only when the bucket env vars are present. Otherwise media is
// served from the local public/media dir (Media.staticDir) — works in dev with
// no extra setup, and in prod once the S3_* vars are configured.
const s3Enabled = Boolean(
  process.env.S3_BUCKET &&
  process.env.S3_ACCESS_KEY_ID &&
  process.env.S3_SECRET_ACCESS_KEY,
)

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || "",
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "file:./esc.db",
    },
    push: true,
  }),
  editor: lexicalEditor({}),
  collections: [Posts, Categories, Media, Users, Tags, Comments],
  admin: {
    user: Users.slug,
    theme: "light",
    meta: {
      titleSuffix: "— El Observatorio · Energía Solar Canarias",
    },
  },
  localization: {
    locales: [
      { label: "Español", code: "es" },
      { label: "English", code: "en" },
    ],
    defaultLocale: "es",
    fallback: true,
  },
  i18n: {
    supportedLanguages: { en, es },
    fallbackLanguage: "es",
  },
  sharp,
  upload: {
    limits: { fileSize: 10_000_000 },
  },
  plugins: s3Enabled
    ? [
        s3Storage({
          collections: { media: true },
          bucket: process.env.S3_BUCKET as string,
          config: {
            region: process.env.S3_REGION || "auto",
            endpoint: process.env.S3_ENDPOINT,
            forcePathStyle: true,
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
            },
          },
        }),
      ]
    : [],
})
