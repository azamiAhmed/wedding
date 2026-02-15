# Story 4.2: Dashboard & Liste des Invités

Status: done

## Story

As a admin (Ahmed ou Ghizlaine),
I want voir la liste complète des invités avec leurs statuts et un compteur de confirmations,
so that je puisse suivre l'avancement des réponses en un coup d'œil.

## Acceptance Criteria

1. **Given** un admin authentifié sur `/admin`
   **When** le dashboard se charge
   **Then** un compteur résumé affiche "X confirmés / Y invités (Z personnes au total)"

2. **Given** le dashboard chargé
   **When** la liste des invités s'affiche (GET `/api/admin/guests`)
   **Then** un shadcn/ui Table montre pour chaque invité : nom complet, statut (Badge coloré : vert=confirmed, orange=pending, rouge=declined), nombre de personnes confirmées, lien unique

3. **Given** la liste des invités
   **When** elle s'affiche par défaut
   **Then** les invités sont triés par nom de famille (alphabétique)

4. **Given** le dashboard sur mobile
   **When** l'écran est petit (< 768px)
   **Then** les données sont affichées en cards empilées (pas de table horizontale)

## Tasks / Subtasks

- [x] Task 1: Create `GET /api/admin/guests` route handler (AC: #2)
  - [x] 1.1: Create `app/api/admin/guests/route.ts` with GET handler
  - [x] 1.2: Validate admin session via `admin_token` cookie (reuse `validateSession` from `lib/auth.ts`)
  - [x] 1.3: Query all guests from DB, sorted by `last_name` ASC then `first_name` ASC
  - [x] 1.4: Return JSON `{ guests: Guest[] }` with 200, or 401 if unauthorized

- [x] Task 2: Add `getAllGuests` query to `lib/db/queries.ts` (AC: #2, #3)
  - [x] 2.1: Add `getAllGuests()` function: `db.select().from(guests).orderBy(asc(guests.lastName), asc(guests.firstName))`
  - [x] 2.2: Import `asc` from `drizzle-orm`

- [x] Task 3: Create `components/admin/guest-table.tsx` — Desktop table view (AC: #2)
  - [x] 3.1: Server Component using shadcn/ui `Table`, `TableHeader`, `TableRow`, `TableHead`, `TableBody`, `TableCell`
  - [x] 3.2: Columns: Nom complet (`lastName firstName`), Statut (Badge), Personnes confirmées, Lien unique
  - [x] 3.3: Status Badge: `variant` mapping — confirmed→green, pending→orange, declined→red (use custom className on Badge)
  - [x] 3.4: Lien unique: display `/invite/{slug}` with copy button (clipboard)

- [x] Task 4: Create `components/admin/guest-card.tsx` — Mobile card view (AC: #4)
  - [x] 4.1: Server Component for mobile card display
  - [x] 4.2: Card layout: nom complet, statut badge, personnes, lien
  - [x] 4.3: Same info as table but stacked vertically

- [x] Task 5: Create `components/admin/summary-counter.tsx` (AC: #1)
  - [x] 5.1: Server Component displaying "X confirmés / Y invités (Z personnes au total)"
  - [x] 5.2: X = count of guests with status `confirmed`, Y = total guest count, Z = sum of `personsConfirmed` for confirmed guests
  - [x] 5.3: Styling: font-sans, text-brown-deep, prominent numbers

- [x] Task 6: Create `components/admin/guest-list.tsx` — Responsive wrapper (AC: #2, #4)
  - [x] 6.1: Client Component with responsive switching
  - [x] 6.2: Desktop (≥768px): render `GuestTable`
  - [x] 6.3: Mobile (<768px): render `GuestCard` list
  - [x] 6.4: Use media query or Tailwind responsive classes (hidden/block)

- [x] Task 7: Update admin dashboard page `app/(admin)/admin/page.tsx` (AC: #1, #2)
  - [x] 7.1: Replace placeholder content with actual dashboard
  - [x] 7.2: Fetch guests via `getAllGuests()` server-side (no API call from page — direct DB query)
  - [x] 7.3: Render `SummaryCounter` + `GuestList` with guests data passed as props
  - [x] 7.4: Handle empty state: "Aucun invité" message with context

- [x] Task 8: Build + lint verification
  - [x] 8.1: `npm run build` passes
  - [x] 8.2: `npm run lint` passes

## Dev Notes

### Existing Infrastructure

| File | Status | Notes |
|------|--------|-------|
| `lib/db/schema.ts` | READY | `guests` table: id, slug, firstName, lastName, groupName, maxPersons, status, personsConfirmed, createdAt, updatedAt |
| `lib/db/queries.ts` | EXTEND | Has `getGuestBySlug`, `getSiteConfig`, `updateGuestRsvp` — add `getAllGuests` |
| `lib/auth.ts` | READY | `requireAdmin()` + `validateSession()` from Story 4.1 |
| `middleware.ts` | READY | Protects `/admin` and `/admin/*` (except `/admin/login`) |
| `components/ui/table.tsx` | READY | shadcn/ui Table components installed |
| `components/ui/badge.tsx` | READY | shadcn/ui Badge component installed |
| `app/(admin)/admin/page.tsx` | MODIFY | Replace placeholder with dashboard |
| `app/(admin)/layout.tsx` | READY | `max-w-4xl mx-auto px-4 sm:px-8 py-8 font-sans` |

### Admin Layout Rule

**Ne pas** utiliser `max-w-sm` / `max-w-md` sur les composants admin. Le layout admin gère déjà la largeur (`max-w-4xl`). Les composants internes prennent `w-full`.

### Dashboard Page Pattern

The dashboard page is a **Server Component**. It calls `requireAdmin()` for auth, then queries DB directly with `getAllGuests()` — no need for a client-side fetch to the API. The API route (`GET /api/admin/guests`) exists for potential future client-side use (e.g., real-time refresh).

```typescript
// app/(admin)/admin/page.tsx pattern
import { requireAdmin } from '@/lib/auth'
import { getAllGuests } from '@/lib/db/queries'

export default async function AdminDashboardPage() {
  await requireAdmin()
  const guests = await getAllGuests()
  // render SummaryCounter + GuestList with guests
}
```

### API Auth Pattern (for route handler)

```typescript
// Admin API route auth pattern (reuse from Story 4.1)
import { cookies } from 'next/headers'
import { validateSession } from '@/lib/auth'

const cookieStore = await cookies()
const token = cookieStore.get('admin_token')?.value
if (!token || !(await validateSession(token))) {
  return NextResponse.json({ error: 'Non autorisé', code: 'UNAUTHORIZED' }, { status: 401 })
}
```

### Status Badge Styling

| Status | Color | Badge Class |
|--------|-------|-------------|
| confirmed | Vert | `bg-green-olive/15 text-green-olive border-green-olive/30` |
| pending | Orange/Jaune | `bg-gold-moroccan/15 text-gold-moroccan border-gold-moroccan/30` |
| declined | Rouge | `bg-red-soft/15 text-red-soft border-red-soft/30` |

Use Badge `variant="outline"` + custom `className` overrides for each status.

### Responsive Strategy

- **Desktop (≥768px)**: shadcn `Table` component with columns
- **Mobile (<768px)**: Cards empilées avec les mêmes données
- Implementation: Use Tailwind `hidden md:block` / `block md:hidden` for responsive switching (no JS needed)

### Copy Link Pattern

```typescript
// Copy invite link to clipboard
function copyLink(slug: string) {
  const url = `${window.location.origin}/invite/${slug}`
  navigator.clipboard.writeText(url)
}
```

Needs a Client Component wrapper or a small client button for the copy action.

### Query Pattern

```typescript
// getAllGuests — sorted by last name then first name
import { asc } from 'drizzle-orm'

export async function getAllGuests() {
  return db.select().from(guests).orderBy(asc(guests.lastName), asc(guests.firstName))
}
```

### Files to Create

| File | Action | Notes |
|------|--------|-------|
| `app/api/admin/guests/route.ts` | CREATE | GET handler — list all guests with auth check |
| `components/admin/guest-table.tsx` | CREATE | Desktop table view with shadcn Table + Badge |
| `components/admin/guest-card.tsx` | CREATE | Mobile card view |
| `components/admin/summary-counter.tsx` | CREATE | "X confirmés / Y invités (Z personnes)" |
| `components/admin/guest-list.tsx` | CREATE | Responsive wrapper (table vs cards) |

### Files to Modify

| File | Action | Notes |
|------|--------|-------|
| `lib/db/queries.ts` | EXTEND | Add `getAllGuests()` |
| `app/(admin)/admin/page.tsx` | REPLACE | Replace placeholder with dashboard content |

### Files NOT to Modify

| File | Reason |
|------|--------|
| `lib/db/schema.ts` | Schema already complete |
| `lib/auth.ts` | Auth functions already implemented |
| `middleware.ts` | Route protection already configured |
| `components/ui/*` | shadcn components — don't modify |
| `app/(admin)/layout.tsx` | Layout already styled |
| `components/guest/*` | Guest components not affected |

### Accessibility

- Table: proper `<thead>`, `<th>`, `<tbody>` semantics (shadcn Table handles this)
- Badge: status text visible (not color-only) — each badge shows "Confirmé", "En attente", "Décliné"
- Copy button: `aria-label="Copier le lien d'invitation"`
- Empty state: informative message, not just blank
- Mobile cards: semantic list structure

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 4 Story 4.2] — AC and BDD criteria (FR22, FR26)
- [Source: _bmad-output/planning-artifacts/architecture.md#Data Architecture] — guests table schema
- [Source: _bmad-output/planning-artifacts/architecture.md#API Patterns] — GET /api/admin/guests endpoint
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Patterns] — guest-table Server Component
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Admin Dashboard] — Counter + Table + Badge + Cards mobile
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Responsive] — Mobile cards, Desktop table
- [Source: lib/db/schema.ts] — guests table definition
- [Source: lib/db/queries.ts] — existing query patterns
- [Source: components/ui/table.tsx] — shadcn Table already installed
- [Source: components/ui/badge.tsx] — shadcn Badge already installed

### Previous Story Intelligence

**From Story 4.1 (Authentification Admin):**
- `requireAdmin()` pattern: call at top of Server Component pages
- API auth: read cookie + validateSession in route handlers
- Error format: `{ error: string, code: string }` with HTTP status codes
- Client Components: `"use client"`, `useState`, `fetch()` for API calls
- Admin layout applies `max-w-4xl mx-auto` — components go `w-full`
- Drizzle patterns: `db.query.table.findFirst()`, `db.select().from()`, `.returning()`

### Git Intelligence

Commit pattern: `feat: {story-key}`. Latest: `6eb1813 feat: 4-1-authentification-admin`.

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

N/A

### Completion Notes List

- All 8 tasks completed — admin dashboard with guest list fully functional
- `getAllGuests()` query added to `lib/db/queries.ts` — sorted by lastName then firstName
- API route `GET /api/admin/guests` with cookie-based auth validation
- Summary counter calculates confirmed/total/persons from guest data
- `StatusBadge` helper component for consistent badge coloring across table + cards
- `CopyLinkButton` Client Component for clipboard copy of invite links
- Responsive: desktop uses shadcn Table, mobile uses stacked cards — via Tailwind `hidden md:block`
- `GuestList` renders both views with empty state handling
- Dashboard page is Server Component: `requireAdmin()` → `getAllGuests()` → render
- `npm run build` and `npm run lint` both pass clean

### Change Log

| File | Action | Description |
|------|--------|-------------|
| `lib/db/queries.ts` | MODIFIED | Added `getAllGuests()` with `asc` import |
| `app/api/admin/guests/route.ts` | CREATED | GET handler with cookie auth + getAllGuests |
| `components/admin/summary-counter.tsx` | CREATED | Counter: X confirmés / Y invités (Z personnes) |
| `components/admin/status-badge.tsx` | CREATED | Reusable status Badge with color mapping |
| `components/admin/copy-link-button.tsx` | CREATED | Client Component — clipboard copy for invite links |
| `components/admin/guest-table.tsx` | CREATED | Desktop table view with shadcn Table + Badge |
| `components/admin/guest-card.tsx` | CREATED | Mobile card view with stacked layout |
| `components/admin/guest-list.tsx` | CREATED | Responsive wrapper — table vs cards via Tailwind |
| `app/(admin)/admin/page.tsx` | REPLACED | Dashboard with SummaryCounter + GuestList |

### File List

- `lib/db/queries.ts`
- `app/api/admin/guests/route.ts`
- `components/admin/summary-counter.tsx`
- `components/admin/status-badge.tsx`
- `components/admin/copy-link-button.tsx`
- `components/admin/guest-table.tsx`
- `components/admin/guest-card.tsx`
- `components/admin/guest-list.tsx`
- `app/(admin)/admin/page.tsx`
