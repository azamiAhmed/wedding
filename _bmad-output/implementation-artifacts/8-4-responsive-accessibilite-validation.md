# Story 8.4: Responsive & Accessibilité — Validation Complète

Status: done

## Story

As a invité sur mobile ou desktop,
I want que la page s'affiche parfaitement sur tous les écrans de 360px à 1920px,
So that l'expérience est élégante quelle que soit la taille de mon écran.

## Acceptance Criteria

1. **Given** un visiteur accède à la page `/` sur un appareil mobile (360px) **When** la page se charge **Then** le contenu est lisible, le cadre doré est visible, les tailles typographiques sont adaptées (48px prénoms, 36px date, 28px lieu, 18px message) **And** les marges latérales sont `px-6`
2. **Given** un visiteur accède à la page `/` sur un écran desktop (1440px) **When** la page se charge **Then** les tailles typographiques sont agrandies (80px prénoms, 56px date, 40px lieu, 18px message) **And** les marges latérales sont `px-8` **And** le cadre doré a des marges plus généreuses (~48px)
3. **Given** un visiteur a activé `prefers-reduced-motion` **When** la page se charge **Then** le contenu textuel est affiché directement sans animation **And** le cadre doré est visible **And** le séparateur doré est visible **And** aucun pigeon, enveloppe ou sceau n'est affiché (FR-STD-8)
4. **Given** un lecteur d'écran (VoiceOver) lit la page **When** le contenu est lu **Then** l'ordre de lecture est : "Ahmed & Ghizlaine" → "17 Octobre 2026" → "Casablanca" → "Une date à retenir…" **And** les éléments décoratifs (cadre, séparateur) sont ignorés (`aria-hidden`)
5. **And** Lighthouse Performance > 85 sur mobile (NFR-4)
6. **And** Lighthouse Accessibility ≥ 95

## Tasks / Subtasks

- [x] Task 1: Vérifier le comportement responsive sur tous les breakpoints (AC: #1, #2)
  - [x] 1.1: Vérifier les tailles `clamp()` aux points cibles — 360px, 640px, 768px, 1024px, 1440px
  - [x] 1.2: Valider que `clamp(3rem,5vw+1rem,5rem)` produit ~48px à 360px et ~80px à 1440px
  - [x] 1.3: Valider que `clamp(2.25rem,3.5vw+0.75rem,3.5rem)` produit ~36px à 360px et ~56px à 1440px
  - [x] 1.4: Valider que `clamp(1.75rem,2.5vw+0.5rem,2.5rem)` produit ~28px à 360px et ~40px à 1440px
  - [x] 1.5: Vérifier le cadre doré : `w-[85%]` mobile / `w-[70%]` desktop, `min-h-[80dvh]`
  - [x] 1.6: Vérifier les coins arabesques SVG : `h-6 w-6` → `sm:h-8 sm:w-8` → `lg:h-10 lg:w-10`
  - [x] 1.7: Vérifier les marges latérales : `px-6` (24px) mobile, `sm:px-8` (32px) desktop
  - [x] 1.8: Si les valeurs `clamp()` ne correspondent pas aux cibles → ajuster les formules
- [x] Task 2: Vérifier `prefers-reduced-motion` (AC: #3)
  - [x] 2.1: Confirmer qu'aucune animation CSS n'affecte la page Save the Date actuellement (page statique)
  - [x] 2.2: Confirmer que le contenu textuel est affiché directement (pas d'`opacity: 0`)
  - [x] 2.3: Confirmer que le cadre doré et le séparateur sont visibles
  - [x] 2.4: Confirmer qu'aucun composant pigeon/enveloppe/sceau n'existe sur la page (ils seront ajoutés dans Epic 9)
- [x] Task 3: Vérifier l'accessibilité du lecteur d'écran (AC: #4)
  - [x] 3.1: Vérifier l'ordre DOM : `h1` → `time` → `address` → `[separator aria-hidden]` → `blockquote`
  - [x] 3.2: Vérifier que les SVG `CornerArabesque` ont `aria-hidden="true"`
  - [x] 3.3: Vérifier que `GoldenSeparator` a `aria-hidden="true"`
  - [x] 3.4: Vérifier que le `<main>` landmark est présent
  - [x] 3.5: Vérifier que `lang="fr"` est sur le `<html>` (ou que le layout global le définit)
  - [x] 3.6: Si `lang="fr"` manque → l'ajouter dans `app/layout.tsx`
- [x] Task 4: Auditer Lighthouse Performance et Accessibility (AC: #5, #6)
  - [x] 4.1: Lancer `npm run build` pour vérifier la build production
  - [x] 4.2: Analyser la page en production mode : vérifier que `/` est pré-rendue en statique (Server Component pur)
  - [x] 4.3: Vérifier le poids total de la page (HTML + CSS + fonts) — confirmer < 150 Ko assets SVG
  - [x] 4.4: Vérifier qu'aucun JS client n'est chargé pour la page `/` (zéro `"use client"`)
  - [x] 4.5: Documenter les résultats attendus (la page est ultra-légère : Server Component pur, zéro JS, contenu statique)
- [x] Task 5: Corriger les éventuels problèmes détectés
  - [x] 5.1: Corriger les tailles `clamp()` si les valeurs aux breakpoints cibles sont incorrectes
  - [x] 5.2: Corriger `lang="fr"` si manquant
  - [x] 5.3: Corriger tout problème d'accessibilité détecté
- [x] Task 6: Vérifier `npm run build` et `npm run lint` sans erreur

## Dev Notes

### CRITIQUE : Cette story est une story de VALIDATION, pas d'implémentation

L'implémentation responsive et accessible a déjà été faite dans les Stories 8.1, 8.2, 8.3. Cette story valide que tout fonctionne correctement ensemble et corrige les éventuels problèmes.

**Ce qui existe déjà :**
- `clamp()` typographie fluide (Story 8.2) — `clamp(3rem,5vw+1rem,5rem)` etc.
- Cadre doré responsive `w-[85%] lg:w-[70%]` (Story 8.3)
- Coins SVG responsive `h-6 sm:h-8 lg:h-10` (Story 8.3)
- HTML sémantique `h1/time/address/blockquote` (Story 8.2)
- `aria-hidden="true"` sur décoratifs (Stories 8.2 + 8.3)
- Server Component pur (toutes stories)
- `min-h-dvh` (Story 8.1)

**Ce qui pourrait nécessiter des corrections :**
1. Les valeurs `clamp()` pourraient ne pas atteindre exactement les cibles 48px/36px/28px à 360px
2. `lang="fr"` pourrait manquer sur `<html>`
3. Lighthouse pourrait signaler des issues mineures

### Vérification des formules `clamp()` — Calculs mathématiques

**h1 prénoms : `clamp(3rem,5vw+1rem,5rem)`**
- À 360px : `5vw = 18px`, `18 + 16 = 34px` → Valeur plancher `3rem = 48px` s'applique ✅ (48px = cible mobile)
- À 1440px : `5vw = 72px`, `72 + 16 = 88px` → Valeur plafond `5rem = 80px` s'applique ✅ (80px = cible desktop)

**time date : `clamp(2.25rem,3.5vw+0.75rem,3.5rem)`**
- À 360px : `3.5vw = 12.6px`, `12.6 + 12 = 24.6px` → Valeur plancher `2.25rem = 36px` s'applique ✅ (36px = cible mobile)
- À 1440px : `3.5vw = 50.4px`, `50.4 + 12 = 62.4px` → Valeur plafond `3.5rem = 56px` s'applique ✅ (56px = cible desktop)

**address lieu : `clamp(1.75rem,2.5vw+0.5rem,2.5rem)`**
- À 360px : `2.5vw = 9px`, `9 + 8 = 17px` → Valeur plancher `1.75rem = 28px` s'applique ✅ (28px = cible mobile)
- À 1440px : `2.5vw = 36px`, `36 + 8 = 44px` → Valeur plafond `2.5rem = 40px` s'applique ✅ (40px = cible desktop)

**Conclusion :** Les formules `clamp()` sont mathématiquement correctes. Le `min` (premier argument en `rem`) produit exactement la taille mobile cible, et le `max` (troisième argument en `rem`) produit exactement la taille desktop cible. Les valeurs intermédiaires (`vw+rem`) assurent le scaling fluide entre les breakpoints.

**Note :** Les calculs ci-dessus utilisent `1rem = 16px` (browser default). Si le `font-size` root est modifié, les valeurs changent. Vérifier que `app/layout.tsx` ne modifie pas le `font-size` root.

### Vérification `lang="fr"` — Potentiel problème

Le `<html>` doit avoir `lang="fr"` pour l'accessibilité. Dans Next.js App Router, cela se configure dans `app/layout.tsx` :

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable}`}>
      ...
    </html>
  )
}
```

**Vérifier si c'est `lang="en"` ou `lang="fr"` actuellement.** Si c'est `"en"`, changer en `"fr"` — le site est entièrement en français.

### Vérification `prefers-reduced-motion` — Non-problème pour l'instant

La page Save the Date actuelle (post-Epic 8) est **100% statique** :
- Aucune animation CSS sur le contenu textuel (pas de `text-reveal`, pas de `opacity: 0`)
- Aucune animation sur le cadre doré (statique)
- Le séparateur est statique
- Pas de pigeon, pas d'enveloppe, pas de sceau (Epic 9)

Le comportement `prefers-reduced-motion` est automatiquement correct : le contenu est visible par défaut, le cadre est visible, rien n'est animé. Cette validation est un "sanity check" avant que Epic 9 ajoute les animations.

### Lighthouse — Attentes

| Métrique | Attente | Raison |
|----------|---------|--------|
| Performance | > 90 | Server Component pur, zéro JS client, page statique pré-rendue |
| Accessibility | ≥ 95 | HTML sémantique, `aria-hidden` sur décoratifs, bon contraste |
| Best Practices | > 90 | HTTPS, pas de `console.log`, pas de JS deprecated |
| SEO | ~85-90 | `noindex, nofollow` peut réduire le score SEO (intentionnel) |

**Note :** On ne peut pas exécuter Lighthouse directement depuis la CLI dans ce contexte. La validation est manuelle (l'utilisateur lance Lighthouse dans Chrome DevTools). Le dev agent vérifie les prérequis côté code.

### Poids de la page — Budget SVG

| Élément | Taille estimée |
|---------|---------------|
| 4 × CornerArabesque SVG | ~800 octets |
| HTML contenu textuel | ~300 octets |
| CSS globals (partagé) | Inclus dans le bundle Tailwind |
| Fonts Cormorant Garamond | ~30 Ko (woff2 via next/font CDN, cached) |
| Fonts Geist Sans | ~25 Ko (déjà cached) |

**Total assets SVG Save the Date : ~800 octets** — largement sous le budget 150 Ko (NFR-2).

### Previous Story Intelligence (8.1 + 8.2 + 8.3)

- Story 8.1 : `font-display` → Cormorant Garamond fonctionne via `--font-cormorant`. Tokens animation définis dans `globals.css`.
- Story 8.2 : `clamp()` typographie validée. HTML sémantique (`h1`, `time`, `address`, `blockquote`). Layout `text-center` + `mx-auto`. Build + lint passent.
- Story 8.3 : `GoldenFrame` avec `border border-gold-moroccan`, 4 coins SVG arabesques. Bug `aria-hidden` corrigé (retiré du div englobant). Build + lint passent.
- Code review 8.3 : 0 HIGH, 0 MEDIUM, 3 LOW (viewBox oversized, hardcoded color, redundant fill). Tous acceptés.

### Fichiers à vérifier (PAS à créer)

- `app/page.tsx` — structure d'assemblage
- `app/layout.tsx` — `lang` attribute, font loading
- `components/save-the-date/golden-frame.tsx` — responsive, aria-hidden
- `components/save-the-date/save-the-date-content.tsx` — clamp(), sémantique, aria
- `components/save-the-date/golden-separator.tsx` — aria-hidden
- `app/globals.css` — tokens, pas d'animation qui affecte la page

### Project Structure Notes

- Aucun fichier nouveau attendu (story de validation)
- Potentielle modification de `app/layout.tsx` si `lang="fr"` manque
- Potentielle modification de `save-the-date-content.tsx` si `clamp()` incorrect

### Architecture Compliance

| Règle | Vérification |
|-------|-------------|
| Server Component pur | Vérifier qu'aucun `"use client"` n'a été ajouté |
| `min-h-dvh` pas `min-h-screen` | Vérifier sur `<main>` |
| Pas de `max-w-*` | Vérifier sur tous les composants |
| Pas de `items-center` sur flex-col texte | Vérifier sur `SaveTheDateContent` |
| `aria-hidden="true"` sur décoratifs | Vérifier SVG coins + séparateur |
| `lang="fr"` sur `<html>` | Vérifier dans `layout.tsx` |
| Progressive enhancement | Contenu visible `opacity: 1` par défaut |

### Anti-Patterns à ÉVITER

- **Ne PAS** ajouter de tests automatisés (pas de test framework dans le projet)
- **Ne PAS** ajouter de commentaires/documentation au code existant (sauf si correction nécessaire)
- **Ne PAS** refactorer du code fonctionnel (story de validation, pas de refactoring)
- **Ne PAS** ajouter `"use client"` pour exécuter Lighthouse programmatiquement
- **Ne PAS** modifier les tailles `clamp()` si les calculs mathématiques sont corrects

### References

- [Source: _bmad-output/planning-artifacts/epics-save-the-date.md#Story 1.4]
- [Source: _bmad-output/planning-artifacts/architecture-save-the-date.md#Responsive Design]
- [Source: _bmad-output/planning-artifacts/ux-design-save-the-date.md#Responsive Design & Accessibilité]
- [Source: _bmad-output/planning-artifacts/ux-design-save-the-date.md#Stratégie d'Accessibilité]
- [Source: _bmad-output/implementation-artifacts/8-2-contenu-save-the-date-html-semantique.md#Completion Notes]
- [Source: _bmad-output/implementation-artifacts/8-3-cadre-dore-svg-decoratif.md#Completion Notes]
- [Source: app/page.tsx (current assembly)]
- [Source: app/layout.tsx (font loading, lang attribute)]
- [Source: app/globals.css (tokens, reduced-motion rules)]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

Aucun problème rencontré. Tous les checks ont passé sans correction nécessaire.

### Completion Notes List

- Task 1 : Responsive validé. Formules `clamp()` mathématiquement correctes — produisent exactement 48px/36px/28px à 360px (min) et 80px/56px/40px à 1440px (max). Cadre `w-[85%] lg:w-[70%]` + `min-h-[80dvh]` ✅. Coins SVG responsive `h-6/h-8/h-10` ✅. Marges `px-6 sm:px-8` ✅. Aucune correction nécessaire.
- Task 2 : `prefers-reduced-motion` automatiquement correct — page 100% statique, aucune animation CSS, aucun `opacity: 0`, pas de pigeon/enveloppe/sceau sur la page. Validation = sanity check avant Epic 9.
- Task 3 : Accessibilité lecteur d'écran validée. Ordre DOM correct : `h1` → `time` → `address` → `[separator aria-hidden]` → `blockquote`. SVG `CornerArabesque` et `GoldenSeparator` ont `aria-hidden="true"`. `<main>` landmark présent. `lang="fr"` présent sur `<html>` dans `layout.tsx`.
- Task 4 : Lighthouse prérequis validés. Build production OK, `/` est statique (○ Static), zéro `"use client"` dans save-the-date/, assets SVG ~800 octets (largement sous 150 Ko). Scores attendus : Performance > 90, Accessibility ≥ 95.
- Task 5 : Aucune correction nécessaire — tous les checks ont passé.
- Task 6 : `npm run lint` et `npm run build` passent sans erreur.

### File List

Aucun fichier modifié (story de validation uniquement).
