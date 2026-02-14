# Story 3.1: API RSVP

Status: done

## Story

As a système,
I want exposer des endpoints pour lire et modifier le statut RSVP d'un invité,
so that le frontend puisse afficher et soumettre les réponses RSVP.

## Acceptance Criteria

1. **Given** un invité avec le slug `ah3kx9m2p7` en base
   **When** une requête GET arrive sur `/api/invite/ah3kx9m2p7`
   **Then** la réponse 200 contient les données de l'invité incluant:
   - status (pending | confirmed | declined)
   - personsConfirmed
   - maxPersons

2. **Given** un slug inexistant
   **When** une requête GET arrive sur `/api/invite/xyz123abcd`
   **Then** la réponse est 404 avec `{ error: "Invité non trouvé", code: "GUEST_NOT_FOUND" }`

3. **Given** un invité existant
   **When** une requête PUT arrive sur `/api/invite/[slug]/rsvp` avec:
   `{ status: "confirmed", personsConfirmed: 3 }`
   **Then** la réponse est 200, le statut et le nombre de personnes sont mis à jour en base

4. **Given** une requête PUT avec données invalides:
   personsConfirmed > 5 ou < 1
   **When** la validation Zod s'exécute
   **Then** la réponse est 400 avec `{ error: "Données invalides", code: "VALIDATION_ERROR" }`

5. **Given** un invité existant
   **When** une requête PUT arrive avec `{ status: "declined" }`
   **Then** le statut passe à "declined" et `personsConfirmed` est mis à 0

## Tasks / Subtasks

- [x] Task 1: Implement Zod RSVP validation schema (AC: #3, #4, #5)
  - [x] 1.1: Define `rsvpInputSchema` in `lib/schemas/rsvp.ts` with `status` enum (`confirmed` | `declined`) and `personsConfirmed` number (1-5, required when status = `confirmed`)
  - [x] 1.2: Add refinement: when `status === 'declined'`, `personsConfirmed` is ignored (set to 0 server-side)
  - [x] 1.3: Add refinement: when `status === 'confirmed'`, `personsConfirmed` is required and must be >= 1 and <= 5

- [x] Task 2: Add `updateGuestRsvp` query function (AC: #3, #5)
  - [x] 2.1: Add `updateGuestRsvp(slug, status, personsConfirmed)` to `lib/db/queries.ts`
  - [x] 2.2: Use `db.update(guests).set({ status, personsConfirmed }).where(eq(guests.slug, slug)).returning()` pattern
  - [x] 2.3: Return updated guest or null if slug not found

- [x] Task 3: Create GET `/api/invite/[slug]` route (AC: #1, #2)
  - [x] 3.1: Create `app/api/invite/[slug]/route.ts`
  - [x] 3.2: Export `GET` handler that uses `getGuestBySlug(slug)` (already exists in queries.ts)
  - [x] 3.3: Return 200 with guest data (camelCase JSON) if found
  - [x] 3.4: Return 404 with `{ error: "Invité non trouvé", code: "GUEST_NOT_FOUND" }` if not found
  - [x] 3.5: Wrap in try/catch returning 500 with `{ error: "Erreur serveur", code: "INTERNAL_ERROR" }`

- [x] Task 4: Create PUT `/api/invite/[slug]/rsvp` route (AC: #3, #4, #5)
  - [x] 4.1: Create `app/api/invite/[slug]/rsvp/route.ts`
  - [x] 4.2: Export `PUT` handler that parses request body with `rsvpInputSchema`
  - [x] 4.3: On Zod validation failure → return 400 with `{ error: "Données invalides", code: "VALIDATION_ERROR" }`
  - [x] 4.4: Check guest exists via `getGuestBySlug(slug)` → 404 if not found
  - [x] 4.5: When `status === 'declined'`, force `personsConfirmed = 0`
  - [x] 4.6: Call `updateGuestRsvp(slug, status, personsConfirmed)` and return 200 with updated guest
  - [x] 4.7: Wrap in try/catch returning 500

- [x] Task 5: Build + lint verification
  - [x] 5.1: `npm run build` passes
  - [x] 5.2: `npm run lint` passes

## Dev Notes

### Next.js 16 Route Handler Pattern

**CRITICAL**: In Next.js 16, `params` is a **Promise** — must be awaited. This matches the pattern already used in `page.tsx`:

```tsx
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  // ...
}
```

**Route handler exports**: Named exports `GET`, `PUT`, `POST`, `DELETE`, etc. from `route.ts` files.

**Important**: `route.ts` and `page.tsx` CANNOT coexist in the same route segment. The API routes go under `app/api/` prefix, the page is under `app/(guest)/`.

### Drizzle ORM Query Patterns

**Existing pattern** (from `lib/db/queries.ts`):
```typescript
import { eq } from 'drizzle-orm'
import { db } from './index'
import { guests, siteConfig } from './schema'

export async function getGuestBySlug(slug: string) {
  return db.query.guests.findFirst({
    where: eq(guests.slug, slug),
  })
}
```

**Update pattern** for RSVP:
```typescript
export async function updateGuestRsvp(
  slug: string,
  status: string,
  personsConfirmed: number
) {
  const result = await db
    .update(guests)
    .set({ status, personsConfirmed })
    .where(eq(guests.slug, slug))
    .returning()
  return result[0] ?? null
}
```

Note: The `updatedAt` column has `.$onUpdate(() => new Date())` in the schema, so it auto-updates — no need to set manually.

### Zod 4 Validation Pattern

**CRITICAL**: Project uses Zod **4.3.6** (NOT Zod 3). Breaking changes:
- Use `error` parameter instead of `message` for custom error messages
- Import from `zod` (same)

```typescript
import { z } from 'zod'

export const rsvpInputSchema = z.object({
  status: z.enum(['confirmed', 'declined']),
  personsConfirmed: z.number().int().min(1).max(5).optional(),
}).refine(
  (data) => data.status !== 'confirmed' || (data.personsConfirmed !== undefined && data.personsConfirmed >= 1),
  { error: 'personsConfirmed est requis pour une confirmation', path: ['personsConfirmed'] }
)
```

**Key detail**: `status` enum only accepts `confirmed` or `declined` (NOT `pending`) — the frontend should not be able to set a guest back to `pending`.

### Error Response Format (Standardized)

All API errors follow this format per architecture:
```typescript
return NextResponse.json(
  { error: "Message lisible", code: "ERROR_CODE" },
  { status: httpStatus }
)
```

**Error codes used in this story:**
| HTTP | Code | When |
|------|------|------|
| 200 | — | Success (GET guest, PUT RSVP) |
| 400 | `VALIDATION_ERROR` | Zod validation fails |
| 404 | `GUEST_NOT_FOUND` | Slug doesn't match any guest |
| 500 | `INTERNAL_ERROR` | Unexpected DB/server error |

### API Response Contract

**GET `/api/invite/[slug]`** — returns full guest object:
```typescript
{
  id: number
  slug: string
  firstName: string
  lastName: string
  groupName: string | null
  maxPersons: number
  status: 'pending' | 'confirmed' | 'declined'
  personsConfirmed: number
  createdAt: string  // ISO 8601
  updatedAt: string  // ISO 8601
}
```

**PUT `/api/invite/[slug]/rsvp`** — request body:
```typescript
{
  status: 'confirmed' | 'declined'
  personsConfirmed?: number  // required if status = 'confirmed', ignored if declined
}
```

**PUT response** — returns updated guest (same shape as GET).

### Database Schema (Existing — DO NOT MODIFY)

The `guests` table in `lib/db/schema.ts` already has all columns needed:
- `status: varchar('status', { length: 20 }).notNull().default('pending')` — stores RSVP status
- `personsConfirmed: integer('persons_confirmed').notNull().default(0)` — number of confirmed guests
- `maxPersons: integer('max_persons').notNull().default(1)` — admin-set ceiling
- `updatedAt` has `.$onUpdate(() => new Date())` — auto-updates on mutation

Types already exported: `Guest`, `NewGuest`

### Validation Business Rules

1. **Confirm**: `status = 'confirmed'` requires `personsConfirmed` ∈ [1, 5]
2. **Decline**: `status = 'declined'` → server forces `personsConfirmed = 0` (ignore client value)
3. **Status values**: Only `confirmed` and `declined` accepted via PUT (not `pending`)
4. **maxPersons ceiling**: Architecture mentions `maxPersons` as a ceiling, but the AC only validates 1-5 range. For MVP, validate `personsConfirmed` ∈ [1, 5]. Story 3.4 may refine to use `maxPersons` per-guest.

### Files to Create

| File | Action | Notes |
|------|--------|-------|
| `app/api/invite/[slug]/route.ts` | CREATE | GET handler — returns guest data |
| `app/api/invite/[slug]/rsvp/route.ts` | CREATE | PUT handler — updates RSVP |

### Files to Modify

| File | Action | Notes |
|------|--------|-------|
| `lib/schemas/rsvp.ts` | UPDATE | Replace placeholder with Zod validation schema |
| `lib/db/queries.ts` | ADD | Add `updateGuestRsvp()` function |

### Files NOT to Modify

| File | Reason |
|------|--------|
| `lib/db/schema.ts` | Schema already correct with all RSVP columns |
| `lib/db/index.ts` | DB connection already configured |
| `app/(guest)/invite/[slug]/page.tsx` | No changes needed — Stories 3.2-3.4 will add client components |
| `components/guest/*` | No visual changes in this story |
| `lib/constants.ts` | No new constants needed for API |

### Project Structure Notes

- First API routes in the project — creates `app/api/` directory tree
- Follows architecture: `app/api/invite/[slug]/route.ts` and `app/api/invite/[slug]/rsvp/route.ts`
- kebab-case file paths per project convention
- Server-side only — no `"use client"` needed
- `NextResponse` imported from `next/server`

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 3 Story 3.1] — AC and BDD criteria
- [Source: _bmad-output/planning-artifacts/architecture.md#API Routes] — Endpoint structure and patterns
- [Source: _bmad-output/planning-artifacts/architecture.md#Data Architecture] — DB schema, naming conventions
- [Source: _bmad-output/planning-artifacts/architecture.md#Validation] — Zod patterns, error format
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Phase 4 RSVP] — UX context for RSVP flow
- [Source: lib/db/queries.ts] — Existing query pattern (getGuestBySlug)
- [Source: lib/db/schema.ts] — Existing Drizzle schema with Guest type

### Previous Story Intelligence

**From Story 2.5 (done):**
- Next.js 16 params pattern: `params: Promise<{ slug: string }>` → must await
- Build passes cleanly with Next.js 16.1.6 + Turbopack
- `generateMetadata` export pattern established

**From Story 1.1 (done — foundational):**
- Drizzle ORM 0.45.1 with `drizzle-orm/neon-http` driver
- Zod **4.3.6** — use `error` param (NOT `message`)
- `getGuestBySlug()` already exists and returns full Guest type
- DB connection via `@neondatabase/serverless` neon HTTP
- nanoid custom alphabet for slugs (10 chars)

### Git Intelligence

Commit pattern: `feat: {story-key}`. Latest: `7504d5b feat: correction mineur de l'affichage`.

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — clean implementation.

### Completion Notes List

- Created `rsvpInputSchema` in `lib/schemas/rsvp.ts` using Zod 4 — validates `status` enum (`confirmed` | `declined`) and `personsConfirmed` (int, 1-5, optional). Refine ensures `personsConfirmed` is required when status = `confirmed`.
- Added `updateGuestRsvp(slug, status, personsConfirmed)` to `lib/db/queries.ts` — uses `db.update().set().where().returning()` pattern, returns updated guest or null
- Created `app/api/invite/[slug]/route.ts` — GET handler reuses existing `getGuestBySlug()`, returns 200 with guest data or 404 with `GUEST_NOT_FOUND`
- Created `app/api/invite/[slug]/rsvp/route.ts` — PUT handler validates body with Zod, checks guest exists, forces `personsConfirmed = 0` on decline, calls `updateGuestRsvp()`, returns 200 with updated guest
- All error responses follow standardized format: `{ error: string, code: string }`
- Next.js 16 params pattern used: `params: Promise<{ slug: string }>` with await
- First API routes in the project — `app/api/` directory created
- Build and lint pass clean
- Code review: fixed `request.json()` crash on malformed body (now returns 400 instead of 500)
- Code review: typed `updateGuestRsvp` status param as `Guest['status']` instead of `string`

### Change Log

- 2026-02-13: Implemented RSVP API endpoints (GET guest, PUT RSVP) with Zod validation
- 2026-02-13: Code review fixes — JSON parse error handling, stronger typing

### File List

- `lib/schemas/rsvp.ts` — Zod 4 RSVP input validation schema (replaced placeholder)
- `lib/db/queries.ts` — Added `updateGuestRsvp()` function
- `app/api/invite/[slug]/route.ts` — NEW: GET handler for guest data
- `app/api/invite/[slug]/rsvp/route.ts` — NEW: PUT handler for RSVP update
