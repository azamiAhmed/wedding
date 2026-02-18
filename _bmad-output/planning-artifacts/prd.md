---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish']
inputDocuments:
  - '_bmad-output/brainstorming/brainstorming-session-2026-02-12.md'
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 1
  projectDocs: 0
classification:
  projectType: 'Web App SPA avec routing dynamique (Next.js)'
  domain: 'Général (événementiel)'
  complexity: 'Moyenne-basse'
  projectContext: 'greenfield'
  uxRequirement: 'Élevée — scroll animations, style Apple, transitions fluides (must-have)'
workflowType: 'prd'
---

# Product Requirements Document - Site de Mariage Ahmed & Ghizlaine

**Auteur :** Mister Azami
**Date :** 2026-02-12

## Résumé Exécutif

### Vision

Un site de mariage personnel qui transforme une simple invitation en une expérience émotionnelle et interactive. Chaque invité reçoit un lien unique via WhatsApp, découvre un site au design premium avec scroll animations style Apple, et confirme sa présence en moins de 10 secondes.

### Différenciateur

Ce n'est pas un template de mariage — c'est une invitation vivante. Le lien unique par invité personnalise l'expérience dès l'ouverture, le RSVP émotionnel ("Je serai là") remplace le formulaire administratif, et le design soigné provoque un "c'est trop propre" même chez les profils tech-savvy.

### Utilisateurs cibles

- **Invités** (200 personnes) — reçoivent un lien WhatsApp, découvrent le site, confirment leur présence
- **Ahmed & Ghizlaine** (admin) — gèrent la liste d'invités, suivent les confirmations, contrôlent les sections visibles

### Contexte projet

- Mariage le **17 octobre 2026**
- Développeur solo (Ahmed), soirs et week-ends
- Stack : Next.js 16, Vercel, base de données compatible Vercel
- Site opérationnel min. 4 semaines avant le mariage

## Critères de Succès

### Succès Utilisateur

- L'invité confirme sa présence en moins de 10 secondes
- Parcours WhatsApp → site → confirmation sans friction (3 clics max)
- Le site provoque un effet "waouh" visuel même chez les profils exigeants
- Chargement sous 3 secondes en 4G sur mobile

### Succès Business

- 200 invités reçoivent leur lien unique avant le 17 octobre 2026
- Le site réduit les relances manuelles — les confirmations arrivent naturellement
- Confirmations mixtes acceptées (site + appels) — le site n'a pas besoin de capturer 100%

### Succès Technique

- Mobile-first responsive — expérience premium sur tous les écrans
- Scroll animations fluides sans dégradation de performance sur téléphones moyens
- Images et médias optimisés pour la 4G
- Sections optionnelles activables/désactivables sans redéploiement

### Résultats Mesurables

- Temps de confirmation RSVP < 10 secondes
- Chargement initial < 3 secondes (4G mobile)
- 0 bug bloquant le parcours RSVP
- Site opérationnel minimum 4 semaines avant le 17 octobre

## User Journeys

### Parcours 1 — Tante Fatima (58 ans, peu tech-savvy)

**Scène d'ouverture :** Fatima est chez elle, un soir en semaine. Son téléphone vibre — un message WhatsApp d'Ahmed. Elle voit un joli aperçu avec une image élégante et le texte "Ahmed & Ghizlaine vous invitent". Elle sourit, elle savait que ça arrivait, et appuie sur le lien.

**Action montante :** Le site s'ouvre en moins de 3 secondes. Elle voit une belle photo du couple, les prénoms en grand, une animation douce qui l'accueille. Elle est touchée. Elle remarque un bouton flottant "Confirmer ma présence" mais elle a envie de voir la suite. Elle scrolle un peu — quelques photos, la timeline du couple... c'est beau, c'est simple. Mais elle n'a pas la patience de tout voir maintenant.

**Moment clé :** Elle appuie sur le bouton flottant. Un overlay s'ouvre — son nom est déjà pré-rempli. Elle voit "Nous serons" avec un chiffre à ajuster. Elle met 1. Elle appuie sur "Je serai là". Terminé. Moins de 10 secondes.

**Résolution :** Une petite animation de célébration s'affiche. Fatima sourit. Elle ferme le site. Sa confirmation est enregistrée.

**Scénario d'erreur :** Fatima appuie par accident sur "Je ne pourrai pas". Elle panique, rappelle Ahmed. Ahmed va sur l'admin, corrige le statut en 2 clics. Problème résolu.

### Parcours 2 — Karim (28 ans, hyper-connecté)

**Scène d'ouverture :** Karim reçoit le lien WhatsApp d'Ahmed. L'aperçu Open Graph est propre — il est déjà intrigué. Il ouvre le lien en se disant "voyons voir ce qu'Ahmed a fait".

**Action montante :** Le site charge instantanément. L'animation d'entrée est fluide — les éléments apparaissent avec des transitions soignées. Karim scrolle lentement, il **savoure**. Les photos se révèlent au scroll avec un style Apple, les animations parallax sont smooth, la typo est moderne. Il pense "c'est pas un template ça".

**Moment clé :** Il arrive à la timeline "Notre Histoire" — les étapes apparaissent au scroll, c'est narratif, c'est bien fait. Il continue jusqu'au bout. Puis il appuie sur le bouton RSVP. L'overlay s'ouvre, son nom est pré-rempli, il confirme pour 1 personne. "Je serai là."

**Résolution :** L'animation post-confirmation le fait sourire. Il prend un screenshot du site et l'envoie à un ami : "regarde le site de mariage d'Ahmed, c'est trop propre". Mission accomplie.

**Scénario d'erreur :** Si le site est lent, si les animations saccadent, ou si le RSVP a l'air d'un formulaire Google Forms basique — Karim est déçu. L'impression "fait maison cheap" tue l'expérience.

### Parcours 3 — Ami Youssef (35 ans, vient en famille)

**Scène d'ouverture :** Youssef reçoit le lien d'Ahmed sur WhatsApp. Il ouvre le site rapidement — il sait qu'il doit confirmer pour toute sa famille.

**Action montante :** Il scrolle rapidement le site, apprécie le design mais son objectif est clair : confirmer. Il appuie sur le bouton flottant RSVP.

**Moment clé :** L'overlay s'ouvre. Il voit son prénom pré-rempli. Il voit le champ "Nous serons" — il met 4 (lui, sa femme, leurs 2 enfants). Il appuie sur "Je serai là". Confirmation pour 4 personnes en une seule action.

**Résolution :** Quelques jours plus tard, sa belle-sœur lui dit qu'elle viendra aussi. Youssef reclique sur son lien WhatsApp, le site s'ouvre, il retourne sur le RSVP — son ancienne réponse est là, il modifie de 4 à 5. Sauvegardé.

**Scénario d'erreur :** Youssef met 4 mais voulait mettre 5. Il ne sait pas qu'il peut modifier. Il appelle Ahmed. Ahmed lui dit de recliquer sur son lien, ou corrige en admin directement.

### Parcours 4 — Ahmed & Ghizlaine (Admin couple)

**Scène d'ouverture :** C'est 6 semaines avant le mariage. Ahmed a sa liste de 200 invités prête. Il va sur `/admin`, entre le mot de passe, et accède au tableau de bord.

**Action montante :** Il ajoute tous les invités — nom, prénom — et génère un lien unique pour chacun. Il active les sections "Accueil", "Notre Histoire", "RSVP" et garde "Lieu" et "Programme" désactivés pour l'instant. Il envoie les premiers liens via WhatsApp.

**Moment clé :** Les jours passent. Ahmed checke l'admin sur son téléphone dans le métro. La liste affiche les statuts : confirmé, en attente, décliné. Il voit que Tante Fatima a décliné par erreur — il corrige son statut. Il voit que Youssef a confirmé pour 5. Tout est clair.

**Résolution :** À 4 semaines du mariage, il active la section "Lieu" et "Programme". Les invités qui revisitent le site voient maintenant les nouvelles infos. Ghizlaine fait les mêmes vérifications de son côté sur son mobile — même accès, mêmes droits.

**Scénario d'erreur :** Ahmed ajoute un invité mais oublie de lui envoyer le lien. Il s'en rend compte en consultant la liste des statuts.

## Exigences Techniques & Plateforme

### Type de Projet

Application web monopage (SPA) construite avec Next.js 16 et App Router. Page unique à défilement continu côté invité, espace admin séparé accessible via `/admin`. Déployé sur Vercel avec domaine personnalisé.

### Compatibilité Navigateurs

| Navigateur | Priorité | Notes |
|-----------|----------|-------|
| Safari (iOS) | Principale | Majorité des invités via WhatsApp sur iPhone |
| Chrome (Android) | Principale | Invités Android via WhatsApp |
| Chrome (Desktop) | Secondaire | Usage admin |
| Safari (macOS) | Secondaire | Usage admin |
| Firefox | Faible | Support de base |

Ciblage : navigateurs modernes uniquement (2 dernières versions majeures). Pas de support IE.

### Design Responsive

- **Mobile-first** : conception prioritaire pour écrans mobiles (360px - 428px)
- **Desktop** : adaptation pour l'admin et les invités sur ordinateur
- Breakpoints : mobile → tablette → desktop

### Stratégie SEO & Open Graph

- SEO **non applicable** — les invités arrivent exclusivement via liens uniques WhatsApp
- Focus sur l'Open Graph : aperçu WhatsApp soigné (image, titre, description)

## Scoping & Développement Phasé

### Stratégie MVP

**Approche :** MVP d'expérience — livrer le parcours complet invité (WhatsApp → site → RSVP) avec un design premium, même si certaines fonctionnalités admin sont minimales.

### MVP (Phase 1)

**Parcours invité :**
- Landing émotionnel (photo + prénoms + animation d'entrée)
- Scroll animations & design style Apple (fallback design simple si contrainte temps)
- Timeline "Notre Histoire" (rencontre → fiançailles → Jour J)
- Système de liens uniques par invité
- RSVP en overlay (nom pré-rempli, nombre de personnes max 5, confirmer/décliner)
- Modification de réponse RSVP via le même lien
- Bouton RSVP flottant toujours visible
- Open Graph WhatsApp soigné

**Admin :**
- Accès `/admin` avec mot de passe
- Liste invités avec statuts (confirmé / en attente / décliné)
- Modifier le statut RSVP par invité
- Toggles show/hide sections (Lieu, Programme)
- CRUD invités (ajouter / supprimer)
- Interface mobile-first

### Phase 2 — Growth (Post-lancement)

- Marqueur "lien envoyé / non envoyé" par invité
- Stats visuelles (compteur confirmés / en attente / déclinés)
- Export PDF / Excel de la liste invités
- Animation de célébration post-confirmation
- Personnalisation du message d'accueil par invité
- Compte à rebours Jour J
- Gestion du contenu via interface admin (CMS léger)

### Phase 3 — Vision (Si le temps le permet)

- Micro-vidéo loop en landing
- Monogramme A&G animé
- Perspective inversée ("Vous êtes attendu(e)")
- Compte à rebours évolutif (intensification visuelle à l'approche du mariage)

### Risques et Mitigations

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Animations trop longues à développer | Retard lancement | Fallback design propre sans animations poussées, ajout progressif |
| Développeur solo, temps limité | Scope creep | MVP strict, pas de feature ajoutée en cours de route |
| Performance mobile des animations | UX dégradée | Tester tôt sur appareils réels, réduire si saccades |
| 200 invités = charge | Problème technique | Négligeable — Next.js + base simple gère ça sans souci |

## Exigences Fonctionnelles

### Accueil & Expérience Visuelle

- **FR1 :** L'invité peut voir une page d'accueil émotionnelle avec photo du couple, prénoms et animation d'entrée
- **FR2 :** L'invité peut découvrir le contenu du site via un défilement continu avec animations au scroll
- **FR3 :** L'invité peut naviguer le site de manière fluide sur mobile et desktop

### Contenu & Narration

- **FR4 :** L'invité peut parcourir une timeline "Notre Histoire" retraçant les étapes du couple (rencontre → fiançailles → Jour J)
- **FR5 :** L'invité peut voir la section "Lieu du mariage" lorsqu'elle est activée par l'admin
- **FR6 :** L'invité peut voir la section "Programme de la journée" lorsqu'elle est activée par l'admin

### Système de Liens Uniques

- **FR7 :** Chaque invité possède un lien unique qui l'identifie automatiquement sur le site
- **FR8 :** L'invité peut accéder au site via son lien unique et voir son prénom affiché
- **FR9 :** Le système peut générer un lien unique pour chaque invité ajouté
- **FR10 :** Le système affiche une page d'erreur gracieuse lorsqu'un lien invalide est utilisé

### Confirmation de Présence (RSVP)

- **FR11 :** L'invité peut accéder au formulaire RSVP via un bouton flottant visible à tout moment
- **FR12 :** L'invité peut voir son nom pré-rempli dans le formulaire RSVP
- **FR13 :** L'invité peut indiquer le nombre de personnes accompagnantes (de 1 à 5)
- **FR14 :** L'invité peut confirmer sa présence ("Je serai là")
- **FR15 :** L'invité peut décliner l'invitation ("Je ne pourrai pas")
- **FR16 :** L'invité peut modifier sa réponse RSVP (présence et nombre d'accompagnants) en revisitant son lien unique, sans aucune limite de temps
- **FR17 :** Le formulaire RSVP s'affiche en overlay sans quitter la page principale
- **FR18 :** L'invité peut voir son statut RSVP actuel lorsqu'il revient sur son lien
- **FR19 :** Le système conserve et pré-affiche la dernière réponse RSVP de l'invité dans le formulaire

### Partage & Aperçu Social

- **FR20 :** Le lien unique affiche un aperçu Open Graph soigné lors du partage sur WhatsApp (image, titre, description)

### Gestion des Invités (Admin)

- **FR21 :** L'admin peut se connecter à l'espace admin via `/admin` avec un mot de passe
- **FR22 :** L'admin peut consulter la liste complète des invités avec leur statut (confirmé / en attente / décliné)
- **FR23 :** L'admin peut ajouter un nouvel invité (nom, prénom) et obtenir son lien unique
- **FR24 :** L'admin peut supprimer un invité de la liste
- **FR25 :** L'admin peut modifier le statut RSVP d'un invité manuellement
- **FR26 :** L'admin peut voir le nombre de personnes confirmées par invité

### Configuration du Site (Admin)

- **FR27 :** L'admin peut activer ou désactiver la section "Lieu du mariage"
- **FR28 :** L'admin peut activer ou désactiver la section "Programme de la journée"

### Gestion du Contenu

- **FR29 :** Le contenu des sections (textes, photos, adresse du lieu, étapes de la timeline) est géré directement dans le code source

### Animation des Alliances au Scroll

- **FR31 :** Deux alliances animées (or pour Ghizlaine, argent/platine pour Ahmed) flottent sur les bords de l'écran et accompagnent le scroll de l'invité
- **FR32 :** Les alliances se rapprochent au fil du scroll par une animation fluide et continue liée au pourcentage de défilement
- **FR33 :** À la dernière section, les alliances s'entrelacent et révèlent la photo du couple dans l'espace intérieur

### Landing Page Non-Invités

- **FR34 :** Un visiteur accédant à la racine du site (/) sans lien d'invitation voit une landing page placeholder l'invitant à contacter Ahmed ou Ghizlaine

## Exigences Non-Fonctionnelles

### Performance

- Chargement initial < 3 secondes en 4G mobile
- Scroll animations fluides à 60fps sur smartphones milieu de gamme (ex: iPhone 11, Samsung Galaxy A52)
- Time to Interactive (TTI) < 4 secondes sur mobile
- Images optimisées : lazy loading, formats modernes (WebP/AVIF), compression adaptative
- Score Lighthouse Performance > 85 sur mobile

### Sécurité

- Connexion admin protégée par mot de passe
- HTTPS obligatoire sur l'ensemble du site (fourni par Vercel)
- Liens uniques non devinables (identifiants aléatoires suffisamment longs)
- Pas d'exposition des données invités dans les API publiques
- Protection basique contre les accès non autorisés à l'espace admin (rate limiting sur les tentatives de connexion)

### Fiabilité

- Disponibilité cible : 99% (tolérance de quelques heures d'indisponibilité occasionnelle)
- Pas de perte de données RSVP — les confirmations doivent être persistées de manière fiable
- Hébergement sur Vercel — CDN global et haute disponibilité de la plateforme
- Backups réguliers de la base de données invités

### Accessibilité

- Contrastes de couleurs corrects (ratio WCAG AA pour le texte)
- Navigation clavier basique fonctionnelle
- Textes alternatifs sur les images principales

### Contraintes Techniques

- Framework : Next.js 16 avec App Router, déployé sur Vercel
- Base de données : solution compatible Vercel (Vercel Postgres, Supabase, ou équivalent)
- Domaine personnalisé avec DNS configuré
- Pas de dépendance à des services tiers payants pour le MVP
- Pas de temps réel côté admin — refresh manuel suffisant
