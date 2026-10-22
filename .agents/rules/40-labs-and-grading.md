# Règle 40 — Laboratoires intégrés et correction automatique

S'applique à `features/labs/`, `labs/`, `backend/apps/labs/`, `backend/apps/grading/`. Concerne les versions V2 et V3 : ne pas anticiper en V1 sauf pour préparer l'interface commune.

## Les cinq laboratoires
| Labo | Technologie | Version |
|---|---|---|
| SQL | SQLite dans le navigateur | V2 |
| Python | Pyodide (pandas, matplotlib) | V2 |
| Excel | Tableur open source avec moteur de formules (**choix après prototype**) | V2 |
| GitHub | Moteur Git en JavaScript (simulation) | V3 |
| Power BI | Application web dédiée, DAX en sous-ensemble (**prototype avant décision**) | V3 |

Les limites de chaque simulation sont **annoncées à l'apprenant** (« Simulation, pas Power BI »).

## Contrat commun (pattern Adapter)
Chaque laboratoire implémente la même interface et se branche dans la même coque `LabShell`.

```ts
interface LabEngine<TState, TResult> {
  id: LabType; // 'excel' | 'sql' | 'python' | 'powerbi' | 'git'
  load(exercise: Exercise): Promise<TState>;
  serialize(state: TState): LabSnapshot;
  restore(snapshot: LabSnapshot): TState;
  check(state: TState, rules: CheckRule[]): Promise<TResult>;
  export(state: TState): Promise<Blob>;
  import(file: File): Promise<TState>;
}
```

## Comportements communs (dans `LabShell`, jamais dupliqués dans un labo)
- Consigne, données et critères visibles à côté de l'outil.
- **Trois indices** avant la solution, chacun réduisant les points.
- Bouton **Vérifier** : message précis sur ce qui manque, plusieurs tentatives.
- **Sauvegarde automatique** et reprise après coupure de connexion.
- Export et import de fichier ; mode libre sans consigne.
- Variante tactile sur petit écran (cellule agrandie, barre de symboles de code, boutons Git).

## Correction de fichiers déposés
- Chaque type de fichier a un **checker** qui implémente `Checker.check(submission, rules) -> list[ReportItem]`, enregistré dans un **registre**. Ajouter un type = ajouter un checker, sans toucher au reste.
- Types : `.xlsx` (openpyxl, recalcul LibreOffice headless si pas de valeurs enregistrées), `.pbix/.pbip`, `.sql`, `.py/.ipynb`, lien GitHub, PDF/images.
- Le résultat est un **rapport de complétude** : pourcentage d'exigences, chaque point *validé / manquant / incorrect* avec une explication.
- Une vérification Excel compare les **résultats**, pas la méthode (sauf fonction imposée).
- Les règles de vérification sont saisies par le formateur dans un **formulaire sans programmation** (feuille, plage, formule ou valeur attendue, tolérance).
- Exécution de code d'apprenant : conteneur jetable, **sans réseau**, limité en temps et en mémoire. Jamais sur le serveur principal.
- Les devoirs complexes restent relus par un formateur.

## Recommandations (V3)
Règles **lisibles**, pas d'IA au départ. Chaque recommandation **affiche sa raison** et **peut être refusée**. Chaque question ou exercice est rattaché à une **notion** ; les seuils sont des paramètres modifiables.
