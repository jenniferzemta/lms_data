# Règle 30 — Back-end Django : couches, sécurité, API

S'applique à tout fichier sous `backend/`.

## Couches (dans cet ordre, sens unique)
`views / serializers (HTTP)` → `services (logique métier)` → `selectors (lectures)` → `models`

- **Aucune logique métier dans les vues ni les serializers.**
- Un module par application dans `backend/apps/<app>/` : `models, services, selectors, serializers, views, urls, tasks, permissions, tests`.
- Applications : `accounts, catalog, learning, labs, assignments, grading, recommendations, portfolio, billing, notifications, audit, companies (V4)`.
- Une application ne modifie jamais les modèles d'une autre : elle appelle son **service**.

## Règles métier centrales
- Les **droits sont vérifiés à chaque requête, côté serveur** (`permissions.py`). L'interface ne fait que masquer.
- L'accès aux niveaux et aux fonctions découle d'**une seule fonction** : `billing/services.compute_access(user)`.
- États d'abonnement : `active | grace | expired | suspended`.
- Les limites chiffrées (corrections par mois, taille de fichier, tentatives) sont des **paramètres modifiables en administration**, jamais codés en dur.
- Contenus terminés, certificats et portfolio **restent accessibles** après expiration.
- Toute action sensible (validation de paiement, changement de formule, suppression) écrit dans `audit` (journal non modifiable : qui, quand, quoi).

## Tâches asynchrones
Corrections de fichiers, rappels, e-mails, génération de reçus : **toujours dans Celery**, jamais dans le cycle de la requête.

## API
- REST versionnée `/api/v1/`, pagination standard.
- Erreurs au format uniforme : `{ "code": "...", "message": "...", "details": {} }`.
- Contrat **OpenAPI** maintenu à jour dans `docs/api/` ; les types du front en sont générés.

## Sécurité
- Mots de passe hachés, limitation des tentatives de connexion, vérification d'e-mail, sessions expirantes.
- Cookies `Secure`, `HttpOnly`, `SameSite`. HTTPS partout.
- Fichiers déposés : contrôle du type et de la taille, antivirus, **macros jamais exécutées**, stockage privé hors dossier public, téléversement par morceaux avec reprise.
- **Aucun code d'apprenant n'est exécuté sur le serveur principal** : exécution dans des conteneurs jetables, sans réseau, limités en temps et en mémoire.
- Webhooks de paiement (V4) : signature vérifiée, puis état revérifié auprès de l'agrégateur.
- Données Mobile Money : ne conserver que le numéro et la référence.
- Configuration par variables d'environnement. **Aucun secret dans le dépôt** ; maintenir `.env.example`.

## Base de données
- PostgreSQL. Migrations versionnées, **jamais éditées après fusion**. Une migration destructive demande une confirmation explicite de Laure.
