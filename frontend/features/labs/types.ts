/**
 * Common Types and Contracts for DataMboa Interactive Laboratories (V2, Rule 40)
 */

export type LabType = 'sql' | 'python' | 'excel' | 'powerbi' | 'git';

export interface LabSnapshot {
  code: string;
  timestamp: number;
  activeExerciseId?: string;
  activeTab?: string;
}

export type CheckRuleType = 'contains' | 'exact' | 'columns' | 'row_count' | 'value' | 'custom';

export interface CheckRule {
  id: string;
  description: string;
  type: CheckRuleType;
  expectedColumns?: string[];
  expectedRowCount?: number;
  expectedPattern?: RegExp | string;
  expectedValue?: unknown;
  validator?: (data: unknown) => boolean;
}

export interface RuleCheckDetail {
  ruleId: string;
  description: string;
  passed: boolean;
  message?: string;
}

export interface LabResult {
  isSuccess: boolean;
  score: number;
  message: string;
  details: RuleCheckDetail[];
}

export interface LabExercise {
  id: string;
  slug: string;
  labType: LabType;
  title: string;
  instruction: string;
  context: string;
  initialCode: string;
  solutionCode: string;
  rules: CheckRule[];
  hints: string[];
  bloomLevel: 'REMEMBER' | 'UNDERSTAND' | 'APPLY' | 'ANALYZE' | 'EVALUATE' | 'CREATE';
  maxPoints: number;
  courseSlug?: string;
  lessonSlug?: string;
}

export interface SqlColumn {
  name: string;
  type: 'TEXT' | 'INTEGER' | 'DECIMAL' | 'DATE' | 'BOOLEAN';
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  references?: string;
}

export interface SqlTableSchema {
  name: string;
  label: string;
  columns: SqlColumn[];
  rowCount: number;
  sampleRows: Record<string, unknown>[];
}

export interface SqlQueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  executionTimeMs: number;
  error?: string;
}

export interface SqlLabState {
  code: string;
  history: string[];
  lastResult: SqlQueryResult | null;
  activeExercise: LabExercise | null;
  selectedTable: string | null;
}

export interface PythonExecutionResult {
  stdout: string;
  stderr?: string;
  outputTable?: { columns: string[]; rows: Record<string, unknown>[] };
  executionTimeMs: number;
  variables?: Record<string, unknown>;
  error?: string;
}

export interface PythonLabState {
  code: string;
  history: string[];
  lastResult: PythonExecutionResult | null;
  activeExercise: LabExercise | null;
}

export interface ExcelCell {
  raw: string;
  value: string | number | boolean | null;
  formula?: string;
  formatted?: string;
  error?: string;
  isHeader?: boolean;
}

export type ExcelGridMap = Record<string, ExcelCell>;

export interface ExcelLabState {
  cells: ExcelGridMap;
  activeCell: string;
  formulaInput: string;
  selectedRange?: string;
  activeExercise: LabExercise | null;
  rowCount: number;
  colCount: number;
}


