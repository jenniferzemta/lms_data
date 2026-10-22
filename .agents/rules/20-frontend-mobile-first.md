# Règle 20 — Front-end : mobile-first, composants, i18n

S'applique à tout fichier sous `frontend/`.

## Mobile-first
- Chaque écran est conçu et codé **d'abord pour 360 px** (Android d'entrée de gamme), puis adapté tablette (`md:`) puis ordinateur (`lg:`). Dans Tailwind, les classes sans préfixe sont celles du mobile.
- Zones tactiles ≥ **44×44 px**. Contrastes **WCAG AA**. Texte lisible sans zoom.
- Navigation d'un cours au pouce : barre inférieure, boutons précédent/suivant en bas d'écran.
- Tableaux larges : défilement horizontal, **première colonne fixe**.
- Budgets : page principale < 3 s en connexion mobile moyenne ; **page de leçon < 300 Ko compressés hors vidéo** ; Lighthouse mobile ≥ 90 (performance et accessibilité) sur les pages publiques.
- Tout composant lourd (tableur, Pyodide, éditeur de code, graphiques) est chargé en différé (`dynamic import`).
- Un conseil « plus confortable sur ordinateur » ne bloque jamais l'accès à une fonction.

## Hiérarchie de composants (dépendances à sens unique)
`app/` → `features/<domaine>/` → `components/` → `ui/` → `lib/`

- `ui/` : atomes (Button, Input, Modal, Tabs, Badge, Skeleton…). **Aucune connaissance de l'API ni du domaine.** Tout passe par les props. Accessibles (rôles ARIA, focus visible). États : *loading, empty, error, success*.
- `components/` : molécules partagées hors domaine (LessonCard, ProgressBar, LanguageSwitcher…).
- `features/<domaine>/` : `components/`, `hooks/`, `services/`, `types.ts`, `index.ts` (**seul point d'entrée public** de la feature).
- `app/` : pages, **assemblage uniquement**, aucune logique.
- Interdit : `ui` qui importe `features` ; une feature qui importe une autre feature (passer par `lib/` ou un module partagé).

## Réutilisation
- Avant de créer un composant, **chercher s'il existe déjà** dans `ui/` ou `components/`.
- Aucune couleur, taille ou espacement écrit en dur : uniquement les **design tokens** (config Tailwind).
- Les composants ne font **jamais** de `fetch` : ils passent par un hook (`useXxx`) qui appelle un service (`xxx.service.ts`) via `lib/api-client`.
- Les types d'API sont **générés** depuis le contrat OpenAPI.

## Internationalisation (FR/EN)
- URL par langue : `/fr/...` et `/en/...`. Bibliothèque : `next-intl`.
- **Aucune phrase en dur.** Tout texte passe par `messages/fr.json` et `messages/en.json` (clés hiérarchisées par feature). Toute clé ajoutée l'est dans **les deux** fichiers.
- Montants, dates, nombres : via `lib/format` (`10 000 FCFA` en FR, `10,000 FCFA` en EN ; dates `jj/mm/aaaa` en FR).
- SQL, Python, Git et DAX restent en anglais dans les laboratoires ; les fonctions Excel sont localisées avec correspondance anglaise.

## Authentification côté client
Jetons dans des cookies **HttpOnly**. Jamais de `localStorage` pour un jeton ou un mot de passe.

## Nommage
`PascalCase.tsx` pour les composants, `useCamelCase.ts` pour les hooks, `xxx.service.ts` pour les services. Imports via l'alias `@/`.
