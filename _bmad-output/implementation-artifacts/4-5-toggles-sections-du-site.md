# Story 4.5: Toggles Sections du Site

Status: done

## Story

As a admin (Ahmed ou Ghizlaine),
I want activer ou désactiver les sections "Lieu" et "Programme" du site,
so that je puisse contrôler le timing de l'information révélée aux invités.

## Acceptance Criteria

1. **Given** l'admin sur le dashboard
   **When** il voit la zone de configuration
   **Then** deux toggles (Switch shadcn/ui) sont affichés : "Section Lieu" et "Section Programme" avec leur état actuel (on/off)

2. **Given** le toggle "Section Lieu" sur off
   **When** l'admin le bascule sur on
   **Then** une requête PUT `/api/admin/config` met à jour `show_venue = true` en base et le toggle reflète le nouvel état (FR27)

3. **Given** le toggle "Section Programme" sur on
   **When** l'admin le bascule sur off
   **Then** `show_program = false` en base et les invités qui chargent la page ne voient plus la section Programme (FR28)

4. **Given** un toggle modifié
   **When** un invité recharge sa page
   **Then** la section apparaît ou disparaît selon la nouvelle valeur en base (pas besoin de redéploiement)

## Tasks / Subtasks

- [x] Task 1: Add Zod `configUpdateSchema` to `lib/schemas/config.ts` (AC: #2, #3)
  - [x] 1.1: Replace placeholder with `configUpdateSchema` — `z.object({ key: z.enum(['show_venue', 'show_program']), value: z.enum(['true', 'false']) })`
  - [x] 1.2: Export `ConfigUpdateInput` type

- [x] Task 2: Add `updateSiteConfig(key, value)` query to `lib/db/queries.ts` (AC: #2, #3)
  - [x] 2.1: `updateSiteConfig(key: string, value: string)` — update by key, return updated row with `.returning()`
  - [x] 2.2: Return `null` if key not found (empty `.returning()`)

- [x] Task 3: Create `app/api/admin/config/route.ts` with GET + PUT handlers (AC: #1, #2, #3)
  - [x] 3.1: GET handler — auth check, call `getSiteConfig()`, return `{ showVenue: boolean, showProgram: boolean }`
  - [x] 3.2: PUT handler — auth check, parse body with `configUpdateSchema.safeParse()`, on error → 400
  - [x] 3.3: PUT handler — call `updateSiteConfig(key, value)`, return 200 `{ success: true }` or 404 if key not found

- [x] Task 4: Create `components/admin/config-toggles.tsx` (AC: #1, #2, #3)
  - [x] 4.1: Client Component with two Switch controls (shadcn/ui) for "Section Lieu" and "Section Programme"
  - [x] 4.2: Accept initial config as props (from Server Component) to avoid extra fetch
  - [x] 4.3: On toggle change → PUT `/api/admin/config` with key + new value
  - [x] 4.4: Show loading state during request, revert on error
  - [x] 4.5: Labels with `htmlFor`/`id` for accessibility

- [x] Task 5: Integrate config toggles into dashboard (AC: #1)
  - [x] 5.1: Load `getSiteConfig()` in `app/(admin)/admin/page.tsx` (already used for guest page, same query)
  - [x] 5.2: Render `<ConfigToggles>` between SummaryCounter and GuestList, passing config as props
  - [x] 5.3: No `router.refresh()` needed — optimistic toggle UI is sufficient

- [x] Task 6: Build + lint verification
  - [x] 6.1: `npm run build` passes
  - [x] 6.2: `npm run lint` passes

## Dev Notes

### Existing Infrastructure

| File | Status | Notes |
|------|--------|-------|
| `lib/db/schema.ts` | READY | `siteConfig` table with key/value pairs, already seeded with `show_venue` and `show_program` |
| `lib/db/queries.ts` | EXTEND | `getSiteConfig()` already exists, add `updateSiteConfig()` |
| `lib/schemas/config.ts` | REPLACE | Currently placeholder, replace with `configUpdateSchema` |
| `components/ui/switch.tsx` | READY | shadcn/ui Switch with Radix primitives |
| `app/(guest)/invite/[slug]/page.tsx` | READY | Already conditionally renders sections based on `getSiteConfig()` |

### Admin Layout Rule

**Ne pas** utiliser `max-w-*` sur les composants admin. Le layout admin gère la largeur via padding (`px-4 sm:px-8`). Les composants internes prennent `w-full`.

### Site Config Data Model

```typescript
// DB: site_config table
// Seeded rows:
//   { key: 'show_venue', value: 'true' }
//   { key: 'show_program', value: 'true' }
// Values are strings 'true'/'false', converted to booleans in code
```

### Guest Page — Already Works (AC #4)

```typescript
// app/(guest)/invite/[slug]/page.tsx — NO CHANGES NEEDED
const config = await getSiteConfig()
const showVenue = config.show_venue !== 'false'
const showProgram = config.show_program !== 'false'
// ...
{showVenue && <VenueSection />}
{showProgram && <ProgramSection />}
```

Guest pages are dynamic SSR — changes in DB reflect immediately on next page load. No caching issues.

### Query Pattern

```typescript
// lib/db/queries.ts — ADD
export async function updateSiteConfig(key: string, value: string) {
  const result = await db
    .update(siteConfig)
    .set({ value })
    .where(eq(siteConfig.key, key))
    .returning()
  return result[0] ?? null
}
```

### API Auth Pattern (reuse from existing routes)

```typescript
const cookieStore = await cookies()
const token = cookieStore.get('admin_token')?.value
if (!token || !(await validateSession(token))) {
  return NextResponse.json(
    { error: 'Non autorisé', code: 'UNAUTHORIZED' },
    { status: 401 }
  )
}
```

### Config Toggles Component Pattern

```typescript
// components/admin/config-toggles.tsx
'use client'
import { Switch } from '@/components/ui/switch'
// Props: { showVenue: boolean, showProgram: boolean }
// Optimistic updates: toggle immediately, revert on error
// PUT /api/admin/config with { key, value } on each toggle
```

### Toggle Styling

- Container: `rounded-lg border border-brown-medium/20 bg-white-broken p-4`
- Each toggle row: flex with label on left, Switch on right
- Labels: `text-sm font-medium text-brown-deep`
- Description: `text-xs text-brown-medium` (optional, e.g. "Visible pour les invités")
- Switch: default shadcn/ui styling

### Files to Create

| File | Action | Notes |
|------|--------|-------|
| `app/api/admin/config/route.ts` | CREATE | GET + PUT handlers |
| `components/admin/config-toggles.tsx` | CREATE | Client Component with Switch controls |

### Files to Modify

| File | Action | Notes |
|------|--------|-------|
| `lib/schemas/config.ts` | REPLACE | Replace placeholder with configUpdateSchema |
| `lib/db/queries.ts` | EXTEND | Add updateSiteConfig(key, value) |
| `app/(admin)/admin/page.tsx` | MODIFY | Add ConfigToggles with config props |

### Files NOT to Modify

| File | Reason |
|------|--------|
| `lib/db/schema.ts` | Schema already complete, seeded |
| `lib/db/seed.ts` | Already seeds show_venue and show_program |
| `app/(guest)/invite/[slug]/page.tsx` | Conditional rendering already works |
| `components/guest/venue-section.tsx` | Content component unchanged |
| `components/guest/program-section.tsx` | Content component unchanged |
| `lib/constants.ts` | No new constants needed |
| `components/ui/switch.tsx` | shadcn component — don't modify |
| `components/admin/guest-*.tsx` | Unrelated to config |
| `middleware.ts` | Route protection already configured |

### Accessibility

- Switch: built-in Radix a11y (role="switch", aria-checked)
- Labels: `<label htmlFor>` + `id` on Switch
- Touch targets: 44x44px minimum (Switch component handles this)
- Clear visual feedback on toggle state (color change)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 4 Story 4.5] — AC and BDD criteria (FR27, FR28)
- [Source: _bmad-output/planning-artifacts/architecture.md#API Patterns] — PUT /api/admin/config
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Admin Toggles] — Switch UI specs
- [Source: lib/db/schema.ts] — siteConfig table
- [Source: lib/db/queries.ts] — getSiteConfig() already exists
- [Source: app/(guest)/invite/[slug]/page.tsx] — conditional rendering already works
- [Source: components/ui/switch.tsx] — shadcn Switch component ready
- [Source: lib/db/seed.ts] — show_venue, show_program seeded as 'true'

### Previous Story Intelligence

**From Story 4.4 (Modification Manuelle du Statut RSVP):**
- PUT handler pattern: auth → params/body parse → Zod validate → DB update → response
- Client Component with optimistic state management
- No `max-w-*` on any component (user rule)
- Build + lint verification required

### Git Intelligence

Commit pattern: `feat: {story-key}`. Latest: `feat: 4-4-modification-manuelle-statut-rsvp`.

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

N/A

### Completion Notes List

- All 6 tasks completed — site section toggles fully functional
- `configUpdateSchema` validates key (show_venue/show_program) and value ('true'/'false') as string enums
- `updateSiteConfig(key, value)` updates site_config table by key, returns null if key not found
- GET `/api/admin/config` returns `{ showVenue: boolean, showProgram: boolean }` (converted from DB strings)
- PUT `/api/admin/config` accepts `{ key, value }`, validates with Zod, updates DB
- `ConfigToggles` component: optimistic UI — toggles immediately, reverts on API error
- Props-based initialization from Server Component — no extra API fetch on mount
- `Promise.all([getAllGuests(), getSiteConfig()])` in dashboard for parallel DB queries
- ConfigToggles placed between SummaryCounter and GuestList on dashboard
- Switch disabled during API request to prevent double-toggle
- Labels with `htmlFor`/`id` for accessibility
- Guest page conditional rendering already worked (from Story 2.3) — no changes needed
- No `max-w-*` used anywhere (user rule)
- `npm run build` and `npm run lint` both pass clean

### Change Log

| File | Action | Description |
|------|--------|-------------|
| `lib/schemas/config.ts` | REPLACED | Zod configUpdateSchema replacing placeholder |
| `lib/db/queries.ts` | MODIFIED | Added updateSiteConfig(key, value) function |
| `app/api/admin/config/route.ts` | CREATED | GET + PUT handlers with auth + Zod validation |
| `components/admin/config-toggles.tsx` | CREATED | Client Component with two Switch controls, optimistic UI |
| `app/(admin)/admin/page.tsx` | MODIFIED | Added getSiteConfig() + ConfigToggles integration |

### File List

- `lib/schemas/config.ts`
- `lib/db/queries.ts`
- `app/api/admin/config/route.ts`
- `components/admin/config-toggles.tsx`
- `app/(admin)/admin/page.tsx`
