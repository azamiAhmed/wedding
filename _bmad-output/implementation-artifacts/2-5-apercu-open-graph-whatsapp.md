# Story 2.5: Aperçu Open Graph WhatsApp

Status: done

## Story

As a invité recevant un lien WhatsApp,
I want voir un aperçu élégant du site dans la bulle WhatsApp,
so that je sois intrigué et ai envie d'ouvrir le lien.

## Acceptance Criteria

1. **Given** un lien unique `/invite/[slug]` partagé sur WhatsApp
   **When** WhatsApp génère l'aperçu
   **Then** une image OG personnalisée s'affiche avec le titre "Ahmed & Ghizlaine vous invitent" et une description appropriée

2. **Given** le fichier `opengraph-image.tsx` dans le dossier `[slug]`
   **When** les crawlers OG accèdent à l'URL
   **Then** une image 1200x630px est générée dynamiquement avec la photo du couple, les prénoms et le style doré/crème du site

3. **Given** les meta OG générées
   **When** l'aperçu WhatsApp s'affiche
   **Then** le titre, la description et l'image sont cohérents avec le design du site (pas de placeholder générique)

## Tasks / Subtasks

- [x] Task 1: Add OG constants to lib/constants.ts (AC: #1, #3)
  - [x] 1.1: Add `OG` object with `title`, `description` strings matching wedding design language

- [x] Task 2: Add `generateMetadata` to page.tsx (AC: #1, #3)
  - [x] 2.1: Export `generateMetadata` async function from `app/(guest)/invite/[slug]/page.tsx`
  - [x] 2.2: Set `title`, `description`, `openGraph.title`, `openGraph.description` from constants
  - [x] 2.3: Ensure metadata is dynamic per-route (slug param access)

- [x] Task 3: Create `opengraph-image.tsx` (AC: #2)
  - [x] 3.1: Create `app/(guest)/invite/[slug]/opengraph-image.tsx` using Next.js `ImageResponse`
  - [x] 3.2: Generate 1200x630px image with crème background (#FAF7F2)
  - [x] 3.3: Render couple names "Ahmed & Ghizlaine" in display font styling
  - [x] 3.4: Render date "17 Octobre 2026" below names
  - [x] 3.5: Add golden decorative elements (separator line, border accent) matching site design
  - [x] 3.6: Add invitation text "Vous êtes cordialement invité(e)"
  - [x] 3.7: Load Cormorant Garamond font via fetch for satori rendering

- [x] Task 4: Build + lint verification
  - [x] 4.1: `npm run build` passes
  - [x] 4.2: `npm run lint` passes

## Dev Notes

### Next.js Dynamic OG Image Generation

**API**: Next.js 16 supports `opengraph-image.tsx` convention files. When placed in a route segment, Next.js automatically generates `<meta property="og:image">` tags pointing to the generated image.

**Key import:**
```tsx
import { ImageResponse } from 'next/og'
```

**File convention**: `app/(guest)/invite/[slug]/opengraph-image.tsx` — generates OG image per invite route.

**Image response pattern:**
```tsx
export default async function Image({ params }: { params: { slug: string } }) {
  return new ImageResponse(
    ( /* JSX template */ ),
    { width: 1200, height: 630 }
  )
}
```

**Satori limitations** (the engine behind `ImageResponse`):
- Only supports a subset of CSS: `flexbox` layout (no CSS grid)
- No `position: absolute` — use nested flexbox instead
- All text must have explicit `fontFamily`
- Colors must be explicit (no CSS variables, no Tailwind classes)
- Use inline styles only (`style={{}}`)
- `display: flex` is required on all container divs
- Font files must be fetched and passed to `ImageResponse` options

### Font Loading for OG Image

Cormorant Garamond needs to be loaded for the OG image since Tailwind/CSS fonts aren't available in satori:

```tsx
const cormorantFont = await fetch(
  new URL('https://fonts.gstatic.com/s/cormorantgaramond/v16/co3bmX5slCNuHLi8bLeY9MK7whWMhyjQEl5OuQ.woff2')
).then((res) => res.arrayBuffer())
```

Pass to `ImageResponse`:
```tsx
new ImageResponse(jsx, {
  width: 1200, height: 630,
  fonts: [{ name: 'Cormorant', data: cormorantFont, style: 'normal', weight: 300 }]
})
```

### Design Tokens for OG Image (Hardcoded)

Since satori doesn't support CSS variables or Tailwind, use raw hex values:
- Background: `#FAF7F2` (cream-warm)
- Accent/Gold: `#B8860B` (gold-moroccan)
- Text: `#2C2418` (brown-deep)
- Secondary text: `#6B5D4F` (brown-medium)
- Gold veil: `#E8D5A8`

### OG Image Visual Composition

```
┌──────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │    Vous êtes cordialement invité(e)                  │ │
│  │                                                      │ │
│  │         Ahmed & Ghizlaine                            │ │
│  │              ─────                                   │ │
│  │         17 Octobre 2026                              │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
│  gold border accent                                       │
└──────────────────────────────────────────────────────────┘
```

- Crème background (`#FAF7F2`)
- Gold border/accent (`#B8860B`) — subtle inner border or bottom accent
- Couple names in large Cormorant Garamond Light
- Date below in smaller text
- Golden separator line between names and date
- Invitation text above names in small caps

### `generateMetadata` Pattern

```tsx
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  return {
    title: OG.title,
    description: OG.description,
    openGraph: {
      title: OG.title,
      description: OG.description,
      type: 'website',
    },
  }
}
```

Note: The `og:image` meta tag is automatically generated by Next.js from the `opengraph-image.tsx` file — do NOT manually set `openGraph.images` in metadata.

### Existing Metadata

Root `layout.tsx` already has global metadata:
```tsx
export const metadata: Metadata = {
  title: "Ahmed & Ghizlaine — 17 Octobre 2026",
  description: "Célébrez avec nous le mariage d'Ahmed et Ghizlaine...",
}
```

The `generateMetadata` in `page.tsx` will override this for invite pages specifically.

### Files to Create

| File | Action | Notes |
|------|--------|-------|
| `app/(guest)/invite/[slug]/opengraph-image.tsx` | CREATE | Dynamic OG image generation (1200x630px) |

### Files to Modify

| File | Action | Notes |
|------|--------|-------|
| `lib/constants.ts` | ADD | OG constants (`title`, `description`) |
| `app/(guest)/invite/[slug]/page.tsx` | ADD | `generateMetadata` export |

### Files NOT to Modify

| File | Reason |
|------|--------|
| `app/layout.tsx` | Global metadata already correct |
| `components/guest/*` | No visual changes needed |
| `app/globals.css` | No CSS changes needed |

### Project Structure Notes

- `opengraph-image.tsx` must be in the same folder as `page.tsx` for the route segment
- No new npm dependencies needed — `next/og` is built into Next.js 16
- The OG image is a Server Component (runs at request time to generate the image)
- No `"use client"` needed

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.5] — Story requirements and ACs
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Phase 1 Initiation] — WhatsApp OG preview expectations
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture] — OG image file location
- [Source: _bmad-output/planning-artifacts/architecture.md#Mapping Exigences] — FR20 → opengraph-image.tsx

### Previous Story Intelligence

**From Story 2.4 (done):**
- All guest sections are Server Components
- CSS-only animations, no client-side JS
- Build passes cleanly with Next.js 16.1.6 + Turbopack

**From Story 2.1 (done):**
- Hero photo at `/public/images/hero.jpg`
- Cormorant Garamond loaded via `next/font/google` with weights 300, 400

### Git Intelligence

Commit pattern: `feat: {story-key}`. Latest: `7cd057c feat: 2-4`.

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — clean implementation.

### Completion Notes List

- Added `OG` constant object in `lib/constants.ts` with title "Ahmed & Ghizlaine vous invitent" and description
- Added `generateMetadata` export to `page.tsx` — sets `title`, `description`, `openGraph.title`, `openGraph.description` from OG constants
- Created `opengraph-image.tsx` using Next.js `ImageResponse` from `next/og`
- OG image: 1200x630px, crème background (#FAF7F2), gold border accent (#B8860B), couple names in Cormorant Garamond 300 Light (80px), gold separator, date in gold, invitation text
- Font loaded via Google Fonts CDN fetch (woff2 format) for satori rendering
- Exported `alt`, `size`, `contentType` for Next.js OG image convention
- Next.js automatically generates `og:image` meta tag from the convention file — route visible in build output as `/invite/[slug]/opengraph-image-bbgbwt`
- No new npm dependencies — `next/og` built into Next.js 16
- Build and lint pass clean

### Change Log

- 2026-02-13: Implemented Open Graph image generation and metadata

### File List

- `lib/constants.ts` — Added `OG` constant object (title, description)
- `app/(guest)/invite/[slug]/page.tsx` — Added `generateMetadata` export with OG metadata
- `app/(guest)/invite/[slug]/opengraph-image.tsx` — NEW: Dynamic OG image generation (1200x630px)
