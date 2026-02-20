---
title: 'Scroll dynamique desktop — Fond parallax évolutif + animations d'entrée'
slug: 'scroll-dynamique-desktop-parallax-animations'
created: '2026-02-20'
status: 'completed'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['CSS Scroll-Driven Animations', 'Tailwind CSS 4', 'Next.js 16', 'React 19']
files_to_modify: ['app/globals.css', 'app/(guest)/layout.tsx', 'components/guest/info-section.tsx', 'components/guest/timeline-section.tsx', 'components/guest/venue-section.tsx', 'components/guest/program-section.tsx', 'components/guest/merci-section.tsx']
code_patterns: ['scroll-reveal via animation-timeline: view()', 'named scroll timeline --guest-scroll', '@supports progressive enhancement', 'prefers-reduced-motion: reduce reset', 'motion-safe:animate-fade-in-up on headings', 'snap-start on all sections', 'bg-cream-warm / bg-white-broken backgrounds', 'isolation: isolate for stacking context', 'animation-range offsets for stagger (NOT animation-delay)', 'nth-of-type for element-specific counting']
test_patterns: ['visual verification desktop Chrome/Safari/Firefox', 'prefers-reduced-motion test', '@supports fallback test', 'mobile unchanged test', 'landscape mode test', 'conditional sections test']
adversarial_review: 'passed — 2 rounds, 19 findings total, all addressed'
---

# Tech-Spec: Scroll dynamique desktop — Fond parallax évolutif + animations d'entrée

**Created:** 2026-02-20

## Overview

### Problem Statement

L'expérience desktop de la page invite est visuellement plate — toutes les sections (Info, Timeline, Venue, Program, Merci) partagent un background crème uniforme (`bg-cream-warm`) avec des animations d'entrée identiques (`scroll-reveal`). Malgré le snap scroll fonctionnel, il n'y a aucune progression visuelle ni dynamisme entre les sections, ce qui ne correspond pas à l'ambition "style Apple" du brainstorming (#7, #8, #13, #14, #16).

### Solution

Triple combo desktop-only (≥1024px) :
1. **Fond parallax fixe** — `arriere plan 2.jpg` affiché via un `<div>` fixe (position: fixed) dans le layout guest, visible derrière les sections transparentes
2. **Overlays colorés progressifs** — Chaque section (Info, Timeline, Venue, Program, Merci) reçoit un overlay semi-transparent via `::before` de teinte progressivement plus chaude (crème → doré → mauve → ambré → crème dense)
3. **Animations d'entrée différenciées** — Chaque section a sa propre animation d'entrée via override desktop de `.scroll-reveal` par section parente, avec stagger via `animation-range` offsets (PAS `animation-delay` qui est ignoré par scroll-driven animations)

### Scope

**In Scope :**
- Fond parallax fixe via `<div>` fixe dans le layout (desktop ≥1024px)
- Overlays colorés progressifs sur sections Info → Timeline → Venue → Program → Merci
- Animations d'entrée spécifiques par section (desktop only)
- CSS pur + 1 seul `<div>` HTML pour le fond (pas de JS additionnel)
- Progressive enhancement : fallback propre si `animation-timeline: view()` non supporté
- `prefers-reduced-motion: reduce` respecté

**Out of Scope :**
- Mobile (sera traité séparément)
- Section Hero (déjà photo + overlay doré, inchangée)
- Aucun nouvel asset — uniquement les fichiers existants
- Alliance Rings (inchangé)

## Context for Development

### Codebase Patterns

- **Scroll container** : `.guest-scroll-container` dans `app/(guest)/layout.tsx` avec `h-dvh overflow-y-scroll snap-y snap-mandatory`
- **Named scroll timeline** : `scroll-timeline-name: --guest-scroll` déjà défini sur `.guest-scroll-container` (globals.css L119)
- **Scroll-driven animations** : `animation-timeline: view()` avec `@supports (animation-timeline: view())` progressive enhancement (globals.css L97-105)
- **IMPORTANT — `animation-delay` est ignoré** avec `animation-timeline: view()`. Pour créer un effet stagger, utiliser des offsets `animation-range` différents par enfant (ex: `entry 0% entry 50%`, `entry 5% entry 55%`, `entry 10% entry 60%`)
- **Classes utilitaires** : `.scroll-reveal` (fade-in + slide-up via `scrollReveal` keyframe), `motion-safe:animate-fade-in-up` (headings)
- **Backgrounds actuels** : `bg-cream-warm` (#FAF7F2 — Info, Timeline, Program, Merci) et `bg-white-broken` (#FFFDF9 — Venue)
- **Couleurs thème disponibles** : `gold-moroccan` (#B8860B), `gold-luminous` (#D4A54A), `mauve-deep` (#6B3A4E), `olive-deep` (#4A5E3A), `brown-deep` (#2C2418), `mauve-soft` (#7A5A6A)
- **Image disponible** : `/images/rings/arriere plan 2.jpg` (91 Ko, desktop) — ATTENTION : espace dans le nom de fichier, toujours utiliser des quotes dans `url('...')`
- **Layout rule** : NO max-width, width via padding uniquement
- **Flex text bug** : JAMAIS `flex flex-col items-center` pour layout sections (note : TimelineSection L33 utilise `items-center` — bug existant hors scope de cette spec)
- **Alliance Rings** : animations CSS pures bindées à `--guest-scroll` via `animation-timeline: --guest-scroll`. Le composant `alliance-rings.tsx` est rendu comme sibling des sections dans `page.tsx`, avec `position: fixed; z-index: 10`. Les `isolation: isolate` ajoutés sur les sections créent des stacking contexts locaux qui n'affectent PAS le ring container fixe (car il est hors de ces sections dans le DOM)
- **Reduced motion** : bloc dédié dans globals.css (L432-463) qui reset toutes les animations — le `.scroll-reveal` y est déjà couvert, donc les overrides par section seront automatiquement resetés aussi
- **Sections conditionnelles** : Venue, Program et Merci sont conditionnellement rendues via `showVenue`, `showProgram`, `showMerci` dans `page.tsx`. Si certaines sections sont masquées, la progression chromatique des overlays n'est plus linéaire (les couleurs sont liées à la section, pas à la position). C'est acceptable car chaque overlay est cohérent individuellement
- **`:nth-of-type` vs `:nth-child`** : Pour cibler les éléments `.scroll-reveal` par position sans être affecté par les siblings non-`.scroll-reveal`, utiliser `:nth-of-type()` quand les éléments cibles ont un tag HTML différent de leurs siblings (ex: `<article>` vs `<div>` dans Timeline). Pour les enfants directs d'un même type, utiliser `:nth-child()` avec les indices corrects

### Files to Reference

| File | Purpose | Lignes clés |
| ---- | ------- | ----------- |
| `app/(guest)/layout.tsx` | Scroll container `.guest-scroll-container` avec snap scroll | L7 — `<main>` avec classes |
| `app/globals.css` | Thème, animations scroll-reveal, alliance rings, reduced-motion | L5-73 (thème), L86-105 (scroll-reveal), L116-227 (alliance), L432-463 (reduced-motion) |
| `components/guest/info-section.tsx` | Section Info — `bg-cream-warm`, `.scroll-reveal` sur séparateur + textes | L6 (section), L14-19 (scroll-reveal) |
| `components/guest/timeline-section.tsx` | Section Timeline — `bg-cream-warm`, grille alternée desktop, `.scroll-reveal` | L33 (section), L52 (mobile scroll-reveal), L69 (desktop scroll-reveal) |
| `components/guest/venue-section.tsx` | Section Venue — `bg-white-broken`, `.scroll-reveal` sur 5 éléments | L6 (section), L14-27 (scroll-reveal) |
| `components/guest/program-section.tsx` | Section Programme — `bg-cream-warm`, grille 5 icônes, `.scroll-reveal` | L49 (section), L57/L61 (scroll-reveal) |
| `components/guest/merci-section.tsx` | Section Merci — `bg-cream-warm`, `.scroll-reveal` | L6 (section), L14-16 (scroll-reveal) |
| `components/guest/hero-section.tsx` | Section Hero (référence — inchangée) | Overlay doré 18% |
| `app/(guest)/invite/[slug]/page.tsx` | Page guest — orchestre toutes les sections, rendu conditionnel | L45-51 (sections), Alliance Rings sibling |

### Technical Decisions

- **Desktop-only** via `@media (min-width: 1024px)` — mobile conserve l'expérience actuelle
- **CSS pur** — pas de librairie d'animation JS, extension du pattern existant
- **`<div>` fixe pour le parallax** (PAS `background-attachment: fixed`) — `background-attachment: fixed` ne produit pas de parallax dans un container `overflow: scroll`. La solution fiable : un `<div>` avec `position: fixed; inset: 0; z-index: -1` comme sibling AVANT le scroll container dans `layout.tsx`. Caché sur mobile via `hidden lg:block`
- **Overlays via `::before`** pseudo-éléments + `isolation: isolate` sur les sections — le `z-index: -1` sur le pseudo-élément place l'overlay derrière le contenu sans avoir besoin de `z-index` sur les enfants. `isolation: isolate` crée un stacking context local qui n'affecte PAS les éléments `position: fixed` extérieurs (Alliance Rings)
- **Overlay Venue** utilise `rgba(255, 253, 249, ...)` (#FFFDF9 = white-broken) au lieu de `rgba(250, 247, 242, ...)` (#FAF7F2 = cream-warm) pour conserver l'identité visuelle plus froide de cette section par rapport aux sections crème
- **`lg:bg-transparent`** ajouté aux sections ET au `<main>` scroll container pour rendre les bg transparents sur desktop — mobile garde `bg-cream-warm` / `bg-white-broken`. En Tailwind CSS 4, les variants responsive (`lg:`) sont générées après les classes de base dans le CSS, donc l'override de spécificité fonctionne
- **Stagger via `animation-range` offsets** (PAS `animation-delay`) — avec scroll-driven animations, `animation-delay` en ms/s est ignoré. On utilise des offsets `animation-range` progressifs : `entry 0% entry 50%` → `entry 5% entry 55%` → `entry 10% entry 60%`
- **Timeline : `article:nth-of-type()` au lieu de `:nth-child()`** — le container desktop Timeline a un premier enfant `<div>` (ligne dorée) suivi de 3 `<article>` (events). `:nth-child(odd/even)` compterait la `<div>` et inverserait les indices. `article.scroll-reveal:nth-of-type(odd/even)` ne compte que les `<article>`, donnant les bons indices (1=La Rencontre=gauche, 2=Fiançailles=droite, 3=Jour J=gauche)
- **InfoSection : `:nth-child()` avec indices exacts** — Les enfants directs de `<section>` sont : h2 (1), div.scroll-reveal (2), p.scroll-reveal (3), p.scroll-reveal (4). Les indices sont corrects mais FRAGILES — si des enfants sont ajoutés/réordonnés, les selectors doivent être mis à jour. Commentaire CSS explicite obligatoire
- **Pas de bounce sur Program** — `entryScaleReveal` (scale 0.92→1 + fade) au lieu de `entryBounceIn`. Le bounce avec snap-mandatory produit une animation instantanée qui rend le bounce imperceptible. Le stagger n'est pas appliqué sur Program car les 5 event cards sont enfants d'un wrapper `<div>` intermédiaire, rendant le ciblage CSS complexe — acceptable car le `view()` trigger se décale naturellement grâce à l'espacement vertical (`space-y-8`)
- **Merci incluse dans les overlays** — avec une opacité haute (0.92) quasi-solide pour éviter un rectangle crème jarring sur le fond parallax
- **Pas de conflit avec Alliance Rings** — les alliances utilisent `--guest-scroll` (scroll timeline) et sont en `position: fixed; z-index: 10` hors des sections. Les animations d'entrée utilisent `view()` (view timeline) sur des éléments internes aux sections

## Implementation Plan

### Tasks

- [x] **Task 1 : JSX — Ajouter le `<div>` parallax fixe dans le layout guest**
  - File : `app/(guest)/layout.tsx`
  - Action : Wrapper dans un Fragment, ajouter le `<div>` fixe AVANT le `<main>`, et ajouter `lg:bg-transparent` au `<main>`
  - Avant :
    ```tsx
    return (
      <main className="guest-scroll-container h-dvh overflow-y-scroll snap-y snap-mandatory landscape:snap-none landscape:overflow-y-auto bg-cream-warm font-sans">
        {children}
      </main>
    )
    ```
  - Après :
    ```tsx
    return (
      <>
        <div
          className="hidden lg:block fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/rings/arriere plan 2.jpg')" }}
          aria-hidden="true"
        />
        <main className="guest-scroll-container h-dvh overflow-y-scroll snap-y snap-mandatory landscape:snap-none landscape:overflow-y-auto bg-cream-warm lg:bg-transparent font-sans">
          {children}
        </main>
      </>
    )
    ```
  - Notes : `hidden lg:block` = invisible sur mobile, visible sur desktop. `-z-10` place le div derrière tout. `aria-hidden="true"` car purement décoratif. Le `style={{ backgroundImage }}` est utilisé car le nom de fichier contient un espace — l'inline style évite les problèmes d'échappement CSS

- [x] **Task 2 : CSS — Classes overlay progressifs par section (desktop)**
  - File : `app/globals.css`
  - Action : Définir les overlays `::before` pour 5 classes de section (Info + Timeline + Venue + Program + Merci), scoped dans `@media (min-width: 1024px)`
  - Placement : après le bloc existant `.guest-scroll-container { scroll-timeline-name: --guest-scroll; }` (L119-121), AVANT le bloc Alliance Rings keyframes
  - Détails :
    ```css
    /* === Desktop: Parallax Overlays & Entry Animations === */

    @media (min-width: 1024px) {
      .section-info,
      .section-timeline,
      .section-venue,
      .section-program,
      .section-merci {
        position: relative;
        isolation: isolate;
      }

      .section-info::before,
      .section-timeline::before,
      .section-venue::before,
      .section-program::before,
      .section-merci::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        pointer-events: none;
      }

      /* Progression chromatique : crème neutre → doré → mauve → ambré → crème dense */
      .section-info::before {
        background: rgba(250, 247, 242, 0.88);
      }
      .section-timeline::before {
        background: linear-gradient(
          to bottom,
          rgba(250, 247, 242, 0.84),
          rgba(212, 165, 74, 0.10)
        );
      }
      /* Venue : base white-broken (#FFFDF9) pour conserver son identité plus froide */
      .section-venue::before {
        background: linear-gradient(
          to bottom,
          rgba(255, 253, 249, 0.82),
          rgba(107, 58, 78, 0.08)
        );
      }
      .section-program::before {
        background: linear-gradient(
          to bottom,
          rgba(250, 247, 242, 0.80),
          rgba(212, 165, 74, 0.14)
        );
      }
      .section-merci::before {
        background: rgba(250, 247, 242, 0.92);
      }
    }
    ```

- [x] **Task 3 : CSS — Keyframes d'entrée différenciés + overrides desktop**
  - File : `app/globals.css`
  - Action : Définir 4 nouveaux keyframes et overrider `.scroll-reveal` dans chaque section parente sur desktop
  - Placement : immédiatement après le bloc Task 2 (dans le même fichier), toujours AVANT les Alliance Rings keyframes
  - Détails :
    ```css
    /* --- Keyframes d'entrée différenciés (desktop) --- */

    @keyframes entryFadeStagger {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes entrySlideFromLeft {
      from { opacity: 0; transform: translateX(-40px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes entrySlideFromRight {
      from { opacity: 0; transform: translateX(40px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes entryScaleReveal {
      from { opacity: 0; transform: scale(0.92); }
      to { opacity: 1; transform: scale(1); }
    }

    /* --- Overrides desktop : animations d'entrée par section --- */
    @media (min-width: 1024px) {
      @supports (animation-timeline: view()) {
        /*
         * Info : fade stagger via animation-range offsets progressifs
         * DOM : <section.section-info> children are:
         *   h2 (child 1, not .scroll-reveal)
         *   div.scroll-reveal (child 2 — separator)
         *   p.scroll-reveal (child 3 — message)
         *   p.scroll-reveal (child 4 — submessage)
         * ⚠️ FRAGILE: indices must be updated if children are added/reordered
         */
        .section-info .scroll-reveal {
          animation-name: entryFadeStagger;
        }
        .section-info .scroll-reveal:nth-child(2) {
          animation-range: entry 0% entry 50%;
        }
        .section-info .scroll-reveal:nth-child(3) {
          animation-range: entry 5% entry 55%;
        }
        .section-info .scroll-reveal:nth-child(4) {
          animation-range: entry 10% entry 60%;
        }

        /*
         * Timeline desktop : slide depuis les côtés alternés
         * DOM : div.hidden.md:block.relative children are:
         *   div (child 1 — gold center line, NOT an <article>)
         *   article.scroll-reveal (child 2 — La Rencontre, isLeft=true)
         *   article.scroll-reveal (child 3 — Les Fiançailles, isLeft=false)
         *   article.scroll-reveal (child 4 — Le Jour J, isLeft=true)
         * Using article:nth-of-type() to count ONLY <article> elements,
         * ignoring the <div> gold line. This gives correct left/right mapping:
         *   nth-of-type(odd) = articles 1,3 = isLeft = slide from left
         *   nth-of-type(even) = article 2 = isRight = slide from right
         */
        .section-timeline article.scroll-reveal:nth-of-type(odd) {
          animation-name: entrySlideFromLeft;
          animation-range: entry 0% entry 50%;
        }
        .section-timeline article.scroll-reveal:nth-of-type(even) {
          animation-name: entrySlideFromRight;
          animation-range: entry 0% entry 50%;
        }

        /* Venue : scale reveal */
        .section-venue .scroll-reveal {
          animation-name: entryScaleReveal;
          animation-range: entry 0% entry 50%;
        }

        /*
         * Program : scale reveal (PAS bounce — bounce imperceptible avec snap scroll)
         * Les 5 event cards sont enfants d'un wrapper <div class="mt-10 w-full space-y-8">,
         * pas enfants directs de .section-program. Le stagger naturel vient de
         * l'espacement vertical (space-y-8) qui décale les view() triggers.
         */
        .section-program .scroll-reveal {
          animation-name: entryScaleReveal;
          animation-range: entry 0% entry 50%;
        }
      }
    }
    ```
  - Notes : `animation-timeline: view()` est hérité du `.scroll-reveal` de base — seuls `animation-name` et `animation-range` sont overridés. Le mobile layout Timeline (div `md:hidden`) n'est pas affecté par le media query `min-width: 1024px`

- [x] **Task 4 : CSS — Vérification du bloc `prefers-reduced-motion`**
  - File : `app/globals.css`
  - Action : Vérifier que le reset existant dans le bloc `prefers-reduced-motion: reduce` (L432+) couvre les nouvelles animations
  - Détails : Le bloc existant contient `.scroll-reveal { animation: none !important; opacity: 1 !important; transform: none !important; }` — ceci override TOUS les `animation-name` y compris les nouveaux (`entryFadeStagger`, `entrySlideFromLeft`, etc.) car les overrides desktop sont sur `.section-X .scroll-reveal` / `.section-X article.scroll-reveal` qui matchent le même élément `.scroll-reveal`. L'`!important` gagne. Pas de règles supplémentaires nécessaires
  - Notes : Les overlays `::before` sont décoratifs statiques — ils restent visibles en reduced-motion. Le `<div>` parallax fixe est un fond statique, pas du mouvement — il reste visible aussi

- [x] **Task 5 : JSX — Appliquer les classes sur InfoSection**
  - File : `components/guest/info-section.tsx`
  - Action : Ajouter `section-info` et `lg:bg-transparent` au `<section>` (L6)
  - Avant : `className="min-h-dvh snap-start flex flex-col justify-center px-6 lg:px-12 bg-cream-warm"`
  - Après : `className="section-info min-h-dvh snap-start flex flex-col justify-center px-6 lg:px-12 bg-cream-warm lg:bg-transparent"`

- [x] **Task 6 : JSX — Appliquer les classes sur TimelineSection**
  - File : `components/guest/timeline-section.tsx`
  - Action : Ajouter `section-timeline` et `lg:bg-transparent` au `<section>` (L33)
  - Avant : `className="min-h-dvh snap-start flex flex-col items-center justify-center bg-cream-warm px-6 lg:px-12 py-16 lg:py-20"`
  - Après : `className="section-timeline min-h-dvh snap-start flex flex-col items-center justify-center bg-cream-warm lg:bg-transparent px-6 lg:px-12 py-16 lg:py-20"`
  - Notes : `items-center` est un bug existant (MEMORY.md l'interdit) — hors scope de cette spec

- [x] **Task 7 : JSX — Appliquer les classes sur VenueSection**
  - File : `components/guest/venue-section.tsx`
  - Action : Ajouter `section-venue` et `lg:bg-transparent` au `<section>` (L6)
  - Avant : `className="min-h-dvh snap-start flex flex-col justify-center px-6 lg:px-12 py-16 lg:py-20 bg-white-broken"`
  - Après : `className="section-venue min-h-dvh snap-start flex flex-col justify-center px-6 lg:px-12 py-16 lg:py-20 bg-white-broken lg:bg-transparent"`

- [x] **Task 8 : JSX — Appliquer les classes sur ProgramSection**
  - File : `components/guest/program-section.tsx`
  - Action : Ajouter `section-program` et `lg:bg-transparent` au `<section>` (L49)
  - Avant : `className="min-h-dvh snap-start flex flex-col justify-center px-6 lg:px-12 py-16 lg:py-20 bg-cream-warm"`
  - Après : `className="section-program min-h-dvh snap-start flex flex-col justify-center px-6 lg:px-12 py-16 lg:py-20 bg-cream-warm lg:bg-transparent"`

- [x] **Task 9 : JSX — Appliquer les classes sur MerciSection**
  - File : `components/guest/merci-section.tsx`
  - Action : Ajouter `section-merci` et `lg:bg-transparent` au `<section>` (L6)
  - Avant : `className="min-h-dvh snap-start flex flex-col justify-center px-6 lg:px-12 bg-cream-warm"`
  - Après : `className="section-merci min-h-dvh snap-start flex flex-col justify-center px-6 lg:px-12 bg-cream-warm lg:bg-transparent"`
  - Notes : L'overlay `::before` sur Merci est quasi-opaque (0.92) — visuellement très proche du crème actuel, mais laisse une micro-transparence pour la cohérence avec les autres sections

### Acceptance Criteria

- [ ] **AC 1** : Given un navigateur desktop (≥1024px), when l'utilisateur visite la page invite, then un fond photo fixe (`arriere plan 2.jpg`) est visible en parallax derrière les sections via un `<div>` fixe
- [ ] **AC 2** : Given un navigateur desktop (≥1024px), when l'utilisateur voit les sections Info → Timeline → Venue → Program → Merci, then chaque section a un overlay semi-transparent de teinte progressivement plus chaude (crème → doré → mauve → ambré → crème dense) laissant entrevoir le fond parallax
- [ ] **AC 3** : Given un navigateur desktop (≥1024px) supportant scroll-driven animations, when l'utilisateur scrolle vers la section Info, then les éléments `.scroll-reveal` apparaissent en fade-up avec des `animation-range` progressifs (stagger visuel entre séparateur, message, sous-message)
- [ ] **AC 4** : Given un navigateur desktop (≥1024px) supportant scroll-driven animations, when l'utilisateur scrolle vers la section Timeline, then les cards desktop alternent correctement entre slide-from-left (events aux positions impaires : La Rencontre, Le Jour J) et slide-from-right (events aux positions paires : Les Fiançailles)
- [ ] **AC 5** : Given un navigateur desktop (≥1024px) supportant scroll-driven animations, when l'utilisateur scrolle vers la section Venue, then les éléments apparaissent en scale-up (0.92 → 1) + fade
- [ ] **AC 6** : Given un navigateur desktop (≥1024px) supportant scroll-driven animations, when l'utilisateur scrolle vers la section Program, then les blocs apparaissent en scale-reveal (même type que Venue)
- [ ] **AC 7** : Given un navigateur mobile (<1024px), when l'utilisateur scrolle la page invite, then le comportement actuel est identique — fond crème/blanc solide, `scroll-reveal` standard, aucun changement visible, pas de `<div>` parallax affiché
- [ ] **AC 8** : Given `prefers-reduced-motion: reduce` activé, when l'utilisateur visite la page, then toutes les animations sont désactivées — contenu affiché immédiatement avec opacité 1 et transform none. Les overlays statiques et le fond parallax restent visibles (ce sont des éléments visuels statiques, pas du mouvement)
- [ ] **AC 9** : Given un navigateur ne supportant pas `animation-timeline: view()`, when l'utilisateur visite sur desktop, then le contenu s'affiche normalement sans animation (fallback `@supports` existant). Le fond parallax et les overlays restent visibles car ils ne dépendent pas de `@supports`
- [ ] **AC 10** : Given le déploiement, when les Alliance Rings scrollent avec la page, then leur animation `--guest-scroll` fonctionne toujours correctement — les `isolation: isolate` sur les sections n'affectent pas le ring container (`position: fixed; z-index: 10`) qui est un sibling des sections dans le DOM
- [ ] **AC 11** : Given un navigateur desktop en mode landscape, when l'utilisateur scrolle (snap désactivé en landscape via `landscape:snap-none`), then les overlays et le fond parallax sont visibles et les animations d'entrée se déclenchent correctement au scroll libre
- [ ] **AC 12** : Given des sections conditionnellement masquées (ex: `showVenue = false`), when l'utilisateur scrolle sur desktop, then les sections visibles conservent leur overlay propre (pas de trou visuel) — la progression chromatique saute la couleur de la section masquée, ce qui est acceptable

## Additional Context

### Dependencies

- Aucune nouvelle dépendance npm
- Asset existant : `/images/rings/arriere plan 2.jpg` (91 Ko) — nom de fichier avec espace, toujours quotes dans les URL CSS / inline style en JSX
- Aucune dépendance sur d'autres features en cours

### Testing Strategy

- **Visuel desktop** : Chrome, Safari, Firefox — vérifier parallax + overlays + animations d'entrée
- **Visuel mobile** : Chrome iOS, Safari iOS — vérifier que RIEN n'a changé (pas de div parallax, backgrounds solides)
- **Reduced motion** : activer dans DevTools → vérifier contenu visible sans animation, overlays + fond visibles
- **Fallback `@supports`** : tester dans un navigateur sans scroll-driven animations support → contenu visible, pas d'animation, overlays + parallax bg visibles
- **Alliance Rings** : vérifier que l'animation de convergence des alliances fonctionne toujours — le stacking context `isolation: isolate` sur les sections ne doit pas interférer
- **Snap scroll** : vérifier que le snap entre sections fonctionne toujours correctement
- **Landscape desktop** : vérifier que le scroll libre (snap-none) déclenche les animations d'entrée correctement
- **Sections conditionnelles** : tester avec `showVenue = false` et/ou `showProgram = false` — vérifier cohérence visuelle des overlays restants
- **Timeline left/right** : vérifier spécifiquement que La Rencontre (1er event, gauche) slide depuis la gauche et Les Fiançailles (2e event, droite) slide depuis la droite — pas inversé

### Notes

- Les couleurs des overlays sont calibrées pour une progression subtile — ajustement fin possible après vérification visuelle
- Risque principal : l'opacité des overlays peut nécessiter un fine-tuning pour que le fond parallax soit suffisamment visible sans nuire à la lisibilité du texte
- Le bug `items-center` sur TimelineSection a été corrigé durant le code review (suppression de `items-center` conformément à MEMORY.md)
- Les numéros de ligne référencés sont un snapshot du code actuel — ils peuvent évoluer si d'autres changements sont appliqués avant l'implémentation de cette spec
- Les sélecteurs `:nth-child` dans InfoSection sont fragiles — si des enfants sont ajoutés/réordonnés, les indices doivent être mis à jour. Un commentaire CSS explicite documente le mapping DOM actuel

## Review Notes

- Adversarial code review completed
- Findings: 1 total, 1 fixed, 0 skipped
- Resolution approach: auto-fix
- F1 (Medium/Real): `items-center` supprimé de TimelineSection — pattern interdit par MEMORY.md, bug pré-existant corrigé pendant cette implémentation
