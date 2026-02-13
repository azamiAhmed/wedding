# Story 2.3: Sections Conditionnelles Lieu & Programme

Status: done

## Story

As a invité,
I want voir les informations sur le lieu et le programme quand elles sont disponibles,
so that je sache où aller et quoi attendre le jour du mariage.

## Acceptance Criteria

1. **Given** `show_venue = true` dans `site_config`, **When** la page invité se charge, **Then** la section Lieu s'affiche avec l'adresse, une description et les informations pratiques, stylée avec Cormorant Garamond (titre) et Geist Sans (texte).

2. **Given** `show_venue = false` dans `site_config`, **When** la page invité se charge, **Then** la section Lieu n'est pas rendue du tout (pas de div vide, pas d'espace).

3. **Given** `show_program = true` dans `site_config`, **When** la page invité se charge, **Then** la section Programme s'affiche avec les étapes de la journée accompagnées d'icônes élégantes (pas d'horaires détaillés).

4. **Given** `show_program = false` dans `site_config`, **When** la page invité se charge, **Then** la section Programme n'est pas rendue.

5. **Given** les sections Lieu et Programme sur mobile (375px+), **When** elles s'affichent, **Then** le contenu est lisible, les icônes correctement dimensionnées, pas de débordement.

6. **Given** le contenu des sections Lieu et Programme, **When** il est affiché, **Then** il provient directement du code source (`lib/constants.ts`), pas d'une base de données (FR29).

## Tasks / Subtasks

- [x] **Task 1: Add venue data to constants.ts** (AC: #1, #6)
  - [x] Add `VENUE` object to `lib/constants.ts` with: `name` (string), `address` (string), `description` (string), `details` (array of {label, value} for practical info like parking, access)
  - [x] Use placeholder content (user will customize)
  - [x] Export type `VenueInfo` for type safety

- [x] **Task 2: Add program events data to constants.ts** (AC: #3, #6)
  - [x] Add `PROGRAM_EVENTS` array to `lib/constants.ts` with event objects: `title` (string), `description` (string), `icon` (string identifier)
  - [x] Suggested events: Accueil des invités, Cérémonie, Cocktail, Dîner, Soirée dansante
  - [x] Use placeholder descriptions (user will customize)
  - [x] Export type `ProgramEvent` for type safety

- [x] **Task 3: Upgrade VenueSection component** (AC: #1, #2, #5)
  - [x] Rewrite `components/guest/venue-section.tsx` as Server Component (no `"use client"`)
  - [x] Keep existing section wrapper: `min-h-dvh snap-start bg-white-broken` with `role="region"` and `aria-label`
  - [x] Display venue name, address, description with proper typography
  - [x] Display practical details list below description
  - [x] Golden separator between heading and content (consistent with InfoSection pattern)
  - [x] Import venue data from `@/lib/constants`

- [x] **Task 4: Upgrade ProgramSection component** (AC: #3, #4, #5)
  - [x] Rewrite `components/guest/program-section.tsx` as Server Component (no `"use client"`)
  - [x] Keep existing section wrapper: `min-h-dvh snap-start bg-cream-warm` with `role="region"` and `aria-label`
  - [x] Display program events as a vertical list with inline SVG icons
  - [x] Icons: simple outline SVGs, 32-40px, styled with `text-gold-moroccan`
  - [x] Each event shows icon + title + short description
  - [x] No detailed times — just event names and descriptions (per epic requirement)
  - [x] Import program data from `@/lib/constants`

- [x] **Task 5: Verify** (AC: #1-6)
  - [x] Run `npm run build` — no errors
  - [x] Run `npm run lint` — no errors
  - [ ] Navigate to `/invite/testguest1` — verify venue + program render
  - [ ] Toggle `show_venue` to `false` in DB — verify venue disappears
  - [ ] Toggle `show_program` to `false` in DB — verify program disappears
  - [ ] Verify mobile layout (Chrome DevTools 375px) — no overflow, icons sized correctly
  - [ ] Verify desktop layout (768px+) — proper spacing, readable
  - [x] Verify all content comes from `lib/constants.ts`

## Dev Notes

### Critical: Conditional Rendering Already Works

The conditional rendering logic already exists in `app/(guest)/invite/[slug]/page.tsx` from Story 1.2:

```tsx
const config = await getSiteConfig()
const showVenue = config.show_venue !== 'false'
const showProgram = config.show_program !== 'false'

{showVenue && <VenueSection />}
{showProgram && <ProgramSection />}
```

**Story 2.3 does NOT modify the conditional logic.** It only upgrades the visual content of the two section components. ACs #2 and #4 (hidden when false) are already satisfied — just verify they still work.

### Critical: No Scroll Animations in Scope

CSS Scroll-Driven Animations are **Story 2.4** scope. Story 2.3 delivers the **content, layout, icons, and responsive design only**. No `animation-timeline`, no `view()`, no scroll-driven reveal effects.

The only acceptable animation is `motion-safe:animate-fade-in-up` on section headings (consistent with other sections).

### Content: FR29 — Hardcoded in constants.ts

Per FR29, all content is managed in code source. Following the centralization pattern established in Stories 1.2 and 2.2 code reviews, all French strings go in `lib/constants.ts`.

**Venue placeholder content:**

```typescript
export interface VenueInfo {
  name: string
  address: string
  city: string
  description: string
  details: { label: string; value: string }[]
}

export const VENUE: VenueInfo = {
  name: 'Nom du lieu',
  address: '123 Rue Example',
  city: 'Ville, Maroc',
  description: 'Un lieu magique pour célébrer notre union.',
  details: [
    { label: 'Accès', value: 'Indications à venir' },
    { label: 'Parking', value: 'Parking disponible sur place' },
  ],
}
```

**Program placeholder content:**

```typescript
export interface ProgramEvent {
  title: string
  description: string
  icon: string
}

export const PROGRAM_EVENTS: ProgramEvent[] = [
  {
    title: 'Accueil des invités',
    description: 'Réception et installation des invités.',
    icon: 'welcome',
  },
  {
    title: 'Cérémonie',
    description: 'La célébration de notre union.',
    icon: 'ceremony',
  },
  {
    title: 'Cocktail',
    description: 'Un moment de convivialité et de partage.',
    icon: 'cocktail',
  },
  {
    title: 'Dîner',
    description: 'Un festin pour ravir les papilles.',
    icon: 'dinner',
  },
  {
    title: 'Soirée dansante',
    description: 'Place à la fête et à la danse !',
    icon: 'dance',
  },
]
```

**Note:** All text is placeholder. The user should customize venue details and program descriptions. The dates/content should be personalized before going live.

### Icons Strategy: Inline SVGs

Per UX spec: icons should be "élégantes", outline style, 32-40px, doré color. The program section uses simple inline SVG icons defined directly in the component — no external icon library, no separate SVG files.

**Approach:** Create a small `ProgramIcon` helper component that renders the appropriate SVG based on the `icon` string identifier. Each SVG is a simple outline (2px stroke, no fill) using `currentColor` so it inherits `text-gold-moroccan`.

Suggested icons (minimal line art):
- `welcome` → Door/entrance icon
- `ceremony` → Rings/hearts icon
- `cocktail` → Glass icon
- `dinner` → Plate/utensils icon
- `dance` → Music note icon

Keep SVGs small (~5-10 paths each). No animation. Purely decorative (`aria-hidden="true"`).

### Layout: VenueSection

```
│  Lieu de la Cérémonie (h2, centered, Cormorant)
│  ─── (golden separator)
│
│  Nom du lieu (h3, Cormorant)
│  123 Rue Example, Ville (address, Geist)
│
│  Description du lieu... (p, Geist)
│
│  ┌─────────────────────┐
│  │ Accès: Indications   │
│  │ Parking: Sur place   │
│  └─────────────────────┘
```

Background: `bg-white-broken` (alternation from timeline's `bg-cream-warm`).
Max-width: `max-w-lg` for content, centered.

### Layout: ProgramSection

```
│  Programme de la Journée (h2, centered, Cormorant)
│  ─── (golden separator)
│
│  [🚪]  Accueil des invités
│         Réception et installation...
│
│  [💍]  Cérémonie
│         La célébration de notre union...
│
│  [🥂]  Cocktail
│         Un moment de convivialité...
│
│  [🍽]  Dîner
│         Un festin pour ravir...
│
│  [💃]  Soirée dansante
│         Place à la fête...
```

Background: `bg-cream-warm`.
Each event: icon (left) + text (right), vertically stacked.
Mobile: icon above text or icon-left text-right with smaller gap.
Desktop: icon-left text-right with comfortable spacing.

### Typography Spec

| Element | Classes | Result |
|---------|---------|--------|
| Section heading | `font-display text-4xl md:text-[3.5rem] text-brown-deep` | Cormorant, matches other section headings |
| Venue name | `font-display text-2xl md:text-3xl text-brown-deep` | Cormorant, sub-heading |
| Venue address | `font-sans text-base text-brown-medium` | Geist Sans, subdued |
| Description | `font-sans text-lg text-brown-deep leading-relaxed` | Geist Sans, comfortable reading |
| Detail label | `font-sans text-sm text-brown-medium uppercase tracking-wider` | Geist Sans, small caps style |
| Detail value | `font-sans text-base text-brown-deep` | Geist Sans, regular |
| Event title | `font-display text-xl md:text-2xl text-brown-deep` | Cormorant, event name |
| Event description | `font-sans text-base text-brown-medium leading-relaxed` | Geist Sans, regular |

### Semantic HTML

**VenueSection:**
```tsx
<section role="region" aria-label={COUPLE.venueTitle}>
  <h2>{COUPLE.venueTitle}</h2>
  <h3>{VENUE.name}</h3>
  <address>{VENUE.address}, {VENUE.city}</address>
  <p>{VENUE.description}</p>
  <dl>
    <dt>{detail.label}</dt>
    <dd>{detail.value}</dd>
  </dl>
</section>
```

**ProgramSection:**
```tsx
<section role="region" aria-label={COUPLE.programTitle}>
  <h2>{COUPLE.programTitle}</h2>
  {events.map(event => (
    <article>
      <svg aria-hidden="true">...</svg>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
    </article>
  ))}
</section>
```

Key accessibility elements:
- `<address>` for venue address (semantic)
- `<dl>`/`<dt>`/`<dd>` for detail key-value pairs
- `<article>` wraps each program event
- `<h3>` for sub-headings (proper hierarchy under `<h2>`)
- `aria-hidden="true"` on decorative icons
- `role="region"` with `aria-label` on sections (consistent with all guest sections)

### Background Alternation Pattern

Current page flow backgrounds:
```
HeroSection     → photo with golden overlay
InfoSection     → bg-cream-warm
TimelineSection → bg-cream-warm
VenueSection    → bg-white-broken  (visual break)
ProgramSection  → bg-cream-warm
```

Keep this pattern. The `bg-white-broken` on VenueSection provides a subtle visual break from the cream sections.

### Existing Files to Modify

| File | Change |
|------|--------|
| `lib/constants.ts` | Add: `VenueInfo` type + `VENUE` object + `ProgramEvent` type + `PROGRAM_EVENTS` array |
| `components/guest/venue-section.tsx` | Rewrite: upgrade from placeholder to full venue layout |
| `components/guest/program-section.tsx` | Rewrite: upgrade from placeholder to program events with icons |

### New Files to Create

None — all changes are modifications to existing files.

### Existing Files to Use (Read-Only)

| File | Purpose |
|------|---------|
| `app/globals.css` | Design tokens (gold-moroccan, brown-deep, cream-warm, white-broken, etc.) |
| `app/(guest)/layout.tsx` | Guest layout (cream bg, scroll-snap, h-dvh) |
| `app/layout.tsx` | Root layout (Cormorant w300/400, Geist Sans) |
| `components/guest/info-section.tsx` | Pattern reference for section structure + golden separator |
| `components/guest/timeline-section.tsx` | Pattern reference for EventCard helper extraction |
| `app/(guest)/invite/[slug]/page.tsx` | Integration point — conditional rendering already in place |

### Anti-Patterns to Avoid

- ❌ `"use client"` → ✅ Server Component (no interactivity, CSS-only)
- ❌ `min-h-screen` → ✅ `min-h-dvh` (iOS Safari viewport)
- ❌ Scroll-driven animations → ✅ Static layout only (scroll animations = Story 2.4)
- ❌ Database query for content → ✅ Hardcoded in `constants.ts` (FR29)
- ❌ External icon library (lucide, heroicons) → ✅ Inline SVGs (zero bundle cost)
- ❌ Detailed times in program → ✅ Event names + descriptions only (per epic)
- ❌ Modifying conditional logic in page.tsx → ✅ Only upgrade component content
- ❌ Hardcoded French strings in component → ✅ Centralized in `constants.ts`
- ❌ Missing `snap-start` → ✅ Include for scroll-snap consistency
- ❌ Missing `w-full` on flex children → ✅ Include to prevent shrink-wrap (Story 2.2 bug fix)

### Scope Boundaries

**IN scope (Story 2.3):**
- Upgrade VenueSection with address, description, practical details
- Upgrade ProgramSection with event list and inline SVG icons
- Content centralized in constants.ts (FR29)
- Responsive: mobile-first, readable on 375px+
- Semantic HTML (address, dl/dt/dd, article, h3, aria-hidden on icons)
- Golden separator consistent with InfoSection
- `snap-start` + `min-h-dvh` on both sections

**NOT in scope (future stories):**
- CSS Scroll-Driven Animations → Story 2.4
- Map embed or Google Maps link → not planned
- Real venue photos → not planned (text-only per current design)
- Program time slots → explicitly excluded by epic ("pas d'horaires détaillés")
- Open Graph preview → Story 2.5
- Modifying conditional rendering logic → already works from Story 1.2

### Previous Story Learnings

- Use `min-h-dvh` NOT `min-h-screen` (iOS Safari — Story 1.2 code review)
- Centralize content in `lib/constants.ts` (Story 1.2 code review)
- Server Components by default (Story 1.2)
- `snap-start` on all sections for scroll-snap consistency (Story 1.3 code review)
- `motion-safe:` variant for heading animations (Story 2.1)
- `aria-label` on all guest sections (Story 2.1 code review)
- `w-full` on flex children to prevent shrink-wrap text bug (Story 2.2 user feedback)
- Golden separator pattern: `<div className="mt-6 h-px w-16 bg-gold-moroccan" />` (Story 2.2 InfoSection)
- Extract helper components to avoid duplication (EventCard pattern, Story 2.2 code review)
- Build passes with Next.js 16.1.6 + Turbopack (confirmed across all prior stories)
- Commit convention: `feat: <story-id>: <French title>` (observed from git log)

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 2, Story 2.3]
- [Source: _bmad-output/planning-artifacts/prd.md — FR5, FR6, FR29, NFR1, NFR2, NFR5]
- [Source: _bmad-output/planning-artifacts/architecture.md — Components, Conditional Rendering, Server Components]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Sections Lieu/Programme, Typography, Colors, Icons, Responsive]
- [Source: _bmad-output/implementation-artifacts/2-2-timeline-notre-histoire.md — Code Review Fixes, Dev Notes, Learnings]

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Debug Log References
None — no errors encountered.

### Completion Notes List
- Added `VenueInfo` interface + `VenueDetail` interface + `VENUE` object to `lib/constants.ts` with placeholder content (name, address, city, description, 2 practical details)
- Added `ProgramEvent` interface + `PROGRAM_EVENTS` array (5 events: Accueil, Cérémonie, Cocktail, Dîner, Soirée dansante) to `lib/constants.ts`
- `ProgramEvent.icon` uses union type `'welcome' | 'ceremony' | 'cocktail' | 'dinner' | 'dance'` for type safety
- Removed obsolete `venueText` and `programText` from `COUPLE` object (replaced by `VENUE` and `PROGRAM_EVENTS`)
- Rewrote `venue-section.tsx`: semantic `<address>` element, `<dl>`/`<dt>`/`<dd>` for practical details, golden separator, `motion-safe:animate-fade-in-up` on heading
- Rewrote `program-section.tsx`: `ProgramIcon` helper component with 5 inline SVG icons (outline style, 36px, `text-gold-moroccan`, `aria-hidden="true"`), `<article>` per event, flex layout icon+text
- Both sections: Server Components (no `"use client"`), `min-h-dvh snap-start`, `role="region"` with `aria-label` from constants, golden separator, proper heading hierarchy (`<h2>` → `<h3>`)
- VenueSection background: `bg-white-broken` (visual alternation from cream sections)
- ProgramSection background: `bg-cream-warm` (consistent with other content sections)
- Conditional rendering logic in page.tsx untouched — still works from Story 1.2
- Build passes, lint clean, route `/invite/[slug]` remains `ƒ (Dynamic)`

### Code Review Fixes
- **LOW**: Added `motion-safe:animate-fade-in-up` to InfoSection h2 — visual consistency across all guest sections
- **LOW**: Added `COUPLE.infoTitle` to constants.ts, replaced hardcoded "Nous nous marions" — content centralization (FR29)
- **LOW**: Made `VenueDetail` interface non-exported (private) — no external consumer

### File List
- `lib/constants.ts` — Modified: added `infoTitle`, `VenueInfo`, `VenueDetail` (private), `VENUE`, `ProgramEvent`, `PROGRAM_EVENTS`; removed `venueText`, `programText`
- `components/guest/venue-section.tsx` — Modified: full rewrite with venue name, address, description, practical details, golden separator
- `components/guest/program-section.tsx` — Modified: full rewrite with `ProgramIcon` helper, 5 inline SVG icons, event list layout
- `components/guest/info-section.tsx` — Modified: added `motion-safe:animate-fade-in-up` on h2, replaced hardcoded heading with `COUPLE.infoTitle`
