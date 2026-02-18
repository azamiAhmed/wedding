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
| Animation (FR-STD-1 à 7) | Pigeon vol + dépôt enveloppe + ouverture + révélation texte, 4-5s | CSS Animations + `offset-path`, `animation-delay` séquentiels, SVG inline, `animation-fill-mode: forwards`. Client Component minimal (~5 lignes) pour déclencher via classe CSS `.animation-started` au premier paint. |
| Accessibilité (FR-STD-8-9) | `prefers-reduced-motion`, sémantique HTML | `@media (prefers-reduced-motion: reduce)` CSS pur. `Envelope` et `PigeonVoyageur` en `display: none` (pas `animation: none`). `aria-hidden` sur éléments décoratifs. HTML sémantique (`h1`, `time`, `address`, `blockquote`). |
| Intégration (FR-STD-10-11) | Haut de la landing page, responsive 360px-1920px | Remplacement direct de `app/page.tsx` existant. Tailwind responsive mobile-first, `min-h-dvh`. |

**Exigences Non-Fonctionnelles :**

| Catégorie | Contrainte | Impact architecture |
|-----------|-----------|---------------------|
| Performance | 60fps, FCP < 1s, Lighthouse ≥ 90, assets < 150 Ko | SVG optimisés inline, CSS animations GPU-accelerated (`transform`, `opacity`), Server Component avec Client Component minimal pour le déclenchement |
| Style visuel | Flat premium, palette dorée/crème, Cormorant Garamond (300, 400) + Geist Sans | Héritage design system existant, tokens `@theme inline`. Vérifier que Cormorant Garamond poids 300 (Light) et 400 (Regular) sont chargés dans le root layout. |
| Technique | Next.js 16, CSS pur, SVG, pas de service payant | Zéro dépendance supplémentaire, zéro API, zéro DB |

### Échelle & Complexité

- **Domaine** : Frontend animation CSS sur infrastructure Next.js existante
- **Complexité** : Basse — zéro backend, zéro état, une seule page
- **Composants architecturaux estimés** : ~7 (SaveTheDatePage, GoldenFrame, PigeonVoyageur, Envelope, SealAG, SaveTheDateContent, GoldenSeparator)
- **Dépendances nouvelles** : Aucune — CSS pur + SVG inline + Client Component minimal (pas de package)

### Contraintes Techniques & Dépendances

| Contrainte | Source | Impact |
|-----------|--------|--------|
| CSS Animations + Motion Path | UX Design | Pas de Framer Motion, pas de Lottie — `offset-path` pour trajectoire pigeon |
| SVG inline dans les composants | UX Design | Pas de fichiers SVG dans `/public` — chargement immédiat garanti |
| Client Component minimal | Party Mode (Amelia) | ~5 lignes JS — ajoute `.animation-started` au premier paint pour synchroniser les `animation-delay`. Résout le risque de désynchronisation si les SVG sont lourds. |
| Coordination animations imbriquées | Party Mode (Amelia) | `offset-path` sur le conteneur pigeon (trajectoire) + keyframes internes sur les `<path>` SVG (ailes). Deux systèmes indépendants, timings coordonnés par design. |
| Budget 5000ms | PRD + UX Design | Timeline au ms près avec `animation-delay` depuis la classe `.animation-started` |
| Assets SVG < 150 Ko | PRD | Pigeon + enveloppe + sceau + cadre — total combiné |
| Remplace `app/page.tsx` | Architecture existante | Remplacement direct de la landing non-invités (FR34). L'ancienne landing est supprimée — le Save the Date EST la page d'accueil publique. |

### Préoccupations Transversales

1. **`prefers-reduced-motion`** — Layout différent, pas juste animations désactivées. `Envelope` et `PigeonVoyageur` en `display: none`. Affichage : texte + cadre doré + séparateur sur fond crème. Pas d'enveloppe en arrière-plan.

2. **Fallback chargement lent** — Le contenu textuel est dans le DOM dès le départ (`opacity: 0`), timeout → affichage direct. Le fond crème + cadre doré sont le loading state.

3. **Open Graph WhatsApp** — Généré via `opengraph-image.tsx` Next.js (pattern cohérent avec `/invite/[slug]/opengraph-image.tsx` existant). Rendu serveur de l'enveloppe fermée + sceau A&G. `og:title` "Ahmed & Ghizlaine — Save the Date", `og:description` "17 Octobre 2026 · Casablanca".

4. **`offset-path` compatibility** — Safari 15.4+ requis. Fallback en keyframes `translate` + `rotate` si nécessaire.

5. **Polices Cormorant Garamond** — Poids 300 (Light) et 400 (Regular) requis. Vérifier le chargement dans `app/layout.tsx` racine — ajouter si absent. Geist Sans déjà disponible.

6. **Zéro stockage client** — Explicitement : pas de `localStorage`, pas de cookie, pas de session. Le replay à chaque visite est intentionnel (valeur de partage). Aucun mécanisme "déjà vu".

7. **Stratégie de remplacement `page.tsx`** — Remplacement direct. Le Save the Date est la page d'accueil permanente pour la phase actuelle du projet. Pas de flag d'environnement — la landing non-invités précédente est obsolète.

## Starter Template Evaluation

### Domaine Technologique

**Frontend animation CSS** sur infrastructure Next.js existante — projet brownfield.

### Évaluation

Aucun starter additionnel nécessaire. Le Save the Date s'intègre à la base de code existante sans aucune dépendance nouvelle.

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

**Ajout unique requis — Police Cormorant Garamond :**

La seule modification à la stack est l'ajout de la police Cormorant Garamond (poids 300 Light + 400 Regular) dans `app/layout.tsx` via `next/font/google`. Ce n'est pas une nouvelle dépendance — c'est l'utilisation d'une API déjà en place.

**Dépendances Save the Date : 0 packages npm supplémentaires.**

Toute l'animation repose sur CSS natif (Animations, Motion Path, `animation-delay`, `@media prefers-reduced-motion`) et SVG inline. L'Open Graph utilise l'API native `opengraph-image.tsx` de Next.js.

## Core Architectural Decisions

### Analyse de Priorité

**Décisions critiques (bloquent l'implémentation) :**
- Mécanisme de déclenchement animation (CSS pur, zéro JS)
- Structure des composants (dossier dédié `components/save-the-date/`)
- Architecture CSS (tout dans `globals.css`)

**Décisions importantes (façonnent l'architecture) :**
- Fallback `offset-path` (`@supports` + deux jeux d'animations)
- Fallback contenu (progressive enhancement — texte visible par défaut)
- Génération Open Graph (`opengraph-image.tsx` Satori)

**Décisions différées :**
- Aucune — le scope est suffisamment restreint pour tout décider maintenant

**Note :** La suggestion Party Mode (étape 2) d'un Client Component minimal a été reconsidérée et rejetée à l'étape 4. Les SVG inline dans un document server-rendered garantissent la synchronisation sans JS. La page est un Server Component pur.

### Animation Architecture

**Déclenchement : CSS pur, zéro JS**

| Aspect | Décision |
|--------|----------|
| Trigger | Aucun — les animations démarrent au parse CSS via `animation-delay` depuis `t=0` |
| Server Component | Oui — la page entière est un Server Component pur, zéro `"use client"` |
| Synchronisation | Garantie par les SVG inline (tout arrive dans un seul document HTML server-rendered) |
| `animation-fill-mode` | `backwards` sur les éléments invisibles avant leur delay (texte, enveloppe) — maintient l'état initial |
| `animation-fill-mode` | `forwards` sur les éléments qui conservent leur état final (pigeon invisible, enveloppe ghost) |

**Fallback `offset-path` : `@supports` + deux jeux d'animations**

```css
/* Navigateurs modernes — trajectoire Bézier naturelle */
@supports (offset-path: path("M0 0")) {
  .pigeon { offset-path: path("M-100,50 C100,0 300,100 500,200"); }
}

/* Fallback universel — courbe simulée avec 5-6 keyframes */
@supports not (offset-path: path("M0 0")) {
  .pigeon { /* keyframes translate + rotate multi-étapes */ }
}
```

**Fallback contenu : Progressive Enhancement**

| État | Texte | Animation |
|------|-------|-----------|
| HTML seul (CSS pas chargé) | Visible (`opacity: 1` natif) | Aucune |
| CSS chargé, animation joue | Invisible puis révélé (CSS override `opacity: 0` → animation → `opacity: 1`) | Complète |
| `prefers-reduced-motion` | Visible (`opacity: 1` natif — le CSS d'animation ne s'applique pas) | Aucune |

Principe : le contenu textuel est **toujours lisible par défaut**. L'animation CSS est une amélioration progressive qui override le style natif. Pas de flash visible car `globals.css` arrive avec le HTML (même bundle server-rendered).

### CSS Architecture

**Tout dans `globals.css`**

| Contenu | Emplacement |
|---------|-------------|
| Tokens d'animation (`--animation-act1`, `--easing-flight`, etc.) | `globals.css` dans `@theme inline` |
| `@keyframes pigeon-fly` | `globals.css` |
| `@keyframes pigeon-fly-fallback` | `globals.css` |
| `@keyframes pigeon-depart` | `globals.css` |
| `@keyframes envelope-open` | `globals.css` |
| `@keyframes text-reveal` | `globals.css` |
| `@keyframes seal-break` | `globals.css` |
| `@supports` blocks pour `offset-path` | `globals.css` |
| `@media (prefers-reduced-motion)` | `globals.css` |

Justification : une seule page, nombre fini de keyframes (~6), tokens déjà dans `globals.css`. Tout au même endroit simplifie le débogage.

### Component Architecture

**Dossier dédié `components/save-the-date/`**

```
components/save-the-date/
  golden-frame.tsx           → SVG/CSS cadre doré + coins arabesques
  pigeon-voyageur.tsx        → SVG inline pigeon + classes animation vol
  envelope.tsx               → SVG inline enveloppe + ouverture rabat
  seal-ag.tsx                → SVG inline sceau A&G monogramme
  save-the-date-content.tsx  → HTML sémantique (h1, time, address, blockquote)
  golden-separator.tsx       → Trait doré w-12
```

| Propriété | Valeur |
|-----------|--------|
| Type composant | Tous Server Components — zéro `"use client"` |
| Props | Minimales — composants auto-suffisants (pas de props sauf `className` optionnel) |
| SVG | Inline dans chaque composant |
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
| `og:title` | "Ahmed & Ghizlaine — Save the Date" |
| `og:description` | "17 Octobre 2026 · Casablanca" |

### Impact Analysis

**Séquence d'implémentation :**
1. Assets SVG (pigeon, enveloppe, sceau, cadre) — P0 bloquant
2. Keyframes + tokens dans `globals.css`
3. Composants structure (`save-the-date-content.tsx`, `golden-separator.tsx`, `golden-frame.tsx`)
4. Composants animation (`pigeon-voyageur.tsx`, `envelope.tsx`, `seal-ag.tsx`)
5. Assemblage `app/page.tsx`
6. `app/opengraph-image.tsx`
7. Tests appareils réels

**Dépendances croisées :**
- Les assets SVG conditionnent tous les composants animés
- Les keyframes dans `globals.css` conditionnent les classes CSS des composants
- Le fallback progressive enhancement conditionne l'ordre CSS (override `opacity`)
- L'Open Graph dépend du SVG de l'enveloppe + sceau (version simplifiée pour Satori)

## Implementation Patterns & Consistency Rules

### Points de Conflit Identifiés

**8 zones** où des agents AI pourraient faire des choix divergents dans le contexte CSS animation + SVG inline du Save the Date.

### Naming Patterns

**Keyframes CSS :**

| Convention | Règle | Exemple |
|-----------|-------|---------|
| Format | kebab-case, préfixé par l'élément | `pigeon-fly`, `pigeon-depart`, `envelope-open`, `seal-break`, `text-reveal` |
| Fallback | suffixe `-fallback` | `pigeon-fly-fallback` |
| Anti-pattern | ❌ camelCase (`pigeonFly`), ❌ préfixe `animate-` (`animate-pigeon-fly`), ❌ préfixe `std-` |

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

**SVG dans les composants :**

| Convention | Règle |
|-----------|-------|
| Inline | SVG directement dans le JSX du composant — pas de fichier `.svg` séparé |
| Organisation | Un composant = un SVG principal. Les sous-éléments animés (ailes, rabat) sont des `<g>` ou `<path>` nommés dans le même SVG |
| `viewBox` | Toujours défini — le dimensionnement est contrôlé par CSS (`width`/`height` en classes Tailwind) |
| Attributs | `aria-hidden="true"` sur le `<svg>` racine. Pas de `<title>` ni `<desc>` (éléments décoratifs) |
| Anti-pattern | ❌ SVG dans `/public`, ❌ `<img src="*.svg">`, ❌ SVG sprite, ❌ composant SVG importé via `@svgr` |

**Composition `page.tsx` :**

```tsx
// app/page.tsx — import direct, pas de barrel
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
| Composition | Plate — pas de nesting profond. `page.tsx` assemble au même niveau |

### CSS Patterns

**Progressive enhancement — ordre des déclarations :**

```css
/* 1. État par défaut — contenu VISIBLE (progressive enhancement) */
.text-line { opacity: 1; }

/* 2. Quand l'animation est supportée — override invisible + animation */
@media (prefers-reduced-motion: no-preference) {
  .text-line {
    opacity: 0;
    animation: text-reveal 200ms var(--easing-reveal) forwards;
  }
  .text-line-1 { animation-delay: 3500ms; }
  .text-line-2 { animation-delay: 3700ms; }
  /* etc. */
}
```

| Convention | Règle |
|-----------|-------|
| Default state | Contenu visible (`opacity: 1`) — c'est le HTML natif |
| Animation override | Dans `@media (prefers-reduced-motion: no-preference)` — l'animation ne s'applique QUE si le user n'a pas désactivé les animations |
| `prefers-reduced-motion` | Un seul bloc global dans `globals.css` qui wrape TOUTES les animations. Pas un bloc par composant. |
| Anti-pattern | ❌ `opacity: 0` par défaut puis `animation` qui remet à 1 (casse sans CSS). ❌ `prefers-reduced-motion: reduce` comme condition (double négation). |

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
3. Respecter l'ordre progressive enhancement (visible par défaut → override dans `prefers-reduced-motion: no-preference`)
4. Utiliser les tokens custom properties pour durées et easings — jamais de valeurs hardcodées
5. Garder tous les composants comme Server Components — zéro `"use client"`
6. SVG inline dans les composants — jamais dans `/public`
7. `aria-hidden="true"` sur tous les éléments décoratifs (pigeon, enveloppe, sceau, cadre)

**Anti-Patterns :**
- ❌ `"use client"` sur un composant Save the Date
- ❌ `animate-[...]` Tailwind arbitrary pour les animations custom
- ❌ `opacity: 0` comme style par défaut sur le contenu textuel
- ❌ Fichier SVG séparé dans `/public`
- ❌ `prefers-reduced-motion: reduce` comme condition (utiliser `no-preference` comme condition positive)
- ❌ Valeur hardcodée pour un easing ou une durée qui a un token

## Project Structure & Boundaries

### Arborescence — Fichiers Save the Date

```
wedding/
├── app/
│   ├── layout.tsx                              # MODIFIÉ — ajout Cormorant Garamond
│   ├── globals.css                             # MODIFIÉ — ajout keyframes + tokens animation
│   ├── page.tsx                                # REMPLACÉ — Save the Date (était landing non-invités)
│   └── opengraph-image.tsx                     # NOUVEAU — OG enveloppe fermée + sceau (Satori)
│
├── components/
│   └── save-the-date/                          # NOUVEAU — dossier dédié
│       ├── golden-frame.tsx                    # Cadre doré + coins arabesques
│       ├── pigeon-voyageur.tsx                 # Pigeon SVG inline + animation vol
│       ├── envelope.tsx                        # Enveloppe SVG + ouverture rabat + sceau
│       ├── seal-ag.tsx                         # Sceau A&G SVG monogramme (réutilisé par envelope + OG)
│       ├── save-the-date-content.tsx           # HTML sémantique (h1, time, address, blockquote)
│       └── golden-separator.tsx                # Trait doré w-12
│
└── (reste du projet inchangé)
```

**Bilan :** 2 fichiers modifiés, 8 fichiers nouveaux, 0 fichier supprimé (page.tsx est remplacé, pas supprimé).

### Architectural Boundaries

**Server Component pur — aucune boundary Client/Server :**

```
app/page.tsx (Server Component)
  └── importe directement tous les composants save-the-date/
      └── tous Server Components — zéro "use client"
```

**Boundary CSS :**

```
globals.css
  ├── @theme inline { ... }     → Tokens animation (--easing-flight, etc.)
  ├── @keyframes pigeon-fly     → Animation du pigeon
  ├── @keyframes ...            → Autres keyframes
  ├── .pigeon-animation { ... } → Classes custom animation
  └── @media (prefers-reduced-motion: no-preference) { ... }
                                → Override animation (progressive enhancement)

composants save-the-date/*.tsx
  └── className="tailwind-layout pigeon-animation"
      → Tailwind pour le layout, classes custom pour l'animation
```

**Boundary SVG :**

| Composant | SVG contenu | Éléments animés |
|-----------|-------------|----------------|
| `pigeon-voyageur.tsx` | Pigeon complet (corps, ailes, enveloppe dans le bec) | Conteneur : `offset-path` trajectoire. Ailes : keyframes internes `<g>` |
| `envelope.tsx` | Enveloppe (corps, rabat, intérieur) | Rabat : `rotateX()`. Corps : `opacity` → ghost |
| `seal-ag.tsx` | Sceau A&G (cercle, monogramme, entrelacs) | Brisure : `scale` + `opacity` |
| `golden-frame.tsx` | Cadre (filet, coins arabesques) | Aucun — statique |

**Boundary Open Graph :**

```
app/opengraph-image.tsx
  └── Utilise une version simplifiée des SVG de seal-ag.tsx + envelope.tsx
      → Rendu via ImageResponse (Satori) — pas les mêmes composants React
      → Le SVG est dupliqué/simplifié car Satori ne supporte pas toutes les propriétés CSS
```

### Mapping FR-STDs → Fichiers

| FR-STD | Fichier(s) |
|--------|-----------|
| FR-STD-1 (pigeon entre) | `pigeon-voyageur.tsx` + `globals.css` (keyframes `pigeon-fly`) |
| FR-STD-2 (dépôt + envol) | `pigeon-voyageur.tsx` + `globals.css` (keyframes `pigeon-depart`) |
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
  → app/layout.tsx (polices, metadata globale)
  → app/page.tsx (Server Component)
    → Render HTML complet avec SVG inline + CSS animations
  → Réponse HTML unique (pas de JS client, pas d'API)
  → Le navigateur parse HTML + CSS → animations démarrent
```

**Aucun flux de données dynamique.** La page est un document HTML statique server-rendered. Pas de fetch, pas de state, pas d'événement.

### Fichiers Modifiés — Détail

**`app/layout.tsx` — ajout Cormorant Garamond :**

```tsx
// Ajout à l'existant
import { Cormorant_Garamond } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-cormorant',
})
```

**`app/globals.css` — ajouts Save the Date :**

| Section ajoutée | Contenu |
|----------------|---------|
| `@theme inline` | Tokens `--animation-act1`, `--easing-flight`, etc. |
| Keyframes | `pigeon-fly`, `pigeon-fly-fallback`, `pigeon-depart`, `envelope-open`, `seal-break`, `text-reveal` |
| `@supports` | Blocs `offset-path` + fallback |
| Classes animation | `.pigeon-animation`, `.envelope-animation`, `.text-line-reveal`, etc. |
| `@media (prefers-reduced-motion: no-preference)` | Override animation (progressive enhancement) |

## Architecture Validation Results

### Coherence Validation ✅

**Compatibilité des décisions :**

| Décision A | Décision B | Compatible ? |
|-----------|-----------|-------------|
| CSS Animations pures | Server Component pur (zéro JS) | ✅ Pas de conflit |
| SVG inline | Server Component | ✅ SVG rendu côté serveur |
| Progressive enhancement (visible par défaut) | `@media (prefers-reduced-motion: no-preference)` override | ✅ Cohérent |
| `@supports (offset-path)` fallback | Keyframes classiques | ✅ Mutuellement exclusifs |
| `opengraph-image.tsx` Satori | SVG inline composants | ✅ SVG simplifié pour Satori |
| Tailwind CSS 4 | Classes custom dans globals.css | ✅ Coexistence native |
| Tokens `@theme inline` | Custom properties dans keyframes | ✅ Variables CSS accessibles |

Aucune contradiction détectée.

**Correction appliquée :** Le texte utilise `animation-fill-mode: both` (pas `backwards` seul) — invisible avant le delay, visible après l'animation.

### Requirements Coverage ✅

**11/11 FR-STDs couvertes :**

| FR-STD | Support architectural |
|--------|----------------------|
| FR-STD-1 (pigeon entre) | `offset-path` + `@supports` fallback |
| FR-STD-2 (dépôt + envol) | Keyframes `pigeon-depart` |
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
- 60fps → CSS animations GPU-accelerated ✅
- FCP < 1s → Server Component pur, zéro JS ✅
- Lighthouse ≥ 90 → No JS bundle, HTML sémantique ✅
- Assets < 150 Ko → Budget SVG documenté ✅
- WCAG 2.1 AA → Contrastes, sémantique, reduced-motion ✅

### Implementation Readiness ✅

**Décisions complètes :** 6 décisions architecturales documentées avec rationale.
**Patterns complets :** Naming, structure, CSS — tous avec anti-patterns.
**Structure complète :** 10 fichiers (8 nouveaux, 2 modifiés), mappés aux FR-STDs.

### Gap Analysis

**Gaps critiques : 0**
**Gaps importants : 0** (correction `fill-mode: both` intégrée)
**Gaps nice-to-have : 2**
- Test OG WhatsApp Debugger après implémentation
- Validation `offset-path` sur appareils réels (Safari iOS)

### Architecture Completeness Checklist

**✅ Analyse des exigences**
- [x] Contexte projet analysé (brownfield, frontend pur)
- [x] Échelle et complexité évaluées (basse)
- [x] Contraintes techniques identifiées (CSS pur, SVG inline, 0 packages)
- [x] Préoccupations transversales mappées (7 concerns)

**✅ Décisions architecturales**
- [x] 6 décisions documentées avec rationale
- [x] Mécanisme animation (CSS pur, zéro JS)
- [x] Fallback offset-path (@supports)
- [x] CSS architecture (globals.css)
- [x] Structure composants (dossier dédié)
- [x] Open Graph (opengraph-image.tsx Satori)
- [x] Fallback contenu (progressive enhancement)

**✅ Patterns d'implémentation**
- [x] Conventions nommage (keyframes, classes, fichiers)
- [x] Patterns structure (SVG inline, composition page)
- [x] Patterns CSS (progressive enhancement, tokens, reduced-motion)
- [x] Anti-patterns documentés (7)
- [x] Règles d'application (7 règles obligatoires)

**✅ Structure projet**
- [x] Arborescence complète (10 fichiers)
- [x] Boundaries définies (Server Component, CSS, SVG, OG)
- [x] Mapping FR-STDs → fichiers (11/11)
- [x] Flux de données documenté

### Architecture Readiness Assessment

**Statut global : PRÊT POUR L'IMPLÉMENTATION**

**Niveau de confiance : Élevé**

**Forces :**
- Architecture ultra-simple — zéro backend, zéro état, zéro JS client
- 0 packages npm supplémentaires
- Server Component pur — performance maximale
- Progressive enhancement — contenu toujours lisible
- Patterns explicites avec anti-patterns

**Améliorations futures (post-implémentation) :**
- Test OG WhatsApp Debugger
- Validation `offset-path` sur Safari iOS réel
- Mesure poids SVG réel après création des assets

### Implementation Handoff

**Tout agent AI doit :**
1. Suivre les 6 décisions architecturales exactement comme documentées
2. Utiliser les patterns d'implémentation de manière consistante
3. Respecter la structure projet et les boundaries
4. Se référer à ce document pour toute question architecturale
5. Utiliser `animation-fill-mode: both` sur le texte

**Première priorité d'implémentation :**
1. Assets SVG (pigeon, enveloppe, sceau, cadre) — P0 bloquant
2. Cormorant Garamond dans `app/layout.tsx`
3. Tokens + keyframes dans `globals.css`
4. Composants `components/save-the-date/`
5. Assemblage `app/page.tsx`
6. `app/opengraph-image.tsx`
