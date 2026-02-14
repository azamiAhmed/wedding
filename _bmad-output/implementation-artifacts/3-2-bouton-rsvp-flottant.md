# Story 3.2: Bouton RSVP Flottant

Status: done

## Story

As a invité,
I want voir un bouton "Confirmer ma présence" toujours visible pendant ma navigation,
so that je puisse accéder au formulaire RSVP à tout moment sans chercher.

## Acceptance Criteria

1. **Given** la page invité chargée
   **When** l'invité navigue (scroll, sections)
   **Then** un bouton flottant est visible en bas de l'écran à tout moment (position fixed)

2. **Given** le bouton flottant
   **When** il est rendu
   **Then** il affiche "Confirmer ma présence" avec le style doré du site, une animation pulse subtile (2s), et est cliquable

3. **Given** le bouton sur mobile (375px+)
   **When** il est affiché
   **Then** il est centré en bas, suffisamment grand pour le touch (min 48px height), et ne masque pas le contenu important

4. **Given** l'invité a déjà confirmé (status: confirmed)
   **When** le bouton s'affiche
   **Then** le texte change en "Modifier ma réponse" et l'animation pulse est désactivée

5. **Given** l'invité a décliné (status: declined)
   **When** le bouton s'affiche
   **Then** le texte change en "Modifier ma réponse"

## Tasks / Subtasks

- [x] Task 1: Add RSVP button text constants (AC: #2, #4, #5)
  - [x] 1.1: Add `RSVP` object to `lib/constants.ts` with `confirmButton` ("Confirmer ma présence") and `modifyButton` ("Modifier ma réponse")

- [x] Task 2: Add pulse keyframe animation (AC: #2)
  - [x] 2.1: Add `@keyframes rsvpPulse` in `app/globals.css` — subtle box-shadow glow pulse using gold color, 2s duration
  - [x] 2.2: Add `.rsvp-pulse` utility class with `animation: rsvpPulse 2s ease-in-out infinite`
  - [x] 2.3: Ensure `prefers-reduced-motion: reduce` disables the pulse animation

- [x] Task 3: Create `FloatingRsvpButton` client component (AC: #1, #2, #3, #4, #5)
  - [x] 3.1: Create `components/guest/floating-rsvp-button.tsx` with `"use client"` directive
  - [x] 3.2: Accept props: `status: Guest['status']` (from SSR initial state)
  - [x] 3.3: Render button with `position: fixed` at bottom — centered on mobile, bottom-right on desktop (`lg:`)
  - [x] 3.4: Display "Confirmer ma présence" when status = `pending`, "Modifier ma réponse" when `confirmed` or `declined`
  - [x] 3.5: Apply gold styling (`bg-gold-moroccan text-white-broken`), min-height 48px mobile, rounded corners
  - [x] 3.6: Apply `.rsvp-pulse` animation when status = `pending`, disabled for `confirmed`/`declined`
  - [x] 3.7: Add `aria-label` ("Ouvrir formulaire RSVP" or "Modifier réponse RSVP" based on status)
  - [x] 3.8: Add `onClick` prop for future overlay integration (Story 3.3)

- [x] Task 4: Integrate button into invite page (AC: #1)
  - [x] 4.1: Import and render `FloatingRsvpButton` in `app/(guest)/invite/[slug]/page.tsx`
  - [x] 4.2: Pass `guest.status` as prop from SSR data

- [x] Task 5: Build + lint verification
  - [x] 5.1: `npm run build` passes
  - [x] 5.2: `npm run lint` passes

## Dev Notes

### Client Component Pattern

This is the **first client component** on the guest page. All existing sections are Server Components.

```tsx
'use client'

import { type Guest } from '@/lib/db/schema'
import { RSVP } from '@/lib/constants'

interface FloatingRsvpButtonProps {
  status: Guest['status']
  onClick?: () => void
}
```

**Key**: The button receives `status` from the server page (SSR) as initial state. No client-side fetch needed in this story — Story 3.4 handles re-fetching for pre-fill.

### Positioning Strategy

**Mobile (default):**
```
fixed bottom-6 left-6 right-6 z-50
→ Centered, full-width minus 24px margins each side
→ min-h-12 (48px) for touch target
```

**Desktop (lg:):**
```
lg:left-auto lg:right-6 lg:w-auto
→ Fixed bottom-right, auto width with padding
```

**z-index**: Use `z-50` to stay above all sections and scroll-snap containers. The guest layout `<main>` doesn't have z-index management, so `z-50` is safe.

### Pulse Animation Design

Subtle box-shadow glow pulse (NOT scale — scale can interfere with layout). Uses gold color:

```css
@keyframes rsvpPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(184, 134, 11, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(184, 134, 11, 0); }
}
```

This creates a soft golden glow that expands and fades — elegant for a wedding site.

### Button States Visual Design

| State | Background | Text | Animation | aria-label |
|-------|-----------|------|-----------|------------|
| `pending` | `bg-gold-moroccan` | "Confirmer ma présence" | `.rsvp-pulse` | "Ouvrir formulaire RSVP" |
| `confirmed` | `bg-gold-moroccan` | "Modifier ma réponse" | none | "Modifier réponse RSVP" |
| `declined` | `bg-gold-moroccan` | "Modifier ma réponse" | none | "Modifier réponse RSVP" |

**Note**: UX spec mentions green for confirmed state, but the simpler approach (same gold, text change only) is sufficient for MVP. The text change + pulse removal clearly indicates state.

### Tailwind CSS Classes Pattern

```tsx
<button
  className={cn(
    // Base positioning
    'fixed bottom-6 left-6 right-6 z-50',
    // Desktop override
    'lg:left-auto lg:right-6 lg:w-auto',
    // Styling
    'bg-gold-moroccan text-white-broken font-sans text-base font-medium',
    'rounded-lg min-h-12 px-6 py-3',
    // Interaction
    'active:scale-[0.97] transition-transform duration-150',
    // Pulse (conditional)
    status === 'pending' && 'rsvp-pulse'
  )}
>
```

### Accessibility Requirements

- `aria-label` changes based on status (not just visible text)
- Focus visible: `focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-moroccan focus-visible:outline-offset-2`
- Keyboard: Enter/Space activates (native `<button>` behavior)
- `prefers-reduced-motion`: pulse disabled, transitions instant
- Touch target: 48px min height on mobile (via `min-h-12`)

### Integration with page.tsx

The page is a Server Component. The button is a Client Component. Pass initial props from SSR:

```tsx
// page.tsx (Server Component)
<FloatingRsvpButton status={guest.status} />
```

The button renders below/outside the section list (after the last section). Since it's `position: fixed`, its DOM position doesn't affect visual layout.

### Story 3.3 Integration Notes

Story 3.3 (Overlay RSVP) will:
1. Add overlay state management (open/close)
2. Wire `onClick` to open the overlay
3. The button's `onClick` prop is prepared for this

For now, `onClick` is optional and defaults to no-op.

### Files to Create

| File | Action | Notes |
|------|--------|-------|
| `components/guest/floating-rsvp-button.tsx` | CREATE | Client Component — floating RSVP button |

### Files to Modify

| File | Action | Notes |
|------|--------|-------|
| `lib/constants.ts` | ADD | RSVP text constants (button labels) |
| `app/globals.css` | ADD | `@keyframes rsvpPulse` + `.rsvp-pulse` class |
| `app/(guest)/invite/[slug]/page.tsx` | ADD | Import and render FloatingRsvpButton |

### Files NOT to Modify

| File | Reason |
|------|--------|
| `lib/db/schema.ts` | No schema changes needed |
| `lib/db/queries.ts` | No new queries — button uses SSR data |
| `app/api/*` | API already complete from Story 3.1 |
| `components/guest/hero-section.tsx` | No changes to existing sections |
| `components/ui/button.tsx` | Don't use shadcn Button — custom styling needed for fixed positioning |

### Project Structure Notes

- First `"use client"` component on the guest page
- kebab-case filename: `floating-rsvp-button.tsx`
- PascalCase component: `FloatingRsvpButton`
- Uses `cn()` from `lib/utils` for conditional classes
- No new npm dependencies needed

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 3 Story 3.2] — AC and BDD criteria
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#FloatingRsvpButton] — Positioning, animation, states
- [Source: _bmad-output/planning-artifacts/architecture.md#Client Components] — rsvp-button.tsx is Client Component
- [Source: lib/db/schema.ts] — Guest type with status field
- [Source: app/(guest)/layout.tsx] — Guest layout structure (snap-scroll, fixed positioning context)

### Previous Story Intelligence

**From Story 3.1 (done):**
- API GET `/api/invite/[slug]` returns full guest with `status` field
- Guest type: `{ status: 'pending' | 'confirmed' | 'declined', ... }`
- No client-side fetch needed in this story — button receives status from SSR page

**From Story 2.4 (done):**
- CSS animation pattern: use `@keyframes` + class, respect `prefers-reduced-motion`
- Existing animations use `--animate-duration-pulse: 2000ms` token
- `scroll-reveal` class pattern established for CSS-only animations

**From Story 1.1 (done):**
- `cn()` utility available in `lib/utils.ts` for conditional class merging
- Design tokens: `gold-moroccan`, `white-broken`, `cream-warm` available as Tailwind classes
- Geist Sans is `font-sans` (default body font)

### Git Intelligence

Commit pattern: `feat: {story-key}`. Latest: `32b2bd2 feat: 3.1 api rsvp`.

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — clean implementation.

### Completion Notes List

- Added `RSVP` constants to `lib/constants.ts` with `confirmButton`, `modifyButton`, `ariaConfirm`, `ariaModify`
- Added `@keyframes rsvpPulse` in globals.css — subtle box-shadow gold glow pulse (2s, ease-in-out, infinite)
- Added `.rsvp-pulse` utility class using `--animate-duration-pulse` token
- `prefers-reduced-motion: reduce` disables both `.scroll-reveal` and `.rsvp-pulse` animations
- Created `FloatingRsvpButton` — first `"use client"` component on guest page
- Positioning: `fixed bottom-6 left-6 right-6 z-50` (mobile full-width), `lg:left-auto lg:right-6 lg:w-auto` (desktop right)
- Button text toggles: "Confirmer ma présence" (pending) / "Modifier ma réponse" (confirmed/declined)
- Pulse active only on `pending` status, disabled for confirmed/declined
- `aria-label` changes contextually, focus-visible outline, `active:scale-[0.97]` feedback
- `onClick` prop prepared for Story 3.3 overlay integration
- Integrated in page.tsx with `guest.status` prop from SSR
- Build and lint pass clean
- Code review: added `env(safe-area-inset-bottom)` for modern phones with home indicator

### Change Log

- 2026-02-13: Implemented floating RSVP button with status-based states and pulse animation
- 2026-02-13: Code review fix — safe-area-inset-bottom for iPhone home indicator zone

### File List

- `lib/constants.ts` — Added `RSVP` constant object (button labels, aria labels)
- `app/globals.css` — Added `@keyframes rsvpPulse`, `.rsvp-pulse` class, updated reduced-motion
- `components/guest/floating-rsvp-button.tsx` — NEW: Client Component floating RSVP button
- `app/(guest)/invite/[slug]/page.tsx` — Added FloatingRsvpButton import and render
