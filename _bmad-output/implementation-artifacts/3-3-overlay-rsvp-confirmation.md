# Story 3.3: Overlay RSVP — Confirmation

Status: done

## Story

As a invité,
I want confirmer ma présence via un overlay élégant avec mon nom pré-rempli et le nombre de personnes,
so that je puisse répondre en moins de 10 secondes sans quitter la page.

## Acceptance Criteria

1. **Given** l'invité clique sur le bouton flottant
   **When** l'overlay s'ouvre
   **Then** un Dialog (shadcn/ui) s'affiche en bottom-sheet sur mobile et centré sur desktop, avec une animation d'entrée douce

2. **Given** l'overlay ouvert
   **When** les données de l'invité sont chargées
   **Then** le prénom de l'invité est affiché et pré-rempli, non modifiable par l'invité

3. **Given** l'overlay en mode confirmation
   **When** l'invité voit le formulaire
   **Then** un sélecteur "Nous serons" affiche un nombre (1 à 5) avec des boutons +/-

4. **Given** l'invité sélectionne un nombre et appuie sur "Je serai là"
   **When** la requête PUT est envoyée
   **Then** le bouton est désactivé pendant la requête, puis une animation de célébration s'affiche avec "On a hâte de vous voir !"

5. **Given** l'invité appuie sur "Je ne pourrai pas"
   **When** la requête PUT est envoyée avec status: declined
   **Then** un message empathique s'affiche "Nous comprenons, vous nous manquerez"

6. **Given** l'overlay ouvert
   **When** l'invité clique en dehors ou appuie sur le X
   **Then** l'overlay se ferme sans soumettre de réponse

## Tasks / Subtasks

- [x] Task 1: Add RSVP overlay text constants (AC: #2, #4, #5)
  - [x] 1.1: Add overlay text constants to `RSVP` object in `lib/constants.ts`: `overlayTitle`, `guestLabel`, `stepperLabel`, `confirmAction`, `declineAction`, `successMessage`, `declineMessage`, `loadingText`

- [x] Task 2: Create `PersonStepper` component (AC: #3)
  - [x] 2.1: Create `components/guest/person-stepper.tsx` with `"use client"` directive
  - [x] 2.2: Accept props: `value: number`, `onChange: (value: number) => void`, `min?: number` (default 1), `max?: number` (default 5)
  - [x] 2.3: Render minus button, number display, plus button in horizontal layout
  - [x] 2.4: Disable minus when value = min, disable plus when value = max
  - [x] 2.5: Add `role="spinbutton"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`
  - [x] 2.6: Add keyboard support: ArrowUp/ArrowRight increment, ArrowDown/ArrowLeft decrement, Home = min, End = max
  - [x] 2.7: Touch targets min 48px, gold border styling

- [x] Task 3: Create `RsvpOverlay` client component (AC: #1, #2, #3, #4, #5, #6)
  - [x] 3.1: Create `components/guest/rsvp-overlay.tsx` with `"use client"` directive
  - [x] 3.2: Accept props: `slug: string`, `guestFirstName: string`, `initialStatus: Guest['status']`, `initialPersonsConfirmed: number`
  - [x] 3.3: Manage state: `isOpen`, `personsCount`, `isLoading`, `result` (null | 'confirmed' | 'declined')
  - [x] 3.4: Render `FloatingRsvpButton` with `onClick` wired to open the Dialog and `status` derived from current state
  - [x] 3.5: Render shadcn `Dialog` with `open={isOpen}` and `onOpenChange`
  - [x] 3.6: Dialog content: overlay title, guest name (non-editable), PersonStepper, action buttons
  - [x] 3.7: "Je serai là" button: calls `PUT /api/invite/[slug]/rsvp` with `{ status: 'confirmed', personsConfirmed }`, disabled during loading
  - [x] 3.8: "Je ne pourrai pas" button: calls same API with `{ status: 'declined' }`, disabled during loading
  - [x] 3.9: On confirm success → show success message "On a hâte de vous voir !" with check icon, update button status
  - [x] 3.10: On decline success → show empathetic message "Nous comprenons, vous nous manquerez", update button status
  - [x] 3.11: On API error → show inline error message, re-enable buttons
  - [x] 3.12: Close on backdrop click, X button, or ESC — without submitting (AC #6)

- [x] Task 4: Update invite page to use RsvpOverlay (AC: #1)
  - [x] 4.1: Replace `FloatingRsvpButton` import/render with `RsvpOverlay` in `page.tsx`
  - [x] 4.2: Pass `slug`, `guest.firstName`, `guest.status`, `guest.personsConfirmed` as props

- [x] Task 5: Build + lint verification
  - [x] 5.1: `npm run build` passes
  - [x] 5.2: `npm run lint` passes

## Dev Notes

### Component Architecture

```
page.tsx (Server Component)
  └── RsvpOverlay (Client Component) — manages state
        ├── FloatingRsvpButton — onClick opens Dialog
        └── Dialog (shadcn/ui)
              ├── Header: title + close button
              ├── Guest name display (non-editable)
              ├── PersonStepper
              ├── Action buttons ("Je serai là" / "Je ne pourrai pas")
              └── Result message (success/decline/error)
```

**Key pattern**: `RsvpOverlay` wraps both the button AND the dialog. Page.tsx replaces `<FloatingRsvpButton>` with `<RsvpOverlay>`. The `FloatingRsvpButton` component stays unchanged — it's reused inside `RsvpOverlay`.

### State Management (Local React — No External Library)

```typescript
const [isOpen, setIsOpen] = useState(false)
const [personsCount, setPersonsCount] = useState(initialPersonsConfirmed || 1)
const [isLoading, setIsLoading] = useState(false)
const [result, setResult] = useState<'confirmed' | 'declined' | null>(null)
const [error, setError] = useState<string | null>(null)
const [currentStatus, setCurrentStatus] = useState(initialStatus)
```

**Status tracking**: `currentStatus` tracks the live RSVP status. Starts from SSR `initialStatus`, updated after successful API calls. This controls the `FloatingRsvpButton` text ("Confirmer" vs "Modifier").

### API Fetch Pattern (Client-Side)

```typescript
async function submitRsvp(status: 'confirmed' | 'declined') {
  setIsLoading(true)
  setError(null)
  try {
    const body = status === 'confirmed'
      ? { status, personsConfirmed: personsCount }
      : { status }
    const res = await fetch(`/api/invite/${slug}/rsvp`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Erreur serveur')
    }
    setResult(status)
    setCurrentStatus(status)
  } catch (e) {
    setError(e instanceof Error ? e.message : 'Erreur inattendue')
  } finally {
    setIsLoading(false)
  }
}
```

### shadcn Dialog Usage

**CRITICAL**: Use the existing shadcn Dialog from `components/ui/dialog.tsx`. It already provides:
- Focus trap (Radix Dialog)
- Backdrop click to close
- ESC to close
- Portal rendering (outside scroll container)
- Open/close animations (fade-in/zoom-in, fade-out/zoom-out)

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{RSVP.overlayTitle}</DialogTitle>
    </DialogHeader>
    {/* form content */}
  </DialogContent>
</Dialog>
```

**Note**: Do NOT use `<DialogTrigger>` — the button is rendered separately (FloatingRsvpButton). We control `open` state programmatically.

### PersonStepper Component

```tsx
<div
  role="spinbutton"
  aria-valuemin={min}
  aria-valuemax={max}
  aria-valuenow={value}
  aria-valuetext={`${value} personne${value > 1 ? 's' : ''}`}
  aria-label={RSVP.stepperLabel}
  tabIndex={0}
  onKeyDown={handleKeyDown}
>
  <button disabled={value <= min} onClick={() => onChange(value - 1)}>−</button>
  <span>{value}</span>
  <button disabled={value >= max} onClick={() => onChange(value + 1)}>+</button>
</div>
```

**Keyboard handling**:
- ArrowUp / ArrowRight → increment
- ArrowDown / ArrowLeft → decrement
- Home → set to min
- End → set to max

**Styling**: Gold border on buttons, disabled state greyed out, 48px touch targets.

### Result State Display

After submission, replace the form with a result message:

```tsx
{result === 'confirmed' && (
  <div className="text-center py-8">
    <CheckCircle className="mx-auto h-12 w-12 text-green-olive" />
    <p className="mt-4 font-display text-xl text-brown-deep">{RSVP.successMessage}</p>
  </div>
)}

{result === 'declined' && (
  <div className="text-center py-8">
    <p className="mt-4 font-sans text-base text-brown-medium">{RSVP.declineMessage}</p>
  </div>
)}
```

**After result displayed**: User can close the dialog manually. The floating button text updates to "Modifier ma réponse".

### Dialog Reset on Reopen

When the dialog reopens (user clicks button again after closing), reset `result` and `error` state:

```typescript
function handleOpenChange(open: boolean) {
  setIsOpen(open)
  if (open) {
    setResult(null)
    setError(null)
    // Reset personsCount to current confirmed value or 1
    if (currentStatus === 'confirmed') {
      setPersonsCount(personsCount) // keep current
    } else {
      setPersonsCount(1) // reset to default
    }
  }
}
```

### Button Hierarchy in Dialog

| Button | Variant | Style | Behavior |
|--------|---------|-------|----------|
| "Je serai là" | Primary | `bg-gold-moroccan text-white-broken w-full min-h-12 rounded-lg` | Calls PUT with confirmed |
| "Je ne pourrai pas" | Secondary | `border border-gold-moroccan text-brown-deep bg-transparent w-full min-h-11 rounded-lg` | Calls PUT with declined |

Both disabled during loading. Loading text on primary: "Confirmation..."

### Accessibility

- Dialog: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` (via DialogTitle)
- Focus trap: Radix Dialog handles automatically
- PersonStepper: `role="spinbutton"` with full ARIA attributes
- Buttons: Native `<button>` elements with `disabled` state
- Focus return: Radix Dialog returns focus to trigger on close
- `prefers-reduced-motion`: Dialog animations already handled by shadcn

### Files to Create

| File | Action | Notes |
|------|--------|-------|
| `components/guest/person-stepper.tsx` | CREATE | Client Component — spinbutton +/- |
| `components/guest/rsvp-overlay.tsx` | CREATE | Client Component — Dialog wrapper with form |

### Files to Modify

| File | Action | Notes |
|------|--------|-------|
| `lib/constants.ts` | ADD | RSVP overlay text constants |
| `app/(guest)/invite/[slug]/page.tsx` | MODIFY | Replace FloatingRsvpButton with RsvpOverlay |

### Files NOT to Modify

| File | Reason |
|------|--------|
| `components/guest/floating-rsvp-button.tsx` | Stays as-is, reused by RsvpOverlay |
| `components/ui/dialog.tsx` | shadcn component, don't modify |
| `lib/schemas/rsvp.ts` | Zod schema already correct |
| `app/api/*` | API routes already complete |
| `app/globals.css` | No new animations needed |
| `lib/db/*` | No DB changes |

### Project Structure Notes

- `RsvpOverlay` is the parent client component that composes button + dialog
- `PersonStepper` is a reusable spinbutton (isolated, testable)
- `FloatingRsvpButton` is reused unchanged (imported by RsvpOverlay)
- No new npm dependencies — uses existing shadcn Dialog, Radix, lucide-react
- `fetch()` used for API calls (native browser API, no axios/swr)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 3 Story 3.3] — AC and BDD criteria
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#RsvpOverlayContent] — Dialog, PersonStepper, button hierarchy
- [Source: _bmad-output/planning-artifacts/architecture.md#Client Components] — rsvp-overlay.tsx is Client Component
- [Source: components/ui/dialog.tsx] — shadcn Dialog API (DialogContent, DialogHeader, etc.)
- [Source: components/ui/button.tsx] — Button variants (default, outline)
- [Source: components/guest/floating-rsvp-button.tsx] — Existing button with onClick prop
- [Source: lib/schemas/rsvp.ts] — Zod validation schema for PUT request

### Previous Story Intelligence

**From Story 3.2 (done):**
- `FloatingRsvpButton` has `onClick` prop ready for overlay integration
- `status` prop controls text and pulse animation
- RSVP constants: `confirmButton`, `modifyButton`, `ariaConfirm`, `ariaModify`

**From Story 3.1 (done):**
- PUT `/api/invite/[slug]/rsvp` accepts `{ status, personsConfirmed? }`
- Server forces `personsConfirmed = 0` on decline
- Error format: `{ error: string, code: string }`
- Malformed JSON returns 400 VALIDATION_ERROR

**From Story 2.4 (done):**
- `prefers-reduced-motion` pattern established in globals.css
- CSS-only animations preferred, but client components can use React state

### Git Intelligence

Commit pattern: `feat: {story-key}`. Latest: `2f5086e feat: 3-2-bouton-rsvp-flottant`.

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None

### Completion Notes List

- All 5 tasks completed: constants, PersonStepper, RsvpOverlay, page integration, build+lint
- PersonStepper implements full ARIA spinbutton pattern with keyboard navigation (Arrow keys, Home, End)
- RsvpOverlay wraps FloatingRsvpButton + Dialog — page.tsx replaces direct FloatingRsvpButton usage
- API calls use native `fetch()` to PUT `/api/invite/[slug]/rsvp`
- Dialog resets result/error state on reopen; personsCount resets to 1 on decline
- `DialogDescription` added with `sr-only` for accessibility compliance
- `npm run build` and `npm run lint` both pass

### Change Log

| File | Action | Summary |
|------|--------|---------|
| `lib/constants.ts` | MODIFIED | Added overlay text constants to RSVP object (overlayTitle, guestLabel, stepperLabel, confirmAction, declineAction, successMessage, declineMessage, loadingText, errorText) |
| `components/guest/person-stepper.tsx` | CREATED | Client Component — spinbutton +/- with ARIA attributes and keyboard support |
| `components/guest/rsvp-overlay.tsx` | CREATED | Client Component — Dialog wrapper with form, API fetch, success/decline/error states |
| `app/(guest)/invite/[slug]/page.tsx` | MODIFIED | Replaced FloatingRsvpButton import/render with RsvpOverlay, passing slug, firstName, status, personsConfirmed |

### File List

- `lib/constants.ts`
- `components/guest/person-stepper.tsx`
- `components/guest/rsvp-overlay.tsx`
- `app/(guest)/invite/[slug]/page.tsx`
