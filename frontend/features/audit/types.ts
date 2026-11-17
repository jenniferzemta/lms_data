export type AuditSeverity = 'error' | 'warning' | 'info';

export interface AuditIssue {
  severity: AuditSeverity;
  message: string;
  penalty: number;
  tip: string;
  reference?: string;
}

export interface AuditReport {
  tool: 'excel' | 'sql' | 'python' | string;
  score: number;
  status: 'EXCELLENT' | 'GOOD' | 'NEEDS_WORK' | 'CRITICAL';
  strengths: string[];
  issues: AuditIssue[];
  recommendations: string[];
  summary: string;
  formatted_report: string;
}

