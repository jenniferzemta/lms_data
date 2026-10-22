---
name: finish-task
description: Use at the end of any work session or task on the LMS project, or when Laure says she is done for now. Verifies the definition of done, updates PROJECT_STATUS.md and the resume block, and proposes the commit message.
---

# finish-task

## Objectif
Laisser le projet **reprenable par n'importe quelle IA** : le niveau d'avancement doit être exact à la fin de chaque session.

## Étapes
1. **Vérifier la définition de « terminé »** (`MASTER_PROMPT.md` §15) pour chaque exigence touchée : tests, 360 px, FR/EN, états, sécurité, documentation. Lister ce qui manque.
2. **Mettre à jour `PROJECT_STATUS.md`** :
   - statut de chaque exigence touchée (⬜ 🟨 🔎 ✅ ⏸) : **✅ uniquement si tout est vérifié**, sinon 🔎 ou 🟨 ;
   - recalcul de l'avancement des exigences M de la version ;
   - nouvelle ligne dans le journal de session (date, exigence, ce qui a été fait, fichiers clés) ;
   - décisions prises (créer un ADR si c'est une décision d'architecture) et questions ouvertes ;
   - prochaine tâche proposée.
3. **Régénérer le bloc de reprise** en tête de `PROJECT_STATUS.md` et celui de la section 16 de `MASTER_PROMPT.md` (même contenu).
4. **Proposer le message de commit** (Conventional Commits, en anglais) et la liste des fichiers à inclure.
5. **Résumer en 5 lignes** : fait, reste à faire, prochaine tâche, points d'attention.

## Contraintes
- Ne jamais cocher une exigence ✅ sans preuve dans le dépôt (code et test).
- Ne pas supprimer l'historique du journal : on ajoute des lignes.
- Si un écart est découvert entre le statut et le dépôt, le corriger et le mentionner.
