# PROJECT_STATUS.md — Où en est le projet LMS

> **Source de vérité du niveau d'avancement.** Toute IA lit ce fichier juste après `MASTER_PROMPT.md` (protocole §0.2) et le met à jour à la fin de chaque tâche (skill `finish-task`).
> **Légende** : ⬜ à faire · 🟨 en cours · 🔎 code terminé, à valider · ✅ terminé (définition de « terminé » §15 respectée) · ⏸ reporté · **M** = indispensable · **S** = souhaitable.
> **Mise à jour du 9 nov. 2026** : validation des exigences F1.15 (Syllabus de cours obligatoire & 5 piliers R9) et F1.16 (Objectifs pédagogiques SMART & Taxonomie de Bloom R2/R3).

---

## 1. Bloc de reprise (à copier dans la section 16 du `MASTER_PROMPT.md` pour une IA sans accès au dépôt)

```text
[BLOC DE REPRISE — mis à jour le 2026-11-09]
Phase globale     : V1 SOCLE
Version suivante  : V1 Socle — phase SAM : Développement (F1.18 / F1.14)
Avancement (M)    : V1 13/19 validé (F1.1 ✅, F1.2 ✅, F1.3 ✅, F1.4 ✅, F1.5 ✅, F1.6 ✅, F1.7 ✅, F1.8 ✅, F1.9 ✅, F1.10 ✅, F1.11 ✅, F1.15 ✅, F1.16 ✅) · V2 0/11 · V3 0/7 · V4 0/4
Conformité péda.  : 21/26 critères R ✅ validés dans le code (R1, R2, R3, R5, R6, R7, R8, R9, R10, R11, R12, R13, R16, R19, R20, R21, R22, R24, R25, R26)
Fait              : F1.15 & F1.16 terminés — Déploiement des 5 piliers obligatoires du syllabus de cours (critère R9) et des objectifs SMART avec taxonomie de Bloom (critères R2/R3) sur le modèle Course, l'API publique Django, le seeder de la roadmap Excel et la page Next.js /courses/[slug] : objectifs avec verbes d'action et badges Bloom (Mémoriser, Comprendre, Appliquer, Analyser, Évaluer, Créer), carte profil formateur Alain FOTSO, blocs public cible et prérequis réels, programme et modalités pédagogiques africaines. Tests backend OK, compilation TypeScript 0 erreur.
En cours          : V1 Socle — Suite de la chaîne pédagogique (F1.18 Exercices interactifs de textes à trous et repérage d'erreurs Excel, ou F1.14 Mode léger / Data Saver).
Prochaine tâche   : F1.18 (Exercices interactifs dans le lecteur : texte à trous et repérage/correction d'erreurs de formules Excel #N/A, #VALEUR!).
Décisions         : Stockage structuré des objectifs SMART en JSONField pour flexibilité Bloom et internationalisation ; rendu mobile-first avec badges sémantiques distincts par niveau cognitif.
Questions ouvertes: Agrégateur Mobile Money V4 ; tableur labo Excel V2 ; hébergement VPS+Docker.
Dépôt             : Branche feat/course-syllabus-smart prête à être fusionnée sur main, tests passants, tsc 0 erreur.
Dernière commande : git commit -m "feat(syllabus): implement mandatory course syllabus and SMART Bloom objectives (F1.15, F1.16, R9, R2, R3)"
```

---

## 2. Position globale

| Élément | Valeur |
|---|---|
| Phase globale | V1 — Socle |
| Version cible suivante | V1 — Socle |
| Phase SAM de la version cible | Développement (F1.18 / F1.14) |
| Dernière mise à jour | 2026-11-09 |
| Dépôt | Synchronisé sur GitHub (`origin/main`), branche de travail `feat/course-syllabus-smart` |
| Conformité pédagogique | 21/26 critères R ✅ validés dans le code |

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

---

## 3. Journal des sessions récentes

| Date | Exigence / Tâche | Fait | Fichiers clés |
|---|---|---|---|
| 2026-11-09 | F1.15 & F1.16 (Syllabus & Objectifs SMART) | Ajout des champs de syllabus dans `Course` (target_audience, prerequisites, learning_outcomes, pedagogical_modalities, instructor_name/role/bio), enrichissement du seeder des 3 cours Excel YITA, sérialisation API, page Next.js `/courses/[slug]` avec les 5 piliers du référentiel R9 et badges de la taxonomie de Bloom. Tests passants, tsc 0 erreur. | `backend/apps/courses/`, `frontend/app/[locale]/courses/[slug]/page.tsx` |
| 2026-11-09 | F1.11 & V4.5 (Certificats & Vérification) | Modèle `Certificate`, génération automatique à 100%, calcul de note moyenne sur les quiz, endpoints public `/verify/` et apprenant `/my-certificates/`, page diplôme publique Next.js `/verify/[code]` avec sceau doré, modal et bannière dans `LessonReader`, partage WhatsApp & LinkedIn. 58 tests Django passants, tsc 0 erreur. | `backend/apps/courses/`, `frontend/app/[locale]/verify/`, `LessonReader.tsx` |
| 2026-11-08 | F1.9 / F1.10 (Notes & Q&R) | Implémentation complète backend (modèles `LessonNote`, `LessonQuestion`, `LessonAnswer`, services, selectors, serializers, vues, tests) et frontend (`LessonReader.tsx`, API client `courses.service.ts`, types). 55 tests passants, compilation TS validée sans erreur. | `backend/apps/courses/`, `frontend/features/courses/` |
| 2026-11-04 | Curriculum Roadmap (Option B) | Déploiement du cursus YITA Data Analyst Roadmap (3 cours, 18 modules, cas Kamer SARL, liaison vidéos locales D:\videoschariow). | `seed_excel_course.py`, `synopsis.md` |
| 2026-11-03 | Lecteur Stitch & Streaming vidéo | Intégration de la maquette Stitch, lecteur vidéo responsive avec streaming HTTP 206 partiel. | `LessonReader.tsx`, `views.py` |
| 2026-11-02 | Quiz formatifs (F1.7) | Implémentation des quiz interactifs avec niveaux de Bloom, feedback explicatif immédiat, seuil 70%. | `quizzes/`, `QuizView.tsx` |
| 2026-11-01 | Progression & reprise (F1.8) | Suivi de progression par leçon, reprise automatique au dernier visionnage. | `LessonProgress`, `CourseEnrollment` |
