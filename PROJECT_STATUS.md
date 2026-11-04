# PROJECT_STATUS.md — Où en est le projet LMS

> **Source de vérité du niveau d'avancement.** Toute IA lit ce fichier juste après `MASTER_PROMPT.md` (protocole §0.2) et le met à jour à la fin de chaque tâche (skill `finish-task`).
> **Légende** : ⬜ à faire · 🟨 en cours · 🔎 code terminé, à valider · ✅ terminé (définition de « terminé » §15 respectée) · ⏸ reporté · **M** = indispensable · **S** = souhaitable.
> **Mise à jour du 3 nov. 2026** : intégration du référentiel pédagogique des Modules 1–3 (master prompt v3) : nouvelles exigences F1.15 à F1.20, F2.13, F2.14, F3.12, F3.13, F4.9 et grille de conformité académique R1 à R26 (section 4).

---

## 1. Bloc de reprise (à copier dans la section 16 du `MASTER_PROMPT.md` pour une IA sans accès au dépôt)

```text
[BLOC DE REPRISE — mis à jour le 2026-11-04]
Phase globale     : V1 SOCLE
Version suivante  : V1 Socle — phase SAM : Développement (F1.9 / F1.10)
Avancement (M)    : V1 8/19 validé (F1.1 ✅, F1.3 ✅, F1.4 ✅, F1.5 ✅, F1.6 ✅, F1.7 ✅, F1.8 ✅, F1.2 🔎) · V2 0/11 · V3 0/7 · V4 0/4
Conformité péda.  : 14/26 critères R ✅ validés dans le code (R1, R5, R6, R7, R8, R10, R13, R16, R19, R20, R21, R22, R24, R25, R26)
Fait              : F1.7 validé (Modélisation Quiz, QuizQuestion avec niveaux taxonomiques de Bloom, QuizAnswerOption, QuizAttempt, seuil de validation configurable 70%, feedback explicatif pédagogique immédiat sans rechargement R24, validation automatique de la leçon en cas de succès, composant tactile mobile LessonQuizInteractive intégré dans LessonReader, 52/52 tests Django passants, build 14/14 Next.js validé)
En cours          : V1 Socle
Prochaine tâche   : F1.9 (Prise de notes personnelles synchronisées par leçon avec timecodes vidéo) ou F1.10 (Espace Q&R d'entraide par leçon)
Décisions         : Feedback pédagogique explicatif et réponses correctes masqués côté public GET et révélés uniquement après soumission POST ; validation automatique de leçon liée au seuil de passage.
Questions ouvertes: Agrégateur Mobile Money V4 ; tableur labo Excel V2 ; hébergement VPS+Docker
Dépôt             : Branche feat/quizzes active, 52/52 tests Django passants, 0 erreur lint, build Next.js validé
Dernière commande : git commit -m "feat(quizzes): implement interactive formative quizzes with Bloom levels, feedback and passing threshold (F1.7)"
```

---

## 2. Position globale

| Élément | Valeur |
|---|---|
| Phase globale | V1 — Socle |
| Version cible suivante | V1 — Socle |
| Phase SAM de la version cible | Développement (F1.9 / F1.10) |
| Dernière mise à jour | 2026-11-04 |
| Dépôt | Synchronisé sur GitHub (`origin/main`), branche de travail `feat/quizzes` |
| Conformité pédagogique | 14/26 critères R ✅ validés dans le code |

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
| Lecteur de cours Stitch | ✅ | Reproduit pixel-perfect depuis la maquette Stitch `cdd2b4c738c74f2b94f91714461485aa` |
| Intégration vidéos locales | ✅ | Endpoint Django streaming HTTP Range 206 depuis `D:\videoschariow` |
| Progression et reprise (F1.8) | ✅ | CourseEnrollment + LessonProgress, endpoints REST, auto-reprise, validation sommaire |
| Quiz interactifs & feedback (F1.7) | ✅ | Quiz, Bloom levels, score 70%, feedback pédagogique instantané R24, auto-complétion |
