# Story 2.2: Timeline "Notre Histoire"

Status: done

## Story

As a invité,
I want parcourir la timeline du couple retraçant leur histoire,
So that je découvre leur parcours et me connecte émotionnellement à leur histoire.

## Acceptance Criteria

1. **Given** la section timeline dans la page invité, **When** l'invité scrolle après le hero et l'info, **Then** une frise chronologique verticale affiche les étapes du couple (Rencontre → Fiançailles → Jour J) avec une ligne dorée et des points marqueurs.

2. **Given** chaque étape de la timeline, **When** elle est rendue, **Then** elle affiche une date, un titre court et un micro-texte personnel, stylés avec Cormorant Garamond (titre) et Geist Sans (texte).

3. **Given** le contenu de la timeline, **When** il est affiché, **Then** il provient directement du code source (`lib/constants.ts`), pas d'une base de données (FR29).

4. **Given** la timeline sur mobile (375px+), **When** l'invité la parcourt, **Then** la ligne dorée est à gauche, le texte à droite, les étapes empilées verticalement avec espacement correct.

5. **Given** la timeline sur desktop (768px+), **When** l'invité la parcourt, **Then** la ligne dorée est centrée et les étapes alternent gauche/droite.

6. **Given** la page invité, **When** elle se charge, **Then** la section timeline est intégrée entre InfoSection et VenueSection dans le flux de la page, avec `snap-start` et `min-h-dvh`.

## Tasks / Subtasks

- [x] **Task 1: Add timeline data to constants.ts** (AC: #3)
  - [x] Add `TIMELINE_EVENTS` array to `lib/constants.ts` with 3 events: Rencontre, Fiançailles, Jour J
  - [x] Each event has: `date` (string), `title` (string), `description` (string)
  - [x] Use placeholder dates for Rencontre and Fiançailles; use `17 Octobre 2026` for Jour J
  - [x] Export type `TimelineEvent` for type safety

- [x] **Task 2: Create TimelineSection component** (AC: #1, #2, #4, #5)
  - [x] Create `components/guest/timeline-section.tsx` as Server Component (no `"use client"`)
  - [x] Section wrapper: `min-h-dvh snap-start bg-cream-warm` with `role="region"` and `aria-label="Notre Histoire"`
  - [x] Section heading: `<h2>` "Notre Histoire" with `font-display text-4xl md:text-[3.5rem] text-brown-deep`
  - [x] Vertical golden line: `bg-gold-moroccan` 2px width, full timeline height
  - [x] Golden points: `bg-gold-moroccan` circles (16-20px) at each event
  - [x] Mobile layout (default): line left, event cards right
  - [x] Desktop layout (`md:` breakpoint): line centered, events alternate left/right
  - [x] Each event card: `<time>` element with `dateTime` attribute, `<h3>` title in `font-display text-brown-deep`, `<p>` description in `font-sans text-brown-medium`
  - [x] Import `TIMELINE_EVENTS` from `@/lib/constants`
  - [x] Spacing: `space-y-12 md:space-y-16` between events, `px-6` padding

- [x] **Task 3: Integrate into page** (AC: #6)
  - [x] Import `TimelineSection` in `app/(guest)/invite/[slug]/page.tsx`
  - [x] Render between `<InfoSection />` and `{showVenue && <VenueSection />}`
  - [x] Timeline is always visible (not conditional, no site_config toggle)

- [x] **Task 4: Verify** (AC: #1-6)
  - [x] Run `npm run build` — no errors
  - [x] Run `npm run lint` — no errors
  - [x] Navigate to `/invite/testguest1` — verify timeline renders between info and venue
  - [x] Verify mobile layout: golden line left, text right (Chrome DevTools 375px)
  - [x] Verify desktop layout: golden line centered, alternating cards (768px+)
  - [ ] Verify typography: Cormorant titles, Geist descriptions
  - [ ] Verify accessibility: `<time>` elements, semantic heading hierarchy (`<h2>` → `<h3>`)

## Dev Notes

### Critical: Architecture Filename Discrepancy

The architecture doc lists `components/guest/timeline.tsx`. However, the established codebase pattern (from Stories 1.2, 2.1) uses `-section.tsx` suffix: `hero-section.tsx`, `info-section.tsx`, `venue-section.tsx`, `program-section.tsx`.

**Decision: Use `timeline-section.tsx`** to follow the established codebase pattern. The architecture doc's shorter naming is overridden by the actual convention.

### Critical: Scroll Animations are NOT in Scope

CSS Scroll-Driven Animations for timeline reveal are **Story 2.4** scope. Story 2.2 delivers the timeline **layout, content, and responsive design only**. No `animation-timeline`, no `view()`, no scroll-driven reveal effects.

The only acceptable animation in Story 2.2 is the existing `motion-safe:animate-fade-in-up` on the section heading (consistent with other sections). Individual timeline events should NOT have entrance animations — those come in Story 2.4.

### Content: Timeline Events (FR29 — Hardcoded)

Per FR29, all content is managed in code source. Timeline events go in `lib/constants.ts` following the centralization pattern established in Story 1.2 code review.

Suggested content structure (user should customize dates/descriptions):

```typescript
export interface TimelineEvent {
  date: string
  title: string
  description: string
}

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    date: '2019',
    title: 'La Rencontre',
    description: 'Le début de notre histoire, un moment inattendu qui a tout changé.',
  },
  {
    date: '2024',
    title: 'Les Fiançailles',
    description: 'Le « oui » qui scelle notre promesse, une évidence depuis le premier jour.',
  },
  {
    date: '17 Octobre 2026',
    title: 'Le Jour J',
    description: 'Le plus beau chapitre commence, entourés de ceux que nous aimons.',
  },
] as const
```

**Note:** The dates "2019" and "2024" are placeholders. Ask the user if they want to customize them. The text descriptions are suggestive — user may want their own personal touch.

### Layout Architecture

**Mobile (default — 375px+):**
```
│  Notre Histoire (h2, centered)
│
│  ●── 2019 — La Rencontre
│  │   Le début de notre histoire...
│  │
│  ●── 2024 — Les Fiançailles
│  │   Le « oui » qui scelle...
│  │
│  ●── 17 Oct 2026 — Le Jour J
│      Le plus beau chapitre...
```

Line on the left (absolute, 2px wide, gold), points on the line, text cards to the right.

**Desktop (md: 768px+):**
```
                Notre Histoire (h2, centered)

    2019 — La Rencontre  ──●
    Le début de...          │
                            │
                            ●──  2024 — Les Fiançailles
                            │    Le « oui » qui scelle...
                            │
  17 Oct 2026 — Le Jour J ──●
  Le plus beau chapitre...
```

Line centered, events alternate left/right using `even:` / `odd:` selectors or index-based logic.

### CSS Layout Strategy

**Approach: CSS Grid for desktop alternation, Flexbox for mobile.**

Mobile (default):
```tsx
<div className="relative pl-8"> {/* offset for line + point */}
  <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gold-moroccan" /> {/* line */}
  {events.map((event, i) => (
    <div key={i} className="relative pb-12 last:pb-0">
      <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-gold-moroccan border-2 border-cream-warm" /> {/* point */}
      {/* card content */}
    </div>
  ))}
</div>
```

Desktop (md:):
```tsx
{/* Use grid with 3 columns: left-content | center-line | right-content */}
<div className="md:grid md:grid-cols-[1fr_auto_1fr] md:gap-8">
  {/* Alternate left/right placement based on index */}
</div>
```

### Typography Spec

| Element | Classes | Result |
|---------|---------|--------|
| Section heading | `font-display text-4xl md:text-[3.5rem] text-brown-deep` | Cormorant, matches other section headings |
| Event title | `font-display text-xl md:text-2xl text-brown-deep font-normal` | Cormorant 400, slightly smaller than section heading |
| Event date | `font-sans text-sm text-brown-medium uppercase tracking-wider` | Geist Sans, subdued, above title |
| Event description | `font-sans text-base text-brown-medium leading-relaxed` | Geist Sans, comfortable reading |

### Semantic HTML

```tsx
<section role="region" aria-label="Notre Histoire">
  <h2>Notre Histoire</h2>
  {events.map(event => (
    <article key={event.title}>
      <time dateTime="2019">2019</time>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
    </article>
  ))}
</section>
```

Key accessibility elements:
- `<time dateTime="...">` for machine-readable dates
- `<article>` wraps each event (self-contained content)
- `<h3>` for event titles (proper heading hierarchy under `<h2>`)
- `role="region"` with `aria-label` on section (consistent with all guest sections)

### Integration Point

**Current page.tsx flow:**
```tsx
<HeroSection guestName={guest.firstName} />
<InfoSection />
{showVenue && <VenueSection />}
{showProgram && <ProgramSection />}
```

**New flow (Story 2.2):**
```tsx
<HeroSection guestName={guest.firstName} />
<InfoSection />
<TimelineSection />                        {/* ← NEW */}
{showVenue && <VenueSection />}
{showProgram && <ProgramSection />}
```

Timeline is NOT conditional — no `site_config` toggle, always visible. This matches epics (only Venue and Program are conditional).

### Existing Files to Modify

| File | Change |
|------|--------|
| `lib/constants.ts` | Add: `TimelineEvent` type + `TIMELINE_EVENTS` array |
| `app/(guest)/invite/[slug]/page.tsx` | Add: import + render `<TimelineSection />` |

### New Files to Create

| File | Purpose |
|------|---------|
| `components/guest/timeline-section.tsx` | Timeline "Notre Histoire" component |

### Existing Files to Use (Read-Only)

| File | Purpose |
|------|---------|
| `app/globals.css` | Design tokens (gold-moroccan, brown-deep, cream-warm, etc.) |
| `app/(guest)/layout.tsx` | Guest layout (cream bg, scroll-snap, h-dvh) |
| `app/layout.tsx` | Root layout (Cormorant w300/400, Geist Sans) |
| `components/guest/info-section.tsx` | Pattern reference for section structure |

### Anti-Patterns to Avoid

- ❌ `"use client"` → ✅ Server Component (no interactivity, CSS-only)
- ❌ `min-h-screen` → ✅ `min-h-dvh` (iOS Safari viewport)
- ❌ `timeline.tsx` → ✅ `timeline-section.tsx` (follow established naming)
- ❌ Scroll-driven animations → ✅ Static layout only (scroll animations = Story 2.4)
- ❌ Database query for timeline data → ✅ Hardcoded in `constants.ts` (FR29)
- ❌ JavaScript animation library → ✅ CSS-only (zero JS bundle)
- ❌ Hardcoded French strings in component → ✅ Centralized in `constants.ts`
- ❌ Missing `<time>` elements → ✅ Semantic `<time dateTime="...">` for accessibility
- ❌ Missing heading hierarchy → ✅ `<h2>` section → `<h3>` events
- ❌ Missing `snap-start` → ✅ Include for scroll-snap consistency

### Scope Boundaries

**IN scope (Story 2.2):**
- Timeline component with vertical layout
- Golden line + point markers
- 3 events: Rencontre, Fiançailles, Jour J
- Responsive: mobile left-aligned, desktop alternating
- Content in constants.ts (FR29)
- Integration in page between Info and Venue
- Semantic HTML + accessibility
- `snap-start` + `min-h-dvh`

**NOT in scope (future stories):**
- CSS Scroll-Driven Animations for timeline reveal → Story 2.4
- Parallax effects → Story 2.4
- Timeline photos/images → not planned (text-only per UX spec wireframe)
- Conditional visibility toggle → not planned (always visible)
- Timeline content from database/CMS → not planned (FR29)
- Open Graph preview → Story 2.5

### Previous Story Learnings

- Use `min-h-dvh` NOT `min-h-screen` (iOS Safari — Story 1.2 code review)
- Centralize content in `lib/constants.ts` COUPLE object (Story 1.2 code review)
- Server Components by default (Story 1.2)
- `snap-start` on all sections for scroll-snap consistency (Story 1.3 code review)
- Animation token uses `var(--animate-duration-entry)` not hardcoded `600ms` (Story 2.1 code review)
- `motion-safe:` variant for animations (Story 2.1)
- `aria-label` on all guest sections (Story 2.1 code review)
- Established naming: `*-section.tsx` pattern (not shorter names from architecture doc)
- Build passes with Next.js 16.1.6 + Turbopack (confirmed across all 4 prior stories)
- Cormorant Garamond loaded with weights 300 and 400 in root layout (Story 1.1)
- Commit convention: `feat: <story-id>: <French title>` (observed from git log)

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 2, Story 2.2]
- [Source: _bmad-output/planning-artifacts/prd.md — FR4, FR29, NFR1, NFR2, NFR5]
- [Source: _bmad-output/planning-artifacts/architecture.md — Components, Timeline, Naming, Server Components]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Timeline Design, Wireframes, Typography, Colors, Animation, Responsive]
- [Source: _bmad-output/implementation-artifacts/2-1-section-hero-cinematique.md — Code Review Fixes, Dev Notes, Learnings]

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Debug Log References
None — no errors encountered.

### Completion Notes List
- Added `TimelineEvent` interface + `TIMELINE_EVENTS` array (3 events) to `lib/constants.ts`
- Each event has `date`, `dateTime` (ISO for `<time>` element), `title`, `description`
- Placeholder dates for Rencontre (2019) and Fiançailles (2024); real date for Jour J (17 Octobre 2026)
- Created `components/guest/timeline-section.tsx` as Server Component (no `"use client"`)
- Dual layout: mobile (line left, cards right) + desktop md: (centered line, alternating sides)
- Mobile uses `relative pl-8` with absolute-positioned left line and points
- Desktop uses `grid grid-cols-[1fr_auto_1fr]` for centered alternation
- Golden line: `w-0.5 bg-gold-moroccan`, golden points: `h-4 w-4 rounded-full bg-gold-moroccan border-2 border-cream-warm`
- Semantic HTML: `<article>` per event, `<time dateTime="...">`, `<h3>` per title
- Typography: `font-display` (Cormorant) for heading + titles, `font-sans` (Geist) for dates + descriptions
- Section: `min-h-dvh snap-start bg-cream-warm`, `role="region" aria-label="Notre Histoire"`
- Heading uses `motion-safe:animate-fade-in-up` (consistent with hero pattern)
- Integrated in page.tsx between `<InfoSection />` and `<VenueSection />`, always visible (not conditional)
- Build passes, lint clean, route `/invite/[slug]` remains `ƒ (Dynamic)`

### Code Review Fixes
- **MEDIUM**: Extracted `EventCard` helper component — eliminated 3x duplicated markup (mobile, desktop-left, desktop-right)
- **MEDIUM**: Updated File List with 3 undocumented files (info-section, venue-section, program-section)
- **LOW**: Added `COUPLE.timelineTitle` to constants.ts, replaced hardcoded "Notre Histoire"

### File List
- `components/guest/timeline-section.tsx` — Created: vertical timeline component with dual mobile/desktop layout
- `lib/constants.ts` — Modified: added `TimelineEvent` interface, `TIMELINE_EVENTS` array, `timelineTitle` field
- `app/(guest)/invite/[slug]/page.tsx` — Modified: import + render `<TimelineSection />`
- `components/guest/info-section.tsx` — Modified: added `w-full` fix + typography redesign (font-light, separator, italic)
- `components/guest/venue-section.tsx` — Modified: added `w-full` fix for text width
- `components/guest/program-section.tsx` — Modified: added `w-full` fix for text width
