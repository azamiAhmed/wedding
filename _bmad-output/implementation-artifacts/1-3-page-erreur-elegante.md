# Story 1.3: Page d'Erreur Élégante

Status: done

## Story

As a visiteur avec un lien invalide,
I want voir une page d'erreur élégante et cohérente avec le design du site,
So that je comprends que mon lien ne fonctionne pas sans être perdu.

## Acceptance Criteria

1. **Given** un slug inexistant en base (ex: `/invite/xyz123abcd`), **When** le visiteur ouvre ce lien, **Then** la page `not-found.tsx` s'affiche avec un message élégant dans le style du site (fond crème, typographie Cormorant, message rassurant).

2. **Given** la page 404 invité, **When** elle s'affiche, **Then** elle ne révèle aucune information sur l'existence d'autres invités ou slugs (NFR9 — pas de distinction entre slug malformé et slug inexistant).

3. **Given** un lien invalide avec des caractères spéciaux (ex: `/invite/abc<script>`, `/invite/../../etc`), **When** le visiteur ouvre ce lien, **Then** la page 404 s'affiche correctement sans erreur serveur.

4. **Given** la page 404, **When** elle se charge, **Then** elle hérite du layout `(guest)` (fond crème, polices) et affiche des metadata personnalisées (titre d'onglet).

5. **Given** la page 404 sur mobile, **When** elle s'affiche, **Then** le contenu est centré, lisible, et accessible (WCAG 2.1 AA, contrastes, sémantique HTML).

## Tasks / Subtasks

- [x] **Task 1: Create not-found.tsx** (AC: #1, #4)
  - [x] Create `app/(guest)/invite/[slug]/not-found.tsx` as Server Component
  - [x] Export `metadata` with personalized title: "Lien invalide — Ahmed & Ghizlaine"
  - [x] Render elegant error message using design tokens
  - [x] Use `min-h-dvh` for full-viewport centering (NOT `min-h-screen`)
  - [x] Import couple names from `lib/constants.ts` COUPLE constant

- [x] **Task 2: Error message content** (AC: #1, #2, #5)
  - [x] Heading: "Ce lien ne semble pas valide" (Cormorant Garamond, `font-display`)
  - [x] Body: "Le lien que vous avez utilisé ne correspond à aucune invitation." (Geist Sans)
  - [x] CTA text: "Contactez Ahmed ou Ghizlaine" (no actual link — just guidance text)
  - [x] NO information about valid slugs, patterns, or other guests (NFR9)
  - [x] Generic message regardless of whether slug is malformed or simply non-existent

- [x] **Task 3: Styling and layout** (AC: #1, #4, #5)
  - [x] Background: inherited from guest layout (`bg-cream-warm`)
  - [x] Center content vertically and horizontally (`flex flex-col items-center justify-center`)
  - [x] Max-width constraint for readability (`max-w-md`)
  - [x] Proper spacing between elements (`space-y-4`, `mt-8`)
  - [x] Accessible: semantic HTML, proper heading hierarchy, `aria-label` on section

- [x] **Task 4: Verify** (AC: #1-5)
  - [x] Run `npm run build` — no errors
  - [x] Run `npm run lint` — no errors
  - [x] Navigate to `/invite/nonexistent` — verify 404 page renders with guest layout
  - [x] Navigate to `/invite/abc<script>` — verify no server error
  - [x] Verify metadata title in browser tab
  - [x] Verify page inherits guest layout (cream bg, fonts)

## Dev Notes

### Critical: Next.js 16 not-found.tsx Behavior

In Next.js 16, `not-found.tsx` in a nested route is triggered when `notFound()` is called from the corresponding `page.tsx`. It **inherits parent layouts** (the guest layout will apply).

```typescript
// app/(guest)/invite/[slug]/not-found.tsx
import { COUPLE } from '@/lib/constants'

export const metadata = {
  title: `Lien invalide — ${COUPLE.names}`,
}

export default function NotFound() {
  return (
    <section
      className="min-h-dvh flex flex-col items-center justify-center px-6 text-center"
      role="region"
      aria-label="Page non trouvée"
    >
      <h1 className="font-display text-4xl md:text-[3.5rem] text-brown-deep leading-tight">
        Ce lien ne semble pas valide
      </h1>
      <div className="mt-8 max-w-md space-y-4">
        <p className="font-sans text-lg text-brown-medium">
          Le lien que vous avez utilisé ne correspond à aucune invitation.
        </p>
        <p className="font-sans text-base text-brown-medium">
          Contactez {COUPLE.names.replace(' & ', ' ou ')} si vous pensez qu'il s'agit d'une erreur.
        </p>
      </div>
    </section>
  )
}
```

**Key behaviors:**
- Triggered by `notFound()` in `page.tsx` (already implemented in Story 1.2)
- Inherits `(guest)/layout.tsx` — cream background + fonts already applied
- Server Component by default — no `"use client"` needed
- Returns HTTP 404 status code (without Suspense streaming)
- Can export static `metadata` object

### Security: NFR9 — No Data Leakage

**CRITICAL**: The error message MUST be identical regardless of why the slug failed:
- Slug doesn't exist in DB → same message
- Slug has invalid characters → same message
- Slug format is wrong → same message

```typescript
// In page.tsx (already implemented in Story 1.2):
const guest = await getGuestBySlug(slug)
if (!guest) {
  notFound() // Same response for ALL cases
}
```

**Anti-patterns:**
- ❌ "Ce slug n'existe pas" → reveals that slugs exist
- ❌ "Format de lien invalide" → reveals format expectations
- ❌ Different messages for different error types → enables enumeration
- ✅ Single generic message: "Ce lien ne semble pas valide"

### Import from lib/constants.ts

Story 1.2 code review extracted couple content to `lib/constants.ts`. Use it:

```typescript
import { COUPLE } from '@/lib/constants'

// COUPLE.names = "Ahmed & Ghizlaine"
// For CTA: COUPLE.names.replace(' & ', ' ou ') → "Ahmed ou Ghizlaine"
```

### Typography for Error Page

| Element | Classes | Result |
|---------|---------|--------|
| Heading | `font-display text-4xl md:text-[3.5rem] text-brown-deep` | Cormorant L — elegant, not alarming |
| Body text | `font-sans text-lg text-brown-medium` | Geist Sans — reassuring tone |
| CTA text | `font-sans text-base text-brown-medium` | Geist Sans — subtle guidance |

**DO NOT use:**
- `text-red-soft` or any error color — this is NOT an error in the traditional sense
- Bold or alarming typography — maintain serenity
- Technical language — "404", "not found", "erreur serveur"

### Emotional Design Tone

From UX spec: **Sérénité — pas de panique, rassurante — guidé vers la solution.**

> "Les erreurs sont élégantes — Si quelque chose casse, le site reste beau et rassurant. Le message d'erreur a le même niveau de design que le reste du site."

The page should feel like a calm, warm dead-end — not a broken experience.

### Layout Inheritance

The `not-found.tsx` inherits the guest layout which applies:
- `bg-cream-warm` — cream background
- `font-sans` — Geist Sans as default body font
- `h-dvh overflow-y-scroll snap-y snap-mandatory` — scroll-snap container

**Note:** The not-found page is a single section, so scroll-snap is irrelevant (only one snap point). The `min-h-dvh` on the section ensures it fills the viewport.

### File Naming (Mandatory Conventions)

| File | Convention |
|------|-----------|
| `app/(guest)/invite/[slug]/not-found.tsx` | Next.js convention |

### Existing Files to Use (Read-Only)

| File | Purpose |
|------|---------|
| `app/(guest)/layout.tsx` | Guest layout (cream bg, fonts, scroll-snap) |
| `app/(guest)/invite/[slug]/page.tsx` | Already calls `notFound()` when guest not found |
| `lib/constants.ts` | `COUPLE` constant (names, date, greeting) |
| `app/globals.css` | Design tokens (@theme inline) |

### Anti-Patterns to Avoid

- ❌ `"use client"` → ✅ Server Component (no interactivity)
- ❌ `min-h-screen` → ✅ `min-h-dvh` (iOS Safari viewport)
- ❌ Error colors (red) → ✅ Same palette as rest of site (brown, cream)
- ❌ Technical jargon ("404", "erreur") → ✅ Human, warm French message
- ❌ Different messages per error type → ✅ Single generic message (NFR9)
- ❌ Links to "homepage" → ✅ Text guidance to contact couple (no homepage exists for guests)
- ❌ Heavy decorative elements → ✅ Minimal, Chanel-style white space

### Scope Boundaries

**IN scope (Story 1.3):**
- `not-found.tsx` with elegant message
- Metadata export (page title)
- Inherits guest layout styling
- Security-compliant error message (NFR9)

**NOT in scope (future stories):**
- Global `global-not-found.tsx` for non-guest routes → can be added later if needed
- `error.tsx` for runtime errors (500) → separate concern
- Animation/transitions on error page → Epic 2, Story 2.4
- Any interactive elements (buttons, links) → not needed

### Previous Story Learnings (Story 1.2)

- Use `min-h-dvh` NOT `min-h-screen` (code review fix — iOS Safari viewport issue)
- Import content from `lib/constants.ts` COUPLE object (centralized, DRY)
- Server Components by default — no `"use client"` unless interactivity needed
- Guest layout already provides cream bg, fonts, scroll-snap container
- `notFound()` is already called in `page.tsx` when `getGuestBySlug()` returns null
- Design tokens are in `globals.css` with `@theme inline` syntax
- Build passes with Next.js 16.1.6 + Turbopack

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 1, Story 1.3: lines 220-239]
- [Source: _bmad-output/planning-artifacts/prd.md — FR10, NFR9]
- [Source: _bmad-output/planning-artifacts/architecture.md — Error Handling, Security, File Structure]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Emotional Design, Error Elegance, Typography]
- [Source: _bmad-output/implementation-artifacts/1-2-page-invite-avec-lien-unique.md — Code Review Fixes, Dev Notes]
- [Web: Next.js 16 not-found.tsx — inherits layouts, triggered by notFound(), returns 404 status]

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Debug Log References
None — no errors encountered.

### Completion Notes List
- Created `not-found.tsx` as Server Component with elegant error message
- Exported static `metadata` with personalized title "Lien invalide — Ahmed & Ghizlaine"
- Used `COUPLE` constant from `lib/constants.ts` for couple names (DRY)
- `COUPLE.contactNames` for CTA text (dedicated field, not brittle string replace)
- Styled with `min-h-dvh snap-start`, centered flex layout, `max-w-md` readability constraint
- Design tokens: `font-display` (Cormorant), `text-brown-deep`, `text-brown-medium`
- No error colors (red) — maintains serene, elegant tone per UX spec
- Single generic message for all error types (NFR9 — no data leakage)
- Semantic HTML: `<section>` with `role="region"`, `aria-label`, proper `<h1>` heading
- Build passes, lint clean, route `/invite/[slug]` remains `ƒ (Dynamic)`

### File List
- `app/(guest)/invite/[slug]/not-found.tsx` — Created: elegant 404 page with metadata
- `lib/constants.ts` — Modified: added `contactNames` field to COUPLE constant

### Code Review Fixes
- **LOW**: Added `import type { Metadata } from 'next'` + typed `metadata: Metadata` export
- **LOW**: Added `COUPLE.contactNames` field, replaced brittle `COUPLE.names.replace(' & ', ' ou ')`
- **LOW**: Added `snap-start` to section for consistency with other guest sections
