// One-shot GTM setup: creates a Google Tag (GA4) firing on All Pages, then
// versions + publishes the container. Idempotent — re-running won't duplicate.
//
// Usage:
//   GTM_ID=GTM-XXXXXXX GA4_ID=G-XXXXXXXXXX \
//   GOOGLE_APPLICATION_CREDENTIALS=/path/to/sa-key.json \
//   node scripts/setup-gtm.mjs
//
// The service account email must be added to the GTM container with
// "Publish" permission (Admin → User Management in tagmanager.google.com),
// and the Tag Manager API must be enabled in the GCP project.

import { google } from "googleapis"
import { readFileSync } from "node:fs"

const GTM_ID = process.env.GTM_ID
const GA4_ID = process.env.GA4_ID
const KEY_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS
const KEY_JSON = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON

if (!GTM_ID || !GA4_ID) {
  console.error("Set GTM_ID (GTM-…) and GA4_ID (G-…)")
  process.exit(1)
}

const credentials = KEY_JSON
  ? JSON.parse(KEY_JSON)
  : KEY_PATH
  ? JSON.parse(readFileSync(KEY_PATH, "utf8"))
  : null

if (!credentials) {
  console.error("Provide GOOGLE_APPLICATION_CREDENTIALS (path) or GOOGLE_APPLICATION_CREDENTIALS_JSON")
  process.exit(1)
}

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: [
    "https://www.googleapis.com/auth/tagmanager.edit.containers",
    "https://www.googleapis.com/auth/tagmanager.publish",
  ],
})
const tm = google.tagmanager({ version: "v2", auth })

async function main() {
  // 1. Find the container by public GTM id
  const { data: accts } = await tm.accounts.list()
  let container = null
  for (const acct of accts.account ?? []) {
    const { data } = await tm.accounts.containers.list({ parent: acct.path })
    const found = (data.container ?? []).find((c) => c.publicId === GTM_ID)
    if (found) { container = found; break }
  }
  if (!container) throw new Error(`Container ${GTM_ID} not found (is the service account added to it?)`)
  console.log(`Container: ${container.name} (${container.publicId})`)

  // 2. Use our own dedicated workspace. Reuse it if a prior run left one;
  //    never touch "Default Workspace" (a manual submit can lock it, which
  //    then blocks create_version — the "Workspace is already submitted" error).
  const { data: ws } = await tm.accounts.containers.workspaces.list({ parent: container.path })
  const workspace =
    (ws.workspace ?? []).find((w) => w.name === "Default Workspace") ??
    (ws.workspace ?? [])[0]
  console.log(`Workspace: ${workspace.name}`)

  // 3. All-Pages init trigger is built-in; tags use the reserved id "2147479553".
  // 4. Skip if a Google tag for this GA4 id already exists
  const { data: tags } = await tm.accounts.containers.workspaces.tags.list({ parent: workspace.path })
  const existing = (tags.tag ?? []).find(
    (t) => t.type === "googtag" &&
      (t.parameter ?? []).some((p) => p.key === "tagId" && p.value === GA4_ID)
  )
  if (existing) {
    console.log(`Google tag for ${GA4_ID} already exists — skipping create`)
  } else {
    await tm.accounts.containers.workspaces.tags.create({
      parent: workspace.path,
      requestBody: {
        name: `GA4 — ${GA4_ID}`,
        type: "googtag",
        parameter: [{ key: "tagId", type: "template", value: GA4_ID }],
        firingTriggerId: ["2147479553"], // All Pages (Initialization)
      },
    })
    console.log(`Created Google tag → ${GA4_ID}`)
  }

  // 4b. Custom events → one Custom Event trigger + one GA4 Event tag each.
  // The site pushes these to dataLayer; GTM forwards them to GA4 with params.
  const EVENTS = [
    { event: "cta_click", params: ["cta_text", "cta_url"] },
    { event: "project_click", params: ["project_name", "project_url"] },
    { event: "external_link", params: ["link_label", "link_url"] },
    { event: "contact_start", params: [] },
    { event: "contact_submit", params: ["contact_channel"] },
    { event: "language_switch", params: ["lang_from", "lang_to"] },
    { event: "scroll_depth", params: ["scroll_percent"] },
  ]

  const { data: trg } = await tm.accounts.containers.workspaces.triggers.list({ parent: workspace.path })
  const triggersByName = new Map((trg.trigger ?? []).map((t) => [t.name, t]))
  const tagsByName = new Map((tags.tag ?? []).map((t) => [t.name, t]))

  // dataLayer variables for every param we read
  const { data: vars } = await tm.accounts.containers.workspaces.variables.list({ parent: workspace.path })
  const varsByName = new Map((vars.variable ?? []).map((v) => [v.name, v]))
  const allParams = [...new Set(EVENTS.flatMap((e) => e.params))]
  for (const p of allParams) {
    if (varsByName.has(`dlv - ${p}`)) continue
    await tm.accounts.containers.workspaces.variables.create({
      parent: workspace.path,
      requestBody: {
        name: `dlv - ${p}`,
        type: "v",
        parameter: [
          { key: "name", type: "template", value: p },
          { key: "dataLayerVersion", type: "integer", value: "2" },
        ],
      },
    })
  }

  for (const { event, params } of EVENTS) {
    const trigName = `CE - ${event}`
    let trigger = triggersByName.get(trigName)
    if (!trigger) {
      const res = await tm.accounts.containers.workspaces.triggers.create({
        parent: workspace.path,
        requestBody: {
          name: trigName,
          type: "customEvent",
          customEventFilter: [
            { type: "equals", parameter: [
              { key: "arg0", type: "template", value: "{{_event}}" },
              { key: "arg1", type: "template", value: event },
            ]},
          ],
        },
      })
      trigger = res.data
    }

    const tagName = `GA4 Event - ${event}`
    if (tagsByName.has(tagName)) continue
    await tm.accounts.containers.workspaces.tags.create({
      parent: workspace.path,
      requestBody: {
        name: tagName,
        type: "gaawe",
        parameter: [
          { key: "measurementIdOverride", type: "template", value: GA4_ID },
          { key: "eventName", type: "template", value: event },
          {
            key: "eventParameters",
            type: "list",
            list: params.map((p) => ({
              type: "map",
              map: [
                { key: "name", type: "template", value: p },
                { key: "value", type: "template", value: `{{dlv - ${p}}}` },
              ],
            })),
          },
        ],
        firingTriggerId: [trigger.triggerId],
      },
    })
    console.log(`Created GA4 event tag → ${event}`)
  }

  // 5. Version + publish
  const { data: ver } = await tm.accounts.containers.workspaces.create_version({
    path: workspace.path,
    requestBody: { name: `setup ${GA4_ID}` },
  })
  const versionId = ver.containerVersion?.containerVersionId
  if (!versionId) throw new Error("No version created (nothing changed?)")
  await tm.accounts.containers.versions.publish({ path: ver.containerVersion.path })
  console.log(`Published container version ${versionId}. Done.`)
}

main().catch((e) => {
  console.error(e?.message ?? e)
  process.exit(1)
})
