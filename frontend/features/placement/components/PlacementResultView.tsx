'use client';

import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  Compass, 
  Table, 
  Terminal, 
  FileCode, 
  BarChart3, 
  Sparkles,
  Share2
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Button } from '@/ui/Button';
import { PlacementResult } from '../types';

interface PlacementResultViewProps {
  result: PlacementResult;
  onRetake: () => void;
}

export const PlacementResultView: React.FC<PlacementResultViewProps> = ({ result, onRetake }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'N3':
        return 'from-purple-600 to-indigo-700 text-white';
      case 'N2':
        return 'from-blue-600 to-cyan-600 text-white';
      default:
        return 'from-emerald-600 to-teal-700 text-white';
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'N3':
        return 'Niveau 3 — Expert & Modélisation DAX';
      case 'N2':
        return 'Niveau 2 — Pratique Avancée & Automatisation';
      default:
        return 'Niveau 1 — Les Fondamentaux de la Donnée';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Hero Recommendation Header */}
      <div className={`rounded-3xl p-6 sm:p-8 shadow-lg bg-gradient-to-br ${getLevelColor(result.recommended_level)} flex flex-col md:flex-row md:items-center justify-between gap-6`}>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div className="flex flex-col text-white">
            <span className="text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Diagnostic Pédagogique Validé
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {getLevelBadge(result.recommended_level)}
            </h1>
            <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-xl leading-relaxed">
              Félicitations ! Votre score global de <strong>{result.score_total}%</strong> vous oriente directement vers le palier d'apprentissage optimal pour maximiser votre montée en compétences sans temps mort.
            </p>
          </div>
        </div>

        {/* Global Score Circle */}
        <div className="self-end md:self-center shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col items-center justify-center text-white min-w-[120px]">
          <span className="text-3xl font-black">{Math.round(result.score_total)}%</span>
          <span className="text-[11px] font-bold text-white/80 uppercase">Score Global</span>
        </div>
      </div>

      {/* Tool Breakdown Gauges (Grid 4 tools) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Excel */}
        <div className="bg-white rounded-2xl border border-brand-border p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Table className="w-4 h-4 text-emerald-600" />
              Tableur Excel
            </span>
            <span className="text-xs font-black text-slate-900">{Math.round(result.score_excel)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${result.score_excel}%` }}
            />
          </div>
        </div>

        {/* SQL */}
        <div className="bg-white rounded-2xl border border-brand-border p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-sky-600" />
              Bases SQL
            </span>
            <span className="text-xs font-black text-slate-900">{Math.round(result.score_sql)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full"
              style={{ width: `${result.score_sql}%` }}
            />
          </div>
        </div>

        {/* Python */}
        <div className="bg-white rounded-2xl border border-brand-border p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-amber-600" />
              Python & Pandas
            </span>
            <span className="text-xs font-black text-slate-900">{Math.round(result.score_python)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${result.score_python}%` }}
            />
          </div>
        </div>

        {/* Power BI */}
        <div className="bg-white rounded-2xl border border-brand-border p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              Power BI & DAX
            </span>
            <span className="text-xs font-black text-slate-900">{Math.round(result.score_powerbi)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${result.score_powerbi}%` }}
            />
          </div>
        </div>
      </div>

      {/* Recommended Course Card (Direct 1-Click Action) */}
      {result.recommended_course && (
        <div className="bg-white rounded-3xl border border-brand-primary/40 p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0">
              <Compass className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Votre Cours Cible Recommandé
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                {result.recommended_course.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                {result.recommended_course.description || 'Apprenez par la pratique sur des cas réels d\'entreprises camerounaises avec nos laboratoires intégrés.'}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link
              href={`/courses/${result.recommended_course.slug}`}
              className="px-6 py-3.5 rounded-2xl bg-brand-primary text-white font-bold text-sm shadow-md hover:bg-brand-primary/95 active:scale-95 transition-all flex items-center gap-2 min-h-[48px]"
            >
              Rejoindre le cours
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Retake & Info Footer */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Test enregistré et synchronisé dans votre journal xAPI.
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={onRetake}
          className="flex items-center gap-1.5 text-xs font-semibold self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Repasser le test de positionnement
        </Button>
      </div>
    </div>
  );
};
