---
stepsCompleted: [1, 2, 3, 4]
status: 'in-progress'
completedAt: '2026-02-13'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
---

# wedding - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for wedding, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: L'invité peut voir une page d'accueil émotionnelle avec photo du couple, prénoms et animation d'entrée
FR2: L'invité peut découvrir le contenu du site via un défilement continu avec animations au scroll
FR3: L'invité peut naviguer le site de manière fluide sur mobile et desktop
FR4: L'invité peut parcourir une timeline "Notre Histoire" retraçant les étapes du couple (rencontre → fiançailles → Jour J)
FR5: L'invité peut voir la section "Lieu du mariage" lorsqu'elle est activée par l'admin
FR6: L'invité peut voir la section "Programme de la journée" lorsqu'elle est activée par l'admin
FR7: Chaque invité possède un lien unique qui l'identifie automatiquement sur le site
FR8: L'invité peut accéder au site via son lien unique et voir son prénom affiché
FR9: Le système peut générer un lien unique pour chaque invité ajouté
FR10: Le système affiche une page d'erreur gracieuse lorsqu'un lien invalide est utilisé
FR11: L'invité peut accéder au formulaire RSVP via un bouton flottant visible à tout moment
FR12: L'invité peut voir son nom pré-rempli dans le formulaire RSVP
FR13: L'invité peut indiquer le nombre de personnes accompagnantes (de 1 à 5)
FR14: L'invité peut confirmer sa présence ("Je serai là")
FR15: L'invité peut décliner l'invitation ("Je ne pourrai pas")
FR16: L'invité peut modifier sa réponse RSVP (présence et nombre d'accompagnants) en revisitant son lien unique, sans aucune limite de temps
FR17: Le formulaire RSVP s'affiche en overlay sans quitter la page principale
FR18: L'invité peut voir son statut RSVP actuel lorsqu'il revient sur son lien
FR19: Le système conserve et pré-affiche la dernière réponse RSVP de l'invité dans le formulaire
FR20: Le lien unique affiche un aperçu Open Graph soigné lors du partage sur WhatsApp (image, titre, description)
FR21: L'admin peut se connecter à l'espace admin via /admin avec un mot de passe
FR22: L'admin peut consulter la liste complète des invités avec leur statut (confirmé / en attente / décliné)
FR23: L'admin peut ajouter un nouvel invité (nom, prénom) et obtenir son lien unique
FR24: L'admin peut supprimer un invité de la liste
FR25: L'admin peut modifier le statut RSVP d'un invité manuellement
FR26: L'admin peut voir le nombre de personnes confirmées par invité
FR27: L'admin peut activer ou désactiver la section "Lieu du mariage"
FR28: L'admin peut activer ou désactiver la section "Programme de la journée"
FR29: Le contenu des sections (textes, photos, adresse du lieu, étapes de la timeline) est géré directement dans le code source
FR31: Deux alliances animées (or pour Ghizlaine, argent/platine pour Ahmed) flottent sur les bords de l'écran et accompagnent le scroll de l'invité
FR32: Les alliances se rapprochent au fil du scroll par une animation fluide et continue liée au pourcentage de défilement
FR33: À la dernière section, les alliances s'entrelacent et révèlent la photo du couple dans l'espace intérieur
FR34: Un visiteur accédant à la racine du site (/) sans lien d'invitation voit une landing page placeholder

### NonFunctional Requirements

NFR1: Chargement initial < 3 secondes en 4G mobile
NFR2: Scroll animations fluides à 60fps sur smartphones milieu de gamme (iPhone 11, Galaxy A52)
NFR3: Time to Interactive (TTI) < 4 secondes sur mobile
NFR4: Images optimisées : lazy loading, formats modernes (WebP/AVIF), compression adaptative
NFR5: Score Lighthouse Performance > 85 sur mobile
NFR6: Connexion admin protégée par mot de passe
NFR7: HTTPS obligatoire (Vercel)
NFR8: Liens uniques non devinables (nanoid 10 chars, alphabet custom)
NFR9: Pas d'exposition des données invités dans les API publiques
NFR10: Rate limiting sur les tentatives de connexion admin
NFR11: Disponibilité cible 99%
NFR12: Pas de perte de données RSVP — persistance fiable
NFR13: Backups réguliers de la base de données
NFR14: Contrastes WCAG AA pour le texte
NFR15: Navigation clavier basique fonctionnelle
NFR16: Textes alternatifs sur les images principales
NFR17: Pas de dépendance à des services tiers payants

### Additional Requirements

**Architecture — Starter Template :**
- Projet déjà initialisé avec `create-next-app` (Next.js 16.1.6, React 19.2.3, TypeScript 5, Tailwind CSS 4, ESLint 9)
- Dépendances complémentaires à installer : Drizzle ORM, @neondatabase/serverless, shadcn/ui, nanoid, motion
- Schéma DB Drizzle à créer : 3 tables (guests, site_config, admin_sessions)
- Migrations via Drizzle Kit

**Architecture — Infrastructure :**
- Base de données Neon (via Vercel Postgres) — provisionnement et configuration
- Variables d'environnement : DATABASE_URL, ADMIN_PASSWORD
- Middleware Next.js pour rate limiting et vérification session admin
- Validation Zod partagée client/serveur dans lib/schemas/

**Architecture — API :**
- 6 Route Handlers REST : invite/[slug], invite/[slug]/rsvp, admin/login, admin/guests, admin/guests/[id], admin/config
- Format erreurs standardisé : { error, code }
- Auth admin : bcrypt + session token cookie HttpOnly 24h

**UX — Design System :**
- Direction "Cinématique Immersive" : hero photo plein écran + voile doré + scroll-snap sections 100vh
- CSS Scroll-Driven Animations natives pour révélation au scroll (zéro JS)
- Polices : Cormorant Garamond (display) + Geist Sans (body) via next/font/google
- Design tokens centralisés dans @theme inline de Tailwind CSS 4
- Palette florale aquarelle : crème rosé #FDF8F6, rose pétale #C77B95, prune profond #3A2434
- shadcn/ui composants : Button, Dialog, Input, Select, Table, Badge, Card

**UX — Responsive & Accessibilité :**
- Mobile-first (375px+), breakpoints Tailwind (sm, md, lg)
- RSVP : bottom-sheet sur mobile, dialog centré sur desktop
- WCAG 2.1 AA : contrastes, focus visible, aria-labels, semantic HTML
- Test cibles : iPhone 11, Galaxy A52, Safari iOS, Chrome Android

### FR Coverage Map

FR1:  Epic 2 — Landing émotionnel (hero photo, prénoms, animation)
FR2:  Epic 2 — Défilement continu avec animations scroll
FR3:  Epic 2 — Navigation fluide mobile et desktop
FR4:  Epic 2 — Timeline "Notre Histoire"
FR5:  Epic 2 — Section Lieu (toggle admin)
FR6:  Epic 2 — Section Programme (toggle admin)
FR7:  Epic 1 — Lien unique identifiant l'invité
FR8:  Epic 1 — Accès via lien unique, prénom affiché
FR9:  Epic 1 — Génération lien unique par invité
FR10: Epic 1 — Page d'erreur gracieuse (lien invalide)
FR11: Epic 3 — Bouton RSVP flottant
FR12: Epic 3 — Nom pré-rempli dans RSVP
FR13: Epic 3 — Nombre de personnes (1-5)
FR14: Epic 3 — Confirmer présence ("Je serai là")
FR15: Epic 3 — Décliner invitation
FR16: Epic 3 — Modifier réponse via même lien
FR17: Epic 3 — RSVP en overlay (pas de page séparée)
FR18: Epic 3 — Statut RSVP visible au retour
FR19: Epic 3 — Pré-affichage dernière réponse
FR20: Epic 2 — Aperçu Open Graph WhatsApp
FR21: Epic 4 — Login admin
FR22: Epic 4 — Liste invités avec statuts
FR23: Epic 4 — Ajouter invité + lien unique
FR24: Epic 4 — Supprimer invité
FR25: Epic 4 — Modifier statut RSVP manuellement
FR26: Epic 4 — Nombre de personnes par invité
FR27: Epic 4 — Toggle section Lieu
FR28: Epic 4 — Toggle section Programme
FR29: Epic 1 — Contenu dans le code source
FR31: Epic 6 — Alliances animées sur les bords de l'écran
FR32: Epic 6 — Rapprochement progressif lié au scroll
FR33: Epic 6 — Entrelacement final et révélation photo
FR34: Epic 7 — Landing page placeholder non-invités (remplacée par Save the Date)
FR35: Epic 8/9 — Pigeon voyageur Lottie entre dans l'écran
FR36: Epic 9 — Pigeon dépose enveloppe et s'envole
FR37: Epic 9 — Sceau doré A&G calligraphie
FR38: Epic 9 — Enveloppe s'ouvre avec animation fluide
FR39: Epic 8 — Contenu révélé (prénoms, date, lieu, message)
FR40: Epic 9 — Animation joue une fois, contenu reste statique
FR41: Epic 9 — Animation complète 4-5 secondes
FR42: Epic 8 — prefers-reduced-motion fallback
FR43: Epic 8 — Accessibilité lecteurs d'écran
FR44: Epic 8 — Remplace la landing page (haut de /)
FR45: Epic 8 — Responsive 360px-1920px
FR46: Epic 10 — Aperçu OG WhatsApp (enveloppe + sceau)
FR47: Epic 10 — Favicon personnalisé (sceau A&G)

## Epic List

### Epic 1: Lien Unique & Page Invité
L'invité ouvre son lien unique WhatsApp et accède à sa page personnalisée avec son prénom affiché.
**FRs couvertes:** FR7, FR8, FR9, FR10, FR29
**Note:** Inclut le setup technique (DB, Drizzle, Neon, dépendances) comme Story 1. Seed DB pour les tests dev.

### Epic 2: Expérience Visuelle Premium
L'invité découvre un site émotionnel au design cinématique avec hero photo, timeline, animations au scroll et sections conditionnelles.
**FRs couvertes:** FR1, FR2, FR3, FR4, FR5, FR6, FR20
**Note:** FR20 (Open Graph) ici car l'aperçu WhatsApp nécessite le design visuel pour être impactant.

### Epic 3: Système RSVP
L'invité confirme sa présence en moins de 10 secondes via un bouton flottant et un overlay élégant.
**FRs couvertes:** FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR19

### Epic 4: Administration
Ahmed & Ghizlaine gèrent la liste d'invités, suivent les confirmations et contrôlent les sections visibles du site.
**FRs couvertes:** FR21, FR22, FR23, FR24, FR25, FR26, FR27, FR28
**Note:** Parallélisable dès la fin d'Epic 1. N'a pas besoin d'attendre Epic 2/3.

### Epic 6: Animation des Alliances au Scroll
Deux alliances (or + argent/platine) accompagnent visuellement le parcours de l'invité : elles flottent sur les bords, se rapprochent au fil du scroll, et s'entrelacent à la dernière section pour révéler la photo du couple.
**FRs couvertes:** FR31, FR32, FR33
**Note:** Epic la plus ambitieuse techniquement. Nécessite des assets SVG réalistes et une animation scroll-driven performante sur mobile.

### Epic 7: Landing Page Non-Invités
Un visiteur accédant au site sans lien d'invitation voit une page placeholder élégante l'invitant à contacter Ahmed ou Ghizlaine.
**FRs couvertes:** FR34
**Note:** Phase 1 = placeholder simple. Phase 2 potentielle = vraie landing page de mariage (hors scope actuel).

### Epic 8: Page Save the Date — Contenu & Cadre Doré
L'invité qui ouvre le lien `/` voit le contenu Save the Date (prénoms, date, lieu, message poétique) sur un écran crème élégant avec fond responsive. L'expérience est parfaite pour les utilisateurs `prefers-reduced-motion` et accessible à tous les lecteurs d'écran.
**FRs couvertes:** FR35, FR39, FR42, FR43, FR44, FR45
**Note:** Inclut la fondation CSS (tokens animation/couleur, polices), le contenu sémantique, le cadre doré (évolué vers conteneur invisible), et la validation responsive/accessibilité. Remplace la landing non-invités d'Epic 7.

### Epic 9: Animation Pigeon Voyageur
L'invité vit une micro-narration animée de 5 secondes : un pigeon stylisé Lottie entre en vol, dépose une enveloppe cachetée A&G, s'envole, puis l'enveloppe s'ouvre pour révéler le contenu Save the Date.
**FRs couvertes:** FR35, FR36, FR37, FR38, FR40, FR41
**Note:** Pigeon via Lottie (`lottie-react`), enveloppe et sceau en SVG inline. Orchestration via Client Component `SaveTheDateScene` + gating CSS `.scene-ready`.

### Epic 10: Open Graph & Favicon Save the Date
Quand le lien `/` est partagé sur WhatsApp, un aperçu visuel attractif s'affiche : enveloppe dorée fermée + sceau A&G sur fond crème. Un favicon personnalisé (sceau A&G) apparaît dans l'onglet du navigateur.
**FRs couvertes:** FR46, FR47
**Note:** Satori (`ImageResponse`) avec police TTF locale (`readFileSync`). Runtime `nodejs`, prerender statique.

### Séquence de Déploiement
Le site ne doit pas être partagé via WhatsApp tant qu'Epic 1 + Epic 2 + Epic 4 ne sont pas complétés. Epic 3 (RSVP) peut être ajouté juste après ou en même temps.
Epic 6 peut être développée en parallèle après Epic 2. Epic 7 peut être déployée indépendamment.
Epics 8-10 (Save the Date) sont indépendantes du parcours invité et peuvent être développées en parallèle.

### Statut actuel (tous les Epics terminés)
- Epic 1: ✅ done (Stories 1.1–1.3)
- Epic 2: ✅ done (Stories 2.1–2.5)
- Epic 3: ✅ done (Stories 3.1–3.4) — FR16 enrichi (sans limite de temps)
- Epic 4: ✅ done (Stories 4.1–4.5)
- Epic 5: ❌ SUPPRIMÉE — fusionnée dans Story 3.4 (FR16)
- Epic 6: ✅ done (Stories 6.1–6.2, 6.3 cancelled, 6.4 couverte par 6.2)
- Epic 7: ✅ done (Story 7.1) — remplacée par Save the Date (Epic 8)
- Epic 8: ✅ done (Stories 8.1–8.4)
- Epic 9: ✅ done (Stories 9.1–9.4)
- Epic 10: ✅ done (Story 10.1)

## Epic 1: Lien Unique & Page Invité

L'invité ouvre son lien unique WhatsApp et accède à sa page personnalisée avec son prénom affiché.

### Story 1.1: Setup Technique & Fondation

As a développeur,
I want configurer la base technique du projet (DB, ORM, dépendances, design tokens),
So that toutes les futures stories ont une fondation solide pour s'appuyer.

**Acceptance Criteria:**

**Given** le projet Next.js 16 existant (create-next-app)
**When** j'installe les dépendances complémentaires (Drizzle ORM, @neondatabase/serverless, shadcn/ui, nanoid)
**Then** toutes les dépendances sont installées sans conflit et le build passe

**Given** une base de données Neon provisionnée
**When** je configure la connexion Drizzle dans `lib/db/index.ts` avec `DATABASE_URL`
**Then** la connexion à Neon fonctionne en dev et en production

**Given** le schéma Drizzle défini dans `lib/db/schema.ts`
**When** je lance `drizzle-kit push`
**Then** les 3 tables (guests, site_config, admin_sessions) sont créées dans Neon

**Given** le design system défini dans le UX spec
**When** je configure `globals.css` avec les design tokens `@theme inline`
**Then** la palette florale (crème rosé #FDF8F6, rose pétale #C77B95, prune profond #3A2434), les polices (Cormorant Garamond + Geist Sans) et les spacing tokens sont disponibles dans tout le projet

**Given** le fichier `.env.example` créé
**When** un développeur clone le projet
**Then** il sait quelles variables d'environnement configurer (DATABASE_URL, ADMIN_PASSWORD)

### Story 1.2: Page Invité avec Lien Unique

As a invité,
I want ouvrir mon lien unique et voir une page personnalisée avec mon prénom,
So that je me sens reconnu et attendu par le couple.

**Acceptance Criteria:**

**Given** un invité avec le slug `ah3kx9m2p7` existe en base
**When** l'invité ouvre `/invite/ah3kx9m2p7`
**Then** la page SSR s'affiche avec le prénom de l'invité visible

**Given** la fonction `generateSlug()` dans `lib/utils.ts`
**When** un slug est généré
**Then** il fait 10 caractères, utilise un alphabet custom (lowercase + chiffres, sans 0oOlLiI1), et est URL-friendly

**Given** le route group `(guest)` avec son layout
**When** la page invité se charge
**Then** le layout applique le fond crème, les polices Cormorant/Geist, et la structure scroll-snap

**Given** le contenu hardcodé dans les composants (FR29)
**When** la page s'affiche
**Then** les textes, dates et informations du couple sont rendus depuis le code source (pas de CMS)

**Given** les données `site_config` en base
**When** la page invité se charge
**Then** les sections Lieu et Programme sont affichées ou masquées selon les toggles

### Story 1.3: Page d'Erreur Élégante

As a visiteur avec un lien invalide,
I want voir une page d'erreur élégante et cohérente avec le design du site,
So that je comprends que mon lien ne fonctionne pas sans être perdu.

**Acceptance Criteria:**

**Given** un slug inexistant en base (ex: `/invite/xyz123abcd`)
**When** le visiteur ouvre ce lien
**Then** la page `not-found.tsx` s'affiche avec un message élégant dans le style du site (fond crème, typographie Cormorant)

**Given** la page 404 invité
**When** elle s'affiche
**Then** elle ne révèle aucune information sur l'existence d'autres invités ou slugs (NFR9)

**Given** un lien invalide avec des caractères spéciaux
**When** le visiteur ouvre ce lien
**Then** la page 404 s'affiche correctement sans erreur serveur

## Epic 2: Expérience Visuelle Premium

L'invité découvre un site émotionnel au design cinématique avec hero photo, timeline, animations au scroll et sections conditionnelles.

### Story 2.1: Section Hero Cinématique

As a invité,
I want voir une page d'accueil émotionnelle avec une photo plein écran, les prénoms du couple et une animation d'entrée,
So that je ressens immédiatement l'émotion et l'importance de l'événement.

**Acceptance Criteria:**

**Given** la page invité chargée
**When** le hero s'affiche
**Then** une photo du couple occupe tout l'écran (100vh) avec un vidéo en boucle du couple avec voile blanc semi-transparent (bg-white/30) pour la lisibilité

**Given** le hero visible
**When** l'animation d'entrée se déclenche
**Then** les prénoms "Ahmed & Ghizlaine" apparaissent en Cormorant Garamond XL avec une animation fade-in douce (600ms ease-out)

**Given** un invité identifié par son slug
**When** le hero s'affiche
**Then** le prénom de l'invité est affiché dans un message personnalisé (ex: "Cher Karim, vous êtes attendu...")

**Given** le hero sur mobile (375px+)
**When** l'invité voit la page
**Then** la photo, les prénoms et le message sont correctement dimensionnés et lisibles sans scroll horizontal

**Given** la hero photo
**When** la page se charge
**Then** la vidéo utilise `<video>` autoPlay muted loop playsInline avec sources séparées mobile/desktop

### Story 2.2: Timeline "Notre Histoire"

As a invité,
I want parcourir la timeline du couple retraçant leur histoire,
So that je découvre leur parcours et me connecte émotionnellement à leur histoire.

**Acceptance Criteria:**

**Given** la section timeline dans la page invité
**When** l'invité scrolle après le hero
**Then** une frise chronologique verticale affiche les étapes du couple (Rencontre → Fiançailles → Jour J)

**Given** chaque étape de la timeline
**When** elle est rendue
**Then** elle affiche une date, un titre court et un micro-texte personnel, stylés avec Cormorant (titre) et Geist (texte)

**Given** le contenu de la timeline
**When** il est affiché
**Then** il provient directement du code source (FR29), pas d'une base de données

**Given** la timeline sur mobile
**When** l'invité la parcourt
**Then** les étapes sont empilées verticalement, lisibles et correctement espacées

### Story 2.3: Sections Conditionnelles Lieu & Programme

As a invité,
I want voir les informations sur le lieu et le programme quand elles sont disponibles,
So that je sache où aller et quoi attendre le jour du mariage.

**Acceptance Criteria:**

**Given** `show_venue = true` dans `site_config`
**When** la page invité se charge
**Then** la section Lieu s'affiche avec l'adresse, une description et les informations pratiques

**Given** `show_venue = false` dans `site_config`
**When** la page invité se charge
**Then** la section Lieu n'est pas rendue du tout (pas de div vide, pas d'espace)

**Given** `show_program = true` dans `site_config`
**When** la page invité se charge
**Then** la section Programme s'affiche avec les étapes de la journée (icônes élégantes, pas d'horaires détaillés)

**Given** `show_program = false` dans `site_config`
**When** la page invité se charge
**Then** la section Programme n'est pas rendue

**Given** les sections Lieu et Programme sur mobile
**When** elles s'affichent
**Then** le contenu est lisible, les icônes correctement dimensionnées, pas de débordement

### Story 2.4: Scroll Animations & Navigation Fluide

As a invité,
I want découvrir le contenu avec des animations fluides au scroll et une navigation smooth,
So that l'expérience soit premium et immersive comme un site Apple.

**Acceptance Criteria:**

**Given** les sections de la page invité (hero, timeline, lieu, programme)
**When** l'invité scrolle
**Then** chaque section se révèle avec des CSS Scroll-Driven Animations (fade-in, slide-up) sans JavaScript

**Given** la structure de page
**When** le scroll est actif
**Then** les sections utilisent `scroll-snap-type: y mandatory` et `scroll-snap-align: start` pour un défilement section par section (100vh)

**Given** un smartphone milieu de gamme (iPhone 11, Galaxy A52)
**When** l'invité scrolle la page
**Then** les animations sont fluides à 60fps sans saccade (NFR2)

**Given** la page sur desktop (>1024px)
**When** l'invité navigue
**Then** les animations et le layout s'adaptent au grand écran (sections plus larges, photos agrandies, spacing adapté)

**Given** un navigateur ne supportant pas CSS Scroll-Driven Animations
**When** la page s'affiche
**Then** le contenu est visible normalement sans animations (dégradation gracieuse)

### Story 2.5: Aperçu Open Graph WhatsApp

As a invité recevant un lien WhatsApp,
I want voir un aperçu élégant du site dans la bulle WhatsApp,
So that je sois intrigué et ai envie d'ouvrir le lien.

**Acceptance Criteria:**

**Given** un lien unique `/invite/[slug]` partagé sur WhatsApp
**When** WhatsApp génère l'aperçu
**Then** une image OG personnalisée s'affiche avec le titre "Ahmed & Ghizlaine vous invitent" et une description appropriée

**Given** le fichier `opengraph-image.tsx` dans le dossier `[slug]`
**When** les crawlers OG accèdent à l'URL
**Then** une image 1200x630px est générée dynamiquement avec la photo du couple, les prénoms et le style doré/crème du site

**Given** les meta OG générées
**When** l'aperçu WhatsApp s'affiche
**Then** le titre, la description et l'image sont cohérents avec le design du site (pas de placeholder générique)

## Epic 3: Système RSVP

L'invité confirme sa présence en moins de 10 secondes via un bouton flottant et un overlay élégant.

### Story 3.1: API RSVP

As a système,
I want exposer des endpoints pour lire et modifier le statut RSVP d'un invité,
So that le frontend puisse afficher et soumettre les réponses RSVP.

**Acceptance Criteria:**

**Given** un invité avec le slug `ah3kx9m2p7` en base
**When** une requête GET arrive sur `/api/invite/ah3kx9m2p7`
**Then** la réponse 200 contient les données de l'invité incluant `status`, `personsConfirmed` et `maxPersons`

**Given** un slug inexistant
**When** une requête GET arrive sur `/api/invite/xyz123abcd`
**Then** la réponse est 404 avec `{ error: "Invité non trouvé", code: "GUEST_NOT_FOUND" }`

**Given** un invité existant
**When** une requête PUT arrive sur `/api/invite/[slug]/rsvp` avec `{ status: "confirmed", personsConfirmed: 3 }`
**Then** la réponse est 200, le statut et le nombre de personnes sont mis à jour en base

**Given** une requête PUT avec des données invalides (personsConfirmed > 5 ou < 1)
**When** la validation Zod s'exécute
**Then** la réponse est 400 avec `{ error: "Données invalides", code: "VALIDATION_ERROR" }`

**Given** un invité existant
**When** une requête PUT arrive avec `{ status: "declined" }`
**Then** le statut passe à "declined" et `personsConfirmed` est mis à 0

### Story 3.2: Bouton RSVP Flottant

As a invité,
I want voir un bouton "Confirmer ma présence" toujours visible pendant ma navigation,
So that je puisse accéder au formulaire RSVP à tout moment sans chercher.

**Acceptance Criteria:**

**Given** la page invité chargée
**When** l'invité navigue (scroll, sections)
**Then** un bouton flottant est visible en bas de l'écran à tout moment (position fixed)

**Given** le bouton flottant
**When** il est rendu
**Then** il affiche "Confirmer ma présence" avec le style doré du site, une animation pulse subtile (2s), et est cliquable

**Given** le bouton sur mobile (375px+)
**When** il est affiché
**Then** il est centré en bas, suffisamment grand pour le touch (min 48px height), et ne masque pas le contenu important

**Given** l'invité a déjà confirmé (status: confirmed)
**When** le bouton s'affiche
**Then** le texte change en "Modifier ma réponse" et l'animation pulse est désactivée

**Given** l'invité a décliné (status: declined)
**When** le bouton s'affiche
**Then** le texte change en "Modifier ma réponse"

### Story 3.3: Overlay RSVP — Confirmation

As a invité,
I want confirmer ma présence via un overlay élégant avec mon nom pré-rempli et le nombre de personnes,
So that je puisse répondre en moins de 10 secondes sans quitter la page.

**Acceptance Criteria:**

**Given** l'invité clique sur le bouton flottant
**When** l'overlay s'ouvre
**Then** un Dialog (shadcn/ui) s'affiche en bottom-sheet sur mobile et centré sur desktop, avec une animation d'entrée douce (cubic-bezier, 300ms)

**Given** l'overlay ouvert
**When** les données de l'invité sont chargées
**Then** le prénom de l'invité est affiché et pré-rempli (FR12), non modifiable par l'invité

**Given** l'overlay en mode confirmation
**When** l'invité voit le formulaire
**Then** un sélecteur "Nous serons" affiche un nombre (1 à 5) avec des boutons +/- ou un select (FR13)

**Given** l'invité sélectionne un nombre et appuie sur "Je serai là"
**When** la requête PUT est envoyée
**Then** le bouton est désactivé pendant la requête, puis une animation de célébration s'affiche avec "On a hâte de vous voir !" (FR14)

**Given** l'invité appuie sur "Je ne pourrai pas"
**When** la requête PUT est envoyée avec status: declined
**Then** un message empathique s'affiche "Nous comprenons, vous nous manquerez" (FR15)

**Given** l'overlay ouvert
**When** l'invité clique en dehors ou appuie sur le X
**Then** l'overlay se ferme sans soumettre de réponse

### Story 3.4: Modification & Pré-affichage RSVP

As a invité ayant déjà répondu,
I want revoir et modifier ma réponse RSVP en revisitant mon lien,
So that je puisse changer d'avis ou ajuster le nombre de personnes.

**Acceptance Criteria:**

**Given** un invité avec status "confirmed" et personsConfirmed = 3
**When** il revisite son lien et ouvre l'overlay RSVP
**Then** le formulaire affiche son statut actuel ("Vous avez confirmé pour 3 personnes") et le nombre est pré-rempli à 3 (FR18, FR19)

**Given** un invité avec status "declined"
**When** il revisite et ouvre l'overlay
**Then** le formulaire affiche "Vous avez décliné l'invitation" avec la possibilité de changer en confirmation

**Given** un invité confirmé pour 3 personnes
**When** il modifie à 5 personnes et soumet
**Then** la mise à jour est sauvegardée en base et le message de succès s'affiche (FR16)

**Given** un invité confirmé
**When** il change sa réponse en "Je ne pourrai pas"
**Then** le statut passe à "declined", personsConfirmed à 0, et le message empathique s'affiche

**Given** un invité avec status "pending" (jamais répondu)
**When** il ouvre l'overlay
**Then** le formulaire est vierge (nombre par défaut 1), sans message de statut précédent

**Given** un invité qui modifie sa réponse à n'importe quel moment après sa réponse initiale
**When** la modification est soumise
**Then** aucune limite de temps ne bloque la soumission — la modification est toujours possible (FR16)

## Epic 4: Administration

Ahmed & Ghizlaine gèrent la liste d'invités, suivent les confirmations et contrôlent les sections visibles du site.

### Story 4.1: Authentification Admin

As a admin (Ahmed ou Ghizlaine),
I want me connecter à l'espace admin avec un mot de passe,
So that je puisse accéder à la gestion des invités de manière sécurisée.

**Acceptance Criteria:**

**Given** un visiteur non authentifié
**When** il accède à `/admin`
**Then** il est redirigé vers `/admin/login`

**Given** la page `/admin/login`
**When** elle s'affiche
**Then** un formulaire simple avec un champ mot de passe et un bouton "Connexion" est visible, dans le layout admin (sans animations, style utilitaire)

**Given** le mot de passe correct saisi
**When** le formulaire est soumis (POST `/api/admin/login`)
**Then** le mot de passe est vérifié via bcrypt, un token de session est généré (nanoid), stocké dans `admin_sessions`, et un cookie HttpOnly `admin_token` (expiration 24h) est posé. Redirect vers `/admin`.

**Given** un mot de passe incorrect
**When** le formulaire est soumis
**Then** la réponse est 401 avec un message "Mot de passe incorrect", sans révéler si le compte existe

**Given** 5 tentatives échouées en 15 minutes depuis la même IP
**When** une nouvelle tentative arrive
**Then** la réponse est 429 "Trop de tentatives, réessayez plus tard" (rate limiting middleware, NFR10)

**Given** un admin authentifié avec un cookie `admin_token` valide
**When** il accède à `/admin`
**Then** le middleware vérifie le token dans `admin_sessions`, confirme qu'il n'est pas expiré, et autorise l'accès

**Given** un cookie `admin_token` expiré ou invalide
**When** l'admin accède à `/admin`
**Then** il est redirigé vers `/admin/login`

### Story 4.2: Dashboard & Liste des Invités

As a admin,
I want voir la liste complète des invités avec leurs statuts et un compteur de confirmations,
So that je puisse suivre l'avancement des réponses en un coup d'œil.

**Acceptance Criteria:**

**Given** l'admin authentifié sur `/admin`
**When** le dashboard se charge
**Then** un compteur résumé s'affiche en haut : "X confirmés / Y invités (Z personnes au total)"

**Given** le dashboard chargé
**When** la liste des invités s'affiche (GET `/api/admin/guests`)
**Then** un tableau (shadcn/ui Table) affiche pour chaque invité : nom complet, statut (Badge coloré : vert=confirmé, orange=en attente, rouge=décliné), nombre de personnes confirmées, lien unique (FR22, FR26)

**Given** la liste des invités
**When** l'admin la consulte
**Then** les invités sont triés par nom par défaut

**Given** le dashboard sur mobile
**When** l'admin le consulte
**Then** le tableau est lisible avec scroll horizontal si nécessaire, ou les données sont empilées en cards sur petit écran

### Story 4.3: Ajout & Suppression d'Invités

As a admin,
I want ajouter de nouveaux invités et supprimer ceux qui ne sont plus concernés,
So that je puisse constituer et maintenir ma liste d'invités à jour.

**Acceptance Criteria:**

**Given** l'admin sur le dashboard
**When** il clique sur "Ajouter un invité"
**Then** un formulaire (Dialog shadcn/ui) s'ouvre avec les champs : prénom, nom, groupe (optionnel), nombre max de personnes (défaut 1)

**Given** le formulaire rempli avec prénom "Fatima" et nom "Azami"
**When** l'admin soumet (POST `/api/admin/guests`)
**Then** un slug unique est généré (nanoid 10 chars), l'invité est créé en base avec status "pending", et le lien unique complet est affiché pour copie (FR23, FR9)

**Given** le formulaire soumis avec un prénom vide
**When** la validation Zod s'exécute
**Then** une erreur de validation s'affiche côté client avant l'envoi

**Given** un invité dans la liste
**When** l'admin clique sur "Supprimer" et confirme dans le dialog de confirmation
**Then** l'invité est supprimé de la base (DELETE `/api/admin/guests/[id]`) et disparaît de la liste (FR24)

**Given** la suppression d'un invité
**When** la requête est traitée
**Then** le compteur du dashboard se met à jour automatiquement

### Story 4.4: Modification Manuelle du Statut RSVP

As a admin,
I want modifier le statut RSVP d'un invité manuellement,
So that je puisse corriger les erreurs ou enregistrer les confirmations reçues par téléphone.

**Acceptance Criteria:**

**Given** un invité dans la liste avec status "declined"
**When** l'admin clique sur "Modifier" pour cet invité
**Then** un formulaire d'édition s'ouvre avec le statut actuel et le nombre de personnes pré-remplis

**Given** le formulaire d'édition ouvert
**When** l'admin change le statut en "confirmed" et le nombre à 2
**Then** la mise à jour est sauvegardée (PUT `/api/admin/guests/[id]`) et la liste se rafraîchit avec les nouvelles données (FR25)

**Given** le formulaire d'édition
**When** l'admin met un nombre de personnes > 5 ou < 0
**Then** la validation Zod bloque la soumission avec un message d'erreur

**Given** la modification du statut
**When** la requête est traitée
**Then** le compteur du dashboard se met à jour

### Story 4.5: Toggles Sections du Site

As a admin,
I want activer ou désactiver les sections "Lieu" et "Programme" du site,
So that je puisse contrôler le timing de l'information révélée aux invités.

**Acceptance Criteria:**

**Given** l'admin sur le dashboard
**When** il voit la zone de configuration
**Then** deux toggles (Switch shadcn/ui) sont affichés : "Section Lieu" et "Section Programme" avec leur état actuel (on/off)

**Given** le toggle "Section Lieu" sur off
**When** l'admin le bascule sur on
**Then** une requête PUT `/api/admin/config` met à jour `show_venue = true` en base et le toggle reflète le nouvel état (FR27)

**Given** le toggle "Section Programme" sur on
**When** l'admin le bascule sur off
**Then** `show_program = false` en base et les invités qui chargent la page ne voient plus la section Programme (FR28)

**Given** un toggle modifié
**When** un invité recharge sa page
**Then** la section apparaît ou disparaît selon la nouvelle valeur en base (pas besoin de redéploiement)

## Epic 6: Animation des Alliances au Scroll

Deux alliances — or (Ghizlaine) et argent/platine (Ahmed) — accompagnent visuellement le parcours de l'invité tout au long du scroll. Elles flottent sur les bords de l'écran, se rapprochent progressivement, et s'entrelacent à la dernière section pour révéler la photo du couple.

### Story 6.1: Assets et Rendu Réaliste des Alliances

As a développeur,
I want créer les assets SVG des deux alliances avec un rendu réaliste,
So that les alliances soient visuellement impressionnantes et crédibles sur tous les écrans.

**Acceptance Criteria:**

**Given** l'alliance de Ghizlaine
**When** elle est rendue à l'écran
**Then** c'est un anneau en or avec un rendu réaliste incluant reflets, ombres et aspect métallique doré

**Given** l'alliance d'Ahmed
**When** elle est rendue à l'écran
**Then** c'est un anneau en argent/platine avec un rendu réaliste incluant reflets, ombres et aspect métallique argenté

**Given** les deux alliances
**When** elles sont affichées sur un écran Retina (2x) et un écran standard
**Then** le rendu SVG est net et détaillé à toutes les résolutions sans pixellisation

**Given** les assets SVG
**When** ils sont chargés
**Then** le poids total des deux assets est optimisé (< 50KB combiné) pour ne pas impacter le temps de chargement (NFR1)

### Story 6.2: Animation Scroll-Driven des Alliances

As a invité,
I want voir les deux alliances flotter sur les bords de l'écran et se rapprocher au fil de mon scroll,
So that mon parcours soit accompagné d'une animation élégante et immersive.

**Acceptance Criteria:**

**Given** la page invité chargée (section hero visible)
**When** l'invité scrolle après le hero (première transition)
**Then** les alliances apparaissent en fondu depuis les bords — or (Ghizlaine) à gauche, argent (Ahmed) à droite. Elles ne sont PAS visibles sur le hero pour ne pas diluer l'impact émotionnel d'entrée

**Given** l'invité qui commence à scroller
**When** le pourcentage de scroll augmente de 0% à 100%
**Then** les alliances se rapprochent progressivement du centre de l'écran de manière fluide et continue (FR32)

**Given** l'animation en cours
**When** l'invité scrolle
**Then** les alliances tournent lentement sur elles-mêmes et grandissent légèrement, le tout synchronisé au pourcentage de scroll

**Given** l'animation sur un smartphone milieu de gamme (iPhone 11, Galaxy A52)
**When** l'invité scrolle
**Then** l'animation reste fluide à 60fps sans saccade ni impact sur la performance du scroll (NFR2)

**Given** les alliances en mouvement pendant les sections de contenu (timeline, lieu, programme)
**When** elles coexistent avec le texte
**Then** les alliances sont à ~30-40% d'opacité pour ne pas distraire de la lecture. Elles passent à 100% d'opacité uniquement lors de la révélation finale. Zone de sécurité : max 15% de la largeur de chaque côté sur desktop

**Given** l'invité qui scrolle vers le haut (scroll inversé)
**When** le pourcentage de scroll diminue
**Then** les alliances se séparent à nouveau de manière fluide — l'animation est entièrement bidirectionnelle pour que l'effet reste cohérent en remontant puis en redescendant

**Given** un navigateur ne supportant pas les CSS Scroll-Driven Animations
**When** la page s'affiche
**Then** les alliances sont masquées ou affichées statiquement (dégradation gracieuse)

### Story 6.3: Révélation Finale — Photo du Couple

As a invité arrivant à la dernière section,
I want voir les deux alliances s'entrelacer et révéler la photo d'Ahmed et Ghizlaine à l'intérieur,
So that le parcours scroll culmine dans un moment émotionnel fort.

**Acceptance Criteria:**

**Given** l'invité qui atteint la dernière section (scroll ~90-100%)
**When** les alliances arrivent au centre
**Then** elles s'entrelacent avec un léger ralentissement (easing cubic-bezier avec décélération) et un subtil éclat doré (glow) au moment de l'union

**Given** les alliances entrelacées
**When** l'animation d'entrelacement est terminée
**Then** la photo du couple apparaît en fondu progressif (600-800ms) à l'intérieur de l'espace formé par les deux anneaux unis, comme un voile qui se lève (FR33)

**Given** la photo révélée
**When** elle est affichée
**Then** elle remplit l'intérieur des alliances entrelacées (les alliances servent de cadre, la photo ne déborde pas)

**Given** l'emplacement photo
**When** le développeur intègre une image
**Then** l'emplacement est générique et adaptable (accepte n'importe quelle photo aux bonnes proportions)

**Given** la révélation sur mobile
**When** la dernière section est atteinte
**Then** l'entrelacement et la photo sont visibles et correctement dimensionnés sur petit écran

### Story 6.4: Responsive et Performance Mobile

As a invité sur mobile,
I want voir l'animation des alliances adaptée à mon petit écran sans perte de fluidité,
So that l'expérience soit aussi immersive sur mobile que sur desktop.

**Acceptance Criteria:**

**Given** un écran mobile (375px - 428px)
**When** les alliances sont affichées
**Then** elles sont plus petites et plus transparentes que sur desktop, positionnées davantage en haut/bas plutôt que strictement gauche/droite, pour s'adapter à l'espace réduit tout en maintenant la narration des deux alliances (Option A mobile)

**Given** le rapprochement des alliances sur mobile
**When** l'invité scrolle
**Then** les alliances restent dans les limites de l'écran (zone de sécurité : max 10% de la largeur de chaque côté) et ne recouvrent pas le contenu central

**Given** l'animation sur un appareil avec `prefers-reduced-motion: reduce`
**When** l'utilisateur a activé ce réglage système
**Then** les animations de rotation et de déplacement sont désactivées — les alliances sont affichées statiquement

**Given** la page sur tablette (768px - 1024px)
**When** les alliances sont affichées
**Then** la taille et le positionnement s'adaptent de manière fluide entre mobile et desktop

**Given** la performance totale de la page avec les alliances
**When** Lighthouse est exécuté sur mobile
**Then** le score Performance reste > 85 (NFR5)

## Epic 7: Landing Page Non-Invités

Un visiteur accédant à la racine du site sans lien d'invitation voit une page placeholder l'invitant à contacter Ahmed ou Ghizlaine.

### Story 7.1: Page d'Accueil Placeholder

As a visiteur non-invité,
I want voir une page d'accueil claire quand j'accède au site sans lien d'invitation,
So that je comprenne que je dois contacter Ahmed ou Ghizlaine pour recevoir mon invitation.

**Acceptance Criteria:**

**Given** un visiteur qui accède à `/` (racine du site)
**When** la page se charge
**Then** une page placeholder s'affiche avec un message chaleureux : "Ce site est réservé aux invités d'Ahmed & Ghizlaine. Si vous souhaitez recevoir votre invitation, n'hésitez pas à les contacter."

**Given** la page placeholder
**When** elle est affichée
**Then** elle utilise le même design system que le reste du site (fond crème rosé, typographie Cormorant/Geist, palette florale rose) pour rester cohérente

**Given** la page sur mobile
**When** elle est affichée
**Then** le message est centré, lisible et correctement espacé sans scroll horizontal

**Given** la page placeholder
**When** elle est indexée par les moteurs de recherche
**Then** les balises meta indiquent `noindex, nofollow` pour ne pas référencer le site publiquement

> **Note :** Epic 7 a été remplacée par le Save the Date (Epic 8). La page `/` affiche désormais l'animation Save the Date au lieu du placeholder.

## Epic 8: Page Save the Date — Contenu & Cadre Doré

L'invité qui ouvre le lien `/` voit immédiatement le contenu Save the Date (prénoms, date, lieu, message poétique) sur un écran crème élégant avec fond responsive. L'expérience est parfaite pour les utilisateurs `prefers-reduced-motion` et accessible à tous les lecteurs d'écran.

### Story 8.1: Fondation — Layout, Police & Tokens CSS

As a invité,
I want la page `/` s'affiche avec un fond crème `#FAF7F2` et la police Cormorant Garamond chargée,
So that je vois immédiatement un écran élégant et cohérent avec l'univers du mariage.

**Acceptance Criteria:**

**Given** un visiteur accède à la page `/`
**When** la page se charge
**Then** le fond est `#FAF7F2` (crème chaud) et occupe `min-h-dvh`
**And** la police Cormorant Garamond (poids 300, 400) est chargée via `next/font/google` dans `app/layout.tsx` avec la variable CSS `--font-cormorant`
**And** les tokens d'animation sont définis dans `globals.css` (`@theme inline`) : `--animation-act1` (1500ms), `--animation-act2` (1200ms), `--animation-pause` (300ms), `--animation-act3` (2000ms), `--easing-flight`, `--easing-land`, `--easing-reveal`
**And** `app/page.tsx` remplace l'ancienne landing page non-invités

### Story 8.2: Contenu Save the Date — HTML Sémantique & Texte

As a invité,
I want voir les prénoms du couple, la date, le lieu et un message poétique affichés de manière lisible et élégante,
So that je retiens immédiatement la date et le lieu du mariage.

**Acceptance Criteria:**

**Given** un visiteur accède à la page `/`
**When** la page se charge
**Then** le contenu est affiché centré avec :
- `h1` : "Ahmed & Ghizlaine" en Cormorant Garamond 300, couleur `#2C2418`
- `time` : "17 Octobre 2026" en Cormorant Garamond 400, couleur `#6B3A4E` (mauve-deep)
- `address` : "Casablanca" en Cormorant Garamond 400, couleur `#4A5E3A` (olive-deep)
- Séparateur doré `w-12` couleur `#B8860B`
- `blockquote` : message poétique en Geist Sans italique, couleur `#7A5A6A` (mauve-soft)

### Story 8.3: Cadre Doré — SVG Décoratif

As a invité,
I want voir un cadre doré fin encadrant le contenu,
So that l'écran évoque un faire-part physique premium.

**Acceptance Criteria:**

**Given** un visiteur accède à la page `/`
**When** la page se charge
**Then** le composant `GoldenFrame` est un conteneur layout invisible (sans bordure ni ornement visible — la direction visuelle a évolué vers "Épure + Image d'Arrière-Plan")

### Story 8.4: Responsive & Accessibilité — Validation Complète

As a invité sur mobile ou desktop,
I want que la page s'affiche parfaitement sur tous les écrans de 360px à 1920px,
So that l'expérience est élégante quelle que soit la taille de mon écran.

**Acceptance Criteria:**

**Given** `prefers-reduced-motion` activé
**When** la page se charge
**Then** le contenu textuel est affiché directement sans animation, aucun pigeon ni enveloppe affiché

**Given** un lecteur d'écran
**When** le contenu est lu
**Then** l'ordre est : "Ahmed & Ghizlaine" → "17 Octobre 2026" → "Casablanca" → message poétique
**And** les éléments décoratifs sont ignorés (`aria-hidden`)
**And** Lighthouse Performance > 85 sur mobile

## Epic 9: Animation Pigeon Voyageur — Le Spectacle en 3 Actes

L'invité vit une micro-narration animée de 5 secondes : un pigeon stylisé Lottie entre en vol, dépose une enveloppe cachetée A&G, s'envole, puis l'enveloppe s'ouvre pour révéler le contenu Save the Date.

### Story 9.1: Sceau A&G — SVG Monogramme

As a invité,
I want voir un sceau doré portant les initiales "A&G" entouré d'entrelacs géométriques,
So that le cachet personnalisé renforce le sentiment d'invitation sur mesure.

**Acceptance Criteria:**

**Given** le composant `SealAG` est rendu
**When** il s'affiche
**Then** un cercle doré (`#B8860B`) contient les initiales "A" et "G" en serif élégante avec "&" entre les deux
**And** des motifs géométriques arabesques entourent le monogramme en `#D4A54A`
**And** SVG inline dans `components/save-the-date/seal-ag.tsx`, Server Component, `aria-hidden="true"`

### Story 9.2: Enveloppe — SVG + Animation Ouverture

As a invité,
I want voir une enveloppe élégante dont le sceau se brise et le rabat se soulève,
So that l'ouverture crée l'anticipation de la révélation.

**Acceptance Criteria:**

**Given** le composant `Envelope` est rendu
**When** l'animation Acte 3 démarre
**Then** le sceau se réduit (`seal-break`), le rabat se soulève (`envelope-open` via `rotateX()`), l'enveloppe disparaît (`opacity: 0`)
**And** SVG inline dans `components/save-the-date/envelope.tsx`, coins arrondis, ombre portée
**And** en `prefers-reduced-motion` : `display: none`

### Story 9.3: Pigeon Voyageur — Lottie + Animation Vol

As a invité,
I want voir un pigeon stylisé entrer en vol gracieux et déposer l'enveloppe,
So that la narration du messager crée l'émerveillement.

**Acceptance Criteria:**

**Given** le composant `PigeonVoyageur` est rendu
**When** l'animation démarre
**Then** le pigeon entre via Lottie (`lottie-react`) avec trajectoire CSS keyframes `translate` + `rotate`
**And** deux fichiers Lottie : `oiseau.json` (mobile), `pigeon.json` (desktop ≥1024px)
**And** Client Component (`'use client'`), fichiers chargés via `fetch()` + `useEffect`
**And** en `prefers-reduced-motion` : `display: none`

### Story 9.4: Orchestration Animation — Timeline 5000ms

As a invité,
I want que l'animation se joue en séquence cohérente de 5 secondes au chargement,
So that je vis un spectacle de 3 actes sans saccade.

**Acceptance Criteria:**

**Given** un visiteur accède à `/` (animations autorisées)
**When** la page se charge
**Then** le Client Component `SaveTheDateScene` gère le gating :
- Attend chargement Lottie + 2 `requestAnimationFrame` (ou timeout 3s)
- Ajoute `.scene-ready` → animations CSS démarrent
- Ajoute `.pigeon-done` (3600ms) et `.envelope-done` (5100ms) pour protection breakpoint
**And** l'animation se joue une seule fois (`animation-iteration-count: 1`)
**And** 60fps sans jank sur iPhone 11 / Galaxy A52

## Epic 10: Open Graph & Favicon Save the Date

Aperçu WhatsApp visuel attractif avec enveloppe dorée fermée + sceau A&G. Favicon personnalisé dans l'onglet du navigateur.

### Story 10.1: Image Open Graph + Favicon (Satori)

As a invité qui reçoit le lien `/` sur WhatsApp,
I want voir un aperçu visuel avec une enveloppe dorée et le titre "Ahmed & Ghizlaine — Save the Date",
So that ma curiosité est piquée et j'ai envie d'ouvrir le lien.

**Acceptance Criteria:**

**Given** le lien `/` est partagé sur WhatsApp
**When** la plateforme génère l'aperçu
**Then** une image OG 1200×630px s'affiche : enveloppe fermée + sceau A&G sur fond crème
**And** `og:title` : "Ahmed & Ghizlaine — 17 Octobre 2026"
**And** fichier `app/opengraph-image.tsx` via `ImageResponse` (Satori)
**And** police locale `/public/fonts/cormorant-garamond-light.ttf` via `readFileSync`
**And** `runtime = 'nodejs'`, prerender statique
**And** favicon `app/icon.tsx` : sceau A&G simplifié 48×48px (Satori)
**And** `metadataBase: new URL("https://ag-wedding.com")` dans `layout.tsx`
