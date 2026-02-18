---
stepsCompleted: [1, 2, 3, 4]
lastStep: 4
status: 'complete'
completedAt: '2026-02-18'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd-save-the-date.md'
  - '_bmad-output/planning-artifacts/architecture-save-the-date.md'
  - '_bmad-output/planning-artifacts/ux-design-save-the-date.md'
---

# Save the Date Animé (Pigeon Voyageur) - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for the Save the Date Animé feature, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

- **FR-STD-1 :** L'invité voit une animation de pigeon voyageur stylisé (illustration flat, palette dorée/blanche) entrant dans l'écran au chargement de la page
- **FR-STD-2 :** Le pigeon dépose une enveloppe cachetée au centre de l'écran puis s'envole hors de l'écran
- **FR-STD-3 :** L'enveloppe porte un sceau doré avec les initiales "A&G" dans un style calligraphie orientale/marocaine
- **FR-STD-4 :** L'enveloppe s'ouvre avec une animation fluide pour révéler le contenu Save the Date
- **FR-STD-5 :** Le contenu révélé affiche : Ahmed & Ghizlaine, 17 Octobre 2026, Casablanca, et le message « Une date à retenir, une histoire à écrire ensemble… les détails suivront bientôt. »
- **FR-STD-6 :** L'animation se joue une seule fois au chargement — le contenu reste ensuite affiché de manière statique
- **FR-STD-7 :** L'animation complète (3 actes) dure entre 4 et 5 secondes
- **FR-STD-8 :** Si `prefers-reduced-motion` est activé, l'animation est désactivée et le contenu Save the Date s'affiche directement dans son état final (enveloppe ouverte, texte visible)
- **FR-STD-9 :** Le contenu textuel du Save the Date est accessible aux lecteurs d'écran via un balisage sémantique approprié
- **FR-STD-10 :** L'animation Save the Date s'affiche en haut de la landing page, avant les sections existantes
- **FR-STD-11 :** L'animation est responsive et s'adapte aux écrans mobile (360px) et desktop (jusqu'à 1920px)

### Non-Functional Requirements

- **NFR-1 :** Animation à 60fps sans jank sur iPhone 11 et Samsung Galaxy A52
- **NFR-2 :** Poids total des assets d'animation (SVG) < 150 Ko
- **NFR-3 :** Temps de chargement total (page + animation) < 4s en 4G mobile
- **NFR-4 :** Score Lighthouse Performance maintenu > 85 sur mobile
- **NFR-5 :** Pigeon en illustration flat design, cohérent avec la palette dorée/blanche du site existant
- **NFR-6 :** Enveloppe élégante avec sceau doré A&G en calligraphie orientale/marocaine
- **NFR-7 :** Ambiance mélange d'élégance raffinée et de charme ludique/fantaisiste
- **NFR-8 :** Typographie cohérente avec les polices du site (Cormorant Garamond + Geist Sans)
- **NFR-9 :** Implémentation React/Next.js 16, Server Component par défaut
- **NFR-10 :** Animation via CSS animations natives — pas de GIF ni de vidéo
- **NFR-11 :** Assets en SVG inline — pas de services tiers payants, 0 packages npm supplémentaires

### Additional Requirements

**Architecture :**
- Brownfield — pas de starter template, intégration dans la base existante
- CSS pur, zéro JS, zéro `"use client"` — Server Component intégral
- `offset-path` avec fallback `@supports` en keyframes `translate` + `rotate`
- Tous les keyframes et tokens dans `globals.css`
- SVG inline dans les composants (pas dans `/public`)
- Ajout Cormorant Garamond (300, 400) dans `app/layout.tsx`
- Progressive enhancement : contenu visible par défaut, animation en override `@media (prefers-reduced-motion: no-preference)`
- `opengraph-image.tsx` avec Satori (1200×630, enveloppe fermée + sceau)
- Dossier composants dédié : `components/save-the-date/`
- `aria-hidden="true"` sur tous les éléments décoratifs (pigeon, enveloppe, sceau, cadre)
- `animation-fill-mode: both` sur le texte (pas `backwards` seul)

**UX Design :**
- Direction visuelle "Cadre Doré" : filet fin doré (1-2px) avec coins arabesques géométriques
- Timeline précise : 5000ms total (Acte 1: 1500ms, Acte 2: 1200ms, Pause: 300ms, Acte 3: 2000ms)
- 3 tokens easing : `--easing-flight`, `--easing-land` (rebond), `--easing-reveal`
- 4 tokens durée : `--animation-act1/2/pause/3`
- Pigeon : flat premium 2-3 couleurs, 80-100px mobile / 150-180px desktop
- Enveloppe : Blanc Cassé, grain quasi-imperceptible, liseré doré, 120px mobile / 200px desktop
- Sceau A&G : monogramme latin + entrelacs arabesques, cercle doré, 30-40px mobile / 50-60px desktop
- Layout : `min-h-dvh`, centrage flex, bloc texte ~60% hauteur visible
- État final : enveloppe ghost ~20-25% opacité derrière le texte
- `prefers-reduced-motion` : pas de pigeon, pas d'enveloppe — texte + cadre + séparateur uniquement
- Pas de spinner ni loader : fond crème `#FAF7F2` + cadre doré = loading state élégant
- Open Graph WhatsApp : `og:title` "Ahmed & Ghizlaine — Save the Date", `og:description` "17 Octobre 2026 · Casablanca"

### FR Coverage Map

| FR-STD | Epic | Story | Description |
|--------|------|-------|-------------|
| FR-STD-1 | Epic 2 | 2.3 | Pigeon voyageur entre dans l'écran |
| FR-STD-2 | Epic 2 | 2.3 | Pigeon dépose l'enveloppe et s'envole |
| FR-STD-3 | Epic 2 | 2.1 | Sceau doré A&G calligraphie |
| FR-STD-4 | Epic 2 | 2.2 | Enveloppe s'ouvre avec animation fluide |
| FR-STD-5 | Epic 1 | 1.2 | Contenu révélé (prénoms, date, lieu, message) |
| FR-STD-6 | Epic 2 | 2.4 | Animation joue une fois, contenu reste statique |
| FR-STD-7 | Epic 2 | 2.4 | Animation complète 4-5 secondes |
| FR-STD-8 | Epic 1 | 1.2, 1.4 | `prefers-reduced-motion` fallback |
| FR-STD-9 | Epic 1 | 1.2, 1.4 | Accessibilité lecteurs d'écran |
| FR-STD-10 | Epic 1 | 1.1 | Haut de la landing page |
| FR-STD-11 | Epic 1 | 1.3, 1.4 | Responsive 360px-1920px |

## Epic List

### Epic 1: Page Save the Date — Contenu & Cadre Doré
L'invité qui ouvre le lien voit immédiatement le contenu Save the Date (prénoms, date, lieu, message poétique) sur un écran crème élégant encadré d'un filet doré avec coins arabesques. L'expérience est parfaite pour les utilisateurs `prefers-reduced-motion` et accessible à tous les lecteurs d'écran.
**FRs covered:** FR-STD-5, FR-STD-8, FR-STD-9, FR-STD-10, FR-STD-11

### Epic 2: Animation Pigeon Voyageur — Le Spectacle en 3 Actes
L'invité vit une micro-narration animée de 5 secondes : un pigeon stylisé entre en vol, dépose une enveloppe cachetée A&G, s'envole, puis l'enveloppe s'ouvre pour révéler le contenu Save the Date. L'animation crée l'effet "waouh" qui donne envie de partager.
**FRs covered:** FR-STD-1, FR-STD-2, FR-STD-3, FR-STD-4, FR-STD-6, FR-STD-7

### Epic 3: Open Graph — Aperçu WhatsApp
Quand le lien `/` est partagé sur WhatsApp, un aperçu visuel attractif s'affiche : enveloppe dorée fermée avec sceau A&G sur fond crème, titre "Ahmed & Ghizlaine — Save the Date", description "17 Octobre 2026 · Casablanca". L'aperçu suscite la curiosité et donne envie d'ouvrir le lien.
**FRs covered:** Exigences UX + Architecture

## Epic 1: Page Save the Date — Contenu & Cadre Doré

L'invité qui ouvre le lien voit immédiatement le contenu Save the Date (prénoms, date, lieu, message poétique) sur un écran crème élégant encadré d'un filet doré avec coins arabesques. L'expérience est parfaite pour les utilisateurs `prefers-reduced-motion` et accessible à tous les lecteurs d'écran.

### Story 1.1: Fondation — Layout, Police & Tokens CSS

As a invité,
I want la page `/` s'affiche avec un fond crème `#FAF7F2` et la police Cormorant Garamond chargée,
So that je vois immédiatement un écran élégant et cohérent avec l'univers du mariage.

**Acceptance Criteria:**

**Given** un visiteur accède à la page `/`
**When** la page se charge
**Then** le fond est `#FAF7F2` (crème chaud) et occupe `min-h-dvh`
**And** la police Cormorant Garamond (poids 300, 400) est chargée via `next/font/google` dans `app/layout.tsx` avec la variable CSS `--font-cormorant`
**And** les tokens d'animation sont définis dans `globals.css` (`@theme inline`) : `--animation-act1` (1500ms), `--animation-act2` (1200ms), `--animation-pause` (300ms), `--animation-act3` (2000ms), `--easing-flight`, `--easing-land`, `--easing-reveal`
**And** la page est un Server Component (zéro `"use client"`)
**And** `app/page.tsx` remplace l'ancienne landing page non-invités

### Story 1.2: Contenu Save the Date — HTML Sémantique & Texte

As a invité,
I want voir les prénoms du couple, la date, le lieu et un message poétique affichés de manière lisible et élégante,
So that je retiens immédiatement la date et le lieu du mariage.

**Acceptance Criteria:**

**Given** un visiteur accède à la page `/`
**When** la page se charge
**Then** le contenu suivant est affiché, centré verticalement et horizontalement :
- `h1` : "Ahmed & Ghizlaine" en Cormorant Garamond 300, 48px mobile / 80px desktop, couleur `#2C2418`
- `time` : "17 Octobre 2026" en Cormorant Garamond 400, 36px mobile / 56px desktop, couleur `#2C2418`
- `address` : "Casablanca" en Cormorant Garamond 400, 28px mobile / 40px desktop, couleur `#2C2418`
- Séparateur doré : trait horizontal `w-12`, `h-px`, couleur `#B8860B`, centré (`mx-auto`)
- `blockquote` : « Une date à retenir, une histoire à écrire ensemble… les détails suivront bientôt. » en Geist Sans 400 italique, 18px, couleur `#6B5D4F`

**And** le composant `SaveTheDateContent` est dans `components/save-the-date/save-the-date-content.tsx`
**And** le composant `GoldenSeparator` est dans `components/save-the-date/golden-separator.tsx`
**And** le layout utilise `flex` + `justify-center` + `text-center` sur les enfants + `mx-auto` sur les blocs (PAS `items-center` sur le flex-col)
**And** l'espacement entre les lignes respecte la hiérarchie : 32px entre prénoms↔date, 16px entre date↔lieu, 16px entre lieu↔séparateur, 16px entre séparateur↔message
**And** les éléments décoratifs (séparateur) portent `aria-hidden="true"`
**And** le contenu textuel est accessible nativement aux lecteurs d'écran (FR-STD-9)
**And** le contenu est visible par défaut (`opacity: 1`) — progressive enhancement (FR-STD-8)

### Story 1.3: Cadre Doré — SVG Décoratif avec Coins Arabesques

As a invité,
I want voir un cadre doré fin avec des coins arabesques encadrant le contenu,
So that l'écran évoque un faire-part physique premium et structure visuellement le contenu.

**Acceptance Criteria:**

**Given** un visiteur accède à la page `/`
**When** la page se charge
**Then** un cadre doré est visible autour du contenu :
- Filet fin (1-2px) couleur `#B8860B` (Doré Marocain)
- Coins décoratifs arabesques géométriques en `#D4A54A` (Doré Lumineux)
- Marge : ~24px mobile / ~48px desktop par rapport aux bords de l'écran
- Occupe ~85% largeur mobile / ~70% largeur desktop, ~80% hauteur visible

**And** le composant `GoldenFrame` est dans `components/save-the-date/golden-frame.tsx`
**And** le SVG est inline dans le composant (pas dans `/public`)
**And** le cadre porte `aria-hidden="true"` (élément décoratif)
**And** le cadre est responsive (`sm:`, `md:`, `lg:` breakpoints Tailwind)
**And** le cadre est visible en mode `prefers-reduced-motion` (élément statique)

### Story 1.4: Responsive & Accessibilité — Validation Complète

As a invité sur mobile ou desktop,
I want que la page s'affiche parfaitement sur tous les écrans de 360px à 1920px,
So that l'expérience est élégante quelle que soit la taille de mon écran.

**Acceptance Criteria:**

**Given** un visiteur accède à la page `/` sur un appareil mobile (360px)
**When** la page se charge
**Then** le contenu est lisible, le cadre doré est visible, les tailles typographiques sont adaptées (48px prénoms, 36px date, 28px lieu, 18px message)
**And** les marges latérales sont `px-6`

**Given** un visiteur accède à la page `/` sur un écran desktop (1440px)
**When** la page se charge
**Then** les tailles typographiques sont agrandies (80px prénoms, 56px date, 40px lieu, 18px message)
**And** les marges latérales sont `px-8`
**And** le cadre doré a des marges plus généreuses (~48px)

**Given** un visiteur a activé `prefers-reduced-motion`
**When** la page se charge
**Then** le contenu textuel est affiché directement sans animation
**And** le cadre doré est visible
**And** le séparateur doré est visible
**And** aucun pigeon, enveloppe ou sceau n'est affiché (FR-STD-8)

**Given** un lecteur d'écran (VoiceOver) lit la page
**When** le contenu est lu
**Then** l'ordre de lecture est : "Ahmed & Ghizlaine" → "17 Octobre 2026" → "Casablanca" → "Une date à retenir…"
**And** les éléments décoratifs (cadre, séparateur) sont ignorés (`aria-hidden`)

**And** Lighthouse Performance > 85 sur mobile (NFR-4)
**And** Lighthouse Accessibility ≥ 95

## Epic 2: Animation Pigeon Voyageur — Le Spectacle en 3 Actes

L'invité vit une micro-narration animée de 5 secondes : un pigeon stylisé entre en vol, dépose une enveloppe cachetée A&G, s'envole, puis l'enveloppe s'ouvre pour révéler le contenu Save the Date. L'animation crée l'effet "waouh" qui donne envie de partager.

### Story 2.1: Sceau A&G — SVG Monogramme avec Entrelacs Arabesques

As a invité,
I want voir un sceau doré portant les initiales "A&G" entouré d'entrelacs géométriques inspirés de l'art islamique,
So that le cachet personnalisé renforce le sentiment d'invitation sur mesure.

**Acceptance Criteria:**

**Given** le composant `SealAG` est rendu
**When** il s'affiche à l'écran
**Then** un cercle doré (`#B8860B`) contient les initiales "A" et "G" en serif élégante (proche Cormorant) avec "&" plus petit entre les deux
**And** des motifs géométriques fins (entrelacs arabesques, étoiles à 8 branches) entourent le monogramme en `#D4A54A`
**And** le SVG est inline dans `components/save-the-date/seal-ag.tsx`
**And** le composant est un Server Component (zéro `"use client"`)
**And** le `<svg>` porte `aria-hidden="true"`
**And** le `viewBox` est défini, la taille contrôlée par CSS (~30-40px mobile, ~50-60px desktop)
**And** le composant est exporté en PascalCase : `export function SealAG()`
**And** le poids du SVG contribue au budget total < 150 Ko (NFR-2)

### Story 2.2: Enveloppe — SVG + Animation Ouverture & Brisure du Sceau (Acte 3)

As a invité,
I want voir une enveloppe élégante dont le sceau se brise et le rabat se soulève avec grâce pour révéler le contenu,
So that l'ouverture crée l'anticipation et la solennité de la révélation.

**Acceptance Criteria:**

**Given** le composant `Envelope` est rendu
**When** il s'affiche à l'écran
**Then** une enveloppe en Blanc Cassé (`#FFFDF9`) est visible avec :
- Surface avec grain quasi-imperceptible
- Plis/bords en ombres discrètes `#E8D5A8`
- Liseré fin doré `#D4A54A` sur les contours
- Rabat triangulaire supérieur
- Proportions ratio ~3:2, ~120px mobile / ~200px desktop

**And** le `SealAG` est intégré visuellement sur l'enveloppe cachetée
**And** les keyframes suivants sont ajoutés dans `globals.css` :
- `seal-break` : le sceau se réduit (`scale`) + `opacity → 0`
- `envelope-open` : le rabat se soulève en `rotateX()` avec `var(--easing-reveal)`
**And** l'enveloppe passe de l'état scellé → ouverture → ghost (~20-25% opacité) via `animation-fill-mode: forwards`
**And** le SVG est inline dans `components/save-the-date/envelope.tsx`
**And** le composant est un Server Component, porte `aria-hidden="true"`
**And** en mode `prefers-reduced-motion` : l'enveloppe est en `display: none`

### Story 2.3: Pigeon Voyageur — SVG + Animation Vol & Dépôt (Actes 1 & 2)

As a invité,
I want voir un pigeon stylisé entrer en vol gracieux, déposer l'enveloppe au centre et s'envoler vers le haut,
So that la narration du messager crée l'émerveillement et porte la charge émotionnelle du Save the Date.

**Acceptance Criteria:**

**Given** le composant `PigeonVoyageur` est rendu
**When** l'animation démarre
**Then** le pigeon entre depuis la gauche avec une trajectoire en arc gracieux (Acte 1, ~1500ms) :
- Style flat premium, 2-3 couleurs : corps `#B8860B`, plumage `#D4A54A`, ombre `#E8D5A8`
- Enveloppe visible dans le bec dès la première frame
- Battements d'ailes fluides (keyframes internes sur `<g>` SVG)
- Trajectoire via `offset-path: path(...)` avec `var(--easing-flight)`

**And** le pigeon se pose et dépose l'enveloppe (Acte 2, dépôt 300ms) avec micro-rebond `var(--easing-land)`
**And** le pigeon s'envole vers le haut avec fade-out (~900ms) via `ease-out`
**And** les keyframes suivants sont ajoutés dans `globals.css` :
- `pigeon-fly` : trajectoire via `offset-distance` (navigateurs modernes)
- `pigeon-fly-fallback` : courbe simulée avec 5-6 keyframes `translate` + `rotate` (fallback)
- `pigeon-depart` : envol vertical + `opacity → 0`
**And** le fallback `@supports not (offset-path: path("M0 0"))` est implémenté
**And** le SVG est inline dans `components/save-the-date/pigeon-voyageur.tsx`
**And** taille ~80-100px mobile / ~150-180px desktop
**And** le composant est un Server Component, porte `aria-hidden="true"`, `pointer-events: none`
**And** en mode `prefers-reduced-motion` : le pigeon est en `display: none`
**And** `animation-fill-mode: forwards` — le pigeon reste invisible après l'envol

### Story 2.4: Orchestration Animation — Timeline 5000ms & Progressive Enhancement

As a invité,
I want que l'animation complète se joue de manière fluide en une séquence cohérente de 5 secondes au chargement,
So that je vis un spectacle de 3 actes sans saccade ni incohérence.

**Acceptance Criteria:**

**Given** un visiteur accède à la page `/` (animations autorisées)
**When** la page se charge
**Then** l'animation se déroule selon la timeline exacte :
- `0-1500ms` : Acte 1 — pigeon entre en vol
- `1500-1800ms` : Acte 2 — dépôt enveloppe (300ms)
- `1800-2700ms` : Acte 2 — envol pigeon (900ms)
- `2700-3000ms` : Micro-pause — enveloppe seule, sceau visible
- `3000-3500ms` : Acte 3 — sceau se brise, enveloppe s'ouvre
- `3500-3700ms` : "Ahmed & Ghizlaine" apparaît
- `3700-3900ms` : "17 Octobre 2026" apparaît
- `3900-4100ms` : "Casablanca" apparaît
- `4100-4200ms` : Séparateur doré apparaît
- `4200-4600ms` : Message poétique apparaît
- `4600-5000ms` : Stabilisation — enveloppe fade à ~20-25% opacité

**And** tous les `animation-delay` sont calculés depuis `t=0` (pas d'orchestrateur JS)
**And** les keyframes `text-reveal` (opacity + translateY +8px) sont ajoutés dans `globals.css` avec `animation-fill-mode: both`
**And** toutes les animations sont wrappées dans `@media (prefers-reduced-motion: no-preference)` — un seul bloc global
**And** le contenu textuel est `opacity: 1` par défaut (progressive enhancement), overridé en `opacity: 0` + animation dans le media query
**And** l'animation se joue une seule fois (`animation-iteration-count: 1`) (FR-STD-6)
**And** `page.tsx` assemble tous les composants : `GoldenFrame`, `PigeonVoyageur`, `Envelope`, `SealAG`, `SaveTheDateContent`, `GoldenSeparator`
**And** imports directs (pas de barrel `index.tsx`)
**And** durée totale = 5000ms (FR-STD-7)
**And** 60fps sans jank sur appareils cibles (NFR-1)
**And** les tokens d'easing et de durée sont utilisés (`var(--easing-*)`, `var(--animation-*)`) — jamais de valeurs hardcodées

## Epic 3: Open Graph — Aperçu WhatsApp

Quand le lien `/` est partagé sur WhatsApp, un aperçu visuel attractif s'affiche : enveloppe dorée fermée avec sceau A&G sur fond crème, titre "Ahmed & Ghizlaine — Save the Date", description "17 Octobre 2026 · Casablanca". L'aperçu suscite la curiosité et donne envie d'ouvrir le lien.

### Story 3.1: Image Open Graph — Enveloppe Fermée + Sceau A&G (Satori)

As a invité qui reçoit le lien `/` sur WhatsApp,
I want voir un aperçu visuel avec une enveloppe dorée fermée et le titre "Ahmed & Ghizlaine — Save the Date",
So that ma curiosité est piquée et j'ai envie d'ouvrir le lien pour découvrir l'animation.

**Acceptance Criteria:**

**Given** le lien `/` est partagé sur WhatsApp (ou un réseau social)
**When** la plateforme génère l'aperçu Open Graph
**Then** l'image affichée est de 1200×630px et montre :
- Fond crème `#FAF7F2`
- Enveloppe fermée centrée avec sceau A&G (version simplifiée des SVG, compatible Satori)
- Style cohérent avec les composants `Envelope` et `SealAG` d'Epic 2

**And** les métadonnées OG sont correctes :
- `og:title` : "Ahmed & Ghizlaine — Save the Date"
- `og:description` : "17 Octobre 2026 · Casablanca"
- `og:type` : "website"
- `og:url` : URL canonique de `/`

**And** le fichier est `app/opengraph-image.tsx` utilisant `ImageResponse` (Satori)
**And** le SVG est simplifié/dupliqué pour la compatibilité Satori (pas les mêmes composants React que l'animation)
**And** la page conserve `noindex, nofollow` dans les metadata
**And** l'image ne révèle pas tout le contenu — l'enveloppe fermée crée la curiosité
