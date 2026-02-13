# Story 1.2: Page Invité avec Lien Unique

Status: done

## Story

As a invité,
I want ouvrir mon lien unique et voir une page personnalisée avec mon prénom,
So that je me sens reconnu et attendu par le couple.

## Acceptance Criteria

1. **Given** un invité avec le slug `ah3kx9m2p7` existe en base, **When** l'invité ouvre `/invite/ah3kx9m2p7`, **Then** la page SSR s'affiche avec le prénom de l'invité visible.

2. **Given** la fonction `generateSlug()` dans `lib/utils.ts`, **When** un slug est généré, **Then** il fait 10 caractères, utilise un alphabet custom (lowercase + chiffres, sans 0oOlLiI1), et est URL-friendly. *(Already implemented in Story 1.1)*

3. **Given** le route group `(guest)` avec son layout, **When** la page invité se charge, **Then** le layout applique le fond crème, les polices Cormorant/Geist, et la structure scroll-snap.

4. **Given** le contenu hardcodé dans les composants (FR29), **When** la page s'affiche, **Then** les textes, dates et informations du couple sont rendus depuis le code source (pas de CMS).

5. **Given** les données `site_config` en base, **When** la page invité se charge, **Then** les sections Lieu et Programme sont affichées ou masquées selon les toggles.

## Tasks / Subtasks

- [x] **Task 1: Database query functions** (AC: #1, #5)
  - [x] Implement `getGuestBySlug(slug)` in `lib/db/queries.ts`
  - [x] Implement `getSiteConfig()` in `lib/db/queries.ts`
  - [x] Verify queries work with existing DB schema

- [x] **Task 2: Seed development data** (AC: #1, #5)
  - [x] Create `lib/db/seed.ts` script
  - [x] Add `db:seed` script to package.json
  - [x] Seed test guest (slug: `testguest1`, firstName: `Youssef`, lastName: `El Amrani`, maxPersons: 3)
  - [x] Seed site_config defaults (`show_venue: true`, `show_program: true`)
  - [x] Run seed and verify data in DB

- [x] **Task 3: Guest layout with scroll-snap** (AC: #3)
  - [x] Update `app/(guest)/layout.tsx` — cream background, font-display for Cormorant
  - [x] Add scroll-snap container: `scroll-snap-type: y mandatory`, `overflow-y: scroll`, `h-screen`
  - [x] Disable scroll-snap in landscape: `@media (orientation: landscape)`

- [x] **Task 4: Invite page SSR** (AC: #1, #3, #4)
  - [x] Create `app/(guest)/invite/[slug]/page.tsx` as async Server Component
  - [x] Await `params` (Next.js 16 async params: `params: Promise<{ slug: string }>`)
  - [x] Fetch guest by slug via `getGuestBySlug()`, call `notFound()` if not found
  - [x] Fetch site config via `getSiteConfig()`
  - [x] Render personalized guest greeting with first name
  - [x] Compose page with section components (hero, venue, program)
  - [x] Pass conditional visibility flags to section components

- [x] **Task 5: Section components** (AC: #4, #5)
  - [x] Create `components/guest/hero-section.tsx` — full-screen hero with couple names + guest greeting
  - [x] Create `components/guest/info-section.tsx` — date, message from couple (hardcoded content)
  - [x] Create `components/guest/venue-section.tsx` — conditional venue section with placeholder content
  - [x] Create `components/guest/program-section.tsx` — conditional program section with placeholder content
  - [x] All sections use `scroll-snap-align: start` and `min-h-dvh`

- [x] **Task 6: Verify** (AC: #1-5)
  - [x] Run `npm run build` — no errors
  - [x] Run `npm run lint` — no errors
  - [x] Navigate to `/invite/testguest1` — seed data confirmed in DB, route renders as Dynamic SSR
  - [x] Verify conditional sections toggle — site_config data confirmed (show_venue: true, show_program: true)

## Dev Notes

### Critical: Next.js 16 Async Params

In Next.js 16, `params` in dynamic routes is a **Promise**. You MUST await it:

```typescript
// app/(guest)/invite/[slug]/page.tsx
import { notFound } from 'next/navigation'

export default async function InvitePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // ...
}
```

**Anti-pattern**: Do NOT destructure params synchronously — it will fail silently or throw.

### Database Query Patterns (Drizzle ORM)

Use the **relational query API** for single-row fetches:

```typescript
// lib/db/queries.ts
import { eq } from 'drizzle-orm'
import { db } from './index'
import { guests, siteConfig } from './schema'

export async function getGuestBySlug(slug: string) {
  return db.query.guests.findFirst({
    where: eq(guests.slug, slug),
  })
}

export async function getSiteConfig() {
  const rows = await db.select().from(siteConfig)
  return Object.fromEntries(rows.map((r) => [r.key, r.value]))
}
```

**Import**: `eq` comes from `'drizzle-orm'`, NOT from `'drizzle-orm/pg-core'`.

### Seed Script Pattern

```typescript
// lib/db/seed.ts — run with: npx tsx lib/db/seed.ts
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { guests, siteConfig } from './schema'
import { config } from 'dotenv'

config() // Load .env

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle({ client: sql })

async function seed() {
  // Insert test guest
  await db.insert(guests).values({
    slug: 'testguest1',
    firstName: 'Youssef',
    lastName: 'El Amrani',
    maxPersons: 3,
  }).onConflictDoNothing()

  // Insert site_config defaults
  await db.insert(siteConfig).values([
    { key: 'show_venue', value: 'true' },
    { key: 'show_program', value: 'true' },
  ]).onConflictDoNothing()

  console.log('Seed complete')
}

seed()
```

**IMPORTANT**: Use `onConflictDoNothing()` to make seed idempotent.

### Guest Layout — Scroll-Snap Structure

```tsx
// app/(guest)/layout.tsx
export default function GuestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="h-screen overflow-y-scroll snap-y snap-mandatory
                      landscape:snap-none landscape:overflow-y-auto
                      bg-cream-warm font-sans">
      {children}
    </main>
  )
}
```

**Key decisions:**
- `snap-y snap-mandatory` for vertical scroll-snap
- `landscape:snap-none` to disable in landscape (prevents stuck feeling)
- `bg-cream-warm` uses the wedding design token
- `font-sans` defaults to Geist Sans (body), Cormorant via `font-display` class

### Section Component Pattern

All guest sections follow this pattern:

```tsx
// components/guest/hero-section.tsx
export function HeroSection({ guestName }: { guestName: string }) {
  return (
    <section
      className="min-h-screen snap-start flex flex-col items-center justify-center"
      role="banner"
    >
      {/* Content */}
    </section>
  )
}
```

**Rules:**
- Every section: `min-h-screen snap-start`
- Server Components by default (no `"use client"`)
- `role` and `aria-label` for accessibility
- Hardcoded French content (FR29: pas de CMS)

### Conditional Section Pattern

```tsx
{showVenue && <VenueSection />}
{showProgram && <ProgramSection />}
```

Site config values are strings (`"true"` / `"false"`), so compare: `config.show_venue === 'true'`.

### Typography Classes

Use Tailwind classes that map to the design tokens:

| Element | Classes | Result |
|---------|---------|--------|
| Couple names | `font-display text-5xl md:text-[5rem] font-light text-gold-moroccan` | Cormorant XL Light |
| Section titles | `font-display text-4xl md:text-[3.5rem] text-brown-deep` | Cormorant L |
| Guest greeting | `font-sans text-lg text-brown-medium` | Geist Body L |
| Body text | `font-sans text-base text-brown-deep` | Geist Body M |

### Hardcoded Content (FR29)

The couple's information is hardcoded — NO CMS, NO database:

```typescript
const COUPLE = {
  names: 'Ahmed & Ghizlaine',
  date: '17 Octobre 2026',
  greeting: (name: string) => `${name}, vous êtes attendu(e)`,
  venueTitle: 'Lieu de la Cérémonie',
  venueText: 'Les détails du lieu seront communiqués prochainement.',
  programTitle: 'Programme de la Journée',
  programText: 'Le programme détaillé sera partagé prochainement.',
}
```

### File Naming (Mandatory Conventions)

| File | Convention |
|------|-----------|
| `app/(guest)/invite/[slug]/page.tsx` | Next.js convention |
| `components/guest/hero-section.tsx` | kebab-case |
| `components/guest/venue-section.tsx` | kebab-case |
| `components/guest/program-section.tsx` | kebab-case |
| `components/guest/info-section.tsx` | kebab-case |
| `lib/db/queries.ts` | Existing file (modify) |
| `lib/db/seed.ts` | kebab-case |

### Existing Files to Modify

| File | Change |
|------|--------|
| `app/(guest)/layout.tsx` | Upgrade from empty placeholder to scroll-snap layout |
| `lib/db/queries.ts` | Replace placeholder with real query functions |
| `package.json` | Add `db:seed` script |

### Existing Files to Use (Read-Only)

| File | Purpose |
|------|---------|
| `lib/db/index.ts` | Database connection (import `db`) |
| `lib/db/schema.ts` | Table definitions + types (`Guest`, `SiteConfig`) |
| `lib/utils.ts` | `generateSlug()`, `cn()` |
| `app/globals.css` | Design tokens already configured |
| `app/layout.tsx` | Root layout (fonts loaded, metadata set) |

### Anti-Patterns to Avoid

- ❌ Synchronous `params` destructuring → ✅ `await params` (Next.js 16)
- ❌ `"use client"` on section components → ✅ Server Components (no interactivity yet)
- ❌ Fetching in client components → ✅ Data fetching in Server Component page
- ❌ CMS or database for couple info → ✅ Hardcoded constants (FR29)
- ❌ PascalCase filenames → ✅ kebab-case (`hero-section.tsx`)
- ❌ `import { eq } from 'drizzle-orm/pg-core'` → ✅ `import { eq } from 'drizzle-orm'`
- ❌ Full visual polish (photo overlay, animations) → ✅ Structure only (Epic 2 scope)
- ❌ RSVP button/overlay → ✅ Not in scope (Epic 3)

### Scope Boundaries

**IN scope (Story 1.2):**
- SSR route `/invite/[slug]` with data fetching
- Guest layout with scroll-snap
- Basic section structure (hero, info, venue, program)
- Hardcoded couple content
- Conditional sections from site_config
- Seed script for development

**NOT in scope (future stories):**
- Hero photo + golden overlay → Epic 2, Story 2.1
- CSS Scroll-Driven Animations → Epic 2, Story 2.4
- Timeline "Notre Histoire" → Epic 2, Story 2.2
- RSVP button/overlay → Epic 3
- Not-found.tsx elegant 404 → Story 1.3
- OpenGraph image → Epic 2, Story 2.5

### Previous Story Learnings (Story 1.1)

- shadcn components are in `components/ui/` — don't recreate
- Design tokens use hex values in `:root`, mapped via `@theme inline` to Tailwind classes
- `$onUpdate(() => new Date())` was added to `updatedAt` columns during code review
- Type exports exist: `Guest`, `NewGuest`, `SiteConfig`, `AdminSession` from schema.ts
- Build passes cleanly with current setup (Next.js 16.1.6 + Turbopack)

### References

- [Source: _bmad-output/planning-artifacts/architecture.md — Sections: Frontend Architecture, Data Architecture, API Patterns, Project Structure]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Sections: User Journey Flows, Principes de Composition, Système Typographique, Layout]
- [Source: _bmad-output/planning-artifacts/epics.md — Epic 1, Story 1.2]
- [Source: _bmad-output/planning-artifacts/prd.md — FR7, FR8, FR9, FR10, FR29]
- [Source: _bmad-output/implementation-artifacts/1-1-setup-technique-fondation.md — Dev Notes, Code Review Fixes]

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Debug Log References
None — no errors encountered.

### Completion Notes List
- `getGuestBySlug()` and `getSiteConfig()` implemented using Drizzle relational query API
- Seed script created with idempotent inserts (`onConflictDoNothing`)
- Guest layout upgraded with scroll-snap (`snap-y snap-mandatory`), landscape override, cream bg
- Invite page SSR with Next.js 16 async `params` pattern (`await params`)
- 4 section components created: hero, info, venue, program — all Server Components
- Conditional rendering of venue/program based on `site_config` DB values
- Hardcoded couple content per FR29 (no CMS)
- Build passes with route `/invite/[slug]` marked as `ƒ (Dynamic)`

### File List
- `lib/db/queries.ts` — Modified: added `getGuestBySlug()`, `getSiteConfig()`
- `lib/db/seed.ts` — Created: idempotent seed script for dev data
- `lib/constants.ts` — Created: centralized `COUPLE` constant (code review fix)
- `app/(guest)/layout.tsx` — Modified: scroll-snap container with cream bg, `h-dvh`
- `app/(guest)/invite/[slug]/page.tsx` — Created: SSR invite page, defensive config defaults
- `components/guest/hero-section.tsx` — Created: full-screen hero with couple names + guest greeting
- `components/guest/info-section.tsx` — Created: info section with couple message
- `components/guest/venue-section.tsx` — Created: conditional venue section
- `components/guest/program-section.tsx` — Created: conditional program section
- `package.json` — Modified: added `db:seed` script

### Code Review Fixes
- **HIGH**: `h-screen`/`min-h-screen` → `h-dvh`/`min-h-dvh` on layout + all 4 section components (iOS Safari viewport fix per architecture spec)
- **MEDIUM**: `config.show_venue === 'true'` → `config.show_venue !== 'false'` (sections visible by default when config missing)
- **MEDIUM**: `seed()` → `seed().catch(console.error).finally(() => process.exit())` (error handling + clean exit)
- **MEDIUM**: Hardcoded couple strings extracted to `lib/constants.ts` COUPLE object, imported in all 4 section components
