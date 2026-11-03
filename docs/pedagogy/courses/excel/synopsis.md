# Cours Excel — programme complet par niveau et par module

**Plateforme e-learning d'analyse de données · tronc Excel · version 1 — 3 nov. 2026**

Emplacement dans le dépôt : `docs/pedagogy/courses/excel/synopsis.md`. Ce document est le **synopsis** (étape 2 de la scénarisation, `MASTER_PROMPT.md` §20.4) du parcours Excel. Chaque leçon est un **grain pédagogique** à développer avec le gabarit de leçon (§20.4) et à valider avec la checklist (§20.10).

> **[support]** = tiré des supports de cours ; **[reco]** = proposition de conception à valider (durées, nombre de questions, note de passage).

## 1. Comment ce programme répond à l'exigence du cours

| Exigence (Modules 1–3) | Réponse dans ce programme |
|---|---|
| Objectifs SMART + Bloom [support M2] | Chaque leçon porte un objectif commençant par un verbe de Bloom et son niveau (1 à 6) |
| Progression du simple au complexe [support M2] | Chaque module monte vers un niveau ≥ 3 ; chaque niveau se termine par un projet de niveau 6 (Créer) |
| Évaluations variées [support M3] | Quiz scénario, texte à trous, glisser-déposer, repérage d'erreurs, cas guidés ; labos et vidéos interactives dès la V2 |
| Mise en situation réelle [support M3] | Jeux de données locaux en FCFA : marché, RH, agence bancaire, stations-service, école, ONG, microfinance |
| Présentation de cours en 5 éléments [support M3] | Section 3 pour les trois niveaux |
| Scénarisation en 4 étapes [support M2] | Analyse (section 2), synopsis (ce document), grains (leçons), story-board (à rédiger par leçon) |
| Évaluation de la formation [support M2, phase Évaluation] | Questionnaire de fin de niveau (F1.20) et mesure de l'atteinte des objectifs |

## 2. Analyse et architecture du parcours (étape « Analyse » d'ADDIE)

- **Public cible** : étudiants, jeunes diplômés, salariés (RH, finance, logistique, commerce), autodidactes ; francophones d'abord, interface bilingue.
- **Contraintes** : téléphone souvent seul appareil ; connexion lente ; pas de licence Excel garantie → laboratoire Excel dans le navigateur (V2), équivalents gratuits cités ; Excel installé en français (fonctions **françaises avec correspondance anglaise**).
- **Fil rouge** : une entreprise fictive, **Distribution Kamer SARL** (siège à Douala, agences, 300 employés, ventes, stations partenaires), pour que les niveaux se suivent sur un même univers. Vous pouvez y brancher vos cas existants (RH, banque, stations-service) comme jeux de données.
- **Inspirations** : séquence courte et progressive du tutoriel [W3Schools Excel](https://www.w3schools.com/excel/excel_syllabus.php) (syntaxe, plages, recopie, références, mise en forme, tri, filtre, tableaux, mise en forme conditionnelle, graphiques, TCD, cas, **référentiel de fonctions**) ; enchaînement *fondamentaux → visualisation → outils puissants → préparation/nettoyage → intégration → projet final* de la [spécialisation Macquarie « Excel Skills for Data Analytics and Visualization »](https://course-careers-edge.pages.dev/excel-courses/excel-skills-for-data-analytics-and-visualization-specialization-course/syllabus) ; résultats attendus (tableaux, TCD, Power Query, Power Pivot, regroupement, graphiques) du cours [Intermediate Excel d'Enterprise DNA](https://www.enterprisedna.co/courses/intermediate-excel).

**Ce qui est adapté par rapport à ces sources** : leçons plus courtes (grains de 8 à 20 min), objectifs mesurables, évaluation à chaque leçon, données locales en FCFA, et fonctions listées dans un **référentiel à part** (annexe B) plutôt qu'en dizaines de leçons.

### Les trois niveaux et les formules d'abonnement (`MASTER_PROMPT.md` §10)

| Niveau | Public | Modules | Leçons | Durée estimée [reco] | Débouché | Formule |
|---|---|---|---|---|---|---|
| **E1 — Débutant** | Aucun prérequis | 7 | 35 | ≈ 8.4 h + projet | Mini-projet N1 + certificat débutant | Découverte (modules 1 à 3) · Essentiel (tout) |
| **E2 — Intermédiaire** | Avoir validé E1 | 7 | 35 | ≈ 8.7 h + projet | Mini-projet N2 + certificat intermédiaire | Professionnel |
| **E3 — Avancé** | Avoir validé E2 | 7 | 35 | ≈ 8.5 h + projet | Projet de synthèse → portfolio | Expert |

Total : **105 leçons**. Les durées sont des estimations (8 min pour une leçon de niveau 1–2, 15 min pour les niveaux 3 à 5, 20 min pour le niveau 6) à confirmer en revue avec de vrais apprenants.

### Légende des activités

| Code | Activité | Disponible dès |
|---|---|---|
| `Q` | Quiz scénario | V1 |
| `TT` | Texte à trous | V1 |
| `DD` | Glisser-déposer | V1 |
| `RE` | Repérage d'erreurs | V1 |
| `TD` | Fiche TD téléchargeable (puis dépôt, labo) | V1 → V2/V3 |
| `CAS` | Cas guidé / mission | V2 |

**Règle de livraison** : chaque leçon se termine par un **quiz formatif** (3 à 5 questions, feedback explicatif). Les activités `CAS` (et les labos Excel / vidéos interactives) n'apparaissent qu'à partir de la V2 ; en V1 elles sont remplacées par la **fiche TD téléchargeable** et un quiz de contrôle qui visent **le même objectif**. Les contenus sont donc écrits une fois et enrichis ensuite.

### Évaluation du parcours (trois finalités, §20.6)

| Finalité | Où | Forme |
|---|---|---|
| Diagnostique | Avant E1, avant E2, avant E3 | Pré-test de 10 questions, sans note ; recommande le module de départ |
| Formative | Chaque leçon | Quiz de 3 à 5 questions + activité ; indices, feedback, tentatives illimitées |
| Sommative | Fin de chaque module | Quiz de 10 questions mêlant au moins 3 types ; **note de passage 70 % [reco]** ; 2 tentatives |
| Sommative de niveau | Fin de chaque niveau | Mini-projet (projet de synthèse pour E3) noté sur la grille de la section 8 ; **le certificat n'est délivré qu'après réussite** |
| Évaluation de la formation | Fin de chaque niveau | Questionnaire de satisfaction (clarté, utilité, difficulté, durée) |

## 3. Présentation de cours (5 éléments obligatoires, §20.5)

### Excel — Niveau 1 : Les fondamentaux

| Élément | Contenu proposé |
|---|---|
| Objectifs | À la fin du niveau, vous saurez **organiser, calculer et présenter** des données dans Excel, **répondre à des questions** avec des fonctions conditionnelles et un TCD, et **assembler un mini-dashboard** à partir d'un fichier brut. |
| Formateur | Laure — développeuse web et data, étudiante en Master 1 Génie des TIC (Data Science & Business Intelligence) à l'ENSET Douala, formatrice en Excel et Power BI *(texte à valider et à compléter par vous)* |
| Public et prérequis | Débutants complets, étudiants, salariés qui reçoivent des fichiers à traiter. Prérequis : savoir utiliser un ordinateur ou un téléphone ; Excel, Google Sheets ou LibreOffice (ou le laboratoire de la plateforme en V2). |
| Programme et durée | 7 modules, 35 leçons, 7 TD, 1 mini-projet ; ≈ 8,4 h de leçons + 2 h de projet. |
| Modalités pédagogiques | Leçon courte → exemple résolu → exercice interactif → quiz → TD à télécharger ; questions-réponses avec le formateur ; groupe WhatsApp de cohorte. |

### Excel — Niveau 2 : Analyse de données

| Élément | Contenu proposé |
|---|---|
| Objectifs | À la fin du niveau, vous saurez **nettoyer** un fichier sale avec des fonctions, **relier** des tables, **analyser** avec des TCD avancés et **construire un tableau de bord interactif** pour un décideur. |
| Formateur | Laure — développeuse web et data, étudiante en Master 1 Génie des TIC (Data Science & Business Intelligence) à l'ENSET Douala, formatrice en Excel et Power BI *(texte à valider et à compléter par vous)* |
| Public et prérequis | Apprenants ayant validé E1 ou équivalent (tableaux structurés, SI, SOMME.SI, TCD simple). Test de positionnement disponible. |
| Programme et durée | 7 modules, 35 leçons, 7 TD, 1 mini-projet ; ≈ 8,7 h de leçons + 3 h de projet. |
| Modalités pédagogiques | Cas métier par module ; fichiers « sales » réalistes ; repérage d'erreurs ; correction du mini-projet par grille. |

### Excel — Niveau 3 : Excel moderne, Power Query, Power Pivot et DAX

| Élément | Contenu proposé |
|---|---|
| Objectifs | À la fin du niveau, vous saurez **automatiser la préparation des données** avec Power Query, **modéliser** avec Power Pivot, **écrire des mesures DAX** et **livrer un modèle** réutilisable, prêt à passer dans Power BI. |
| Formateur | Laure — développeuse web et data, étudiante en Master 1 Génie des TIC (Data Science & Business Intelligence) à l'ENSET Douala, formatrice en Excel et Power BI *(texte à valider et à compléter par vous)* |
| Public et prérequis | Apprenants ayant validé E2. Prérequis matériel : Excel pour Windows avec Power Query et Power Pivot (sinon le laboratoire de simulation guidée, puis dépôt de fichier). |
| Programme et durée | 7 modules, 35 leçons, 7 TD, 1 projet de synthèse ; ≈ 8,5 h de leçons + 5 h de projet. |
| Modalités pédagogiques | Cas guidés pas à pas, correction automatique du modèle et des mesures dès la V3, relecture humaine du projet de synthèse (formule Expert). |

## 4. Excel — Niveau 1 : Les fondamentaux

*7 modules · 35 leçons · ≈ 8.4 h · répartition Bloom : Mémoriser 1 · Comprendre 4 · Appliquer 21 · Analyser 5 · Évaluer 3 · Créer 1*

### Module E1.1 — Découvrir Excel

**Jeu de données** : Classeur d'accueil « Distribution Kamer » (10 lignes) · **TD** : TD1 : Mon premier classeur · **Durée** ≈ 58 min

| ID | Leçon | Objectif (verbe de Bloom) | Niveau | Activité |
|---|---|---|---|---|
| E1.1.1 | Repérer les éléments de l'interface | Nommer classeur, feuille, cellule, ruban et barre de formule sur une capture | 1 Mémoriser | `DD` |
| E1.1.2 | Distinguer les types de données | Classifier texte, nombre, date et montant dans un tableau de 10 lignes | 2 Comprendre | `TT` |
| E1.1.3 | Sélectionner et recopier | Utiliser la poignée de recopie pour créer des séries (numéros, mois, jours) | 3 Appliquer | `TD` |
| E1.1.4 | Insérer, déplacer, supprimer | Utiliser les commandes sur lignes, colonnes et cellules, et annuler une erreur | 3 Appliquer | `RE` |
| E1.1.5 | Enregistrer dans le bon format | Choisir entre .xlsx, .csv et PDF selon l'usage | 2 Comprendre | `Q` |

**Évaluation du module** : quiz sommatif de 10 questions (≥ 3 types, 70 %), questions rattachées aux objectifs ci-dessus.

### Module E1.2 — Saisir, formater et présenter

**Jeu de données** : Registre de ventes d'un marché (FCFA, dates mixtes) · **TD** : TD2 : Rendre un tableau lisible · **Durée** ≈ 75 min

| ID | Leçon | Objectif (verbe de Bloom) | Niveau | Activité |
|---|---|---|---|---|
| E1.2.1 | Formats de nombre | Appliquer le format milliers, FCFA, pourcentage et décimales | 3 Appliquer | `TT` |
| E1.2.2 | Dates uniformes | Examiner une colonne de dates et repérer les fausses dates (texte) | 4 Analyser | `RE` |
| E1.2.3 | Police, couleurs, bordures | Utiliser la mise en forme et le pinceau pour harmoniser un tableau | 3 Appliquer | `TD` |
| E1.2.4 | Hiérarchie visuelle d'un tableau | Justifier le choix de deux mises en forme d'un même tableau (lisibilité, couleur d'accent) | 5 Évaluer | `Q` |
| E1.2.5 | Préparer l'impression | Utiliser zone d'impression, orientation et en-têtes répétés pour exporter en PDF | 3 Appliquer | `TD` |

**Évaluation du module** : quiz sommatif de 10 questions (≥ 3 types, 70 %), questions rattachées aux objectifs ci-dessus.

### Module E1.3 — Formules et fonctions de base

**Jeu de données** : Relevé de caisse mensuel (30 lignes) · **TD** : TD3 : Calculer sans calculatrice · **Durée** ≈ 75 min

| ID | Leçon | Objectif (verbe de Bloom) | Niveau | Activité |
|---|---|---|---|---|
| E1.3.1 | Écrire une formule | Calculer avec les opérateurs, priorités et parenthèses | 3 Appliquer | `TT` |
| E1.3.2 | SOMME, MOYENNE, MIN, MAX | Calculer total, moyenne et extrêmes d'une colonne | 3 Appliquer | `TD` |
| E1.3.3 | Compter : NB, NBVAL, NB.VIDE | Utiliser les fonctions de comptage pour contrôler un fichier | 3 Appliquer | `Q` |
| E1.3.4 | Références relatives, absolues, mixtes | Analyser l'effet du symbole $ lors de la recopie d'une formule | 4 Analyser | `RE` |
| E1.3.5 | Arrondir et comprendre les erreurs | Examiner #DIV/0!, #REF!, #NOM? et #VALEUR! et corriger la formule | 4 Analyser | `RE` |

**Évaluation du module** : quiz sommatif de 10 questions (≥ 3 types, 70 %), questions rattachées aux objectifs ci-dessus.

### Module E1.4 — Trier, filtrer et structurer en tableau

**Jeu de données** : Liste de 300 employés (RH) · **TD** : TD4 : Ma liste du personnel · **Durée** ≈ 70 min

| ID | Leçon | Objectif (verbe de Bloom) | Niveau | Activité |
|---|---|---|---|---|
| E1.4.1 | Trier | Utiliser le tri sur un puis plusieurs critères | 3 Appliquer | `TD` |
| E1.4.2 | Filtrer | Utiliser les filtres texte, nombre et date pour extraire une liste | 3 Appliquer | `TD` |
| E1.4.3 | Tableau structuré (Ctrl+T) | Illustrer trois avantages du tableau structuré par rapport à une plage | 2 Comprendre | `Q` |
| E1.4.4 | Doublons et volets figés | Appliquer la suppression des doublons et le figement des volets | 3 Appliquer | `TD` |
| E1.4.5 | Une base propre | Examiner un fichier et repérer ce qui viole « une ligne = un enregistrement, une colonne = une variable » | 4 Analyser | `RE` |

**Évaluation du module** : quiz sommatif de 10 questions (≥ 3 types, 70 %), questions rattachées aux objectifs ci-dessus.

### Module E1.5 — Fiabiliser la saisie et repérer l'information

**Jeu de données** : Fiche de suivi des opérations d'une agence bancaire · **TD** : TD5 : Un fichier qui se protège des erreurs · **Durée** ≈ 60 min

| ID | Leçon | Objectif (verbe de Bloom) | Niveau | Activité |
|---|---|---|---|---|
| E1.5.1 | Listes déroulantes | Utiliser la validation des données pour créer une liste déroulante | 3 Appliquer | `TD` |
| E1.5.2 | Règles de saisie | Appliquer des limites (nombre, date, longueur) avec message d'erreur personnalisé | 3 Appliquer | `TT` |
| E1.5.3 | Mise en forme conditionnelle : règles | Utiliser les règles de surbrillance et les 10 premiers éléments | 3 Appliquer | `TD` |
| E1.5.4 | Barres, nuances, icônes | Justifier le choix d'une visualisation conditionnelle pour trois situations | 5 Évaluer | `Q` |

**Évaluation du module** : quiz sommatif de 10 questions (≥ 3 types, 70 %), questions rattachées aux objectifs ci-dessus.

### Module E1.6 — Fonctions conditionnelles

**Jeu de données** : Ventes par produit et par agence (500 lignes) · **TD** : TD6 : Répondre aux questions du chef · **Durée** ≈ 75 min

| ID | Leçon | Objectif (verbe de Bloom) | Niveau | Activité |
|---|---|---|---|---|
| E1.6.1 | SI | Appliquer la fonction SI pour classer des résultats (admis/ajourné, en retard/à jour) | 3 Appliquer | `TT` |
| E1.6.2 | ET, OU, SI imbriqués | Résoudre un barème à plusieurs conditions | 3 Appliquer | `DD` |
| E1.6.3 | SOMME.SI et NB.SI | Calculer un total et un effectif selon un critère | 3 Appliquer | `TD` |
| E1.6.4 | SOMME.SI.ENS, NB.SI.ENS, MOYENNE.SI.ENS | Calculer avec plusieurs critères simultanés | 3 Appliquer | `TD` |
| E1.6.5 | Quelle fonction pour quelle question ? | Comparer SI, SOMME.SI et NB.SI sur cinq questions métier | 4 Analyser | `Q` |

**Évaluation du module** : quiz sommatif de 10 questions (≥ 3 types, 70 %), questions rattachées aux objectifs ci-dessus.

### Module E1.7 — Graphiques, TCD et mini-dashboard

**Jeu de données** : Opérations bancaires d'un trimestre (fichier de l'atelier) · **TD** : TD7 : De la table au dashboard · **Durée** ≈ 90 min

| ID | Leçon | Objectif (verbe de Bloom) | Niveau | Activité |
|---|---|---|---|---|
| E1.7.1 | Choisir le bon graphique | Justifier le type de graphique (barres, courbes, secteurs) pour quatre questions | 5 Évaluer | `Q` |
| E1.7.2 | Créer et personnaliser un graphique | Utiliser titre, axes, étiquettes et couleurs pour un graphique lisible | 3 Appliquer | `TD` |
| E1.7.3 | Comprendre le TCD | Illustrer le rôle des zones lignes, colonnes, valeurs et filtres | 2 Comprendre | `DD` |
| E1.7.4 | Créer un TCD | Calculer somme, nombre et moyenne dans un TCD | 3 Appliquer | `TD` |
| E1.7.5 | Grouper et segmenter | Utiliser le regroupement par mois et un segment pour filtrer | 3 Appliquer | `TD` |
| E1.7.6 | Assembler un mini-dashboard | Concevoir une page avec 4 cartes KPI, 2 segments et 3 graphiques | 6 Créer | `CAS` |

**Évaluation du module** : quiz sommatif de 10 questions (≥ 3 types, 70 %), questions rattachées aux objectifs ci-dessus.

### Mini-projet N1 — Du fichier brut au mini-dashboard

- **Niveau de Bloom** : 6 Créer
- **Énoncé** : Recevoir un fichier « sale » de 300 lignes d'une entreprise fictive, le nettoyer et le structurer, poser validation et mise en forme conditionnelle, produire des TCD, puis assembler un dashboard (4 cartes KPI, 2 segments, 3 graphiques) avec trois recommandations écrites.
- **Livrable** : Fichier .xlsx + capture du dashboard + 3 recommandations (5 lignes)
- **Évaluation** : grille de la section 8 ; relecture formateur (E3 : relecture humaine, formule Expert)

## 5. Excel — Niveau 2 : Analyse de données

*7 modules · 35 leçons · ≈ 8.7 h · répartition Bloom : Comprendre 1 · Appliquer 24 · Analyser 7 · Évaluer 3*

### Module E2.1 — Nettoyer avec les fonctions texte et date

**Jeu de données** : Fichier « vraiment sale » : noms, matricules, dates, espaces · **TD** : TD8 : Nettoyage express · **Durée** ≈ 90 min

| ID | Leçon | Objectif (verbe de Bloom) | Niveau | Activité |
|---|---|---|---|---|
| E2.1.1 | Nettoyer le texte | Utiliser SUPPRESPACE, NETTOYER, MAJUSCULE, MINUSCULE et NOMPROPRE | 3 Appliquer | `TT` |
| E2.1.2 | Extraire du texte | Utiliser GAUCHE, DROITE, STXT, NBCAR et TROUVE pour isoler un code | 3 Appliquer | `TD` |
| E2.1.3 | Assembler et remplacer | Utiliser CONCAT, JOINDRE.TEXTE et SUBSTITUE | 3 Appliquer | `TT` |
| E2.1.4 | Convertir | Appliquer CNUM, TEXTE, Texte vers colonnes et Remplissage instantané | 3 Appliquer | `RE` |
| E2.1.5 | Calculer avec les dates | Calculer âge et ancienneté avec DATEDIF, AUJOURDHUI et NB.JOURS.OUVRES | 3 Appliquer | `TD` |
| E2.1.6 | Diagnostiquer un fichier sale | Examiner un fichier et planifier l'ordre des corrections | 4 Analyser | `CAS` |

**Évaluation du module** : quiz sommatif de 10 questions (≥ 3 types, 70 %), questions rattachées aux objectifs ci-dessus.

### Module E2.2 — Recherche et référence

**Jeu de données** : Table des employés + table des services + barème · **TD** : TD9 : Relier deux tables · **Durée** ≈ 90 min

| ID | Leçon | Objectif (verbe de Bloom) | Niveau | Activité |
|---|---|---|---|---|
| E2.2.1 | RECHERCHEV | Utiliser RECHERCHEV en correspondance exacte et expliquer le piège de la valeur proche | 3 Appliquer | `TT` |
| E2.2.2 | INDEX + EQUIV | Résoudre une recherche vers la gauche et à deux critères | 3 Appliquer | `TD` |
| E2.2.3 | RECHERCHEX | Utiliser RECHERCHEX pour remplacer RECHERCHEV | 3 Appliquer | `TD` |
| E2.2.4 | Gérer les erreurs | Appliquer SIERREUR et SI.NON.DISP pour un résultat propre | 3 Appliquer | `RE` |
| E2.2.5 | Choisir sa recherche | Argumenter le choix entre RECHERCHEV, INDEX/EQUIV et RECHERCHEX pour trois cas | 5 Évaluer | `Q` |
| E2.2.6 | Listes déroulantes en cascade | Appliquer des listes dépendantes (région → ville → station) | 3 Appliquer | `TD` |

**Évaluation du module** : quiz sommatif de 10 questions (≥ 3 types, 70 %), questions rattachées aux objectifs ci-dessus.

### Module E2.3 — Logique, agrégation et fonctions dynamiques

**Jeu de données** : Notes d'une promotion et ventes pondérées · **TD** : TD10 : Barèmes, moyennes pondérées, listes dynamiques · **Durée** ≈ 75 min

| ID | Leçon | Objectif (verbe de Bloom) | Niveau | Activité |
|---|---|---|---|---|
| E2.3.1 | Barèmes : quel outil ? | Comparer SI imbriqués, SI.CONDITIONS et RECHERCHEX pour un barème | 4 Analyser | `DD` |
| E2.3.2 | SOMMEPROD | Calculer une moyenne pondérée et un chiffre d'affaires avec SOMMEPROD | 3 Appliquer | `TD` |
| E2.3.3 | Statistiques descriptives | Analyser une série avec MEDIANE, MODE, ECARTYPE et RANG | 4 Analyser | `Q` |
| E2.3.4 | UNIQUE, TRIER, FILTRE | Utiliser les fonctions dynamiques pour produire une liste à jour | 3 Appliquer | `TD` |
| E2.3.5 | Noms et références structurées | Appliquer des plages nommées et des références de tableau pour des formules lisibles | 3 Appliquer | `TT` |

**Évaluation du module** : quiz sommatif de 10 questions (≥ 3 types, 70 %), questions rattachées aux objectifs ci-dessus.

### Module E2.4 — Tableaux croisés dynamiques avancés

**Jeu de données** : Base RH de 300 employés (fichier TCD niveau intermédiaire) · **TD** : TD11 : Le TCD qui répond au directeur · **Durée** ≈ 75 min

| ID | Leçon | Objectif (verbe de Bloom) | Niveau | Activité |
|---|---|---|---|---|
| E2.4.1 | Champs calculés | Calculer un taux et une marge avec un champ calculé | 3 Appliquer | `TD` |
| E2.4.2 | Regrouper | Utiliser le regroupement de dates, de nombres (tranches d'âge) et de textes | 3 Appliquer | `TD` |
| E2.4.3 | Afficher les valeurs autrement | Analyser un TCD en % du total, écart et cumul | 4 Analyser | `Q` |
| E2.4.4 | Segments et chronologies | Utiliser des segments reliés à plusieurs TCD | 3 Appliquer | `TD` |
| E2.4.5 | Graphique croisé et actualisation | Examiner un TCD périmé et corriger la source (tableau structuré) | 4 Analyser | `RE` |

**Évaluation du module** : quiz sommatif de 10 questions (≥ 3 types, 70 %), questions rattachées aux objectifs ci-dessus.

### Module E2.5 — Visualisation de données

**Jeu de données** : Série mensuelle de ventes + objectifs · **TD** : TD12 : Dire la vérité avec un graphique · **Durée** ≈ 55 min

| ID | Leçon | Objectif (verbe de Bloom) | Niveau | Activité |
|---|---|---|---|---|
| E2.5.1 | Question métier → graphique | Classifier comparaison, évolution, répartition et relation selon la question | 2 Comprendre | `DD` |
| E2.5.2 | Combiné et tendance | Utiliser graphiques combinés, axe secondaire et courbe de tendance | 3 Appliquer | `TD` |
| E2.5.3 | Sparklines et MFC par formule | Utiliser des mini-graphiques et une règle conditionnelle à formule | 3 Appliquer | `TD` |
| E2.5.4 | Graphiques trompeurs | Critiquer trois graphiques (axe tronqué, 3D, surcharge) et proposer une correction | 5 Évaluer | `RE` |

**Évaluation du module** : quiz sommatif de 10 questions (≥ 3 types, 70 %), questions rattachées aux objectifs ci-dessus.

### Module E2.6 — Construire un tableau de bord interactif

**Jeu de données** : Suivi commercial multi-agences · **TD** : TD13 : Le tableau de bord du directeur · **Durée** ≈ 75 min

| ID | Leçon | Objectif (verbe de Bloom) | Niveau | Activité |
|---|---|---|---|---|
| E2.6.1 | Cadrer le besoin | Analyser les décisions d'un utilisateur et en déduire 5 indicateurs | 4 Analyser | `CAS` |
| E2.6.2 | Trois couches | Organiser classeur en feuilles Données, Calculs et Présentation | 3 Appliquer | `DD` |
| E2.6.3 | Cartes KPI et segments | Utiliser des formules liées et des segments pour des KPI interactifs | 3 Appliquer | `TD` |
| E2.6.4 | Appliquer les principes UI | Évaluer un dashboard (hiérarchie, couleurs, espaces blancs, proximité) et le corriger | 5 Évaluer | `RE` |
| E2.6.5 | Protéger et partager | Appliquer protection des cellules, mise en page et export PDF | 3 Appliquer | `TD` |

**Évaluation du module** : quiz sommatif de 10 questions (≥ 3 types, 70 %), questions rattachées aux objectifs ci-dessus.

### Module E2.7 — Simulation et aide à la décision

**Jeu de données** : Plan de remboursement de prêt, budget d'une ONG · **TD** : TD14 : Et si… ? · **Durée** ≈ 60 min

| ID | Leçon | Objectif (verbe de Bloom) | Niveau | Activité |
|---|---|---|---|---|
| E2.7.1 | Valeur cible et scénarios | Utiliser Valeur cible et le Gestionnaire de scénarios | 3 Appliquer | `TD` |
| E2.7.2 | Tables de données | Analyser la sensibilité d'un résultat à deux variables | 4 Analyser | `TD` |
| E2.7.3 | Calculs financiers | Calculer mensualité, valeur actuelle et TRI avec VPM, VA et TRI | 3 Appliquer | `TT` |
| E2.7.4 | Solveur | Résoudre un problème d'optimisation avec contraintes (budget, stock) | 3 Appliquer | `CAS` |

**Évaluation du module** : quiz sommatif de 10 questions (≥ 3 types, 70 %), questions rattachées aux objectifs ci-dessus.

### Mini-projet N2 — Le tableau de bord du directeur

- **Niveau de Bloom** : 6 Créer
- **Énoncé** : À partir de trois tables liées (employés, services, présences ou ventes, produits, agences), nettoyer par fonctions, relier par recherche, construire TCD avancés avec segments, assembler un dashboard interactif de 5 indicateurs et rédiger une note d'une page qui justifie les choix et interprète les résultats.
- **Livrable** : Fichier .xlsx protégé + PDF du dashboard + note d'interprétation (1 page)
- **Évaluation** : grille de la section 8 ; relecture formateur (E3 : relecture humaine, formule Expert)

## 6. Excel — Niveau 3 : Excel moderne, Power Query, Power Pivot et DAX

*7 modules · 35 leçons · ≈ 8.5 h · répartition Bloom : Comprendre 5 · Appliquer 20 · Analyser 5 · Évaluer 3 · Créer 2*

### Module E3.1 — Power Query : prise en main

**Jeu de données** : Trois fichiers CSV/Excel d'une même entreprise · **TD** : TD15 : Ma première requête · **Durée** ≈ 50 min

| ID | Leçon | Objectif (verbe de Bloom) | Niveau | Activité |
|---|---|---|---|---|
| E3.1.1 | Pourquoi automatiser | Expliquer en quoi une requête remplace des manipulations répétées | 2 Comprendre | `Q` |
| E3.1.2 | Importer | Utiliser l'import depuis Excel, CSV, dossier et web | 3 Appliquer | `TD` |
| E3.1.3 | Lire l'éditeur | Examiner les étapes appliquées et l'effet de chaque étape | 4 Analyser | `RE` |
| E3.1.4 | Charger et actualiser | Classifier les modes de chargement (feuille, connexion, modèle) et actualiser | 2 Comprendre | `DD` |

**Évaluation du module** : quiz sommatif de 10 questions (≥ 3 types, 70 %), questions rattachées aux objectifs ci-dessus.

### Module E3.2 — Nettoyer et transformer avec Power Query

**Jeu de données** : Export d'application avec dates, montants et libellés mal formés · **TD** : TD16 : Nettoyer sans toucher aux données sources · **Durée** ≈ 90 min

| ID | Leçon | Objectif (verbe de Bloom) | Niveau | Activité |
|---|---|---|---|---|
| E3.2.1 | Supprimer, filtrer, remplacer | Utiliser les transformations de base sur espaces, doublons et erreurs | 3 Appliquer | `TD` |
| E3.2.2 | Fractionner et fusionner des colonnes | Appliquer le fractionnement par délimiteur et la fusion de colonnes | 3 Appliquer | `TD` |
| E3.2.3 | Remplir vers le bas et en-têtes | Résoudre un export à cellules vides et en-têtes sur la ligne 3 | 3 Appliquer | `RE` |
| E3.2.4 | Dépivoter | Résoudre un tableau « large » (mois en colonnes) en tableau « long » | 3 Appliquer | `TD` |
| E3.2.5 | Colonnes conditionnelles et personnalisées | Appliquer une colonne conditionnelle et une formule M simple | 3 Appliquer | `TT` |
| E3.2.6 | Dates et types | Appliquer le type et les paramètres régionaux pour normaliser dates et montants | 3 Appliquer | `TD` |

**Évaluation du module** : quiz sommatif de 10 questions (≥ 3 types, 70 %), questions rattachées aux objectifs ci-dessus.

### Module E3.3 — Combiner les sources

**Jeu de données** : Fichiers mensuels de 60 stations-service (dossier) · **TD** : TD17 : Consolider 60 fichiers en un clic · **Durée** ≈ 80 min

| ID | Leçon | Objectif (verbe de Bloom) | Niveau | Activité |
|---|---|---|---|---|
| E3.3.1 | Ajouter des requêtes | Utiliser l'ajout pour empiler des tables de même structure | 3 Appliquer | `TD` |
| E3.3.2 | Fusionner des requêtes | Comparer les types de jointure (interne, gauche, anti) sur des tables clients et ventes | 4 Analyser | `DD` |
| E3.3.3 | Consolider un dossier | Assembler un classeur unique à partir d'un dossier de fichiers mensuels | 6 Créer | `CAS` |
| E3.3.4 | Paramètres et actualisation | Utiliser un paramètre de chemin et actualiser quand un nouveau fichier arrive | 3 Appliquer | `Q` |
| E3.3.5 | Optimiser et documenter | Évaluer l'ordre des étapes d'une requête lente et la documenter | 5 Évaluer | `RE` |

**Évaluation du module** : quiz sommatif de 10 questions (≥ 3 types, 70 %), questions rattachées aux objectifs ci-dessus.

### Module E3.4 — Modèle de données avec Power Pivot

**Jeu de données** : Ventes, produits, clients, agences, calendrier · **TD** : TD18 : Mon premier schéma en étoile · **Durée** ≈ 75 min

| ID | Leçon | Objectif (verbe de Bloom) | Niveau | Activité |
|---|---|---|---|---|
| E3.4.1 | Faits et dimensions | Classifier des tables en faits ou dimensions | 2 Comprendre | `DD` |
| E3.4.2 | Relations | Appliquer relation, cardinalité et sens de filtre | 3 Appliquer | `TD` |
| E3.4.3 | Schéma en étoile | Concevoir un modèle à partir de cinq tables | 6 Créer | `CAS` |
| E3.4.4 | Table de dates et hiérarchies | Utiliser une table calendrier et une hiérarchie Année > Trimestre > Mois | 3 Appliquer | `TD` |
| E3.4.5 | TCD sur le modèle | Utiliser des champs de plusieurs tables dans un TCD | 3 Appliquer | `TD` |

**Évaluation du module** : quiz sommatif de 10 questions (≥ 3 types, 70 %), questions rattachées aux objectifs ci-dessus.

### Module E3.5 — DAX pour Excel

**Jeu de données** : Modèle de ventes du module précédent · **TD** : TD19 : Mes premières mesures · **Durée** ≈ 90 min

| ID | Leçon | Objectif (verbe de Bloom) | Niveau | Activité |
|---|---|---|---|---|
| E3.5.1 | Colonne calculée ou mesure | Comparer colonne calculée et mesure selon le besoin | 4 Analyser | `Q` |
| E3.5.2 | Mesures de base | Calculer avec SUM, AVERAGE, COUNTROWS et DIVIDE | 3 Appliquer | `TT` |
| E3.5.3 | Contexte de filtre | Analyser pourquoi une même mesure donne des valeurs différentes selon la cellule du TCD | 4 Analyser | `RE` |
| E3.5.4 | CALCULATE, FILTER, ALL | Appliquer CALCULATE pour une part de marché et un cumul | 3 Appliquer | `TD` |
| E3.5.5 | Intelligence temporelle | Utiliser TOTALYTD et SAMEPERIODLASTYEAR pour comparer à l'an dernier | 3 Appliquer | `TD` |
| E3.5.6 | Classer et segmenter | Utiliser RANKX et SWITCH pour un classement et des tranches | 3 Appliquer | `TD` |

**Évaluation du module** : quiz sommatif de 10 questions (≥ 3 types, 70 %), questions rattachées aux objectifs ci-dessus.

### Module E3.6 — Automatiser et fiabiliser

**Jeu de données** : Classeur de rapport mensuel · **TD** : TD20 : Un rapport qui se fait presque seul · **Durée** ≈ 70 min

| ID | Leçon | Objectif (verbe de Bloom) | Niveau | Activité |
|---|---|---|---|---|
| E3.6.1 | Enregistrer une macro | Utiliser l'enregistreur de macros pour automatiser une mise en forme | 3 Appliquer | `TD` |
| E3.6.2 | Lire du VBA | Examiner une macro simple et en modifier une valeur | 4 Analyser | `RE` |
| E3.6.3 | Sécurité des macros | Expliquer le format .xlsm et les risques d'une macro inconnue | 2 Comprendre | `Q` |
| E3.6.4 | Contrôles qualité | Évaluer un fichier avec comptes de contrôle et rapprochements et signaler les écarts | 5 Évaluer | `CAS` |
| E3.6.5 | Documenter un classeur | Appliquer une feuille « Lisez-moi », un dictionnaire de données et un journal de versions | 3 Appliquer | `TD` |

**Évaluation du module** : quiz sommatif de 10 questions (≥ 3 types, 70 %), questions rattachées aux objectifs ci-dessus.

### Module E3.7 — Passerelle vers Power BI

**Jeu de données** : Modèle Excel du module Power Pivot · **TD** : TD21 : Du classeur au rapport · **Durée** ≈ 55 min

| ID | Leçon | Objectif (verbe de Bloom) | Niveau | Activité |
|---|---|---|---|---|
| E3.7.1 | Ce qui se transpose | Expliquer les équivalences Power Query, modèle et DAX entre Excel et Power BI | 2 Comprendre | `Q` |
| E3.7.2 | Importer un modèle | Utiliser l'import d'un modèle Excel dans Power BI Desktop | 3 Appliquer | `TD` |
| E3.7.3 | Du TCD aux visuels | Appliquer la reproduction d'un TCD en visuels interactifs | 3 Appliquer | `TD` |
| E3.7.4 | Excel ou Power BI ? | Justifier le choix de l'outil pour trois besoins | 5 Évaluer | `Q` |

**Évaluation du module** : quiz sommatif de 10 questions (≥ 3 types, 70 %), questions rattachées aux objectifs ci-dessus.

### Projet de synthèse Excel (niveau Expert)

- **Niveau de Bloom** : 6 Créer
- **Énoncé** : Choisir un secteur (RH, microfinance, stations-service, école, ONG, commerce), consolider au moins trois sources avec Power Query, construire un schéma en étoile, écrire au moins six mesures DAX, livrer un tableau de bord interactif et une note de synthèse de deux pages avec recommandations chiffrées.
- **Livrable** : Classeur .xlsx + PDF du dashboard + note de synthèse (2 pages) → ajouté au portfolio
- **Évaluation** : grille de la section 8 ; relecture formateur (E3 : relecture humaine, formule Expert)

## 7. Exemple complet d'objectif SMART (à répliquer pour chaque leçon)

Leçon **E1.6.3 — SOMME.SI et NB.SI** (niveau 3, Appliquer) :

> À la fin de la leçon (≈ 15 min), l'apprenant sera capable de **calculer** le total des ventes d'un produit donné avec `SOMME.SI` et le **nombre** de ventes avec `NB.SI`, sur le jeu de données « Ventes par produit et par agence » (500 lignes, FCFA), avec un résultat identique à la solution et sans erreur `#VALEUR!` ni `#NOM?`.

Précisions à toujours rédiger : *condition* (jeu de données, outil), *critère de réussite* mesurable, *durée*. Les questions de quiz de cette leçon sont rattachées à cet objectif.

## 8. Grille d'évaluation des mini-projets et du projet de synthèse

| Critère | Poids | Niveau Bloom visé |
|---|---|---|
| Données nettoyées et structurées (une ligne = un enregistrement) | 20 % | 3–4 |
| Exactitude des calculs et des outils choisis (fonctions, TCD, requêtes, mesures) | 30 % | 3–4 |
| Tableau de bord : pertinence des indicateurs, lisibilité (hiérarchie, couleurs, espaces) | 25 % | 5–6 |
| Interprétation et recommandations argumentées | 15 % | 5 |
| Documentation et fiabilité (contrôles, noms clairs, notes) | 10 % | 4–5 |

**Seuil de réussite** : 70 % [reco]. En V3, les trois premiers critères sont vérifiés automatiquement (rapport de complétude) ; les deux derniers relèvent du formateur.

## 9. Couverture de la grille de conformité (`MASTER_PROMPT.md` §21)

| Critère | Preuve dans ce programme |
|---|---|
| R2, R3 — Bloom et SMART | Chaque leçon a un verbe et un niveau ; exemple complet en section 7 |
| R4 — Scénarisation | Synopsis (ce document) ; story-board à rédiger par leçon |
| R10 — Quiz et exercices interactifs | 16 quiz scénario, 12 textes à trous, 9 glisser-déposer, 15 repérages d'erreurs |
| R11 — Mise en situation réelle | 7 cas guidés + 3 projets sur données locales |
| R12 — Vidéo interactive | À scripter pour les leçons `TD` et `CAS` (voir 10) |
| R17, R18 — Retours et atteinte des objectifs | Questions rattachées aux objectifs ; questionnaire de fin de niveau |

## 10. Prochaines étapes de production [reco]

1. **Pilote** : produire d'abord le **module E1.1 puis E1.6** en version complète (gabarit §20.4), les tester avec 5 à 10 apprenants, corriger (esprit SAM).
2. Rédiger l'**analyse** et le **story-board** du cours vitrine (`docs/pedagogy/courses/excel/analysis.md`, `storyboard.md`).
3. Réutiliser vos supports existants comme **TD** et **jeux de données** (RH 300 employés, agence bancaire, stations-service) en les alignant sur le fil rouge.
4. Scripter 3 **vidéos interactives** (V2) : E1.4.1 (tri), E1.7.4 (créer un TCD), E2.2.2 (INDEX + EQUIV), avec un quiz incrusté chacune.
5. Constituer la **banque de questions** : ≈ 4 par leçon + 10 par module, chacune avec objectif, niveau de Bloom, notion, feedback.

## Annexe A — Notions (tags) pour les recommandations et le suivi

`interface` · `types-de-données` · `recopie` · `format-nombre` · `dates` · `formule` · `référence-absolue` · `erreurs` · `tri` · `filtre` · `tableau-structuré` · `validation` · `mise-en-forme-conditionnelle` · `SI` · `SOMME.SI.ENS` · `graphique` · `TCD` · `segment` · `dashboard` · `nettoyage-texte` · `dates-calcul` · `RECHERCHEV` · `INDEX-EQUIV` · `RECHERCHEX` · `SOMMEPROD` · `fonctions-dynamiques` · `champ-calculé` · `visualisation` · `simulation` · `finance` · `power-query` · `dépivoter` · `fusion-requêtes` · `consolidation` · `schéma-en-étoile` · `relations` · `DAX-mesure` · `contexte-de-filtre` · `CALCULATE` · `time-intelligence` · `macro` · `qualité-des-données` · `power-bi`

## Annexe B — Référentiel de fonctions (page de référence, façon W3Schools)

Pages de référence **hors parcours**, consultables à tout moment (une fiche par fonction : syntaxe, exemple FCFA, erreurs fréquentes, lien vers la leçon). Noms français avec correspondance anglaise.

| Niveau | Fonctions |
|---|---|
| E1 | SOMME / SUM · MOYENNE / AVERAGE · MIN · MAX · NB / COUNT · NBVAL / COUNTA · NB.VIDE / COUNTBLANK · ARRONDI / ROUND · SI / IF · ET / AND · OU / OR · SOMME.SI / SUMIF · NB.SI / COUNTIF · SOMME.SI.ENS / SUMIFS · NB.SI.ENS / COUNTIFS · MOYENNE.SI.ENS / AVERAGEIFS |
| E2 | SIERREUR / IFERROR · SI.CONDITIONS / IFS · RECHERCHEV / VLOOKUP · RECHERCHEH / HLOOKUP · INDEX · EQUIV / MATCH · RECHERCHEX / XLOOKUP · SOMMEPROD / SUMPRODUCT · MEDIANE / MEDIAN · MODE.SIMPLE / MODE.SNGL · ECARTYPE.STANDARD / STDEV.S · RANG / RANK · GRANDE.VALEUR / LARGE · UNIQUE · TRIER / SORT · FILTRE / FILTER · GAUCHE / LEFT · DROITE / RIGHT · STXT / MID · NBCAR / LEN · TROUVE / FIND · SUPPRESPACE / TRIM · NETTOYER / CLEAN · MAJUSCULE / UPPER · MINUSCULE / LOWER · NOMPROPRE / PROPER · SUBSTITUE / SUBSTITUTE · CONCAT · JOINDRE.TEXTE / TEXTJOIN · CNUM / VALUE · TEXTE / TEXT · AUJOURDHUI / TODAY · DATEDIF · NB.JOURS.OUVRES / NETWORKDAYS · DATE · MOIS.DECALER / EDATE · VPM / PMT · VA / PV · VC / FV · TRI / IRR · VAN / NPV |
| E3 | DAX : SUM · AVERAGE · COUNTROWS · DIVIDE · CALCULATE · FILTER · ALL · TOTALYTD · SAMEPERIODLASTYEAR · RANKX · SWITCH (noms DAX et M **toujours en anglais**) · Power Query : étapes de transformation (menus localisés) |
