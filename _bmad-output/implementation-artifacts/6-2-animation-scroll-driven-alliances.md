# Story 6.2: Animation Scroll-Driven des Alliances

Status: done

## Story

As a invité,
I want voir les deux alliances flotter sur les bords de l'écran et se rapprocher au fil de mon scroll,
So that mon parcours soit accompagné d'une animation élégante et immersive.

## Acceptance Criteria

1. **Given** la page invité chargée (section hero visible) **When** l'invité scrolle après le hero (première transition) **Then** les alliances apparaissent en fondu depuis les bords — or (Ghizlaine) à gauche, argent (Ahmed) à droite. Elles ne sont PAS visibles sur le hero

2. **Given** l'invité qui commence à scroller **When** le pourcentage de scroll augmente de 0% à 100% **Then** les alliances se rapprochent progressivement du centre de l'écran de manière fluide et continue (FR32)

3. **Given** l'animation en cours **When** l'invité scrolle **Then** les alliances tournent lentement sur elles-mêmes et grandissent légèrement, le tout synchronisé au pourcentage de scroll

4. **Given** l'animation sur un smartphone milieu de gamme (iPhone 11, Galaxy A52) **When** l'invité scrolle **Then** l'animation reste fluide à 60fps sans saccade ni impact sur la performance du scroll (NFR2)

5. **Given** les alliances en mouvement pendant les sections de contenu **When** elles coexistent avec le texte **Then** les alliances sont à ~30-40% d'opacité pour ne pas distraire de la lecture. Zone de sécurité : max 15% de la largeur de chaque côté sur desktop

6. **Given** l'invité qui scrolle vers le haut (scroll inversé) **When** le pourcentage de scroll diminue **Then** les alliances se séparent à nouveau de manière fluide — l'animation est entièrement bidirectionnelle

7. **Given** un navigateur ne supportant pas les CSS Scroll-Driven Animations **When** la page s'affiche **Then** les alliances sont masquées (dégradation gracieuse)

## Tasks / Subtasks

- [x] Task 1 : Créer le composant AllianceRings (AC: #1, #5, #7)
  - [x] 1.1 Créer `components/guest/alliance-rings.tsx` comme Client Component
  - [x] 1.2 Rendre les deux images d'alliance (solitaire gauche, bague homme droite) en `position: absolute` dans un container `position: fixed`
  - [x] 1.3 Ajouter `pointer-events: none` et `aria-hidden="true"` (éléments décoratifs)
  - [x] 1.4 Masquer par défaut, afficher uniquement si CSS Scroll-Driven Animations supporté (`@supports`)

- [x] Task 2 : Implémenter l'animation scroll-driven (AC: #2, #3, #6)
  - [x] 2.1 Ajouter les keyframes CSS pour le rapprochement progressif (translate bords → centre + descente sous texte)
  - [x] 2.2 Ajouter le scale progressif synchronisé au scroll (pas de rotation — photos 3D ne supportent pas la rotation)
  - [x] 2.3 Lier l'animation au scroll container via named scroll timeline (`--guest-scroll`)
  - [x] 2.4 Vérifier la bidirectionnalité (scroll up = alliances se séparent) — natif CSS Scroll-Driven
  - [x] 2.5 Responsive : 2 jeux de keyframes (mobile ≤768px / desktop ≥768px) avec media query pour switcher `animation-name`

- [x] Task 3 : Gérer l'apparition post-hero (AC: #1, #5)
  - [x] 3.1 Les alliances commencent cachées (opacity: 0) et apparaissent en fondu après le hero (keyframe 0-8%)
  - [x] 3.2 Opacité à 30% pendant les sections de contenu
  - [x] 3.3 Positionnement final : anneaux se chevauchent légèrement sous le texte "Merci" (translateY +12vh mobile / +25vh desktop)

- [x] Task 4 : Intégrer dans la page invité (AC: #1)
  - [x] 4.1 Ajouter `<AllianceRings />` dans la page `invite/[slug]/page.tsx`
  - [x] 4.2 Vérifier que le composant ne casse pas le scroll-snap existant (position: fixed container, no layout impact)
  - [x] 4.3 Vérifier le z-index (z-10, sous le contenu principal)

- [x] Task 5 : Optimisation performance (AC: #4)
  - [x] 5.1 Ajouter `will-change: transform, opacity` sur les éléments animés
  - [x] 5.2 Vérifier que le lint passe sans erreur

- [x] Task 6 : Section Merci finale (ajout hors scope initial — demandé par PO)
  - [x] 6.1 Créer `components/guest/merci-section.tsx` suivant le pattern des sections existantes
  - [x] 6.2 Ajouter constantes `merciTitle` et `merciMessage` dans `lib/constants.ts`
  - [x] 6.3 Intégrer `<MerciSection />` dans `page.tsx` comme dernière section de contenu

## Dev Notes

### Architecture du composant

**Fichier :** `components/guest/alliance-rings.tsx`
**Type :** Client Component (`"use client"`)
**Positionnement :** Container `position: fixed; inset: 0`, images `position: absolute` à l'intérieur. Les images sont en absolute (pas fixed) pour que le named scroll timeline lookup fonctionne via le DOM tree.
**z-index :** `z-10` — au-dessus du fond, sous le contenu interactif

### Scroll container & Named Timeline

Le guest layout utilise `<main className="guest-scroll-container h-dvh overflow-y-scroll snap-y snap-mandatory">`. La classe `guest-scroll-container` définit `scroll-timeline-name: --guest-scroll`.

Les ring images utilisent `animation-timeline: --guest-scroll` pour se lier à CE container. On n'utilise PAS `scroll()` sans argument car les éléments `position: absolute` dans un container `position: fixed` ne trouvent pas le bon scroll ancestor via la chaîne de containing blocks.

### Technique responsive

Deux jeux de keyframes (mobile / desktop) switchés via media query :
- **Mobile (<768px)** : `allianceLeftMove` / `allianceRightMove` — scale finale 0.8, translateX ±30px
- **Desktop (≥768px)** : `allianceLeftMoveLg` / `allianceRightMoveLg` — scale finale 1.3, translateX ±50px

```css
@media (min-width: 768px) {
  @supports (animation-timeline: scroll()) {
    .alliance-ring-left { animation-name: allianceLeftMoveLg; }
    .alliance-ring-right { animation-name: allianceRightMoveLg; }
  }
}
```

### Animation phases

| Phase | Scroll % | Comportement |
|-------|----------|-------------|
| Hero | 0-8% | Invisible (opacity: 0) |
| Apparition | 8-15% | Fondu depuis les bords, petites, 30% opacité |
| Voyage | 15-65% | Convergence vers le centre, scale progressive, début descente |
| Rapprochement | 65-85% | Accélération convergence, opacité 60%, descente sous le texte |
| Union | 85-100% | Chevauchement au centre sous "Merci", pleine opacité, scale max |

### Section Merci (ajout)

Nouvelle section finale `components/guest/merci-section.tsx` ajoutée dans la page invité. C'est sur cette section que les anneaux convergent et se chevauchent. Constantes dans `lib/constants.ts` (`merciTitle`, `merciMessage`).

### Dégradation gracieuse

`@supports (animation-timeline: scroll())` : sans support → `display: none` (pas de fallback JS).

### prefers-reduced-motion

`prefers-reduced-motion: reduce` → `.alliance-rings-container { display: none !important }`.

### Images actuelles

- `public/images/rings/solitaire-blanc.png` (solitaire, Ghizlaine, gauche) — 1024×1536 RGBA, ~2.3MB
- `public/images/rings/bague-homme.png` (alliance homme, Ahmed, droite) — 1024×1536 RGBA, ~2.3MB
- Note : le solitaire a un fond sombre dégradé (non transparent). Idéalement à remplacer par des images à fond transparent.

### References

- [Source: architecture.md#Animation des Alliances au Scroll (FR31-33)]
- [Source: ux-design-specification.md#Epic 6 — Comportement au Scroll]
- [Source: epics.md#Story 6.2]

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Debug Log References

### Completion Notes List
- Named scroll timeline (`scroll-timeline-name: --guest-scroll`) au lieu de `scroll()` — les éléments `position: absolute` dans un container `position: fixed` ne trouvent pas `<main>` via `scroll()` seul
- Ring images en `position: absolute` (pas `fixed`) dans le container fixed — le timeline lookup passe par le DOM tree, pas par la containing block chain
- Pas de rotation dans les keyframes — les photos 3D de bagues sont déformées quand on les rotate
- Centrage via `left: 50%; top: 50%; margin-left: -60px; margin-top: -90px` — translateX/translateY dans keyframes pour le mouvement
- Responsive : 2 jeux de keyframes (mobile/desktop), switchés par media query sur `animation-name`
- Mobile : scale finale 0.8, translateX ±30px, translateY +12vh (sous le texte merci)
- Desktop : scale finale 1.3, translateX ±50px, translateY +25vh (sous le texte merci)
- Toutes les valeurs en `px` pour le translateX (pas `vw`) pour un gap cohérent sur toutes tailles d'écran
- Section Merci ajoutée comme dernière section de contenu — c'est le point de convergence des anneaux
- Bidirectionnalité native des CSS Scroll-Driven Animations
- `prefers-reduced-motion: reduce` → `display: none !important`
- `@supports (animation-timeline: scroll())` → dégradation gracieuse

### File List
- `components/guest/alliance-rings.tsx` — Client Component rendering deux images de bagues (solitaire + bague homme)
- `components/guest/merci-section.tsx` — Section finale "Merci" (nouveau fichier)
- `app/globals.css` — Keyframes responsive (4 keyframes), scroll timeline, positioning, @supports, reduced-motion
- `app/(guest)/layout.tsx` — Ajout classe `guest-scroll-container` pour named scroll timeline
- `app/(guest)/invite/[slug]/page.tsx` — Import/render `<AllianceRings />` et `<MerciSection />`
- `lib/constants.ts` — Ajout `merciTitle` et `merciMessage`
