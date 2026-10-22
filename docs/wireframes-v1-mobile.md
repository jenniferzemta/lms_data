# Spécifications et Maquettes Mobile (360 px) — V1 DataMboa

> **Document de conception SAM (Phase Design — V1 Socle)**  
> **Cible matérielle** : Smartphone Android d'entrée de gamme (largeur 360 px).  
> **Contraintes clés** : Zones tactiles ≥ 44×44 px, navigation au pouce en bas d'écran, contraste WCAG AA, page < 300 Ko hors vidéo.

---

## 1. Principes et Tokens Graphiques (Mobile 360 px)

| Token | Rôle | Valeur Tailwind | Hex |
|---|---|---|---|
| `primary` | Marque, rigueur, confiance | `indigo-900` | `#1E3A8A` |
| `primary-light` | Fonds subtils, sélection | `indigo-50` | `#EEF2FF` |
| `accent` | Boutons d'action, CTA, alertes | `amber-500` | `#F59E0B` |
| `accent-hover` | État pressé / survol | `amber-600` | `#D97706` |
| `success` | Validation, scores, WhatsApp | `emerald-600` | `#059669` |
| `bg-light` | Fond de page standard | `slate-50` | `#F8FAFC` |
| `surface` | Fond de carte / modale | `white` | `#FFFFFF` |
| `text-main` | Titres et corps de texte | `slate-900` | `#0F172A` |
| `text-muted` | Métadonnées, sous-titres | `slate-600` | `#475569` |
| `border` | Séparateurs, bordures de carte | `slate-200` | `#E2E8F0` |

---

## 2. Écran 1 : Catalogue de cours (Exigence F1.4)

### Wireframe ASCII (Largeur 360 px)

```text
+------------------------------------+ (360 px)
| [DataMboa]               [FR▾] [👤]| (Top bar 52px, logo + langue + profil)
+------------------------------------+
| [🔍 Rechercher un cours, outil...] | (Search input 44px)
+------------------------------------+
| (Tous) (🟢Excel) (🟡PowerBI) (SQL) >| (Filtres horizontaux scrollables)
| [Niveau: Tous▾]  [Formule: Toutes▾]| (Sélecteurs compacts 36px)
+------------------------------------+
| CARTE DE COURS (328 px)            |
| +--------------------------------+ |
| | [Excel] [Débutant]   [Gratuit] | | (Badges statut)
| | Excel pour la gestion de       | |
| | commerce au Cameroun           | | (Titre 16px semi-bold)
| | ⏱ 3h15 · 📚 12 leçons · 📁 5 xls| | (Métadonnées claires)
| | "Cas pratique : ventes de      | |
| | cacao et marges en FCFA"       | | (Exemple local)
| | [    Commencer gratuitement    ] | | (Bouton action min 44px)
| +--------------------------------+ |
|                                    |
| +--------------------------------+ |
| | [SQL] [Intermédiaire] [Essentiel| |
| | Requêtes SQL sur données réelles| |
| | ⏱ 4h00 · 📚 15 leçons · 🧪 Labo | |
| | [   Débloquer avec Essentiel   ] | | (Bouton accent ambre min 44px)
| +--------------------------------+ |
+------------------------------------+
| [🏠Accueil] [📚Cours] [💎Prix] [👤]| (Barre basse fixe 56px, accès pouce)
+------------------------------------+
```

### Découpage des composants
- `ui/Input.tsx` (recherche avec icône loupe)
- `ui/Badge.tsx` (outil, niveau, formule)
- `ui/Button.tsx` (variantes `primary`, `accent`, `outline`)
- `components/LanguageSwitcher.tsx` (FR / EN avec sauvegarde du cookie)
- `components/BottomNav.tsx` (barre de navigation fixe inférieure)
- `features/catalog/components/CourseCard.tsx` (carte réutilisable)
- `features/catalog/components/ToolFilterList.tsx` (scroll horizontal sans masquage)

---

## 3. Écran 2 : Vue Leçon & Mode Léger (Exigences F1.5 & F1.14)

### Wireframe ASCII (Largeur 360 px)

```text
+------------------------------------+
| [←] Module 1 · Leçon 3/12 [⚡Léger]| (Top bar : retour + avancement + mode)
+------------------------------------+
| +--------------------------------+ |
| |                                | |
| |       LECTEUR VIDÉO (16:9)     | | (Hauteur ~185px)
| |       [▶ Lecture (1080p/360p)]  | |
| |                                | |
| +--------------------------------+ |
|   OU SI MODE LÉGER ACTIVÉ :        |
| +--------------------------------+ |
| | [▶ Écouter l'audio (1.2 Mo)]   | | (Format compressé MP3 basse conso)
| +--------------------------------+ |
+------------------------------------+
| Leçon 3 : Les Tableaux Croisés     |
| Dynamiques (TCD) sur Excel         | (Titre H1 18px)
|                                    |
| Objectif : Regrouper et sommer des |
| ventes par région (Centre, Littoral|
| Ouest) en moins de 3 clics.        |
|                                    |
| 💡 Astuce Cameroun :               |
| Sur Excel configuré en français, la|
| formule utilise le point-virgule(;)|
|                                    |
| 📁 Fichiers d'exercice :           |
| [📥 ventes_cacao_2026.xlsx (42 Ko)]| (Bouton de téléchargement 44px)
+------------------------------------+
| [ ← Précédente ] [ Suivant: Quiz →]| (Barre basse fixe 56px, boutons larges)
+------------------------------------+
```

### Spécificités Mobile-First & Mode Léger
- **Détection réseau lent** : Si la connexion est faible (`navigator.connection.effectiveType === '2g'`), proposer automatiquement d'activer le Mode Léger.
- **Taille de page garantie** : Moins de 300 Ko compressés hors vidéo.
- **Navigation au pouce** : Les boutons "Précédente" et "Suivante" restent toujours collés en bas de l'écran.

---

## 4. Écran 3 : Demande de Paiement Manuel WhatsApp (Exigence F1.10)

### Wireframe ASCII (Largeur 360 px)

```text
+------------------------------------+
| [←] Activer mon abonnement         | (Top bar avec bouton retour)
+------------------------------------+
| RÉCAPITULATIF FORMULE              |
| +--------------------------------+ |
| | Formule Essentiel              | |
| | 10 000 FCFA / mois             | | (Grand affichage du tarif local)
| | ✓ Accès complet Excel & SQL    | |
| | ✓ Laboratoires intégrés        | |
| | ✓ Groupe WhatsApp d'entraide   | |
| +--------------------------------+ |
|                                    |
| COMMENT ACTIVER EN 3 ÉTAPES :      |
| 1. Effectuez le dépôt Mobile Money |
|   🟠 Orange Money : 69X XX XX XX   |
|      (Nom : DataMboa) [📋 Copier]  |
|   🟡 MTN MoMo     : 67X XX XX XX   |
|      (Nom : DataMboa) [📋 Copier]  |
|                                    |
| 2. Envoyez votre preuve de dépôt   |
| +--------------------------------+ |
| | [💬 Envoyer preuve sur WhatsApp]| | (Bouton vert géant 48px avec icône)
| +--------------------------------+ |
|                                    |
| 3. Déblocage sous 2h max           |
| Votre accès est validé manuellement|
| dès réception de votre message.    |
|                                    |
| --- OU DÉCLARATION DIRECTE ---     |
| Numéro émetteur : [67X XXX XXX   ] |
| Référence SMS   : [MP261022.001  ] |
| [     Déclarer mon paiement      ] | (Bouton d'enregistrement 44px)
+------------------------------------+
```

### Mécanisme WhatsApp V1
- Clic sur le bouton vert ouvre WhatsApp avec un lien d'action pré-rempli :
  `https://wa.me/2376XXXXXXXX?text=Bonjour%20DataMboa,%20j'ai%20effectué%20un%20paiement%20de%2010000%20FCFA%20pour%20la%20formule%20Essentiel.%20Mon%20email%20:%20laure@...`
- Côté Django : l'administrateur dispose d'une interface pour valider la demande en un clic, ce qui bascule instantanément le statut de l'apprenant en `active` pour 30 jours.
