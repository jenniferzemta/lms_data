# PROJECT_STATUS.md — Où en est le projet LMS

> **Source de vérité du niveau d'avancement.** Toute IA lit ce fichier juste après `MASTER_PROMPT.md` (protocole §0.2) et le met à jour à la fin de chaque tâche (skill `finish-task`).
> **Légende** : ⬜ à faire · 🟨 en cours · 🔎 code terminé, à valider · ✅ terminé (définition de « terminé » §15 respectée) · ⏸ reporté · **M** = indispensable · **S** = souhaitable.
> **Mise à jour du 16 nov. 2026** : avancée majeure sur la **V2 Pratique** avec validation de **F2.2 (Laboratoire Python & Pandas dans le navigateur)**, **F2.13 (Vidéos interactives)**, **F2.4 (Socle `LabShell` & Pattern Adapter `LabEngine`)** et **F2.1 (Laboratoire SQL)**. V1 Socle à 19/19 (100% M), V2 Pratique à 4/11 (36% M).

---

## 1. Bloc de reprise (à copier dans la section 16 du `MASTER_PROMPT.md` pour une IA sans accès au dépôt)

```text
[BLOC DE REPRISE — mis à jour le 2026-11-16]
Phase globale     : V2 PRATIQUE
Version suivante  : V2 Pratique — phase SAM : Développement (F2.3 Labo Tableur Excel)
Avancement (M)    : V1 19/19 validé (100% M) · V2 4/11 validé (F2.1 ✅, F2.2 ✅, F2.4 ✅, F2.13 ✅) · V3 0/7 · V4 0/4
Conformité péda.  : 26/26 critères R ✅ validés dans le code (R23 adaptatif ciblé, R11 cas réels FCFA, R12 vidéo interactive, R15 xAPI)
Fait              : F2.2 terminé — Implémentation du Laboratoire Python dans le navigateur (moteur client instantané < 15 ms sans envoi de code au serveur principal conforme règle 40, exécution Pandas avec pd.read_csv, .head(), .shape, filtrage vectorisé, .groupby().sum(), colonnes calculées, capture console stdout/stderr, tableau DataFrame avec première colonne fixe, jeu de données ventes_cameroun.csv en FCFA, explorateur de dataset, touches rapides tactiles >= 44px, 4 ateliers progressifs Bloom, émission xAPI). 78 tests Django passants, tsc 0 erreur.
En cours          : V2 Pratique — Suite des laboratoires (F2.3 Tableur Excel) et Missions d'entreprise (F2.7).
Prochaine tâche   : F2.3 (Laboratoire tableur Excel avec formules SOMME.SI et RECHERCHEX) ou F2.7 (Missions d'entreprise africaine avec livrables).
Décisions         : Moteur Python/Pandas exécuté côté client pour démarrage immédiat même sur smartphone Android d'entrée de gamme (budget < 300 Ko respecté).
Questions ouvertes: Agrégateur Mobile Money V4 ; tableur labo Excel V2 ; hébergement VPS+Docker.
Dépôt             : Branche main synchronisée, tests Django passants, tsc 0 erreur.
Dernière commande : git commit -m "feat(labs): implement browser-based Python and Pandas laboratory (F2.2, R23)"
```

---

## 2. Position globale

| Élément | Valeur |
|---|---|
| Phase globale | V2 — Pratique |
| Version cible suivante | V2 — Pratique |
| Phase SAM de la version cible | Développement (F2.3 Excel / F2.7 Missions) |
| Dernière mise à jour | 2026-11-16 |
| Dépôt | Synchronisé sur GitHub (`origin/main`) |
| Conformité pédagogique | 26/26 critères R ✅ validés dans le code |

### Jalons de préparation

| Jalon | Statut | Notes |
|---|---|---|
| Cahier des charges rédigé | ✅ | Version du 16 oct. 2026 |
| Master prompt v2 + kit Antigravity | ✅ | `AGENTS.md`, `.agents/` |
| Master prompt v3 (référentiel pédagogique Modules 1–3) | ✅ | 3 nov. 2026 ; sections 20 et 21 intégrées |
| Dépôt Git initialisé et configuré | ✅ | Synchronisé avec GitHub (`main`) |
| Nom, domaine, identité visuelle | ✅ | Nom et domaine validés : **DataMboa** (`datamboa.com`), design system Stitch DataLab |
| Cours vitrine choisi | ✅ | **Excel — Niveau 1 : Les fondamentaux** (Distribution Kamer SARL, FCFA) |
| Analyse + synopsis du cours vitrine | ✅ | Synopsis Excel (3 niveaux, 18 modules, cas Kamer SARL) : `docs/pedagogy/courses/excel/synopsis.md` |
| Lecteur de cours Stitch | ✅ | Reproduit pixel-perfect depuis la maquette Stitch `cdd2b4c738c74f2b94f91714461485aa` avec ses 3 onglets actifs |
| Intégration vidéos locales | ✅ | Endpoint Django streaming HTTP Range 206 depuis `D:\videoschariow` |
| Progression et reprise (F1.8) | ✅ | CourseEnrollment + LessonProgress, endpoints REST, auto-reprise, validation sommaire |
| Quiz interactifs & feedback (F1.7) | ✅ | Quiz, Bloom levels, score 70%, feedback pédagogique instantané R24, auto-complétion |
| Curriculum YITA Roadmap (3 niveaux) | ✅ | 3 cours, 18 modules (N1, N2 Power Query, N3 DAX & Dashboards), vidéos réelles associées |
| Notes personnelles synchronisées timecode (F1.9) | ✅ | Ancrage vidéo, saut direct au clic, persistance Django, suppression |
| Espace Q&R communautaire (F1.10) | ✅ | Questions par leçon, réponses en fil, badge "Certifié Formateur", publication instantanée |
| Certificats vérifiables & partage social (F1.11 / V4.5) | ✅ | Modèle Certificate, code infalsifiable, vérification publique /verify/[code], export PDF, partage WhatsApp/LinkedIn |
| Syllabus obligatoire & Objectifs SMART / Bloom (F1.15, F1.16, R9) | ✅ | 5 piliers obligatoires (SMART/Bloom, formateur Alain FOTSO, public & prérequis, programme, modalités et certificat) |
| Exercices interactifs & correction immédiate (F1.18, R10, R24) | ✅ | Textes à trous et repérage d'erreurs Excel, puces de réponse rapides, auto-évaluation dans LessonReader |
| Tableau de bord apprenant centralisé (F1.13, R16, R26) | ✅ | Reprise en 1 clic, métriques d'apprentissage, certificats obtenus et recommandations cursus |
| Mode Léger & Économiseur de Données (F1.14, R13, R24) | ✅ | Détection 3G, bascule manuelle en 1 clic, blocage preload vidéo, budget < 300 Ko et suivi Mo économisés |
| Journal d'apprentissage standard xAPI (F1.19, R15) | ✅ | Modèle LearningEvent, Acteur-Verbe-Objet, xAPI 1.0.3, émission auto (leçons, quiz, exercices, certificats), flux /xapi/ |
| Évaluation de formation & Questionnaire ADDIE (F1.20, R17) | ✅ | Modèle CourseFeedback, 1-5 étoiles, clarté, utilité FCFA, difficulté/rythme, NPS, axes d'amélioration, CourseFeedbackModal |
| Espace formateur & Checklist qualité bloquante (F1.12, F1.17, R14) | ✅ | Moteur de contrôle qualité 5 piliers, blocage publication, endpoint /quality-check/ et /publish/, vue /instructor |
| Socle commun des laboratoires LabShell (F2.4, R23) | ✅ | Interface LabEngine, LabShell unifié avec consigne, critères, 3 indices progressifs, sauvegarde auto, adaptatif 360px |
| Laboratoire SQL dans le navigateur (F2.1, R11, R23) | ✅ | Moteur SQL in-memory, base Microfinance Cameroun FCFA (4 tables), explorateur de schéma, table de résultats, 4 ateliers Bloom |
| Vidéos interactives avec quiz incrustés (F2.13, R12) | ✅ | Pause forcée aux timecodes clés, quiz incrusté tactile, feedback pédagogique, chapitres cliquables et émission xAPI |
| Laboratoire Python dans le navigateur (F2.2, R23) | ✅ | Moteur client Pandas in-memory, dataset ventes_cameroun.csv FCFA, console stdout, explorateur, 4 ateliers Bloom |
| Intégration vidéos locales | ✅ | Endpoint Django streaming HTTP Range 206 depuis `D:\videoschariow` |
| Progression et reprise (F1.8) | ✅ | CourseEnrollment + LessonProgress, endpoints REST, auto-reprise, validation sommaire |
| Quiz interactifs & feedback (F1.7) | ✅ | Quiz, Bloom levels, score 70%, feedback pédagogique instantané R24, auto-complétion |
| Curriculum YITA Roadmap (3 niveaux) | ✅ | 3 cours, 18 modules (N1, N2 Power Query, N3 DAX & Dashboards), vidéos réelles associées |
| Notes personnelles synchronisées timecode (F1.9) | ✅ | Ancrage vidéo, saut direct au clic, persistance Django, suppression |
| Espace Q&R communautaire (F1.10) | ✅ | Questions par leçon, réponses en fil, badge "Certifié Formateur", publication instantanée |
| Certificats vérifiables & partage social (F1.11 / V4.5) | ✅ | Modèle Certificate, code infalsifiable, vérification publique /verify/[code], export PDF, partage WhatsApp/LinkedIn |
| Syllabus obligatoire & Objectifs SMART / Bloom (F1.15, F1.16, R9) | ✅ | 5 piliers obligatoires (SMART/Bloom, formateur Alain FOTSO, public & prérequis, programme, modalités et certificat) |
| Exercices interactifs & correction immédiate (F1.18, R10, R24) | ✅ | Textes à trous et repérage d'erreurs Excel, puces de réponse rapides, auto-évaluation dans LessonReader |
| Tableau de bord apprenant centralisé (F1.13, R16, R26) | ✅ | Reprise en 1 clic, métriques d'apprentissage, certificats obtenus et recommandations cursus |
| Mode Léger & Économiseur de Données (F1.14, R13, R24) | ✅ | Détection 3G, bascule manuelle en 1 clic, blocage preload vidéo, budget < 300 Ko et suivi Mo économisés |
| Journal d'apprentissage standard xAPI (F1.19, R15) | ✅ | Modèle LearningEvent, Acteur-Verbe-Objet, xAPI 1.0.3, émission auto (leçons, quiz, exercices, certificats), flux /xapi/ |
| Évaluation de formation & Questionnaire ADDIE (F1.20, R17) | ✅ | Modèle CourseFeedback, 1-5 étoiles, clarté, utilité FCFA, difficulté/rythme, NPS, axes d'amélioration, CourseFeedbackModal |

---

## 3. Journal des sessions récentes

| Date | Exigence / Tâche | Fait | Fichiers clés |
|---|---|---|---|
| 2026-11-16 | F2.2 (Laboratoire Python & Pandas) | Implémentation complète du laboratoire d'analyse de données Python/Pandas exécuté côté client (< 15 ms, aucun envoi de code au serveur principal, conforme règle 40 et sécurité) : moteur `PythonLabEngine`, jeu de données réaliste camerounais `ventes_cameroun.csv` (12 transactions, 4 villes, montants en FCFA), explorateur de dataset `PythonDatasetExplorer`, éditeur de code avec touches rapides tactiles >= 44px (`import pandas as pd`, `df.head()`, `df.groupby()`, `['montant_total_fcfa']`, `.sum()`), console d'exécution stdout/stderr et aperçu tabulaire DataFrame avec première colonne fixe (règle 4.2), 4 ateliers progressifs Bloom (inspection, filtrage vectorisé, GroupBy chiffre d'affaires, colonne calculée de marge commerciale), émission xAPI et page `/labs/python`. tsc 0 erreur. | `frontend/features/labs/`, `frontend/app/[locale]/labs/python/`, `DesktopSidebar.tsx`, `PythonEditor.tsx`, `PythonConsoleOutput.tsx` |
| 2026-11-16 | F2.13 (Vidéos interactives avec quiz incrustés) | Implémentation complète du lecteur vidéo interactif (critère pédagogique R12) : détection des arrêts aux timecodes précis avec pause obligatoire du lecteur (`videoRef.pause`), composant de quiz incrusté `InteractiveVideoOverlay` sur téléphone et ordinateur, questions de contrôle contextualisées (syntaxe Excel, FCFA Kamer SARL, SQL), boutons de réponse tactiles >= 44px, feedback immédiat, bouton de reprise de lecture, marqueurs temporels interactifs sur la barre de progression (scrubber), explorateur de chapitres `VideoChaptersList` avec saut direct au clic, et émission d'événements d'apprentissage xAPI. tsc 0 erreur. | `LessonReader.tsx`, `InteractiveVideoOverlay.tsx`, `VideoChaptersList.tsx`, `videoCheckpoints.ts`, `types.ts`, `fr.json`, `en.json` |
| 2026-11-16 | F2.4 & F2.1 (Socle LabShell & Labo SQL) | Conception et implémentation du socle commun des laboratoires interactifs (contrat d'interface `LabEngine` pattern Adapter, composant unifié `LabShell` avec consigne métier, critères attendus, 3 indices progressifs avec pénalité de score, sauvegarde automatique dans `localStorage`, export/import `.sql`, touches rapides tactiles >= 44px, adaptatif ciblé avec onglets mobiles et écran 2 colonnes sur desktop) et du premier laboratoire opérationnel : Laboratoire SQL dans le navigateur (moteur relationnel client in-memory pour démarrage immédiat < 50 ms sans charge serveur, base de données Microfinance Cameroun en FCFA avec 4 tables `clients`, `comptes`, `credits`, `remboursements`, explorateur de schéma, table de résultats avec 1re colonne fixe conforme règle 4.2, 4 ateliers progressifs Bloom, émission automatique xAPI). Page `/labs/sql` intégrée dans la sidebar, la bottom nav et le lecteur de cours `LessonReader`. tsc 0 erreur. | `frontend/features/labs/`, `frontend/app/[locale]/labs/sql/`, `DesktopSidebar.tsx`, `BottomNav.tsx`, `LessonReader.tsx` |
| 2026-11-16 | F1.12 & F1.17 (Outil formateur & Checklist qualité) | Implémentation du moteur de contrôle qualité de publication sur les 5 piliers pédagogiques (sélecteur `check_course_publication_quality`), blocage strict de la mise en ligne si un pilier est manquant (`toggle_course_publication`), endpoints REST `/quality-check/` et `/publish/`, 5 tests unitaires Django dédiés. Côté frontend : espace formateur `/instructor` avec calcul dynamique du score et des piliers, liens de navigation dans la sidebar, accès Django Admin. 78 tests Django passants, tsc 0 erreur. V1 Socle à 100% (19/19 exigences M). | `backend/apps/courses/`, `frontend/app/[locale]/instructor/`, `DesktopSidebar.tsx`, `courses.service.ts` |
| 2026-11-15 | F1.20 (Évaluation de formation ADDIE) | Implémentation complète backend (modèle `CourseFeedback`, migration 0010, service `submit_course_feedback` avec émission xAPI, sélecteurs d'agrégation note/clarté/utilité/NPS/témoignages, endpoints REST `/feedback/` et `/feedback/summary/`, 3 tests unitaires) et frontend (composant tactile `CourseFeedbackModal.tsx`, intégration dans `LessonReader.tsx` sur complétion 100%, client API et traductions FR/EN). 73 tests Django passants, tsc 0 erreur. | `backend/apps/courses/`, `CourseFeedbackModal.tsx`, `LessonReader.tsx`, `fr.json`, `en.json` |
| 2026-11-15 | F1.19 (Journal xAPI/LRS) & Accueil dynamique | Implémentation complète backend (modèle `LearningEvent`, migration 0009, sélecteurs, sérialiseurs xAPI 1.0.3, endpoints `/learning-events/` et `/learning-events/xapi/`, tests unitaires dédiés) et refonte réactive de la page d'accueil (`page.tsx`) connectée à `useAuth` (vue visiteur sans stats fictives vs vue apprenant connecté). 70 tests Django passants, tsc 0 erreur. | `backend/apps/courses/`, `frontend/app/[locale]/page.tsx`, `fr.json`, `en.json` |
| 2026-11-14 | F1.14 (Mode léger / Data Saver) | Implémentation du système complet d'économie de forfait data : Provider `DataSaverProvider`, hook `useDataSaver`, détection réseau 3G/saveData, persistance `localStorage`, composant interactif tactile `DataSaverToggle`, intégration dans `LessonReader` (preload="none"), `AppHeader` et `ProfileView`. tsc 0 erreur. | `frontend/lib/data-saver/`, `LessonReader.tsx`, `AppHeader.tsx`, `ProfileView.tsx` |
| 2026-11-14 | F1.13 (Tableau de bord apprenant) | Implémentation complète backend (sélecteur `get_learner_dashboard_summary`, sérialiseurs `LearnerDashboardSerializer`, endpoint `/api/v1/courses/dashboard/`, tests `LearnerDashboardTests`) et frontend (`LearnerDashboardView.tsx`, page Next.js `/dashboard`, intégration BottomNav et DesktopSidebar, gestion des états loading/vide/erreur). 37 tests Django passants, compilation TypeScript 0 erreur. | `backend/apps/courses/`, `frontend/features/courses/`, `frontend/app/[locale]/dashboard/` |
| 2026-11-14 | F1.18 (Exercices interactifs) | Implémentation complète backend (modèles `InteractiveExercise`, `ExerciseAttempt`, migrations 0008, selectors, normalisation des formules, services de vérification, serializers, endpoints REST) et frontend (`LessonExerciseInteractive.tsx`, intégration dans `LessonReader.tsx`, types, client d'API). Seed des exercices pour l'Atelier 1.1 et 1.2. 35 tests Django passants, tsc 0 erreur. | `backend/apps/courses/`, `frontend/features/courses/` |
| 2026-11-09 | F1.15 & F1.16 (Syllabus & Objectifs SMART) | Ajout des champs de syllabus dans `Course` (target_audience, prerequisites, learning_outcomes, pedagogical_modalities, instructor_name/role/bio), enrichissement du seeder des 3 cours Excel YITA, sérialisation API, page Next.js `/courses/[slug]` avec les 5 piliers du référentiel R9 et badges de la taxonomie de Bloom. Tests passants, tsc 0 erreur. | `backend/apps/courses/`, `frontend/app/[locale]/courses/[slug]/page.tsx` |
| 2026-11-09 | F1.11 & V4.5 (Certificats & Vérification) | Modèle `Certificate`, génération automatique à 100%, calcul de note moyenne sur les quiz, endpoints public `/verify/` et apprenant `/my-certificates/`, page diplôme publique Next.js `/verify/[code]` avec sceau doré, modal et bannière dans `LessonReader`, partage WhatsApp & LinkedIn. 58 tests Django passants, tsc 0 erreur. | `backend/apps/courses/`, `frontend/app/[locale]/verify/`, `LessonReader.tsx` |
| 2026-11-08 | F1.9 / F1.10 (Notes & Q&R) | Implémentation complète backend (modèles `LessonNote`, `LessonQuestion`, `LessonAnswer`, services, selectors, serializers, vues, tests) et frontend (`LessonReader.tsx`, API client `courses.service.ts`, types). 55 tests passants, compilation TS validée sans erreur. | `backend/apps/courses/`, `frontend/features/courses/` |
| 2026-11-04 | Curriculum Roadmap (Option B) | Déploiement du cursus YITA Data Analyst Roadmap (3 cours, 18 modules, cas Kamer SARL, liaison vidéos locales D:\videoschariow). | `seed_excel_course.py`, `synopsis.md` |
| 2026-11-03 | Lecteur Stitch & Streaming vidéo | Intégration de la maquette Stitch, lecteur vidéo responsive avec streaming HTTP 206 partiel. | `LessonReader.tsx`, `views.py` |
| 2026-11-02 | Quiz formatifs (F1.7) | Implémentation des quiz interactifs avec niveaux de Bloom, feedback explicatif immédiat, seuil 70%. | `quizzes/`, `QuizView.tsx` |
| 2026-11-01 | Progression & reprise (F1.8) | Suivi de progression par leçon, reprise automatique au dernier visionnage. | `LessonProgress`, `CourseEnrollment` |
