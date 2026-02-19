# Story 8.1: Fondation — Layout, Police & Tokens CSS

Status: done

## Story

As a invité,
I want la page `/` s'affiche avec un fond crème `#FAF7F2` et la police Cormorant Garamond chargée,
So that je vois immédiatement un écran élégant et cohérent avec l'univers du mariage.

## Acceptance Criteria

1. **Given** un visiteur accède à la page `/` **When** la page se charge **Then** le fond est `#FAF7F2` (crème chaud) et occupe `min-h-dvh`
2. **And** la police Cormorant Garamond (poids 300, 400) est chargée via `next/font/google` dans `app/layout.tsx` avec la variable CSS `--font-cormorant`
3. **And** les tokens d'animation sont définis dans `globals.css` (`@theme inline`) : `--animation-act1` (1500ms), `--animation-act2` (1200ms), `--animation-pause` (300ms), `--animation-act3` (2000ms), `--easing-flight`, `--easing-land`, `--easing-reveal`
4. **And** la page est un Server Component (zéro `"use client"`)
5. **And** `app/page.tsx` remplace l'ancienne landing page non-invités

## Tasks / Subtasks

- [x] Task 1: Vérifier la police Cormorant Garamond dans `layout.tsx` (AC: #2)
  - [x] 1.1: Confirmer que Cormorant Garamond (300, 400) est déjà chargée — **DÉJÀ FAIT** (voir Dev Notes)
  - [x] 1.2: Confirmer que `--font-cormorant` variable est appliquée sur `<body>` — **DÉJÀ FAIT**
  - [x] 1.3: Confirmer que `--font-display: var(--font-cormorant)` est dans `@theme inline` — **DÉJÀ FAIT**
- [x] Task 2: Ajouter les tokens d'animation Save the Date dans `globals.css` (AC: #3)
  - [x] 2.1: Ajouter les 4 tokens durée dans `@theme inline` : `--animation-act1: 1500ms`, `--animation-act2: 1200ms`, `--animation-pause: 300ms`, `--animation-act3: 2000ms`
  - [x] 2.2: Ajouter les 3 tokens easing dans `@theme inline` : `--easing-flight: cubic-bezier(0.25, 0.1, 0.25, 1.0)`, `--easing-land: cubic-bezier(0.34, 1.56, 0.64, 1)`, `--easing-reveal: cubic-bezier(0.0, 0.0, 0.2, 1)`
- [x] Task 3: Créer le dossier `components/save-the-date/` (pas de fichier pour l'instant)
- [x] Task 4: Remplacer `app/page.tsx` par un squelette Save the Date (AC: #1, #4, #5)
  - [x] 4.1: Nouveau `app/page.tsx` comme Server Component (zéro `"use client"`)
  - [x] 4.2: Layout `min-h-dvh`, fond crème via `bg-cream-warm` (token existant)
  - [x] 4.3: Centrage vertical avec `flex flex-col justify-center` (PAS `items-center`)
  - [x] 4.4: Metadata `noindex, nofollow` conservée
  - [x] 4.5: Ajouter un placeholder texte temporaire (sera remplacé par Story 8.2)
- [x] Task 5: Ajouter les constantes Save the Date dans `lib/constants.ts` (FR29)
  - [x] 5.1: Objet `SAVE_THE_DATE` avec `title`, `date`, `city`, `message`
  - [x] 5.2: Objet `SAVE_THE_DATE_OG` avec `title`, `description`
- [x] Task 6: Vérifier `npm run build` et `npm run lint` sans erreur

## Dev Notes

### CRITIQUE : Cormorant Garamond DÉJÀ chargée

La police Cormorant Garamond est **déjà configurée** dans le projet. NE PAS la re-déclarer.

**Fichier : `app/layout.tsx` (lignes 2, 5-9, 31)**
```tsx
import { Cormorant_Garamond, Geist } from "next/font/google";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
});
// ...
<body className={`${cormorant.variable} ${geistSans.variable} antialiased`}>
```

**Fichier : `globals.css` (ligne 39)**
```css
--font-display: var(--font-cormorant);
```

La classe Tailwind `font-display` utilise déjà `--font-cormorant`. Aucune modification de `layout.tsx` n'est nécessaire.

### Tokens d'animation — Emplacement exact

Les tokens doivent être ajoutés dans le bloc `@theme inline { ... }` existant de `globals.css`, **après** les tokens d'animation existants (lignes 56-64). NE PAS créer un nouveau bloc `@theme inline`.

**Section existante (ne pas modifier) :**
```css
/* Animation */
--animate-duration-entry: 600ms;
--animate-duration-state: 300ms;
/* ... */
```

**Ajouter APRÈS cette section :**
```css
/* Save the Date — Animation tokens */
--animation-act1: 1500ms;
--animation-act2: 1200ms;
--animation-pause: 300ms;
--animation-act3: 2000ms;
--easing-flight: cubic-bezier(0.25, 0.1, 0.25, 1.0);
--easing-land: cubic-bezier(0.34, 1.56, 0.64, 1);
--easing-reveal: cubic-bezier(0.0, 0.0, 0.2, 1);
```

### Remplacement `app/page.tsx` — Ancien contenu

Le `page.tsx` actuel est la landing non-invités (Story 7.1). Il importe `LANDING` de `lib/constants.ts` et affiche un titre + message.

**Le nouveau `page.tsx` doit :**
1. Conserver `robots: { index: false, follow: false }`
2. Utiliser `bg-cream-warm` (token `--color-cream-warm: #FAF7F2` déjà défini ligne 27)
3. Utiliser `min-h-dvh` (PAS `min-h-screen` — iOS Safari)
4. Centrage : `flex flex-col justify-center` + `text-center` sur les enfants + `mx-auto` sur les blocs
5. **JAMAIS** `flex flex-col items-center` (bug de shrink-wrap texte — MEMORY.md)
6. Être un Server Component (zéro `"use client"`)
7. Contenu placeholder temporaire — sera remplacé en Story 8.2

### Constantes Save the Date — `lib/constants.ts`

Ajouter à la fin du fichier (convention FR29 : tous les strings en français centralisés) :

```typescript
export const SAVE_THE_DATE = {
  title: 'Ahmed & Ghizlaine',
  date: '17 Octobre 2026',
  dateTime: '2026-10-17',
  city: 'Casablanca',
  message:
    'Une date à retenir, une histoire à écrire ensemble\u2026 les détails suivront bientôt.',
} as const

export const SAVE_THE_DATE_OG = {
  title: 'Ahmed & Ghizlaine — Save the Date',
  description: '17 Octobre 2026 \u00b7 Casablanca',
} as const
```

**Note :** `\u2026` = `…` (points de suspension), `\u00b7` = `·` (point médian). Utiliser les echappements Unicode pour éviter les problèmes d'encodage dans le fichier.

### Layout Rule : NO max-width ANYWHERE

**JAMAIS** utiliser `max-w-sm`, `max-w-md`, `max-w-lg`, etc. La largeur est contrôlée uniquement par padding (`px-6`, `sm:px-8`).

### Tokens couleur existants (dans `@theme inline`)

| Token Tailwind | Hex | Usage |
|----------------|-----|-------|
| `cream-warm` | `#FAF7F2` | Fond de page |
| `gold-moroccan` | `#B8860B` | Accents dorés |
| `brown-deep` | `#2C2418` | Texte principal |
| `gold-luminous` | `#D4A54A` | Doré clair |
| `gold-veil` | `#E8D5A8` | Ombre douce |
| `white-broken` | `#FFFDF9` | Fond enveloppe |
| `brown-medium` | `#6B5D4F` | Texte secondaire |

Ces tokens sont DÉJÀ définis. NE PAS les re-déclarer.

### Project Structure Notes

- **`components/save-the-date/`** : Créer le dossier vide. Les composants seront ajoutés à partir de Story 8.2.
- **`app/page.tsx`** : Remplacement direct (pas de suppression puis création — c'est le même fichier).
- **`app/layout.tsx`** : AUCUNE modification nécessaire.
- **`app/globals.css`** : Ajout de 7 tokens dans le bloc `@theme inline` existant. Rien d'autre.
- **`lib/constants.ts`** : Ajout de 2 objets (`SAVE_THE_DATE`, `SAVE_THE_DATE_OG`).
- Pas de barrel `index.tsx` dans `components/save-the-date/` — imports directs.

### Architecture Compliance

| Règle | Conformité |
|-------|-----------|
| Server Component pur, zéro `"use client"` | Le nouveau `page.tsx` NE DOIT PAS avoir `"use client"` |
| CSS pur, zéro JS | Les tokens sont des custom properties CSS |
| SVG inline dans les composants (pas `/public`) | Pas de SVG dans cette story |
| Tailwind CSS 4 `@theme inline` | Les tokens sont ajoutés dans le bloc existant |
| Progressive enhancement | Le contenu est visible par défaut (`opacity: 1` natif) |
| `min-h-dvh` pas `min-h-screen` | iOS Safari viewport fix |
| Cormorant Garamond via `font-display` | Classe Tailwind `font-display` disponible |
| `noindex, nofollow` | Metadata conservée |

### Anti-Patterns à ÉVITER

- **Ne PAS** ajouter `"use client"` sur `page.tsx`
- **Ne PAS** utiliser `items-center` sur un `flex-col` (texte shrink-wrap)
- **Ne PAS** utiliser `max-w-*` pour contrôler la largeur
- **Ne PAS** créer de nouveau bloc `@theme inline` (utiliser l'existant)
- **Ne PAS** re-déclarer Cormorant Garamond dans `layout.tsx`
- **Ne PAS** hardcoder les valeurs d'easing ou de durée en dehors des tokens
- **Ne PAS** utiliser `min-h-screen` (utiliser `min-h-dvh`)

### References

- [Source: _bmad-output/planning-artifacts/architecture-save-the-date.md#CSS Architecture]
- [Source: _bmad-output/planning-artifacts/architecture-save-the-date.md#Component Architecture]
- [Source: _bmad-output/planning-artifacts/ux-design-save-the-date.md#Design System Foundation]
- [Source: _bmad-output/planning-artifacts/ux-design-save-the-date.md#Stratégie de Personnalisation]
- [Source: _bmad-output/planning-artifacts/epics-save-the-date.md#Story 1.1]
- [Source: app/layout.tsx (Cormorant Garamond already loaded)]
- [Source: app/globals.css (tokens and @theme inline block)]
- [Source: app/page.tsx (current landing page to replace)]
- [Source: lib/constants.ts (FR29 string centralization)]

### Git Intelligence

Derniers commits pertinents :
- `b51b5b3 feat: fin du sprint` — fin du sprint principal (Epics 1-7)
- `ef409ca feat: epic 7 landing page` — création de la landing non-invités actuelle (`page.tsx`)
- Pattern de commit : `feat: <story-key>` après code review

La landing actuelle (`page.tsx`) est simple : titre + séparateur + message, centrée en `flex flex-col justify-center`. Le nouveau Save the Date suit le même pattern de layout mais avec un contenu enrichi.

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

Aucun problème rencontré.

### Completion Notes List

- Task 1 : Cormorant Garamond (300, 400) déjà chargée dans `layout.tsx` avec variable `--font-cormorant`. `--font-display` déjà mappé dans `@theme inline`. Aucune modification nécessaire.
- Task 2 : 7 tokens d'animation ajoutés dans `@theme inline` de `globals.css` : 4 durées (`--animation-act1/2/pause/3`) + 3 easings (`--easing-flight/land/reveal`).
- Task 3 : Dossier `components/save-the-date/` créé avec `.gitkeep`.
- Task 4 : `app/page.tsx` remplacé. Server Component pur, `min-h-dvh`, `bg-cream-warm`, `flex flex-col justify-center`, contenu complet avec `h1`, `time`, `address`, séparateur `aria-hidden`, `blockquote`. Metadata `noindex, nofollow` conservée. Import de `SAVE_THE_DATE` depuis `lib/constants.ts`.
- Task 5 : `SAVE_THE_DATE` et `SAVE_THE_DATE_OG` ajoutés dans `lib/constants.ts` (convention FR29). Utilisation de caractères Unicode pour `…` et `·`.
- Task 6 : `npm run lint` et `npm run build` passent sans erreur. Page `/` générée en statique.

**Code Review Fixes (2026-02-18) :**
- Fix [MEDIUM] : Supprimé `LANDING` dead code de `lib/constants.ts` (plus importé nulle part)
- Fix [LOW] : Remplacé `<div>` par `<main>` landmark dans `app/page.tsx` (a11y)
- Note [LOW] : `clamp()` typographie reporté à Story 8.2 (SaveTheDateContent)

### File List

- `app/globals.css` — modifié (ajout 7 tokens animation dans `@theme inline`)
- `app/page.tsx` — remplacé (landing non-invités → Save the Date avec `<main>` landmark)
- `lib/constants.ts` — modifié (ajout `SAVE_THE_DATE` + `SAVE_THE_DATE_OG`, suppression `LANDING` dead code)
- `components/save-the-date/.gitkeep` — nouveau (dossier vide pour futures stories)
