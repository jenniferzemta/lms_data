import { LabEngine } from './LabEngine.interface';
import { LabExercise, LabSnapshot, CheckRule, LabResult, RuleCheckDetail } from '../types';
import {
  POWERBI_SALES_DATASET,
  PowerBiSaleRow,
  DaxMeasure,
} from '../data/powerBiDataset';

export interface PowerBiLabState {
  dataset: PowerBiSaleRow[];
  measures: DaxMeasure[];
  selectedCityFilter: string;
  selectedCategoryFilter: string;
  activeCode: string;
  evaluationResult?: {
    kpis: {
      totalVentesFcfa: number;
      totalMargeFcfa: number;
      totalQuantite: number;
      panierMoyenFcfa: number;
      tauxMargePct: number;
    };
    salesByCity: { city: string; totalFcfa: number; sharePct: number }[];
    salesByCategory: { category: string; totalFcfa: number; count: number }[];
    lastEvaluatedMeasure?: { name: string; value: string };
  };
}

export class PowerBiLabEngine implements LabEngine<PowerBiLabState> {
  id = 'powerbi' as const;

  public async load(exercise: LabExercise): Promise<PowerBiLabState> {
    const initialState: PowerBiLabState = {
      dataset: POWERBI_SALES_DATASET,
      measures: [
        {
          name: 'Total Ventes',
          expression: 'SUM(Ventes[chiffre_affaires_fcfa])',
          formattedValue: '1 034 000 FCFA',
          rawValue: 1034000,
        },
        {
          name: 'Total Quantité',
          expression: 'SUM(Ventes[quantite])',
          formattedValue: '1 990 unités',
          rawValue: 1990,
        },
      ],
      selectedCityFilter: 'ALL',
      selectedCategoryFilter: 'ALL',
      activeCode: exercise.initialCode || 'Total Ventes = SUM(Ventes[chiffre_affaires_fcfa])',
    };

    initialState.evaluationResult = this.computeReportVisuals(initialState);
    return initialState;
  }

  public serialize(state: PowerBiLabState): LabSnapshot {
    return {
      code: state.activeCode,
      timestamp: Date.now(),
      activeTab: state.selectedCityFilter,
    };
  }

  public restore(snapshot: LabSnapshot): PowerBiLabState {
    const state: PowerBiLabState = {
      dataset: POWERBI_SALES_DATASET,
      measures: [
        {
          name: 'Total Ventes',
          expression: 'SUM(Ventes[chiffre_affaires_fcfa])',
          formattedValue: '1 034 000 FCFA',
          rawValue: 1034000,
        },
      ],
      selectedCityFilter: snapshot.activeTab || 'ALL',
      selectedCategoryFilter: 'ALL',
      activeCode: snapshot.code,
    };
    state.evaluationResult = this.computeReportVisuals(state);
    return state;
  }

  public evaluateDax(state: PowerBiLabState, daxCode: string): PowerBiLabState {
    const cleanCode = daxCode.trim();
    const parts = cleanCode.split('=');
    let measureName = 'Nouvelle Mesure';
    let expression = cleanCode;

    if (parts.length >= 2) {
      measureName = parts[0].trim();
      expression = parts.slice(1).join('=').trim();
    }

    // Evaluate DAX expression
    let rawValue: number | string = 0;
    let formattedValue = '';

    const upper = expression.toUpperCase();
    const filteredRows = state.dataset.filter(r => {
      if (state.selectedCityFilter !== 'ALL' && r.ville !== state.selectedCityFilter) return false;
      if (state.selectedCategoryFilter !== 'ALL' && r.categorie !== state.selectedCategoryFilter) return false;
      return true;
    });

    if (upper.includes('CALCULATE')) {
      if (upper.includes('"DOUALA"')) {
        const doualaRows = state.dataset.filter(r => r.ville === 'Douala');
        rawValue = doualaRows.reduce((acc, r) => acc + r.chiffre_affaires_fcfa, 0);
        formattedValue = `${rawValue.toLocaleString('fr-FR')} FCFA`;
      } else {
        rawValue = filteredRows.reduce((acc, r) => acc + r.chiffre_affaires_fcfa, 0);
        formattedValue = `${rawValue.toLocaleString('fr-FR')} FCFA`;
      }
    } else if (upper.includes('DIVIDE')) {
      const totalCa = filteredRows.reduce((acc, r) => acc + r.chiffre_affaires_fcfa, 0);
      const totalMarge = filteredRows.reduce((acc, r) => acc + r.marge_brute_fcfa, 0);
      const ratio = totalCa > 0 ? (totalMarge / totalCa) * 100 : 0;
      rawValue = Math.round(ratio * 10) / 10;
      formattedValue = `${rawValue}%`;
    } else if (upper.includes('SUM') && upper.includes('QUANTITE')) {
      rawValue = filteredRows.reduce((acc, r) => acc + r.quantite, 0);
      formattedValue = `${rawValue.toLocaleString('fr-FR')} caisses`;
    } else if (upper.includes('SUM') && upper.includes('MARGE')) {
      rawValue = filteredRows.reduce((acc, r) => acc + r.marge_brute_fcfa, 0);
      formattedValue = `${rawValue.toLocaleString('fr-FR')} FCFA`;
    } else {
      // Default: SUM of sales
      rawValue = filteredRows.reduce((acc, r) => acc + r.chiffre_affaires_fcfa, 0);
      formattedValue = `${rawValue.toLocaleString('fr-FR')} FCFA`;
    }

    const newMeasure: DaxMeasure = {
      name: measureName,
      expression,
      rawValue,
      formattedValue,
    };

    const existingIdx = state.measures.findIndex(m => m.name.toLowerCase() === measureName.toLowerCase());
    const updatedMeasures = [...state.measures];
    if (existingIdx >= 0) {
      updatedMeasures[existingIdx] = newMeasure;
    } else {
      updatedMeasures.push(newMeasure);
    }

    const newState: PowerBiLabState = {
      ...state,
      activeCode: daxCode,
      measures: updatedMeasures,
    };

    newState.evaluationResult = this.computeReportVisuals(newState);
    newState.evaluationResult.lastEvaluatedMeasure = {
      name: measureName,
      value: formattedValue,
    };

    return newState;
  }

  public computeReportVisuals(state: PowerBiLabState) {
    const filteredRows = state.dataset.filter(r => {
      if (state.selectedCityFilter !== 'ALL' && r.ville !== state.selectedCityFilter) return false;
      if (state.selectedCategoryFilter !== 'ALL' && r.categorie !== state.selectedCategoryFilter) return false;
      return true;
    });

    const totalVentes = filteredRows.reduce((acc, r) => acc + r.chiffre_affaires_fcfa, 0);
    const totalMarge = filteredRows.reduce((acc, r) => acc + r.marge_brute_fcfa, 0);
    const totalQte = filteredRows.reduce((acc, r) => acc + r.quantite, 0);
    const panierMoyen = filteredRows.length > 0 ? Math.round(totalVentes / filteredRows.length) : 0;
    const tauxMarge = totalVentes > 0 ? Math.round((totalMarge / totalVentes) * 1000) / 10 : 0;

    // Sales by City
    const cities = ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua'];
    const salesByCity = cities.map(c => {
      const cityRows = state.dataset.filter(r => r.ville === c);
      const sum = cityRows.reduce((acc, r) => acc + r.chiffre_affaires_fcfa, 0);
      return {
        city: c,
        totalFcfa: sum,
        sharePct: totalVentes > 0 ? Math.round((sum / 1034000) * 100) : 0,
      };
    });

    // Sales by Category
    const categories = ['Sodas', 'Jus Naturels', 'Eaux Minérales', 'Malts'];
    const salesByCategory = categories.map(cat => {
      const catRows = filteredRows.filter(r => r.categorie === cat);
      return {
        category: cat,
        totalFcfa: catRows.reduce((acc, r) => acc + r.chiffre_affaires_fcfa, 0),
        count: catRows.length,
      };
    });

    return {
      kpis: {
        totalVentesFcfa: totalVentes,
        totalMargeFcfa: totalMarge,
        totalQuantite: totalQte,
        panierMoyenFcfa: panierMoyen,
        tauxMargePct: tauxMarge,
      },
      salesByCity,
      salesByCategory,
    };
  }

  public async check(state: PowerBiLabState, rules: CheckRule[]): Promise<LabResult> {
    const details: RuleCheckDetail[] = [];
    let passedCount = 0;

    for (const rule of rules) {
      let passed = false;
      let message = '';

      if (rule.expectedPattern) {
        const regex = typeof rule.expectedPattern === 'string'
          ? new RegExp(rule.expectedPattern, 'i')
          : rule.expectedPattern;
        passed = regex.test(state.activeCode);
        message = passed
          ? `Critère validé : "${rule.description}"`
          : `Critère non respecté : "${rule.description}"`;
      } else {
        passed = true;
      }

      if (passed) passedCount++;
      details.push({
        ruleId: rule.id,
        description: rule.description,
        passed,
        message,
      });
    }

    const score = rules.length > 0 ? Math.round((passedCount / rules.length) * 100) : 100;
    const isSuccess = score === 100;

    return {
      isSuccess,
      score,
      message: isSuccess
        ? 'Félicitations ! Votre formule DAX est syntaxiquement et logiquement valide. Le rapport Power BI s\'est recalculé.'
        : `La formule DAX comporte des critères non validés (${passedCount}/${rules.length}). Vérifiez la syntaxe ou les indices.`,
      details,
    };
  }

  public async export(state: PowerBiLabState): Promise<Blob> {
    const content = state.measures
      .map(m => `// Mesure DAX : ${m.name}\n${m.name} = ${m.expression}\n`)
      .join('\n');
    return new Blob([content], { type: 'text/plain;charset=utf-8' });
  }

  public async import(file: File): Promise<PowerBiLabState> {
    const text = await file.text();
    return this.evaluateDax({
      dataset: POWERBI_SALES_DATASET,
      measures: [],
      selectedCityFilter: 'ALL',
      selectedCategoryFilter: 'ALL',
      activeCode: text,
    }, text);
  }
}
