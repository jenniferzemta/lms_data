# PROJECT_STATUS.md — Où en est le projet LMS

> **Source de vérité du niveau d'avancement.** Toute IA lit ce fichier juste après `MASTER_PROMPT.md` (protocole §0.2) et le met à jour à la fin de chaque tâche (skill `finish-task`).
> **Légende** : ⬜ à faire · 🟨 en cours · 🔎 code terminé, à valider · ✅ terminé (définition de « terminé » §15 respectée) · ⏸ reporté · **M** = indispensable · **S** = souhaitable.
> ⚠️ **État initial supposé** (22 oct. 2026) : tout est à ⬜. Laure doit corriger ce fichier au premier lancement, et l'IA doit comparer avec le dépôt réel.

---

## 1. Bloc de reprise (à copier dans la section 16 du `MASTER_PROMPT.md` pour une IA sans accès au dépôt)

```text
[BLOC DE REPRISE — mis à jour le 2026-10-22]
Phase globale     : PRÉPARATION (avant V1)
Version suivante  : V1 Socle — phase SAM : Design
Avancement (M)    : V1 0/13 · V2 0/10 · V3 0/7 · V4 0/4
Fait              : cahier des charges ; kit Antigravity ; dépôt Git initialisé et synchronisé avec GitHub ; nom fixé (DataMboa / datamboa.com)
En cours          : identité visuelle minimale et maquettes mobile (360 px) des écrans V1
Prochaine tâche   : maquettes mobile (360 px) des 3 écrans V1 (catalogue, leçon, paiement WhatsApp), puis initialisation du monorepo
Décisions         : Nom "DataMboa" (datamboa.com) ; Next.js + Django REST + PostgreSQL + Celery/Redis ; FR/EN dès V1 ; paiement manuel WhatsApp en V1, Mobile Money intégré en V4 ; 4 formules (0 / 10 000 / 30 000 / 100 000 FCFA)
Questions ouvertes: agrégateur de paiement V4 ; tableur du labo Excel (V2) ; hébergement VPS+Docker ; rédaction des contenus
Dépôt             : Initialisé sur main, synchronisé avec GitHub (origin/main)
Dernière commande : git commit -m "chore: initialize repository with project specifications and agent kit"
```

---

## 2. Position globale

| Élément | Valeur |
|---|---|
| Phase globale | PRÉPARATION (avant V1) |
| Version cible suivante | V1 — Socle |
| Phase SAM de la version cible | Design |
| Dernière mise à jour | 2026-10-22 |
| Dépôt | Initialisé sur `main`, synchronisé avec GitHub (`origin/main`) |

### Jalons de préparation

| Jalon | Statut | Notes |
|---|---|---|
| Cahier des charges rédigé | ✅ | Version du 16 oct. 2026 |
| Master prompt v2 + kit Antigravity | ✅ | Ce document et `AGENTS.md`, `.agents/` |
| Dépôt Git initialisé et configuré | ✅ | Synchronisé avec GitHub (`main`) |
| Nom, domaine, identité visuelle | 🟨 | Nom et domaine validés : DataMboa / datamboa.com ; identité visuelle en cours |
| Rendu académique du document d'analyse | ⬜ | Échéance indiquée : 10 nov. 2026 (à confirmer) |
| Priorités et formules validées | ⬜ | Critère de passage de la préparation |
| Choix de l'agrégateur Mobile Money | ⬜ | À comparer avant la V4, pas bloquant pour la V1 |
| Premier cours rédigé (Excel débutant, FR + EN) | ⬜ | Le contenu est le vrai goulot d'étranglement |

---

## 3. Exigences par version

### V1 — Socle · avancement M : 0/13 · critère de passage : un groupe termine un module + ≥ 1 paiement manuel validé de bout en bout

| ID | Exigence | Prio | Statut | Notes / fichiers clés |
|---|---|---|---|---|
| F1.1 | Inscription, connexion, mot de passe oublié, Google | M | ⬜ | |
| F1.2 | Interface et contenus bilingues FR/EN | M | ⬜ | |
| F1.3 | Rôles et droits côté serveur | M | ⬜ | |
| F1.4 | Catalogue + recherche/filtres (outil, niveau, langue, formule) | M | ⬜ | |
| F1.5 | Structure parcours → leçon (texte riche, vidéo, audio, PDF, code) | M | ⬜ | |
| F1.6 | Fichiers téléchargeables par leçon | M | ⬜ | |
| F1.7 | Quiz (unique, multiple, V/F, numérique) + note de passage | M | ⬜ | |
| F1.8 | Progression et reprise | M | ⬜ | |
| F1.9 | Formules et accès par niveau, activation manuelle | M | ⬜ | `billing/services.compute_access` |
| F1.10 | Paiement manuel WhatsApp + file de validation + reçu | M | ⬜ | |
| F1.11 | Certificat avec code unique | S | ⬜ | |
| F1.12 | Espace formateur | M | ⬜ | |
| F1.13 | Tableaux de bord apprenant et administrateur | M | ⬜ | |
| F1.14 | Mode léger | M | ⬜ | |

### V2 — Pratique · avancement M : 0/10 · critère de passage : exercices faisables sur téléphone par des apprenants ordinaires

| ID | Exigence | Prio | Statut | Notes / fichiers clés |
|---|---|---|---|---|
| F2.1 | Laboratoire SQL | M | ⬜ | |
| F2.2 | Laboratoire Python | M | ⬜ | |
| F2.3 | Laboratoire Excel | M | ⬜ | Choix du tableur après prototype |
| F2.4 | Éditeur d'exercices | M | ⬜ | |
| F2.5 | Dépôt de fichiers par morceaux | M | ⬜ | |
| F2.6 | Correction par le formateur | M | ⬜ | |
| F2.7 | Missions « scénario d'entreprise africaine » | M | ⬜ | |
| F2.8 | Portfolio | M | ⬜ | |
| F2.9 | Ajout en un clic d'un projet validé au portfolio | M | ⬜ | |
| F2.10 | Questions-réponses par leçon | S | ⬜ | |
| F2.11 | Points, badges, défis | S | ⬜ | |
| F2.12 | Suivi par le formateur | M | ⬜ | |

### V3 — Intelligence · avancement M : 0/7 · critère de passage : rapport de complétude jugé juste par les formateurs sur de vrais devoirs

| ID | Exigence | Prio | Statut | Notes / fichiers clés |
|---|---|---|---|---|
| F3.1 | Correction automatique Excel + rapport de complétude | M | ⬜ | |
| F3.2 | Correction automatique SQL/Python isolée | M | ⬜ | |
| F3.3 | Laboratoire GitHub | M | ⬜ | |
| F3.4 | Connexion à un vrai compte GitHub | S | ⬜ | |
| F3.5 | Laboratoire Power BI | M | ⬜ | Prototype avant décision |
| F3.6 | Vérification de fichiers .pbix | S | ⬜ | |
| F3.7 | Test de positionnement | M | ⬜ | |
| F3.8 | Recommandations et rappels | M | ⬜ | |
| F3.9 | Alertes de risque d'abandon | S | ⬜ | |
| F3.10 | PWA et contenus hors ligne | M | ⬜ | |
| F3.11 | Suggestions de projets manquants | S | ⬜ | |

### V4 — Business · avancement M : 0/4 · critère de passage : paiements réels réussis avec MTN et Orange

| ID | Exigence | Prio | Statut | Notes / fichiers clés |
|---|---|---|---|---|
| F4.1 | Mobile Money intégré | M | ⬜ | |
| F4.2 | Activation automatique par webhook signé | M | ⬜ | |
| F4.3 | Rappels, période de grâce, relances | M | ⬜ | |
| F4.4 | Espace entreprise | S | ⬜ | |
| F4.5 | Certificats vérifiables publics | M | ⬜ | |
| F4.6 | Annuaire de recruteurs avec consentement | S | ⬜ | |
| F4.7 | Parcours métiers | S | ⬜ | |
| F4.8 | Autres opérateurs / zone UEMOA | S | ⬜ | |

---

## 4. État réel du code (à tenir à jour)

| Zone | État | Notes |
|---|---|---|
| Monorepo, `docker-compose.yml`, `.env.example`, CI | 🟨 | `docker-compose.yml` et `.env.example` créés |
| `backend/` (Django) — applications créées | 🟨 | Projet `config` initialisé, structure `apps/` prête, check OK |
| `frontend/` (Next.js) — design system `ui/` | 🟨 | Next.js 16 + Tailwind v4 + `next-intl` bilingue FR/EN + tokens DataMboa, build testé avec succès |
| `messages/fr.json` et `messages/en.json` | ✅ | Fichiers créés et branchés via middleware next-intl |
| Contrat OpenAPI (`docs/api/`) | ⬜ | À générer après les premiers endpoints |
| Tests (back, front, E2E) | ⬜ | À configurer |
| Déploiement | ⬜ | Prêt pour liaison Vercel (dossier `frontend`) |

---

## 5. Décisions prises

| Date | Décision | ADR |
|---|---|---|
| 2026-10-16 | Stack : Next.js (App Router) + TypeScript + Tailwind ; Django REST ; PostgreSQL ; Celery + Redis ; Docker | à créer |
| 2026-10-16 | Quatre versions utilisables seules (modèle SAM) | — |
| 2026-10-16 | Site bilingue FR/EN dès la V1 | — |
| 2026-10-16 | Paiement manuel via WhatsApp en V1, Mobile Money intégré en V4 | — |
| 2026-10-16 | Quatre formules : Découverte 0 / Essentiel 10 000 / Professionnel 30 000 / Expert 100 000 FCFA par mois (à tester dès la V1) | — |
| 2026-10-22 | Agent de codage : Antigravity ; instructions dans `AGENTS.md` et `.agents/` | — |
| 2026-10-22 | Nom de la plateforme retenu : **DataMboa** ; nom de domaine cible : **datamboa.com** | — |

---

## 6. Questions ouvertes

1. Agrégateur Mobile Money (Notch Pay, Campay, CinetPay, Flutterwave, Paystack) : frais, retrait, fiabilité, conditions pour une société camerounaise (pour V4).
2. Tableur du laboratoire Excel (choix après prototype en V2).
3. Hébergement : VPS + Docker recommandé (Vercel gratuit réservé aux prototypes).
4. Qui rédige les contenus ? Au moins un rédacteur est recommandé en soutien à Laure.
5. Aspects légaux (mentions, CGU, remboursement, protection des données) : validation juridique avant la V4.

---

## 7. Prochaines tâches proposées (ordre de priorité)

1. Commiter et fusionner l'initialisation du monorepo (`chore/monorepo-setup` -> `main`).
2. Déployer sur Vercel (connecter le dépôt GitHub, indiquer le dossier racine `frontend`).
3. F1.4 : Implémenter le Catalogue de cours mobile-first (360 px) à partir de la maquette Stitch.
4. F1.1 + F1.3 : Modélisation des comptes et des rôles côté Django (`backend/apps/accounts`).

---

## 8. Journal de session (ajouter une ligne par session, ne jamais effacer)

| Date | Exigence(s) | Ce qui a été fait | Fichiers clés | Reste à faire |
|---|---|---|---|---|
| 2026-10-22 | — | Master prompt v2, suivi d'avancement, kit Antigravity créés | `MASTER_PROMPT.md`, `PROJECT_STATUS.md`, `AGENTS.md`, `.agents/` | Confirmer l'état réel du projet |
| 2026-10-22 | — | Initialisation Git (.gitignore, premier commit sur main, relié et poussé sur GitHub) ; choix du nom DataMboa (datamboa.com) | `.gitignore`, `PROJECT_STATUS.md` | Identité visuelle et maquettes 360 px |
| 2026-10-22 | — | Maquettes mobile (docs/wireframes-v1-mobile.md) + Squelette monorepo (docker-compose, .env.example, frontend Next.js + next-intl bilingue FR/EN, backend Django REST) | `docker-compose.yml`, `.env.example`, `frontend/`, `backend/` | Commit et merge sur main |
