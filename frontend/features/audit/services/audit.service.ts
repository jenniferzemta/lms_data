import { AuditReport } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class AuditService {
  /**
   * Sends code or formula to backend audit engine and receives structured report (F3.1, F3.2)
   */
  async analyzeCode(tool: string, content: string): Promise<AuditReport> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/courses/audit/analyze/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tool, content }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Offline fallback evaluation
    }

    // Local client-side fallback
    const hasDollar = content.includes('$');
    const isCartesian = content.toUpperCase().includes('FROM') && content.includes(',') && !content.toUpperCase().includes('WHERE');
    const hasIterrows = content.includes('.iterrows()');

    let score = 90;
    const issues = [];
    const strengths = ["Analyse exécutée en mode local résilient."];

    if (tool === 'excel' && !hasDollar && (content.includes('SOMME.SI') || content.includes('RECHERCHE'))) {
      score -= 20;
      issues.push({
        severity: 'warning' as const,
        message: "Absence de références absolues ($) pour verrouiller vos plages.",
        penalty: 20,
        tip: "Utilisez F4 pour verrouiller vos plages ($A$2:$D$100).",
        reference: "Figeage de cellule"
      });
    }

    if (tool === 'sql' && isCartesian) {
      score -= 35;
      issues.push({
        severity: 'error' as const,
        message: "Produit cartésien détecté : FROM table1, table2 sans prédicat WHERE.",
        penalty: 35,
        tip: "Utilisez JOIN ... ON pour vos jointures relationnelles.",
        reference: "FROM table1, table2"
      });
    }

    if (tool === 'python' && hasIterrows) {
      score -= 25;
      issues.push({
        severity: 'warning' as const,
        message: "Boucle itérative .iterrows() détectée.",
        penalty: 25,
        tip: "Privilégiez les opérations vectorisées de Pandas.",
        reference: ".iterrows()"
      });
    }

    return {
      tool,
      score,
      status: score >= 90 ? 'EXCELLENT' : (score >= 70 ? 'GOOD' : 'NEEDS_WORK'),
      strengths,
      issues,
      recommendations: issues.map(i => i.tip),
      summary: `Rapport généré localement avec un score de conformité de ${score}/100.`,
      formatted_report: `# Rapport d'audit ${tool.toUpperCase()}\nScore : ${score}/100\n\n${issues.map(i => `- ${i.message}`).join('\n')}`
    };
  }

  /**
   * Downloads the generated audit report as Markdown file
   */
  async downloadReport(tool: string, content: string): Promise<void> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/courses/audit/download/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tool, content }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rapport_audit_${tool.toLowerCase()}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
      }
    } catch {
      // Local fallback download
    }

    const report = await this.analyzeCode(tool, content);
    const blob = new Blob([report.formatted_report], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport_audit_${tool.toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const auditService = new AuditService();
