# Story 7.1: Page d'Accueil Placeholder

Status: done

## Story

As a visiteur non-invité,
I want voir une page d'accueil claire quand j'accède au site sans lien d'invitation,
So that je comprenne que je dois contacter Ahmed ou Ghizlaine pour recevoir mon invitation.

## Acceptance Criteria

1. **Given** un visiteur qui accède à `/` (racine du site), **When** la page se charge, **Then** une page placeholder s'affiche avec un message chaleureux : "Ce site est réservé aux invités d'Ahmed & Ghizlaine. Si vous souhaitez recevoir votre invitation, n'hésitez pas à les contacter."

2. **Given** la page placeholder, **When** elle est affichée, **Then** elle utilise le même design system que le reste du site (fond crème, typographie Cormorant/Geist, palette dorée) pour rester cohérente.

3. **Given** la page sur mobile, **When** elle est affichée, **Then** le message est centré, lisible et correctement espacé sans scroll horizontal.

4. **Given** la page placeholder, **When** elle est indexée par les moteurs de recherche, **Then** les balises meta indiquent `noindex, nofollow` pour ne pas référencer le site publiquement.

## Tasks / Subtasks

- [x] **Task 1: Ajouter les constantes** (AC: #1)
  - [x] Ajouter `LANDING` constant dans `lib/constants.ts` avec titre et message

- [x] **Task 2: Réécrire app/page.tsx** (AC: #1, #2, #3, #4)
  - [x] Server Component pur (pas de `"use client"`)
  - [x] Import `LANDING` depuis `lib/constants.ts`
  - [x] Export `metadata` avec `robots: { index: false, follow: false }`
  - [x] Layout : `min-h-dvh` + `flex flex-col justify-center` + `px-6 sm:px-8`
  - [x] Titre en Cormorant Display (`font-display text-4xl font-light`)
  - [x] Séparateur doré décoratif (`w-12 h-px bg-gold-moroccan`)
  - [x] Message en Geist Sans (`font-sans text-lg text-brown-medium`)
  - [x] Pas de lien vers `/admin`

- [x] **Task 3: Vérification** (AC: #1-4)
  - [x] `npm run build` — clean, route `/` statique (`○`)
  - [x] `npm run lint` — clean

## Dev Notes

### Architecture

La page est un Server Component pur à la racine du site (`app/page.tsx`). Elle n'appartient à aucun route group — ni `(guest)` ni `(admin)`. Elle hérite uniquement du root layout (`app/layout.tsx`) qui fournit les polices Cormorant et Geist.

### Conventions respectées

| Convention | Application |
|-----------|-------------|
| Pas de `max-width` | Largeur contrôlée par `px-6 sm:px-8` uniquement |
| `min-h-dvh` pas `min-h-screen` | iOS Safari viewport |
| Flex vertical sans `items-center` | `flex flex-col justify-center` + `text-center` + `mx-auto` |
| Strings en français centralisées | `LANDING` constant dans `lib/constants.ts` |
| Server Component par défaut | Aucun `"use client"` |

### Ton de voix (recommandation UX — Sally)

Le message évite le rejet ("Vous n'êtes pas invité(e)") et utilise un ton chaleureux. Un visiteur qui tombe sur cette page est peut-être un ami qui n'a pas encore reçu son lien — on ne veut pas le froisser.

### Metadata

```typescript
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}
```

Le titre et la description sont hérités du root layout (`"Ahmed & Ghizlaine — 17 Octobre 2026"`).

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 7, Story 7.1]
- [Source: _bmad-output/planning-artifacts/prd.md — FR34]
- [Source: _bmad-output/planning-artifacts/architecture.md — Landing Page Non-Invités (FR34)]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Epic 7 — Landing Page Non-Invités]

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Debug Log References
None — clean implementation.

### Completion Notes List
- Replaced default create-next-app page with wedding landing page
- Added `LANDING` constant to `lib/constants.ts` (title + warm message)
- Server Component, no interactivity needed
- `robots: noindex, nofollow` via Next.js metadata export
- Design system cohérent : Cormorant titre, Geist corps, séparateur doré, fond crème
- Build statique (`○`) — optimal performance
- Lint clean

### File List
- `app/page.tsx` — Rewritten: landing page placeholder for non-invited visitors
- `lib/constants.ts` — Modified: added `LANDING` constant (title + message)
