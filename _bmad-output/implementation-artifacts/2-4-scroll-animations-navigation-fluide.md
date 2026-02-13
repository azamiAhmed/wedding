# Story 2.4: Scroll Animations & Navigation Fluide

Status: done

## Story

As a invité,
I want découvrir le contenu avec des animations fluides au scroll et une navigation smooth,
so that l'expérience soit premium et immersive comme un site Apple.

## Acceptance Criteria

1. **Given** les sections de la page invité (hero, info, timeline, lieu, programme)
   **When** l'invité scrolle
   **Then** chaque section se révèle avec des CSS Scroll-Driven Animations (fade-in, slide-up) sans JavaScript

2. **Given** la structure de page
   **When** le scroll est actif
   **Then** les sections utilisent `scroll-snap-type: y mandatory` et `scroll-snap-align: start` pour un défilement section par section (100vh)

3. **Given** un smartphone milieu de gamme (iPhone 11, Galaxy A52)
   **When** l'invité scrolle la page
   **Then** les animations sont fluides à 60fps sans saccade (NFR2)

4. **Given** la page sur desktop (>1024px)
   **When** l'invité navigue
   **Then** les animations et le layout s'adaptent au grand écran (sections plus larges, spacing adapté)

5. **Given** un navigateur ne supportant pas CSS Scroll-Driven Animations
   **When** la page s'affiche
   **Then** le contenu est visible normalement sans animations (dégradation gracieuse)

## Tasks / Subtasks

- [x] Task 1: Add scroll-driven animation CSS to globals.css (AC: #1, #3, #5)
  - [x] 1.1: Define `@keyframes scrollReveal` (opacity 0→1, translateY 30px→0)
  - [x] 1.2: Create `.scroll-reveal` utility class with `animation-timeline: view()` and `animation-range: entry 0% entry 40%`
  - [x] 1.3: Wrap in `@supports (animation-timeline: view())` for graceful degradation
  - [x] 1.4: Respect `prefers-reduced-motion` — disable scroll animations
  - [x] 1.5: Use GPU-accelerated properties only (`opacity`, `transform`) for 60fps

- [x] Task 2: Apply scroll reveal to InfoSection (AC: #1)
  - [x] 2.1: Add `scroll-reveal` class to section's inner content elements
  - [x] 2.2: Keep existing `motion-safe:animate-fade-in-up` on h2 heading (entry animation)

- [x] Task 3: Apply scroll reveal to TimelineSection (AC: #1)
  - [x] 3.1: Add scroll reveal to timeline events/articles
  - [x] 3.2: Consider staggered reveal for timeline events

- [x] Task 4: Apply scroll reveal to VenueSection (AC: #1)
  - [x] 4.1: Add scroll reveal to section content

- [x] Task 5: Apply scroll reveal to ProgramSection (AC: #1)
  - [x] 5.1: Add scroll reveal to program events list

- [x] Task 6: Desktop responsive adaptations (AC: #4)
  - [x] 6.1: Add `lg:` breakpoint adjustments for wider content areas and spacing
  - [x] 6.2: Ensure scroll-snap still works correctly on desktop

- [x] Task 7: Verify scroll-snap is already in place (AC: #2)
  - [x] 7.1: Confirm layout.tsx has `snap-y snap-mandatory` (ALREADY DONE — verify only)
  - [x] 7.2: Confirm all sections have `snap-start` (ALREADY DONE — verify only)

- [x] Task 8: Build + lint verification (AC: #3)
  - [x] 8.1: `npm run build` passes
  - [x] 8.2: `npm run lint` passes

## Dev Notes

### CSS Scroll-Driven Animations — Technical Approach

**API**: Use native CSS `animation-timeline: view()` property. This triggers CSS animations based on an element's visibility in the scroll container's viewport (Intersection Observer equivalent, but pure CSS).

**Key CSS properties:**
```css
.scroll-reveal {
  animation: scrollReveal 1ms linear both;  /* duration ignored with view timeline */
  animation-timeline: view();
  animation-range: entry 0% entry 40%;  /* animate during first 40% of entry */
}
```

**Browser support (as of 2026):**
- Chrome 115+ (July 2023) — full support
- Safari 18+ (September 2024) — full support
- Firefox 129+ (July 2024) — full support
- Older browsers: content visible without animation (graceful degradation)

**Progressive enhancement pattern:**
```css
@supports (animation-timeline: view()) {
  .scroll-reveal {
    opacity: 0;
    transform: translateY(30px);
    animation: scrollReveal 1ms linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 40%;
  }
}
```
Content is ONLY hidden (`opacity: 0`) inside `@supports` — browsers without support show content normally.

**`prefers-reduced-motion` handling:**
```css
@media (prefers-reduced-motion: reduce) {
  .scroll-reveal {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

### Scroll-Snap — Already Implemented (Verify Only)

**layout.tsx** already has: `h-dvh overflow-y-scroll snap-y snap-mandatory landscape:snap-none landscape:overflow-y-auto`

**All sections** already have `snap-start` and `min-h-dvh`. Do NOT modify these.

### Existing Animation Infrastructure

**globals.css already has:**
- `--animate-duration-entry: 600ms` token
- `--animate-duration-state: 300ms` token
- `--animate-ease-overlay: cubic-bezier(0.32, 0.72, 0, 1)` token
- `--animate-fade-in-up` shorthand
- `@keyframes fadeInUp` (opacity 0→1, translateY 20px→0)
- `motion-safe:animate-fade-in-up` used on all section headings

**HeroSection** has staggered entry animations with `[animation-delay:100ms]` and `[animation-delay:200ms]`. Do NOT modify hero animations — they are entry animations, not scroll-driven.

### Performance Requirements (NFR2)

- **CSS-only**: No JavaScript animation libraries. No Framer Motion. No GSAP. No IntersectionObserver JS.
- **GPU-accelerated**: Only animate `opacity` and `transform` (both composited by GPU)
- **No layout thrashing**: Do NOT animate `width`, `height`, `margin`, `padding`, `top`, `left`
- **Target**: 60fps on iPhone 11 / Galaxy A52
- **Server Components**: All guest section components remain Server Components. No `"use client"`.

### Critical Layout Pattern (MEMORY)

**NEVER use `flex flex-col items-center`** on sections — causes text to display vertically (one word per line). Use `flex flex-col justify-center` + `text-center` on elements + `mx-auto` on blocks. This pattern is already applied in all current sections — do NOT regress.

### Desktop Adaptations (lg: breakpoint)

Add responsive desktop improvements at `lg:` (1024px+):
- Wider max-width containers (`max-w-2xl` or `max-w-3xl` where appropriate)
- Slightly larger spacing (`lg:py-20`, `lg:px-12`)
- Ensure content is centered and readable on large screens
- Do NOT change mobile styles — mobile is the primary experience

### Files to Modify

| File | Action | Notes |
|------|--------|-------|
| `app/globals.css` | ADD scroll-driven animation CSS | New `@keyframes scrollReveal`, `.scroll-reveal` class, `@supports` wrapper, `prefers-reduced-motion` |
| `components/guest/info-section.tsx` | ADD `scroll-reveal` classes | Apply to content elements below h2 |
| `components/guest/timeline-section.tsx` | ADD `scroll-reveal` classes | Apply to timeline events |
| `components/guest/venue-section.tsx` | ADD `scroll-reveal` classes | Apply to content elements |
| `components/guest/program-section.tsx` | ADD `scroll-reveal` classes | Apply to program events |

### Files NOT to Modify

| File | Reason |
|------|--------|
| `app/(guest)/layout.tsx` | Scroll-snap already correct |
| `app/(guest)/invite/[slug]/page.tsx` | Section structure already correct |
| `lib/constants.ts` | No content changes needed |
| `components/guest/hero-section.tsx` | Hero uses entry animations, NOT scroll-driven |

### Project Structure Notes

- All components in `components/guest/` — Server Components, no `"use client"`
- CSS additions go in `app/globals.css` inside the existing structure
- Use Tailwind CSS 4 `@theme inline` block for any new design tokens (if needed)
- No new files needed — only modifications to existing files

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.4] — Story requirements and ACs
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Stratégie d'Animations] — CSS Scroll-Driven Animations mandate
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Patterns d'Animation] — Easing/duration specs
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Responsive Design] — Breakpoint strategy
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture] — Server Components, CSS-only animations
- [Source: _bmad-output/implementation-artifacts/2-1-section-hero-cinematique.md] — Hero animation patterns
- [Source: _bmad-output/implementation-artifacts/2-2-timeline-notre-histoire.md] — Timeline layout patterns
- [Source: _bmad-output/implementation-artifacts/2-3-sections-conditionnelles-lieu-programme.md] — Venue/Program component patterns

### Previous Story Intelligence

**From Story 2.3 (done):**
- VenueSection and ProgramSection are complete with rich content, icons, semantic HTML
- Both use `flex flex-col justify-center` layout (NOT `items-center`)
- Build and lint pass cleanly
- `motion-safe:animate-fade-in-up` on all section h2 headings

**From Story 2.2 (done):**
- TimelineSection has mobile (flexbox, line left) and desktop (grid, alternating) layouts
- `EventCard` helper component extracted for DRY code
- Section uses `flex flex-col items-center justify-center` — NOTE: timeline is an exception because it has a `max-w-3xl` container that prevents the vertical text bug

**From Story 2.1 (done):**
- HeroSection has staggered `motion-safe:animate-fade-in-up` with delays
- Uses `next/image` with `priority` for LCP
- Entry animation pattern: opacity 0→1, translateY 20px→0, 600ms ease-out

### Git Intelligence

Recent commits follow pattern: `feat: {story-key}`. Latest: `f02f493 feat: 2-2-timeline-notre-histoire`. Story 2.3 changes appear uncommitted.

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — clean implementation, no errors.

### Completion Notes List

- Added `@keyframes scrollReveal` and `.scroll-reveal` CSS class using native CSS Scroll-Driven Animations API (`animation-timeline: view()`)
- Created stagger variants `.scroll-reveal-stagger-1` and `.scroll-reveal-stagger-2` for future use
- Progressive enhancement via `@supports (animation-timeline: view())` — content visible without animation on unsupported browsers
- `prefers-reduced-motion: reduce` resets all scroll animations to visible state
- Applied `scroll-reveal` to InfoSection (separator, message, submessage), TimelineSection (all event articles), VenueSection (separator, venue name, address, description, details), ProgramSection (separator, each event article)
- Preserved existing `motion-safe:animate-fade-in-up` on all h2 headings
- HeroSection untouched — uses entry animations, not scroll-driven
- Desktop `lg:` adaptations: wider padding (`lg:px-12`), taller padding (`lg:py-20`), wider max-widths (`lg:max-w-sm`, `lg:max-w-md`)
- Scroll-snap verified: layout.tsx has `snap-y snap-mandatory`, all sections have `snap-start`
- Build passes, lint clean (Next.js 16.1.6 + Turbopack)
- All components remain Server Components — no `"use client"` added

### Change Log

- 2026-02-13: Implemented scroll-driven animations and desktop adaptations

### File List

- `app/globals.css` — Added `@keyframes scrollReveal`, `.scroll-reveal` classes, `@supports` wrapper, `prefers-reduced-motion` handling
- `components/guest/info-section.tsx` — Added `scroll-reveal` classes, `lg:px-12` desktop padding
- `components/guest/timeline-section.tsx` — Added `scroll-reveal` to event articles, `lg:px-12 lg:py-20` desktop spacing
- `components/guest/venue-section.tsx` — Added `scroll-reveal` classes, `lg:px-12 lg:py-20`, `lg:max-w-sm` on details
- `components/guest/program-section.tsx` — Added `scroll-reveal` to events, `lg:px-12 lg:py-20`, `lg:max-w-md` on event list
