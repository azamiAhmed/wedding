# Story 9.3: Pigeon Voyageur — SVG + Animation Vol & Dépôt (Actes 1 & 2)

Status: done

## Story

As a invité,
I want voir un pigeon stylisé entrer en vol gracieux, déposer l'enveloppe au centre et s'envoler vers le haut,
So that la narration du messager crée l'émerveillement et porte la charge émotionnelle du Save the Date.

## Acceptance Criteria

1. **Given** le composant `PigeonVoyageur` est rendu **When** l'animation démarre **Then** le pigeon entre depuis la gauche avec une trajectoire en arc gracieux (Acte 1, ~1500ms) : style flat premium, 2-3 couleurs (corps `#B8860B`, plumage `#D4A54A`, ombre `#E8D5A8`), enveloppe visible dans le bec dès la première frame, battements d'ailes fluides (keyframes internes sur `<g>` SVG), trajectoire via `offset-path: path(...)` avec `var(--easing-flight)`
2. **And** le pigeon se pose et dépose l'enveloppe (Acte 2, dépôt 300ms) avec micro-rebond `var(--easing-land)`
3. **And** le pigeon s'envole vers le haut avec fade-out (~900ms) via `ease-out`
4. **And** les keyframes suivants sont ajoutés dans `globals.css` : `pigeon-fly` (trajectoire via `offset-distance`), `pigeon-fly-fallback` (courbe simulée avec 5-6 keyframes `translate` + `rotate`), `pigeon-depart` (envol vertical + `opacity → 0`), `wing-flap` (battement d'ailes alterné)
5. **And** le fallback `@supports not (offset-path: path("M0 0"))` est implémenté avec les keyframes `pigeon-fly-fallback`
6. **And** le SVG est inline dans `components/save-the-date/pigeon-voyageur.tsx`, taille ~80-100px mobile / ~150-180px desktop
7. **And** le composant est un Server Component, porte `aria-hidden="true"` et `pointer-events: none`
8. **And** `animation-fill-mode: forwards` — le pigeon reste invisible après l'envol
9. **And** en mode `prefers-reduced-motion` : le pigeon est en `display: none`

## Tasks / Subtasks

- [x] Task 1: Créer le SVG du pigeon voyageur (AC: #1, #6)
  - [x] 1.1: Concevoir le SVG dans `components/save-the-date/pigeon-voyageur.tsx` avec `viewBox` approprié (~120×80, pigeon en vol de profil)
  - [x] 1.2: Dessiner le corps du pigeon en `#B8860B` (formes pleines, flat premium, PAS de contour/outline)
  - [x] 1.3: Dessiner les ailes en `#D4A54A` dans des `<g>` séparés (`.pigeon-wing-left`, `.pigeon-wing-right`) pour l'animation CSS
  - [x] 1.4: Ajouter la tête avec bec pointu, œil subtil (`#FFFDF9`)
  - [x] 1.5: Dessiner la petite enveloppe dans le bec (`#FFFDF9` + `#D4A54A`) — visible dès la première frame
  - [x] 1.6: Ajouter la queue en `#D4A54A` (plumes effilées)
  - [x] 1.7: Ombre portée subtile en `#E8D5A8` (opacity réduite)
- [x] Task 2: Créer les keyframes de battement d'ailes (AC: #1, #4)
  - [x] 2.1: Keyframe `wing-flap` : rotation alternée des ailes (~-20deg ↔ +20deg)
  - [x] 2.2: Définir `transform-origin` au point de rattachement de chaque aile au corps
  - [x] 2.3: Animation `infinite alternate` avec durée ~300-400ms pour un battement naturel
- [x] Task 3: Créer la trajectoire de vol — `offset-path` + fallback (AC: #1, #4, #5)
  - [x] 3.1: Keyframe `pigeon-fly` : `offset-distance: 0% → 100%` pour navigateurs modernes
  - [x] 3.2: Définir le `offset-path: path(...)` avec une courbe de Bézier arc gracieux (entrée gauche → centre)
  - [x] 3.3: `offset-rotate: auto` pour que le pigeon suive la direction du chemin
  - [x] 3.4: Bloc `@supports (offset-path: path("M0 0"))` pour le path moderne
  - [x] 3.5: Keyframe `pigeon-fly-fallback` : 5-6 étapes `translate` + `rotate` simulant la courbe (fallback)
  - [x] 3.6: Bloc `@supports not (offset-path: path("M0 0"))` pour le fallback
- [x] Task 4: Créer l'animation de départ (AC: #2, #3, #4, #8)
  - [x] 4.1: Keyframe `pigeon-depart` : `translateY(0) → translateY(-300px)` + `opacity: 1 → 0`
  - [x] 4.2: Animation avec `ease-out`, `forwards` (reste invisible)
- [x] Task 5: Composant React + CSS (AC: #6, #7, #8, #9)
  - [x] 5.1: Export PascalCase `export function PigeonVoyageur()`
  - [x] 5.2: Prop `className?: string` pour sizing responsive
  - [x] 5.3: `aria-hidden="true"` sur le composant racine
  - [x] 5.4: `pointer-events: none` via classe Tailwind `pointer-events-none`
  - [x] 5.5: Zéro `"use client"` — Server Component
  - [x] 5.6: Toutes les animations dans `@media (prefers-reduced-motion: no-preference)` dans `globals.css`
  - [x] 5.7: `.pigeon-container { display: none !important; }` dans `@media (prefers-reduced-motion: reduce)` dans `globals.css`
- [x] Task 6: Validation build + lint
  - [x] 6.1: `npm run lint` sans erreur
  - [x] 6.2: `npm run build` sans erreur

## Dev Notes

### CRITIQUE : Le pigeon est l'asset créatif le plus complexe du projet

C'est le composant central de l'Acte 1 — le moment "waouh" de l'animation Save the Date. La qualité du design SVG et de la fluidité d'animation sont critiques. Le pigeon doit être :
- **Reconnaissable en < 0.5s** — posture de vol, ailes déployées, enveloppe dans le bec
- **Élégant et poétique** — messager de conte, PAS mascotte cartoon
- **Flat premium** — formes pleines (fill), PAS de contours (stroke)
- **2-3 couleurs max** — #B8860B (corps), #D4A54A (plumage/ailes), #E8D5A8 (ombre)

### Spécifications visuelles détaillées (Source: UX Design)

| Propriété | Spécification |
|-----------|---------------|
| Style | Flat design premium — formes pleines, **pas de contour** (outline) |
| Corps | Doré Marocain `#B8860B` — aplat principal |
| Plumage / ailes | Doré Lumineux `#D4A54A` — nuance subtile, suggère le volume sans dégradé |
| Ombre | Voile Doré `#E8D5A8` — ombre douce projetée, opacity réduite |
| Silhouette | Vol de profil (vu de côté), ailes déployées, tête à droite |
| Bec | Pointe fine, petit, doré plus clair |
| Œil | Point subtil en Blanc Cassé `#FFFDF9` |
| Queue | Plumes effilées en `#D4A54A` |
| Enveloppe dans le bec | Petit rectangle `#FFFDF9` + liseré `#D4A54A` — **visible dès la frame 1** |
| Taille CSS | ~80-100px de large mobile / ~150-180px desktop |
| À éviter | Dégradés brillants, contours noirs, plumes individuelles, style cartoon/kawaii |

### Architecture SVG du pigeon — Structure recommandée

```tsx
<svg viewBox="0 0 120 80" fill="none" aria-hidden="true" className={className}>
  {/* Ombre portée subtile */}
  <ellipse cx="60" cy="72" rx="25" ry="4" fill="#E8D5A8" opacity="0.3" />

  {/* Corps principal — formes pleines #B8860B */}
  <path d="..." fill="#B8860B" />  {/* Corps ovale allongé */}
  <circle cx="..." cy="..." r="..." fill="#B8860B" />  {/* Tête */}
  <circle cx="..." cy="..." r="1.5" fill="#FFFDF9" />  {/* Œil */}
  <path d="..." fill="#D4A54A" />  {/* Bec */}

  {/* Queue — plumes effilées */}
  <path d="..." fill="#D4A54A" />

  {/* Aile gauche — <g> séparé pour animation CSS */}
  <g className="pigeon-wing-left">
    <path d="..." fill="#D4A54A" />
  </g>

  {/* Aile droite (visible si vue de profil du pigeon) */}
  <g className="pigeon-wing-right">
    <path d="..." fill="#D4A54A" opacity="0.7" />
  </g>

  {/* Enveloppe dans le bec */}
  <rect x="..." y="..." width="12" height="8" rx="1"
    fill="#FFFDF9" stroke="#D4A54A" strokeWidth="0.5" />
</svg>
```

**Points importants :**
- Le pigeon est vu de profil (vol vers la droite) — une seule aile principale visible, la seconde en fond avec opacity réduite
- Les `<g>` des ailes ont des classes CSS pour le ciblage des keyframes de battement
- Le `transform-origin` de chaque aile doit être au point d'attache au corps (épaule du pigeon)
- L'enveloppe dans le bec est un petit rectangle simple — PAS le composant `Envelope` complet

### Architecture des animations CSS — 4 keyframes

**1. `wing-flap` — Battement d'ailes (interne au SVG)**

```css
@keyframes wing-flap {
  from { transform: rotate(-20deg); }
  to { transform: rotate(20deg); }
}

/* Appliqué en infinite alternate */
@media (prefers-reduced-motion: no-preference) {
  .pigeon-wing-left {
    transform-origin: 50px 35px; /* point d'attache au corps */
    animation: wing-flap 300ms ease-in-out infinite alternate;
  }
  .pigeon-wing-right {
    transform-origin: 50px 35px;
    animation: wing-flap 300ms ease-in-out infinite alternate-reverse;
  }
}
```

**Note :** `alternate-reverse` sur l'aile droite crée un battement en opposition (quand la gauche monte, la droite descend) — plus naturel.

**2. `pigeon-fly` — Trajectoire vol via `offset-path` (navigateurs modernes)**

```css
@keyframes pigeon-fly {
  from { offset-distance: 0%; }
  to { offset-distance: 100%; }
}

@supports (offset-path: path("M0 0")) {
  .pigeon-container {
    offset-path: path("M-150,200 C-50,50 200,0 400,150");
    offset-rotate: auto;
    animation: pigeon-fly var(--animation-act1) var(--easing-flight) forwards;
  }
}
```

**Note sur les coordonnées du path :** Les valeurs ci-dessus sont indicatives. Le path exact sera ajusté dans Story 9.4 (orchestration) quand le layout final est connu. Pour cette story, définir un path raisonnable qui dessine un arc gracieux de gauche à droite/bas.

**3. `pigeon-fly-fallback` — Trajectoire simulée (fallback universel)**

```css
@keyframes pigeon-fly-fallback {
  0%   { transform: translate(-150px, 200px) rotate(-15deg); }
  20%  { transform: translate(0px, 80px) rotate(-10deg); }
  40%  { transform: translate(100px, 20px) rotate(-5deg); }
  60%  { transform: translate(220px, 50px) rotate(0deg); }
  80%  { transform: translate(320px, 100px) rotate(3deg); }
  100% { transform: translate(400px, 150px) rotate(5deg); }
}

@supports not (offset-path: path("M0 0")) {
  .pigeon-container {
    animation: pigeon-fly-fallback var(--animation-act1) var(--easing-flight) forwards;
  }
}
```

**4. `pigeon-depart` — Envol vertical + fade-out**

```css
@keyframes pigeon-depart {
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(-300px); opacity: 0; }
}
```

### `prefers-reduced-motion` — Implémentation

Le pigeon est en `display: none` quand reduced-motion est activé. L'utilisateur voit directement le texte + cadre doré + séparateur.

```css
@media (prefers-reduced-motion: reduce) {
  .pigeon-container {
    display: none !important;
  }
}
```

### Composant React — Structure

```tsx
export function PigeonVoyageur({ className }: { className?: string }) {
  return (
    <div
      className={`pigeon-container pointer-events-none ${className ?? ''}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full">
        {/* ... SVG content ... */}
      </svg>
    </div>
  )
}
```

**Points :**
- Le `<div>` wrapper (`pigeon-container`) est le conteneur animé (offset-path sur ce div)
- Le SVG à l'intérieur contient le pigeon avec les ailes animées
- `pointer-events-none` empêche les interactions sur le pigeon en vol
- `aria-hidden="true"` sur le div racine

### Intelligence Stories précédentes (9-1, 9-2)

**Patterns confirmés en code review :**
- Couleurs hardcodées dans les attributs SVG `fill`/`stroke` (accepté, pas de tokens pour les couleurs SVG)
- Classes structurelles utilisées pour les animations CSS (`.envelope-seal`, `.envelope-flap` plutôt que `.seal-break-animation`) — plus propre
- `perspective` ajouté sur le conteneur parent pour les transforms 3D (fix review 9-2)
- `backface-visibility: hidden` si élément rotatif (fix review 9-2)
- `h-[58%]` (Tailwind) préféré à `style={{ height: '58%' }}` (inline) (fix review 9-2)

**Pattern SealAG (9-1) :**
- viewBox carré `0 0 60 60`, ~3.5 Ko
- Prop `className?: string` pour sizing responsive
- Server Component pur

**Pattern Envelope (9-2) :**
- viewBox rectangulaire `0 0 180 120` (ratio 3:2), ~3.3 Ko
- Layered HTML (body SVG + flap div + seal div) pour animation indépendante
- SVG `<filter>` pour grain texture
- Keyframes + classes dans `globals.css` dans `@media (prefers-reduced-motion: no-preference)`

### `offset-path` — Compatibilité navigateurs

| Navigateur | Support `offset-path` |
|-----------|----------------------|
| Chrome 46+ | ✅ |
| Safari 15.4+ | ✅ |
| Firefox 72+ | ✅ |
| Samsung Internet 5+ | ✅ |
| IE 11 | ❌ (fallback) |

Le fallback via `@supports not (offset-path: path("M0 0"))` couvre les navigateurs très anciens. Les navigateurs cibles (iPhone 11+, Galaxy A52+) supportent tous `offset-path`.

### Note sur les `animation-delay`

Les delays précis (0ms pour pigeon-fly, 1500ms pour le dépôt, 1800ms pour pigeon-depart, etc.) seront ajoutés dans **Story 9.4 (orchestration)**. Cette story crée les keyframes, les classes CSS et le composant — pas le timing global.

### Conventions projet — Rappels critiques

| Convention | Règle |
|-----------|-------|
| Fichier | kebab-case : `pigeon-voyageur.tsx` |
| Export | PascalCase : `export function PigeonVoyageur()` |
| SVG | Inline dans le composant — jamais dans `/public` |
| SVG style | Formes pleines (`fill`), PAS de contours (`stroke`) sauf détails fins |
| `aria-hidden` | `"true"` sur le composant racine |
| `pointer-events` | `none` (le pigeon ne doit pas intercepter les clics) |
| Server Component | Zéro `"use client"` |
| Animations | Keyframes + classes dans `globals.css`, pas inline ni CSS modules |
| Tokens | `var(--easing-flight)`, `var(--easing-land)`, `var(--animation-act1)` — jamais de cubic-bezier en dur |
| Progressive enhancement | Animations dans `@media (prefers-reduced-motion: no-preference)` |
| Pas de `max-w-*` | Sizing par `className` prop |
| Pas de barrel | Import direct |

### Ne PAS faire

- **Ne PAS** intégrer le pigeon dans `page.tsx` — l'assemblage est Story 9.4
- **Ne PAS** ajouter les `animation-delay` globaux — c'est Story 9.4 (orchestration)
- **Ne PAS** utiliser Framer Motion, Lottie ou tout package npm
- **Ne PAS** ajouter `"use client"`
- **Ne PAS** mettre de `max-w-*` sur le composant
- **Ne PAS** utiliser de CSS modules — tout dans `globals.css`
- **Ne PAS** hardcoder des easings ou durées — utiliser les tokens `var(--easing-*)` et `var(--animation-*)`
- **Ne PAS** dessiner le pigeon avec des contours (`stroke`) — utiliser des formes pleines (`fill`) pour le style flat premium
- **Ne PAS** faire un pigeon cartoon/kawaii — messager élégant et poétique

### Budget SVG

Assets actuels : ~7 Ko (CornerArabesque ×4 + SealAG + Envelope). Budget : 150 Ko. Le pigeon devrait peser ~3-5 Ko (formes simples, flat design). Budget total attendu : ~10-12 Ko.

### Project Structure Notes

```
components/save-the-date/
  golden-frame.tsx           ← existant (Story 8.3)
  golden-separator.tsx       ← existant (Story 8.2)
  save-the-date-content.tsx  ← existant (Story 8.2)
  seal-ag.tsx                ← existant (Story 9.1)
  envelope.tsx               ← existant (Story 9.2)
  pigeon-voyageur.tsx        ← NOUVEAU (cette story)

app/globals.css              ← MODIFIÉ (ajout keyframes wing-flap, pigeon-fly, pigeon-fly-fallback, pigeon-depart + @supports blocks + classes animation)
```

### References

- [Source: _bmad-output/planning-artifacts/epics-save-the-date.md#Story 2.3]
- [Source: _bmad-output/planning-artifacts/architecture-save-the-date.md#Animation Architecture]
- [Source: _bmad-output/planning-artifacts/architecture-save-the-date.md#CSS Architecture]
- [Source: _bmad-output/planning-artifacts/architecture-save-the-date.md#Implementation Patterns]
- [Source: _bmad-output/planning-artifacts/ux-design-save-the-date.md#Pigeon — Spécifications Visuelles]
- [Source: _bmad-output/planning-artifacts/ux-design-save-the-date.md#Acte 1 — L'Arrivée]
- [Source: _bmad-output/planning-artifacts/ux-design-save-the-date.md#Acte 2 — La Livraison]
- [Source: _bmad-output/implementation-artifacts/9-1-sceau-ag-svg-monogramme.md#Completion Notes]
- [Source: _bmad-output/implementation-artifacts/9-2-enveloppe-svg-animation-ouverture.md#Completion Notes]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

Aucun problème rencontré.

### Completion Notes List

- Task 1 : SVG pigeon voyageur créé avec `viewBox="0 0 120 80"`. Vue de profil en vol vers la droite. Corps ovale en `#B8860B` (fill, flat premium, pas de contour). Tête ronde avec œil (`#FFFDF9` + `#2C2418`), bec pointu en `#D4A54A`. Queue effilée en `#D4A54A`. Poitrine avec nuance subtile `#D4A54A` opacity 0.5. Enveloppe dans le bec : petit rectangle `#FFFDF9` + stroke `#D4A54A` + rabat avec pli `#E8D5A8`. Ombre portée ellipse `#E8D5A8` opacity 0.25. Pattes repliées (en vol) en stroke `#D4A54A`. Ailes dans des `<g>` séparés : `.pigeon-wing-left` (aile principale visible) et `.pigeon-wing-right` (aile arrière opacity 0.6) pour animation CSS indépendante. Détail plume sur l'aile principale.
- Task 2 : Keyframe `wing-flap` ajouté dans `globals.css` : rotation -20deg ↔ +20deg. `.pigeon-wing-left` avec `transform-origin: 42px 30px` (point d'attache au corps), `animation: wing-flap 350ms ease-in-out infinite alternate`. `.pigeon-wing-right` avec `transform-origin: 40px 32px`, `animation: wing-flap 350ms ease-in-out infinite alternate-reverse` (opposition naturelle). Dans `@media (prefers-reduced-motion: no-preference)`.
- Task 3 : Trajectoire de vol implémentée avec double stratégie. Navigateurs modernes : `@supports (offset-path: path("M0 0"))` → `.pigeon-container` avec `offset-path: path("M-150,200 C-50,50 150,-30 350,80 Q450,140 500,160")`, `offset-rotate: auto`, `animation: pigeon-fly var(--animation-act1) var(--easing-flight) forwards`. Keyframe `pigeon-fly` : `offset-distance: 0% → 100%`. Fallback : `@supports not (offset-path: path("M0 0"))` → `animation: pigeon-fly-fallback var(--animation-act1) var(--easing-flight) forwards`. Keyframe `pigeon-fly-fallback` : 6 étapes translate + rotate simulant l'arc. Les coordonnées du path seront ajustées en Story 9.4 (orchestration).
- Task 4 : Keyframe `pigeon-depart` ajouté : `translateY(0) → translateY(-300px)` + `opacity: 1 → 0`. L'animation `ease-out` + `forwards` sera appliquée en Story 9.4 via classe CSS.
- Task 5 : Composant `PigeonVoyageur` exporté PascalCase avec prop `className?: string`. `aria-hidden="true"` sur le div racine. `pointer-events-none` via Tailwind. Server Component pur (zéro `"use client"`). `.pigeon-container { display: none !important; }` dans `@media (prefers-reduced-motion: reduce)`.
- Task 6 : `npm run lint` ✅ et `npm run build` ✅ — zéro erreur.

### File List

- `components/save-the-date/pigeon-voyageur.tsx` — NOUVEAU
- `app/globals.css` — MODIFIÉ (ajout 4 keyframes + animation classes + @supports blocks + reduced-motion rule)
