'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { 
  FileCheck2, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Download, 
  Play, 
  Table, 
  Terminal, 
  FileCode, 
  ShieldCheck, 
  RotateCcw 
} from 'lucide-react';
import { Button } from '@/ui/Button';
import { auditService } from '../services/audit.service';
import { AuditReport } from '../types';

export const CodeAuditView: React.FC = () => {
  const locale = useLocale();
  const isEn = locale === 'en';
  const [activeTool, setActiveTool] = useState<'excel' | 'sql' | 'python'>('excel');
  const [content, setContent] = useState<string>(
    '=SOMME.SI(A2:A100; "Douala"; B2:B100) * 0.1925'
  );
  const [report, setReport] = useState<AuditReport | null>(null);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const presets = {
    excel: {
      bad: '=SOMME.SI(A2:A100; "Douala"; B2:B100) * 0.1925',
      good: '=RECHERCHEX(A2; $D$2:$D$100; $E$2:$E$100; SIERREUR($C$1; 0))',
    },
    sql: {
      bad: 'SELECT * FROM clients, transactions',
      good: 'SELECT c.nom, SUM(t.montant_fcfa) FROM clients c JOIN transactions t ON c.id = t.client_id GROUP BY c.nom',
    },
    python: {
      bad: 'import pandas\ndf = pandas.read_csv("ventes.csv")\nfor idx, row in df.iterrows():\n    df["net"] = row["brut"] * 0.95',
      good: 'import pandas as pd\ndf = pd.read_csv("ventes.csv")\ndf["montant_fcfa"] = df["montant_fcfa"].fillna(0)\ndf["net_fcfa"] = df["brut_fcfa"] * 0.95',
    },
  };

  const handleToolChange = (tool: 'excel' | 'sql' | 'python') => {
    setActiveTool(tool);
    setContent(presets[tool].bad);
    setReport(null);
  };

  const handleRunAudit = async () => {
    if (!content.trim()) return;
    setIsAuditing(true);
    try {
      const res = await auditService.analyzeCode(activeTool, content);
      setReport(res);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleDownload = async () => {
    if (!content.trim()) return;
    setIsDownloading(true);
    try {
      await auditService.downloadReport(activeTool, content);
    } finally {
      setIsDownloading(false);
    }
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500 text-white';
    if (score >= 70) return 'bg-blue-600 text-white';
    if (score >= 50) return 'bg-amber-500 text-white';
    return 'bg-red-600 text-white';
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-brand-border p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0 shadow-xs">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-primary text-white">
                {isEn ? 'Automated Analysis Tool' : "Outil d'Analyse Automatisée"}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {isEn ? 'Instant Grading & Feedback' : 'Correction & Feedback Immédiat'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-brand-text tracking-tight">
              {isEn ? 'Automated Code & Formula Audit' : 'Audit & Correction Automatique de Code et Formules'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {isEn
                ? 'Advanced static and structural analysis for Excel formulas, SQL queries, and Python scripts with downloadable feedback report.'
                : 'Analyse statique et structurelle avancée pour formules Excel, requêtes SQL et scripts Python avec rapport pédagogique téléchargeable.'}
            </p>
          </div>
        </div>
      </div>

      {/* Tool Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => handleToolChange('excel')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-2 min-h-[44px] ${
            activeTool === 'excel'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-white text-slate-700 border-brand-border hover:bg-slate-50'
          }`}
        >
          <Table className="w-4 h-4" />
          {isEn ? 'Excel Formulas' : 'Formules Excel'}
        </button>

        <button
          type="button"
          onClick={() => handleToolChange('sql')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-2 min-h-[44px] ${
            activeTool === 'sql'
              ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
              : 'bg-white text-slate-700 border-brand-border hover:bg-slate-50'
          }`}
        >
          <Terminal className="w-4 h-4" />
          {isEn ? 'SQL Queries' : 'Requêtes SQL'}
        </button>

        <button
          type="button"
          onClick={() => handleToolChange('python')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-2 min-h-[44px] ${
            activeTool === 'python'
              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
              : 'bg-white text-slate-700 border-brand-border hover:bg-slate-50'
          }`}
        >
          <FileCode className="w-4 h-4" />
          {isEn ? 'Python & Pandas Scripts' : 'Scripts Python & Pandas'}
        </button>
      </div>

      {/* Editor & Controls */}
      <div className="bg-white rounded-3xl border border-brand-border p-5 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {isEn ? 'Paste your formula or code to audit:' : 'Collez votre formule ou code à auditer :'}
          </span>

          {/* Quick presets */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">{isEn ? 'Quick samples:' : 'Exemples rapides :'}</span>
            <button
              type="button"
              onClick={() => setContent(presets[activeTool].bad)}
              className="text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-semibold"
            >
              {isEn ? 'With Issues' : 'Avec anomalies'}
            </button>
            <button
              type="button"
              onClick={() => setContent(presets[activeTool].good)}
              className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold"
            >
              {isEn ? 'Compliant' : 'Conforme'}
            </button>
          </div>
        </div>

        <textarea
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isEn ? `Enter your ${activeTool.toUpperCase()} code here...` : `Entrez votre code ${activeTool.toUpperCase()} ici...`}
          className="w-full p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm border border-slate-800 outline-hidden resize-y focus:ring-2 focus:ring-brand-primary"
          spellCheck={false}
        />

        <div className="flex items-center justify-between gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setContent('');
              setReport(null);
            }}
            className="text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {isEn ? 'Clear' : 'Effacer'}
          </Button>

          <Button
            onClick={handleRunAudit}
            disabled={!content.trim() || isAuditing}
            className="flex items-center gap-2 text-xs font-bold min-h-[44px] px-6"
          >
            {isAuditing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isEn ? 'Analyzing...' : 'Analyse en cours...'}
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                {isEn ? 'Run Code Audit' : "Lancer l'audit de complétude"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Audit Report Results */}
      {report && (
        <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-md flex flex-col gap-6 animate-in fade-in">
          {/* Summary Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-xs ${getScoreBadgeColor(report.score)}`}>
                {report.score}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                    {isEn ? 'Compliance Status:' : 'Statut de conformité :'}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                    {report.status}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 max-w-xl">
                  {report.summary}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-1.5 text-xs font-bold self-end sm:self-center shrink-0 min-h-[40px]"
            >
              <Download className="w-4 h-4" />
              {isEn ? 'Download Report (.md)' : 'Télécharger le rapport (.md)'}
            </Button>
          </div>

          {/* Strengths checklist */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {isEn ? `Strengths & Best Practices (${report.strengths.length})` : `Points forts & bonnes pratiques (${report.strengths.length})`}
            </h3>
            {report.strengths.length === 0 ? (
              <p className="text-xs text-slate-400 italic">{isEn ? 'No specific strengths noted.' : 'Aucun point fort spécifique relevé.'}</p>
            ) : (
              <div className="space-y-1.5">
                {report.strengths.map((str, idx) => (
                  <div key={idx} className="text-xs text-emerald-800 bg-emerald-50/70 border border-emerald-200/60 p-2.5 rounded-xl flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{str}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Issues and Anomalies */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              {isEn ? `Detected Issues & Anomalies (${report.issues.length})` : `Écarts et anomalies détectés (${report.issues.length})`}
            </h3>
            {report.issues.length === 0 ? (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {isEn ? 'Congratulations! No anomalies detected in this code.' : 'Félicitations ! Aucune anomalie détectée sur ce livrable.'}
              </div>
            ) : (
              <div className="space-y-3">
                {report.issues.map((iss, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border flex flex-col gap-1.5 ${
                      iss.severity === 'error'
                        ? 'bg-red-50/80 border-red-200 text-red-950'
                        : 'bg-amber-50/80 border-amber-200 text-amber-950'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {iss.severity === 'error' ? (
                          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <span className="text-xs font-bold">{iss.message}</span>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/80 border text-slate-700 shrink-0">
                        -{iss.penalty} pts
                      </span>
                    </div>

                    {iss.tip && (
                      <div className="text-[11px] font-medium text-slate-700 bg-white/70 p-2 rounded-xl mt-1 flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-brand-primary shrink-0 mt-0.5" />
                        <span><strong>{isEn ? 'Tip:' : 'Conseil pédagogique :'}</strong> {iss.tip}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Recommendations Plan */}
          {report.recommendations.length > 0 && (
            <div className="p-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/20">
              <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                {isEn ? 'Recommended Action Plan:' : "Plan d'action correctif recommandé :"}
              </h4>
              <ul className="space-y-1 text-xs text-slate-700 font-medium">
                {report.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-brand-primary/20 text-brand-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

