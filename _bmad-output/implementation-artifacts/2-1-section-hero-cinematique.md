# Story 2.1: Section Hero Cinématique

Status: done

## Story

As a invité,
I want voir une page d'accueil émotionnelle avec une photo plein écran, les prénoms du couple et une animation d'entrée,
So that je ressens immédiatement l'émotion et l'importance de l'événement.

## Acceptance Criteria

1. **Given** la page invité chargée, **When** le hero s'affiche, **Then** une photo du couple occupe tout l'écran (`100dvh`) avec un voile doré semi-transparent (15-20% opacité) pour la lisibilité du texte.

2. **Given** le hero visible, **When** l'animation d'entrée se déclenche, **Then** les prénoms "Ahmed & Ghizlaine" apparaissent en Cormorant Garamond XL avec une animation fade-in douce (600ms ease-out), suivis du message invité avec un léger délai.

3. **Given** un invité identifié par son slug, **When** le hero s'affiche, **Then** le prénom de l'invité est affiché dans un message personnalisé.

4. **Given** le hero sur mobile (375px+), **When** l'invité voit la page, **Then** la photo, les prénoms et le message sont correctement dimensionnés et lisibles (noms 48px mobile / 80px desktop).

5. **Given** la hero photo, **When** la page se charge, **Then** l'image utilise `next/image` avec `priority` (LCP), format WebP/AVIF auto, et `sizes="100vw"` responsive.

6. **Given** un utilisateur avec `prefers-reduced-motion: reduce`, **When** le hero se charge, **Then** le contenu s'affiche immédiatement sans animation.

## Tasks / Subtasks

- [x] **Task 1: Add hero photo asset** (AC: #1, #5)
  - [x] Ensure `/public/images/` directory exists
  - [x] Ask user for hero photo or place a placeholder image at `/public/images/hero.jpg`
  - [x] Verify image is valid JPEG/PNG (Next.js auto-converts to WebP/AVIF)

- [x] **Task 2: Add fadeInUp animation to globals.css** (AC: #2, #6)
  - [x] Add `@keyframes fadeInUp` in `globals.css` (opacity 0→1, translateY 20px→0)
  - [x] Add `--animate-fade-in-up` token in `@theme inline` block
  - [x] Animation uses existing `--animate-duration-entry: 600ms` timing

- [x] **Task 3: Upgrade HeroSection component** (AC: #1-5)
  - [x] Replace solid `bg-brown-deep` with `next/image` full-bleed photo (`fill`, `priority`, `sizes="100vw"`, `object-cover`)
  - [x] Add golden overlay div: `absolute inset-0 bg-gold-moroccan/[0.18]`
  - [x] Position content with `absolute inset-0 z-10 flex flex-col items-center justify-center`
  - [x] Names: `font-display text-5xl md:text-[5rem] font-light text-white leading-tight`
  - [x] Guest greeting at bottom: `font-sans text-lg text-white/90`
  - [x] Apply `motion-safe:animate-fade-in-up` on content elements
  - [x] Staggered animation: guest message with `animation-delay: 200ms`
  - [x] Keep `snap-start` and `min-h-dvh` on section
  - [x] Keep `role="banner"` and semantic `<h1>` for names

- [x] **Task 4: Verify** (AC: #1-6)
  - [x] Run `npm run build` — no errors
  - [x] Run `npm run lint` — no errors
  - [x] Navigate to `/invite/testguest1` — verify hero renders with photo + overlay
  - [x] Check `prefers-reduced-motion` via DevTools — content visible without animation
  - [x] Verify `<img>` tag has `priority` attribute (no lazy loading) via DevTools
  - [x] Visual check: text readable over photo + golden overlay

## Dev Notes

### Critical: Hero Photo Prerequisite

The hero section requires a photo at `/public/images/hero.jpg`. Before starting development:

1. **Ask the user** if they have a couple photo ready
2. If yes → place it at `/public/images/hero.jpg`
3. If no → create a temporary 1920×1080 solid gradient placeholder (gold-moroccan → brown-deep) for development. The real photo will be swapped before production.

**IMPORTANT**: `next/image` with `fill` requires a valid image source. Without an image, the component will show a broken image.

### Upgrading Existing HeroSection (NOT Creating New)

Story 1.2 created `components/guest/hero-section.tsx` with a simple solid-color placeholder. Story 2.1 **upgrades** this file — same location, same export, same props.

Current state (Story 1.2):
```tsx
// Simple solid bg — no photo, no animation
<section className="min-h-dvh snap-start flex flex-col items-center justify-center px-6 bg-brown-deep text-white-broken">
```

New state (Story 2.1):
```tsx
// Full-bleed photo + golden overlay + fade-in animation
<section className="relative min-h-dvh snap-start overflow-hidden" role="banner">
  <Image src="/images/hero.jpg" alt="Ahmed et Ghizlaine" fill priority sizes="100vw" className="object-cover" />
  <div className="absolute inset-0 bg-gold-moroccan/[0.18]" />
  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
    {/* Content with animation */}
  </div>
</section>
```

**Key change**: The section becomes a `relative` positioned container with absolutely positioned image, overlay, and content layers.

### CSS Animation Pattern

Add to `globals.css`:

```css
@theme inline {
  /* ... existing tokens ... */
  --animate-fade-in-up: fadeInUp var(--animate-duration-entry) ease-out both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

Usage with Tailwind's `motion-safe:` variant (built-in `prefers-reduced-motion` support):

```tsx
<h1 className="motion-safe:animate-fade-in-up ...">
  {COUPLE.names}
</h1>
<p className="motion-safe:animate-fade-in-up motion-safe:[animation-delay:200ms] ...">
  {COUPLE.greeting(guestName)}
</p>
```

The `motion-safe:` variant only applies the animation when `prefers-reduced-motion` is NOT `reduce`. No additional media query needed.

### Typography on Photo Background

Text is now on a photo with golden overlay, so colors change from Story 1.2:

| Element | Story 1.2 (solid bg) | Story 2.1 (photo) |
|---------|---------------------|-------------------|
| Names | `text-gold-moroccan` | `text-white` (or `text-gold-veil`) |
| Date | `text-gold-veil` | `text-white/90` |
| Greeting | `text-gold-veil/80` | `text-white/80` |
| Invite text | `text-gold-veil` | `text-white/70` |

**Contrast**: White text on photo + golden overlay (18% opacity) provides sufficient contrast for large display text (≥48px, WCAG AA large text = 3:1 ratio).

### next/image with `fill` Pattern

```tsx
import Image from 'next/image'

// Parent must be `position: relative` with explicit dimensions
<section className="relative min-h-dvh">
  <Image
    src="/images/hero.jpg"
    alt="Ahmed et Ghizlaine"
    fill
    priority
    sizes="100vw"
    className="object-cover"
  />
</section>
```

**Key rules:**
- `fill` makes the image `position: absolute` filling its parent
- Parent needs `position: relative` (Tailwind: `relative`)
- `priority` disables lazy loading (critical for LCP)
- `sizes="100vw"` tells Next.js the image spans full viewport width
- `className="object-cover"` ensures cover behavior via Tailwind
- No `width`/`height` needed with `fill`

### Staggered Animation Delay

For the guest message to appear slightly after the names:

```tsx
<p className="motion-safe:animate-fade-in-up motion-safe:[animation-delay:200ms] ...">
```

The `[animation-delay:200ms]` is a Tailwind arbitrary property. Combined with `both` fill mode in the animation definition, the element starts invisible and becomes visible after the delay.

### Overlay Opacity

The golden overlay uses `bg-gold-moroccan/[0.18]` which is:
- `#B8860B` at 18% opacity → `rgba(184, 134, 11, 0.18)`
- This provides a warm golden tint without obscuring the photo
- Adjust to `/[0.15]` or `/[0.20]` based on actual photo brightness

### Existing Files to Modify

| File | Change |
|------|--------|
| `components/guest/hero-section.tsx` | Upgrade: photo + overlay + animation |
| `app/globals.css` | Add: `fadeInUp` keyframe + animation token |

### Existing Files to Use (Read-Only)

| File | Purpose |
|------|---------|
| `lib/constants.ts` | `COUPLE` constant (names, date, greeting) |
| `app/(guest)/layout.tsx` | Guest layout (cream bg, scroll-snap, h-dvh) |
| `app/(guest)/invite/[slug]/page.tsx` | Imports HeroSection, passes guestName |
| `app/layout.tsx` | Root layout (Cormorant w300/400, Geist Sans loaded) |
| `app/globals.css` | Design tokens + animation duration tokens |

### Anti-Patterns to Avoid

- ❌ `"use client"` → ✅ Server Component (CSS animations, no JS)
- ❌ `min-h-screen` → ✅ `min-h-dvh` (iOS Safari viewport)
- ❌ `width`/`height` props with `fill` → ✅ `fill` alone (parent sets dimensions)
- ❌ JavaScript animation library for entrance → ✅ CSS keyframes (zero JS bundle)
- ❌ Inline styles for overlay → ✅ Tailwind `bg-gold-moroccan/[0.18]`
- ❌ Missing `priority` on hero image → ✅ `priority` is MANDATORY for LCP
- ❌ Missing `sizes` attribute → ✅ `sizes="100vw"` for optimal responsive loading
- ❌ Missing `prefers-reduced-motion` → ✅ `motion-safe:` variant
- ❌ Creating new file → ✅ Upgrading existing `hero-section.tsx`

### Scope Boundaries

**IN scope (Story 2.1):**
- Full-bleed photo hero with `next/image`
- Golden overlay (15-20% opacity)
- Fade-in entrance animation (CSS keyframes)
- `prefers-reduced-motion` support
- Responsive typography (48px/80px)
- LCP optimization (`priority`)

**NOT in scope (future stories):**
- Timeline "Notre Histoire" → Story 2.2
- Scroll-driven animations between sections → Story 2.4
- Parallax scroll effect on hero photo → Story 2.4
- Open Graph image → Story 2.5
- RSVP floating button → Epic 3
- Photo gallery or multiple photos → not planned

### Previous Story Learnings

- Use `min-h-dvh` NOT `min-h-screen` (iOS Safari viewport — Story 1.2 code review)
- Import content from `lib/constants.ts` COUPLE object (centralized — Story 1.2 code review)
- Server Components by default (Story 1.2)
- `snap-start` on all sections for scroll-snap consistency (Story 1.3 code review)
- Build passes with Next.js 16.1.6 + Turbopack (confirmed across all 3 prior stories)
- Cormorant Garamond loaded with weights 300 and 400 in root layout (Story 1.1)
- Animation duration tokens already in globals.css: `--animate-duration-entry: 600ms` (Story 1.1)

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 2, Story 2.1]
- [Source: _bmad-output/planning-artifacts/prd.md — FR1, FR3, FR29, NFR1, NFR2]
- [Source: _bmad-output/planning-artifacts/architecture.md — Images, Components, Performance]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Hero Design, Animation Specs, "3 premières secondes", Emotional Design]
- [Source: _bmad-output/implementation-artifacts/1-2-page-invite-avec-lien-unique.md — HeroSection baseline, Code Review Fixes]

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Debug Log References
- PIL not available for placeholder image → fell back to Python PPM + macOS `sips` JPEG conversion
- ImageMagick `convert` not available → same PPM + sips fallback

### Completion Notes List
- Created 1920×1080 gold-to-brown gradient placeholder at `public/images/hero.jpg` (user chose placeholder over real photo)
- Added `@keyframes fadeInUp` (opacity 0→1, translateY 20px→0) to `globals.css`
- Added `--animate-fade-in-up: fadeInUp 600ms ease-out both` token in `@theme inline` block
- Upgraded `hero-section.tsx` from solid-bg placeholder to full cinematic hero
- `next/image` with `fill`, `priority` (LCP), `sizes="100vw"`, `object-cover`
- Golden overlay: `absolute inset-0 bg-gold-moroccan/[0.18]`
- Content layer: `absolute inset-0 z-10 flex flex-col items-center justify-center`
- All text elements use `motion-safe:animate-fade-in-up` (CSS-only, no JS)
- Staggered animation: date at 100ms delay, greeting at 200ms delay
- Added "Vous êtes cordialement invité(e)" subtitle above names
- Typography: white text on photo (names `text-5xl md:text-[5rem]`, date `text-2xl md:text-4xl`)
- `prefers-reduced-motion` fully supported via Tailwind `motion-safe:` variant
- Server Component — no `"use client"`, pure CSS animations
- Build passes, lint clean, route `/invite/[slug]` remains `ƒ (Dynamic)`

### Code Review Fixes
- **LOW**: `--animate-fade-in-up` now uses `var(--animate-duration-entry)` instead of hardcoded `600ms`
- **LOW**: Added `COUPLE.inviteText` field, replaced hardcoded "Vous êtes cordialement invité(e)" in hero-section.tsx
- **LOW**: Added `aria-label="Accueil"` to hero section for consistent screen reader context

### File List
- `components/guest/hero-section.tsx` — Modified: upgraded with next/image, golden overlay, CSS fade-in animation
- `app/globals.css` — Modified: added fadeInUp keyframe + animation token
- `public/images/hero.jpg` — Created: 1920×1080 placeholder gradient (gold-moroccan → brown-deep)
- `lib/constants.ts` — Modified: added `inviteText` field to COUPLE constant
