---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: 'complete'
completedAt: '2026-02-13'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
workflowType: 'architecture'
project_name: 'wedding'
user_name: 'Mister azami'
date: '2026-02-13'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Vue d'Ensemble des Exigences

**Exigences Fonctionnelles (33 FRs) :**

| Catégorie | FRs | Implication architecturale |
|-----------|-----|---------------------------|
| Accueil & Visuel (FR1-3) | Landing émotionnel, scroll animations, responsive | Composants frontend custom, CSS Scroll-Driven Animations, optimisation images |
| Contenu & Narration (FR4-6) | Timeline, sections conditionnelles (Lieu, Programme) | Config sections en DB, rendu conditionnel côté serveur |
| Liens Uniques (FR7-10) | Lien unique par invité, identification, page d'erreur | Routing dynamique `/invite/[slug]`, lookup DB, page 404 élégante |
| RSVP (FR11-19) | Bouton flottant, overlay, stepper, confirmer/décliner, modification | API RSVP (GET/PUT), état persisté, composants interactifs |
| Partage (FR20) | Open Graph WhatsApp | Métadonnées OG dynamiques par invité |
| Admin Invités (FR21-26) | Login, CRUD, statuts, modification manuelle | API admin protégée, auth simple, endpoints CRUD |
| Admin Config (FR27-28) | Toggles sections | API config, persistance état sections |
| Contenu (FR29) | Contenu dans le code | Pas de CMS, contenu hardcodé |
| Animation Alliances (FR31-33) | Deux alliances animées au scroll, entrelacement final, révélation photo | CSS Scroll-Driven Animations, assets SVG réalistes, scroll-progress tracking, optimisation mobile |
| Landing Page (FR34) | Page placeholder pour visiteurs non-invités | Route `/` publique, noindex/nofollow, pas d'auth |

**Exigences Non-Fonctionnelles :**

| Catégorie | Contrainte | Impact architecture |
|-----------|-----------|---------------------|
| Performance | LCP < 2.5s, 60fps, Lighthouse > 85 | SSR pour le premier rendu, images optimisées, CSS natif pour animations |
| Sécurité | Liens non-devinables, admin protégé, HTTPS | Slugs aléatoires (nanoid/uuid), rate limiting login, Vercel HTTPS |
| Fiabilité | 99% uptime, pas de perte RSVP | Vercel infra, DB managée avec backups |
| Accessibilité | WCAG 2.1 AA | Radix UI primitives (shadcn/ui), sémantique HTML |
| Technique | Next.js 16, Vercel, pas de service payant | Stack contrainte et claire |

### Échelle & Complexité

- **Domaine** : Full-stack web (Next.js SSR + API + DB)
- **Complexité** : Basse — modèle de données trivial (~200 lignes), pas d'intégration tierce, pas de temps réel
- **Composants architecturaux estimés** : ~6 (routing invité, API RSVP, API admin, auth admin, config sections, optimisation images)

### Contraintes Techniques & Dépendances

| Contrainte | Source | Impact |
|-----------|--------|--------|
| Next.js 16 + App Router | PRD | Architecture basée sur Server Components, API Route Handlers |
| Vercel hosting | PRD | Serverless functions, edge network, pas de long-running processes |
| DB compatible Vercel | PRD | Vercel Postgres, Neon, Supabase, ou PlanetScale |
| Pas de services payants | PRD | Exclut les solutions premium (Auth0, Algolia, etc.) |
| Dev solo | PRD | Architecture simple, pas de microservices, monorepo |
| Contenu dans le code | PRD FR29 | Pas de CMS, déploiement pour chaque changement de contenu |

### Préoccupations Transversales

1. **Sécurité des liens uniques** — Les slugs doivent être non-devinables (pas d'incrémentation) mais courts pour WhatsApp
2. **Optimisation images** — Critical pour la performance mobile (hero photo = LCP)
3. **Deux expériences UI** — Layouts séparés invité/admin, mais base de code partagée
4. **Open Graph dynamique** — Chaque lien unique doit générer ses propres meta OG
5. **Gestion d'état RSVP** — L'invité revient sur son lien, sa réponse est déjà là → nécessite un GET avant le formulaire

## Starter Template Evaluation

### Domaine Technologique

**Full-stack web** — Next.js avec Server Components, API Route Handlers, et base de données managée.

### Starter Existant : `create-next-app`

Le projet a été initialisé avec `npx create-next-app@latest`. Décisions fournies par le starter :

| Décision | Valeur | Version |
|----------|--------|---------|
| Framework | Next.js 16 App Router | 16.1.6 (latest stable) |
| Runtime | React 19 | 19.2.3 (latest stable : 19.2.4) |
| Langage | TypeScript 5, mode strict | ^5 |
| Styling | Tailwind CSS 4 via `@tailwindcss/postcss` | ^4 (latest : 4.1.18) |
| Linting | ESLint 9 flat config + `core-web-vitals` + `typescript` | ^9 |
| Build | Turbopack (stable dans Next.js 16) | intégré |
| Path alias | `@/*` → racine projet | tsconfig.json |
| Structure | `app/` router, `public/` assets | standard Next.js |

**Verdict** : Le starter est à jour et aligné avec toutes les contraintes du PRD. Aucun changement nécessaire.

### Décisions Complémentaires (hors starter)

| Besoin | Choix | Rationale |
|--------|-------|-----------|
| **ORM** | Drizzle ORM 0.45.1 | Edge-native, zéro codegen, cold start <500ms, bundle 90% plus petit que Prisma. Idéal pour serverless Vercel. |
| **Base de données** | Neon (via Vercel Postgres) | Free tier (0.5 GB, 100 CU-h/mois), intégration native Vercel, driver serverless `@neondatabase/serverless`. Suffisant pour ~200 invités. |
| **Composants UI** | shadcn/ui 3.8.4 | Compatible Next.js 16, Tailwind CSS 4, React 19. Composants copiés dans le projet (Radix UI). |
| **Slugs uniques** | nanoid 5.1.6 | 118 bytes, URL-friendly, longueur configurable. Parfait pour liens courts WhatsApp. |
| **Animations** | Motion 12.34.0 | Ex-Framer Motion. Seulement pour micro-interactions si CSS Scroll-Driven Animations insuffisant. |
| **Polices** | Cormorant Garamond + Geist Sans | Via `next/font/google`, supporté nativement. |

### Commandes d'Initialisation Complémentaires

```bash
# shadcn/ui
npx shadcn@latest init

# Base de données + ORM
npm i drizzle-orm @neondatabase/serverless
npm i -D drizzle-kit

# Slugs uniques
npm i nanoid

# Animations micro-interactions (si nécessaire)
npm i motion
```

**Note :** L'initialisation du projet et l'installation des dépendances complémentaires sera la première story d'implémentation.

## Core Architectural Decisions

### Analyse de Priorité des Décisions

**Décisions Critiques (bloquent l'implémentation) :**
- Schéma de données (tables, relations, types)
- Authentification admin (méthode, session, sécurité)
- Structure API (endpoints, validation, erreurs)

**Décisions Importantes (façonnent l'architecture) :**
- Stratégie de rendu (SSR dynamique vs ISR)
- Organisation des composants (guest/ vs admin/ vs ui/)
- Optimisation images (LCP hero)

**Décisions Différées (post-MVP) :**
- Monitoring avancé (Sentry, etc.)
- Analytics détaillés
- Tests E2E (Playwright)

### Data Architecture

**Modèle de données — 3 tables :**

| Table | Colonnes | Rôle |
|-------|----------|------|
| `guests` | id (serial PK), slug (varchar unique, nanoid 10 chars), first_name, last_name, group_name (nullable), max_persons (int, default 1), status (enum: pending/confirmed/declined), persons_confirmed (int, default 0), created_at, updated_at | Invité + RSVP combinés |
| `site_config` | id (serial PK), key (varchar unique), value (varchar), updated_at | Toggles sections (show_venue, show_program) |
| `admin_sessions` | id (serial PK), token (varchar unique, nanoid), expires_at (timestamp) | Sessions admin |

**Validation** — Zod pour la validation des inputs API. Schemas partagés entre frontend et API dans `lib/schemas/`.

**Migrations** — Drizzle Kit : `drizzle-kit push` pour dev, `drizzle-kit migrate` pour prod. Schéma défini en TypeScript.

**Cache** — Next.js built-in (`unstable_cache` / `revalidateTag`). Pas de Redis — ~200 invités ne le justifient pas.

### Authentication & Security

**Auth admin** — Mot de passe simple en variable d'environnement (`ADMIN_PASSWORD`).
- Vérification bcrypt du mot de passe soumis
- Génération d'un token de session (nanoid) stocké dans `admin_sessions`
- Cookie HttpOnly `admin_token` avec expiration 24h
- Pas de JWT, pas de bibliothèque auth externe

**Rate limiting** — Middleware Next.js avec compteur en mémoire (Map) sur `/api/admin/login`. Reset au cold start serverless — acceptable pour ce cas d'usage.

**Slugs invités** — nanoid, alphabet custom (lowercase + chiffres, sans caractères ambigus `0oOlLiI1`), longueur 10 caractères. ~10^15 combinaisons → impossible à deviner, court pour WhatsApp. Format : `/invite/ah3kx9m2p7`.

### API & Communication Patterns

**Design** — REST via Next.js Route Handlers (`app/api/`).

**Structure des endpoints :**

```
app/api/
  invite/[slug]/route.ts       → GET (données invité + statut RSVP)
  invite/[slug]/rsvp/route.ts  → PUT (soumettre/modifier RSVP)
  admin/login/route.ts         → POST (connexion admin)
  admin/guests/route.ts        → GET (liste invités), POST (créer invité)
  admin/guests/[id]/route.ts   → PUT (modifier invité), DELETE (supprimer)
  admin/config/route.ts        → GET (config sections), PUT (modifier toggles)
```

**Format d'erreurs** — Standardisé : `{ error: string, code: string }` avec codes HTTP (400, 401, 404, 500).

**Validation API** — Zod schemas dans `lib/schemas/` partagés entre frontend et Route Handlers.

### Frontend Architecture

**State management** — Aucune librairie externe. Server Components par défaut. Client Components uniquement pour : overlay RSVP, bouton flottant, compteur admin. État local React (`useState`) suffit.

**Rendu** — SSR dynamique pour `/invite/[slug]` (données personnalisées, RSVP frais). Pages admin en SSR avec vérification cookie. Pas d'ISR — les données RSVP doivent être à jour.

**Images** — `next/image` avec WebP/AVIF auto, `priority` sur la hero photo (LCP), `sizes` responsive. Images stockées dans `/public/images/`.

**Organisation composants :**

```
components/
  guest/    → Hero, Timeline, Venue, Program, RsvpOverlay, RsvpButton
  admin/    → GuestTable, ConfigToggles, LoginForm, GuestForm
  ui/       → shadcn/ui (Button, Dialog, Input, Select, Table, Badge, Card)
```

### Animation des Alliances au Scroll (FR31-33)

**Approche technique** — CSS Scroll-Driven Animations natives (`animation-timeline: scroll()`) comme technologie principale. Compatible avec les navigateurs cibles (Safari 16.4+, Chrome 111+). Fallback JS avec `IntersectionObserver` + interpolation `scrollY` si nécessaire.

**Assets SVG :**
- Deux fichiers SVG distincts : alliance or (Ghizlaine) et alliance argent/platine (Ahmed)
- Rendu réaliste avec gradients SVG (`<linearGradient>`, `<radialGradient>`), filtres (`<feGaussianBlur>`, `<feSpecularLighting>`) pour reflets et ombres
- Poids cible : < 25KB par alliance (< 50KB total)
- Stockage : `public/images/rings/` — `ring-gold.svg` et `ring-silver.svg`

**Scroll-progress tracking :**
- L'animation est liée au pourcentage de scroll global de la page (0% = hero, 100% = dernière section)
- Propriétés animées : `translateX` (rapprochement bords → centre), `rotate` (rotation lente), `scale` (croissance progressive), `opacity` (30-40% → 100% à la fin)
- L'animation est **bidirectionnelle** — scroll up = alliances se séparent
- Easing final : `cubic-bezier` avec décélération pour l'entrelacement

**Composants :**

| Composant | Fichier | Type | Rôle |
|-----------|---------|------|------|
| `AllianceRings` | `components/guest/alliance-rings.tsx` | Client | Conteneur des deux alliances, gère le scroll-progress |
| `RingAsset` | Inline dans `AllianceRings` | — | Rendu SVG avec props (type: gold/silver, style) |

**Performance mobile :**
- `will-change: transform, opacity` sur les éléments animés
- `contain: layout style` pour isoler le repaint
- `prefers-reduced-motion: reduce` → alliances masquées ou statiques
- Test cible : 60fps sur iPhone 11 / Galaxy A52

**Intégration avec le scroll-snap :**
- Les alliances sont positionnées en `position: fixed` avec `pointer-events: none` pour ne pas interférer avec le scroll-snap et le contenu
- z-index inférieur au contenu principal mais supérieur au fond

### Landing Page Non-Invités (FR34)

**Route** — `app/page.tsx` (racine du site). Page publique, aucune auth requise.

**Architecture :**
- Server Component pur — aucune interactivité, aucune donnée dynamique
- Métadonnées : `noindex, nofollow` via `metadata` export Next.js
- Même design system que le site invité (fond crème, Cormorant/Geist, palette dorée)
- Pas de lien vers `/admin` (sécurité)

### Infrastructure & Deployment

**Déploiement** — Vercel auto-deploy : `main` → production, branches → preview.

**Variables d'environnement :**
- `DATABASE_URL` — Neon connection string (pooled)
- `ADMIN_PASSWORD` — Mot de passe admin (hashé bcrypt)
- Configurées dans Vercel Dashboard + `.env.local` pour le dev

**Monitoring** — Vercel Analytics (gratuit) pour Web Vitals. Pas de monitoring custom.

### Analyse d'Impact

**Séquence d'implémentation :**
1. DB schema + Drizzle setup → fondation de données
2. API routes invité (GET invite, PUT RSVP) → données accessibles
3. Frontend invité (Hero, Timeline, RSVP overlay) → expérience principale
4. API + frontend admin (login, CRUD, toggles) → gestion
5. Animations scroll + polish → finition visuelle

**Dépendances croisées :**
- Le schéma DB conditionne toutes les API routes
- Les API invité conditionnent le frontend invité (Server Components fetch)
- Le toggle config en DB conditionne le rendu conditionnel des sections Lieu/Programme
- L'auth admin conditionne toutes les routes `/api/admin/*`

## Implementation Patterns & Consistency Rules

### Points de Conflit Identifiés

**12 zones** où des agents AI pourraient faire des choix divergents : naming DB, naming API, naming code, structure fichiers, format réponses, format erreurs, dates, gestion d'état, loading states, error boundaries, validation, logs.

### Naming Patterns

**Base de données (Drizzle) :**

| Élément | Convention | Exemple |
|---------|-----------|---------|
| Tables | snake_case, pluriel | `guests`, `site_config`, `admin_sessions` |
| Colonnes | snake_case | `first_name`, `max_persons`, `created_at` |
| Clés étrangères | `{table_singulier}_id` | `guest_id` |
| Index | `idx_{table}_{colonnes}` | `idx_guests_slug` |
| Enums | snake_case | `'pending' \| 'confirmed' \| 'declined'` |

**API (Route Handlers) :**

| Élément | Convention | Exemple |
|---------|-----------|---------|
| Endpoints | kebab-case, pluriel | `/api/admin/guests`, `/api/invite/[slug]/rsvp` |
| Paramètres route | camelCase | `[slug]`, `[id]` |
| Query params | camelCase | `?sortBy=name&status=pending` |
| Corps JSON | camelCase | `{ firstName, lastName, maxPersons }` |

**Code TypeScript :**

| Élément | Convention | Exemple |
|---------|-----------|---------|
| Fichiers composants | kebab-case | `rsvp-overlay.tsx`, `guest-table.tsx` |
| Fichiers utilitaires | kebab-case | `db.ts`, `auth.ts`, `schemas.ts` |
| Composants React | PascalCase | `RsvpOverlay`, `GuestTable` |
| Fonctions | camelCase | `getGuestBySlug()`, `updateRsvp()` |
| Variables | camelCase | `guestData`, `isLoading` |
| Constants | UPPER_SNAKE_CASE | `MAX_SLUG_LENGTH`, `SESSION_DURATION` |
| Types/Interfaces | PascalCase | `Guest`, `RsvpFormData`, `SiteConfig` |
| Zod schemas | camelCase + Schema suffix | `rsvpSchema`, `guestCreateSchema` |

### Structure Patterns

**Organisation projet :**

```
app/
  (guest)/                    → Route group invité (layout cinématique)
    invite/[slug]/
      page.tsx                → Page invité SSR
      not-found.tsx           → 404 élégant
      opengraph-image.tsx     → OG dynamique par invité
  (admin)/                    → Route group admin (layout utilitaire)
    admin/
      page.tsx                → Dashboard admin
      login/page.tsx          → Page login
  api/
    invite/[slug]/route.ts
    invite/[slug]/rsvp/route.ts
    admin/login/route.ts
    admin/guests/route.ts
    admin/guests/[id]/route.ts
    admin/config/route.ts
  layout.tsx                  → Root layout (polices, metadata globale)
  globals.css                 → Tailwind + design tokens @theme inline

components/
  guest/                      → Composants expérience invité
  admin/                      → Composants admin
  ui/                         → shadcn/ui (généré par CLI)

lib/
  db/
    index.ts                  → Connexion Drizzle + Neon
    schema.ts                 → Schéma Drizzle (toutes les tables)
    queries.ts                → Fonctions query réutilisables
  schemas/                    → Zod validation schemas
    guest.ts
    rsvp.ts
    config.ts
  auth.ts                     → Helpers auth admin
  utils.ts                    → Utilitaires partagés

public/
  images/                     → Photos du couple, hero, etc.
```

**Tests** — Co-localisés : `lib/db/queries.test.ts` à côté de `queries.ts`.

### Format Patterns

**Réponses API — Succès :**

```typescript
return NextResponse.json(guestData)                     // 200
return NextResponse.json(newGuest, { status: 201 })      // 201
return new NextResponse(null, { status: 204 })           // 204 (delete)
```

**Réponses API — Erreurs :**

```typescript
return NextResponse.json(
  { error: "Invité non trouvé", code: "GUEST_NOT_FOUND" },
  { status: 404 }
)
```

**Codes HTTP :**

| Code | Usage |
|------|-------|
| 200 | Lecture / mise à jour réussie |
| 201 | Création réussie |
| 204 | Suppression réussie |
| 400 | Validation échouée (Zod) |
| 401 | Non authentifié (admin) |
| 404 | Ressource non trouvée |
| 429 | Rate limit atteint |
| 500 | Erreur serveur inattendue |

**Dates** — ISO 8601 en JSON (`"2026-10-17T14:00:00Z"`). Affichage formaté côté client avec `Intl.DateTimeFormat('fr-FR')`.

**JSON** — camelCase dans les réponses API (transformation Drizzle schema → camelCase TypeScript).

### Process Patterns

**Error Handling — Route Handlers :**

```typescript
export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const guest = await getGuestBySlug(params.slug)
    if (!guest) return NextResponse.json(
      { error: "Invité non trouvé", code: "GUEST_NOT_FOUND" }, { status: 404 }
    )
    return NextResponse.json(guest)
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur", code: "INTERNAL_ERROR" }, { status: 500 }
    )
  }
}
```

**Loading States :**
- Server Components : `loading.tsx` de Next.js
- Client Components : `isLoading` boolean local + skeleton/spinner
- Bouton submit : désactivé pendant requête, texte change

**Validation :**
- Côté client : validation Zod avant submit (feedback immédiat)
- Côté serveur : re-validation Zod dans le Route Handler (sécurité)
- Même schema Zod partagé (`lib/schemas/`)

### Règles d'Application

**Tout agent AI DOIT :**

1. Utiliser les conventions de nommage définies — aucune exception
2. Placer les fichiers dans la structure définie — pas de nouveaux dossiers racine
3. Utiliser le format d'erreur standardisé pour toutes les réponses API
4. Valider avec Zod côté client ET serveur avec le même schema
5. Utiliser Server Components par défaut, Client Components uniquement quand `useState`/`useEffect`/event handlers sont nécessaires
6. Ne jamais créer de fichiers `utils/` ou `helpers/` supplémentaires — tout dans `lib/`

**Anti-Patterns :**
- ❌ `UserCard.tsx` → ✅ `user-card.tsx`
- ❌ `res.json({ message: "..." })` → ✅ `NextResponse.json({ error: "...", code: "..." })`
- ❌ Dossier `helpers/` ou `services/` racine → ✅ Tout dans `lib/`
- ❌ `"use client"` sur un composant qui n'a pas d'interactivité → ✅ Server Component par défaut
- ❌ `moment.js` ou `dayjs` → ✅ `Intl.DateTimeFormat('fr-FR')`

## Project Structure & Boundaries

### Arborescence Complète

```
wedding/
├── app/
│   ├── layout.tsx                          # Root layout (polices, metadata globale)
│   ├── globals.css                         # Tailwind CSS + @theme inline (design tokens)
│   ├── not-found.tsx                       # 404 global
│   │
│   ├── page.tsx                             # Landing page non-invités (FR34)
│   │
│   ├── (guest)/                            # Route group — layout cinématique invité
│   │   ├── layout.tsx                      # Layout invité (scroll-snap, fond crème, polices)
│   │   └── invite/
│   │       └── [slug]/
│   │           ├── page.tsx                # Page invité SSR
│   │           ├── not-found.tsx           # 404 élégant "Ce lien n'existe pas"
│   │           └── opengraph-image.tsx     # Image OG dynamique par invité
│   │
│   ├── (admin)/                            # Route group — layout utilitaire admin
│   │   ├── layout.tsx                      # Layout admin (nav simple, sans animations)
│   │   └── admin/
│   │       ├── page.tsx                    # Dashboard (compteur + liste invités)
│   │       └── login/
│   │           └── page.tsx                # Page login admin
│   │
│   └── api/
│       ├── invite/
│       │   └── [slug]/
│       │       ├── route.ts                # GET → données invité + statut RSVP
│       │       └── rsvp/
│       │           └── route.ts            # PUT → soumettre/modifier RSVP
│       └── admin/
│           ├── login/
│           │   └── route.ts                # POST → connexion admin
│           ├── guests/
│           │   ├── route.ts                # GET → liste, POST → créer invité
│           │   └── [id]/
│           │       └── route.ts            # PUT → modifier, DELETE → supprimer
│           └── config/
│               └── route.ts                # GET → config, PUT → modifier toggles
│
├── components/
│   ├── guest/
│   │   ├── hero.tsx                        # Hero (photo plein écran + voile doré + prénoms)
│   │   ├── timeline.tsx                    # "Notre Histoire" (frise chronologique)
│   │   ├── venue.tsx                       # Lieu (conditionnel — toggle admin)
│   │   ├── program.tsx                     # Programme (conditionnel — toggle admin)
│   │   ├── rsvp-button.tsx                 # Bouton flottant "Je serai là" (Client)
│   │   ├── rsvp-overlay.tsx                # Overlay RSVP stepper (Client)
│   │   └── alliance-rings.tsx              # Alliances animées au scroll (Client — FR31-33)
│   ├── admin/
│   │   ├── login-form.tsx                  # Formulaire connexion (Client)
│   │   ├── guest-table.tsx                 # Tableau invités avec statuts
│   │   ├── guest-form.tsx                  # Formulaire ajout/édition invité (Client)
│   │   └── config-toggles.tsx              # Toggles sections (Client)
│   └── ui/                                 # shadcn/ui (généré par CLI)
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── table.tsx
│       ├── badge.tsx
│       └── card.tsx
│
├── lib/
│   ├── db/
│   │   ├── index.ts                        # Connexion Drizzle + Neon
│   │   ├── schema.ts                       # Schéma (guests, site_config, admin_sessions)
│   │   └── queries.ts                      # Fonctions query réutilisables
│   ├── schemas/
│   │   ├── guest.ts                        # Zod: guestCreateSchema, guestUpdateSchema
│   │   ├── rsvp.ts                         # Zod: rsvpSchema
│   │   └── config.ts                       # Zod: configUpdateSchema
│   ├── auth.ts                             # verifyPassword, createSession, validateSession
│   └── utils.ts                            # generateSlug, formatDate, cn
│
├── middleware.ts                            # Rate limiting login + vérification session admin
│
├── public/
│   └── images/                             # Photos couple (hero, timeline, OG)
│       └── rings/                          # SVG alliances (ring-gold.svg, ring-silver.svg)
│
├── drizzle/                                # Migrations Drizzle Kit (auto-générées)
│   └── migrations/
│
├── .env.local                              # Variables dev
├── .env.example                            # Template variables (sans valeurs)
├── drizzle.config.ts                       # Config Drizzle Kit
├── next.config.ts                          # Config Next.js
├── package.json
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
└── .gitignore
```

### Architectural Boundaries

**API — Invité vs Admin :**

```
/api/invite/*    → Aucune auth. Accès par slug uniquement.
/api/admin/*     → Cookie admin_token requis (sauf /api/admin/login).
                   Middleware vérifie la session dans admin_sessions.
```

**Composants — Server vs Client :**

| Composant | Type | Raison |
|-----------|------|--------|
| `hero.tsx` | Server | Rendu statique, animations CSS pures |
| `timeline.tsx` | Server | Rendu statique, animations CSS pures |
| `venue.tsx` | Server | Rendu conditionnel côté serveur |
| `program.tsx` | Server | Rendu conditionnel côté serveur |
| `rsvp-button.tsx` | Client | `onClick`, animation pulse |
| `rsvp-overlay.tsx` | Client | `useState` (stepper), `fetch` (PUT RSVP) |
| `alliance-rings.tsx` | Client | `useEffect` (scroll listener), `useRef`, animations CSS |
| `login-form.tsx` | Client | `useState`, `fetch` (POST login) |
| `guest-form.tsx` | Client | `useState`, `fetch` (POST/PUT guest) |
| `config-toggles.tsx` | Client | `useState`, `fetch` (PUT config) |
| `guest-table.tsx` | Server | Rendu liste, pas d'interactivité directe |

**Flux de données :**

```
Browser → Route Handler → Zod validation → Drizzle query → Neon DB
                                              ↓
                                    NextResponse.json()
```

### Mapping Exigences → Structure

| Catégorie FRs | Fichiers concernés |
|---------------|-------------------|
| Accueil (FR1-3) | `(guest)/layout.tsx`, `components/guest/hero.tsx`, `globals.css` |
| Contenu (FR4-6) | `components/guest/timeline.tsx`, `venue.tsx`, `program.tsx`, `lib/db/queries.ts` |
| Liens Uniques (FR7-10) | `(guest)/invite/[slug]/page.tsx`, `not-found.tsx`, `lib/utils.ts` |
| RSVP (FR11-19) | `components/guest/rsvp-button.tsx`, `rsvp-overlay.tsx`, `api/invite/[slug]/rsvp/route.ts` |
| Open Graph (FR20) | `(guest)/invite/[slug]/opengraph-image.tsx` |
| Admin Invités (FR21-26) | `(admin)/admin/page.tsx`, `components/admin/*`, `api/admin/guests/*` |
| Admin Config (FR27-28) | `components/admin/config-toggles.tsx`, `api/admin/config/route.ts` |
| Contenu hardcodé (FR29) | Directement dans les composants `guest/` |
| Animation alliances (FR31-33) | `components/guest/alliance-rings.tsx`, `public/images/rings/` |
| Landing page (FR34) | `app/page.tsx` |

### Flux Applicatifs

**Parcours invité :**
```
Lien WhatsApp → /invite/[slug] (SSR)
  → getGuestBySlug(slug) + getSiteConfig() → Neon DB
  → Rendu page (hero + timeline + sections conditionnelles)
  → Bouton RSVP flottant → Overlay stepper
  → PUT /api/invite/[slug]/rsvp → Zod → updateRsvp() → DB
  → Animation succès → overlay se ferme
```

**Parcours admin :**
```
/admin/login → POST /api/admin/login
  → bcrypt verify → session token → cookie HttpOnly
  → Redirect /admin
  → getAllGuests() → tableau + compteur
  → CRUD via /api/admin/guests/*
  → Toggles via /api/admin/config
```

## Architecture Validation Results

### Coherence Validation ✅

**Compatibilité des technologies :**
- Next.js 16.1.6 + React 19.2.3 → versions natives ensemble ✅
- Tailwind CSS 4 + `@tailwindcss/postcss` → configuré et fonctionnel ✅
- Drizzle ORM + `@neondatabase/serverless` → adapter officiel ✅
- shadcn/ui 3.8.4 + Tailwind CSS 4 + React 19 → compatibilité confirmée ✅
- nanoid 5.1.6 (ESM) + Next.js 16 → ESM natif ✅
- Motion 12.34.0 + React 19 → support confirmé ✅
- CSS Scroll-Driven Animations → Safari 16.4+, Chrome 111+ ✅

**Cohérence patterns ↔ stack :**
- snake_case DB → convention PostgreSQL standard ✅
- camelCase code → convention TypeScript/React ✅
- Route groups `(guest)` / `(admin)` → pattern natif App Router ✅
- Server Components par défaut → recommandation Next.js 16 ✅

Aucune contradiction détectée.

### Requirements Coverage ✅

**33/33 Exigences Fonctionnelles couvertes :**

| FR | Support architectural |
|----|----------------------|
| FR1-3 (Accueil) | `hero.tsx` + CSS animations + Tailwind responsive |
| FR4-6 (Contenu) | `timeline.tsx`, `venue.tsx`, `program.tsx` + `site_config` DB |
| FR7-10 (Liens) | `/invite/[slug]` + nanoid + `not-found.tsx` |
| FR11-19 (RSVP) | `rsvp-button.tsx` + `rsvp-overlay.tsx` + API PUT + Zod |
| FR20 (OG) | `opengraph-image.tsx` dynamique |
| FR21-26 (Admin invités) | API CRUD + `guest-table.tsx` + `guest-form.tsx` |
| FR27-28 (Admin config) | `config-toggles.tsx` + API config |
| FR29 (Contenu code) | Directement dans composants `guest/` |
| FR31-33 (Alliances scroll) | `alliance-rings.tsx` + CSS Scroll-Driven Animations + SVG assets |
| FR34 (Landing page) | `app/page.tsx` + metadata noindex |

**NFRs couvertes :**
- Performance (LCP < 3s) → SSR + `next/image` priority + Vercel CDN ✅
- 60fps scroll → CSS Scroll-Driven Animations (zéro JS) ✅
- Sécurité → bcrypt + cookie HttpOnly + nanoid + rate limiting ✅
- Fiabilité → Vercel + Neon managé avec backups ✅
- Accessibilité WCAG AA → shadcn/ui (Radix) + contrastes ✅
- Pas de service payant → Neon free + Vercel hobby ✅

### Implementation Readiness ✅

**Décisions complètes :** Toutes les décisions critiques documentées avec versions vérifiées.
**Structure complète :** Arborescence exhaustive avec chaque fichier mappé à ses FRs.
**Patterns complets :** Naming, structure, format API, error handling, validation — tous couverts avec exemples.

### Gap Analysis

**Gaps critiques : 0**
**Gaps importants : 0**
**Gaps nice-to-have : 2**
- Tests (différé post-MVP — cohérent avec stratégie)
- Backup explicite (Neon le fournit nativement)

### Architecture Completeness Checklist

**✅ Analyse des exigences**
- [x] Contexte projet analysé
- [x] Échelle et complexité évaluées
- [x] Contraintes techniques identifiées
- [x] Préoccupations transversales mappées

**✅ Décisions architecturales**
- [x] Décisions critiques documentées avec versions
- [x] Stack technologique entièrement spécifié
- [x] Patterns d'intégration définis
- [x] Performance adressée

**✅ Patterns d'implémentation**
- [x] Conventions de nommage établies
- [x] Patterns de structure définis
- [x] Patterns de communication spécifiés
- [x] Patterns de processus documentés

**✅ Structure projet**
- [x] Arborescence complète définie
- [x] Boundaries composants établies
- [x] Points d'intégration mappés
- [x] Mapping exigences → structure complet

### Architecture Readiness Assessment

**Statut global : PRÊT POUR L'IMPLÉMENTATION**

**Niveau de confiance : Élevé**

**Forces :**
- Stack cohérente et contrainte — peu de décisions ambiguës
- 29/29 FRs couvertes avec support architectural clair
- Patterns de nommage et structure exhaustifs
- Modèle de données simple (3 tables) bien défini
- Boundaries Server/Client Components clairement documentées

**Améliorations futures (post-MVP) :**
- Tests E2E (Playwright)
- Monitoring avancé (Sentry)
- Stratégie de cache plus fine

### Implementation Handoff

**Tout agent AI doit :**
1. Suivre toutes les décisions architecturales exactement comme documentées
2. Utiliser les patterns d'implémentation de manière consistante
3. Respecter la structure projet et les boundaries
4. Se référer à ce document pour toute question architecturale

**Première priorité d'implémentation :**
1. Installer les dépendances complémentaires (Drizzle, Neon, shadcn/ui, nanoid)
2. Configurer le schéma DB Drizzle
3. Déployer les migrations sur Neon
4. Implémenter les API routes invité
