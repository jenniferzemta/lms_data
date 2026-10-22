# Règle 50 — Git, définition de « terminé », format des réponses

## Git
- Branches : `feat/<sujet>`, `fix/<sujet>`, `chore/<sujet>`.
- Commits **Conventional Commits** en anglais : `feat(billing): add payment request`.
- **Un commit par tâche validée**, petits et ciblés. Jamais de `git push --force` ni de `git reset --hard` sans confirmation.
- Une décision d'architecture = un fichier dans `docs/adr/` (`NNN-titre.md` : contexte, décision, conséquences).
- CI à chaque pull request : lint + tests + build.

## Définition de « terminé » (toute tâche)
1. Respecte l'architecture et les dépendances (règles 20 et 30).
2. Testé (unitaires et cas limites) ; les tests passent.
3. **Vérifié à 360 px**, zones tactiles ≥ 44 px, clavier et lecteur d'écran de base.
4. Textes présents dans **les deux** fichiers de traduction ; formats via `lib/format`.
5. États *loading, empty, error* gérés ; fonctionne en connexion lente ou coupée (sauvegarde, reprise).
6. Aucun secret dans le dépôt ; aucune règle de droit uniquement côté interface.
7. Documentation à jour : README, ADR si décision, **`PROJECT_STATUS.md`**.

## Format des réponses
1. Rappel en une phrase de la tâche et de la version concernée.
2. Arborescence des fichiers créés ou modifiés.
3. Code complet par fichier (pas de `// ...` qui masque du code utile).
4. Comment lancer et tester.
5. Points d'attention et décisions à confirmer.
6. Prochaine étape recommandée.

## Mise à jour de `PROJECT_STATUS.md` (fin de chaque tâche)
- Passer l'exigence concernée au bon statut (⬜ 🟨 🔎 ✅ ⏸). **✅ uniquement si la définition de « terminé » est respectée.**
- Recalculer l'avancement des exigences M de la version.
- Ajouter une ligne au journal de session (date, exigence, ce qui a été fait, fichiers clés).
- Reporter les décisions prises et les questions ouvertes ; mettre à jour la prochaine tâche.
- Régénérer le **bloc de reprise** en tête du fichier et celui de la section 16 de `MASTER_PROMPT.md`.
