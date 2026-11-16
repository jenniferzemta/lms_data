import { LabEngine } from './LabEngine.interface';
import {
  LabType,
  LabExercise,
  LabSnapshot,
  CheckRule,
  LabResult,
  PythonLabState,
  PythonExecutionResult,
  RuleCheckDetail
} from '../types';
import { CAMEROON_SALES_DATASET, PythonSalesRecord } from '../data/pythonDataset';

export class PythonLabEngine implements LabEngine<PythonLabState, LabResult> {
  id: LabType = 'python';
  private rawData: PythonSalesRecord[];

  constructor() {
    this.rawData = [...CAMEROON_SALES_DATASET];
  }

  async load(exercise: LabExercise): Promise<PythonLabState> {
    const defaultState: PythonLabState = {
      code: exercise.initialCode,
      history: [],
      lastResult: null,
      activeExercise: exercise
    };

    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`datamboa_lab_python_${exercise.id}`);
        if (saved) {
          const snapshot: LabSnapshot = JSON.parse(saved);
          return this.restore(snapshot);
        }
      } catch {
        // Fallback
      }
    }

    return defaultState;
  }

  serialize(state: PythonLabState): LabSnapshot {
    return {
      code: state.code,
      timestamp: Date.now(),
      activeExerciseId: state.activeExercise?.id
    };
  }

  restore(snapshot: LabSnapshot): PythonLabState {
    return {
      code: snapshot.code,
      history: [],
      lastResult: null,
      activeExercise: null
    };
  }

  /**
   * Client-side Python / Pandas runtime execution
   */
  executeCode(rawCode: string): PythonExecutionResult {
    const startTime = performance.now();
    const stdoutLogs: string[] = [];
    let outputTable: { columns: string[]; rows: Record<string, unknown>[] } | undefined;
    const workingVariables: Record<string, unknown> = {};

    try {
      // Create a fresh clone of records for DataFrame
      let currentRecords: Record<string, unknown>[] = this.rawData.map((r) => ({ ...r }));

      const lines = rawCode.split('\n');

      for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const rawLine = lines[lineIndex].trim();
        // Skip comments or blank lines
        if (!rawLine || rawLine.startsWith('#')) continue;

        // 1. Column creation (e.g. df['marge_fcfa'] = df['montant_total_fcfa'] * 0.20)
        const colAssignMatch = rawLine.match(/^df\[['"]([a-zA-Z0-9_]+)['"]\]\s*=\s*(.+)$/);
        if (colAssignMatch) {
          const colName = colAssignMatch[1];
          const expr = colAssignMatch[2].trim();

          const multMatch = expr.match(/df\[['"]([a-zA-Z0-9_]+)['"]\]\s*\*\s*([0-9.]+)/);
          if (multMatch) {
            const sourceCol = multMatch[1];
            const factor = parseFloat(multMatch[2]);
            currentRecords.forEach((row) => {
              const baseVal = Number(row[sourceCol]) || 0;
              row[colName] = Math.round(baseVal * factor);
            });
            continue;
          }
        }

        // 2. Variable assignments (e.g. marge_totale = df['marge_fcfa'].sum())
        const varAssignMatch = rawLine.match(/^([a-zA-Z0-9_]+)\s*=\s*(.+)$/);
        if (varAssignMatch) {
          const varName = varAssignMatch[1];
          const expr = varAssignMatch[2].trim();

          if (expr.includes('.sum()')) {
            const colMatch = expr.match(/\[['"]([a-zA-Z0-9_]+)['"]\]/);
            if (colMatch) {
              const col = colMatch[1];
              const total = currentRecords.reduce((acc, r) => acc + (Number(r[col]) || 0), 0);
              workingVariables[varName] = total;
              continue;
            }
          }

          if (expr.includes('.groupby(')) {
            // Groupby assignment
            workingVariables[varName] = 'GroupBySeries';
            continue;
          }

          if (expr.includes('df[')) {
            // Filter assignment: df_douala = df[(...)]
            const cityMatch = expr.match(/ville['"]\s*==\s*['"]([a-zA-Z0-9_\s]+)['"]/i);
            const amountMatch = expr.match(/montant_total_fcfa['"]\s*>=\s*([0-9]+)/i);

            if (cityMatch || amountMatch) {
              const targetCity = cityMatch ? cityMatch[1].trim().toLowerCase() : null;
              const minAmount = amountMatch ? parseFloat(amountMatch[1]) : 0;

              const filtered = currentRecords.filter((r) => {
                const matchCity = !targetCity || String(r.ville).toLowerCase() === targetCity;
                const matchAmt = Number(r.montant_total_fcfa) >= minAmount;
                return matchCity && matchAmt;
              });

              workingVariables[varName] = filtered;
              currentRecords = filtered;
              continue;
            }
          }
        }

        // 3. Print statements handling
        const printMatch = rawLine.match(/^print\s*\(([\s\S]*)\)$/);
        if (printMatch) {
          const inside = printMatch[1].trim();

          // Check if printing .head()
          if (/df.*\.head\(\)/i.test(inside)) {
            const headRows = currentRecords.slice(0, 5);
            outputTable = {
              columns: Object.keys(headRows[0] || {}),
              rows: headRows
            };
            stdoutLogs.push(this.formatAsciiTable(headRows));
            continue;
          }

          // Check if printing .shape
          if (/df.*\.shape/i.test(inside)) {
            const colsCount = Object.keys(currentRecords[0] || {}).length;
            const shapeStr = `(${currentRecords.length}, ${colsCount})`;
            if (inside.includes(',')) {
              const prefix = inside.split(',')[0].replace(/['"]/g, '').trim();
              stdoutLogs.push(`${prefix} ${shapeStr}`);
            } else {
              stdoutLogs.push(shapeStr);
            }
            continue;
          }

          // Check if printing GroupBy (ca_par_ville)
          if (/ca_par_ville|groupby/i.test(inside)) {
            const groupSum: Record<string, number> = {};
            currentRecords.forEach((r) => {
              const city = String(r.ville);
              groupSum[city] = (groupSum[city] || 0) + Number(r.montant_total_fcfa);
            });

            const sorted = Object.entries(groupSum).sort((a, b) => b[1] - a[1]);
            const linesLog = ['ville', ...sorted.map(([k, v]) => `${k.padEnd(12)} ${v.toLocaleString('fr-FR')} FCFA`)];
            stdoutLogs.push(linesLog.join('\n'));
            continue;
          }

          // Check if printing filtered subset columns (e.g. df[['client', 'montant_total_fcfa']])
          if (/\[\[/.test(inside)) {
            const colsMatch = inside.match(/\[\[(.*?)\]\]/);
            if (colsMatch) {
              const cols = colsMatch[1].split(',').map((c) => c.trim().replace(/['"]/g, ''));
              const subset = currentRecords.slice(0, 5).map((r) => {
                const sub: Record<string, unknown> = {};
                cols.forEach((c) => (sub[c] = r[c]));
                return sub;
              });
              outputTable = { columns: cols, rows: subset };
              stdoutLogs.push(this.formatAsciiTable(subset));
              continue;
            }
          }

          // General print formatting with string interpolation / variables
          const parts = inside.split(',').map((p) => p.trim());
          const renderedParts = parts.map((part) => {
            const clean = part.replace(/^['"]|['"]$/g, '');
            if (part.startsWith("'") || part.startsWith('"')) return clean;
            if (workingVariables[clean] !== undefined) return String(workingVariables[clean]);
            if (part === 'df.shape') return `(${currentRecords.length}, 9)`;
            return clean;
          });

          stdoutLogs.push(renderedParts.join(' '));
        }
      }

      const executionTime = Math.round(performance.now() - startTime);

      return {
        stdout: stdoutLogs.join('\n') || 'Script exécuté avec succès (aucun affichage).',
        outputTable,
        executionTimeMs: Math.max(1, executionTime),
        variables: workingVariables
      };
    } catch (err) {
      return {
        stdout: '',
        stderr: (err as Error).message || 'Erreur lors de l\'exécution du script Python.',
        executionTimeMs: Math.round(performance.now() - startTime),
        error: (err as Error).message
      };
    }
  }

  private formatAsciiTable(rows: Record<string, unknown>[]): string {
    if (!rows || rows.length === 0) return '(DataFrame vide)';
    const cols = Object.keys(rows[0]);
    const header = cols.join(' | ');
    const divider = cols.map((c) => '-'.repeat(Math.max(c.length, 6))).join('-|-');
    const dataLines = rows.map((r) =>
      cols
        .map((c) => {
          const val = r[c];
          return typeof val === 'number' && c.includes('fcfa') ? `${val.toLocaleString('fr-FR')}` : String(val);
        })
        .join(' | ')
    );
    return [header, divider, ...dataLines].join('\n');
  }

  async check(state: PythonLabState, rules: CheckRule[]): Promise<LabResult> {
    const result = this.executeCode(state.code);

    if (result.error || result.stderr) {
      return {
        isSuccess: false,
        score: 0,
        message: `Erreur d'exécution Python : ${result.stderr || result.error}`,
        details: rules.map((r) => ({
          ruleId: r.id,
          description: r.description,
          passed: false,
          message: result.stderr || result.error
        }))
      };
    }

    const details: RuleCheckDetail[] = [];
    let passedCount = 0;

    for (const rule of rules) {
      let passed = false;
      let failureReason: string | undefined;

      switch (rule.type) {
        case 'contains':
          if (rule.expectedPattern) {
            const regex =
              typeof rule.expectedPattern === 'string'
                ? new RegExp(rule.expectedPattern, 'i')
                : rule.expectedPattern;

            // Check against code or stdout
            passed = regex.test(state.code) || regex.test(result.stdout);
            if (!passed) {
              failureReason = `Instruction ou mot-clé attendu non trouvé dans le script ou la sortie console.`;
            }
          }
          break;

        case 'row_count':
          if (typeof rule.expectedRowCount === 'number') {
            const actualCount = result.outputTable ? result.outputTable.rows.length : 0;
            passed = actualCount === rule.expectedRowCount;
            if (!passed) {
              failureReason = `Le nombre de lignes filtrées (${actualCount}) ne correspond pas au total attendu (${rule.expectedRowCount}).`;
            }
          }
          break;

        default:
          passed = true;
      }

      if (passed) passedCount++;
      details.push({
        ruleId: rule.id,
        description: rule.description,
        passed,
        message: failureReason
      });
    }

    const isSuccess = passedCount === rules.length;
    const score = Math.round((passedCount / (rules.length || 1)) * 100);

    return {
      isSuccess,
      score,
      message: isSuccess
        ? 'Excellent travail ! Votre script Pandas produit les analyses et agrégations attendues.'
        : `Il reste ${rules.length - passedCount} critère(s) à valider pour cet atelier Python.`,
      details
    };
  }

  async export(state: PythonLabState): Promise<Blob> {
    const header = `# DataMboa LMS - Laboratoire Python & Pandas\n# Exporté le : ${new Date().toLocaleString('fr-FR')}\n\n`;
    const content = `${header}${state.code}\n`;
    return new Blob([content], { type: 'text/x-python;charset=utf-8' });
  }

  async import(file: File): Promise<PythonLabState> {
    const text = await file.text();
    return {
      code: text,
      history: [],
      lastResult: null,
      activeExercise: null
    };
  }
}
