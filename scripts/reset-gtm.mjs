// Nuclear reset + reseed of the GTM container into ONE workspace (Default).
// Deletes any extra "setup-script" workspace, wipes all tags/triggers/vars in
// Default Workspace, then recreates the GA4 tag + 7 event tags cleanly.
// Publish is done manually afterwards (service accounts can't publish via API).
//
//   GTM_ID=GTM-XXXXXXX GA4_ID=G-XXXXXXXXXX \
//   GOOGLE_APPLICATION_CREDENTIALS=./key.json node scripts/reset-gtm.mjs

import { google } from "googleapis"
import { readFileSync } from "node:fs"

const GTM_ID = process.env.GTM_ID
const GA4_ID = process.env.GA4_ID
const KEY_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS
if (!GTM_ID || !GA4_ID || !KEY_PATH) {
  console.error("Set GTM_ID, GA4_ID, GOOGLE_APPLICATION_CREDENTIALS")
  process.exit(1)
}

const credentials = JSON.parse(readFileSync(KEY_PATH, "utf8"))
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/tagmanager.edit.containers"],
})
const tm = google.tagmanager({ version: "v2", auth })

const EVENTS = [
  { event: "cta_click", params: ["cta_text", "cta_url"] },
  { event: "project_click", params: ["project_name", "project_url"] },
  { event: "external_link", params: ["link_label", "link_url"] },
  { event: "contact_start", params: [] },
  { event: "contact_submit", params: ["contact_channel"] },
  { event: "language_switch", params: ["lang_from", "lang_to"] },
  { event: "scroll_depth", params: ["scroll_percent"] },
]

async function main() {
  const { data: accts } = await tm.accounts.list()
  let container = null
  for (const acct of accts.account ?? []) {
    const { data } = await tm.accounts.containers.list({ parent: acct.path })
    const found = (data.container ?? []).find((c) => c.publicId === GTM_ID)
    if (found) { container = found; break }
  }
  if (!container) throw new Error(`Container ${GTM_ID} not found`)
  console.log(`Container: ${container.name}`)

  // --- Delete every non-Default workspace (e.g. leftover "setup-script") ---
  const { data: wsList } = await tm.accounts.containers.workspaces.list({ parent: container.path })
  const workspace = (wsList.workspace ?? []).find((w) => w.name === "Default Workspace") ?? (wsList.workspace ?? [])[0]
  for (const w of wsList.workspace ?? []) {
    if (w.workspaceId !== workspace.workspaceId) {
      await tm.accounts.containers.workspaces.delete({ path: w.path })
      console.log(`Deleted extra workspace: ${w.name}`)
    }
  }
  console.log(`Working in: ${workspace.name}`)

  // --- Wipe existing tags / triggers / variables in the Default workspace ---
  const { data: tagList } = await tm.accounts.containers.workspaces.tags.list({ parent: workspace.path })
  for (const t of tagList.tag ?? []) {
    await tm.accounts.containers.workspaces.tags.delete({ path: t.path })
    console.log(`  removed tag: ${t.name}`)
  }
  const { data: trgList } = await tm.accounts.containers.workspaces.triggers.list({ parent: workspace.path })
  for (const t of trgList.trigger ?? []) {
    await tm.accounts.containers.workspaces.triggers.delete({ path: t.path })
    console.log(`  removed trigger: ${t.name}`)
  }
  const { data: varList } = await tm.accounts.containers.workspaces.variables.list({ parent: workspace.path })
  for (const v of varList.variable ?? []) {
    await tm.accounts.containers.workspaces.variables.delete({ path: v.path })
    console.log(`  removed variable: ${v.name}`)
  }

  // --- GA4 config tag (All Pages / Initialization) ---
  await tm.accounts.containers.workspaces.tags.create({
    parent: workspace.path,
    requestBody: {
      name: "GA4 CONFIG",
      type: "googtag",
      parameter: [{ key: "tagId", type: "template", value: GA4_ID }],
      firingTriggerId: ["2147479553"],
    },
  })
  console.log(`Created GA4 CONFIG → ${GA4_ID}`)

  // --- dataLayer variables for every event param ---
  const allParams = [...new Set(EVENTS.flatMap((e) => e.params))]
  for (const p of allParams) {
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

  // --- one Custom Event trigger + GA4 event tag per event ---
  for (const { event, params } of EVENTS) {
    const { data: trigger } = await tm.accounts.containers.workspaces.triggers.create({
      parent: workspace.path,
      requestBody: {
        name: `CE - ${event}`,
        type: "customEvent",
        customEventFilter: [
          { type: "equals", parameter: [
            { key: "arg0", type: "template", value: "{{_event}}" },
            { key: "arg1", type: "template", value: event },
          ]},
        ],
      },
    })
    await tm.accounts.containers.workspaces.tags.create({
      parent: workspace.path,
      requestBody: {
        name: `GA4 Event - ${event}`,
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
    console.log(`Created event tag → ${event}`)
  }

  console.log("\n✅ All 8 tags in ONE workspace (Default). Now publish it in GTM: Enviar → Publicar.")
}

main().catch((e) => { console.error(e?.message ?? e); process.exit(1) })
