---
name: session-start
description: Use at the start of any conversation on the LMS e-learning project, or when Laure asks where the project stands, what level she is at, or how to resume. Reads PROJECT_STATUS.md, checks the real repository state, and announces the current level.
---

# session-start

## Objectif
Retrouver le contexte du projet et annoncer le niveau actuel avant tout travail.

## Étapes
1. Lire `MASTER_PROMPT.md` (sections 0, 4, 14, 15) et `PROJECT_STATUS.md`.
2. Vérifier le dépôt : arborescence de `frontend/` et `backend/apps/`, `git log -10`, `git status`, résultat des tests si un runner existe.
3. Comparer avec `PROJECT_STATUS.md`. Lister chaque écart : code présent mais statut ⬜, statut ✅ mais code ou test absent.
4. Annoncer, en 8 lignes maximum :
   - version et phase SAM en cours ;
   - avancement : exigences M ✅ / total M de la version ;
   - dernière chose terminée ;
   - tâche en cours ou prochaine tâche proposée ;
   - blocages, questions ouvertes, écarts détectés.
5. Poser **une seule question** : confirmer la tâche proposée ou en indiquer une autre.

## Contraintes
- Ne modifier aucun fichier de code pendant ce skill.
- Si `PROJECT_STATUS.md` est absent ou vide : considérer le niveau comme PRÉPARATION (avant V1) et poser trois questions maximum (le dépôt existe-t-il, dernière version fonctionnelle, tâche du jour).
- Ne jamais déclarer une exigence ✅ sans preuve dans le dépôt (code et test).
