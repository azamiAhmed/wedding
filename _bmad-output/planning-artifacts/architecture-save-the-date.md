---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: 'complete'
completedAt: '2026-02-18'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd-save-the-date.md'
  - '_bmad-output/planning-artifacts/ux-design-save-the-date.md'
  - '_bmad-output/planning-artifacts/architecture.md'
workflowType: 'architecture'
project_name: 'wedding — Save the Date'
user_name: 'Mister azami'
date: '2026-02-18'
---

# Architecture Decision Document — Save the Date Animé (Pigeon Voyageur)

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Vue d'Ensemble des Exigences

**Exigences Fonctionnelles (11 FR-STDs) :**

| Catégorie | FRs | Implication architecturale |
|-----------|-----|---------------------------|
| Animation (FR-STD-1 à 7) | Pigeon vol + dépôt enveloppe + ouverture + révélation texte, 4-5s | CSS keyframes `translate` + `rotate`, `animation-delay` séquentiels, Lottie pigeon, SVG enveloppe/sceau, `animation-fill-mode: forwards`. Client Component `SaveTheDateScene` orchestre le déclenchement via classes CSS `.scene-ready` / `.pigeon-done` / `.envelope-done`. |
| Accessibilité (FR-STD-8-9) | `prefers-reduced-motion`, sémantique HTML | `@media (prefers-reduced-motion: reduce)` CSS pur. `Envelope` et `PigeonVoyageur` en `display: none` (pas `animation: none`). `aria-hidden` sur éléments décoratifs. HTML sémantique (`h1`, `time`, `address`, `blockquote`). |
| Intégration (FR-STD-10-11) | Haut de la landing page, responsive 360px-1920px | Remplacement direct de `app/page.tsx` existant. Tailwind responsive mobile-first, `min-h-dvh`. |

**Exigences Non-Fonctionnelles :**

| Catégorie | Contrainte | Impact architecture |
|-----------|-----------|---------------------|
| Performance | 60fps, FCP < 1s, Lighthouse ≥ 90, assets < 150 Ko | Lottie pigeon (fichiers JSON optimisés), SVG enveloppe/sceau, CSS animations GPU-accelerated (`transform`, `opacity`), Client Components pour orchestration animation + Lottie |
| Style visuel | Flat premium, palette dorée/crème, Cormorant Garamond (300, 400) + Geist Sans | Héritage design system existant, tokens `@theme inline`. Vérifier que Cormorant Garamond poids 300 (Light) et 400 (Regular) sont chargés dans le root layout. |
| Technique | Next.js 16, CSS + Lottie, SVG, pas de service payant | Une dépendance ajoutée (`lottie-react`), zéro API, zéro DB |

### Échelle & Complexité

- **Domaine** : Frontend animation CSS sur infrastructure Next.js existante
- **Complexité** : Basse — zéro backend, zéro état, une seule page
- **Composants architecturaux estimés** : ~8 (SaveTheDateScene, GoldenFrame, PigeonVoyageur, Envelope, SealAG, SaveTheDateContent, GoldenSeparator + page.tsx)
- **Dépendances nouvelles** : 1 package — `lottie-react` (rendu pigeon via Lottie JSON)

### Contraintes Techniques & Dépendances

| Contrainte | Source | Impact |
|-----------|--------|--------|
| CSS Animations + Lottie | UX Design / Implémentation | Pigeon via `lottie-react` (fichiers JSON `/design/oiseau.json` mobile, `/design/pigeon.json` desktop ≥1024px). Enveloppe/sceau en SVG inline. Trajectoire pigeon via keyframes `translate` + `rotate` (pas de `offset-path`). |
| Client Components orchestration | Implémentation | `SaveTheDateScene` (`'use client'`) orchestre le gating via `.scene-ready`, `.pigeon-done`, `.envelope-done`. `PigeonVoyageur` (`'use client'`) charge Lottie via `fetch()` + `useEffect`. Tous les autres composants restent Server Components. |
| Animation gating par JS | Implémentation | Animations NOT autoplay — tous les éléments démarrent à `opacity: 0` en CSS. `.scene-ready` ajoutée par JS après Lottie loads + 2 `requestAnimationFrame`, ou après 3s timeout fallback. |
| Budget 5000ms | PRD + UX Design | Timeline au ms près avec `animation-delay` depuis la classe `.scene-ready` |
| Assets < 150 Ko | PRD | Lottie JSON pigeon + SVG enveloppe + sceau — total combiné |
| Remplace `app/page.tsx` | Architecture existante | Remplacement direct de la landing non-invités (FR34). L'ancienne landing est supprimée — le Save the Date EST la page d'accueil publique. |

### Préoccupations Transversales

1. **`prefers-reduced-motion`** — Layout différent, pas juste animations désactivées. `Envelope` et `PigeonVoyageur` en `display: none`. Affichage : texte + cadre doré + séparateur sur fond crème. Pas d'enveloppe en arrière-plan.

2. **Fallback chargement lent** — Le contenu textuel est dans le DOM dès le départ (`opacity: 0`), timeout → affichage direct. Le fond crème + cadre doré sont le loading state.

3. **Open Graph WhatsApp** — Généré via `opengraph-image.tsx` Next.js (pattern cohérent avec `/invite/[slug]/opengraph-image.tsx` existant). Rendu serveur de l'enveloppe fermée + sceau A&G. `og:title` "Ahmed & Ghizlaine — Save the Date", `og:description` "17 Octobre 2026 · Casablanca".

4. **Color tokens** — Tokens couleur spécifiques : `--color-mauve-deep: #6B3A4E` (date), `--color-olive-deep: #4A5E3A` (lieu), `--color-mauve-soft: #7A5A6A` (message).

5. **Background images** — Mobile : `/images/rings/arriere plan 4.jpeg`, Desktop (≥1024px) : `/images/rings/arriere plan 2.jpg`. Appliquées via classe CSS `.landing-bg` avec `@media (min-width: 1024px)` dans `globals.css`.

6. **Polices Cormorant Garamond** — Poids 300 (Light) et 400 (Regular) requis. Vérifier le chargement dans `app/layout.tsx` racine — ajouter si absent. Geist Sans déjà disponible.

7. **Zéro stockage client** — Explicitement : pas de `localStorage`, pas de cookie, pas de session. Le replay à chaque visite est intentionnel (valeur de partage). Aucun mécanisme "déjà vu".

8. **Stratégie de remplacement `page.tsx`** — Remplacement direct. Le Save the Date est la page d'accueil permanente pour la phase actuelle du projet. Pas de flag d'environnement — la landing non-invités précédente est obsolète.

## Starter Template Evaluation

### Domaine Technologique

**Frontend animation CSS** sur infrastructure Next.js existante — projet brownfield.

### Évaluation

Aucun starter additionnel nécessaire. Le Save the Date s'intègre à la base de code existante avec une seule dépendance ajoutée (`lottie-react`).

**Stack héritée — déjà opérationnelle :**

| Décision | Valeur | Statut |
|----------|--------|--------|
| Framework | Next.js 16 App Router | Installé |
| Runtime | React 19 | Installé |
| Langage | TypeScript 5 strict | Configuré |
| Styling | Tailwind CSS 4 (`@tailwindcss/postcss`, `@theme inline`) | Configuré |
| Linting | ESLint 9 flat config + core-web-vitals + typescript | Configuré |
| Build | Turbopack | Configuré |
| Fonts | Geist Sans + Geist Mono | Chargées |
| Déploiement | Vercel auto-deploy (main → prod, branches → preview) | Configuré |

**Ajouts requis :**

1. Police Cormorant Garamond (poids 300 Light + 400 Regular) dans `app/layout.tsx` via `next/font/google`.
2. Package `lottie-react` — rendu du pigeon via fichiers Lottie JSON (`/design/oiseau.json` mobile, `/design/pigeon.json` desktop).
3. Police locale `/public/fonts/cormorant-garamond-light.ttf` — pour le rendu OG image via Satori (`readFileSync`).

**Dépendances Save the Date : 1 package npm supplémentaire (`lottie-react`).**

L'animation combine CSS natif (keyframes `translate`/`rotate`, `animation-delay`, `@media prefers-reduced-motion`), Lottie (pigeon), et SVG inline (enveloppe, sceau). L'Open Graph utilise l'API native `opengraph-image.tsx` de Next.js avec une police TTF locale.

## Core Architectural Decisions

### Analyse de Priorité

**Décisions critiques (bloquent l'implémentation) :**
- Mécanisme de déclenchement animation (gating JS via `.scene-ready` sur Client Component orchestrateur)
- Structure des composants (dossier dédié `components/save-the-date/`)
- Architecture CSS (tout dans `globals.css`)

**Décisions importantes (façonnent l'architecture) :**
- Lottie pour le pigeon (deux fichiers JSON : mobile/desktop)
- Fallback contenu (éléments à `opacity: 0` en CSS, timeout 3s pour affichage direct)
- Génération Open Graph (`opengraph-image.tsx` Satori avec police TTF locale)

**Décisions différées :**
- Aucune — le scope est suffisamment restreint pour tout décider maintenant

**Note :** L'approche `offset-path` initialement planifiée n'a jamais été implémentée. Seuls les keyframes `translate` + `rotate` sont utilisés pour les trajectoires. Le pigeon est rendu via Lottie (pas SVG inline). `SaveTheDateScene` et `PigeonVoyageur` sont des Client Components (`'use client'`), les autres composants restent Server Components.

### Animation Architecture

**Déclenchement : Gating JS via `.scene-ready`**

| Aspect | Décision |
|--------|----------|
| Trigger | Classe `.scene-ready` ajoutée par `SaveTheDateScene` (Client Component) après chargement Lottie + 2 `requestAnimationFrame`, ou après timeout 3s |
| Orchestrateur | `SaveTheDateScene` (`'use client'`) — gère `.scene-ready`, `.pigeon-done`, `.envelope-done` |
| Pigeon | Rendu via `lottie-react` dans `PigeonVoyageur` (`'use client'`). Deux fichiers : `/design/oiseau.json` (mobile), `/design/pigeon.json` (desktop ≥1024px) |
| Trajectoire | Keyframes `translate` + `rotate` uniquement — `offset-path` jamais utilisé |
| Enveloppe | SVG inline, suit le pigeon à `scale(0.12)`, se dépose au centre, grandit en taille réelle. Keyframes : `envelope-lifecycle-mobile` et `envelope-lifecycle-desktop` |
| État initial | Tous les éléments animés démarrent à `opacity: 0` en CSS |
| `animation-fill-mode` | `forwards` sur les éléments qui conservent leur état final |
| Classes de gating | `.scene-ready` (déclenchement global), `.pigeon-done` (pigeon terminé), `.envelope-done` (protection breakpoint enveloppe) |

**Trajectoire pigeon : Keyframes `translate` + `rotate`**

Pas de `offset-path`, pas de `@supports`. L'approche initialement prévue avec `offset-path` n'a jamais été implémentée. La trajectoire est entièrement décrite via des keyframes multi-étapes `translate` + `rotate`, avec des variantes mobile/desktop :
- `pigeon-lifecycle-mobile`
- `pigeon-lifecycle-desktop`

**Fallback contenu : Timeout 3s**

| État | Texte | Animation |
|------|-------|-----------|
| Lottie chargé rapidement | `opacity: 0` → `.scene-ready` ajoutée → animations CSS démarrent → révélation | Complète |
| Lottie lent / échec | `opacity: 0` → timeout 3s → `.scene-ready` ajoutée → affichage direct | Partielle |
| `prefers-reduced-motion` | Visible (`opacity: 1` — le CSS d'animation ne s'applique pas) | Aucune |

Principe : les éléments démarrent invisibles (`opacity: 0` en CSS). Le gating JS via `.scene-ready` garantit que les animations ne commencent qu'après le chargement des assets Lottie. Le timeout 3s assure que le contenu est toujours visible même en cas d'échec.

### CSS Architecture

**Tout dans `globals.css`**

| Contenu | Emplacement |
|---------|-------------|
| Tokens d'animation (`--animation-act1`, `--easing-flight`, etc.) | `globals.css` dans `@theme inline` |
| Tokens couleur (`--color-mauve-deep`, `--color-olive-deep`, `--color-mauve-soft`) | `globals.css` dans `@theme inline` |
| `@keyframes pigeon-lifecycle-mobile` | `globals.css` |
| `@keyframes pigeon-lifecycle-desktop` | `globals.css` |
| `@keyframes envelope-lifecycle-mobile` | `globals.css` |
| `@keyframes envelope-lifecycle-desktop` | `globals.css` |
| `@keyframes envelope-open` | `globals.css` |
| `@keyframes text-reveal` | `globals.css` |
| `@keyframes seal-break` | `globals.css` |
| `.landing-bg` (background images mobile/desktop) | `globals.css` |
| `.scene-ready` gating rules | `globals.css` |
| `@media (prefers-reduced-motion)` | `globals.css` |

Justification : une seule page, nombre fini de keyframes (~7), tokens déjà dans `globals.css`. Tout au même endroit simplifie le débogage.

### Component Architecture

**Dossier dédié `components/save-the-date/`**

```
components/save-the-date/
  save-the-date-scene.tsx     → Client Component ('use client'): orchestrateur (.scene-ready, .pigeon-done, .envelope-done)
  golden-frame.tsx            → Invisible layout container (relative div, NO golden border, NO arabesque corners)
  pigeon-voyageur.tsx         → Client Component ('use client'): Lottie loader (oiseau.json mobile, pigeon.json desktop ≥1024px)
  envelope.tsx                → SVG enveloppe rounded corners + shadow, trajectory animation (envelope-lifecycle-mobile/desktop)
  seal-ag.tsx                 → SVG sceau A&G monogramme
  save-the-date-content.tsx   → HTML sémantique (with floral-inspired text colors: mauve-deep, olive-deep, mauve-soft)
  golden-separator.tsx        → Trait doré w-12
```

| Propriété | Valeur |
|-----------|--------|
| Type composant | `SaveTheDateScene` et `PigeonVoyageur` sont Client Components (`'use client'`). Tous les autres sont Server Components. |
| Props | Minimales — composants auto-suffisants (pas de props sauf `className` optionnel) |
| Pigeon | Rendu via `lottie-react` — fichiers Lottie JSON chargés via `fetch()` dans `useEffect` |
| SVG | Inline pour enveloppe, sceau, séparateur. Pas de SVG pigeon (Lottie à la place). |
| Styles | Classes Tailwind + classes CSS custom définies dans `globals.css` |
| Accessibilité | `aria-hidden="true"` sur pigeon, enveloppe, sceau, cadre. HTML sémantique sur le contenu textuel. |

### Open Graph

**`opengraph-image.tsx` avec Satori**

| Propriété | Valeur |
|-----------|--------|
| Fichier | `app/opengraph-image.tsx` |
| Dimensions | 1200 × 630px |
| Contenu | Enveloppe fermée + sceau A&G centrés sur fond crème |
| Technique | `ImageResponse` (Satori) — version simplifiée des SVG (pas d'animation) |
| Police | Locale : `/public/fonts/cormorant-garamond-light.ttf` chargée via `readFileSync` (pas de fetch Google) |
| Runtime | `runtime = 'nodejs'` — prerender statique (pas `force-dynamic`) |
| `og:title` | "Ahmed & Ghizlaine — Save the Date" |
| `og:description` | "17 Octobre 2026 · Casablanca" |

**Favicon : `app/icon.tsx`**

| Propriété | Valeur |
|-----------|--------|
| Fichier | `app/icon.tsx` |
| Dimensions | 48 × 48px |
| Contenu | Sceau A&G simplifié |
| Technique | `ImageResponse` (Satori) |

**Domain : `metadataBase: new URL("https://ag-wedding.com")`** dans `app/layout.tsx`.

### Impact Analysis

**Séquence d'implémentation :**
1. Assets Lottie JSON (pigeon) + SVG (enveloppe, sceau) — P0 bloquant
2. `lottie-react` + Cormorant Garamond + police TTF locale
3. Keyframes + tokens + `.scene-ready` + `.landing-bg` dans `globals.css`
4. Composants structure (`save-the-date-content.tsx`, `golden-separator.tsx`, `golden-frame.tsx`)
5. Composants animation (`save-the-date-scene.tsx`, `pigeon-voyageur.tsx`, `envelope.tsx`, `seal-ag.tsx`)
6. Assemblage `app/page.tsx`
7. `app/opengraph-image.tsx` + `app/icon.tsx`
8. Tests appareils réels

**Dépendances croisées :**
- Les assets Lottie JSON conditionnent `PigeonVoyageur`
- Les assets SVG conditionnent enveloppe, sceau
- Les keyframes dans `globals.css` conditionnent les classes CSS des composants
- `.scene-ready` gating conditionne la synchronisation animation
- L'Open Graph dépend de la police TTF locale + SVG simplifiés (enveloppe + sceau)

## Implementation Patterns & Consistency Rules

### Points de Conflit Identifiés

**8 zones** où des agents AI pourraient faire des choix divergents dans le contexte CSS animation + SVG inline du Save the Date.

### Naming Patterns

**Keyframes CSS :**

| Convention | Règle | Exemple |
|-----------|-------|---------|
| Format | kebab-case, préfixé par l'élément + suffixe breakpoint si responsive | `pigeon-lifecycle-mobile`, `pigeon-lifecycle-desktop`, `envelope-lifecycle-mobile`, `envelope-lifecycle-desktop` |
| Keyframes non-responsive | kebab-case, préfixé par l'élément | `envelope-open`, `seal-break`, `text-reveal` |
| Anti-pattern | ❌ camelCase (`pigeonFly`), ❌ préfixe `animate-` (`animate-pigeon-fly`), ❌ préfixe `std-`, ❌ suffixe `-fallback` (pas de fallback offset-path) |

**Classes CSS animation :**

| Convention | Règle | Exemple |
|-----------|-------|---------|
| Format | Classes custom dans `globals.css`, nommées par rôle d'animation | `.pigeon-animation`, `.envelope-animation`, `.text-line-reveal` |
| Application | Appliquées directement sur les éléments JSX via `className` | `<div className="pigeon-animation">` |
| Tailwind | Utiliser Tailwind pour le layout et le style statique, **pas** pour les animations custom | `className="absolute top-0 left-0 pigeon-animation"` |
| Anti-pattern | ❌ Tailwind `animate-[...]` arbitrary (illisible pour les animations complexes), ❌ BEM (`.pigeon__wing--flying`) |

**Fichiers composants (hérité du site principal) :**

| Convention | Règle | Exemple |
|-----------|-------|---------|
| Format | kebab-case | `pigeon-voyageur.tsx`, `golden-frame.tsx`, `seal-ag.tsx` |
| Export | PascalCase | `export function PigeonVoyageur()` |
| Anti-pattern | ❌ `PigeonVoyageur.tsx` (PascalCase fichier), ❌ `index.tsx` sauf barrel |

### Structure Patterns

**SVG / Lottie dans les composants :**

| Convention | Règle |
|-----------|-------|
| SVG inline | Pour enveloppe, sceau, séparateur — SVG directement dans le JSX du composant |
| Lottie | Pour le pigeon — fichiers JSON dans `/public/design/` chargés via `fetch()` dans `useEffect` |
| Organisation | Un composant = un SVG principal ou un Lottie. Les sous-éléments animés (rabat) sont des `<g>` ou `<path>` nommés dans le même SVG |
| `viewBox` | Toujours défini sur SVG — le dimensionnement est contrôlé par CSS (`width`/`height` en classes Tailwind) |
| Attributs | `aria-hidden="true"` sur le `<svg>` racine et le conteneur Lottie. Pas de `<title>` ni `<desc>` (éléments décoratifs) |
| Anti-pattern | ❌ `<img src="*.svg">`, ❌ SVG sprite, ❌ composant SVG importé via `@svgr`, ❌ SVG inline pour le pigeon (utiliser Lottie) |

**Composition `page.tsx` :**

```tsx
// app/page.tsx — import direct, pas de barrel
import { SaveTheDateScene } from '@/components/save-the-date/save-the-date-scene'
import { GoldenFrame } from '@/components/save-the-date/golden-frame'
import { PigeonVoyageur } from '@/components/save-the-date/pigeon-voyageur'
import { Envelope } from '@/components/save-the-date/envelope'
import { SealAG } from '@/components/save-the-date/seal-ag'
import { SaveTheDateContent } from '@/components/save-the-date/save-the-date-content'
import { GoldenSeparator } from '@/components/save-the-date/golden-separator'
```

| Convention | Règle |
|-----------|-------|
| Import | Direct depuis chaque fichier — pas de barrel `index.tsx` |
| Props | Zéro props (composants auto-suffisants). Exception : `className` pour overrides responsive |
| Composition | `SaveTheDateScene` wraps children — gère le gating `.scene-ready` / `.pigeon-done` / `.envelope-done` |

### CSS Patterns

**Animation gating — ordre des déclarations :**

```css
/* 1. État par défaut — éléments invisibles (en attente de .scene-ready) */
.animated-element { opacity: 0; }

/* 2. Quand .scene-ready est ajoutée par JS — animations démarrent */
.scene-ready .animated-element {
  animation: text-reveal 200ms var(--easing-reveal) forwards;
}
.scene-ready .text-line-1 { animation-delay: 3500ms; }
.scene-ready .text-line-2 { animation-delay: 3700ms; }

/* 3. prefers-reduced-motion — pas d'animation, contenu visible */
@media (prefers-reduced-motion: reduce) {
  .animated-element { opacity: 1; animation: none; }
}
```

| Convention | Règle |
|-----------|-------|
| Default state | Éléments à `opacity: 0` — en attente du gating JS `.scene-ready` |
| Animation gating | Animations sous `.scene-ready` — ne démarrent qu'après chargement Lottie ou timeout 3s |
| `prefers-reduced-motion` | Un seul bloc global dans `globals.css` qui override TOUTES les animations. Contenu rendu visible immédiatement. |
| Anti-pattern | ❌ Animations autoplay sans `.scene-ready` (risque de désynchronisation). ❌ `prefers-reduced-motion: no-preference` comme condition positive (utiliser `reduce` pour override). |

**Tokens d'animation — toujours les custom properties :**

| Convention | Règle |
|-----------|-------|
| Durées | Toujours `var(--animation-act1)`, jamais `1500ms` en dur dans les keyframes |
| Easings | Toujours `var(--easing-flight)`, jamais `cubic-bezier(...)` en dur |
| Délais | Calculables mais peuvent être en dur (`3500ms`) car spécifiques à chaque élément |
| Anti-pattern | ❌ Hardcoder une durée ou un easing qui existe déjà comme token |

**`prefers-reduced-motion` — implémentation :**

| Élément | Comportement reduced-motion |
|---------|----------------------------|
| Pigeon | `display: none` |
| Enveloppe | `display: none` |
| Sceau | `display: none` |
| Cadre doré | Visible (élément statique) |
| Texte | Visible, `opacity: 1` (état par défaut natif) |
| Séparateur | Visible (élément statique) |

### Règles d'Application

**Tout agent AI DOIT :**

1. Utiliser les conventions de nommage keyframes/classes définies — aucune exception
2. Placer TOUS les keyframes et animations dans `globals.css` — pas de styles inline ni de CSS modules
3. Respecter le gating `.scene-ready` — jamais d'animation autoplay
4. Utiliser les tokens custom properties pour durées et easings — jamais de valeurs hardcodées
5. `SaveTheDateScene` et `PigeonVoyageur` sont les SEULS Client Components — tous les autres restent Server Components
6. Pigeon via Lottie (fichiers JSON dans `/public/design/`) — pas de SVG inline pour le pigeon
7. SVG inline pour enveloppe, sceau, séparateur
8. `aria-hidden="true"` sur tous les éléments décoratifs (pigeon, enveloppe, sceau, cadre)

**Anti-Patterns :**
- ❌ `"use client"` sur un composant autre que `SaveTheDateScene` et `PigeonVoyageur`
- ❌ `animate-[...]` Tailwind arbitrary pour les animations custom
- ❌ Animations CSS sans gating `.scene-ready` (autoplay)
- ❌ `offset-path` ou `@supports (offset-path)` — jamais implémenté, ne pas ajouter
- ❌ SVG inline pour le pigeon (utiliser Lottie)
- ❌ Valeur hardcodée pour un easing ou une durée qui a un token
- ❌ `force-dynamic` sur l'OG image (utiliser prerender statique)

## Project Structure & Boundaries

### Arborescence — Fichiers Save the Date

```
wedding/
├── app/
│   ├── layout.tsx                              # MODIFIÉ — ajout Cormorant Garamond + metadataBase
│   ├── globals.css                             # MODIFIÉ — ajout keyframes + tokens + .landing-bg + .scene-ready
│   ├── page.tsx                                # REMPLACÉ — Save the Date (était landing non-invités)
│   ├── opengraph-image.tsx                     # NOUVEAU — OG enveloppe fermée + sceau (Satori + police TTF locale)
│   └── icon.tsx                                # NOUVEAU — Favicon Satori (48x48, sceau A&G simplifié)
│
├── components/
│   └── save-the-date/                          # NOUVEAU — dossier dédié
│       ├── save-the-date-scene.tsx             # Client Component: orchestrateur (.scene-ready, .pigeon-done, .envelope-done)
│       ├── golden-frame.tsx                    # Invisible layout container (relative div, pas de décoration)
│       ├── pigeon-voyageur.tsx                 # Client Component: Lottie loader (oiseau.json mobile, pigeon.json desktop)
│       ├── envelope.tsx                        # SVG enveloppe rounded corners + shadow + trajectory animation
│       ├── seal-ag.tsx                         # SVG sceau A&G monogramme
│       ├── save-the-date-content.tsx           # HTML sémantique (floral-inspired text colors)
│       └── golden-separator.tsx                # Trait doré w-12
│
├── public/
│   ├── design/
│   │   ├── oiseau.json                         # NOUVEAU — Lottie pigeon mobile
│   │   └── pigeon.json                         # NOUVEAU — Lottie pigeon desktop (≥1024px)
│   ├── fonts/
│   │   └── cormorant-garamond-light.ttf        # NOUVEAU — Police locale pour Satori OG
│   └── images/rings/
│       ├── arriere plan 4.jpeg                 # Background mobile
│       └── arriere plan 2.jpg                  # Background desktop (≥1024px)
│
└── (reste du projet inchangé)
```

**Bilan :** 2 fichiers modifiés, 12 fichiers nouveaux (dont 2 Lottie JSON, 1 TTF, 1 favicon), 0 fichier supprimé (page.tsx est remplacé, pas supprimé).

### Architectural Boundaries

**Boundary Client/Server :**

```
app/page.tsx (Server Component)
  └── importe SaveTheDateScene (Client Component 'use client')
      ├── PigeonVoyageur (Client Component 'use client' — Lottie loader)
      └── GoldenFrame, Envelope, SealAG, SaveTheDateContent, GoldenSeparator (Server Components)
```

Seuls `SaveTheDateScene` et `PigeonVoyageur` sont Client Components. Les autres restent Server Components.

**Boundary CSS :**

```
globals.css
  ├── @theme inline { ... }                    → Tokens animation + couleur
  ├── .landing-bg { ... }                      → Background images mobile/desktop
  ├── @keyframes pigeon-lifecycle-mobile/desktop → Trajectoire pigeon
  ├── @keyframes envelope-lifecycle-mobile/desktop → Trajectoire enveloppe
  ├── @keyframes envelope-open, seal-break, text-reveal → Autres keyframes
  ├── .scene-ready rules                        → Gating animation (opacity 0 → animation)
  └── @media (prefers-reduced-motion: no-preference) { ... }
                                                → Override animation (progressive enhancement)

composants save-the-date/*.tsx
  └── className="tailwind-layout custom-animation-class"
      → Tailwind pour le layout, classes custom pour l'animation
```

**Boundary SVG / Lottie :**

| Composant | Contenu | Éléments animés |
|-----------|---------|----------------|
| `pigeon-voyageur.tsx` | Lottie JSON (`oiseau.json` mobile, `pigeon.json` desktop) | Animation Lottie interne + keyframes CSS `pigeon-lifecycle-*` pour trajectoire |
| `envelope.tsx` | SVG enveloppe (rounded corners, shadow) | Trajectoire : `envelope-lifecycle-*`. Ouverture : `envelope-open`. Suit pigeon à `scale(0.12)` puis grandit |
| `seal-ag.tsx` | SVG sceau A&G (cercle, monogramme) | Brisure : `seal-break` (`scale` + `opacity`) |
| `golden-frame.tsx` | `relative` div (invisible layout container) | Aucun — pas de décoration visuelle |

**Boundary Open Graph :**

```
app/opengraph-image.tsx
  └── Utilise une version simplifiée des SVG de seal-ag.tsx + envelope.tsx
      → Rendu via ImageResponse (Satori) — pas les mêmes composants React
      → Police locale TTF chargée via readFileSync (pas de fetch Google)
      → runtime = 'nodejs', prerender statique
```

### Mapping FR-STDs → Fichiers

| FR-STD | Fichier(s) |
|--------|-----------|
| FR-STD-1 (pigeon entre) | `pigeon-voyageur.tsx` (Lottie) + `globals.css` (keyframes `pigeon-lifecycle-mobile/desktop`) |
| FR-STD-2 (dépôt + envol) | `pigeon-voyageur.tsx` + `envelope.tsx` + `globals.css` (keyframes `envelope-lifecycle-mobile/desktop`) |
| FR-STD-3 (sceau A&G) | `seal-ag.tsx` |
| FR-STD-4 (enveloppe s'ouvre) | `envelope.tsx` + `globals.css` (keyframes `envelope-open`, `seal-break`) |
| FR-STD-5 (contenu révélé) | `save-the-date-content.tsx` + `golden-separator.tsx` + `globals.css` (keyframes `text-reveal`) |
| FR-STD-6 (joue une fois, reste statique) | `globals.css` (`animation-fill-mode: forwards`, `animation-iteration-count: 1`) |
| FR-STD-7 (4-5 secondes) | `globals.css` (tokens `--animation-act1/2/3`, delays séquentiels) |
| FR-STD-8 (reduced-motion) | `globals.css` (`@media prefers-reduced-motion: no-preference`) |
| FR-STD-9 (accessibilité) | `save-the-date-content.tsx` (HTML sémantique), tous composants SVG (`aria-hidden`) |
| FR-STD-10 (haut de landing) | `app/page.tsx` (remplacement direct) |
| FR-STD-11 (responsive) | Tailwind responsive dans chaque composant + `globals.css` |

### Flux de Données

```
Navigateur requête GET /
  → Vercel Edge → Next.js Server
  → app/layout.tsx (polices, metadata globale, metadataBase)
  → app/page.tsx (Server Component)
    → Render HTML avec SVG inline + CSS animations + Client Component shell
  → Réponse HTML + JS bundle minimal (SaveTheDateScene + PigeonVoyageur + lottie-react)
  → Le navigateur :
    1. Parse HTML + CSS → éléments à opacity: 0
    2. Hydrate Client Components
    3. PigeonVoyageur fetch() Lottie JSON (/design/oiseau.json ou /design/pigeon.json)
    4. SaveTheDateScene attend chargement Lottie + 2 rAF (ou timeout 3s)
    5. Ajoute .scene-ready → animations CSS démarrent
```

**Flux de données minimal.** La page est server-rendered avec un JS bundle léger pour l'orchestration animation. Le seul fetch client-side est le chargement des fichiers Lottie JSON.

### Fichiers Modifiés — Détail

**`app/layout.tsx` — ajout Cormorant Garamond + metadataBase :**

```tsx
// Ajout à l'existant
import { Cormorant_Garamond } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-cormorant',
})

// metadataBase
export const metadata = {
  metadataBase: new URL("https://ag-wedding.com"),
  // ...
}
```

**`app/globals.css` — ajouts Save the Date :**

| Section ajoutée | Contenu |
|----------------|---------|
| `@theme inline` | Tokens `--animation-act1`, `--easing-flight`, `--color-mauve-deep`, `--color-olive-deep`, `--color-mauve-soft`, etc. |
| `.landing-bg` | Background images mobile (`arriere plan 4.jpeg`) + desktop `@media (min-width: 1024px)` (`arriere plan 2.jpg`) |
| Keyframes | `pigeon-lifecycle-mobile`, `pigeon-lifecycle-desktop`, `envelope-lifecycle-mobile`, `envelope-lifecycle-desktop`, `envelope-open`, `seal-break`, `text-reveal` |
| `.scene-ready` rules | Gating — animations ne démarrent qu'avec cette classe présente |
| Classes animation | `.pigeon-animation`, `.envelope-animation`, `.text-line-reveal`, etc. |
| `@media (prefers-reduced-motion: no-preference)` | Override animation (progressive enhancement) |

## Architecture Validation Results

### Coherence Validation ✅

**Compatibilité des décisions :**

| Décision A | Décision B | Compatible ? |
|-----------|-----------|-------------|
| CSS Animations + Lottie pigeon | Client Components (SaveTheDateScene, PigeonVoyageur) | ✅ Gating JS nécessaire pour synchroniser Lottie + CSS |
| SVG inline (enveloppe, sceau) | Server Components | ✅ SVG rendu côté serveur |
| Gating `.scene-ready` | Timeout 3s fallback | ✅ Contenu toujours visible |
| Keyframes `translate` + `rotate` | Pas de `offset-path` | ✅ Approche unique, pas de fallback `@supports` |
| `opengraph-image.tsx` Satori | Police TTF locale (`readFileSync`) | ✅ Runtime nodejs, prerender statique |
| Tailwind CSS 4 | Classes custom dans globals.css | ✅ Coexistence native |
| Tokens `@theme inline` (animation + couleur) | Custom properties dans keyframes | ✅ Variables CSS accessibles |
| `lottie-react` | Deux fichiers JSON (mobile/desktop) | ✅ Chargement conditionnel par breakpoint |

Aucune contradiction détectée.

**Correction appliquée :** Le texte utilise `animation-fill-mode: both` (pas `backwards` seul) — invisible avant le delay, visible après l'animation.

### Requirements Coverage ✅

**11/11 FR-STDs couvertes :**

| FR-STD | Support architectural |
|--------|----------------------|
| FR-STD-1 (pigeon entre) | Lottie pigeon + keyframes `pigeon-lifecycle-mobile/desktop` (`translate` + `rotate`) |
| FR-STD-2 (dépôt + envol) | Keyframes `envelope-lifecycle-mobile/desktop` (enveloppe suit puis se dépose) |
| FR-STD-3 (sceau A&G) | SVG monogramme `seal-ag.tsx` |
| FR-STD-4 (enveloppe s'ouvre) | `rotateX()` rabat + `seal-break` |
| FR-STD-5 (contenu révélé) | HTML sémantique `h1/time/address/blockquote` |
| FR-STD-6 (joue une fois) | `animation-iteration-count: 1` + `fill-mode: forwards` |
| FR-STD-7 (4-5 secondes) | Tokens durée + delays = 5000ms |
| FR-STD-8 (reduced-motion) | `@media (prefers-reduced-motion: no-preference)` + `display: none` |
| FR-STD-9 (accessibilité) | `aria-hidden` décoratifs + HTML sémantique |
| FR-STD-10 (haut de landing) | Remplacement `app/page.tsx` |
| FR-STD-11 (responsive) | Tailwind responsive mobile-first |

**NFRs couvertes :**
- 60fps → CSS animations GPU-accelerated + Lottie ✅
- FCP < 1s → Server Components + Client Components légers ✅
- Lighthouse ≥ 90 → JS bundle minimal (lottie-react), HTML sémantique ✅
- Assets < 150 Ko → Lottie JSON optimisés + SVG inline ✅
- WCAG 2.1 AA → Contrastes, sémantique, reduced-motion ✅

### Implementation Readiness ✅

**Décisions complètes :** 6 décisions architecturales documentées avec rationale.
**Patterns complets :** Naming, structure, CSS — tous avec anti-patterns.
**Structure complète :** 14 fichiers (12 nouveaux dont 2 Lottie + 1 TTF + 1 favicon, 2 modifiés), mappés aux FR-STDs.

### Gap Analysis

**Gaps critiques : 0**
**Gaps importants : 0** (correction `fill-mode: both` intégrée)
**Gaps nice-to-have : 1**
- Test OG WhatsApp Debugger après implémentation

### Architecture Completeness Checklist

**✅ Analyse des exigences**
- [x] Contexte projet analysé (brownfield, frontend pur)
- [x] Échelle et complexité évaluées (basse)
- [x] Contraintes techniques identifiées (CSS + Lottie, SVG inline, 1 package lottie-react)
- [x] Préoccupations transversales mappées (9 concerns)

**✅ Décisions architecturales**
- [x] 6 décisions documentées avec rationale
- [x] Mécanisme animation (gating JS `.scene-ready` + CSS keyframes + Lottie)
- [x] Trajectoire pigeon (keyframes `translate` + `rotate`, pas de `offset-path`)
- [x] CSS architecture (globals.css)
- [x] Structure composants (dossier dédié)
- [x] Open Graph (opengraph-image.tsx Satori)
- [x] Fallback contenu (progressive enhancement)

**✅ Patterns d'implémentation**
- [x] Conventions nommage (keyframes, classes, fichiers)
- [x] Patterns structure (SVG inline, composition page)
- [x] Patterns CSS (progressive enhancement, tokens, reduced-motion)
- [x] Anti-patterns documentés (7)
- [x] Règles d'application (8 règles obligatoires)

**✅ Structure projet**
- [x] Arborescence complète (14 fichiers)
- [x] Boundaries définies (Server Component, CSS, SVG, OG)
- [x] Mapping FR-STDs → fichiers (11/11)
- [x] Flux de données documenté

### Architecture Readiness Assessment

**Statut global : PRÊT POUR L'IMPLÉMENTATION**

**Niveau de confiance : Élevé**

**Forces :**
- Architecture simple — zéro backend, zéro état
- 1 seule dépendance npm ajoutée (`lottie-react`)
- Client Components limités (2 sur 7) — Server Components par défaut
- Gating JS `.scene-ready` + timeout 3s — contenu toujours visible
- Patterns explicites avec anti-patterns

**Améliorations futures (post-implémentation) :**
- Test OG WhatsApp Debugger
- Mesure poids Lottie JSON réel + bundle lottie-react

### Implementation Handoff

**Tout agent AI doit :**
1. Suivre les 6 décisions architecturales exactement comme documentées
2. Utiliser les patterns d'implémentation de manière consistante
3. Respecter la structure projet et les boundaries
4. Se référer à ce document pour toute question architecturale
5. Utiliser `animation-fill-mode: both` sur le texte

**Première priorité d'implémentation :**
1. Assets Lottie (pigeon JSON) + SVG (enveloppe, sceau) — P0 bloquant
2. `lottie-react` dans `package.json`
3. Cormorant Garamond dans `app/layout.tsx` + `metadataBase`
4. Tokens + keyframes + `.scene-ready` + `.landing-bg` dans `globals.css`
5. Composants `components/save-the-date/` (SaveTheDateScene + PigeonVoyageur en Client, reste en Server)
6. Assemblage `app/page.tsx`
7. `app/opengraph-image.tsx` (police TTF locale, `runtime = 'nodejs'`)
8. `app/icon.tsx` (favicon Satori)
