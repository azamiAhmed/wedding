# Story 10.1: Image Open Graph — Enveloppe Fermée + Sceau A&G (Satori)

Status: done

## Story

As a invité qui reçoit le lien `/` sur WhatsApp,
I want voir un aperçu visuel avec une enveloppe dorée fermée et le titre "Ahmed & Ghizlaine — Save the Date",
So that ma curiosité est piquée et j'ai envie d'ouvrir le lien pour découvrir l'animation.

## Acceptance Criteria

1. **Given** le lien `/` est partagé sur WhatsApp (ou un réseau social) **When** la plateforme génère l'aperçu Open Graph **Then** l'image affichée est de 1200×630px et montre :
   - Fond crème `#FAF7F2`
   - Enveloppe fermée centrée avec sceau A&G visible
   - Style cohérent visuellement avec les composants `Envelope` et `SealAG` existants
2. **And** les métadonnées OG sont correctes :
   - `og:title` : "Ahmed & Ghizlaine — Save the Date"
   - `og:description` : "17 Octobre 2026 · Casablanca"
   - `og:type` : "website"
3. **And** le fichier est `app/opengraph-image.tsx` utilisant `ImageResponse` (Satori)
4. **And** le SVG est simplifié pour la compatibilité Satori (pas de `<filter>`, `<defs>`, `<feTurbulence>`) — version allégée des composants `Envelope` et `SealAG`
5. **And** la page conserve `noindex, nofollow` dans les metadata
6. **And** l'image ne révèle pas tout le contenu — l'enveloppe fermée crée la curiosité ("qu'est-ce qu'il y a dedans ?")
7. **And** `npm run lint` et `npm run build` passent sans erreur

## Tasks / Subtasks

- [x] Task 1: Créer `app/opengraph-image.tsx` (AC: #1, #3, #4, #6)
  - [x] 1.1: Créer le fichier avec `export const runtime = 'nodejs'`, `export const alt`, `export const size = { width: 1200, height: 630 }`, `export const contentType = 'image/png'`
  - [x] 1.2: Charger la police Cormorant Garamond (poids 300) depuis Google Fonts — même pattern que `app/(guest)/invite/[slug]/opengraph-image.tsx`
  - [x] 1.3: Dessiner le fond crème `#FAF7F2` plein cadre
  - [x] 1.4: Dessiner l'enveloppe fermée centrée — SVG simplifié (rect + lignes de pli, SANS `<filter>`, `<defs>`, `<feTurbulence>`, `<feColorMatrix>`, `<feBlend>`)
  - [x] 1.5: Dessiner le rabat triangulaire fermé (polygon) au-dessus de l'enveloppe
  - [x] 1.6: Dessiner le sceau A&G — SVG simplifié (cercles + lignes + monogramme A&G en `<path>`, SANS opacités trop fines)
  - [x] 1.7: Ajouter le texte "Save the Date" en Cormorant sous l'enveloppe (optionnel — uniquement si ça renforce l'aperçu)
  - [x] 1.8: Utiliser `SAVE_THE_DATE_OG` de `lib/constants.ts` pour le `alt`
- [x] Task 2: Ajouter les métadonnées OG à `app/page.tsx` (AC: #2, #5)
  - [x] 2.1: Importer `SAVE_THE_DATE_OG` depuis `@/lib/constants`
  - [x] 2.2: Ajouter `openGraph: { title, description, type: 'website' }` au metadata existant
  - [x] 2.3: Vérifier que `robots: { index: false, follow: false }` est conservé
- [x] Task 3: Validation build + lint (AC: #7)
  - [x] 3.1: `npm run lint` sans erreur
  - [x] 3.2: `npm run build` sans erreur
  - [x] 3.3: Vérifier dans le build output que `app/opengraph-image.tsx` est reconnu (route `ƒ /opengraph-image`)

## Dev Notes

### Pattern existant — Référence absolue

Le fichier `app/(guest)/invite/[slug]/opengraph-image.tsx` est le modèle à suivre. Pattern confirmé :

```tsx
import { ImageResponse } from 'next/og'
import { SAVE_THE_DATE_OG } from '@/lib/constants'

export const runtime = 'nodejs'
export const alt = SAVE_THE_DATE_OG.title
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const cormorantFont = await fetch(
    new URL(
      'https://fonts.gstatic.com/s/cormorantgaramond/v16/co3YmX5slCNuHLi8bLeY9MK7whWMhyjQEl5fuY.woff2'
    )
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    ( /* JSX inline styles only — Satori ne supporte PAS les classes Tailwind */ ),
    {
      ...size,
      fonts: [{ name: 'Cormorant', data: cormorantFont, style: 'normal', weight: 300 }],
    }
  )
}
```

### Satori — Limitations critiques

| Fonctionnalité | Supporté ? | Impact |
|---------------|-----------|--------|
| `<rect>`, `<circle>`, `<line>`, `<path>`, `<polygon>` | ✅ Oui | Tous les éléments de base de l'enveloppe et du sceau |
| `<filter>`, `<feTurbulence>`, `<feColorMatrix>`, `<feBlend>` | ❌ Non | Le grain de l'enveloppe (`envelope-grain`) doit être supprimé |
| `<defs>` | ❌ Non | Pas de définitions SVG réutilisables |
| `<text>` | ❌ Non | Le texte doit être rendu en JSX Satori, pas en SVG `<text>` |
| `opacity` (attribut SVG) | ✅ Oui | Utilisable sur les éléments SVG |
| `stroke`, `fill`, `strokeWidth` | ✅ Oui | Styling SVG standard |
| `strokeLinecap`, `strokeLinejoin` | ✅ Oui | Détails fins du sceau |
| CSS classes / Tailwind | ❌ Non | Tout en `style={{}}` inline |
| `display: 'flex'` | ✅ Requis | Sur la plupart des conteneurs Satori |

### SVG simplifié de l'enveloppe — Ce qui change vs `envelope.tsx`

L'enveloppe OG est une **version allégée** de `components/save-the-date/envelope.tsx` :

| Aspect | `envelope.tsx` (animation) | `opengraph-image.tsx` (Satori) |
|--------|---------------------------|-------------------------------|
| `<filter id="envelope-grain">` | ✅ Présent (grain texture) | ❌ Supprimé — Satori ne supporte pas |
| `filter="url(#envelope-grain)"` sur `<rect>` | ✅ Présent | ❌ Supprimé — pas de grain |
| Lignes de pli (`<line>`) | ✅ Présentes | ✅ Conservées (simplifiées si besoin) |
| Rabat triangulaire (`<polygon>`) | ✅ Séparé (div animé) | ✅ Inline dans le même `<svg>` (pas d'animation) |
| Sceau A&G | ✅ Composant séparé `<SealAG>` | ✅ Inline dans le même `<svg>` ou SVG séparé positionné par-dessus |
| Taille | Responsive (h-28/h-44/h-[200px]) | Fixe (ex: 240×160px proportionnel dans 1200×630) |

### SVG simplifié du sceau — Ce qui change vs `seal-ag.tsx`

Le sceau OG reprend les éléments essentiels de `components/save-the-date/seal-ag.tsx` :

| Aspect | `seal-ag.tsx` (animation) | `opengraph-image.tsx` (Satori) |
|--------|--------------------------|-------------------------------|
| Cercle extérieur doré | ✅ `<circle>` | ✅ Conservé |
| Cercle intérieur | ✅ `<circle>` opacity 0.5 | ✅ Conservé (augmenter opacity si besoin pour visibilité OG) |
| Lignes cardinales/diagonales | ✅ `<line>` opacity 0.7 | ✅ Conserver les principales, simplifier si trop |
| Motifs étoiles (`<path>`) | ✅ 8 paths opacity 0.5-0.6 | ⚠️ Garder 4 principaux si trop de bruit à 1200×630 |
| Monogramme A&G (`<path>`) | ✅ 3 paths stroke | ✅ Conservé tel quel — c'est le centre d'attention |

### Composition OG — Layout

```
┌─────────────────────────────────────────────┐ 1200×630
│                                             │
│              #FAF7F2 fond crème             │
│                                             │
│         ┌──────────────────────┐            │
│         │  Enveloppe fermée    │            │
│         │  (rect + lignes pli) │            │
│         │    ┌────┐            │            │
│         │    │A&G │ sceau      │            │
│         │    └────┘            │            │
│         │  rabat △ fermé       │            │
│         └──────────────────────┘            │
│                                             │
│        "Ahmed & Ghizlaine" (optionnel)      │
│          "Save the Date" (optionnel)        │
│                                             │
└─────────────────────────────────────────────┘
```

**Note :** L'image OG doit fonctionner SANS texte. Le titre ("Ahmed & Ghizlaine — Save the Date") et la description ("17 Octobre 2026 · Casablanca") sont dans les métadonnées OG — WhatsApp les affiche séparément sous l'image. Si on ajoute du texte sur l'image, c'est un bonus esthétique, pas une nécessité informationnelle.

### Constantes déjà prêtes

`lib/constants.ts` contient déjà :

```ts
export const SAVE_THE_DATE_OG = {
  title: 'Ahmed & Ghizlaine \u2014 Save the Date',    // em dash
  description: '17 Octobre 2026 \u00b7 Casablanca',   // middle dot
} as const
```

### Métadonnées OG dans `page.tsx`

Ajouter au metadata existant :

```tsx
import { SAVE_THE_DATE_OG } from '@/lib/constants'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  openGraph: {
    title: SAVE_THE_DATE_OG.title,
    description: SAVE_THE_DATE_OG.description,
    type: 'website',
  },
}
```

L'image OG est automatiquement détectée par Next.js via le fichier `app/opengraph-image.tsx` — pas besoin de spécifier `images` dans le metadata.

### Couleurs de référence

| Rôle | Hex | Usage OG |
|------|-----|----------|
| Fond | `#FAF7F2` | Background plein cadre |
| Enveloppe surface | `#FFFDF9` | rect fill |
| Enveloppe bordure | `#D4A54A` | rect stroke, polygon stroke |
| Enveloppe plis | `#E8D5A8` | line stroke (opacity 0.3-0.4) |
| Sceau cercle | `#B8860B` | circle stroke, path stroke monogramme |
| Sceau détails | `#D4A54A` | line/path stroke entrelacs |

### Ne PAS faire

- **Ne PAS** réutiliser directement les composants `Envelope` ou `SealAG` — Satori ne supporte pas les composants React avec des `<filter>`, `<defs>`, ni le positionnement CSS avancé
- **Ne PAS** utiliser de classes Tailwind — tout en `style={{}}` inline
- **Ne PAS** utiliser `<text>` dans les SVG — texte en JSX Satori uniquement
- **Ne PAS** utiliser `<filter>`, `<defs>`, `<feTurbulence>` dans les SVG
- **Ne PAS** charger l'image `arriere-plan.avif` comme fond — AVIF n'est pas supporté par Satori, et l'OG doit être simple (fond crème uni)
- **Ne PAS** mettre de `max-w-*` sur quoi que ce soit
- **Ne PAS** oublier `display: 'flex'` sur les conteneurs Satori (obligatoire)
- **Ne PAS** ajouter le contenu textuel complet (date, lieu, message) sur l'image — l'enveloppe FERMÉE crée la curiosité

### Conventions projet — Rappels

| Convention | Règle |
|-----------|-------|
| Constantes | Importer de `@/lib/constants` — `SAVE_THE_DATE_OG` |
| Font loading | Même pattern que l'OG existant (`fetch` + `res.arrayBuffer()`) |
| Runtime | `export const runtime = 'nodejs'` |
| Dimensions | 1200×630 standard OG |

### Project Structure Notes

```
app/
  page.tsx                             ← MODIFIÉ (ajout openGraph metadata)
  opengraph-image.tsx                  ← NOUVEAU (image OG Satori)

lib/
  constants.ts                         ← INCHANGÉ (SAVE_THE_DATE_OG déjà présent)

components/save-the-date/
  envelope.tsx                         ← RÉFÉRENCE VISUELLE (pas importé directement)
  seal-ag.tsx                          ← RÉFÉRENCE VISUELLE (pas importé directement)
```

### References

- [Source: _bmad-output/planning-artifacts/epics-save-the-date.md#Story 3.1]
- [Source: _bmad-output/planning-artifacts/architecture-save-the-date.md#Open Graph]
- [Source: _bmad-output/planning-artifacts/ux-design-save-the-date.md#Pattern Open Graph]
- [Source: _bmad-output/planning-artifacts/ux-design-save-the-date.md#Parcours Open Graph]
- [Source: app/(guest)/invite/[slug]/opengraph-image.tsx — pattern existant]
- [Source: components/save-the-date/envelope.tsx — SVG référence enveloppe]
- [Source: components/save-the-date/seal-ag.tsx — SVG référence sceau A&G]
- [Source: lib/constants.ts — SAVE_THE_DATE_OG constantes]

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Debug Log References
- Build failure fix: `Error: Unsupported OpenType signature <!DO` — Google Fonts v16 URL returns 404 (obsolete). Fixed by bundling font locally as TTF.
- Satori ne supporte pas WOFF2 (`Unsupported OpenType signature wOF2`) — seul TTF/OTF/WOFF supporté.

### Completion Notes List
- Envelope SVG simplified: removed `<filter>`, `<defs>`, `<feTurbulence>` (Satori incompatible). Kept rect + fold lines + flap polygon.
- Seal A&G SVG simplified: kept circles, cardinal/diagonal lines, cardinal diamond motifs (diagonal omitted for OG clarity). Opacity +0.1 vs seal-ag.tsx for OG visibility.
- Police Cormorant Garamond bundlée localement (`public/fonts/cormorant-garamond-light.ttf`) au lieu de fetch Google Fonts runtime.
- Route `/opengraph-image` prerendered statiquement (`○ Static`) — zéro coût runtime.
- Code review: corrigé URL police 404 (v16→v21), format WOFF2→TTF, suppression `force-dynamic`, ajout commentaires sceau.
- `npm run lint` ✅ | `npm run build` ✅ | Route: `○ /opengraph-image` (Static)

### File List
- `app/opengraph-image.tsx` — NEW (Satori OG image: envelope + seal A&G + "Save the Date")
- `app/page.tsx` — MODIFIED (added `openGraph` metadata + `SAVE_THE_DATE_OG` import)
- `public/fonts/cormorant-garamond-light.ttf` — NEW (bundled font for Satori)
- `app/(guest)/invite/[slug]/opengraph-image.tsx` — MODIFIED (font: fetch→readFileSync local TTF)
