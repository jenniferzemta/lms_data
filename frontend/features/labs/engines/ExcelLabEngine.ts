import { LabEngine } from './LabEngine.interface';
import {
  LabType,
  LabExercise,
  LabSnapshot,
  CheckRule,
  LabResult,
  ExcelLabState,
  ExcelGridMap,
  RuleCheckDetail
} from '../types';
import { buildInitialGrid } from '../data/excelDataset';

export class ExcelLabEngine implements LabEngine<ExcelLabState, LabResult> {
  id: LabType = 'excel';
  readonly maxRows = 18;
  readonly maxCols = 11; // A to K

  async load(exercise: LabExercise): Promise<ExcelLabState> {
    const defaultState = this.createInitialState(exercise);

    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`datamboa_lab_excel_${exercise.id}`);
        if (saved) {
          const snapshot: LabSnapshot = JSON.parse(saved);
          return this.restore(snapshot, exercise);
        }
      } catch {
        // Fallback to initial
      }
    }

    return defaultState;
  }

  createInitialState(exercise: LabExercise): ExcelLabState {
    const grid = buildInitialGrid();
    this.recalculateAll(grid);

    return {
      cells: grid,
      activeCell: 'F13',
      formulaInput: grid['F13']?.raw || '',
      activeExercise: exercise,
      rowCount: this.maxRows,
      colCount: this.maxCols
    };
  }

  serialize(state: ExcelLabState): LabSnapshot {
    return {
      code: JSON.stringify(state.cells),
      timestamp: Date.now(),
      activeExerciseId: state.activeExercise?.id,
      activeTab: state.activeCell
    };
  }

  restore(snapshot: LabSnapshot, exerciseFallback?: LabExercise): ExcelLabState {
    let cells: ExcelGridMap;
    try {
      cells = JSON.parse(snapshot.code);
      this.recalculateAll(cells);
    } catch {
      cells = buildInitialGrid();
      this.recalculateAll(cells);
    }

    const activeCell = snapshot.activeTab || 'F13';
    return {
      cells,
      activeCell,
      formulaInput: cells[activeCell]?.raw || '',
      activeExercise: exerciseFallback || null,
      rowCount: this.maxRows,
      colCount: this.maxCols
    };
  }

  /**
   * Sets the content of a cell and triggers reactive recalculation of the grid.
   */
  setCellValue(state: ExcelLabState, cellCoord: string, rawInput: string): ExcelLabState {
    const updatedCells: ExcelGridMap = { ...state.cells };
    const current = updatedCells[cellCoord] || { raw: '', value: null };

    updatedCells[cellCoord] = {
      ...current,
      raw: rawInput,
      formula: rawInput.startsWith('=') ? rawInput : undefined
    };

    this.recalculateAll(updatedCells);

    return {
      ...state,
      cells: updatedCells,
      activeCell: cellCoord,
      formulaInput: rawInput
    };
  }

  /**
   * Selects an active cell.
   */
  setActiveCell(state: ExcelLabState, cellCoord: string): ExcelLabState {
    const cell = state.cells[cellCoord];
    return {
      ...state,
      activeCell: cellCoord,
      formulaInput: cell?.raw || ''
    };
  }

  /**
   * Recalculates all cells in the grid in multi-pass order to resolve dependencies.
   */
  recalculateAll(cells: ExcelGridMap): void {
    // 3 passes are sufficient for typical formula depth (raw -> brut -> net -> totals)
    for (let pass = 0; pass < 3; pass++) {
      for (const [coord, cell] of Object.entries(cells)) {
        if (!cell.raw) {
          cell.value = null;
          cell.formatted = '';
          continue;
        }

        if (cell.raw.startsWith('=')) {
          try {
            const evaluated = this.evaluateFormula(cell.raw.slice(1).trim(), cells);
            cell.value = evaluated;
            cell.error = undefined;
            cell.formatted = this.formatValue(evaluated, coord);
          } catch (err: unknown) {
            cell.value = null;
            cell.error = err instanceof Error ? err.message : '#ERREUR!';
            cell.formatted = cell.error;
          }
        } else {
          // Plain literal value (number or string)
          const num = Number(cell.raw);
          if (!isNaN(num) && cell.raw.trim() !== '') {
            cell.value = num;
            cell.formatted = this.formatValue(num, coord);
          } else {
            cell.value = cell.raw;
            cell.formatted = cell.raw;
          }
        }
      }
    }
  }

  /**
   * Evaluates an Excel formula (e.g. SOMME(F2:F11), D2*E2, SI(F2>=200000; 0.05; 0)).
   */
  evaluateFormula(expr: string, cells: ExcelGridMap): string | number | boolean {
    const trimmed = expr.trim();
    if (!trimmed) return 0;

    // Check for high-level Excel function calls: NAME(...)
    const funcMatch = trimmed.match(/^([A-ZÀ-Ÿ_.]+)\s*\((.*)\)$/i);
    if (funcMatch) {
      const funcName = funcMatch[1].toUpperCase();
      const rawArgs = this.splitArgs(funcMatch[2]);
      return this.executeFunction(funcName, rawArgs, cells);
    }

    // Mathematical or logical expression: e.g. D2*E2 or F2*(1-G2)
    return this.evaluateExpression(trimmed, cells);
  }

  /**
   * Splits arguments of a function call respecting nested parentheses and strings.
   */
  private splitArgs(argsString: string): string[] {
    const args: string[] = [];
    let current = '';
    let depth = 0;
    let inQuotes = false;

    for (let i = 0; i < argsString.length; i++) {
      const char = argsString[i];
      if (char === '"') {
        inQuotes = !inQuotes;
        current += char;
      } else if (!inQuotes && (char === '(' || char === '[')) {
        depth++;
        current += char;
      } else if (!inQuotes && (char === ')' || char === ']')) {
        depth--;
        current += char;
      } else if (!inQuotes && depth === 0 && (char === ';' || char === ',')) {
        args.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    if (current.trim().length > 0) {
      args.push(current.trim());
    }

    return args;
  }

  /**
   * Executes a standard Excel function.
   */
  private executeFunction(name: string, args: string[], cells: ExcelGridMap): string | number | boolean {
    switch (name) {
      case 'SOMME':
      case 'SUM': {
        const values = this.resolveRangeValues(args[0], cells);
        return values.reduce<number>((acc, v) => acc + (typeof v === 'number' ? v : Number(v) || 0), 0);
      }

      case 'MOYENNE':
      case 'AVERAGE': {
        const values = this.resolveRangeValues(args[0], cells);
        const numeric = values.filter((v): v is number => typeof v === 'number' || (!isNaN(Number(v)) && v !== null));
        if (numeric.length === 0) return 0;
        const sum = numeric.reduce((acc, v) => acc + Number(v), 0);
        return Math.round((sum / numeric.length) * 100) / 100;
      }

      case 'MAX': {
        const values = this.resolveRangeValues(args[0], cells);
        const numbers = values.map(Number).filter((n) => !isNaN(n));
        return numbers.length ? Math.max(...numbers) : 0;
      }

      case 'MIN': {
        const values = this.resolveRangeValues(args[0], cells);
        const numbers = values.map(Number).filter((n) => !isNaN(n));
        return numbers.length ? Math.min(...numbers) : 0;
      }

      case 'NB':
      case 'COUNT': {
        const values = this.resolveRangeValues(args[0], cells);
        return values.filter((v) => typeof v === 'number').length;
      }

      case 'NB.SI':
      case 'COUNTIF': {
        if (args.length < 2) throw new Error('#VALEUR!');
        const rangeCells = this.expandRange(args[0]);
        const criterion = this.evaluateArg(args[1], cells);
        let count = 0;
        for (const coord of rangeCells) {
          const val = cells[coord]?.value;
          if (this.matchesCriterion(val, criterion)) count++;
        }
        return count;
      }

      case 'SOMME.SI':
      case 'SUMIF': {
        if (args.length < 2) throw new Error('#VALEUR!');
        const rangeCritCoords = this.expandRange(args[0]);
        const criterion = this.evaluateArg(args[1], cells);
        const sumCoords = args[2] ? this.expandRange(args[2]) : rangeCritCoords;

        let total = 0;
        for (let i = 0; i < rangeCritCoords.length; i++) {
          const critVal = cells[rangeCritCoords[i]]?.value;
          if (this.matchesCriterion(critVal, criterion)) {
            const sumVal = Number(cells[sumCoords[i]]?.value) || 0;
            total += sumVal;
          }
        }
        return total;
      }

      case 'SI':
      case 'IF': {
        if (args.length < 2) throw new Error('#VALEUR!');
        const conditionResult = this.evaluateCondition(args[0], cells);
        if (conditionResult) {
          return this.evaluateArg(args[1], cells);
        } else {
          return args[2] !== undefined ? this.evaluateArg(args[2], cells) : false;
        }
      }

      case 'RECHERCHEV':
      case 'VLOOKUP': {
        // RECHERCHEV(valeur_cherchée; table_matrice; no_index_col; [valeur_proche])
        if (args.length < 3) throw new Error('#VALEUR!');
        const lookupVal = this.evaluateArg(args[0], cells);
        const matrixCoords = this.expandRange2D(args[1]);
        const colIdx = Number(this.evaluateArg(args[2], cells));

        if (isNaN(colIdx) || colIdx < 1 || !matrixCoords.length) throw new Error('#VALEUR!');

        for (const row of matrixCoords) {
          const firstCellCoord = row[0];
          const firstVal = cells[firstCellCoord]?.value;
          if (String(firstVal).trim().toLowerCase() === String(lookupVal).trim().toLowerCase()) {
            const targetCoord = row[colIdx - 1];
            if (!targetCoord) throw new Error('#VALEUR!');
            return cells[targetCoord]?.value ?? '';
          }
        }
        throw new Error('#N/A');
      }

      case 'RECHERCHEX':
      case 'XLOOKUP': {
        // RECHERCHEX(valeur_cherchée; tableau_recherche; tableau_renvoyé)
        if (args.length < 3) throw new Error('#VALEUR!');
        const lookupVal = this.evaluateArg(args[0], cells);
        const lookupRange = this.expandRange(args[1]);
        const returnRange = this.expandRange(args[2]);

        for (let i = 0; i < lookupRange.length; i++) {
          const checkVal = cells[lookupRange[i]]?.value;
          if (String(checkVal).trim().toLowerCase() === String(lookupVal).trim().toLowerCase()) {
            const returnCoord = returnRange[i];
            return returnCoord ? cells[returnCoord]?.value ?? '' : '';
          }
        }
        throw new Error('#N/A');
      }

      default:
        throw new Error('#NOM?');
    }
  }

  /**
   * Checks if a cell value matches a condition criterion (e.g. "Gros Œuvre", ">=100", 20).
   */
  private matchesCriterion(value: unknown, criterion: unknown): boolean {
    const strVal = String(value ?? '').trim().toLowerCase();
    const strCrit = String(criterion ?? '').trim().toLowerCase();

    if (strCrit.startsWith('>=')) {
      return Number(value) >= Number(strCrit.slice(2));
    }
    if (strCrit.startsWith('<=')) {
      return Number(value) <= Number(strCrit.slice(2));
    }
    if (strCrit.startsWith('>')) {
      return Number(value) > Number(strCrit.slice(1));
    }
    if (strCrit.startsWith('<')) {
      return Number(value) < Number(strCrit.slice(1));
    }
    if (strCrit.startsWith('<>')) {
      return strVal !== strCrit.slice(2);
    }
    return strVal === strCrit;
  }

  /**
   * Evaluates a logical condition string (e.g. "F2>=200000" or "C2=\"Finition\"").
   */
  private evaluateCondition(condStr: string, cells: ExcelGridMap): boolean {
    const operators = ['>=', '<=', '<>', '>', '<', '='];
    for (const op of operators) {
      const idx = condStr.indexOf(op);
      if (idx !== -1) {
        const leftExpr = condStr.slice(0, idx).trim();
        const rightExpr = condStr.slice(idx + op.length).trim();
        const left = this.evaluateArg(leftExpr, cells);
        const right = this.evaluateArg(rightExpr, cells);

        const leftNum = Number(left);
        const rightNum = Number(right);
        const areBothNumbers = !isNaN(leftNum) && !isNaN(rightNum);

        switch (op) {
          case '>=': return areBothNumbers ? leftNum >= rightNum : String(left) >= String(right);
          case '<=': return areBothNumbers ? leftNum <= rightNum : String(left) <= String(right);
          case '>': return areBothNumbers ? leftNum > rightNum : String(left) > String(right);
          case '<': return areBothNumbers ? leftNum < rightNum : String(left) < String(right);
          case '<>': return left !== right;
          case '=': return left === right || String(left).toLowerCase() === String(right).toLowerCase();
        }
      }
    }
    const val = this.evaluateArg(condStr, cells);
    return Boolean(val);
  }

  /**
   * Resolves a single function argument (number literal, quoted string, cell reference, or inner formula).
   */
  private evaluateArg(arg: string, cells: ExcelGridMap): string | number | boolean {
    const trimmed = arg.trim();
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      return trimmed.slice(1, -1);
    }
    if (/^[A-Z][0-9]{1,2}$/i.test(trimmed)) {
      const coord = trimmed.toUpperCase();
      return cells[coord]?.value ?? 0;
    }
    const num = Number(trimmed.replace(',', '.'));
    if (!isNaN(num)) return num;

    // Sub-formula or arithmetic
    return this.evaluateExpression(trimmed, cells);
  }

  /**
   * Evaluates simple arithmetic expressions with cell replacements: e.g. D2*E2, F2*(1-G2)
   */
  private evaluateExpression(expr: string, cells: ExcelGridMap): number | string {
    // Replace cell coordinates (A1 to K99) with their numeric values
    const replaced = expr.replace(/\b([A-K][0-9]{1,2})\b/gi, (match) => {
      const coord = match.toUpperCase();
      const val = cells[coord]?.value;
      if (typeof val === 'number') return String(val);
      if (val === null || val === undefined || val === '') return '0';
      const num = Number(val);
      return !isNaN(num) ? String(num) : `"${val}"`;
    });

    try {
      // Safe math evaluation restricted to digits, operators and parentheses
      if (/^[0-9+\-*/()., %^ ]+$/.test(replaced)) {
        const sanitized = replaced.replace(/%/g, '/100').replace(/,/g, '.').replace(/\^/g, '**');
        const result = Function(`'use strict'; return (${sanitized})`)();
        return typeof result === 'number' && !isNaN(result) ? result : 0;
      }
    } catch {
      // Return uncomputed string if evaluation fails
    }

    return expr;
  }

  /**
   * Expands an Excel 1D range (e.g. F2:F11 or A1:E1) into an array of cell coordinates.
   */
  private expandRange(rangeStr: string): string[] {
    const parts = rangeStr.trim().split(':');
    if (parts.length === 1) return [parts[0].toUpperCase()];
    if (parts.length !== 2) return [];

    const start = this.parseCellCoord(parts[0]);
    const end = this.parseCellCoord(parts[1]);
    if (!start || !end) return [];

    const coords: string[] = [];
    const minCol = Math.min(start.colIdx, end.colIdx);
    const maxCol = Math.max(start.colIdx, end.colIdx);
    const minRow = Math.min(start.row, end.row);
    const maxRow = Math.max(start.row, end.row);

    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        coords.push(`${this.indexToCol(c)}${r}`);
      }
    }
    return coords;
  }

  /**
   * Expands a 2D range into an array of rows: [ [A2, B2, C2], [A3, B3, C3], ... ]
   */
  private expandRange2D(rangeStr: string): string[][] {
    const parts = rangeStr.trim().split(':');
    if (parts.length !== 2) return [];
    const start = this.parseCellCoord(parts[0]);
    const end = this.parseCellCoord(parts[1]);
    if (!start || !end) return [];

    const minCol = Math.min(start.colIdx, end.colIdx);
    const maxCol = Math.max(start.colIdx, end.colIdx);
    const minRow = Math.min(start.row, end.row);
    const maxRow = Math.max(start.row, end.row);

    const rows: string[][] = [];
    for (let r = minRow; r <= maxRow; r++) {
      const rowCoords: string[] = [];
      for (let c = minCol; c <= maxCol; c++) {
        rowCoords.push(`${this.indexToCol(c)}${r}`);
      }
      rows.push(rowCoords);
    }
    return rows;
  }

  /**
   * Extracts values for a given range (e.g. F2:F11).
   */
  private resolveRangeValues(rangeStr: string, cells: ExcelGridMap): unknown[] {
    const coords = this.expandRange(rangeStr);
    return coords.map((coord) => cells[coord]?.value ?? 0);
  }

  private parseCellCoord(cell: string): { col: string; row: number; colIdx: number } | null {
    const match = cell.trim().toUpperCase().match(/^([A-Z])([0-9]{1,2})$/);
    if (!match) return null;
    const col = match[1];
    const row = parseInt(match[2], 10);
    const colIdx = col.charCodeAt(0) - 64; // A -> 1
    return { col, row, colIdx };
  }

  private indexToCol(index: number): string {
    return String.fromCharCode(64 + index);
  }

  /**
   * Formats numbers into localized Cameroonian currency (FCFA) or percentages.
   */
  private formatValue(value: unknown, coord: string): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'number') {
      const colLetter = coord.charAt(0).toUpperCase();

      // Percentage formatting for Column G (Taux Remise)
      if (colLetter === 'G') {
        return `${Math.round(value * 100)}%`;
      }

      // Currency formatting for D (Prix), F (Brut), H (Net), F13, F14, F15, K3
      const isCurrency = ['D', 'F', 'H'].includes(colLetter) || ['F13', 'F14', 'F15', 'K3'].includes(coord);
      if (isCurrency) {
        return `${value.toLocaleString('fr-FR')} FCFA`;
      }

      return value.toLocaleString('fr-FR');
    }
    return String(value);
  }

  /**
   * Verifies the user's spreadsheet state against pedagogical check rules.
   */
  async check(state: ExcelLabState, rules: CheckRule[]): Promise<LabResult> {
    const details: RuleCheckDetail[] = [];
    let passedCount = 0;

    for (const rule of rules) {
      let passed = false;
      let message = '';

      if (rule.validator) {
        try {
          passed = rule.validator(state);
        } catch (err: unknown) {
          passed = false;
          message = err instanceof Error ? err.message : 'Validation error';
        }
      } else if (rule.type === 'contains' && rule.expectedPattern) {
        // Checks formula content in a specific target cell or anywhere
        const pattern = typeof rule.expectedPattern === 'string'
          ? new RegExp(rule.expectedPattern, 'i')
          : rule.expectedPattern;
        
        passed = Object.values(state.cells).some((c) => pattern.test(c.raw));
      }

      if (passed) {
        passedCount++;
      }

      details.push({
        ruleId: rule.id,
        description: rule.description,
        passed,
        message: passed ? undefined : message || 'Critère non validé'
      });
    }

    const totalRules = rules.length || 1;
    const score = Math.round((passedCount / totalRules) * 100);
    const isSuccess = passedCount === totalRules;

    return {
      isSuccess,
      score,
      message: isSuccess
        ? 'Félicitations ! Toutes les formules et calculs sont parfaitement exacts.'
        : `Progression : ${passedCount}/${totalRules} critères validés. Ajustez vos formules.`,
      details
    };
  }

  async export(state: ExcelLabState): Promise<Blob> {
    const rows: string[] = [];
    for (let r = 1; r <= state.rowCount; r++) {
      const rowValues: string[] = [];
      for (let c = 1; c <= state.colCount; c++) {
        const coord = `${this.indexToCol(c)}${r}`;
        const cell = state.cells[coord];
        const val = cell?.formatted || cell?.raw || '';
        rowValues.push(`"${val.replace(/"/g, '""')}"`);
      }
      rows.push(rowValues.join(';'));
    }
    const csvContent = '\uFEFF' + rows.join('\r\n');
    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  }

  async import(file: File): Promise<ExcelLabState> {
    const text = await file.text();
    const lines = text.split(/\r?\n/);
    const cells: ExcelGridMap = {};

    lines.forEach((line, rIdx) => {
      const r = rIdx + 1;
      const cols = line.split(';');
      cols.forEach((val, cIdx) => {
        const c = cIdx + 1;
        const cleanVal = val.replace(/^"|"$/g, '').replace(/""/g, '"');
        if (cleanVal) {
          const coord = `${this.indexToCol(c)}${r}`;
          cells[coord] = {
            raw: cleanVal,
            value: null,
            formula: cleanVal.startsWith('=') ? cleanVal : undefined
          };
        }
      });
    });

    this.recalculateAll(cells);

    return {
      cells,
      activeCell: 'A1',
      formulaInput: cells['A1']?.raw || '',
      activeExercise: null,
      rowCount: Math.max(lines.length, this.maxRows),
      colCount: this.maxCols
    };
  }
}
