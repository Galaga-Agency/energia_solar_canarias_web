# BOOTSTRAP.md — Project Initialization

Run these steps in strict order. Do not skip any. Do not write code until all commands succeed.

---

## Step 1 — Bootstrap Commands

```bash
In this project folder, run:
npx create-next-app@latest [PROJECT_NAME] \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"
npm install zustand react-hook-form react-icons gsap @gsap/react lenis
npm install -D @types/node
```

## Step 2 — Delete Boilerplate

Delete these files immediately after install:
- `app/globals.css` → replaced by `globals.css` at project root
- `app/page.module.css`
- `public/*.svg`

Clear and replace content (keep the files):
- `app/layout.tsx`
- `app/page.tsx`

## Step 3 — Verify tsconfig.json

Must contain:
```json
"baseUrl": ".",
"paths": { "@/*": ["./*"] }
```

## Step 4 — Create MEMORY.md

Read `.claude/rules/MEMORY_TEMPLATE.md` and create `MEMORY.md` at project root.

## Step 5 — Create globals.css at Project Root

```css
@import "tailwindcss";
@import "./styles/theme.css";
@import "./styles/base.css";
@import "./styles/animations.css";
@import "./styles/accessibility.css";
```

Import order is non-negotiable. Import once in `app/layout.tsx` as `import "@/globals.css"`.

## Step 6 — Create styles/ at Project Root

Four files required: `theme.css`, `base.css`, `animations.css`, `accessibility.css`. No `components.css`.
Read `.claude/rules/CSS_TOKENS.md` for their full content.

## Step 7 — Print the folder tree

Print the exact tree for this specific project before writing any source files.

## Step 8 — Write files in folder order

Load rule modules from CLAUDE.md Section 0 as you reach each file type.
After each file: run `.claude/rules/CHECKLIST.md`.
