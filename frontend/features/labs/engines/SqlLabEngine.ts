import { LabEngine } from './LabEngine.interface';
import {
  LabType,
  LabExercise,
  LabSnapshot,
  CheckRule,
  LabResult,
  SqlLabState,
  SqlQueryResult,
  RuleCheckDetail
} from '../types';
import { MICROFINANCE_DATA } from '../data/microfinanceDb';

export class SqlLabEngine implements LabEngine<SqlLabState, LabResult> {
  id: LabType = 'sql';
  private data: Record<string, Record<string, unknown>[]>;

  constructor() {
    this.data = {
      clients: [...MICROFINANCE_DATA.clients],
      comptes: [...MICROFINANCE_DATA.comptes],
      credits: [...MICROFINANCE_DATA.credits],
      remboursements: [...MICROFINANCE_DATA.remboursements]
    };
  }

  async load(exercise: LabExercise): Promise<SqlLabState> {
    const defaultState: SqlLabState = {
      code: exercise.initialCode,
      history: [],
      lastResult: null,
      activeExercise: exercise,
      selectedTable: 'clients'
    };

    // Check if a saved snapshot exists in localStorage
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`datamboa_lab_sql_${exercise.id}`);
        if (saved) {
          const snapshot: LabSnapshot = JSON.parse(saved);
          return this.restore(snapshot);
        }
      } catch {
        // Fallback to default
      }
    }

    return defaultState;
  }

  serialize(state: SqlLabState): LabSnapshot {
    return {
      code: state.code,
      timestamp: Date.now(),
      activeExerciseId: state.activeExercise?.id,
      activeTab: state.selectedTable || 'clients'
    };
  }

  restore(snapshot: LabSnapshot): SqlLabState {
    return {
      code: snapshot.code,
      history: [],
      lastResult: null,
      activeExercise: null,
      selectedTable: snapshot.activeTab || 'clients'
    };
  }

  /**
   * Client-side relational query executor
   */
  executeQuery(rawSql: string): SqlQueryResult {
    const startTime = performance.now();
    const cleanSql = rawSql.trim().replace(/;+$/, '');

    if (!cleanSql) {
      return {
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: 0,
        error: 'Veuillez saisir une requête SQL.'
      };
    }

    // Basic SQL sanity checks
    if (!/^\s*SELECT/i.test(cleanSql)) {
      return {
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: Math.round(performance.now() - startTime),
        error: 'Seules les requêtes de consultation SELECT sont autorisées dans ce laboratoire.'
      };
    }

    try {
      // 1. Identify primary table
      const fromMatch = cleanSql.match(/FROM\s+([a-zA-Z0-9_]+)(?:\s+(?:AS\s+)?([a-zA-Z0-9_]+))?/i);
      if (!fromMatch) {
        throw new Error('Clause FROM manquante. Exemple : FROM clients');
      }

      const primaryTableName = fromMatch[1].toLowerCase();
      const primaryAlias = fromMatch[2] ? fromMatch[2].toLowerCase() : primaryTableName;

      if (!this.data[primaryTableName]) {
        throw new Error(`Table inconnue "${primaryTableName}". Tables disponibles : clients, comptes, credits, remboursements.`);
      }

      let workingRows: Record<string, unknown>[] = this.data[primaryTableName].map((r) => {
        const rowWithAlias: Record<string, unknown> = { ...r };
        // Prefix with table name and alias for joins
        Object.entries(r).forEach(([k, v]) => {
          rowWithAlias[`${primaryTableName}.${k}`] = v;
          if (primaryAlias) rowWithAlias[`${primaryAlias}.${k}`] = v;
        });
        return rowWithAlias;
      });

      // 2. Process optional JOIN
      const joinMatch = cleanSql.match(/JOIN\s+([a-zA-Z0-9_]+)(?:\s+(?:AS\s+)?([a-zA-Z0-9_]+))?\s+ON\s+([a-zA-Z0-9_.]+)\s*=\s*([a-zA-Z0-9_.]+)/i);
      if (joinMatch) {
        const joinTableName = joinMatch[1].toLowerCase();
        const joinAlias = joinMatch[2] ? joinMatch[2].toLowerCase() : joinTableName;
        const leftKey = joinMatch[3].toLowerCase();
        const rightKey = joinMatch[4].toLowerCase();

        if (!this.data[joinTableName]) {
          throw new Error(`Table de jointure inconnue "${joinTableName}".`);
        }

        const joinedRows: Record<string, unknown>[] = [];
        const rightTableRows = this.data[joinTableName];

        for (const lRow of workingRows) {
          for (const rRow of rightTableRows) {
            // Check condition
            const leftVal = (lRow[leftKey] ?? lRow[leftKey.split('.')[1] || '']) ?? null;
            const rightVal = (rRow[rightKey] ?? rRow[rightKey.split('.')[1] || '']) ?? null;

            if (leftVal !== null && leftVal !== undefined && String(leftVal) === String(rightVal)) {
              const combined: Record<string, unknown> = { ...lRow, ...rRow };
              Object.entries(rRow).forEach(([k, v]) => {
                combined[`${joinTableName}.${k}`] = v;
                if (joinAlias) combined[`${joinAlias}.${k}`] = v;
              });
              joinedRows.push(combined);
            }
          }
        }
        workingRows = joinedRows;
      }

      // 3. Process WHERE filters
      const whereMatch = cleanSql.match(/WHERE\s+([\s\S]*?)(?:GROUP\s+BY|ORDER\s+BY|LIMIT|$)/i);
      if (whereMatch) {
        const whereClause = whereMatch[1].trim();
        workingRows = workingRows.filter((row) => this.evalWhere(row, whereClause));
      }

      // 4. Process SELECT projection & GROUP BY
      const selectMatch = cleanSql.match(/SELECT\s+([\s\S]*?)\s+FROM/i);
      if (!selectMatch) {
        throw new Error('Clause SELECT invalide.');
      }

      const selectFieldsRaw = selectMatch[1].trim();
      const groupByMatch = cleanSql.match(/GROUP\s+BY\s+([a-zA-Z0-9_.,\s]+?)(?:ORDER\s+BY|LIMIT|$)/i);

      let finalColumns: string[] = [];
      let finalRows: Record<string, unknown>[] = [];

      if (groupByMatch) {
        const groupCols = groupByMatch[1].split(',').map((c) => c.trim().toLowerCase());
        const groups: Record<string, Record<string, unknown>[]> = {};

        for (const row of workingRows) {
          const groupKey = groupCols.map((c) => String(row[c] ?? row[c.split('.')[1] || ''])).join('___');
          if (!groups[groupKey]) groups[groupKey] = [];
          groups[groupKey].push(row);
        }

        const aggregatedRows: Record<string, unknown>[] = [];
        const fieldExpressions = this.parseSelectFields(selectFieldsRaw);

        for (const [, rowsInGroup] of Object.entries(groups)) {
          const firstRow = rowsInGroup[0];
          const aggRow: Record<string, unknown> = {};

          for (const expr of fieldExpressions) {
            const colName = expr.alias || expr.raw;
            if (/COUNT\s*\(/i.test(expr.raw)) {
              aggRow[colName] = rowsInGroup.length;
            } else if (/SUM\s*\(\s*([a-zA-Z0-9_.]+)\s*\)/i.test(expr.raw)) {
              const field = expr.raw.match(/SUM\s*\(\s*([a-zA-Z0-9_.]+)\s*\)/i)![1];
              const cleanField = field.split('.').pop()!;
              aggRow[colName] = rowsInGroup.reduce((acc, r) => acc + (Number(r[cleanField]) || 0), 0);
            } else if (/AVG\s*\(\s*([a-zA-Z0-9_.]+)\s*\)/i.test(expr.raw)) {
              const field = expr.raw.match(/AVG\s*\(\s*([a-zA-Z0-9_.]+)\s*\)/i)![1];
              const cleanField = field.split('.').pop()!;
              const total = rowsInGroup.reduce((acc, r) => acc + (Number(r[cleanField]) || 0), 0);
              aggRow[colName] = Math.round((total / rowsInGroup.length) * 100) / 100;
            } else {
              const cleanField = expr.raw.split('.').pop()!;
              aggRow[colName] = firstRow[cleanField] ?? firstRow[expr.raw];
            }
          }
          aggregatedRows.push(aggRow);
        }

        finalColumns = fieldExpressions.map((e) => e.alias || e.raw);
        finalRows = aggregatedRows;
      } else {
        // Simple projection
        if (selectFieldsRaw === '*') {
          if (workingRows.length > 0) {
            finalColumns = Object.keys(workingRows[0]).filter((k) => !k.includes('.'));
            finalRows = workingRows.map((r) => {
              const clean: Record<string, unknown> = {};
              finalColumns.forEach((c) => (clean[c] = r[c]));
              return clean;
            });
          } else {
            finalColumns = Object.keys(this.data[primaryTableName][0] || {});
            finalRows = [];
          }
        } else {
          const fieldExpressions = this.parseSelectFields(selectFieldsRaw);
          finalColumns = fieldExpressions.map((e) => e.alias || e.raw);

          finalRows = workingRows.map((row) => {
            const projected: Record<string, unknown> = {};
            fieldExpressions.forEach((expr) => {
              const targetKey = expr.alias || expr.raw;
              const sourceKey = expr.raw.split('.').pop()!;
              projected[targetKey] = row[sourceKey] ?? row[expr.raw];
            });
            return projected;
          });
        }
      }

      // 5. Process ORDER BY
      const orderMatch = cleanSql.match(/ORDER\s+BY\s+([a-zA-Z0-9_.]+)(?:\s+(ASC|DESC))?/i);
      if (orderMatch) {
        const orderCol = orderMatch[1].split('.').pop()!;
        const isDesc = (orderMatch[2] || 'ASC').toUpperCase() === 'DESC';

        finalRows.sort((a, b) => {
          const valA = a[orderCol] ?? 0;
          const valB = b[orderCol] ?? 0;
          if (typeof valA === 'number' && typeof valB === 'number') {
            return isDesc ? valB - valA : valA - valB;
          }
          return isDesc ? String(valB).localeCompare(String(valA)) : String(valA).localeCompare(String(valB));
        });
      }

      // 6. Process LIMIT
      const limitMatch = cleanSql.match(/LIMIT\s+([0-9]+)/i);
      if (limitMatch) {
        const limitCount = parseInt(limitMatch[1], 10);
        finalRows = finalRows.slice(0, limitCount);
      }

      const executionTime = Math.round(performance.now() - startTime);

      return {
        columns: finalColumns,
        rows: finalRows,
        rowCount: finalRows.length,
        executionTimeMs: Math.max(1, executionTime)
      };
    } catch (err) {
      return {
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: Math.round(performance.now() - startTime),
        error: (err as Error).message || 'Erreur lors de l\'exécution de la requête SQL.'
      };
    }
  }

  private parseSelectFields(fieldsStr: string): { raw: string; alias?: string }[] {
    const tokens: string[] = [];
    let current = '';
    let inParen = 0;

    for (let i = 0; i < fieldsStr.length; i++) {
      const char = fieldsStr[i];
      if (char === '(') inParen++;
      if (char === ')') inParen--;
      if (char === ',' && inParen === 0) {
        tokens.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    if (current.trim()) tokens.push(current.trim());

    return tokens.map((token) => {
      const aliasMatch = token.match(/^(.+?)\s+(?:AS\s+)?([a-zA-Z0-9_]+)$/i);
      if (aliasMatch && !/^\s*(COUNT|SUM|AVG|MIN|MAX)\s*\(/i.test(aliasMatch[2])) {
        return {
          raw: aliasMatch[1].trim(),
          alias: aliasMatch[2].trim()
        };
      }
      return { raw: token.trim() };
    });
  }

  private evalWhere(row: Record<string, unknown>, clause: string): boolean {
    const conditions = clause.split(/\s+AND\s+/i);

    return conditions.every((cond) => {
      // Comparison operator matching
      const opMatch = cond.match(/([a-zA-Z0-9_.]+)\s*(=|!=|<>|>=|<=|>|<|LIKE)\s*(.+)/i);
      if (!opMatch) return true;

      const rawField = opMatch[1].trim();
      const cleanField = rawField.split('.').pop()!;
      const op = opMatch[2].toUpperCase();
      const rawExpected = opMatch[3].trim().replace(/^['"]|['"]$/g, '');

      const actualVal = row[cleanField] ?? row[rawField];

      if (op === '=') {
        return String(actualVal).toLowerCase() === rawExpected.toLowerCase();
      }
      if (op === '!=' || op === '<>') {
        return String(actualVal).toLowerCase() !== rawExpected.toLowerCase();
      }
      if (op === '>=') {
        return Number(actualVal) >= Number(rawExpected);
      }
      if (op === '<=') {
        return Number(actualVal) <= Number(rawExpected);
      }
      if (op === '>') {
        return Number(actualVal) > Number(rawExpected);
      }
      if (op === '<') {
        return Number(actualVal) < Number(rawExpected);
      }
      if (op === 'LIKE') {
        const pattern = rawExpected.replace(/%/g, '.*');
        return new RegExp(`^${pattern}$`, 'i').test(String(actualVal));
      }
      return true;
    });
  }

  async check(state: SqlLabState, rules: CheckRule[]): Promise<LabResult> {
    const result = this.executeQuery(state.code);

    if (result.error) {
      return {
        isSuccess: false,
        score: 0,
        message: `Erreur d'exécution : ${result.error}`,
        details: rules.map((r) => ({
          ruleId: r.id,
          description: r.description,
          passed: false,
          message: result.error
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
            const regex = typeof rule.expectedPattern === 'string' ? new RegExp(rule.expectedPattern, 'i') : rule.expectedPattern;
            passed = regex.test(state.code);
            if (!passed) failureReason = `Mot-clé ou clause attendue non trouvée dans le code.`;
          }
          break;

        case 'columns':
          if (rule.expectedColumns && rule.expectedColumns.length > 0) {
            const normalizedActualCols = result.columns.map((c) => c.toLowerCase());
            passed = rule.expectedColumns.every((exp) => normalizedActualCols.includes(exp.toLowerCase()));
            if (!passed) {
              const missing = rule.expectedColumns.filter((exp) => !normalizedActualCols.includes(exp.toLowerCase()));
              failureReason = `Colonnes manquantes dans le résultat : ${missing.join(', ')}`;
            }
          }
          break;

        case 'row_count':
          if (typeof rule.expectedRowCount === 'number') {
            passed = result.rowCount === rule.expectedRowCount;
            if (!passed) {
              failureReason = `Nombre de lignes retourné (${result.rowCount}) différent du résultat attendu (${rule.expectedRowCount}).`;
            }
          }
          break;

        case 'custom':
          if (rule.validator) {
            passed = rule.validator(result.rows);
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
        ? 'Félicitations ! Votre requête SQL répond parfaitement aux exigences du cas métier.'
        : `Il reste ${rules.length - passedCount} critère(s) à valider pour terminer cet atelier.`,
      details
    };
  }

  async export(state: SqlLabState): Promise<Blob> {
    const header = `-- DataMboa LMS - Laboratoire SQL (Microfinance Cameroun)\n-- Exporté le : ${new Date().toLocaleString('fr-FR')}\n\n`;
    const content = `${header}${state.code}\n`;
    return new Blob([content], { type: 'text/sql;charset=utf-8' });
  }

  async import(file: File): Promise<SqlLabState> {
    const text = await file.text();
    return {
      code: text,
      history: [],
      lastResult: null,
      activeExercise: null,
      selectedTable: 'clients'
    };
  }
}

