# Story 3.4: Modification & Pré-affichage RSVP

Status: done

## Story

As a invité ayant déjà répondu,
I want revoir et modifier ma réponse RSVP en revisitant mon lien,
so that je puisse changer d'avis ou ajuster le nombre de personnes.

## Acceptance Criteria

1. **Given** un invité avec status "confirmed" et personsConfirmed = 3
   **When** il revisite son lien et ouvre l'overlay RSVP
   **Then** le formulaire affiche son statut actuel ("Vous avez confirmé pour 3 personnes") et le nombre est pré-rempli à 3

2. **Given** un invité avec status "declined"
   **When** il revisite et ouvre l'overlay
   **Then** le formulaire affiche "Vous avez décliné l'invitation" avec la possibilité de changer en confirmation

3. **Given** un invité confirmé pour 3 personnes
   **When** il modifie à 5 personnes et soumet
   **Then** la mise à jour est sauvegardée en base et le message de succès s'affiche

4. **Given** un invité confirmé
   **When** il change sa réponse en "Je ne pourrai pas"
   **Then** le statut passe à "declined", personsConfirmed à 0, et le message empathique s'affiche

5. **Given** un invité avec status "pending" (jamais répondu)
   **When** il ouvre l'overlay
   **Then** le formulaire est vierge (nombre par défaut 1), sans message de statut précédent

## Tasks / Subtasks

- [x] Task 1: Add RSVP status display constants (AC: #1, #2)
  - [x] 1.1: Add `statusConfirmed` function to `RSVP` in `lib/constants.ts`: `(n: number) => string` that returns `Vous avez confirmé pour ${n} personne(s)`
  - [x] 1.2: Add `statusDeclined` string: `'Vous avez décliné l\'invitation'`
  - [x] 1.3: Add `modifyStatusAction` string: `'Modifier'`

- [x] Task 2: Add returning view to `RsvpOverlay` (AC: #1, #2, #3, #4, #5)
  - [x] 2.1: Replace `result` state + `showForm` derived value with `view` state: `'returning' | 'form' | 'result'` and `resultType` state: `'confirmed' | 'declined' | null`
  - [x] 2.2: Initial `view` = `initialStatus !== 'pending' ? 'returning' : 'form'`
  - [x] 2.3: Add returning view JSX between DialogHeader and form, rendered when `view === 'returning'`
  - [x] 2.4: Confirmed returning: show CheckCircle icon (green-olive) + `RSVP.statusConfirmed(personsCount)` text + "Modifier" button
  - [x] 2.5: Declined returning: show `RSVP.statusDeclined` text + "Modifier" button
  - [x] 2.6: "Modifier" button styled as secondary (outline gold-moroccan), transitions `view` to `'form'`
  - [x] 2.7: Update `submitRsvp`: on success → `setResultType(status)` + `setView('result')`
  - [x] 2.8: Update result view: use `resultType` instead of `result` for conditional rendering
  - [x] 2.9: Update `handleOpenChange`: on reopen → `setView(currentStatus !== 'pending' ? 'returning' : 'form')`, `setResultType(null)`, `setError(null)`
  - [x] 2.10: Verify pending guest skips returning view and shows form directly (AC #5)

- [x] Task 3: Build + lint verification
  - [x] 3.1: `npm run build` passes
  - [x] 3.2: `npm run lint` passes

## Dev Notes

### What Already Works (From Story 3.3)

The modification mechanics are **already implemented**:
- `personsCount` initializes from `initialPersonsConfirmed` (pre-fill works)
- `currentStatus` tracks live status across submissions
- `submitRsvp()` calls PUT API correctly for both confirm and decline
- `FloatingRsvpButton` shows "Modifier ma réponse" when `status !== 'pending'`
- Form pre-fills stepper to current `personsCount` value

**What's missing**: The "returning" view — a status summary shown when the guest has already responded, before they see the form.

### UX State Machine

The UX spec defines 4 overlay states: `fresh | returning | confirming | done`

```
Guest opens overlay
  ├── status === 'pending' → FORM view (fresh)
  └── status !== 'pending' → RETURNING view
        └── clicks "Modifier" → FORM view (pre-filled)
              ├── submits confirm → RESULT view (success)
              └── submits decline → RESULT view (empathetic)
```

### State Refactoring

**Current** (Story 3.3):
```typescript
const [result, setResult] = useState<'confirmed' | 'declined' | null>(null)
const showForm = !result
```

**New** (Story 3.4):
```typescript
type ViewState = 'returning' | 'form' | 'result'

const [view, setView] = useState<ViewState>(
  initialStatus !== 'pending' ? 'returning' : 'form'
)
const [resultType, setResultType] = useState<'confirmed' | 'declined' | null>(null)
```

### Updated handleOpenChange

```typescript
function handleOpenChange(open: boolean) {
  setIsOpen(open)
  if (open) {
    setView(currentStatus !== 'pending' ? 'returning' : 'form')
    setResultType(null)
    setError(null)
  }
}
```

### Updated submitRsvp (changes only)

```typescript
// Replace:
setResult(status)
// With:
setResultType(status)
setView('result')
```

### Returning View JSX

```tsx
{view === 'returning' && (
  <div className="text-center py-6 space-y-4">
    {currentStatus === 'confirmed' && (
      <>
        <CheckCircle className="mx-auto h-12 w-12 text-green-olive" />
        <p className="font-display text-xl text-brown-deep">
          {RSVP.statusConfirmed(personsCount)}
        </p>
      </>
    )}
    {currentStatus === 'declined' && (
      <p className="font-sans text-base text-brown-medium">
        {RSVP.statusDeclined}
      </p>
    )}
    <button
      type="button"
      onClick={() => setView('form')}
      className="w-full min-h-11 rounded-lg border border-gold-moroccan bg-transparent text-brown-deep font-sans text-base transition-colors duration-150 hover:bg-gold-veil/30 active:scale-[0.97]"
    >
      {RSVP.modifyStatusAction}
    </button>
  </div>
)}
```

### Updated Conditional Rendering

```tsx
{/* Replace showForm ? (...) : (...) with: */}
{view === 'returning' && ( /* returning view */ )}
{view === 'form' && ( /* existing form JSX, unchanged */ )}
{view === 'result' && (
  <div className="text-center py-6">
    {resultType === 'confirmed' && ( /* existing success JSX */ )}
    {resultType === 'declined' && ( /* existing decline JSX */ )}
  </div>
)}
```

### Constants Addition

```typescript
// Add to RSVP object in lib/constants.ts:
statusConfirmed: (n: number) => `Vous avez confirmé pour ${n} personne${n > 1 ? 's' : ''}`,
statusDeclined: 'Vous avez décliné l\'invitation',
modifyStatusAction: 'Modifier',
```

**Note**: `RSVP` already has `as const` — functions work fine with `as const` (established pattern in `COUPLE.greeting`).

### Files to Modify

| File | Action | Notes |
|------|--------|-------|
| `lib/constants.ts` | ADD | 3 new entries in RSVP object |
| `components/guest/rsvp-overlay.tsx` | MODIFY | Add returning view, refactor view/result state |

### Files NOT to Modify

| File | Reason |
|------|--------|
| `components/guest/person-stepper.tsx` | No changes needed |
| `components/guest/floating-rsvp-button.tsx` | No changes needed |
| `app/(guest)/invite/[slug]/page.tsx` | Same props, no change |
| `components/ui/dialog.tsx` | shadcn component |
| `lib/schemas/rsvp.ts` | Schema already correct |
| `app/api/*` | API routes already handle modifications |
| `lib/db/*` | No DB changes |
| `app/globals.css` | No new animations |

### Accessibility

- Returning view reuses same dialog context (focus trap, ARIA labels already handled)
- "Modifier" button is native `<button>` with clear label
- Status messages are visible text (not ARIA-only), screen readers will announce them naturally
- No new ARIA attributes needed

### Project Structure Notes

- No new files created — this story modifies existing components only
- Pattern: `as const` with function values (established in `COUPLE.greeting`)
- View state machine replaces simple boolean toggle — cleaner for 3+ states

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 3 Story 3.4] — AC and BDD criteria (FR16, FR18, FR19)
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#RsvpOverlayContent] — 4 overlay states: fresh | returning | confirming | done
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Parcours Invité Standard] — Flowchart L→M (returning → form)
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Patterns Transversaux] — "Modification sans punition", "Pré-remplissage systématique"
- [Source: components/guest/rsvp-overlay.tsx] — Current implementation to modify
- [Source: lib/constants.ts] — RSVP object to extend

### Previous Story Intelligence

**From Story 3.3 (done):**
- `RsvpOverlay` has `currentStatus` state tracking live status
- `personsCount` pre-fills from `initialPersonsConfirmed` (or 1 if 0)
- `handleOpenChange` resets `result` and `error` on reopen
- `submitRsvp()` updates `currentStatus` and `personsCount` after success
- `CheckCircle` from lucide-react already imported
- Button styles: primary = `bg-gold-moroccan text-white-broken`, secondary = `border border-gold-moroccan bg-transparent text-brown-deep`
- Code review fix: empty if branch replaced with `if (status === 'declined') setPersonsCount(1)`
- `DialogDescription` with `sr-only` added for a11y

**From Story 3.1 (done):**
- PUT API returns updated guest object on success
- Server forces `personsConfirmed = 0` on decline
- Same endpoint handles both initial submission and modifications

### Git Intelligence

Commit pattern: `feat: {story-key}`. Latest: `2b60c49 feat: 3-3-overlay-rsvp-confirmation`.

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None

### Completion Notes List

- All 3 tasks completed: constants, returning view, build+lint
- Refactored state from `result`/`showForm` to `view` (returning|form|result) + `resultType` state machine
- Returning view shows current status summary (CheckCircle + confirmed message, or declined message) with "Modifier" button
- handleOpenChange resets view based on currentStatus on each reopen
- Pending guests skip returning view and see form directly (AC #5 verified)
- `npm run build` and `npm run lint` both pass

### Change Log

| File | Action | Summary |
|------|--------|---------|
| `lib/constants.ts` | MODIFIED | Added `statusConfirmed` function, `statusDeclined` string, `modifyStatusAction` string to RSVP object |
| `components/guest/rsvp-overlay.tsx` | MODIFIED | Added ViewState type, returning view with status summary + modify button, refactored state to view/resultType |

### File List

- `lib/constants.ts`
- `components/guest/rsvp-overlay.tsx`
