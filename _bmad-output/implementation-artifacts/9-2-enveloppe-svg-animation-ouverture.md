# Story 9.2: Enveloppe — SVG + Animation Ouverture & Brisure du Sceau (Acte 3)

Status: done

## Story

As a invité,
I want voir une enveloppe élégante dont le sceau se brise et le rabat se soulève avec grâce pour révéler le contenu,
So that l'ouverture crée l'anticipation et la solennité de la révélation.

## Acceptance Criteria

1. **Given** le composant `Envelope` est rendu **When** il s'affiche à l'écran **Then** une enveloppe en Blanc Cassé (`#FFFDF9`) est visible avec : surface avec grain quasi-imperceptible, plis/bords en ombres discrètes `#E8D5A8`, liseré fin doré `#D4A54A` sur les contours, rabat triangulaire supérieur, proportions ratio ~3:2, ~120px mobile / ~200px desktop
2. **And** le `SealAG` est intégré visuellement sur l'enveloppe cachetée
3. **And** les keyframes suivants sont ajoutés dans `globals.css` : `seal-break` (le sceau se réduit `scale` + `opacity → 0`) et `envelope-open` (le rabat se soulève en `rotateX()` avec `var(--easing-reveal)`)
4. **And** l'enveloppe passe de l'état scellé → ouverture → ghost (~20-25% opacité) via `animation-fill-mode: forwards`
5. **And** le SVG est inline dans `components/save-the-date/envelope.tsx`
6. **And** le composant est un Server Component, porte `aria-hidden="true"`
7. **And** en mode `prefers-reduced-motion` : l'enveloppe est en `display: none`

## Tasks / Subtasks

- [x] Task 1: Créer le SVG de l'enveloppe (AC: #1, #5)
  - [x] 1.1: Concevoir le SVG dans `components/save-the-date/envelope.tsx` avec `viewBox` approprié
  - [x] 1.2: Dessiner le corps de l'enveloppe en Blanc Cassé `#FFFDF9` avec plis/bords en `#E8D5A8`
  - [x] 1.3: Ajouter le liseré fin doré `#D4A54A` sur les contours
  - [x] 1.4: Dessiner le rabat triangulaire supérieur (partie qui s'ouvrira en animation)
  - [x] 1.5: Ajouter un grain quasi-imperceptible (texture SVG subtile via `<filter>` ou pattern)
  - [x] 1.6: Proportions ratio ~3:2 dans le viewBox
- [x] Task 2: Intégrer le composant `SealAG` (AC: #2)
  - [x] 2.1: Importer `SealAG` depuis `@/components/save-the-date/seal-ag`
  - [x] 2.2: Positionner le sceau au centre du rabat (sur le point de fermeture)
  - [x] 2.3: Dimensionner le sceau proportionnellement à l'enveloppe (~30-40px mobile, ~50-60px desktop via classes Tailwind)
- [x] Task 3: Créer les keyframes CSS dans `globals.css` (AC: #3, #4)
  - [x] 3.1: Keyframe `seal-break` : `scale(1) → scale(0)` + `opacity: 1 → 0`
  - [x] 3.2: Keyframe `envelope-open` : rabat `rotateX(0deg) → rotateX(180deg)` avec `var(--easing-reveal)`
  - [x] 3.3: Keyframe `envelope-ghost` : `opacity: 1 → 0.2` (état final ghost)
  - [x] 3.4: Appliquer les classes CSS avec `animation-fill-mode: forwards` et `animation-iteration-count: 1`
  - [x] 3.5: Wrapper les animations dans `@media (prefers-reduced-motion: no-preference)` (progressive enhancement)
- [x] Task 4: Composant React (AC: #5, #6, #7)
  - [x] 4.1: Export PascalCase `export function Envelope()`
  - [x] 4.2: Prop `className?: string` pour sizing responsive
  - [x] 4.3: `aria-hidden="true"` sur le composant racine
  - [x] 4.4: Zéro `"use client"` — Server Component
  - [x] 4.5: En `prefers-reduced-motion` : `display: none` via CSS dans `globals.css`
- [x] Task 5: Validation build + lint
  - [x] 5.1: `npm run lint` sans erreur
  - [x] 5.2: `npm run build` sans erreur

## Dev Notes

### CRITIQUE : Cette story combine asset SVG + animations CSS

L'enveloppe est le composant central de l'animation Save the Date. Elle :
1. Reçoit le sceau A&G (Story 9.1 — DONE)
2. S'ouvre avec animation (cette story)
3. Sera orchestrée dans la timeline globale (Story 9.4)

### Spécifications visuelles détaillées (Source: UX Design)

| Propriété | Spécification |
|-----------|---------------|
| Surface | Blanc Cassé `#FFFDF9` — aplat principal |
| Grain | Quasi-imperceptible — pas de texture papier visible, juste une surface pas "parfaitement lisse" |
| Plis/bords | Ombres de pli très discrètes en `#E8D5A8` (Voile Doré) — profondeur subtile |
| Bordure | Liseré fin doré `#D4A54A` sur les contours |
| Rabat | Partie supérieure triangulaire — même traitement que le corps, s'ouvre en `rotateX()` |
| Proportions | Ratio ~3:2 (format enveloppe classique). ~120px mobile, ~200px desktop |
| Sceau | `SealAG` positionné au centre du rabat, point de fermeture |
| À éviter | Texture papier lourde, ombres portées dramatiques, aspect 3D poussé |

### Architecture des animations CSS

**Keyframes dans `globals.css` :**

```css
/* Sceau se brise avant l'ouverture */
@keyframes seal-break {
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0); opacity: 0; }
}

/* Rabat s'ouvre */
@keyframes envelope-open {
  from { transform: rotateX(0deg); }
  to { transform: rotateX(180deg); }
}

/* Enveloppe entière fade vers ghost */
@keyframes envelope-ghost {
  from { opacity: 1; }
  to { opacity: 0.2; }
}
```

**Progressive enhancement — pattern obligatoire :**

```css
/* Les classes d'animation ne s'appliquent QUE si l'utilisateur accepte les animations */
@media (prefers-reduced-motion: no-preference) {
  .seal-break-animation {
    animation: seal-break 300ms var(--easing-reveal) forwards;
  }
  .envelope-open-animation {
    animation: envelope-open 500ms var(--easing-reveal) forwards;
    transform-origin: top center;
  }
  .envelope-ghost-animation {
    animation: envelope-ghost 400ms ease-out forwards;
  }
}
```

**Note sur `transform-origin` :** Le rabat doit pivoter depuis son bord supérieur (`transform-origin: top center`) pour simuler l'ouverture physique d'un rabat d'enveloppe.

**Note sur les `animation-delay` :** Les delays précis (3000ms pour seal-break, 3200ms pour envelope-open, etc.) seront ajoutés dans Story 9.4 (orchestration). Cette story crée les keyframes et les classes, pas le timing global.

### `prefers-reduced-motion` — Implémentation

L'enveloppe est en `display: none` quand reduced-motion est activé. L'utilisateur voit directement le texte + cadre doré + séparateur, sans enveloppe en arrière-plan (confuse sans contexte narratif).

```css
@media (prefers-reduced-motion: reduce) {
  .envelope-container {
    display: none !important;
  }
}
```

### Structure du SVG — Recommandation

L'enveloppe est composée de plusieurs couches SVG :

```
<div className="envelope-container" aria-hidden="true">
  <!-- Enveloppe SVG -->
  <svg viewBox="0 0 180 120" ...>
    <!-- Corps de l'enveloppe (rectangle arrondi) -->
    <rect ... fill="#FFFDF9" stroke="#D4A54A" />
    <!-- Ombres de pli intérieures -->
    <path ... stroke="#E8D5A8" opacity="0.5" />
    <!-- Rabat triangulaire supérieur (élément séparé pour l'animation) -->
    <polygon ... fill="#FFFDF9" stroke="#D4A54A" />
  </svg>
  <!-- Sceau A&G positionné par-dessus via absolute -->
  <SealAG className="h-8 w-8 sm:h-10 sm:w-10 lg:h-14 lg:w-14" />
</div>
```

**Important :** Le rabat et le sceau doivent être des éléments séparés du corps pour pouvoir les animer indépendamment (rotateX sur le rabat, scale+opacity sur le sceau). Utiliser une structure HTML avec positioning CSS plutôt qu'un seul SVG monolithique.

### SealAG — Composant existant (Story 9.1)

Le `SealAG` est déjà implémenté :
- `components/save-the-date/seal-ag.tsx`
- Export : `export function SealAG({ className }: { className?: string })`
- `viewBox="0 0 60 60"`, `aria-hidden="true"`
- Sizing via `className` prop (classes Tailwind)

### Conventions projet — Rappels critiques

| Convention | Règle |
|-----------|-------|
| Fichier | kebab-case : `envelope.tsx` |
| Export | PascalCase : `export function Envelope()` |
| SVG | Inline dans le composant — jamais dans `/public` |
| `aria-hidden` | `"true"` sur le composant racine |
| Server Component | Zéro `"use client"` |
| Animations | Keyframes + classes dans `globals.css`, pas inline ni CSS modules |
| Tokens | `var(--easing-reveal)` pour les easings — jamais de cubic-bezier en dur |
| Progressive enhancement | `opacity: 1` par défaut, animations dans `@media (prefers-reduced-motion: no-preference)` |
| Pas de `max-w-*` | Sizing par `className` prop |
| Pas de barrel | Import direct |

### Ne PAS faire

- **Ne PAS** intégrer l'enveloppe dans `page.tsx` — l'assemblage est Story 9.4
- **Ne PAS** ajouter les `animation-delay` globaux — c'est Story 9.4 (orchestration)
- **Ne PAS** utiliser Framer Motion, Lottie ou tout package npm
- **Ne PAS** ajouter `"use client"`
- **Ne PAS** mettre de `max-w-*` sur le composant
- **Ne PAS** utiliser de CSS modules — tout dans `globals.css`
- **Ne PAS** hardcoder des easings — utiliser les tokens `var(--easing-*)`

### Budget SVG

Assets actuels : ~4.3 Ko (CornerArabesque × 4 + SealAG). Budget : 150 Ko. L'enveloppe devrait peser ~2-4 Ko (formes simples). Budget total attendu : ~6-8 Ko.

### Project Structure Notes

```
components/save-the-date/
  golden-frame.tsx           ← existant (Story 8.3)
  golden-separator.tsx       ← existant (Story 8.2)
  save-the-date-content.tsx  ← existant (Story 8.2)
  seal-ag.tsx                ← existant (Story 9.1)
  envelope.tsx               ← NOUVEAU (cette story)

app/globals.css              ← MODIFIÉ (ajout keyframes seal-break, envelope-open, envelope-ghost)
```

### References

- [Source: _bmad-output/planning-artifacts/epics-save-the-date.md#Story 2.2]
- [Source: _bmad-output/planning-artifacts/architecture-save-the-date.md#CSS Architecture]
- [Source: _bmad-output/planning-artifacts/architecture-save-the-date.md#Implementation Patterns]
- [Source: _bmad-output/planning-artifacts/ux-design-save-the-date.md#Enveloppe — Spécifications Visuelles]
- [Source: _bmad-output/planning-artifacts/ux-design-save-the-date.md#Acte 3 — La Révélation]
- [Source: components/save-the-date/seal-ag.tsx (composant réutilisé)]
- [Source: _bmad-output/implementation-artifacts/9-1-sceau-ag-svg-monogramme.md#Completion Notes]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

Aucun problème rencontré.

### Completion Notes List

- Task 1 : SVG enveloppe créé avec `viewBox="0 0 180 120"` (ratio 3:2). Corps en rect `#FFFDF9` avec stroke `#D4A54A` (strokeWidth=0.8, rx=2). Grain quasi-imperceptible via SVG `<filter>` (`feTurbulence` fractalNoise + `feBlend` soft-light). Plis intérieurs en `<line>` `#E8D5A8` — diagonales du haut (opacity=0.4, strokeWidth=0.5) et du bas (opacity=0.3, strokeWidth=0.3). Rabat triangulaire supérieur dans un `<div>` séparé (pour animation `rotateX` indépendante) avec `<polygon>` `#FFFDF9` + stroke `#D4A54A` et plis internes. Structure HTML en couches : body SVG + flap div + seal div — chaque couche animable indépendamment.
- Task 2 : `SealAG` importé depuis `@/components/save-the-date/seal-ag` et positionné au centre du point de fermeture (absolute + left-1/2 + top-1/2 + translate). Sizing responsive : `h-8 w-8 sm:h-10 sm:w-10 lg:h-14 lg:w-14` (~32px mobile / ~56px desktop).
- Task 3 : 3 keyframes ajoutés dans `globals.css` : `seal-break` (scale(1)→scale(0) + opacity 1→0), `envelope-open` (rotateX 0→180deg), `envelope-ghost` (opacity 1→0.2). Classes d'animation dans `@media (prefers-reduced-motion: no-preference)` : `.envelope-seal` (seal-break 300ms var(--easing-reveal) forwards), `.envelope-flap` (envelope-open 500ms var(--easing-reveal) forwards, transform-origin: top center), `.envelope-body` (envelope-ghost 400ms ease-out forwards). Pas de `animation-delay` — sera Story 9.4.
- Task 4 : Composant `Envelope` exporté PascalCase avec prop `className?: string`. `aria-hidden="true"` sur le div racine. Server Component pur (zéro `"use client"`). `.envelope-container { display: none !important; }` dans `@media (prefers-reduced-motion: reduce)`.
- Task 5 : `npm run lint` ✅ et `npm run build` ✅ — zéro erreur.

### File List

- `components/save-the-date/envelope.tsx` — NOUVEAU
- `app/globals.css` — MODIFIÉ (ajout keyframes + animation classes + reduced-motion rule)
