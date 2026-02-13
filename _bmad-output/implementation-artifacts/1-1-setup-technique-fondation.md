# Story 1.1: Setup Technique & Fondation

Status: done

## Story

As a développeur,
I want configurer la base technique du projet (dépendances, DB, design tokens, fonts),
so that toutes les futures stories ont une fondation solide pour s'appuyer.

## Acceptance Criteria

1. **Given** le projet Next.js 16 existant (create-next-app), **When** j'installe les dépendances complémentaires (drizzle-orm, @neondatabase/serverless, nanoid, bcryptjs, zod, motion), **Then** toutes les dépendances sont installées sans conflit et le build passe.

2. **Given** une base de données Neon provisionnée, **When** je configure la connexion Drizzle dans `lib/db/index.ts` avec `DATABASE_URL`, **Then** la connexion à Neon fonctionne en dev et en production.

3. **Given** le schéma Drizzle défini dans `lib/db/schema.ts`, **When** je lance `drizzle-kit push`, **Then** les 3 tables (guests, site_config, admin_sessions) sont créées dans Neon.

4. **Given** le design system défini dans le UX spec, **When** je configure `globals.css` avec les design tokens `@theme inline`, **Then** la palette (crème #FAF7F2, doré #B8860B, brun #2C2418), les polices (Cormorant Garamond + Geist Sans) et les spacing tokens sont disponibles dans tout le projet.

5. **Given** le fichier `.env.example` créé, **When** un développeur clone le projet, **Then** il sait quelles variables d'environnement configurer (DATABASE_URL, ADMIN_PASSWORD).

## Tasks / Subtasks

- [x] **Task 1: Install dependencies** (AC: #1)
  - [x] Install production deps: `npm install drizzle-orm @neondatabase/serverless nanoid bcryptjs zod motion`
  - [x] Install dev deps: `npm install -D drizzle-kit @types/bcryptjs`
  - [x] Initialize shadcn/ui: `npx shadcn@latest init`
  - [x] Add shadcn components: `npx shadcn@latest add button dialog input table badge switch dropdown-menu`
  - [x] Verify build passes: `npm run build`

- [x] **Task 2: Configure Drizzle + Neon** (AC: #2)
  - [x] Create `lib/db/index.ts` with neon-http driver
  - [x] Create `drizzle.config.ts` at project root
  - [x] Add `db:push` and `db:generate` scripts to package.json

- [x] **Task 3: Create DB schema** (AC: #3)
  - [x] Create `lib/db/schema.ts` with 3 tables (guests, site_config, admin_sessions)
  - [x] Run `drizzle-kit push` to create tables in Neon
  - [x] Create `lib/db/queries.ts` with placeholder exports

- [x] **Task 4: Configure design tokens & fonts** (AC: #4)
  - [x] Add Cormorant Garamond to `app/layout.tsx` via next/font/google
  - [x] Replace globals.css with complete design tokens (@theme inline)
  - [x] Update metadata in root layout (title, description, lang="fr")
  - [x] Remove dark mode media query (not used)

- [x] **Task 5: Create project structure** (AC: #1, #5)
  - [x] Create directory structure: `app/(guest)/`, `app/(admin)/`, `components/guest/`, `components/admin/`, `lib/schemas/`, `lib/`, `public/images/`
  - [x] Create `.env.example` with template variables
  - [x] Create `lib/auth.ts` with placeholder exports
  - [x] Create `lib/utils.ts` with `generateSlug()` and `cn()` helper

- [x] **Task 6: Verify** (AC: #1-5)
  - [x] Run `npm run build` — no errors
  - [x] Run `npm run lint` — no errors
  - [x] Verify DB connection works (3 tables confirmed: guests, site_config, admin_sessions)

## Dev Notes

### Critical Version Information (February 2026)

| Package | Version | Critical Notes |
|---------|---------|----------------|
| drizzle-orm | 0.45.1 | Use stable, NOT v1 beta |
| drizzle-kit | 0.30.x | Must match drizzle-orm |
| @neondatabase/serverless | 1.0.2 | Use `drizzle-orm/neon-http` for serverless |
| nanoid | 5.1.6 | ESM-only — `import { nanoid } from 'nanoid'` |
| bcryptjs | 3.0.3 | NOT bcrypt — bcryptjs works in Edge Runtime |
| zod | 4.3.6 | Zod 4 is now default — `error` replaces `message` in custom errors |
| motion | 12.34.0 | Import from `"motion/react"` NOT `"framer-motion"` |
| shadcn CLI | latest | `npx shadcn@latest init` — uses OKLCH colors + tw-animate-css |

### Zod 4 Breaking Changes (Important)

Zod 4 is now the default export of `zod` package. Key differences from v3:
- Error customization: use `error` parameter instead of `message`
- `z.strictObject()` / `z.looseObject()` preferred over `.strict()` / `.passthrough()`
- `.default()` inside `.optional()` now applies the default
- Fresh project — use Zod 4 syntax directly

### bcryptjs vs bcrypt

Use **bcryptjs** (pure JavaScript), NOT **bcrypt** (native C++ bindings):
- bcrypt FAILS in Vercel Edge Runtime
- bcryptjs works everywhere (Node.js, Edge, middleware)
- Install: `npm install bcryptjs` + `npm install -D @types/bcryptjs`

### Drizzle + Neon Connection Pattern

Use **HTTP mode** (`drizzle-orm/neon-http`) — faster for single queries in serverless:

```typescript
// lib/db/index.ts
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle({ client: sql, schema })
```

### Database Schema (Exact Specification)

**Table: `guests`**

| Column | Type | Constraints |
|--------|------|-------------|
| id | serial | PRIMARY KEY |
| slug | varchar(10) | UNIQUE, NOT NULL |
| first_name | varchar(100) | NOT NULL |
| last_name | varchar(100) | NOT NULL |
| group_name | varchar(100) | NULLABLE |
| max_persons | integer | NOT NULL, DEFAULT 1 |
| status | varchar(20) | NOT NULL, DEFAULT 'pending' — values: 'pending' \| 'confirmed' \| 'declined' |
| persons_confirmed | integer | NOT NULL, DEFAULT 0 |
| created_at | timestamp | NOT NULL, DEFAULT NOW() |
| updated_at | timestamp | NOT NULL, DEFAULT NOW() |

**Table: `site_config`**

| Column | Type | Constraints |
|--------|------|-------------|
| id | serial | PRIMARY KEY |
| key | varchar(50) | UNIQUE, NOT NULL |
| value | varchar(255) | NOT NULL |
| updated_at | timestamp | NOT NULL, DEFAULT NOW() |

**Table: `admin_sessions`**

| Column | Type | Constraints |
|--------|------|-------------|
| id | serial | PRIMARY KEY |
| token | varchar(64) | UNIQUE, NOT NULL |
| expires_at | timestamp | NOT NULL |

### nanoid Slug Configuration

```typescript
// lib/utils.ts
import { customAlphabet } from 'nanoid'

const alphabet = 'abcdefghjkmnpqrstuvwxyz23456789' // no 0oOlLiI1
export const generateSlug = customAlphabet(alphabet, 10)
```

### Design Tokens (Complete)

**Colors (CSS variables in :root, mapped in @theme inline):**

```css
:root {
  /* Primary */
  --cream-warm: #FAF7F2;
  --gold-moroccan: #B8860B;
  --brown-deep: #2C2418;
  /* Complementary */
  --gold-luminous: #D4A54A;
  --gold-veil: #E8D5A8;
  --white-broken: #FFFDF9;
  --brown-medium: #6B5D4F;
  --red-soft: #C45B4A;
  --green-olive: #6B8F5E;
}
```

**Typography Scale:**

| Token | Mobile | Desktop | Weight |
|-------|--------|---------|--------|
| Display XL | 3rem (48px) | 5rem (80px) | 300 |
| Display L | 2.25rem (36px) | 3.5rem (56px) | 400 |
| Display M | 1.75rem (28px) | 2.5rem (40px) | 400 |
| Body L | 1.125rem (18px) | — | 400 |
| Body M | 1rem (16px) | — | 400 |
| Body S | 0.875rem (14px) | — | 400 |
| Button | 1rem (16px) | — | 500 |
| Caption | 0.75rem (12px) | — | 400 |

**Spacing (8px base):**
- xs: 4px, sm: 8px, md: 16px, lg: 32px, xl: 64px, 2xl: 128px

**Animation Tokens:**
- ease-out: 600ms (entry), ease-in-out: 300ms (state), 150ms (button feedback)
- Overlay: `cubic-bezier(0.32, 0.72, 0, 1)` 400ms
- Pulse: ease-in-out 2000ms infinite

**Border Radius:** 8px default

### Font Loading

```typescript
// app/layout.tsx
import { Cormorant_Garamond } from 'next/font/google'
import { Geist, Geist_Mono } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400'],
  display: 'swap',
})
```

### Project Structure to Create

```
app/
  (guest)/layout.tsx          # Guest cinematic layout (placeholder)
  (admin)/layout.tsx          # Admin utilitarian layout (placeholder)
  layout.tsx                  # Root layout (fonts, metadata) — MODIFY EXISTING
  globals.css                 # Design tokens — MODIFY EXISTING
components/
  guest/                      # Empty dir (future stories)
  admin/                      # Empty dir (future stories)
  ui/                         # Created by shadcn init
lib/
  db/
    index.ts                  # Drizzle + Neon connection
    schema.ts                 # 3 tables schema
    queries.ts                # Placeholder for reusable queries
  schemas/
    guest.ts                  # Zod schemas (placeholder)
    rsvp.ts                   # Zod schemas (placeholder)
    config.ts                 # Zod schemas (placeholder)
  auth.ts                     # Placeholder (verifyPassword, createSession, validateSession)
  utils.ts                    # generateSlug(), cn()
public/
  images/                     # Empty dir for couple photos
drizzle.config.ts             # Drizzle Kit config
.env.example                  # Template (no values)
```

### .env.example Content

```env
# Database (Neon via Vercel Postgres)
DATABASE_URL=postgresql://user:password@ep-XXXXX.neon.tech/wedding?sslmode=require

# Admin Authentication
ADMIN_PASSWORD=your-secure-password-here
```

### Naming Conventions (Mandatory)

| Context | Convention | Example |
|---------|-----------|---------|
| DB tables | snake_case, plural | `guests`, `site_config` |
| DB columns | snake_case | `first_name`, `max_persons` |
| Files | kebab-case | `guest-table.tsx`, `rsvp-overlay.tsx` |
| Components | PascalCase | `GuestTable`, `RsvpOverlay` |
| Functions | camelCase | `getGuestBySlug()`, `updateRsvp()` |
| Constants | UPPER_SNAKE_CASE | `MAX_SLUG_LENGTH` |
| Types | PascalCase | `Guest`, `SiteConfig` |
| Zod schemas | camelCase + Schema | `guestCreateSchema` |
| API routes | kebab-case, plural | `/api/admin/guests` |
| API body/params | camelCase | `{ firstName, personsConfirmed }` |

### Anti-Patterns to Avoid

- ❌ `bcrypt` → ✅ `bcryptjs` (Edge Runtime safe)
- ❌ `import from "framer-motion"` → ✅ `import from "motion/react"`
- ❌ Zod 3 `message` param → ✅ Zod 4 `error` param
- ❌ PascalCase filenames → ✅ kebab-case filenames
- ❌ `helpers/`, `services/` folders → ✅ Everything in `lib/`
- ❌ `"use client"` on non-interactive → ✅ Server Component by default
- ❌ Dark mode CSS → ✅ Remove (not used)
- ❌ `moment.js` / `dayjs` → ✅ `Intl.DateTimeFormat('fr-FR')`

### Project Structure Notes

- Existing `app/layout.tsx` will be MODIFIED (add Cormorant font, update metadata)
- Existing `app/globals.css` will be REPLACED (new design tokens)
- Existing `app/page.tsx` can be kept as-is temporarily (will be replaced in Story 1.2)
- Route groups `(guest)` and `(admin)` create separate layout contexts
- `components/ui/` is auto-generated by `npx shadcn@latest init`

### References

- [Source: _bmad-output/planning-artifacts/architecture.md — Sections 3-6]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Sections: Design System Foundation, Visual Design Foundation]
- [Source: _bmad-output/planning-artifacts/epics.md — Epic 1, Story 1.1]
- [Source: _bmad-output/planning-artifacts/prd.md — Technical Requirements, FR29]

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Debug Log References
None — no errors encountered during implementation.

### Completion Notes List
- All dependencies installed successfully (drizzle-orm, neon, nanoid, bcryptjs, zod, motion, shadcn/ui components)
- Drizzle + Neon connection configured (lib/db/index.ts) using neon-http driver
- DB schema defined with 3 tables: guests (10 cols), site_config (4 cols), admin_sessions (3 cols)
- Wedding design tokens replace shadcn defaults: crème #FAF7F2, doré #B8860B, brun #2C2418
- Cormorant Garamond loaded for display font, Geist Sans for body
- Dark mode removed (not needed for this project)
- Route groups (guest) and (admin) created with placeholder layouts
- generateSlug() added to lib/utils.ts with nanoid custom alphabet
- `drizzle-kit push` executed — 3 tables créées dans Neon (guests, site_config, admin_sessions)
- Connexion DB vérifiée — tagged template query retourne les 3 tables correctement

### Code Review Fixes (2026-02-13)
- ✅ Fixed [CRITICAL]: Added `!.env.example` to `.gitignore` so it can be committed
- ✅ Fixed [HIGH]: Restored placeholder values in `.env.example` (removed real credentials)
- ✅ Fixed [HIGH]: Added spacing tokens (xs→2xl) to `@theme inline` in `globals.css`
- ✅ Fixed [MEDIUM]: Added `.$onUpdate(() => new Date())` on `updatedAt` columns in `schema.ts`
- ✅ Fixed [MEDIUM]: Added `package-lock.json` to File List
- ✅ Fixed [LOW]: Added inferred type exports (`Guest`, `NewGuest`, `SiteConfig`, `AdminSession`) to `schema.ts`
- Skipped [MEDIUM]: `status` varchar vs pgEnum — kept as varchar per story spec, Zod validation will enforce valid values

### File List
- `lib/db/index.ts` — Drizzle + Neon HTTP connection
- `lib/db/schema.ts` — 3 tables (guests, site_config, admin_sessions)
- `lib/db/queries.ts` — Placeholder for reusable queries
- `lib/utils.ts` — Modified: added generateSlug() with nanoid
- `lib/auth.ts` — Placeholder for auth functions
- `lib/schemas/guest.ts` — Placeholder for Zod schemas
- `lib/schemas/rsvp.ts` — Placeholder for Zod schemas
- `lib/schemas/config.ts` — Placeholder for Zod schemas
- `drizzle.config.ts` — Drizzle Kit configuration
- `app/globals.css` — Replaced with wedding design tokens
- `app/layout.tsx` — Modified: Cormorant Garamond, metadata, lang="fr"
- `app/(guest)/layout.tsx` — Guest route group layout (placeholder)
- `app/(admin)/layout.tsx` — Admin route group layout (placeholder)
- `components/ui/button.tsx` — shadcn component
- `components/ui/dialog.tsx` — shadcn component
- `components/ui/input.tsx` — shadcn component
- `components/ui/table.tsx` — shadcn component
- `components/ui/badge.tsx` — shadcn component
- `components/ui/switch.tsx` — shadcn component
- `components/ui/dropdown-menu.tsx` — shadcn component
- `components.json` — shadcn/ui configuration
- `.env.example` — Environment variable template
- `package.json` — Modified: added db:push, db:generate scripts
- `package-lock.json` — Modified: updated lockfile with new dependencies
- `.gitignore` — Modified: added `!.env.example` exception
