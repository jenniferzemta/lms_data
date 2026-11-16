'use client';

import React from 'react';
import { MissionSubmission } from '../types';
import { CheckCircle2, Sparkles, Award, Lock, BookOpen } from 'lucide-react';

interface MissionSolutionRevealProps {
  modelSolution: string;
  submission: MissionSubmission | null;
}

export const MissionSolutionReveal: React.FC<MissionSolutionRevealProps> = ({
  modelSolution,
  submission
}) => {
  if (!submission?.is_completed || !modelSolution) {
    return (
      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 text-center">
        <Lock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <h4 className="font-bold text-sm text-slate-700">Corrigé de référence verrouillé</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Complétez et enregistrez votre auto-évaluation sur la grille de critères ci-dessus pour débloquer l&apos;analyse de référence et les recommandations stratégiques.
        </p>
      </div>
    );
  }

  const isSuccess = (submission.final_score ?? 0) >= 70;

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-300">
      {/* Success / Score Banner */}
      <div
        className={`border rounded-xl p-5 shadow-xs ${
          isSuccess
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : 'bg-amber-50 border-amber-300 text-amber-950'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isSuccess ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
              }`}
            >
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {isSuccess
                  ? 'Mission Réussie ! Auto-évaluation validée.'
                  : 'Mission finalisée ! Prenez note des pistes d\'amélioration.'}
              </h3>
              <p className="text-xs sm:text-sm mt-0.5 opacity-90">
                Votre déclaration d&apos;apprentissage a été journalisée sur votre dossier xAPI.
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-75">
              Score auto-évalué
            </span>
            <div className="text-2xl font-black font-mono">
              {submission.final_score} / 100
            </div>
          </div>
        </div>
      </div>

      {/* Unlocked Model Solution Document */}
      <div className="bg-white border border-brand-border rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-brand-border">
          <Sparkles className="w-5 h-5 text-brand-accent" />
          <h3 className="font-bold text-sm sm:text-base text-brand-text">
            Diagnostic & Corrigé Type de Référence (Direction Générale)
          </h3>
        </div>

        {/* Content */}
        <div className="prose prose-sm max-w-none text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans">
          {modelSolution}
        </div>
      </div>
    </div>
  );
};
