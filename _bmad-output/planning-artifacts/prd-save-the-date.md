---
stepsCompleted: ['direct-creation']
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
parentPrd: '_bmad-output/planning-artifacts/prd.md'
classification:
  projectType: 'Feature Addition — Animation Save the Date'
  domain: 'Événementiel (mariage)'
  complexity: 'Moyenne'
  projectContext: 'brownfield — ajout à un site de mariage existant'
workflowType: 'prd'
---

# PRD — Save the Date Animé (Pigeon Voyageur)

**Auteur :** Mister Azami
**Date :** 2026-02-18
**Projet parent :** Site de Mariage Ahmed & Ghizlaine

## Résumé Exécutif

### Vision

Transformer la landing page du site de mariage en une expérience "Save the Date" animée et mémorable. Un pigeon voyageur stylisé livre une enveloppe cachetée qui s'ouvre pour révéler la date, le lieu et un message poétique. L'animation combine élégance raffinée et charme ludique pour marquer les esprits dès la première visite.

### Différenciateur

Pas un simple texte "Save the Date" — une micro-narration animée en 3 actes (arrivée du pigeon → dépôt de l'enveloppe → révélation du contenu) qui transforme une information pratique en moment émotionnel.

### Utilisateurs cibles

- **Invités** (200 personnes) — découvrent l'animation au chargement de leur lien unique
- **Visiteurs non-invités** — voient l'animation sur la landing page publique (/)

### Contexte

- S'intègre à la landing page existante du site de mariage (Next.js 16, Vercel)
- Assets nécessaires : illustrations SVG/Lottie du pigeon et de l'enveloppe
- Respecte le thème visuel existant (palette dorée, typographie élégante)

## Critères de Succès

### Succès Utilisateur

- L'invité ressent un effet "waouh" dès le chargement de la page
- L'animation raconte une histoire complète en moins de 5 secondes
- Le contenu Save the Date (date, lieu, message) est lisible et mémorisé
- L'expérience fonctionne sans friction sur mobile (cible principale : WhatsApp → site)

### Succès Technique

- Animation fluide à 60fps sur smartphones milieu de gamme (iPhone 11, Samsung Galaxy A52)
- Temps de chargement total (page + animation) < 4 secondes en 4G mobile
- Assets SVG/Lottie optimisés — poids total des assets d'animation < 150 Ko
- Respect de `prefers-reduced-motion` : contenu affiché statiquement sans animation si l'utilisateur a désactivé les animations

### Résultats Mesurables

- Animation complète jouée en 4-5 secondes (3 actes)
- Aucun jank ou saccade visible sur appareils cibles
- Score Lighthouse Performance maintenu > 85 sur mobile après ajout de l'animation
- Contenu statique final lisible sur toutes les tailles d'écran (360px à 1920px)

## User Journey

### Parcours — Invité découvre le Save the Date

**Scène d'ouverture :** L'invité reçoit son lien unique via WhatsApp. Il appuie sur le lien. Le site s'ouvre.

**Acte 1 — L'arrivée (~1.5s) :** Un pigeon stylisé (illustration flat, palette dorée et blanche) entre depuis le bord de l'écran en volant avec une animation fluide. Il porte une enveloppe dans son bec. Le mouvement est gracieux, ni trop rapide ni trop lent.

**Acte 2 — La livraison (~1.5s) :** Le pigeon se pose au centre de l'écran. Il dépose l'enveloppe délicatement. Puis il s'envole doucement hors de l'écran. L'enveloppe reste au centre — elle est cachetée avec un sceau doré portant les initiales "A&G" en calligraphie orientale/marocaine.

**Acte 3 — La révélation (~1.5s) :** L'enveloppe s'ouvre avec une animation élégante (le rabat se soulève, le contenu émerge). Le texte se déploie avec un léger fade-in :

> **Ahmed & Ghizlaine**
>
> **17 Octobre 2026**
>
> **Casablanca**
>
> *« Une date à retenir, une histoire à écrire ensemble… les détails suivront bientôt. »*

**Résolution :** L'animation est terminée. Le contenu reste affiché de manière statique. L'invité peut scroller vers la suite du site (sections existantes). Pas de bouton replay — l'animation ne se joue qu'une fois, au chargement.

**Scénario motion-reduced :** Si l'invité a activé "Réduire les animations" sur son appareil, l'enveloppe ouverte et le contenu s'affichent directement, sans animation. L'expérience reste complète et élégante.

## Exigences Fonctionnelles

### Animation Save the Date

- **FR-STD-1 :** L'invité voit une animation de pigeon voyageur stylisé (illustration flat, palette dorée/blanche) entrant dans l'écran au chargement de la page
- **FR-STD-2 :** Le pigeon dépose une enveloppe cachetée au centre de l'écran puis s'envole hors de l'écran
- **FR-STD-3 :** L'enveloppe porte un sceau doré avec les initiales "A&G" dans un style calligraphie orientale/marocaine
- **FR-STD-4 :** L'enveloppe s'ouvre avec une animation fluide pour révéler le contenu Save the Date
- **FR-STD-5 :** Le contenu révélé affiche : les prénoms du couple (Ahmed & Ghizlaine), la date (17 Octobre 2026), le lieu (Casablanca), et le message « Une date à retenir, une histoire à écrire ensemble… les détails suivront bientôt. »
- **FR-STD-6 :** L'animation se joue une seule fois au chargement — le contenu reste ensuite affiché de manière statique
- **FR-STD-7 :** L'animation complète (3 actes) dure entre 4 et 5 secondes

### Accessibilité & Fallback

- **FR-STD-8 :** Si `prefers-reduced-motion` est activé, l'animation est désactivée et le contenu Save the Date s'affiche directement dans son état final (enveloppe ouverte, texte visible)
- **FR-STD-9 :** Le contenu textuel du Save the Date est accessible aux lecteurs d'écran via un balisage sémantique approprié

### Intégration

- **FR-STD-10 :** L'animation Save the Date s'affiche en haut de la landing page, avant les sections existantes (accueil, notre histoire, etc.)
- **FR-STD-11 :** L'animation est responsive et s'adapte aux écrans mobile (360px) et desktop (jusqu'à 1920px)

## Exigences Non-Fonctionnelles

### Performance

- Animation à 60fps sans jank sur iPhone 11 et Samsung Galaxy A52
- Poids total des assets d'animation (SVG/Lottie) < 150 Ko
- Aucune dégradation du temps de chargement initial de la page (< 4s en 4G mobile, animation comprise)
- Score Lighthouse Performance maintenu > 85 sur mobile

### Style Visuel

- Pigeon : illustration stylisée flat design, cohérente avec la palette dorée/blanche du site existant
- Enveloppe : style élégant avec sceau doré A&G en calligraphie orientale/marocaine
- Ambiance : mélange d'élégance raffinée et de charme ludique/fantaisiste
- Typographie du contenu révélé : cohérente avec les polices du site (Geist Sans)

### Contraintes Techniques

- Implémentation en React/Next.js 16 (Server Component par défaut, Client Component si interactivité nécessaire)
- Animation via CSS animations, Framer Motion, ou Lottie (selon complexité)
- Assets en SVG ou format Lottie — pas de GIF ni de vidéo
- Pas de dépendance à des services tiers payants

## Assets Nécessaires

| Asset | Format | Description |
|-------|--------|-------------|
| Pigeon voyageur | SVG ou Lottie | Illustration stylisée flat, palette dorée/blanche, animation de vol |
| Enveloppe fermée | SVG | Enveloppe élégante avec sceau doré A&G calligraphié |
| Enveloppe ouverte | SVG | État ouvert de l'enveloppe (rabat soulevé) |
| Sceau A&G | SVG | Initiales en calligraphie orientale/marocaine, doré |

**Note :** Les assets doivent être créés ou sourcés. Options : création manuelle SVG, génération via outil d'illustration, ou adaptation de ressources libres de droits.

## Risques et Mitigations

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Complexité de l'animation Lottie | Retard développement | Fallback CSS animations si Lottie trop complexe à intégrer |
| Création des assets illustrés | Dépendance externe | Prototyper avec des SVG simples, itérer sur le style |
| Performance sur mobile bas de gamme | Animation saccadée | Tester tôt sur appareils réels, simplifier si nécessaire |
| Poids des assets | Temps de chargement rallongé | Budget strict de 150 Ko, compression SVG, lazy loading si possible |
