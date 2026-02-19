# Story 9.4: Orchestration Animation — Timeline 5000ms & Progressive Enhancement

Status: done

## Story

As a invité,
I want que l'animation complète se joue de manière fluide en une séquence cohérente de 5 secondes au chargement,
So that je vis un spectacle de 3 actes sans saccade ni incohérence.

## Acceptance Criteria

1. **Given** un visiteur accède à la page `/` (animations autorisées) **When** la page se charge **Then** l'animation se déroule selon la timeline exacte :
   - `0-1500ms` : Acte 1 — pigeon entre en vol (wing-flap + pigeon-fly)
   - `1500-1800ms` : Acte 2 — enveloppe apparaît au centre (deposit), pigeon pause
   - `1800-2700ms` : Acte 2 — pigeon s'envole vers le haut avec fade-out (pigeon-depart)
   - `2700-3000ms` : Micro-pause — enveloppe seule, sceau A&G visible
   - `3000-3300ms` : Acte 3 — sceau se brise (seal-break)
   - `3200-3700ms` : Acte 3 — rabat de l'enveloppe s'ouvre (envelope-open)
   - `3500-3700ms` : "Ahmed & Ghizlaine" apparaît (text-reveal)
   - `3700-3900ms` : "17 Octobre 2026" apparaît (text-reveal)
   - `3900-4100ms` : "Casablanca" apparaît (text-reveal)
   - `4100-4200ms` : Séparateur doré apparaît (text-reveal)
   - `4200-4600ms` : Message poétique apparaît (text-reveal)
   - `4600-5000ms` : Stabilisation — enveloppe fade à ~20-25% opacité (envelope-ghost)
2. **And** tous les `animation-delay` sont calculés depuis `t=0` (pas d'orchestrateur JS)
3. **And** le keyframe `text-reveal` (opacity 0→1 + translateY +8px→0) est ajouté dans `globals.css` avec `animation-fill-mode: both`
4. **And** toutes les animations sont wrappées dans `@media (prefers-reduced-motion: no-preference)` — progressive enhancement
5. **And** le contenu textuel est `opacity: 1` par défaut (progressive enhancement), overridé par `animation-fill-mode: both` dans le media query
6. **And** l'animation se joue une seule fois (`animation-iteration-count: 1`) sur tous les éléments sauf wing-flap (FR-STD-6)
7. **And** `page.tsx` assemble tous les composants : `GoldenFrame`, `PigeonVoyageur`, `Envelope`, `SaveTheDateContent` avec positionnement correct (z-layering)
8. **And** imports directs (pas de barrel `index.tsx`)
9. **And** durée totale = 5000ms (FR-STD-7)
10. **And** les tokens d'easing et de durée sont utilisés (`var(--easing-*)`, `var(--animation-*)`) — jamais de valeurs hardcodées
11. **And** l'Envelope est invisible de 0 à ~1500ms (avant le dépôt du pigeon), visible de ~1500ms à 4600ms, puis ghost à 20-25% de 4600ms à 5000ms
12. **And** le PigeonVoyageur combine animation de vol (offset-path) et animation de départ (translateY + opacity) sans conflit — avec fallback `@supports` fonctionnel
13. **And** 60fps sans jank sur appareils cibles (NFR-1)

## Tasks / Subtasks

- [x] Task 1: Ajouter le keyframe `text-reveal` et les classes d'animation texte (AC: #3, #4, #5)
  - [x] 1.1: Créer le keyframe `text-reveal` dans `globals.css` : `opacity: 0; transform: translateY(8px)` → `opacity: 1; transform: translateY(0)`
  - [x] 1.2: Créer les classes `.text-line-1` à `.text-line-5` dans `@media (prefers-reduced-motion: no-preference)` avec `animation: text-reveal <durée> var(--easing-reveal) both` et les `animation-delay` respectifs : 3500ms, 3700ms, 3900ms, 4100ms, 4200ms
  - [x] 1.3: Durées d'animation par ligne : 200ms pour prénoms/date/lieu, 100ms pour séparateur, 400ms pour message
- [x] Task 2: Ajouter les `animation-delay` à toutes les animations existantes (AC: #1, #2, #10, #11)
  - [x] 2.1: Créer le keyframe `envelope-lifecycle` pour gérer la visibilité complète de l'enveloppe (invisible 0-1500ms, visible 1500-4600ms, ghost 4600-5000ms) — remplace l'animation `envelope-ghost` sur `.envelope-container`
  - [x] 2.2: `.envelope-container` → `animation: envelope-lifecycle 5000ms both` (remplace l'ancien `envelope-ghost`), conserver `perspective: 800px`
  - [x] 2.3: `.envelope-seal` → ajouter `animation-delay: 3000ms` + `animation-fill-mode: both` (sceau visible avant 3000ms grâce au FROM state = scale(1) opacity(1))
  - [x] 2.4: `.envelope-flap` → ajouter `animation-delay: 3200ms` (FROM state = rotateX(0) = fermé, donc `forwards` suffit)
  - [x] 2.5: Pigeon offset-path : combiner `pigeon-fly` et `pigeon-depart` en double animation sur `.pigeon-container` — `animation: pigeon-fly var(--animation-act1) var(--easing-flight) forwards, pigeon-depart 900ms ease-out 1800ms forwards;` (les propriétés animées sont différentes : `offset-distance` vs `transform`+`opacity`)
  - [x] 2.6: Pigeon fallback (`@supports not`) : créer un keyframe combiné `pigeon-full-fallback` qui intègre vol + pause + départ en une seule animation sur `transform` + `opacity`, durée ~2700ms
  - [x] 2.7: Wing-flap : pas de delay (0ms), reste `infinite alternate` — les ailes battent pendant toute la vie du pigeon
- [x] Task 3: Modifier `save-the-date-content.tsx` pour ajouter les classes d'animation (AC: #3, #5)
  - [x] 3.1: Ajouter la classe `text-line-1` sur le `<h1>` (prénoms)
  - [x] 3.2: Ajouter la classe `text-line-2` sur le `<time>` (date)
  - [x] 3.3: Ajouter la classe `text-line-3` sur le `<address>` (lieu)
  - [x] 3.4: Ajouter la classe `text-line-4` sur le wrapper `<div>` du `GoldenSeparator`
  - [x] 3.5: Ajouter la classe `text-line-5` sur le `<blockquote>` (message)
- [x] Task 4: Assembler tous les composants dans `page.tsx` (AC: #7, #8)
  - [x] 4.1: Importer `PigeonVoyageur` et `Envelope` depuis `@/components/save-the-date/`
  - [x] 4.2: Ajouter `PigeonVoyageur` dans le `GoldenFrame`, positionné en `absolute` avec z-index supérieur à l'enveloppe. Le sizing responsive : `h-20 w-24 sm:h-32 sm:w-40 lg:h-40 lg:w-48`
  - [x] 4.3: Ajouter `Envelope` dans le `GoldenFrame`, positionné en `absolute` centré (`inset-0 flex items-center justify-center`) avec z-index inférieur au texte. Le sizing responsive : `h-28 w-[168px] sm:h-44 sm:w-[264px] lg:h-[200px] lg:w-[300px]`
  - [x] 4.4: S'assurer que `SaveTheDateContent` est au-dessus de l'enveloppe ghost (z-index relatif)
  - [x] 4.5: Ajouter `overflow-hidden` sur le `GoldenFrame` ou son parent si le pigeon sort du cadre pendant le vol — NON REQUIS : le pigeon fade à opacity: 0 avant d'atteindre les bords
- [x] Task 5: Vérifier la cohérence `prefers-reduced-motion` (AC: #4, #5)
  - [x] 5.1: Vérifier que `.pigeon-container`, `.envelope-container` restent `display: none !important` dans le bloc `@media (prefers-reduced-motion: reduce)`
  - [x] 5.2: Vérifier que le texte est visible par défaut (`opacity: 1` natif HTML) — les classes `.text-line-*` n'affectent l'opacité QUE dans le media query `no-preference`
  - [x] 5.3: Vérifier l'ordre des déclarations CSS : état par défaut visible → override animation dans media query
- [x] Task 6: Validation build + lint + test visuel
  - [x] 6.1: `npm run lint` sans erreur
  - [x] 6.2: `npm run build` sans erreur
  - [x] 6.3: Vérifier que la page `/` est toujours `○ Static` dans le build output

## Dev Notes

### CRITIQUE : Cette story est l'assemblage final — le moment de vérité

C'est la story qui donne vie à tout le travail des Stories 8.x et 9.1-9.3. Elle orchestre les 6 composants en une animation fluide de 5 secondes. C'est aussi la story la plus risquée car elle modifie les animations existantes en ajoutant des `animation-delay` et recompose `page.tsx`.

### Timeline Complète — Référence Absolue

```
0s        1s        2s        3s        4s        5s
|---------|---------|---------|---------|---------|
[===== Acte 1 =====]
  pigeon: vol arc    ralenti
         [envelope apparaît à 1500ms]
                    [==== Acte 2 ====]
                     pause   envol ↑ fade
                     300ms   900ms
                                    [P]
                                    300ms
                                      [====== Acte 3 ======]
                                       seal   flap  texte    stab.
                                       break  open  A&G|date|lieu|—|msg
                                                                    ghost
```

**Mapping animation-delay (depuis t=0) :**

| Animation | Élément CSS | Delay | Durée | Fin | Fill-mode |
|-----------|-------------|-------|-------|-----|-----------|
| `pigeon-fly` | `.pigeon-container` | 0ms | 1500ms (`--animation-act1`) | 1500ms | `forwards` |
| `pigeon-depart` | `.pigeon-container` (2e animation) | 1800ms | 900ms | 2700ms | `forwards` |
| `wing-flap` | `.pigeon-wing-left`, `.pigeon-wing-right` | 0ms | 350ms | ∞ | — |
| `envelope-lifecycle` | `.envelope-container` | 0ms | 5000ms | 5000ms | `both` |
| `seal-break` | `.envelope-seal` | 3000ms | 300ms | 3300ms | `both` |
| `envelope-open` | `.envelope-flap` | 3200ms | 500ms | 3700ms | `forwards` |
| `text-reveal` (prénoms) | `.text-line-1` | 3500ms | 200ms | 3700ms | `both` |
| `text-reveal` (date) | `.text-line-2` | 3700ms | 200ms | 3900ms | `both` |
| `text-reveal` (lieu) | `.text-line-3` | 3900ms | 200ms | 4100ms | `both` |
| `text-reveal` (séparateur) | `.text-line-4` | 4100ms | 100ms | 4200ms | `both` |
| `text-reveal` (message) | `.text-line-5` | 4200ms | 400ms | 4600ms | `both` |

### Keyframe `text-reveal`

```css
@keyframes text-reveal {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Important — `animation-fill-mode: both` :**
- `backwards` : applique le FROM state (opacity: 0, translateY(8px)) pendant le delay → le texte est invisible avant son apparition
- `forwards` : conserve le TO state (opacity: 1, translateY(0)) après l'animation → le texte reste visible
- Le texte est `opacity: 1` par défaut (HTML natif) — l'override `both` ne s'applique QUE dans `@media (prefers-reduced-motion: no-preference)`

### Keyframe `envelope-lifecycle` — Visibilité complète de l'enveloppe

L'enveloppe doit être :
1. **Invisible de 0 à 1500ms** (le pigeon ne l'a pas encore déposée)
2. **Visible de 1500ms à 4600ms** (déposée au centre, sceau visible)
3. **Ghost (20-25% opacité) de 4600ms à 5000ms** (texte prend le devant)

Un seul keyframe gère les 3 phases sur une durée de 5000ms :

```css
@keyframes envelope-lifecycle {
  0% { opacity: 0; }
  30% { opacity: 0; }     /* 30% de 5000ms = 1500ms — invisible pendant le vol */
  30.01% { opacity: 1; }  /* Apparition instantanée au dépôt */
  92% { opacity: 1; }     /* 92% de 5000ms = 4600ms — visible pendant la révélation */
  100% { opacity: 0.2; }  /* Ghost final */
}
```

Ce keyframe **remplace** l'ancien `envelope-ghost` sur `.envelope-container`. L'ancien `envelope-ghost` keyframe reste dans `globals.css` (pas de suppression de code existant) mais n'est plus référencé.

### Pigeon : Double Animation (offset-path + depart)

**Navigateurs modernes (`offset-path` supporté) :**

Le `pigeon-fly` anime `offset-distance` et le `pigeon-depart` anime `transform` + `opacity`. Ce sont des propriétés CSS **différentes**, donc les deux animations coexistent sans conflit sur le même `.pigeon-container` :

```css
@supports (offset-path: path("M0 0")) {
  @media (prefers-reduced-motion: no-preference) {
    .pigeon-container {
      offset-path: path("M-150,200 C-50,50 150,-30 350,80 Q450,140 500,160");
      offset-rotate: auto;
      animation:
        pigeon-fly var(--animation-act1) var(--easing-flight) forwards,
        pigeon-depart 900ms ease-out 1800ms forwards;
    }
  }
}
```

**Navigateurs sans `offset-path` (fallback) :**

Le `pigeon-fly-fallback` et `pigeon-depart` utilisent TOUS DEUX `transform` — conflit ! Solution : créer un keyframe combiné `pigeon-full-fallback` qui intègre vol + pause + départ en une seule animation :

```css
@keyframes pigeon-full-fallback {
  0%   { transform: translate(-150px, 100px) rotate(-10deg); opacity: 1; }
  20%  { transform: translate(-50px, 30px) rotate(-7deg); opacity: 1; }
  40%  { transform: translate(50px, -10px) rotate(-3deg); opacity: 1; }
  55%  { transform: translate(150px, 20px) rotate(0deg); opacity: 1; }
  /* ~1500ms — pigeon au centre, micro-pause */
  67%  { transform: translate(150px, 20px) rotate(0deg); opacity: 1; }
  /* ~1800ms — départ commence */
  100% { transform: translate(150px, -280px) rotate(-5deg); opacity: 0; }
  /* ~2700ms — pigeon disparu */
}
```

Durée : 2700ms. Remplace `pigeon-fly-fallback` dans le bloc `@supports not`.

### Assemblage `page.tsx` — Z-layering

```
z-auto : GoldenFrame (border + coins arabesques — permanent)
z-0    : Envelope (absolute centré — invisible → visible → ghost)
z-10   : PigeonVoyageur (absolute — vole puis disparaît)
z-20   : SaveTheDateContent (relative — texte au-dessus de tout)
```

```tsx
import type { Metadata } from 'next'
import { GoldenFrame } from '@/components/save-the-date/golden-frame'
import { PigeonVoyageur } from '@/components/save-the-date/pigeon-voyageur'
import { Envelope } from '@/components/save-the-date/envelope'
import { SaveTheDateContent } from '@/components/save-the-date/save-the-date-content'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function SaveTheDatePage() {
  return (
    <main className="flex min-h-dvh flex-col justify-center bg-cream-warm px-6 sm:px-8">
      <GoldenFrame>
        <Envelope className="absolute inset-0 z-0 flex items-center justify-center" />
        <PigeonVoyageur className="absolute z-10 h-20 w-24 sm:h-32 sm:w-40 lg:h-40 lg:w-48" />
        <SaveTheDateContent />
      </GoldenFrame>
    </main>
  )
}
```

**Notes :**
- `GoldenFrame` est déjà `relative` — les enfants `absolute` se positionnent dedans
- L'Envelope est centrée via `inset-0 flex items-center justify-center` (le div envelope-container prend toute la zone, l'enveloppe elle-même est centrée)
- Le PigeonVoyageur est positionné par son animation (offset-path ou translate) — la position CSS de base n'a pas d'importance car l'animation l'override
- `SaveTheDateContent` est `relative` implicitement (pas de `absolute`) → au-dessus en z-order
- L'overflow du pigeon sortant du cadre est géré par le pigeon fading à opacity: 0 avant d'atteindre les bords
- **Important :** Le Envelope wrapper externe (`className` prop) est un `<div>` AUTOUR du `envelope-container`. Le sizing de l'enveloppe interne est contrôlé par les classes existantes dans `envelope.tsx`, le wrapper externe contrôle le positionnement.

Hmm, en fait il faut vérifier : actuellement `Envelope` a un `className` qui s'ajoute au `.envelope-container`. Si on passe `absolute inset-0 z-0 flex items-center justify-center`, le `.envelope-container` lui-même deviendra le wrapper centering. Mais `.envelope-container` a `position: relative` (pour le positionnement interne du seal et du flap). Ça peut conflictuer avec `absolute`. Il faudra peut-être wraper l'Envelope dans un `<div>` de positionnement dans `page.tsx` plutôt que de passer les classes via `className`.

**Solution recommandée dans `page.tsx` :**
```tsx
<div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
  <Envelope className="h-28 w-[168px] sm:h-44 sm:w-[264px] lg:h-[200px] lg:w-[300px]" />
</div>
```

### Sizing responsive de l'enveloppe (via `className` prop)

| Breakpoint | Taille |
|-----------|--------|
| Mobile (< 640px) | `h-28 w-[168px]` (~112×168px, ratio 3:2) |
| `sm` (640px) | `h-44 w-[264px]` (~176×264px) |
| `lg` (1024px) | `h-[200px] w-[300px]` (200×300px, ratio 3:2 exact) |

### Sizing responsive du pigeon (via `className` prop)

| Breakpoint | Taille |
|-----------|--------|
| Mobile (< 640px) | `h-20 w-24` (~80×96px) |
| `sm` (640px) | `h-32 w-40` (~128×160px) |
| `lg` (1024px) | `h-40 w-48` (~160×192px) |

### Intelligence Stories précédentes

**Story 9-1 (SealAG) — patterns confirmés :**
- viewBox carré `0 0 60 60`, sizing via `className` prop
- Server Component pur, `aria-hidden="true"`

**Story 9-2 (Envelope) — patterns confirmés :**
- Layered HTML : body SVG + flap div + seal div
- `perspective: 800px` sur `.envelope-container` (fix review)
- `backface-visibility: hidden` sur `.envelope-flap` (fix review)
- `h-[58%]` Tailwind au lieu de style inline (fix review)
- `.envelope-container` est `relative` (pour positionnement interne)

**Story 9-3 (PigeonVoyageur) — patterns confirmés :**
- viewBox `0 0 120 80`, div wrapper `.pigeon-container`
- Aile arrière (`pigeon-wing-right`) rendue AVANT le corps (z-order SVG)
- `transform-origin` en pourcentages (`31% 100%`, `40% 100%`) relatifs au bounding-box (fix review)
- `.pigeon-depart` class ajoutée mais non utilisée (pour cette story)
- offset-path + fallback `@supports` fonctionnels

### État actuel des animations CSS dans `globals.css`

Les animations suivantes existent SANS `animation-delay` — cette story ajoute le timing :

| Classe CSS | Animation actuelle | Modification Story 9.4 |
|-----------|-------------------|------------------------|
| `.pigeon-wing-left` | `wing-flap 350ms infinite alternate` | Inchangé (0ms delay, infinite) |
| `.pigeon-wing-right` | `wing-flap 350ms infinite alternate-reverse` | Inchangé |
| `.pigeon-container` (offset-path) | `pigeon-fly var(--animation-act1) forwards` | + `pigeon-depart 900ms ease-out 1800ms forwards` (double animation) |
| `.pigeon-container` (fallback) | `pigeon-fly-fallback var(--animation-act1) forwards` | Remplacé par `pigeon-full-fallback 2700ms forwards` |
| `.pigeon-depart` | `pigeon-depart 600ms forwards` | Classe supprimée — intégrée dans la double animation `.pigeon-container` |
| `.envelope-container` | `envelope-ghost 400ms ease-out forwards` + `perspective: 800px` | Remplacé par `envelope-lifecycle 5000ms both` + `perspective: 800px` |
| `.envelope-seal` | `seal-break 300ms forwards` | + `animation-delay: 3000ms` |
| `.envelope-flap` | `envelope-open 500ms forwards` | + `animation-delay: 3200ms` |

### Conventions projet — Rappels critiques

| Convention | Règle |
|-----------|-------|
| Server Component | Zéro `"use client"` — la page entière reste un Server Component pur |
| Animations | Tout dans `globals.css` — pas de styles inline, pas de CSS modules |
| Tokens | `var(--easing-flight)`, `var(--easing-reveal)`, `var(--animation-act1)` — jamais hardcoder |
| Progressive enhancement | `opacity: 1` par défaut, animations dans `@media (prefers-reduced-motion: no-preference)` |
| `animation-fill-mode` | `both` sur le texte et l'enveloppe lifecycle, `forwards` sur les éléments qui conservent leur état final |
| Pas de `max-w-*` | Sizing par `className` prop |
| Pas de barrel | Import direct depuis chaque fichier composant |
| Pas de JS | Zéro orchestrateur JS — tout via `animation-delay` depuis CSS pur |

### Ne PAS faire

- **Ne PAS** ajouter `"use client"` — le CSS pur gère tout
- **Ne PAS** utiliser Framer Motion, Lottie ou tout package npm
- **Ne PAS** utiliser de CSS modules — tout dans `globals.css`
- **Ne PAS** hardcoder des easings ou durées — utiliser les tokens `var(--easing-*)` et `var(--animation-*)`
- **Ne PAS** mettre de `max-w-*` sur les composants
- **Ne PAS** supprimer les keyframes existants (`pigeon-fly-fallback`, `pigeon-depart`, `envelope-ghost`) — ils restent dans `globals.css` même s'ils ne sont plus référencés directement (ils servent de documentation et pourraient être réutilisés)
- **Ne PAS** modifier le SVG du pigeon ni de l'enveloppe — seuls les CSS et le TSX d'assemblage changent
- **Ne PAS** modifier `golden-frame.tsx`, `golden-separator.tsx`, `seal-ag.tsx` — ces composants sont stables

### Budget performance

Assets SVG actuels : ~10-12 Ko sur 150 Ko de budget. L'animation est 100% CSS (0 Ko JS), GPU-accelerated (`transform`, `opacity`, `offset-distance`). Cible : 60fps sur iPhone 11 et Galaxy A52.

### Project Structure Notes

```
app/
  page.tsx                             ← MODIFIÉ (assemblage 4 composants)
  globals.css                          ← MODIFIÉ (text-reveal, envelope-lifecycle, animation-delay, pigeon-full-fallback)

components/save-the-date/
  golden-frame.tsx                     ← INCHANGÉ (Story 8.3)
  golden-separator.tsx                 ← INCHANGÉ (Story 8.2)
  save-the-date-content.tsx            ← MODIFIÉ (ajout classes text-line-1..5)
  seal-ag.tsx                          ← INCHANGÉ (Story 9.1)
  envelope.tsx                         ← INCHANGÉ (Story 9.2)
  pigeon-voyageur.tsx                  ← INCHANGÉ (Story 9.3)
```

### References

- [Source: _bmad-output/planning-artifacts/epics-save-the-date.md#Story 2.4]
- [Source: _bmad-output/planning-artifacts/architecture-save-the-date.md#Animation Architecture]
- [Source: _bmad-output/planning-artifacts/architecture-save-the-date.md#CSS Architecture]
- [Source: _bmad-output/planning-artifacts/architecture-save-the-date.md#CSS Patterns]
- [Source: _bmad-output/planning-artifacts/ux-design-save-the-date.md#Mécanique Détaillée de l'Animation]
- [Source: _bmad-output/planning-artifacts/ux-design-save-the-date.md#État Final]
- [Source: _bmad-output/planning-artifacts/ux-design-save-the-date.md#État prefers-reduced-motion]
- [Source: _bmad-output/implementation-artifacts/9-1-sceau-ag-svg-monogramme.md#Completion Notes]
- [Source: _bmad-output/implementation-artifacts/9-2-enveloppe-svg-animation-ouverture.md#Completion Notes]
- [Source: _bmad-output/implementation-artifacts/9-3-pigeon-voyageur-svg-animation-vol.md#Completion Notes]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

N/A — aucune erreur rencontrée. Lint et build passés du premier coup.

### Completion Notes List

- 3 nouveaux keyframes ajoutés : `text-reveal`, `envelope-lifecycle`, `pigeon-full-fallback`
- Toutes les animations orchestrées via `animation-delay` depuis `t=0`, durée totale 5000ms, zéro JS
- `envelope-lifecycle` remplace `envelope-ghost` sur `.envelope-container` — gère les 3 phases (invisible → visible → ghost) en un seul keyframe sur 5000ms
- Double animation sur `.pigeon-container` (offset-path) : `pigeon-fly` + `pigeon-depart` — propriétés différentes, pas de conflit
- `pigeon-full-fallback` combiné pour navigateurs sans `offset-path` (vol + pause + départ en un seul keyframe 2700ms)
- `animation-fill-mode: both` sur le texte pour progressive enhancement (invisible pendant le delay, visible après l'animation)
- Texte `opacity: 1` par défaut en HTML — override uniquement dans `@media (prefers-reduced-motion: no-preference)`
- `page.tsx` assemble 4 composants avec z-layering : Envelope z-0, PigeonVoyageur z-10, SaveTheDateContent z-20
- Envelope wrappée dans un `<div>` de positionnement (`pointer-events-none absolute inset-0 z-0`) pour éviter conflit avec `position: relative` interne
- Task 4.5 (`overflow-hidden`) non requise : le pigeon fade à `opacity: 0` avant d'atteindre les bords du cadre
- Page `/` reste `○ Static` — Server Components purs, aucun `"use client"`

### File List

- `app/globals.css` — Ajout keyframes `text-reveal`, `envelope-lifecycle`, `pigeon-full-fallback` ; restructuration section animations avec `animation-delay` orchestrés
- `components/save-the-date/save-the-date-content.tsx` — Ajout classes `text-line-1` à `text-line-5` + `relative z-20`
- `app/page.tsx` — Assemblage 4 composants (GoldenFrame, Envelope, PigeonVoyageur, SaveTheDateContent) avec z-layering
