# Story 6.3: Révélation Finale — Photo du Couple

Status: cancelled

## Story

As a invité arrivant à la dernière section,
I want voir les deux alliances s'entrelacer et révéler la photo d'Ahmed et Ghizlaine à l'intérieur,
so that le parcours scroll culmine dans un moment émotionnel fort.

## Acceptance Criteria

1. **Given** l'invité qui atteint la dernière section (scroll ~90-100%) **When** les alliances arrivent au centre **Then** elles s'entrelacent avec un léger ralentissement (easing cubic-bezier avec décélération) et un subtil éclat doré (glow) au moment de l'union

2. **Given** les alliances entrelacées **When** l'animation d'entrelacement est terminée **Then** la photo du couple apparaît en fondu progressif (600-800ms) à l'intérieur de l'espace formé par les deux anneaux unis, comme un voile qui se lève (FR33)

3. **Given** la photo révélée **When** elle est affichée **Then** elle remplit l'intérieur des alliances entrelacées (les alliances servent de cadre, la photo ne déborde pas)

4. **Given** l'emplacement photo **When** le développeur intègre une image **Then** l'emplacement est générique et adaptable (accepte n'importe quelle photo aux bonnes proportions)

5. **Given** la révélation sur mobile **When** la dernière section est atteinte **Then** l'entrelacement et la photo sont visibles et correctement dimensionnés sur petit écran

## Tasks / Subtasks

- [x] Task 1 : Photo du couple — asset et constante (AC: #3, #4)
  - [x]1.1 Placer la photo du couple dans `public/images/couple-reveal.jpg` (ou réutiliser `hero.jpg` comme placeholder initial)
  - [x]1.2 Ajouter le chemin dans `lib/constants.ts` si nécessaire (ou hard-coder le src dans le composant, comme `hero.jpg`)

- [x] Task 2 : Éclat doré (golden glow) au moment de l'union (AC: #1)
  - [x]2.1 Ajouter un keyframe `allianceGlow` : opacity 0 → 0 (0-85%) → glow doré (85-95%) → glow stable (95-100%)
  - [x]2.2 L'éclat = `filter: drop-shadow(0 0 Xpx #B8860B)` sur les images de bagues OU un pseudo-élément dédié
  - [x]2.3 Lier à `animation-timeline: --guest-scroll` comme les keyframes existants
  - [x]2.4 Responsive : glow plus petit sur mobile (rayon ~8px) vs desktop (~15px)

- [x] Task 3 : Élément photo du couple dans AllianceRings (AC: #2, #3, #4)
  - [x]3.1 Ajouter un `<Image>` pour la photo du couple dans `components/guest/alliance-rings.tsx`
  - [x]3.2 Positionner au même point de convergence que les bagues (centré, même translateY)
  - [x]3.3 Appliquer `clip-path: circle()` pour un rendu circulaire (la photo est "encadrée" par les anneaux)
  - [x]3.4 Taille responsive : ~80px diamètre mobile / ~140px desktop
  - [x]3.5 `alt` descriptif (pas vide — c'est du contenu, pas décoratif) : "Ahmed et Ghizlaine"

- [x] Task 4 : Animation scroll-driven du fondu photo (AC: #2, #5)
  - [x]4.1 Keyframe `couplePhotoReveal` : opacity 0 (0-80%) → opacity 0 (80-88%) → opacity 1 (88-100%) + léger scale(0.8 → 1)
  - [x]4.2 Lier à `animation-timeline: --guest-scroll`
  - [x]4.3 2 keyframes (mobile/desktop) switchés par media query, même pattern que les bagues
  - [x]4.4 Positionner la photo via `position: absolute` dans le container fixed (même technique que les bagues)

- [x] Task 5 : Responsive mobile + desktop (AC: #5)
  - [x]5.1 Mobile : photo 80px, translateY aligné avec bagues (+12vh), scale finale 0.8
  - [x]5.2 Desktop : photo 140px, translateY aligné avec bagues (+25vh), scale finale 1.0
  - [x]5.3 Vérifier que la photo est visuellement centrée entre les deux bagues qui se chevauchent

- [x] Task 6 : Lint et vérification visuelle (AC: #1-5)
  - [x]6.1 `npm run lint` passe sans erreur
  - [x]6.2 Vérifier rendu mobile et desktop : photo apparaît entre les bagues en fin de scroll

## Dev Notes

### Contexte Story 6.2 — état actuel de l'animation

L'animation scroll-driven des bagues est **déjà implémentée** (Story 6.2). État actuel :

- **Composant** : `components/guest/alliance-rings.tsx` — Server Component, rend deux `<Image>` (solitaire + bague homme) dans un container `fixed inset-0`
- **CSS** : `app/globals.css` lignes 107-237 — 4 keyframes (mobile/desktop × gauche/droite), named scroll timeline `--guest-scroll`
- **Convergence finale** : Les bagues se chevauchent au centre à 100% scroll :
  - Mobile : `translate(±30px, 12vh) scale(0.8)` — overlap ~36px
  - Desktop : `translate(±50px, 25vh) scale(1.3)` — overlap ~56px
- **Section Merci** : `components/guest/merci-section.tsx` — dernière section visible, les bagues convergent EN DESSOUS du texte "Merci"
- **Named scroll timeline** : `scroll-timeline-name: --guest-scroll` sur `.guest-scroll-container` dans le guest layout
- **Images** : `position: absolute` dans le container `position: fixed` — le timeline lookup passe par le DOM tree, pas la containing block chain

### Architecture technique de la révélation

**Approche retenue** : Ajouter un 3ème élément (`<Image>` photo couple) dans `AllianceRings`, positionné au même point de convergence que les bagues, avec sa propre animation scroll-driven.

**Pourquoi `clip-path: circle()` ?** Les images de bagues sont des PNG avec fond (pas des SVG circles). On ne peut pas utiliser les anneaux comme masque SVG. Le `clip-path: circle()` donne l'effet "photo vue à travers les anneaux" de manière simple et performante.

**Éclat doré** : `filter: drop-shadow()` animé via keyframe. Le `drop-shadow` suit la forme de l'image (contrairement à `box-shadow`). Alternative : un `<div>` radial-gradient doré qui pulse — plus de contrôle mais plus de DOM.

### Fichiers à modifier

| Fichier | Modification |
|---------|-------------|
| `components/guest/alliance-rings.tsx` | Ajouter `<Image>` photo couple avec classes CSS |
| `app/globals.css` | Ajouter keyframes `couplePhotoReveal`, `couplePhotoRevealLg`, `allianceGlow`, `allianceGlowLg` + règles CSS |
| `public/images/couple-reveal.jpg` | **NOUVEAU** — photo du couple (ou placeholder) |

### Positionnement de la photo

La photo doit être centrée au même point que les bagues. Les bagues utilisent :
```css
position: absolute;
top: 50%;
left: 50%;
margin-left: calc(120px / -2);
margin-top: calc(180px / -2);
```

La photo utilisera le même `top: 50%; left: 50%` avec ses propres margins basées sur sa taille (80px mobile / 140px desktop). Le `translateY` dans les keyframes doit être identique aux bagues pour rester centré entre elles.

### Keyframes — structure attendue

```css
/* Photo reveal: apparaît APRÈS la convergence des bagues (80-100%) */
@keyframes couplePhotoReveal {
  0%   { opacity: 0; transform: translate(0, 0) scale(0.5); }
  80%  { opacity: 0; transform: translate(0, 10vh) scale(0.5); }
  88%  { opacity: 0.3; transform: translate(0, 12vh) scale(0.7); }
  95%  { opacity: 0.8; transform: translate(0, 12vh) scale(0.9); }
  100% { opacity: 1; transform: translate(0, 12vh) scale(1); }
}

/* Glow: lueur dorée sur les bagues à la fin */
@keyframes allianceGlow {
  0%   { filter: drop-shadow(0 0 0 transparent); }
  85%  { filter: drop-shadow(0 0 0 transparent); }
  92%  { filter: drop-shadow(0 0 8px rgba(184, 134, 11, 0.6)); }
  100% { filter: drop-shadow(0 0 12px rgba(184, 134, 11, 0.8)); }
}
```

### Conventions du projet à respecter

- **Pas de `"use client"`** sauf si hooks/handlers nécessaires — `AllianceRings` est actuellement un Server Component
- **Pas de `max-w-*`** sur aucun composant
- **FR29** : Constantes dans `lib/constants.ts` si texte FR (pas applicable ici — c'est une image)
- **`aria-hidden="true"`** sur le container — MAIS la photo du couple a un `alt` descriptif car c'est du contenu, pas du décoratif. Mettre `alt` sur l'Image même si le parent est `aria-hidden` (le `alt` aide les screen readers qui respectent l'attribut au niveau de l'image)
- **Named scroll timeline** : `animation-timeline: --guest-scroll` (pas `scroll()`)
- **`@supports (animation-timeline: scroll())`** : la photo est aussi cachée par défaut (dégradation gracieuse)
- **`prefers-reduced-motion`** : déjà géré — le container est `display: none !important`
- **Landscape** : déjà géré — le container est `display: none !important`

### Images actuelles dans le projet

- `public/images/hero.jpg` — 69.6KB, photo du couple (peut servir de placeholder)
- `public/images/rings/solitaire-blanc.png` — 56KB, solitaire Ghizlaine
- `public/images/rings/bague-homme.png` — 61KB, alliance Ahmed

### Patterns existants

- `next/image` avec `priority={false}` pour les bagues (non-LCP)
- CSS Scroll-Driven Animations avec `animation-timeline: --guest-scroll`
- Media query pour switcher `animation-name` entre mobile et desktop
- `@supports (animation-timeline: scroll())` pour dégradation gracieuse

### Git Intelligence

Les 5 derniers commits :
- `feat: 6-1 & 6-2 code review done` — Review et corrections Story 6.1 + 6.2
- `feat: 6-1-assets-rendu-realiste-alliances & 6-2 scroll animation` — Implémentation 6.1 + 6.2
- `feat: epic 7 landing page` — Story 7.1 complétée
- `feat: generate dev data` — Données de test
- `feat: 4-4-Toggles sections du site` — Epic 4 complétée

Pattern commit : `feat: <description>`, branche `dev`.

### Project Structure Notes

- La photo couple va dans `public/images/couple-reveal.jpg` — même répertoire que `hero.jpg`
- Pas de nouveau répertoire nécessaire
- Aucun conflit avec la structure existante

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 6.3: Révélation Finale — Photo du Couple]
- [Source: _bmad-output/planning-artifacts/architecture.md#Animation des Alliances au Scroll (FR31-33)]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Epic 6 — Révélation finale]
- [Source: _bmad-output/planning-artifacts/prd.md#FR33]
- [Source: _bmad-output/implementation-artifacts/6-2-animation-scroll-driven-alliances.md — Dev Notes complets]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

### Completion Notes List
- Photo du couple : `couple-reveal.jpg` copie de `hero.jpg` comme placeholder — à remplacer par une photo dédiée si souhaité
- Golden glow : `filter: drop-shadow()` animé via keyframe scroll-driven — suit la forme PNG des bagues
- Photo reveal : `clip-path: circle(50%)` pour un rendu circulaire entre les bagues convergentes
- 4 nouveaux keyframes : `couplePhotoReveal`, `couplePhotoRevealLg`, `allianceGlow`, `allianceGlowLg`
- Multiple animations CSS : `animation: moveKeyframe linear both, glowKeyframe linear both` — le `animation-timeline` unique se répète pour les deux
- Photo positionnée avec la même technique que les bagues : `position: absolute; top: 50%; left: 50%; margin-*: calc(size / -2)`
- Desktop media query switch : `animation-name` et tailles overridées pour 140px (vs 80px mobile)
- Photo `z-index: 1` — apparaît au-dessus des bagues (focal point de la révélation)
- `alt="Ahmed et Ghizlaine"` sur la photo — contenu significatif, pas décoratif
- Lint + build passent sans erreur

### File List
- `components/guest/alliance-rings.tsx` — Ajout `<Image>` couple photo avec `clip-path: circle()` et alt descriptif
- `app/globals.css` — 4 nouveaux keyframes (couplePhotoReveal/Lg + allianceGlow/Lg), CSS pour `.couple-photo-reveal`, multi-animation sur rings
- `public/images/couple-reveal.jpg` — **NOUVEAU** — photo couple placeholder (copie de hero.jpg)
