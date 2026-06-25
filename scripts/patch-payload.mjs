#!/usr/bin/env node
/**
 * Patches payload/dist/bin/loadEnv.js to use a namespace import for @next/env.
 * Payload uses `import X from '@next/env'` but that package has __esModule:true
 * with no .default — tsx's CJS interop returns undefined. `import *` bypasses it.
 *
 * Run automatically via the "postinstall" npm script.
 */
import { readFileSync, writeFileSync } from "fs"
import { resolve } from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const file = resolve(__dirname, "../node_modules/payload/dist/bin/loadEnv.js")

let content
try {
  content = readFileSync(file, "utf8")
} catch {
  console.warn("patch-payload: loadEnv.js not found — skipping")
  process.exit(0)
}

const BEFORE = "import nextEnvImport from '@next/env';"
const AFTER   = "import * as nextEnvImport from '@next/env';"

if (content.includes(AFTER)) {
  console.log("patch-payload: already patched, skipping")
  process.exit(0)
}

if (!content.includes(BEFORE)) {
  console.warn("patch-payload: expected pattern not found — Payload may have been updated. Check loadEnv.js manually.")
  process.exit(0)
}

writeFileSync(file, content.replace(BEFORE, AFTER))
console.log("patch-payload: ✓ patched payload/dist/bin/loadEnv.js")
