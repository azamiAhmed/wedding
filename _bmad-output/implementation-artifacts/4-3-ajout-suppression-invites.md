# Story 4.3: Ajout & Suppression d'Invités

Status: done

## Story

As a admin (Ahmed ou Ghizlaine),
I want ajouter de nouveaux invités et supprimer ceux qui ne sont plus concernés,
so that je puisse constituer et maintenir ma liste d'invités à jour.

## Acceptance Criteria

1. **Given** l'admin sur le dashboard
   **When** il clique sur "Ajouter un invité"
   **Then** un formulaire (Dialog shadcn/ui) s'ouvre avec les champs : prénom, nom, groupe (optionnel), nombre max de personnes (défaut 1)

2. **Given** le formulaire rempli avec prénom "Fatima" et nom "Azami"
   **When** l'admin soumet (POST `/api/admin/guests`)
   **Then** un slug unique est généré (nanoid 10 chars), l'invité est créé en base avec status "pending", et le lien unique complet est affiché pour copie (FR23, FR9)

3. **Given** le formulaire soumis avec un prénom vide
   **When** la validation Zod s'exécute
   **Then** une erreur de validation s'affiche côté client avant l'envoi

4. **Given** un invité dans la liste
   **When** l'admin clique sur "Supprimer" et confirme dans le dialog de confirmation
   **Then** l'invité est supprimé de la base (DELETE `/api/admin/guests/[id]`) et disparaît de la liste (FR24)

5. **Given** la suppression d'un invité
   **When** la requête est traitée
   **Then** le compteur du dashboard se met à jour automatiquement

## Tasks / Subtasks

- [x] Task 1: Create Zod schema `lib/schemas/guest.ts` (AC: #2, #3)
  - [x] 1.1: Create `guestCreateSchema` with `z.object({ firstName: z.string().min(1), lastName: z.string().min(1), groupName: z.string().optional(), maxPersons: z.number().int().min(1).max(10).default(1) })`
  - [x] 1.2: Export `GuestCreateInput` type

- [x] Task 2: Add DB queries `createGuest` and `deleteGuest` to `lib/db/queries.ts` (AC: #2, #4)
  - [x] 2.1: `createGuest(data)` — generate slug via `generateSlug()`, insert into guests, return created guest with `.returning()`
  - [x] 2.2: `deleteGuest(id: number)` — delete by id, return deleted guest with `.returning()` (null if not found)

- [x] Task 3: Add `POST` handler to `app/api/admin/guests/route.ts` (AC: #2, #3)
  - [x] 3.1: Auth check via cookie (same pattern as existing GET)
  - [x] 3.2: Parse body with `guestCreateSchema.safeParse()`, on error → 400
  - [x] 3.3: Call `createGuest()`, return 201 `{ guest, link }` where link = full URL `/invite/{slug}`

- [x] Task 4: Create `DELETE /api/admin/guests/[id]` route handler (AC: #4)
  - [x] 4.1: Create `app/api/admin/guests/[id]/route.ts`
  - [x] 4.2: Auth check via cookie
  - [x] 4.3: Parse `id` from params (await params — Next.js 16 pattern)
  - [x] 4.4: Call `deleteGuest(id)`, return 200 `{ success: true }` or 404 if not found

- [x] Task 5: Create `components/admin/add-guest-dialog.tsx` (AC: #1, #2, #3)
  - [x] 5.1: Client Component with Dialog + form (prénom, nom, groupe, max personnes)
  - [x] 5.2: Client-side Zod validation before submit
  - [x] 5.3: On success → show created invite link with copy button
  - [x] 5.4: On close → reset form + call `router.refresh()` to update dashboard data

- [x] Task 6: Create `components/admin/delete-guest-dialog.tsx` (AC: #4, #5)
  - [x] 6.1: Client Component with confirmation Dialog
  - [x] 6.2: Show guest name in confirmation message
  - [x] 6.3: "Annuler" (secondary) + "Supprimer" (destructive red) buttons
  - [x] 6.4: On confirm → DELETE API call, on success → `router.refresh()`

- [x] Task 7: Integrate dialogs into dashboard (AC: #1, #4, #5)
  - [x] 7.1: Add "Ajouter un invité" button on dashboard page
  - [x] 7.2: Add delete action to guest table rows and mobile cards
  - [x] 7.3: `router.refresh()` after add/delete refreshes Server Component data (counter updates automatically)

- [x] Task 8: Build + lint verification
  - [x] 8.1: `npm run build` passes
  - [x] 8.2: `npm run lint` passes

## Dev Notes

### Existing Infrastructure

| File | Status | Notes |
|------|--------|-------|
| `lib/db/schema.ts` | READY | `guests` table with `NewGuest` type, slug varchar(10) |
| `lib/db/queries.ts` | EXTEND | Add `createGuest`, `deleteGuest` |
| `lib/utils.ts` | READY | `generateSlug` already exists — `customAlphabet(alphabet, 10)` with safe chars |
| `app/api/admin/guests/route.ts` | EXTEND | Add POST handler alongside existing GET |
| `components/ui/dialog.tsx` | READY | shadcn Dialog with all sub-components |
| `components/ui/input.tsx` | READY | shadcn Input component |
| `components/ui/button.tsx` | READY | shadcn Button component |
| `components/admin/copy-link-button.tsx` | READY | Clipboard copy pattern from Story 4.2 |

### Admin Layout Rule

**Ne pas** utiliser `max-w-sm` / `max-w-md` sur les composants admin. Le layout admin gère déjà la largeur (`max-w-4xl`). Les composants internes prennent `w-full`.

### Slug Generation

```typescript
// lib/utils.ts — ALREADY EXISTS, do NOT recreate
import { customAlphabet } from 'nanoid'
const alphabet = 'abcdefghjkmnpqrstuvwxyz23456789'
export const generateSlug = customAlphabet(alphabet, 10)
```

### Query Patterns

```typescript
// CREATE — insert + return
export async function createGuest(data: GuestCreateInput) {
  const slug = generateSlug()
  const result = await db
    .insert(guests)
    .values({ ...data, slug })
    .returning()
  return result[0]
}

// DELETE — delete by id + return deleted
export async function deleteGuest(id: number) {
  const result = await db
    .delete(guests)
    .where(eq(guests.id, id))
    .returning()
  return result[0] ?? null
}
```

### API Auth Pattern (reuse from Story 4.2)

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

### Next.js 16 Route Params

```typescript
// Route handlers must await params in Next.js 16
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  // ...
}
```

### Dashboard Refresh Pattern

After add/delete, call `router.refresh()` from Client Components. This re-fetches server data without full page navigation — `getAllGuests()` reruns, counter updates automatically.

### Destructive Button Styling

Per UX spec, delete button uses: `bg-red-soft text-white` (rouge doux #C45B4A). Confirmation dialog: "Annuler" secondary + "Supprimer" destructive.

### Form Styling (Admin)

- Labels: above field, text-sm, text-brown-medium
- Inputs: border-brown-medium/30, bg-white-broken, focus:border-gold-moroccan
- Errors: text-sm text-red-soft below field
- No asterisks on required fields (all displayed fields are required)

### Files to Create

| File | Action | Notes |
|------|--------|-------|
| `lib/schemas/guest.ts` | CREATE | Zod guestCreateSchema |
| `app/api/admin/guests/[id]/route.ts` | CREATE | DELETE handler |
| `components/admin/add-guest-dialog.tsx` | CREATE | Add guest form in Dialog |
| `components/admin/delete-guest-dialog.tsx` | CREATE | Confirmation dialog |

### Files to Modify

| File | Action | Notes |
|------|--------|-------|
| `lib/db/queries.ts` | EXTEND | Add createGuest, deleteGuest |
| `app/api/admin/guests/route.ts` | EXTEND | Add POST handler |
| `app/(admin)/admin/page.tsx` | MODIFY | Add button + integrate dialogs |
| `components/admin/guest-table.tsx` | MODIFY | Add delete action column |
| `components/admin/guest-card.tsx` | MODIFY | Add delete action |

### Files NOT to Modify

| File | Reason |
|------|--------|
| `lib/db/schema.ts` | Schema already complete |
| `lib/utils.ts` | generateSlug already exists |
| `lib/auth.ts` | Auth functions already implemented |
| `middleware.ts` | Route protection already configured |
| `components/ui/*` | shadcn components — don't modify |
| `components/admin/summary-counter.tsx` | Counter recalculates from props — no change needed |
| `components/admin/guest-list.tsx` | Wrapper unchanged — passes guests prop through |
| `components/admin/status-badge.tsx` | Unchanged |
| `components/admin/copy-link-button.tsx` | Unchanged |

### Accessibility

- Dialog: focus trap (Radix Dialog handles this), `DialogTitle` + `DialogDescription`
- Form: `<label>` + `<input>` with `htmlFor`/`id`, error messages visible
- Delete confirmation: clear warning text, two distinct buttons
- Touch targets: 44x44px minimum on all buttons

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 4 Story 4.3] — AC and BDD criteria (FR23, FR24, FR9)
- [Source: _bmad-output/planning-artifacts/architecture.md#API Patterns] — POST /api/admin/guests, DELETE /api/admin/guests/[id]
- [Source: _bmad-output/planning-artifacts/architecture.md#Slugs] — nanoid 10 chars, custom alphabet
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Admin Forms] — Dialog, validation, destructive buttons
- [Source: lib/utils.ts] — generateSlug already implemented
- [Source: lib/db/schema.ts] — guests table, NewGuest type
- [Source: lib/db/queries.ts] — existing query patterns
- [Source: app/api/admin/guests/route.ts] — existing GET handler + auth pattern

### Previous Story Intelligence

**From Story 4.2 (Dashboard & Liste des Invités):**
- `getAllGuests()` returns sorted guests — dashboard page uses direct DB query (not API)
- `StatusBadge`, `CopyLinkButton` are reusable helpers
- Responsive: table desktop / cards mobile via Tailwind `hidden md:block`
- `GuestList` handles empty state
- `router.refresh()` pattern for refreshing Server Component data from Client Components

### Git Intelligence

Commit pattern: `feat: {story-key}`. Latest: `6eb1813 feat: 4-1-authentification-admin`.

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

N/A

### Completion Notes List

- All 8 tasks completed — guest CRUD fully functional
- `guestCreateSchema` with validation messages in French
- `createGuest()` reuses existing `generateSlug()` from `lib/utils.ts`
- `deleteGuest()` returns deleted guest or null for 404 handling
- POST handler returns 201 with `{ guest, link }` — link is relative path
- DELETE handler awaits params (Next.js 16 pattern), validates id is numeric
- `AddGuestDialog`: form → success view with full invite link + copy button, resets on close
- `DeleteGuestDialog`: confirmation with guest name, "Annuler" + "Supprimer" (red) buttons
- `AddGuestButton` / `DeleteGuestButton` as thin Client Component wrappers for state management
- Both dialogs call `router.refresh()` to update Server Component data (counter auto-updates)
- `npm run build` and `npm run lint` both pass clean

### Change Log

| File | Action | Description |
|------|--------|-------------|
| `lib/schemas/guest.ts` | REPLACED | Zod guestCreateSchema replacing placeholder |
| `lib/db/queries.ts` | MODIFIED | Added createGuest + deleteGuest functions |
| `app/api/admin/guests/route.ts` | MODIFIED | Added POST handler alongside existing GET |
| `app/api/admin/guests/[id]/route.ts` | CREATED | DELETE handler with auth + id validation |
| `components/admin/add-guest-dialog.tsx` | CREATED | Form dialog with success view + copy link |
| `components/admin/add-guest-button.tsx` | CREATED | Client wrapper for add dialog state |
| `components/admin/delete-guest-dialog.tsx` | CREATED | Confirmation dialog with destructive action |
| `components/admin/delete-guest-button.tsx` | CREATED | Client wrapper for delete dialog state |
| `components/admin/guest-table.tsx` | MODIFIED | Added Actions column with delete button |
| `components/admin/guest-card.tsx` | MODIFIED | Added delete button in card footer |
| `app/(admin)/admin/page.tsx` | MODIFIED | Added AddGuestButton in header |

### File List

- `lib/schemas/guest.ts`
- `lib/db/queries.ts`
- `app/api/admin/guests/route.ts`
- `app/api/admin/guests/[id]/route.ts`
- `components/admin/add-guest-dialog.tsx`
- `components/admin/add-guest-button.tsx`
- `components/admin/delete-guest-dialog.tsx`
- `components/admin/delete-guest-button.tsx`
- `components/admin/guest-table.tsx`
- `components/admin/guest-card.tsx`
- `app/(admin)/admin/page.tsx`
