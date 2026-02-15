# Story 4.4: Modification Manuelle du Statut RSVP

Status: done

## Story

As a admin (Ahmed ou Ghizlaine),
I want modifier le statut RSVP d'un invité manuellement,
so that je puisse corriger les erreurs ou enregistrer les confirmations reçues par téléphone.

## Acceptance Criteria

1. **Given** un invité dans la liste avec status "declined"
   **When** l'admin clique sur "Modifier" pour cet invité
   **Then** un formulaire d'édition s'ouvre avec le statut actuel et le nombre de personnes pré-remplis

2. **Given** le formulaire d'édition ouvert
   **When** l'admin change le statut en "confirmed" et le nombre à 2
   **Then** la mise à jour est sauvegardée (PUT `/api/admin/guests/[id]`) et la liste se rafraîchit avec les nouvelles données (FR25)

3. **Given** le formulaire d'édition
   **When** l'admin met un nombre de personnes > 5 ou < 0
   **Then** la validation Zod bloque la soumission avec un message d'erreur

4. **Given** la modification du statut
   **When** la requête est traitée
   **Then** le compteur du dashboard se met à jour

## Tasks / Subtasks

- [x] Task 1: Add Zod `guestUpdateSchema` to `lib/schemas/guest.ts` (AC: #2, #3)
  - [x] 1.1: Create `guestUpdateSchema` with `z.object({ status: z.enum(['pending', 'confirmed', 'declined']), personsConfirmed: z.number().int().min(0).max(5) })`
  - [x] 1.2: Export `GuestUpdateInput` type

- [x] Task 2: Add `updateGuest(id, data)` query to `lib/db/queries.ts` (AC: #2)
  - [x] 2.1: `updateGuest(id: number, data: GuestUpdateInput)` — update by id, set status + personsConfirmed, return updated guest with `.returning()`
  - [x] 2.2: Return `null` if guest not found (empty `.returning()`)

- [x] Task 3: Add `PUT` handler to `app/api/admin/guests/[id]/route.ts` (AC: #2, #3)
  - [x] 3.1: Auth check via cookie (same pattern as existing DELETE)
  - [x] 3.2: Await params, parse `id` (Next.js 16 pattern)
  - [x] 3.3: Parse body with `guestUpdateSchema.safeParse()`, on error → 400
  - [x] 3.4: Call `updateGuest(id, data)`, return 200 `{ guest }` or 404 if not found

- [x] Task 4: Create `components/admin/edit-guest-dialog.tsx` (AC: #1, #2, #3)
  - [x] 4.1: Client Component with Dialog + form (statut select, nombre de personnes input)
  - [x] 4.2: Pre-fill form with current guest status and personsConfirmed
  - [x] 4.3: Client-side Zod validation before submit
  - [x] 4.4: On success → close dialog + `router.refresh()` to update dashboard

- [x] Task 5: Create `components/admin/edit-guest-button.tsx` (AC: #1)
  - [x] 5.1: Client Component wrapper managing dialog open state (same pattern as `DeleteGuestButton`)
  - [x] 5.2: Button text "Modifier", styled with gold-moroccan color

- [x] Task 6: Integrate edit button into dashboard (AC: #1, #4)
  - [x] 6.1: Add `EditGuestButton` in `guest-table.tsx` Actions column (before DeleteGuestButton)
  - [x] 6.2: Add `EditGuestButton` in `guest-card.tsx` card footer (before DeleteGuestButton)
  - [x] 6.3: Pass full guest object to EditGuestButton for pre-fill data

- [x] Task 7: Build + lint verification
  - [x] 7.1: `npm run build` passes
  - [x] 7.2: `npm run lint` passes

## Dev Notes

### Existing Infrastructure

| File | Status | Notes |
|------|--------|-------|
| `lib/db/schema.ts` | READY | `guests` table with status varchar(20), personsConfirmed integer |
| `lib/db/queries.ts` | EXTEND | Add `updateGuest` by id (existing `updateGuestRsvp` uses slug) |
| `lib/schemas/guest.ts` | EXTEND | Add `guestUpdateSchema` alongside existing `guestCreateSchema` |
| `app/api/admin/guests/[id]/route.ts` | EXTEND | Add PUT handler alongside existing DELETE |
| `components/ui/dialog.tsx` | READY | shadcn Dialog with all sub-components |
| `components/ui/input.tsx` | READY | shadcn Input component |
| `components/admin/delete-guest-button.tsx` | REFERENCE | Pattern to follow for EditGuestButton |
| `components/admin/delete-guest-dialog.tsx` | REFERENCE | Dialog pattern to follow |

### Admin Layout Rule

**Ne pas** utiliser `max-w-*` sur les composants admin. Le layout admin gère la largeur via padding (`px-4 sm:px-8`). Les composants internes prennent `w-full`.

### Validation Rules (AC #3)

```typescript
// lib/schemas/guest.ts — ADD to existing file
export const guestUpdateSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'declined'], {
    errorMap: () => ({ message: 'Statut invalide' }),
  }),
  personsConfirmed: z
    .number()
    .int()
    .min(0, 'Le nombre de personnes doit être au moins 0')
    .max(5, 'Le nombre de personnes ne peut pas dépasser 5'),
})

export type GuestUpdateInput = z.infer<typeof guestUpdateSchema>
```

### Query Pattern

```typescript
// lib/db/queries.ts — ADD (similar to updateGuestRsvp but by id)
export async function updateGuest(id: number, data: GuestUpdateInput) {
  const result = await db
    .update(guests)
    .set({ status: data.status, personsConfirmed: data.personsConfirmed })
    .where(eq(guests.id, id))
    .returning()
  return result[0] ?? null
}
```

### PUT Handler Pattern

```typescript
// Add to app/api/admin/guests/[id]/route.ts alongside DELETE
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Same auth check + id parsing as DELETE
  // Parse body with guestUpdateSchema.safeParse()
  // Call updateGuest(id, data)
  // Return 200 { guest } or 404
}
```

### Edit Dialog Form Fields

- **Statut**: `<select>` with 3 options — "En attente" (pending), "Confirmé" (confirmed), "Décliné" (declined)
- **Nombre de personnes**: `<input type="number">` with min=0, max=5
- Buttons: "Annuler" (secondary) + "Sauvegarder" (primary gold `bg-gold-moroccan text-white`)

### Form Styling (Admin)

- Labels: above field, text-sm, text-brown-medium
- Inputs/Selects: border-brown-medium/30, bg-white-broken, focus:border-gold-moroccan
- Errors: text-sm text-red-soft below field
- Select styling: same as input (border, bg, focus)

### Button Wrapper Pattern (from Story 4.3)

```typescript
// edit-guest-button.tsx — thin Client Component wrapper
'use client'
import { useState } from 'react'
import { EditGuestDialog } from './edit-guest-dialog'
import { type Guest } from '@/lib/db/schema'

interface EditGuestButtonProps {
  guest: Guest  // full guest for pre-fill
}

export function EditGuestButton({ guest }: EditGuestButtonProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} className="text-xs text-gold-moroccan ...">
        Modifier
      </button>
      <EditGuestDialog open={open} onOpenChange={setOpen} guest={guest} />
    </>
  )
}
```

### Dashboard Refresh Pattern

After update, call `router.refresh()` from Client Component. This re-fetches server data without full page navigation — `getAllGuests()` reruns, counter updates automatically (AC #4).

### Files to Create

| File | Action | Notes |
|------|--------|-------|
| `components/admin/edit-guest-dialog.tsx` | CREATE | Edit form in Dialog |
| `components/admin/edit-guest-button.tsx` | CREATE | Client wrapper for edit dialog state |

### Files to Modify

| File | Action | Notes |
|------|--------|-------|
| `lib/schemas/guest.ts` | EXTEND | Add guestUpdateSchema |
| `lib/db/queries.ts` | EXTEND | Add updateGuest(id, data) |
| `app/api/admin/guests/[id]/route.ts` | EXTEND | Add PUT handler |
| `components/admin/guest-table.tsx` | MODIFY | Add EditGuestButton in Actions column |
| `components/admin/guest-card.tsx` | MODIFY | Add EditGuestButton in card footer |

### Files NOT to Modify

| File | Reason |
|------|--------|
| `lib/db/schema.ts` | Schema already complete |
| `lib/utils.ts` | Utilities complete |
| `lib/auth.ts` | Auth functions already implemented |
| `middleware.ts` | Route protection already configured |
| `components/ui/*` | shadcn components — don't modify |
| `components/admin/summary-counter.tsx` | Counter recalculates from props — no change needed |
| `components/admin/guest-list.tsx` | Wrapper unchanged — passes guests prop through |
| `components/admin/status-badge.tsx` | Unchanged |
| `components/admin/copy-link-button.tsx` | Unchanged |
| `components/admin/add-guest-dialog.tsx` | Unchanged |
| `components/admin/add-guest-button.tsx` | Unchanged |
| `components/admin/delete-guest-dialog.tsx` | Unchanged |
| `components/admin/delete-guest-button.tsx` | Unchanged |
| `app/(admin)/admin/page.tsx` | Dashboard page unchanged — already has GuestList |

### Accessibility

- Dialog: focus trap (Radix Dialog handles this), `DialogTitle` + `DialogDescription`
- Form: `<label>` + `<select>`/`<input>` with `htmlFor`/`id`, error messages visible
- Select: native HTML select for accessibility (no custom dropdown)
- Touch targets: 44x44px minimum on all buttons

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 4 Story 4.4] — AC and BDD criteria (FR25)
- [Source: _bmad-output/planning-artifacts/architecture.md#API Patterns] — PUT /api/admin/guests/[id]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Admin Forms] — Dialog, validation, button hierarchy
- [Source: lib/db/queries.ts] — existing query patterns, updateGuestRsvp as reference
- [Source: lib/db/schema.ts] — guests table, Guest type
- [Source: app/api/admin/guests/[id]/route.ts] — existing DELETE handler + auth pattern
- [Source: components/admin/delete-guest-button.tsx] — button wrapper pattern
- [Source: components/admin/delete-guest-dialog.tsx] — dialog pattern

### Previous Story Intelligence

**From Story 4.3 (Ajout & Suppression d'Invités):**
- `DeleteGuestButton` / `DeleteGuestDialog` — exact pattern for EditGuestButton / EditGuestDialog
- Thin Client Component wrapper manages dialog state, separate from dialog logic
- `router.refresh()` pattern for refreshing Server Component data from Client Components
- Admin form styling: labels text-sm text-brown-medium, inputs border-brown-medium/30 bg-white-broken focus:border-gold-moroccan
- No `max-w-*` on any component (user rule)

### Git Intelligence

Commit pattern: `feat: {story-key}`. Latest: `feat: 4-3-ajout-suppression-invites`.

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Build failure: `z.enum()` with `errorMap` not supported in project's Zod version → fixed with `message` parameter

### Completion Notes List

- All 7 tasks completed — manual RSVP status modification fully functional
- `guestUpdateSchema` validates status enum (pending/confirmed/declined) and personsConfirmed (0-5)
- Used `message` instead of `errorMap` for `z.enum()` — compatible with project's Zod version
- `updateGuest(id, data)` query updates by id (unlike existing `updateGuestRsvp` which uses slug)
- PUT handler added alongside existing DELETE in `[id]/route.ts` with same auth + id validation pattern
- `EditGuestDialog`: form with native `<select>` for status + `<input type="number">` for persons, pre-filled with current values
- `EditGuestButton` follows same thin Client Component wrapper pattern as `DeleteGuestButton`
- Both table and card views have "Modifier" button (gold) before "Supprimer" button (red)
- `router.refresh()` after successful update — counter auto-updates (AC #4)
- No `max-w-*` used anywhere (user rule)
- `npm run build` and `npm run lint` both pass clean

### Change Log

| File | Action | Description |
|------|--------|-------------|
| `lib/schemas/guest.ts` | MODIFIED | Added guestUpdateSchema (status enum + personsConfirmed 0-5) |
| `lib/db/queries.ts` | MODIFIED | Added updateGuest(id, data) function |
| `app/api/admin/guests/[id]/route.ts` | MODIFIED | Added PUT handler alongside existing DELETE |
| `components/admin/edit-guest-dialog.tsx` | CREATED | Edit form dialog with pre-filled status + persons |
| `components/admin/edit-guest-button.tsx` | CREATED | Client wrapper for edit dialog state |
| `components/admin/guest-table.tsx` | MODIFIED | Added EditGuestButton in Actions column |
| `components/admin/guest-card.tsx` | MODIFIED | Added EditGuestButton in card footer |

### File List

- `lib/schemas/guest.ts`
- `lib/db/queries.ts`
- `app/api/admin/guests/[id]/route.ts`
- `components/admin/edit-guest-dialog.tsx`
- `components/admin/edit-guest-button.tsx`
- `components/admin/guest-table.tsx`
- `components/admin/guest-card.tsx`
