# AGENTS.md — Plateforme e-learning d'analyse de données (LMS)

Ce fichier est lu à chaque conversation. Il est volontairement court : le détail est dans `MASTER_PROMPT.md`, `PROJECT_STATUS.md` et `.agents/rules/`.

## Avant toute action (obligatoire)

1. Lis `MASTER_PROMPT.md` (au minimum les sections 0, 4, 14, 15) puis `PROJECT_STATUS.md`.
2. Vérifie la réalité du dépôt : arborescence, `git log -10`, `git status`, tests. Signale tout écart avec `PROJECT_STATUS.md` au lieu de le supposer.
3. Annonce en 8 lignes maximum : version et phase SAM, avancement (exigences M terminées / total), dernière chose terminée, tâche proposée, blocages.
4. Propose un **plan** et attends la validation de Laure avant de modifier le code.

## Le projet en six lignes

- Site d'e-learning qui forme à l'analyse de données par la pratique (Excel, Power BI, SQL, Python, GitHub), avec laboratoires intégrés au navigateur.
- Public : apprenants africains francophones et anglophones, **téléphone Android d'entrée de gamme**, connexion lente. Marché prioritaire : Cameroun, FCFA.
- Stack : Next.js (App Router) + TypeScript + Tailwind ; Django REST ; PostgreSQL ; Celery + Redis ; Docker.
- Quatre versions utilisables seules (V1 Socle, V2 Pratique, V3 Intelligence, V4 Business), modèle SAM.
- Site bilingue FR/EN dès la V1 : aucun texte en dur.
- Droits et règles métier **côté Django uniquement**.

## Règles qui ne se négocient pas

- Mobile-first (360 px), zones tactiles ≥ 44 px, page de leçon < 300 Ko hors vidéo.
- Composants réutilisables : `ui/` → `components/` → `features/` → `app/`, dépendances à sens unique.
- Un fichier = une responsabilité. TypeScript `strict`, jamais de `any`. Pas de nombre magique.
- Backend en couches : vues → services → selectors → models. Tâches lourdes dans Celery.
- Aucun code d'apprenant exécuté sur le serveur principal. Aucun secret dans le dépôt.
- Ne jamais inventer une règle métier : signale le manque et propose une option recommandée.
- Ne pas anticiper une fonction d'une version ultérieure, sauf si cela évite une refonte.

## Langue

Réponds en **français**. Code, noms, commits et commentaires techniques en **anglais**. Explique en 2 ou 3 lignes le pourquoi des choix non triviaux (Laure est développeuse junior).

## Sécurité du terminal

Demande confirmation avant : suppression de fichiers ou de dossiers, `git push --force`, `git reset --hard`, migration destructive, installation de dépendance, modification de `.env`. Ne lis ni n'écris jamais de secret dans le dépôt.

## Fin de tâche (obligatoire)

Vérifie la définition de « terminé » (`MASTER_PROMPT.md` §15), mets à jour `PROJECT_STATUS.md` (statuts, journal de session, décisions, prochaine tâche), puis propose le message de commit. Utilise le skill `finish-task`.

## Où chercher le détail

- Règles détaillées : `.agents/rules/`
- Procédures : `.agents/skills/` (`session-start`, `new-feature`, `finish-task`)
- Décisions d'architecture : `docs/adr/`
