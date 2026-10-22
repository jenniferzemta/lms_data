# Règle 10 — Clean code (tous langages)

À appliquer à chaque fichier, côté Next.js comme côté Django.

## Structure
- **Un fichier = une responsabilité.** Une fonction fait une seule chose et tient en ~30 lignes. Un composant tient en ~150 lignes : au-delà, on découpe.
- **DRY** : toute duplication de logique ou de markup est extraite dès la **deuxième** occurrence.
- Pas de code mort, pas de `console.log`, pas de `print` de débogage, pas de code commenté.

## Nommage
- Noms explicites et prononçables, sans abréviation obscure.
- Booléens en `is`, `has`, `can`, `should`.
- Constantes nommées pour tout nombre ou chaîne qui porte un sens : **aucun nombre magique**.
- Code, noms et commentaires techniques en **anglais**. Les textes visibles par l'utilisateur sont dans les fichiers de traduction, jamais dans le code.

## Typage et erreurs
- TypeScript `strict: true`, **jamais de `any`** (utiliser `unknown` puis restreindre).
- Python : annotations de type partout ; `snake_case` ; formatage Black, isort, Ruff.
- Les erreurs sont **typées et gérées**, jamais avalées. Message utilisateur traduit ; message technique en anglais dans les logs.
- Aucune règle de droit uniquement dans l'interface.

## Commentaires
Un commentaire explique le **pourquoi**, jamais le quoi. Si le quoi n'est pas clair, renommer ou découper.

## Tests
- Chaque règle métier a au moins un test (cas nominal + cas limite).
- Back : `pytest`, services et permissions d'abord. Front : Vitest + Testing Library. E2E : Playwright sur les parcours critiques (inscription, leçon, paiement manuel, laboratoire).
- Un bug corrigé reçoit d'abord un test qui le reproduit.

## SOLID appliqué
- Composition plutôt qu'héritage ; dépendances injectées par props, hooks ou paramètres.
- Une nouvelle variante (laboratoire, type de fichier, opérateur de paiement) s'ajoute en **ajoutant un module**, pas en modifiant le cœur.
