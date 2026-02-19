# Story 8.3: Cadre Doré — SVG Décoratif avec Coins Arabesques

Status: done

## Story

As a invité,
I want voir un cadre doré fin avec des coins arabesques encadrant le contenu,
So that l'écran évoque un faire-part physique premium et structure visuellement le contenu.

## Acceptance Criteria

1. **Given** un visiteur accède à la page `/` **When** la page se charge **Then** un cadre doré est visible autour du contenu :
   - Filet fin (1-2px) couleur `#B8860B` (Doré Marocain)
   - Coins décoratifs arabesques géométriques en `#D4A54A` (Doré Lumineux)
   - Marge : ~24px mobile / ~48px desktop par rapport aux bords de l'écran
   - Occupe ~85% largeur mobile / ~70% largeur desktop, ~80% hauteur visible
2. **And** le composant `GoldenFrame` est dans `components/save-the-date/golden-frame.tsx`
3. **And** le SVG est inline dans le composant (pas dans `/public`)
4. **And** le cadre porte `aria-hidden="true"` (élément décoratif)
5. **And** le cadre est responsive (`sm:`, `md:`, `lg:` breakpoints Tailwind)
6. **And** le cadre est visible en mode `prefers-reduced-motion` (élément statique)
7. **And** `app/page.tsx` intègre `GoldenFrame` avec `SaveTheDateContent` à l'intérieur

## Tasks / Subtasks

- [x] Task 1: Créer le composant `GoldenFrame` avec SVG coins arabesques (AC: #1, #2, #3, #4)
  - [x] 1.1: Créer `components/save-the-date/golden-frame.tsx` — `export function GoldenFrame({ children }: { children: React.ReactNode })`
  - [x] 1.2: Cadre principal : `border` CSS 1px `border-gold-moroccan` (filet fin doré)
  - [x] 1.3: Quatre coins arabesques SVG inline — motifs géométriques fins (entrelacs/étoile 8 branches) en `#D4A54A` (Doré Lumineux)
  - [x] 1.4: SVG coins positionnés `absolute` aux quatre coins du cadre
  - [x] 1.5: Le cadre porte `aria-hidden="true"` sur les éléments décoratifs (SVG coins)
  - [x] 1.6: Server Component (zéro `"use client"`)
  - [x] 1.7: Le `{children}` est rendu à l'intérieur du cadre (le texte est encadré)
- [x] Task 2: Dimensionnement et marges responsives (AC: #1, #5)
  - [x] 2.1: Marge par rapport aux bords : `mx-6` mobile (24px), `sm:mx-8`, `lg:mx-12` desktop (~48px)
  - [x] 2.2: Dimensions : ~85% largeur mobile / ~70% desktop via `w-[85%] lg:w-[70%]` + `mx-auto`
  - [x] 2.3: Hauteur : ~80% hauteur visible via `min-h-[80dvh]`
  - [x] 2.4: Centrage vertical conservé avec `flex flex-col justify-center`
  - [x] 2.5: SVG coins dimensionnés responsive : ~24px mobile / ~32px `sm:` / ~40px `lg:`
- [x] Task 3: Mettre à jour `app/page.tsx` pour intégrer `GoldenFrame` (AC: #7)
  - [x] 3.1: Importer `GoldenFrame` depuis `@/components/save-the-date/golden-frame` (import direct, PAS de barrel)
  - [x] 3.2: Envelopper `<SaveTheDateContent />` dans `<GoldenFrame>`
  - [x] 3.3: Ajuster le layout du `<main>` : transférer les responsabilités de centrage entre `<main>` et `<GoldenFrame>`
  - [x] 3.4: Conserver `min-h-dvh`, `bg-cream-warm`, metadata `noindex, nofollow`
  - [x] 3.5: Le padding latéral `px-6 sm:px-8` est sur le `<main>`, le cadre prend sa largeur à l'intérieur
- [x] Task 4: Vérifier le comportement `prefers-reduced-motion` (AC: #6)
  - [x] 4.1: Confirmer que le cadre reste visible (élément statique, pas d'animation)
  - [x] 4.2: Pas de classe CSS qui cacherait le cadre en `prefers-reduced-motion`
- [x] Task 5: Vérifier `npm run build` et `npm run lint` sans erreur

## Dev Notes

### CRITIQUE : Conception des Coins Arabesques SVG

Les coins arabesques sont le cœur visuel de cette story. Le motif doit être :
- **Géométrique** — inspiré des entrelacs d'art islamique (zellige, étoiles à 8 branches)
- **Fin et subtil** — ne PAS concurrencer le contenu textuel
- **Cohérent** avec le sceau A&G (même famille géométrique — étoiles, lignes entrecroisées)
- **Symétrique** — un seul SVG roté/mirroré pour les 4 coins

**Approche recommandée : CSS border + SVG coins**

Le cadre est composé de deux éléments :
1. **Bordure principale** — CSS `border` 1px `border-gold-moroccan` sur le conteneur
2. **Coins décoratifs** — SVG inline positionné `absolute` à chaque coin, superposé sur la bordure

Les coins arabesques doivent être suffisamment petits (~24-40px) pour ne pas encombrer l'espace.

**SVG Corner Pattern — Référence de design :**

Un coin arabesque géométrique typique pourrait être :
- Un quart de motif étoile à 8 branches
- Des lignes entrecroisées formant un angle décoratif
- Un arc avec des volutes géométriques simples

Le SVG doit utiliser un seul `viewBox` et être roté via `transform: rotate()` + `scale(-1, 1)` pour les 4 positions :
- Top-left : SVG original
- Top-right : `scaleX(-1)` (miroir horizontal)
- Bottom-left : `scaleY(-1)` (miroir vertical)
- Bottom-right : `scale(-1, -1)` (miroir double)

```tsx
// Exemple de structure
function CornerArabesque({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Motif géométrique arabesque */}
      <path d="..." stroke="#D4A54A" strokeWidth="1.5" />
    </svg>
  )
}
```

### Structure du composant `GoldenFrame`

```tsx
// components/save-the-date/golden-frame.tsx
import type { ReactNode } from 'react'

export function GoldenFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-[85%] min-h-[80dvh] border border-gold-moroccan flex flex-col justify-center lg:w-[70%]">
      {/* Coins arabesques — positionnés absolute, aria-hidden */}
      <svg aria-hidden="true" className="absolute -top-px -left-px w-6 h-6 lg:w-10 lg:h-10" ...>
        {/* top-left corner */}
      </svg>
      <svg aria-hidden="true" className="absolute -top-px -right-px w-6 h-6 lg:w-10 lg:h-10 -scale-x-100" ...>
        {/* top-right = mirrored */}
      </svg>
      <svg aria-hidden="true" className="absolute -bottom-px -left-px w-6 h-6 lg:w-10 lg:h-10 -scale-y-100" ...>
        {/* bottom-left = mirrored */}
      </svg>
      <svg aria-hidden="true" className="absolute -bottom-px -right-px w-6 h-6 lg:w-10 lg:h-10 -scale-100" ...>
        {/* bottom-right = double mirror */}
      </svg>

      {/* Contenu */}
      {children}
    </div>
  )
}
```

### Refactoring `page.tsx` — Structure attendue

```tsx
// app/page.tsx après intégration
import type { Metadata } from 'next'
import { GoldenFrame } from '@/components/save-the-date/golden-frame'
import { SaveTheDateContent } from '@/components/save-the-date/save-the-date-content'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function SaveTheDatePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-cream-warm px-6 sm:px-8">
      <GoldenFrame>
        <SaveTheDateContent />
      </GoldenFrame>
    </main>
  )
}
```

**⚠️ ATTENTION : `items-center` sur le `<main>` est OK ICI** car le `GoldenFrame` est un **bloc à largeur fixée** (`w-[85%]` / `w-[70%]`), PAS un conteneur flex-col de texte. Le bug `items-center` + texte shrink-wrap ne s'applique que quand le texte est un enfant direct du flex container. Ici, le texte est dans `SaveTheDateContent` qui est enfant de `GoldenFrame` — les largeurs sont contrôlées. Le `items-center` centre le `GoldenFrame` horizontalement dans le `<main>`.

**Alternative plus sûre :** utiliser `mx-auto` sur le `GoldenFrame` au lieu de `items-center` sur le `<main>`, pour rester cohérent avec le pattern MEMORY.md. Le `GoldenFrame` a déjà `mx-auto`, donc le `items-center` peut être omis du `<main>`.

### Dimensionnement du cadre — Calculs

| Breakpoint | Largeur cadre | Marge latérale effective | Hauteur cadre |
|-----------|--------------|------------------------|--------------|
| Mobile (360px) | 85% = 306px | ~27px chaque côté | 80dvh |
| SM (640px) | 85% = 544px | ~48px chaque côté | 80dvh |
| LG (1024px) | 70% = 717px | ~154px chaque côté | 80dvh |
| Desktop (1440px) | 70% = 1008px | ~216px chaque côté | 80dvh |

**Note :** Le `px-6 sm:px-8` est sur le `<main>`, pas sur le cadre. Le cadre utilise `w-[85%]` et `mx-auto` pour son propre dimensionnement. La marge effective entre le cadre et les bords de l'écran est le `px-*` du parent + l'espace restant du `w-[85%]`.

### SVG Budget

Le cadre doré contribue au budget total des assets SVG < 150 Ko (NFR-2).
Estimation : 4 coins SVG × ~200 octets = ~800 octets total — négligeable.

### Previous Story Intelligence (8.1 + 8.2)

- `font-display` → Cormorant Garamond fonctionne via `--font-cormorant`
- `bg-cream-warm` → `#FAF7F2` fonctionne
- `text-brown-deep`, `text-brown-medium`, `bg-gold-moroccan` — tokens couleur disponibles
- `border-gold-moroccan` devrait fonctionner (token `--color-gold-moroccan` existe dans `@theme inline`)
- `SaveTheDateContent` est dans `components/save-the-date/save-the-date-content.tsx` avec `clamp()` typography
- `GoldenSeparator` est dans `components/save-the-date/golden-separator.tsx`
- `page.tsx` actuel : `flex min-h-dvh flex-col justify-center bg-cream-warm px-6 sm:px-8` avec `<SaveTheDateContent />`
- Build + lint passent
- Tokens animation Save the Date définis dans `globals.css` (pas utilisés par cette story — le cadre est statique)

### `GoldenFrame` — Design Decisions

1. **`children` prop** — contrairement aux autres composants save-the-date (auto-suffisants, zéro props), `GoldenFrame` DOIT accepter `children` car il enveloppe le contenu. C'est le seul composant avec cette pattern.

2. **Pas de `position: fixed`** — le cadre est dans le flux normal du document. Il est centré via flexbox du parent (`<main>`). Pas besoin de `fixed` ou `absolute` sur le cadre lui-même.

3. **`min-h-[80dvh]`** — utiliser `dvh` (dynamic viewport height) pour iOS Safari, cohérent avec le `min-h-dvh` du `<main>`.

4. **Pas de `max-w-*`** — respecter la règle MEMORY.md. Le cadre utilise `w-[85%]` / `w-[70%]`, pas `max-w-*`.

### Project Structure Notes

- **`components/save-the-date/golden-frame.tsx`** : NOUVEAU — cadre doré avec coins arabesques
- **`app/page.tsx`** : MODIFIÉ — ajout import `GoldenFrame`, wrapping du contenu
- Imports directs (PAS de barrel `index.tsx`)

### Architecture Compliance

| Règle | Conformité |
|-------|-----------|
| Server Component pur, zéro `"use client"` | GoldenFrame est Server Component |
| SVG inline dans le composant | Coins arabesques SVG inline (pas dans `/public`) |
| Tailwind CSS pour layout + style statique | Classes Tailwind + border CSS |
| Import direct (pas de barrel) | `import { GoldenFrame } from '@/components/save-the-date/golden-frame'` |
| `aria-hidden="true"` sur éléments décoratifs | SVG coins + bordure portent aria-hidden |
| Export PascalCase | `GoldenFrame` |
| Fichier kebab-case | `golden-frame.tsx` |
| Pas de `max-w-*` | Largeur via `w-[85%]` / `w-[70%]` |
| `min-h-dvh` pas `min-h-screen` | Utilise `dvh` pour iOS Safari |
| Progressive enhancement | Cadre visible par défaut (élément statique) |
| Pas d'animation sur le cadre | Le cadre est statique — pas de keyframes, pas de transition |

### Anti-Patterns à ÉVITER

- **Ne PAS** ajouter `"use client"` sur le composant
- **Ne PAS** mettre les SVG dans `/public` — ils doivent être inline
- **Ne PAS** utiliser `max-w-*` pour contrôler la largeur du cadre
- **Ne PAS** animer le cadre (c'est un élément statique permanent)
- **Ne PAS** utiliser `position: fixed` sur le cadre (il est dans le flux)
- **Ne PAS** cacher le cadre en `prefers-reduced-motion` (il est statique, pas d'animation)
- **Ne PAS** rendre les coins SVG trop grands ou trop complexes (subtilité requise)
- **Ne PAS** utiliser `items-center` sur le flex-col de texte (mais OK sur le `<main>` si le GoldenFrame a une largeur fixe — voir Dev Notes)
- **Ne PAS** hardcoder les couleurs — utiliser les tokens Tailwind (`border-gold-moroccan`, `text-gold-luminous`)
- **Ne PAS** créer de barrel `index.tsx`

### References

- [Source: _bmad-output/planning-artifacts/epics-save-the-date.md#Story 1.3]
- [Source: _bmad-output/planning-artifacts/architecture-save-the-date.md#Component Architecture]
- [Source: _bmad-output/planning-artifacts/architecture-save-the-date.md#CSS Patterns]
- [Source: _bmad-output/planning-artifacts/ux-design-save-the-date.md#Design Direction — Cadre Doré]
- [Source: _bmad-output/planning-artifacts/ux-design-save-the-date.md#Visual Design Foundation]
- [Source: _bmad-output/planning-artifacts/ux-design-save-the-date.md#Responsive Design & Accessibilité]
- [Source: _bmad-output/implementation-artifacts/8-2-contenu-save-the-date-html-semantique.md#Completion Notes]
- [Source: app/page.tsx (current layout to modify)]
- [Source: app/globals.css (existing tokens — --color-gold-moroccan, --color-gold-luminous)]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Bug corrigé : `aria-hidden="true"` initialement placé sur le `<div>` englobant de `GoldenFrame` aurait caché le contenu enfant (`SaveTheDateContent`) des lecteurs d'écran. Corrigé en supprimant `aria-hidden` du div englobant — chaque SVG `CornerArabesque` porte déjà son propre `aria-hidden="true"`.
- `pointer-events-none` / `pointer-events-auto` pattern supprimé — inutile, le cadre ne doit pas bloquer les interactions.

### Completion Notes List

- Task 1 : `GoldenFrame` créé dans `components/save-the-date/golden-frame.tsx`. Server Component, `children` prop. Cadre CSS `border border-gold-moroccan`. 4 coins SVG arabesques géométriques (`CornerArabesque`) avec entrelacs cubiques + losange décoratif en `#D4A54A`. Coins positionnés `absolute` aux 4 coins, miroir via `scale` transforms (`-scale-x-100`, `-scale-y-100`, `-scale-100`). `aria-hidden="true"` sur chaque SVG individuellement (pas sur le conteneur).
- Task 2 : Dimensionnement responsive intégré dans Task 1 — `w-[85%] lg:w-[70%]` + `mx-auto`, `min-h-[80dvh]`, `flex flex-col justify-center`. SVG coins `h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10` (24px/32px/40px).
- Task 3 : `app/page.tsx` mis à jour — import `GoldenFrame`, `<SaveTheDateContent />` enveloppé dans `<GoldenFrame>`. `<main>` conserve `min-h-dvh`, `bg-cream-warm`, `flex flex-col justify-center`, `px-6 sm:px-8`. Metadata `noindex, nofollow` conservée.
- Task 4 : Vérifié — le cadre est 100% statique (border CSS + SVG), aucune animation, aucune classe `motion-safe:` ou `motion-reduce:`. Visible dans tous les modes.
- Task 5 : `npm run lint` et `npm run build` passent sans erreur. Page `/` générée en statique.

### File List

- `components/save-the-date/golden-frame.tsx` — nouveau (cadre doré avec coins arabesques SVG)
- `app/page.tsx` — modifié (ajout import GoldenFrame, wrapping du contenu)
