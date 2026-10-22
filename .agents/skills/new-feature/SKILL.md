---
name: new-feature
description: Use when implementing a new requirement (F1.x to F4.x) or feature in the LMS project, across Next.js and Django. Produces a plan first, then builds with the project architecture, tests, translations and mobile-first checks.
---

# new-feature

## Objectif
Implémenter une exigence du cahier des charges **sans casser l'architecture**, en petits pas vérifiables.

## Étapes
1. **Cadrer** : identifier l'exigence (`F<version>.<rang>`) dans `PROJECT_STATUS.md` et `MASTER_PROMPT.md` §14. Vérifier qu'elle appartient à la version en cours (sinon le signaler).
2. **Chercher l'existant** : composants `ui/` et `components/` réutilisables, services et selectors Django déjà présents.
3. **Écrire le plan** et attendre la validation de Laure :
   - modèles et migrations ;
   - services, selectors, permissions, endpoints (contrat OpenAPI mis à jour) ;
   - hook, service et composants front (hiérarchie `ui → components → features → app`) ;
   - clés de traduction FR et EN ;
   - tests prévus ;
   - fichiers créés ou modifiés.
4. **Construire dans cet ordre** : modèle → service → permissions → endpoint → tests back → types générés → service et hook front → composants mobile-first → traductions → tests front.
5. **Vérifier** : tests, lint, rendu à 360 px dans le navigateur, états loading / empty / error, textes FR et EN, droits côté serveur.
6. **Terminer** avec le skill `finish-task`.

## Contraintes
- Une tâche = une exigence. Pas de fonction d'une version ultérieure.
- Aucune règle métier inventée : signaler et proposer une option recommandée.
- Pas de `any`, pas de texte en dur, pas de `fetch` dans un composant, pas de logique dans une vue.
