# Story 8.2: Contenu Save the Date — HTML Sémantique & Texte

Status: done

## Story

As a invité,
I want voir les prénoms du couple, la date, le lieu et un message poétique affichés de manière lisible et élégante,
So that je retiens immédiatement la date et le lieu du mariage.

## Acceptance Criteria

1. **Given** un visiteur accède à la page `/` **When** la page se charge **Then** le contenu suivant est affiché, centré verticalement et horizontalement :
   - `h1` : "Ahmed & Ghizlaine" en Cormorant Garamond 300, 48px mobile / 80px desktop, couleur `#2C2418`
   - `time` : "17 Octobre 2026" en Cormorant Garamond 400, 36px mobile / 56px desktop, couleur `#2C2418`
   - `address` : "Casablanca" en Cormorant Garamond 400, 28px mobile / 40px desktop, couleur `#2C2418`
   - Séparateur doré : trait horizontal `w-12`, `h-px`, couleur `#B8860B`, centré (`mx-auto`)
   - `blockquote` : « Une date à retenir, une histoire à écrire ensemble… les détails suivront bientôt. » en Geist Sans 400 italique, 18px, couleur `#6B5D4F`
2. **And** le composant `SaveTheDateContent` est dans `components/save-the-date/save-the-date-content.tsx`
3. **And** le composant `GoldenSeparator` est dans `components/save-the-date/golden-separator.tsx`
4. **And** le layout utilise `flex` + `justify-center` + `text-center` sur les enfants + `mx-auto` sur les blocs (PAS `items-center` sur le flex-col)
5. **And** l'espacement entre les lignes respecte la hiérarchie : 32px entre prénoms↔date, 16px entre date↔lieu, 16px entre lieu↔séparateur, 16px entre séparateur↔message
6. **And** les éléments décoratifs (séparateur) portent `aria-hidden="true"`
7. **And** le contenu textuel est accessible nativement aux lecteurs d'écran (FR-STD-9)
8. **And** le contenu est visible par défaut (`opacity: 1`) — progressive enhancement (FR-STD-8)

## Tasks / Subtasks

- [x] Task 1: Créer le composant `GoldenSeparator` (AC: #3, #6)
  - [x] 1.1: Créer `components/save-the-date/golden-separator.tsx` — `export function GoldenSeparator()`
  - [x] 1.2: Trait doré `w-12 h-px bg-gold-moroccan mx-auto` avec `aria-hidden="true"`
  - [x] 1.3: Server Component (zéro `"use client"`)
- [x] Task 2: Créer le composant `SaveTheDateContent` (AC: #1, #2, #4, #5, #7, #8)
  - [x] 2.1: Créer `components/save-the-date/save-the-date-content.tsx` — `export function SaveTheDateContent()`
  - [x] 2.2: Extraire le contenu inline de `page.tsx` dans ce composant
  - [x] 2.3: HTML sémantique : `h1` (prénoms), `time` (date), `address` (lieu), `GoldenSeparator`, `blockquote` (message)
  - [x] 2.4: Importer `SAVE_THE_DATE` depuis `@/lib/constants` (convention FR29)
  - [x] 2.5: Typographie avec `clamp()` pour scaling fluide mobile→desktop (recommandation code review 8.1)
  - [x] 2.6: Espacement hiérarchique : `mt-8` (32px prénoms→date), `mt-4` (16px date→lieu→séparateur→message)
  - [x] 2.7: Layout : `text-center` + `mx-auto` sur les blocs (PAS `items-center`)
  - [x] 2.8: Contenu visible par défaut (`opacity: 1` natif) — progressive enhancement
- [x] Task 3: Mettre à jour `app/page.tsx` pour utiliser les composants (AC: #2, #3)
  - [x] 3.1: Importer `SaveTheDateContent` depuis `components/save-the-date/` (import direct, PAS de barrel)
  - [x] 3.2: Remplacer le contenu inline par `<SaveTheDateContent />`
  - [x] 3.3: Conserver `<main>`, `min-h-dvh`, `bg-cream-warm`, `flex flex-col justify-center`, metadata `noindex, nofollow`
  - [x] 3.4: Supprimer l'import direct de `SAVE_THE_DATE` depuis `page.tsx` (déplacé dans `SaveTheDateContent`)
- [x] Task 4: Supprimer `.gitkeep` de `components/save-the-date/` (plus nécessaire)
- [x] Task 5: Vérifier `npm run build` et `npm run lint` sans erreur

## Dev Notes

### CRITIQUE : Extraction du contenu inline de `page.tsx`

Le `page.tsx` actuel (Story 8.1) contient le contenu Save the Date **directement en inline**. Cette story extrait ce contenu en composants dédiés. C'est un **refactoring d'extraction**, pas une création from scratch.

**Code actuel dans `app/page.tsx` (à extraire) :**
```tsx
<main className="flex min-h-dvh flex-col justify-center bg-cream-warm px-6 sm:px-8">
  <div className="mx-auto text-center">
    <h1 className="font-display text-5xl font-light text-brown-deep lg:text-[5rem]">
      {SAVE_THE_DATE.title}
    </h1>
    <time dateTime={SAVE_THE_DATE.dateTime}
      className="mt-8 block font-display text-4xl font-normal text-brown-deep lg:text-[3.5rem]">
      {SAVE_THE_DATE.date}
    </time>
    <address className="mt-4 font-display text-[1.75rem] font-normal not-italic text-brown-deep lg:text-[2.5rem]">
      {SAVE_THE_DATE.city}
    </address>
    <div aria-hidden="true" className="mx-auto mt-4 h-px w-12 bg-gold-moroccan" />
    <blockquote className="mt-4 font-sans text-lg italic text-brown-medium">
      {SAVE_THE_DATE.message}
    </blockquote>
  </div>
</main>
```

### Typographie : utiliser `clamp()` (recommandation code review 8.1)

Le code review de Story 8.1 a noté que les tailles typographiques sautent brutalement au breakpoint `lg`. Le UX Design recommande `clamp()` pour une transition fluide.

**Remplacement :**

| Élément | Avant (8.1) | Après (8.2 avec clamp) |
|---------|-------------|----------------------|
| h1 prénoms | `text-5xl lg:text-[5rem]` | `text-[clamp(3rem,5vw+1rem,5rem)]` |
| time date | `text-4xl lg:text-[3.5rem]` | `text-[clamp(2.25rem,3.5vw+0.75rem,3.5rem)]` |
| address lieu | `text-[1.75rem] lg:text-[2.5rem]` | `text-[clamp(1.75rem,2.5vw+0.5rem,2.5rem)]` |
| blockquote msg | `text-lg` | `text-lg` (inchangé — même taille mobile/desktop) |

**Note :** `clamp(min, preferred, max)` — le `preferred` value doit être en `vw` ou `vw+rem` pour scaler fluidement. Les valeurs ci-dessus sont des suggestions — à ajuster si nécessaire pour respecter les 48px mobile / 80px desktop.

### `GoldenSeparator` — Composant simple

```tsx
// components/save-the-date/golden-separator.tsx
export function GoldenSeparator() {
  return <div aria-hidden="true" className="mx-auto h-px w-12 bg-gold-moroccan" />
}
```

**Note :** Le séparateur NE doit PAS avoir de `mt-*` — l'espacement est contrôlé par le parent (`SaveTheDateContent`) pour respecter la hiérarchie d'espacement. Le séparateur est un composant réutilisable et autonome.

### `SaveTheDateContent` — Structure

```tsx
// components/save-the-date/save-the-date-content.tsx
import { SAVE_THE_DATE } from '@/lib/constants'
import { GoldenSeparator } from '@/components/save-the-date/golden-separator'

export function SaveTheDateContent() {
  return (
    <div className="mx-auto text-center">
      <h1 className="font-display font-light text-brown-deep text-[clamp(3rem,5vw+1rem,5rem)]">
        {SAVE_THE_DATE.title}
      </h1>
      <time dateTime={SAVE_THE_DATE.dateTime}
        className="mt-8 block font-display font-normal text-brown-deep text-[clamp(2.25rem,3.5vw+0.75rem,3.5rem)]">
        {SAVE_THE_DATE.date}
      </time>
      <address className="mt-4 font-display font-normal not-italic text-brown-deep text-[clamp(1.75rem,2.5vw+0.5rem,2.5rem)]">
        {SAVE_THE_DATE.city}
      </address>
      <div className="mt-4">
        <GoldenSeparator />
      </div>
      <blockquote className="mt-4 font-sans text-lg italic text-brown-medium">
        {SAVE_THE_DATE.message}
      </blockquote>
    </div>
  )
}
```

### `page.tsx` après refactoring

```tsx
// app/page.tsx
import type { Metadata } from 'next'
import { SaveTheDateContent } from '@/components/save-the-date/save-the-date-content'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function SaveTheDatePage() {
  return (
    <main className="flex min-h-dvh flex-col justify-center bg-cream-warm px-6 sm:px-8">
      <SaveTheDateContent />
    </main>
  )
}
```

### Previous Story Intelligence (8.1)

- `font-display` classe Tailwind fonctionne (mappé à `--font-cormorant`)
- `bg-cream-warm` fonctionne (mappé à `#FAF7F2`)
- `text-brown-deep`, `text-brown-medium`, `bg-gold-moroccan` — tous les tokens couleur fonctionnent
- `<main>` landmark ajouté en code review (conserver)
- `SAVE_THE_DATE` constant dans `lib/constants.ts` avec `title`, `date`, `dateTime`, `city`, `message`
- `components/save-the-date/` existe avec un `.gitkeep`
- Build + lint passent

### Project Structure Notes

- **`components/save-the-date/save-the-date-content.tsx`** : NOUVEAU — composant principal
- **`components/save-the-date/golden-separator.tsx`** : NOUVEAU — composant séparateur
- **`app/page.tsx`** : MODIFIÉ — inline → import composant
- **`components/save-the-date/.gitkeep`** : SUPPRIMÉ — plus nécessaire avec les vrais fichiers
- Imports directs (PAS de barrel `index.tsx`)

### Architecture Compliance

| Règle | Conformité |
|-------|-----------|
| Server Component pur, zéro `"use client"` | Les deux composants sont Server Components |
| Tailwind CSS pour layout + style statique | Classes Tailwind uniquement |
| Import direct (pas de barrel) | `import { SaveTheDateContent } from '@/components/save-the-date/save-the-date-content'` |
| Convention FR29 (strings centralisés) | `SAVE_THE_DATE` importé depuis `lib/constants.ts` |
| `aria-hidden="true"` sur éléments décoratifs | GoldenSeparator porte `aria-hidden` |
| Export PascalCase | `SaveTheDateContent`, `GoldenSeparator` |
| Fichier kebab-case | `save-the-date-content.tsx`, `golden-separator.tsx` |
| Progressive enhancement | Contenu visible par défaut (`opacity: 1` natif) |
| Layout : NO `items-center` | `text-center` + `mx-auto` (bug shrink-wrap MEMORY.md) |
| Layout : NO `max-w-*` | Largeur par padding uniquement |

### Anti-Patterns à ÉVITER

- **Ne PAS** utiliser `items-center` sur un `flex-col` (bug shrink-wrap — MEMORY.md)
- **Ne PAS** utiliser `max-w-*` pour contrôler la largeur
- **Ne PAS** ajouter `"use client"` sur les composants
- **Ne PAS** créer de barrel `index.tsx`
- **Ne PAS** mettre du margin (`mt-*`) sur `GoldenSeparator` — l'espacement est géré par le parent
- **Ne PAS** hardcoder les strings — utiliser `SAVE_THE_DATE` de `lib/constants.ts`
- **Ne PAS** utiliser `opacity: 0` par défaut sur le contenu (progressive enhancement)

### References

- [Source: _bmad-output/planning-artifacts/epics-save-the-date.md#Story 1.2]
- [Source: _bmad-output/planning-artifacts/architecture-save-the-date.md#Component Architecture]
- [Source: _bmad-output/planning-artifacts/architecture-save-the-date.md#CSS Patterns]
- [Source: _bmad-output/planning-artifacts/ux-design-save-the-date.md#Système Typographique]
- [Source: _bmad-output/planning-artifacts/ux-design-save-the-date.md#Système d'Espacement & Layout]
- [Source: _bmad-output/implementation-artifacts/8-1-fondation-layout-police-tokens-css.md#Code Review Fixes]
- [Source: app/page.tsx (current inline content to extract)]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

Aucun problème rencontré.

### Completion Notes List

- Task 1 : `GoldenSeparator` créé dans `components/save-the-date/golden-separator.tsx`. Server Component, `aria-hidden="true"`, `w-12 h-px bg-gold-moroccan mx-auto`. Pas de margin — espacement géré par le parent.
- Task 2 : `SaveTheDateContent` créé dans `components/save-the-date/save-the-date-content.tsx`. Contenu inline extrait de `page.tsx`. HTML sémantique (`h1`, `time`, `address`, `blockquote`). Typographie `clamp()` pour scaling fluide : h1 `clamp(3rem,5vw+1rem,5rem)`, time `clamp(2.25rem,3.5vw+0.75rem,3.5rem)`, address `clamp(1.75rem,2.5vw+0.5rem,2.5rem)`. Layout `text-center` + `mx-auto` (PAS `items-center`). Espacement hiérarchique `mt-8`/`mt-4`. Import `SAVE_THE_DATE` depuis `lib/constants.ts`. Progressive enhancement (opacity: 1 natif).
- Task 3 : `app/page.tsx` refactoré — import direct de `SaveTheDateContent`, suppression de l'import `SAVE_THE_DATE`. Conservation de `<main>`, `min-h-dvh`, `bg-cream-warm`, `flex flex-col justify-center`, metadata `noindex, nofollow`.
- Task 4 : `.gitkeep` supprimé de `components/save-the-date/` (plus nécessaire).
- Task 5 : `npm run lint` et `npm run build` passent sans erreur. Page `/` générée en statique.

### File List

- `components/save-the-date/golden-separator.tsx` — nouveau (composant séparateur doré)
- `components/save-the-date/save-the-date-content.tsx` — nouveau (composant contenu principal)
- `app/page.tsx` — modifié (inline → import composant, suppression import SAVE_THE_DATE)
- `components/save-the-date/.gitkeep` — supprimé (remplacé par les vrais fichiers)
