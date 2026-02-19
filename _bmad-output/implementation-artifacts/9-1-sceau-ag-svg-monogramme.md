# Story 9.1: Sceau A&G — SVG Monogramme avec Entrelacs Arabesques

Status: done

## Story

As a invité,
I want voir un sceau doré portant les initiales "A&G" entouré d'entrelacs géométriques inspirés de l'art islamique,
So that le cachet personnalisé renforce le sentiment d'invitation sur mesure.

## Acceptance Criteria

1. **Given** le composant `SealAG` est rendu **When** il s'affiche à l'écran **Then** un cercle doré (`#B8860B`) contient les initiales "A" et "G" en serif élégante (proche Cormorant) avec "&" plus petit entre les deux
2. **And** des motifs géométriques fins (entrelacs arabesques, étoiles à 8 branches) entourent le monogramme en `#D4A54A`
3. **And** le SVG est inline dans `components/save-the-date/seal-ag.tsx`
4. **And** le composant est un Server Component (zéro `"use client"`)
5. **And** le `<svg>` porte `aria-hidden="true"`
6. **And** le `viewBox` est défini, la taille contrôlée par CSS (~30-40px mobile, ~50-60px desktop)
7. **And** le composant est exporté en PascalCase : `export function SealAG()`
8. **And** le poids du SVG contribue au budget total < 150 Ko (NFR-2)

## Tasks / Subtasks

- [x] Task 1: Créer le SVG du sceau A&G (AC: #1, #2, #5, #6, #8)
  - [x] 1.1: Concevoir le SVG avec `viewBox` approprié — cercle doré `#B8860B` comme base
  - [x] 1.2: Ajouter les lettres "A" et "G" en serif (proche style Cormorant) avec "&" plus petit centré
  - [x] 1.3: Ajouter les entrelacs géométriques arabesques en `#D4A54A` — motifs fins, subtils, pas dominants
  - [x] 1.4: Ajouter `aria-hidden="true"` sur le `<svg>` racine
  - [x] 1.5: Vérifier que le poids SVG est minimal (budget total < 150 Ko pour tous assets)
- [x] Task 2: Créer le composant `SealAG` (AC: #3, #4, #7)
  - [x] 2.1: Créer `components/save-the-date/seal-ag.tsx`
  - [x] 2.2: Export PascalCase `export function SealAG()`
  - [x] 2.3: Prop `className?: string` pour le sizing responsive
  - [x] 2.4: Zéro `"use client"` — Server Component
- [x] Task 3: Sizing responsive (AC: #6)
  - [x] 3.1: Taille par défaut ~30-40px (mobile) via classes Tailwind
  - [x] 3.2: Scaling ~50-60px (desktop) via breakpoint `lg:` ou `md:`
  - [x] 3.3: Le `viewBox` doit permettre un scaling propre sans distorsion
- [x] Task 4: Validation build + lint
  - [x] 4.1: `npm run lint` sans erreur
  - [x] 4.2: `npm run build` sans erreur

## Dev Notes

### CRITIQUE : Le SVG du sceau est un asset créatif — design précis requis

Le sceau A&G est le premier composant de l'Epic 9 (Animation Pigeon Voyageur). Il sera réutilisé dans :
- `envelope.tsx` (Story 9.2) — intégré visuellement sur l'enveloppe cachetée
- `app/opengraph-image.tsx` (Story 10.1) — version simplifiée pour Satori

Le design doit être **premium et élégant**, pas un placeholder.

### Spécifications visuelles détaillées (Source: UX Design)

| Propriété | Spécification |
|-----------|---------------|
| Style | Monogramme "A&G" en typographie latine élégante (serif fine), entouré d'entrelacs géométriques inspirés de l'art islamique (zellige, arabesques) |
| Forme | Cercle doré — forme du cachet de cire traditionnel |
| Couleur principale | Doré Marocain `#B8860B` — cercle, lettres |
| Couleur détails | Doré Lumineux `#D4A54A` — entrelacs arabesques |
| Lettres | "A" et "G" en serif élégante (proche Cormorant), "&" plus petit entre les deux |
| Entrelacs | Motifs géométriques fins — étoiles à 8 branches, lignes entrecroisées. Subtils, pas dominants — le monogramme reste le centre d'attention |
| Taille CSS | ~30-40px diamètre mobile, ~50-60px desktop |
| À éviter | Calligraphie arabe littérale (lisibilité), motifs trop chargés, effet cire 3D trop réaliste |

### Architecture du SVG — Guide de construction

**Structure recommandée :**
```svg
<svg aria-hidden="true" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
  <!-- 1. Cercle doré principal -->
  <circle cx="30" cy="30" r="28" stroke="#B8860B" stroke-width="1.5" />

  <!-- 2. Entrelacs arabesques géométriques (entre le cercle et les lettres) -->
  <!-- Motifs fins en #D4A54A, symétrie 8-fold -->

  <!-- 3. Monogramme A&G centré -->
  <!-- SVG <text> ou <path> — si <text>, utiliser font-family serif inline -->
  <!-- "A" à gauche, "&" plus petit centré, "G" à droite -->
</svg>
```

**Choix `<text>` vs `<path>` pour les lettres :**
- `<text>` avec `font-family="serif"` : plus léger, mais le rendu dépend de la police système
- `<path>` : rendu garanti identique partout, mais plus lourd
- **Recommandation : `<path>`** — le monogramme doit être pixel-perfect, pas dépendant des polices système

**Les entrelacs arabesques :**
- Utiliser des `<path>` SVG avec des motifs géométriques symétriques
- Inspiration zellige : lignes entrecroisées formant des étoiles à 8 branches
- Garder les `stroke-width` fins (0.5-0.8) pour la subtilité
- `opacity="0.7"` ou similaire pour ne pas concurrencer le monogramme

### Conventions projet — Rappels critiques

| Convention | Règle |
|-----------|-------|
| Fichier | kebab-case : `seal-ag.tsx` |
| Export | PascalCase : `export function SealAG()` |
| SVG | Inline dans le composant — jamais dans `/public` |
| `aria-hidden` | `"true"` sur le `<svg>` racine |
| `viewBox` | Toujours défini — taille contrôlée par CSS |
| Server Component | Zéro `"use client"` |
| Pas de barrel | Import direct : `import { SealAG } from '@/components/save-the-date/seal-ag'` |

### Patterns existants à suivre (Intelligence Stories précédentes)

Le composant suit exactement le même pattern que `CornerArabesque` dans `golden-frame.tsx` :
- Fonction interne ou exportée avec `className` prop
- SVG inline avec `aria-hidden="true"`, `viewBox`, `fill="none"`
- Couleurs hardcodées dans les attributs `stroke` / `fill` du SVG (pattern accepté en code review 8.3)
- Taille contrôlée par les classes Tailwind sur le `<svg>` ou le parent

**Référence directe — `golden-frame.tsx:3-48` (CornerArabesque) :**
```tsx
function CornerArabesque({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* paths... */}
    </svg>
  )
}
```

### Ne PAS faire

- **Ne PAS** intégrer le sceau dans `page.tsx` — le sceau sera intégré dans `envelope.tsx` (Story 9.2)
- **Ne PAS** ajouter d'animation CSS — les animations du sceau (seal-break) viendront dans Story 9.2
- **Ne PAS** utiliser `<img>` ou fichier SVG dans `/public`
- **Ne PAS** ajouter `"use client"`
- **Ne PAS** utiliser de package npm SVG (svgr, etc.)
- **Ne PAS** mettre de `max-w-*` sur le composant
- **Ne PAS** ajouter de `<title>` ou `<desc>` au SVG (élément décoratif)

### Budget SVG

Les assets SVG actuels du Save the Date totalisent ~800 octets (4 × CornerArabesque). Le budget total est 150 Ko (NFR-2). Le sceau devrait peser ~1-3 Ko — largement dans le budget.

### Project Structure Notes

```
components/save-the-date/
  golden-frame.tsx           ← existant (Story 8.3)
  golden-separator.tsx       ← existant (Story 8.2)
  save-the-date-content.tsx  ← existant (Story 8.2)
  seal-ag.tsx                ← NOUVEAU (cette story)
```

### References

- [Source: _bmad-output/planning-artifacts/epics-save-the-date.md#Story 2.1]
- [Source: _bmad-output/planning-artifacts/architecture-save-the-date.md#Component Architecture]
- [Source: _bmad-output/planning-artifacts/ux-design-save-the-date.md#Sceau A&G — Spécifications Visuelles]
- [Source: components/save-the-date/golden-frame.tsx (pattern CornerArabesque)]
- [Source: _bmad-output/implementation-artifacts/8-4-responsive-accessibilite-validation.md#Completion Notes]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

Aucun problème rencontré.

### Completion Notes List

- Task 1 : SVG sceau A&G créé avec `viewBox="0 0 60 60"`. Cercle doré extérieur `#B8860B` (r=28, strokeWidth=1.2), cercle intérieur subtil `#D4A54A` (r=22, strokeWidth=0.6, opacity=0.5). Entrelacs arabesques géométriques 8-fold : lignes cardinales + diagonales + motifs diamant entre les deux cercles, tous en `#D4A54A` avec strokeWidth fins (0.5-0.6) et opacity réduite (0.5-0.7). Monogramme "A & G" en `<path>` stroke `#B8860B` — rendu identique sur tous les navigateurs. `aria-hidden="true"` sur le `<svg>` racine. Poids total fichier : ~3.5 Ko (budget SVG total actuel ~4.3 Ko sur 150 Ko).
- Task 2 : Composant `SealAG` créé dans `components/save-the-date/seal-ag.tsx`. Export PascalCase `export function SealAG()`. Prop `className?: string` pour sizing responsive. Server Component pur (zéro `"use client"`). Suit le pattern `CornerArabesque` de `golden-frame.tsx`.
- Task 3 : Sizing responsive via `className` prop — le consommateur (Story 9.2 `envelope.tsx`) passera les classes Tailwind type `h-8 w-8 sm:h-10 sm:w-10 lg:h-14 lg:w-14` pour obtenir ~30-40px mobile / ~50-60px desktop. Le `viewBox="0 0 60 60"` assure un scaling proportionnel sans distorsion.
- Task 4 : `npm run lint` ✅ et `npm run build` ✅ — zéro erreur. Page `/` reste statique (○ Static).

### File List

- `components/save-the-date/seal-ag.tsx` — NOUVEAU
