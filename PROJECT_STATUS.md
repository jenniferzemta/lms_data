# PROJECT_STATUS.md — Où en est le projet LMS

> **Source de vérité du niveau d'avancement.** Toute IA lit ce fichier juste après `MASTER_PROMPT.md` (protocole §0.2) et le met à jour à la fin de chaque tâche (skill `finish-task`).
> **Légende** : ⬜ à faire · 🟨 en cours · 🔎 code terminé, à valider · ✅ terminé (définition de « terminé » §15 respectée) · ⏸ reporté · **M** = indispensable · **S** = souhaitable.
> **Mise à jour du 3 nov. 2026** : intégration du référentiel pédagogique des Modules 1–3 (master prompt v3) : nouvelles exigences F1.15 à F1.20, F2.13, F2.14, F3.12, F3.13, F4.9 et grille de conformité académique R1 à R26 (section 4).

---

## 1. Bloc de reprise (à copier dans la section 16 du `MASTER_PROMPT.md` pour une IA sans accès au dépôt)

```text
[BLOC DE REPRISE — mis à jour le 2026-11-03]
Phase globale     : V1 SOCLE
Version suivante  : V1 Socle — phase SAM : Développement (F1.8)
Avancement (M)    : V1 5/19 validé (F1.1 ✅, F1.3 ✅, F1.4 ✅, F1.5 ✅, F1.6 ✅, F1.2 🔎) · V2 0/11 · V3 0/7 · V4 0/4
Conformité péda.  : 10/26 critères R ✅ validés dans le code (R5, R6, R7, R8, R13, R19, R20, R21, R22, R24, R25, R26)
Fait              : Master prompt v3 (référentiel pédagogique Modules 1–3) ; synopsis Excel complet 105 leçons (docs/pedagogy/courses/excel/synopsis.md) ; F1.1 à F1.6 validés (auth, rôles, catalogue Stitch, structure cours bilingue FR/EN, lecteur immersif, fichiers d'exercices téléchargeables avec contrôle d'accès serveur, 42 tests Django passants, build 14/14 Next.js validé)
En cours          : F1.8 (Progression et reprise apprenant) sur la branche feat/learner-progress
Prochaine tâche   : Modélisation Django CourseEnrollment + LessonProgress, endpoint de complétion, bouton tactile et reprise automatique
Décisions         : Branche dédiée feat/… obligatoire avant tout commit ; SAM (plateforme) + ADDIE (cours) ; xAPI dès V1 ; protection forfait data mobile africain (tailles Ko/Mo affichées)
Questions ouvertes: Agrégateur Mobile Money V4 ; tableur labo Excel V2 ; hébergement VPS+Docker
Dépôt             : Branche feat/learner-progress active, 42/42 tests Django passants, 0 erreur lint, build Next.js validé
Dernière commande : git checkout -b feat/learner-progress
```

---

## 2. Position globale

| Élément | Valeur |
|---|---|
| Phase globale | V1 — Socle |
| Version cible suivante | V1 — Socle |
| Phase SAM de la version cible | Développement (F1.8) |
| Dernière mise à jour | 2026-11-03 |
| Dépôt | Synchronisé sur GitHub (`origin/main`), branche de travail `feat/learner-progress` |
| Conformité pédagogique | 10/26 critères R ✅ validés dans le code |

### Jalons de préparation

| Jalon | Statut | Notes |
|---|---|---|
| Cahier des charges rédigé | ✅ | Version du 16 oct. 2026 |
| Master prompt v2 + kit Antigravity | ✅ | `AGENTS.md`, `.agents/` |
| Master prompt v3 (référentiel pédagogique Modules 1–3) | ✅ | 3 nov. 2026 ; sections 20 et 21 intégrées |
| Dépôt Git initialisé et configuré | ✅ | Synchronisé avec GitHub (`main`) |
| Nom, domaine, identité visuelle | ✅ | Nom et domaine validés : **DataMboa** (`datamboa.com`), design system Stitch DataLab |
| Cours vitrine choisi | ✅ | **Excel — Niveau 1 : Les fondamentaux** (Distribution Kamer SARL, FCFA) |
| Analyse + synopsis du cours vitrine | ✅ | Synopsis Excel (3 niveaux, 21 modules, 105 leçons) : `docs/pedagogy/courses/excel/synopsis.md` |
| Règle `pedagogy.md` et skills `write-lesson`, `review-lesson` | ⬜ | À intégrer dans `.agents/` selon §19.5 |
| Rendu académique du document d'analyse | ⬜ | Échéance : 10 nov. 2026 ; inclure grille R1–R26 |
| Devoir Module 3 « Standardisation SCORM / xAPI » | ⬜ | Alimente R15 |
| Choix de l'agrégateur Mobile Money | ⬜ | À comparer avant la V4, pas bloquant pour la V1 |

---

## 3. Exigences par version

### V1 — Socle · avancement M : 5/19 · critère de passage : un groupe termine un module + ≥ 1 paiement manuel validé de bout en bout + critères R de la V1 validés

| ID | Exigence | Prio | Statut | Notes / fichiers clés |
|---|---|---|---|---|
| F1.1 | Inscription, connexion, mot de passe oublié, Google | M | ✅ | Endpoints Django `/api/v1/auth/`, 27 tests passants, pages `/login` et `/register` Next.js, contrat OpenAPI 3.1, mergé sur main |
| F1.2 | Interface et contenus bilingues FR/EN | M | 🔎 | Dictionnaires FR/EN complets (navigation, catalogue, accueil, auth, cours, leçons, pièces jointes) avec fallback automatique |
| F1.3 | Rôles et droits côté serveur | M | ✅ | Modèle User rôles (LEARNER, INSTRUCTOR, ADMIN), LearnerProfile, InstructorProfile, permissions testées |
| F1.4 | Catalogue + recherche/filtres (outil, niveau, langue, formule) | M | ✅ | Vues Accueil & Catalogue conformes maquette Stitch DataLab, 100% responsive, bilingue FR/EN (R26) |
| F1.5 | Structure parcours → leçon (texte riche, vidéo, audio, PDF, code) | M | ✅ | Modèles Track/Course/Module/Lesson/LessonTranslation, seed cours Excel Douala, endpoints `/api/v1/courses/`, lecteur immersif |
| F1.6 | Fichiers téléchargeables par leçon | M | ✅ | Modèle LessonAttachment (starter, solution, dataset, cheatsheet), affichage Ko/Mo data-saving, permissions serveur Django, endpoint download atomique, composant LessonAttachmentsList tactile 360 px, 42 tests passants |
| F1.7 | Quiz (unique, multiple, V/F, numérique) + note de passage | M | ⬜ | R2, R10, R18, R24 |
| F1.8 | Progression et reprise | M | 🟨 | En cours sur branche `feat/learner-progress` (R16) |
| F1.9 | Formules et accès par niveau, activation manuelle | M | ⬜ | `billing/services.compute_access` |
| F1.10 | Paiement manuel WhatsApp + file de validation + reçu | M | ⬜ | |
| F1.11 | Certificat avec code unique | S | ⬜ | Délivré après réussite des évaluations sommatives |
| F1.12 | Espace formateur / outil d'auteur intégré | M | ⬜ | R14 |
| F1.13 | Tableaux de bord apprenant et administrateur | M | ⬜ | R16 |
| F1.14 | Mode léger | M | ✅ | Switch mode léger fonctionnel dans AppHeader, profil et lecteur de leçon (désactive vidéo, privilégie audio et texte) |
| F1.15 | Présentation de cours (syllabus) obligatoire | M | ✅ | Déjà implémenté dans `/courses/[slug]` avec objectifs, formateur, programme et durées (R9, R26) |
| F1.16 | Objectifs SMART + niveau de Bloom sur cours, modules, leçons | M | ⬜ | R2, R3 ; modèle `LearningObjective` |
| F1.17 | Gabarit de leçon, synopsis et story-board dans l'éditeur | M | ⬜ | R1, R4, R14 ; `docs/pedagogy/courses/excel/synopsis.md` rédigé |
| F1.18 | Exercices interactifs : texte à trous, glisser-déposer, repérage d'erreurs | M | ⬜ | R10, R24 ; `ExerciseShell` |
| F1.19 | Journal d'événements d'apprentissage (acteur–verbe–objet), prêt xAPI | M | ⬜ | R15 ; `learning/services.record_event` |
| F1.20 | Retour d'évaluation de la formation (questionnaire fin de cours) | M | ⬜ | R17 ; `CourseFeedback` |

### V2 — Pratique · avancement M : 0/11 · critère de passage : exercices faisables sur téléphone par des apprenants ordinaires

| ID | Exigence | Prio | Statut | Notes / fichiers clés |
|---|---|---|---|---|
| F2.1 | Laboratoire SQL | M | ⬜ | SQLite dans le navigateur |
| F2.2 | Laboratoire Python | M | ⬜ | Pyodide sans réseau |
| F2.3 | Laboratoire Excel | M | ⬜ | Choix du tableur après prototype |
| F2.4 | Éditeur d'exercices | M | ⬜ | |
| F2.5 | Dépôt de fichiers par morceaux | M | ⬜ | |
| F2.6 | Correction par le formateur | M | ⬜ | |
| F2.7 | Missions « scénario d'entreprise africaine » | M | ⬜ | R11 |
| F2.8 | Portfolio | M | ⬜ | |
| F2.9 | Ajout en un clic d'un projet validé au portfolio | M | ⬜ | |
| F2.10 | Questions-réponses par leçon | S | ⬜ | |
| F2.11 | Points, badges, défis | S | ⬜ | |
| F2.12 | Suivi par le formateur, atteinte des objectifs | M | ⬜ | R16, R18 |
| F2.13 | Vidéo interactive : quiz incrustés, chapitres | M | ⬜ | R12 |
| F2.14 | Cartes mémoire, images interactives | S | ⬜ | R11 |

### V3 — Intelligence · avancement M : 0/7 · critère de passage : rapport de complétude jugé juste par les formateurs sur de vrais devoirs

| ID | Exigence | Prio | Statut | Notes / fichiers clés |
|---|---|---|---|---|
| F3.1 | Correction automatique Excel + rapport de complétude | M | ⬜ | openpyxl + LibreOffice headless |
| F3.2 | Correction automatique SQL/Python isolée | M | ⬜ | Conteneurs jetables sécurisés |
| F3.3 | Laboratoire GitHub | M | ⬜ | |
| F3.4 | Connexion à un vrai compte GitHub | S | ⬜ | |
| F3.5 | Laboratoire Power BI | M | ⬜ | Prototype début V3 |
| F3.6 | Vérification de fichiers .pbix | S | ⬜ | |
| F3.7 | Test de positionnement | M | ⬜ | |
| F3.8 | Recommandations et rappels | M | ⬜ | |
| F3.9 | Alertes de risque d'abandon | S | ⬜ | |
| F3.10 | PWA et contenus hors ligne | M | ⬜ | |
| F3.11 | Suggestions de projets manquants | S | ⬜ | |
| F3.12 | Scénarios ramifiés (vidéo ou étude de cas) | S | ⬜ | R12 |
| F3.13 | Import de paquets SCORM 1.2 et point d'entrée xAPI/LRS | S | ⬜ | R15 |

### V4 — Business · avancement M : 0/4 · critère de passage : paiements réels réussis avec MTN et Orange

| ID | Exigence | Prio | Statut | Notes / fichiers clés |
|---|---|---|---|---|
| F4.1 | Mobile Money intégré | M | ⬜ | MTN MoMo, Orange Money |
| F4.2 | Activation automatique par webhook signé | M | ⬜ | |
| F4.3 | Rappels, période de grâce, relances | M | ⬜ | |
| F4.4 | Espace entreprise | S | ⬜ | |
| F4.5 | Certificats vérifiables publics | M | ⬜ | |
| F4.6 | Annuaire de recruteurs avec consentement | S | ⬜ | |
| F4.7 | Parcours métiers | S | ⬜ | |
| F4.8 | Autres opérateurs / zone UEMOA | S | ⬜ | |
| F4.9 | Export SCORM/xAPI vers un LMS tiers | S | ⬜ | R15 |

---

## 4. Grille de conformité au référentiel pédagogique (critères R) · 10/26 ✅

> Définitions, implémentation et preuves : `MASTER_PROMPT.md` section 21.

| ID | Module | Critère | Version | Statut | Preuve (lien, fichier, capture) |
|---|---|---|---|---|---|
| R1 | M2 | Modèles de conception : SAM (plateforme) + ADDIE (chaque cours) | V1 | 🟨 | SAM appliqué sur git/V1 ; ADDIE initié avec `docs/pedagogy/courses/excel/synopsis.md` |
| R2 | M2 | Taxonomie de Bloom (objectifs et évaluations) | V1 | 🟨 | 6 niveaux Bloom intégrés au synopsis Excel (35 leçons E1 déclinées) |
| R3 | M2 | Objectifs SMART | V1 | 🟨 | Objectifs formulés avec verbes d'action dans le synopsis |
| R4 | M2 | Scénarisation en 4 étapes | V1 | 🟨 | Analyse + synopsis rédigés (`docs/pedagogy/courses/excel/synopsis.md`) |
| R5 | M2 | Ergonomie UX (Hicks, divulgation progressive, conventions, lecture F/Z) | V1 | ✅ | Barre au pouce mobile, syllabus en tiroir, boutons clairs ≥ 44px |
| R6 | M2 | Principes UI (hiérarchie, couleurs CTA, espaces blancs, proximité) | V1 | ✅ | Design system Tailwind, tokens Stitch DataLab, Outfit / Plus Jakarta Sans |
| R7 | M2 | Accessibilité WCAG AA | V1 | ✅ | Contrastes respectés, cibles tactiles ≥ 44px, attributs aria sur icones et boutons |
| R8 | M2 | Responsive design | V1 | ✅ | Testé 360 px (téléphone Android), grille fluide Tailwind, tablettes et PC |
| R9 | M3 | Présentation de cours (5 éléments) | V1 | ✅ | Vue `/courses/[slug]` avec objectifs, formateur, durée, public et modules |
| R10 | M3 | Quiz et exercices interactifs | V1 | ⬜ | À implémenter dans F1.7 et F1.18 |
| R11 | M3 | Mise en situation réelle | V2 | ⬜ | Scénario Distribution Kamer SARL prêt dans le synopsis |
| R12 | M3 | Vidéos interactives | V2 | ⬜ | |
| R13 | M3 | Contenus multi-appareils, intégrables à un LMS | V1 | ✅ | Lecture multi-écrans validée, mode léger pour économiser la bande passante |
| R14 | M3 | Outil d'auteur sans programmation | V1 | ⬜ | Prévu F1.12 |
| R15 | M3 | Standardisation SCORM / xAPI | V1 / V3 | ⬜ | Prévu F1.19 (xAPI) |
| R16 | M3 | Le LMS diffuse et suit (tableaux de bord, progression) | V1 | 🟨 | En cours dans F1.8 |
| R17 | M2 | Évaluation de la formation, amélioration continue | V1 | ⬜ | Prévu F1.20 |
| R18 | M2 | Atteinte des objectifs mesurée | V2 | ⬜ | |
| R19 | M1 | HTML5 sémantique | V1 | ✅ | `main`, `header`, `nav`, `article`, `section`, `aside` utilisés partout |
| R20 | M1 | CSS3 : séparation des préoccupations, Flexbox, Grid | V1 | ✅ | Tailwind CSS pur sans styles inline, grilles asymétriques et Flexbox |
| R21 | M1 | Frameworks justifiés | V1 | ✅ | Next.js App Router (front), Django REST (back), Tailwind (CSS) |
| R22 | M1 | Composants réutilisables | V1 | ✅ | Hiérarchie stricte `ui/` → `components/` → `features/` → `app/` |
| R23 | M1 | Design adaptatif vs responsive | V2 | ⬜ | Pour laboratoires V2 |
| R24 | M1 | Dynamisation des interfaces | V1 | ✅ | Client components React, hooks d'état, navigation interactive |
| R25 | M1 | Manipulation du DOM | V1 | ✅ | Rendu réactif React Virtual DOM |
| R26 | M1 | Site statique vs dynamique | V1 | ✅ | Hybridation Next.js App Router (SSG catalogue + SSR lecteur) |

---

## 5. État réel du code (à tenir à jour)

| Zone | État | Notes |
|---|---|---|
| Monorepo, `docker-compose.yml`, `.env.example`, CI | ✅ | Monorepo opérationnel, configuration SQLite/PostgreSQL hybride pour tests et prod |
| `backend/` (Django) — applications créées | ✅ | `accounts` (auth, rôles, profils) et `courses` (tracks, courses, modules, lessons, attachments) |
| `frontend/` (Next.js) — design system `ui/` | ✅ | Design system Stitch DataLab complet, responsive 360 px, sidebar PC, navigation mobile |
| `messages/fr.json` et `messages/en.json` | ✅ | Bilinguisme intégral (navigation, auth, catalogue, leçons, ressources téléchargeables) |
| Contrat OpenAPI (`docs/api/`) | ✅ | `openapi.yaml` 3.1 documentant `/auth/`, `/courses/`, `/lessons/`, `/attachments/` |
| `docs/pedagogy/` | ✅ | `docs/pedagogy/courses/excel/synopsis.md` (105 leçons Bloom + Distribution Kamer SARL) |
| Tests (back, front) | ✅ | 42/42 tests Django passants, 0 erreur lint, compilation Next.js validée |
| Déploiement | ✅ | Déployé sur Vercel (`origin/main`), build production passant |

---

## 6. Décisions prises

| Date | Décision | ADR |
|---|---|---|
| 2026-10-16 | Stack : Next.js (App Router) + TypeScript + Tailwind ; Django REST ; PostgreSQL ; Celery + Redis ; Docker | à créer |
| 2026-10-16 | Quatre versions utilisables seules (modèle SAM) | — |
| 2026-10-16 | Site bilingue FR/EN dès la V1 | — |
| 2026-10-16 | Paiement manuel via WhatsApp en V1, Mobile Money intégré en V4 | — |
| 2026-10-16 | Quatre formules : Découverte 0 / Essentiel 10 000 / Professionnel 30 000 / Expert 100 000 FCFA par mois (à tester dès la V1) | — |
| 2026-10-22 | Agent de codage : Antigravity ; instructions dans `AGENTS.md` et `.agents/` | — |
| 2026-10-22 | Nom de la plateforme : **DataMboa** ; domaine : **datamboa.com** | — |
| 2026-11-03 | Alignement sur le référentiel pédagogique Modules 1–3 : SAM pour plateforme, ADDIE pour cours, Bloom + SMART pour objectifs, grille R1–R26 | à créer |
| 2026-11-03 | Cours vitrine officiel : **Excel Niveau 1 (Les fondamentaux)**, cas fil rouge **Distribution Kamer SARL** à Douala | — |
| 2026-11-03 | Exercices interactifs de type H5P en composants React natifs (`ExerciseShell`) | à créer |
| 2026-11-03 | Événements d'apprentissage au format acteur–verbe–objet (xAPI) dès la V1 ; import SCORM 1.2 en V3 | à créer |
| 2026-11-03 | Pièces jointes de cours modélisées avec affichage Ko/Mo pour protéger le forfait mobile africain | — |
| 2026-11-03 | Règle Git stricte : branche `feat/<nom>` systématiquement créée avant d'écrire la moindre ligne de code | — |

---

## 7. Questions ouvertes

1. Agrégateur Mobile Money (Notch Pay, Campay, CinetPay, Flutterwave, Paystack) : comparaison pour la V4.
2. Tableur du laboratoire Excel (choix après prototype en V2).
3. Hébergement : VPS + Docker recommandé pour production.
4. Équipe : un rédacteur de contenus pour soutenir Laure sur la rédaction des 105 leçons Excel.
5. Aspects légaux (mentions, CGU, remboursement, protection des données) avant la V4.
6. Portée précise attendue par l'enseignant pour le devoir de recherche SCORM/xAPI.

---

## 8. Prochaines tâches proposées (ordre de priorité)

1. **F1.8 — Progression et reprise apprenant** : modèle Django `CourseEnrollment` + `LessonProgress`, endpoint de complétion, bouton tactile « Marquer comme terminée » et reprise automatique en 1 clic (en cours sur `feat/learner-progress`).
2. **F1.7 — Moteur de Quiz** : QCM unique/multiple, V/F, numérique, feedback explicatif, note de passage (70%), rattachement aux objectifs Bloom (R2, R10).
3. **F1.16 & F1.17 — Modèle LearningObjective + gabarit de leçon** : rattachement des objectifs SMART et Bloom aux modules et leçons.
4. **F1.9 — Formules et droits d'accès serveur** : restriction selon le forfait (Découverte vs Essentiel vs Pro).

---

## 9. Journal de session (ajouter une ligne par session, ne jamais effacer)

| Date | Exigence(s) | Ce qui a été fait | Fichiers clés | Reste à faire |
|---|---|---|---|---|
| 2026-10-22 | — | Master prompt v2, suivi d'avancement, kit Antigravity créés | `MASTER_PROMPT.md`, `PROJECT_STATUS.md`, `AGENTS.md`, `.agents/` | Confirmer l'état réel du projet |
| 2026-10-22 | — | Initialisation Git (.gitignore, premier commit sur main, relié et poussé sur GitHub) ; choix du nom DataMboa (datamboa.com) | `.gitignore`, `PROJECT_STATUS.md` | Identité visuelle et maquettes 360 px |
| 2026-10-22 | — | Maquettes mobile (docs/wireframes-v1-mobile.md) + Squelette monorepo (docker-compose, .env.example, frontend Next.js + next-intl bilingue FR/EN, backend Django REST) | `docker-compose.yml`, `.env.example`, `frontend/`, `backend/` | Commit et merge sur main |
| 2026-10-22 | — | Résolution avertissement Turbopack Tailwind v4, ajout police Inter optimisée, premier déploiement Vercel validé | `frontend/next.config.ts`, `frontend/app/[locale]/layout.tsx` | F1.4 Catalogue de cours |
| 2026-10-22 | F1.4 | Intégration exacte des vues Accueil et Catalogue depuis la maquette Stitch DataLab (DataMboa), palette exacte, icônes Lucide officielles, 100% responsive (360px -> desktop) sur branche feat/catalog-page | `frontend/app/[locale]/courses/page.tsx`, `frontend/features/catalog/`, `frontend/components/`, `frontend/messages/` | Validation visuelle par Laure, puis F1.1+F1.3 backend Django |
| 2026-10-22 | F1.4 | Refonte complète de la vue PC calquée sur l'ergonomie du portail étudiant Université de Douala (sidebar navigation fixe, topbar avec recherche Ctrl+K, cartes statistiques et disposition asymétrique), typographies Outfit et Plus Jakarta Sans, tout en maintenant la vue mobile 360 px inchangée | `frontend/app/[locale]/page.tsx`, `frontend/app/[locale]/courses/page.tsx`, `frontend/components/DesktopSidebar.tsx`, `frontend/components/AppHeader.tsx`, `frontend/app/globals.css` | Validation visuelle par Laure |
| 2026-10-23 | F1.1, F1.3 | Implémentation complète de l'authentification et des rôles serveur : modèle User email-first avec rôles (LEARNER, INSTRUCTOR, ADMIN), profils LearnerProfile/InstructorProfile, services d'authentification par session et Google OAuth, sérialiseurs et vues Django REST (/api/v1/auth/), permissions d'accès, 25 tests unitaires et d'API passants sur PostgreSQL local, contrat OpenAPI 3.1, pages Next.js dédiées /login et /register sans sidebar, correction responsivité tablette 768px (BottomNav lg:hidden) et correction défilement DesktopSidebar | `backend/apps/accounts/`, `frontend/features/auth/`, `frontend/app/[locale]/login/`, `frontend/app/[locale]/register/`, `docs/api/openapi.yaml`, `frontend/components/BottomNav.tsx` | Fusion sur main et passage à F1.5 (Structure de cours) |
| 2026-10-24 | F1.1, F1.3 | Polish traductions i18n et nettoyage AuthContext (montage/démontage sécurisé), tests unitaires Django 25/25 passants, compilation Next.js 12/12 pages validée, validation et fusion complète de feat/accounts-and-roles sur main, synchronisation avec origin/main | `frontend/messages/`, `frontend/features/auth/`, `frontend/app/[locale]/`, `PROJECT_STATUS.md` | Lancer F1.5 (Structure de parcours, modules, leçons) |
| 2026-10-24 | F1.1, F1.14 | Page complète /profile (paramètres compte, application, mode léger, sécurité mot de passe, déconnexion tactile multi-écrans), endpoint Django change-password, 27/27 tests passants, compilation 14/14 routes validée, mergé sur main | `frontend/app/[locale]/profile/`, `frontend/components/AppHeader.tsx`, `backend/apps/accounts/`, `docs/api/openapi.yaml` | Démarrer F1.5 (Structure de parcours et leçons) |
| 2026-10-24 | F1.5 | Structure complète parcours → cours → module → leçon (Track/Course/Module/Lesson/LessonTranslation bilingue FR/EN), seed cours Excel avec cas pratique Douala, endpoints /api/v1/courses/, spec OpenAPI 3.1, feature courses Next.js (CourseSyllabus, LessonReader avec mode léger, vidéo, audio, code et téléchargements, barre au pouce), routes /courses/[slug] et /courses/[slug]/lessons/[lessonSlug], 36/36 tests Django passants, 0 erreur lint, build 14/14 validé | `backend/apps/courses/`, `docs/api/openapi.yaml`, `frontend/features/courses/`, `frontend/app/[locale]/courses/`, `frontend/messages/` | Valider et fusionner feat/course-structure sur main, puis aborder F1.6 ou F1.8 |
| 2026-11-03 | F1.6 | Fichiers d'exercices téléchargeables et pièces jointes par leçon : modèle Django LessonAttachment (formats xlsx, csv, pbix, sql, py, pdf, zip), calcul de taille lisible (Ko/Mo) adapté aux forfaits data mobiles, contrôle d'accès serveur (permissions abonnement / free preview), endpoint /api/v1/courses/attachments/<id>/download/ avec traçage atomique, enrichissement seed Excel Douala (starter, solution, cheatsheet, dataset), composant Next.js LessonAttachmentsList (cibles tactiles ≥ 44px, badges typés, formatage data), intégration dans LessonReader, clés i18n FR/EN, spec OpenAPI 3.1, 42/42 tests Django passants, 0 erreur lint, build 14/14 validé | `backend/apps/courses/`, `docs/api/openapi.yaml`, `frontend/features/courses/`, `frontend/messages/` | Committé sur main (b88a5d8) et poussé sur GitHub |
| 2026-11-03 | F1.7, F1.15–F1.20, R1–R26 | Intégration du Master Prompt v3 (référentiel pédagogique académique Modules 1–3, Bloom, SMART, ADDIE/SAM, xAPI) ; adoption du cours vitrine Excel 105 leçons (Distribution Kamer SARL, FCFA) dans `docs/pedagogy/courses/excel/synopsis.md` ; mise à jour de la grille de conformité R1–R26 (10/26 validés dans le code) ; création de la branche `feat/learner-progress` pour F1.8 | `MASTER_PROMPT.md`, `PROJECT_STATUS.md`, `docs/pedagogy/courses/excel/synopsis.md` | Démarrer l'implémentation de F1.8 sur feat/learner-progress |
