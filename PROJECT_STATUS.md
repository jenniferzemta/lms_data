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
Avancement (M)    : V1 6/19 validé (F1.1 ✅, F1.3 ✅, F1.4 ✅, F1.5 ✅, F1.6 ✅, F1.2 🔎) · V2 0/11 · V3 0/7 · V4 0/4
Conformité péda.  : 11/26 critères R ✅ validés dans le code (R1, R5, R6, R7, R8, R13, R19, R20, R21, R22, R24, R25, R26)
Fait              : Lecteur immersif Stitch (cdd2b4c738c74f2b94f91714461485aa) conforme pixel-perfect ; streaming vidéo HTTP 206 Range depuis D:\videoschariow ; seed des 6 modules Niveau 1 Roadmap YITA avec cas Douala FCFA réels ; 45 tests Django passants ; build 14/14 Next.js validé
En cours          : F1.8 (Progression et reprise apprenant) sur la branche feat/learner-progress
Prochaine tâche   : Modélisation Django CourseEnrollment + LessonProgress, endpoint de complétion, bouton tactile et reprise automatique
Décisions         : Branche dédiée feat/… obligatoire avant tout commit ; streaming vidéo HTTP Range local D:\videoschariow ; protection forfait data mobile africain (Mode Éco 3G et 360p)
Questions ouvertes: Agrégateur Mobile Money V4 ; tableur labo Excel V2 ; hébergement VPS+Docker
Dépôt             : Branche feat/learner-progress active, 45/45 tests Django passants, 0 erreur lint, build Next.js validé
Dernière commande : git commit -m "feat(courses): integrate stitch mockup reader and local video streaming"
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
| Conformité pédagogique | 11/26 critères R ✅ validés dans le code |

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
