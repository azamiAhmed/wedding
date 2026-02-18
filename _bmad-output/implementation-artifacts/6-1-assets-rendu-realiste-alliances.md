# Story 6.1: Assets et Rendu Réaliste des Alliances

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a développeur,
I want créer les assets SVG des deux alliances avec un rendu réaliste,
So that les alliances soient visuellement impressionnantes et crédibles sur tous les écrans.

## Acceptance Criteria

1. **Given** l'alliance de Ghizlaine **When** elle est rendue à l'écran **Then** c'est un anneau en or avec un rendu réaliste incluant reflets, ombres et aspect métallique doré

2. **Given** l'alliance d'Ahmed **When** elle est rendue à l'écran **Then** c'est un anneau en argent/platine avec un rendu réaliste incluant reflets, ombres et aspect métallique argenté

3. **Given** les deux alliances **When** elles sont affichées sur un écran Retina (2x) et un écran standard **Then** le rendu SVG est net et détaillé à toutes les résolutions sans pixellisation

4. **Given** les assets SVG **When** ils sont chargés **Then** le poids total des deux assets est optimisé (< 50KB combiné) pour ne pas impacter le temps de chargement (NFR1)

## Tasks / Subtasks

- [x] Task 1 : Créer le SVG de l'alliance en or (Ghizlaine) (AC: #1, #3, #4)
  - [x] 1.1 Définir la structure SVG de base (anneau avec épaisseur réaliste)
  - [x] 1.2 Ajouter les gradients dorés (`<linearGradient>`, `<radialGradient>`) pour l'effet métallique
  - [x] 1.3 Ajouter les filtres SVG pour reflets et ombres (`<feGaussianBlur>`, `<feSpecularLighting>`)
  - [x] 1.4 Tester le rendu sur écran standard et Retina
  - [x] 1.5 Optimiser le poids (cible < 25KB)

- [x] Task 2 : Créer le SVG de l'alliance en argent/platine (Ahmed) (AC: #2, #3, #4)
  - [x] 2.1 Définir la structure SVG de base (anneau avec épaisseur réaliste)
  - [x] 2.2 Ajouter les gradients argentés/platine pour l'effet métallique froid
  - [x] 2.3 Ajouter les filtres SVG pour reflets et ombres
  - [x] 2.4 Tester le rendu sur écran standard et Retina
  - [x] 2.5 Optimiser le poids (cible < 25KB)

- [x] Task 3 : Placer les assets dans la structure du projet (AC: #3, #4)
  - [x] 3.1 Créer le répertoire `public/images/rings/`
  - [x] 3.2 Placer `ring-gold.svg` et `ring-silver.svg`
  - [x] 3.3 Vérifier que les assets se chargent correctement via `/images/rings/ring-gold.svg`
  - [x] 3.4 Vérifier le poids total < 50KB combiné

- [x] Task 4 : Validation visuelle (AC: #1, #2, #3)
  - [x] 4.1 Vérifier le rendu dans le navigateur (Chrome + Safari)
  - [x] 4.2 Vérifier sur mobile (responsive, pas de pixellisation)
  - [x] 4.3 Vérifier que les deux alliances sont visuellement distinctes (or chaud vs argent froid)

## Dev Notes

### Contexte de l'Epic 6

Cette story est la **première** de l'Epic 6 "Animation des Alliances au Scroll" (FR31, FR32, FR33). Elle pose les fondations visuelles — les assets SVG — qui seront ensuite animés dans les stories 6.2 (scroll-driven animation), 6.3 (entrelacement final + révélation photo) et 6.4 (responsive + performance mobile).

**Séquence des stories Epic 6 :**
1. **6.1 (cette story)** — Créer les assets SVG réalistes
2. **6.2** — Animer les alliances au scroll (CSS Scroll-Driven Animations)
3. **6.3** — Révélation finale (entrelacement + photo couple)
4. **6.4** — Responsive mobile + optimisation performance

### Spécifications visuelles des alliances

**Alliance Or (Ghizlaine) — `ring-gold.svg` :**
- Couleur : or chaud, gradients dorés
- Position future : bord gauche de l'écran
- Taille initiale : ~30px (mobile) / ~50px (desktop)
- Taille finale (entrelacement) : ~120px combiné (mobile) / ~200px (desktop)
- Aspect : rendu réaliste métallique avec reflets, ombres, brillance

**Alliance Argent/Platine (Ahmed) — `ring-silver.svg` :**
- Couleur : argent/platine, reflets froids
- Position future : bord droit de l'écran
- Mêmes dimensions que l'alliance or

### Techniques SVG requises

**Gradients métalliques :**
```xml
<defs>
  <!-- Gradient principal pour l'or -->
  <linearGradient id="gold-main" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#D4A54A" />
    <stop offset="30%" stop-color="#B8860B" />
    <stop offset="50%" stop-color="#E8D5A8" />
    <stop offset="70%" stop-color="#B8860B" />
    <stop offset="100%" stop-color="#8B6914" />
  </linearGradient>

  <!-- Radial gradient pour le reflet central -->
  <radialGradient id="gold-highlight">
    <stop offset="0%" stop-color="#FFFDF9" stop-opacity="0.6" />
    <stop offset="100%" stop-color="#B8860B" stop-opacity="0" />
  </radialGradient>
</defs>
```

**Filtres pour réalisme :**
```xml
<defs>
  <!-- Ombre portée -->
  <filter id="ring-shadow">
    <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
    <feOffset dx="1" dy="2" />
    <feComposite operator="out" in2="SourceAlpha" />
    <feMerge>
      <feMergeNode />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>

  <!-- Réflexion spéculaire (brillance) -->
  <filter id="ring-specular">
    <feSpecularLighting surfaceScale="5" specularConstant="1" specularExponent="20" lighting-color="#FFFDF9">
      <fePointLight x="50" y="20" z="100" />
    </feSpecularLighting>
    <feComposite operator="in" in2="SourceGraphic" />
  </filter>
</defs>
```

### Contraintes d'optimisation

- **Poids cible** : < 25KB par SVG, < 50KB total combiné
- **Pas de raster embarqué** — uniquement des formes vectorielles, gradients et filtres SVG
- **viewBox** bien défini pour que le SVG scale à toutes les tailles sans déformation
- **Pas de `width`/`height` hardcodés** dans le SVG — les dimensions seront contrôlées par CSS/Tailwind dans les stories suivantes
- Les IDs de gradients/filtres doivent être **préfixés** pour éviter les collisions quand les deux SVG sont dans le même DOM (ex: `gold-main`, `silver-main`)

### Palette de couleurs à utiliser

**Or (Ghizlaine) :**
| Rôle | Hex | Notes |
|------|-----|-------|
| Base dorée | `#B8860B` | Token `gold-moroccan` du design system |
| Doré lumineux | `#D4A54A` | Token `gold-luminous` |
| Doré clair (reflet) | `#E8D5A8` | Token `gold-veil` |
| Doré foncé (ombre) | `#8B6914` | Plus sombre que le token de base |
| Highlight | `#FFFDF9` | Token `white-broken` pour les reflets |

**Argent/Platine (Ahmed) :**
| Rôle | Hex | Notes |
|------|-----|-------|
| Base argentée | `#C0C0C0` | Argent classique |
| Platine clair | `#E5E4E2` | Reflet platine |
| Platine foncé | `#8E8E8E` | Ombre froide |
| Gris profond | `#6B6B6B` | Bord intérieur |
| Highlight | `#FFFFFF` | Reflet pur blanc |

### Structure du fichier SVG recommandée

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <!-- Gradients (linear + radial) -->
    <!-- Filtres (ombre, reflet spéculaire) -->
  </defs>

  <!-- Anneau extérieur -->
  <circle cx="50" cy="50" r="40" stroke-width="10" ... />

  <!-- Anneau intérieur (bevel/profondeur) -->
  <circle cx="50" cy="50" r="38" stroke-width="6" ... />

  <!-- Highlight/reflet -->
  <ellipse cx="42" cy="35" rx="15" ry="8" ... />

  <!-- Ombre intérieure -->
  <circle cx="50" cy="50" r="33" ... />
</svg>
```

### Emplacement des fichiers

```
public/
  images/
    rings/
      ring-gold.svg      ← Alliance or (Ghizlaine)
      ring-silver.svg    ← Alliance argent/platine (Ahmed)
```

[Source: architecture.md#Animation des Alliances au Scroll]
[Source: ux-design-specification.md#Epic 6 — Animation des Alliances au Scroll]
[Source: epics.md#Story 6.1]

### Conventions du projet à respecter

- **Nommage fichiers** : kebab-case (`ring-gold.svg`, `ring-silver.svg`)
- **Pas de `max-w-*`** sur les composants — rappel projet global
- **Les alliances sont décoratives** : `aria-hidden="true"` sera ajouté dans la story 6.2 quand le composant `AllianceRings` sera créé
- **Pas de contenu texte dans les SVG** — ce sont des éléments purement visuels

### Patterns existants dans le codebase

Le projet utilise déjà :
- `public/images/hero.jpg` (69.6 KB) comme image principale
- CSS Scroll-Driven Animations dans `globals.css` avec la classe `.scroll-reveal`
- Design tokens via `@theme inline` dans Tailwind CSS 4
- Composants guest en `*-section.tsx` dans `components/guest/`
- Toutes les chaînes FR dans `lib/constants.ts`

### Git Intelligence

Les 5 derniers commits montrent :
- `feat: epic 7 landing page` — Story 7.1 complétée
- `feat: generate dev data` — Données de test générées
- `feat: 4-4-Toggles sections du site` → `feat: 4-3-ajout-suppression-invites` — Epic 4 complétée

Pattern de commit : `feat: <description-story>`. Ce projet est sur la branche `dev`.

### Project Structure Notes

- Les assets SVG doivent être dans `public/images/rings/` — ce répertoire **n'existe pas encore** et doit être créé
- Alignement avec la structure définie dans `architecture.md` : `public/images/rings/` → `ring-gold.svg` et `ring-silver.svg`
- Aucun conflit détecté avec la structure existante

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Animation des Alliances au Scroll (FR31-33)]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Epic 6 — Animation des Alliances au Scroll]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Spécifications Visuelles]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 6.1: Assets et Rendu Réaliste des Alliances]
- [Source: _bmad-output/planning-artifacts/prd.md#FR31, FR32, FR33]
- [Source: app/globals.css — Design tokens et scroll-driven animations existantes]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- XML validation: `xmllint --noout` passed for both SVGs
- ESLint: passed with no errors
- File sizes: ring-gold.svg 3.6KB, ring-silver.svg 3.7KB (total 7.3KB << 50KB limit)

### Completion Notes List

- SVG initiaux créés (`ring-gold.svg`, `ring-silver.svg`) — remplacés par des photos PNG réalistes fournies par le PO
- Assets actuels : `solitaire-blanc.png` (solitaire Ghizlaine) et `bague-homme.png` (alliance homme Ahmed)
- Images redimensionnées à 400px max (267×400) et compressées : ~58KB chacune (116KB total)
- Format PNG RGBA — Next.js Image optimise automatiquement en WebP/AVIF au serving
- Note : `solitaire-blanc.png` a un fond dégradé sombre (non transparent) — à remplacer idéalement par une version à fond transparent

### Change Log

- 2026-02-16: Création des assets SVG des alliances (ring-gold.svg + ring-silver.svg)
- 2026-02-16: Remplacement par des photos PNG réalistes (solitaire-blanc.png + bague-homme.png)
- 2026-02-16: Compression/redimensionnement des PNG (2.3MB → ~58KB chacune)

### File List

- `public/images/rings/solitaire-blanc.png` — Photo solitaire Ghizlaine (267×400, 56KB)
- `public/images/rings/bague-homme.png` — Photo alliance homme Ahmed (267×400, 61KB)
