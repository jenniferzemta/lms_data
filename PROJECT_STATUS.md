# PROJECT_STATUS.md — Où en est le projet LMS

> **Source de vérité du niveau d'avancement.** Toute IA lit ce fichier juste après `MASTER_PROMPT.md` (protocole §0.2) et le met à jour à la fin de chaque tâche (skill `finish-task`).
> **Légende** : ⬜ à faire · 🟨 en cours · 🔎 code terminé, à valider · ✅ terminé (définition de « terminé » §15 respectée) · ⏸ reporté · **M** = indispensable · **S** = souhaitable.
> **Mise à jour du 9 nov. 2026** : validation de l'exigence F1.11 & V4.5 (Certificats de complétion officiels, vérification publique infalsifiable et partage social WhatsApp/LinkedIn).

---

## 1. Bloc de reprise (à copier dans la section 16 du `MASTER_PROMPT.md` pour une IA sans accès au dépôt)

```text
[BLOC DE REPRISE — mis à jour le 2026-11-09]
Phase globale     : V1 SOCLE
Version suivante  : V1 Socle — phase SAM : Développement (F1.15 / F1.18)
Avancement (M)    : V1 11/19 validé (F1.1 ✅, F1.2 ✅, F1.3 ✅, F1.4 ✅, F1.5 ✅, F1.6 ✅, F1.7 ✅, F1.8 ✅, F1.9 ✅, F1.10 ✅, F1.11 ✅) · V2 0/11 · V3 0/7 · V4 0/4
Conformité péda.  : 19/26 critères R ✅ validés dans le code (R1, R5, R6, R7, R8, R10, R11, R12, R13, R16, R19, R20, R21, R22, R24, R25, R26 + Certificat vérifiable R11)
Fait              : F1.11 & V4.5 terminé — Émission automatique de certificats de réussite à 100% de progression de cours avec code unique infalsifiable (ex. DMB-EXC-2026-9B4F), note finale moyenne calculée sur les quiz, page publique de vérification /verify/[code] responsive (sceau d'authenticité DataMboa, compétences validées, export PDF/impression, partage WhatsApp direct & ajout au profil LinkedIn) + intégration bannière et modal de célébration dans le lecteur Stitch LessonReader. 58/58 tests Django passants, compilation TypeScript 0 erreur.
En cours          : V1 Socle — Suite de la chaîne pédagogique (F1.15 Syllabus de cours conforme référentiel R9 ou F1.18 Exercices interactifs de repérage d'erreurs).
Prochaine tâche   : F1.15 (Syllabus de cours obligatoire avec objectifs SMART, durée estimée, prérequis réels, profil formateur et modalités d'évaluation).
Décisions         : Vérification publique de certificat en accès libre AllowAny pour les recruteurs et employeurs ; mise en forme parchemin diplomatique avec styles d'impression @media print sans dépendance externe lourde.
Questions ouvertes: Agrégateur Mobile Money V4 ; tableur labo Excel V2 ; hébergement VPS+Docker.
Dépôt             : Branche feat/course-certificates prête à être fusionnée sur main, 58/58 tests Django passants, tsc 0 erreur.
Dernière commande : git commit -m "feat(certificates): implement verifiable course completion certificates and public verification page (F1.11)"
```

---

## 2. Position globale

| Élément | Valeur |
|---|---|
| Phase globale | V1 — Socle |
| Version cible suivante | V1 — Socle |
| Phase SAM de la version cible | Développement (F1.15 / F1.18) |
| Dernière mise à jour | 2026-11-09 |
| Dépôt | Synchronisé sur GitHub (`origin/main`), branche de travail `feat/course-certificates` |
| Conformité pédagogique | 19/26 critères R ✅ validés dans le code |

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

---

## 3. Journal des sessions récentes

| Date | Exigence / Tâche | Fait | Fichiers clés |
|---|---|---|---|
| 2026-11-09 | F1.11 & V4.5 (Certificats & Vérification) | Modèle `Certificate`, génération automatique à 100%, calcul de note moyenne sur les quiz, endpoints public `/verify/` et apprenant `/my-certificates/`, page diplôme publique Next.js `/verify/[code]` avec sceau doré, modal et bannière dans `LessonReader`, partage WhatsApp & LinkedIn. 58 tests Django passants, tsc 0 erreur. | `backend/apps/courses/`, `frontend/app/[locale]/verify/`, `LessonReader.tsx` |
| 2026-11-08 | F1.9 / F1.10 (Notes & Q&R) | Implémentation complète backend (modèles `LessonNote`, `LessonQuestion`, `LessonAnswer`, services, selectors, serializers, vues, tests) et frontend (`LessonReader.tsx`, API client `courses.service.ts`, types). 55 tests passants, compilation TS validée sans erreur. | `backend/apps/courses/`, `frontend/features/courses/` |
| 2026-11-04 | Curriculum Roadmap (Option B) | Déploiement du cursus YITA Data Analyst Roadmap (3 cours, 18 modules, cas Kamer SARL, liaison vidéos locales D:\videoschariow). | `seed_excel_course.py`, `synopsis.md` |
| 2026-11-03 | Lecteur Stitch & Streaming vidéo | Intégration de la maquette Stitch, lecteur vidéo responsive avec streaming HTTP 206 partiel. | `LessonReader.tsx`, `views.py` |
| 2026-11-02 | Quiz formatifs (F1.7) | Implémentation des quiz interactifs avec niveaux de Bloom, feedback explicatif immédiat, seuil 70%. | `quizzes/`, `QuizView.tsx` |
| 2026-11-01 | Progression & reprise (F1.8) | Suivi de progression par leçon, reprise automatique au dernier visionnage. | `LessonProgress`, `CourseEnrollment` |
