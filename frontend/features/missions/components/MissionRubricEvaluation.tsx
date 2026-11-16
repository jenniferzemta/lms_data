'use client';

import React, { useState } from 'react';
import { RubricCriterion, MissionSubmission } from '../types';
import { Button } from '@/ui/Button';
import { Award, CheckCircle2, Link as LinkIcon, FileText, Send } from 'lucide-react';

interface MissionRubricEvaluationProps {
  rubric: RubricCriterion[];
  existingSubmission: MissionSubmission | null;
  onSubmit: (data: { self_evaluation: Record<string, number>; learner_notes: string; deliverable_link: string }) => Promise<void>;
  isSubmitting: boolean;
}

export const MissionRubricEvaluation: React.FC<MissionRubricEvaluationProps> = ({
  rubric,
  existingSubmission,
  onSubmit,
  isSubmitting
}) => {
  const [scores, setScores] = useState<Record<string, number>>(() => {
    if (existingSubmission?.self_evaluation) {
      return { ...existingSubmission.self_evaluation };
    }
    const initial: Record<string, number> = {};
    for (const crit of rubric) {
      initial[crit.id] = crit.points; // default to max
    }
    return initial;
  });

  const [notes, setNotes] = useState<string>(existingSubmission?.learner_notes || '');
  const [deliverableLink, setDeliverableLink] = useState<string>(existingSubmission?.deliverable_link || '');

  const totalScore = Object.values(scores).reduce((acc, v) => acc + (Number(v) || 0), 0);
  const maxPossible = rubric.reduce((acc, c) => acc + c.points, 0) || 100;
  const normalizedScore = Math.min(100, Math.round((totalScore / maxPossible) * 100));

  const handleScoreChange = (critId: string, val: number) => {
    setScores((prev) => ({
      ...prev,
      [critId]: val
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      self_evaluation: scores,
      learner_notes: notes,
      deliverable_link: deliverableLink
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Score Summary Header Card */}
      <div className="bg-white border border-brand-border rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-brand-text">
              Grille d&apos;Auto-Évaluation Guidée (Critère R24)
            </h3>
            <p className="text-xs text-slate-500">
              Évaluez votre travail avec rigueur pour débloquer le diagnostic et corrigé type de référence.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
            Score estimé :
          </span>
          <span className="text-2xl font-black font-mono text-brand-primary">
            {normalizedScore} / 100
          </span>
        </div>
      </div>

      {/* Rubric Criteria List */}
      <div className="flex flex-col gap-3">
        {rubric.map((crit, idx) => {
          const currentScore = scores[crit.id] ?? crit.points;

          return (
            <div
              key={crit.id}
              className="bg-white border border-brand-border rounded-xl p-4 shadow-xs flex flex-col gap-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-brand-text">
                      {crit.label}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 pl-7 leading-relaxed">
                    {crit.description}
                  </p>
                </div>

                <div className="text-right shrink-0 pl-7 sm:pl-0">
                  <span className="text-xs font-mono font-bold text-emerald-700">
                    {currentScore} / {crit.points} pts
                  </span>
                </div>
              </div>

              {/* Score Selector Buttons (>= 44px touch target) */}
              <div className="flex items-center gap-2 pl-7 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleScoreChange(crit.id, 0)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all min-h-[44px] ${
                    currentScore === 0
                      ? 'bg-rose-50 border-rose-400 text-rose-800 ring-2 ring-rose-500/30'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  Non traité (0 pt)
                </button>

                <button
                  type="button"
                  onClick={() => handleScoreChange(crit.id, Math.round(crit.points / 2))}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all min-h-[44px] ${
                    currentScore === Math.round(crit.points / 2)
                      ? 'bg-amber-50 border-amber-400 text-amber-900 ring-2 ring-amber-500/30'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  Partiellement validé ({Math.round(crit.points / 2)} pts)
                </button>

                <button
                  type="button"
                  onClick={() => handleScoreChange(crit.id, crit.points)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all min-h-[44px] ${
                    currentScore === crit.points
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-500/30'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  Parfaitement validé ({crit.points} pts)
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Synthesis Notes & Deliverable Link */}
      <div className="bg-white border border-brand-border rounded-xl p-4 shadow-xs flex flex-col gap-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-1.5">
            <FileText className="w-4 h-4 text-brand-primary" />
            Votre synthèse exécutive & constats majeurs
          </label>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Résumez en 3 à 5 lignes vos conclusions pour la Direction Générale..."
            className="w-full px-3 py-2 bg-slate-50 border border-brand-border rounded-lg text-xs sm:text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent/40 focus:border-brand-accent transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-1.5">
            <LinkIcon className="w-4 h-4 text-brand-primary" />
            Lien vers vos fichiers ou livrables (Optionnel : GitHub, Google Drive)
          </label>
          <input
            type="url"
            value={deliverableLink}
            onChange={(e) => setDeliverableLink(e.target.value)}
            placeholder="https://github.com/votre-nom/audit-bafoussam..."
            className="w-full px-3 py-2 bg-slate-50 border border-brand-border rounded-lg text-xs sm:text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent/40 focus:border-brand-accent transition-all"
          />
        </div>
      </div>

      {/* Submit Action CTA */}
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="min-h-[44px] px-6 text-sm font-bold shadow-xs w-full sm:w-auto justify-center"
        >
          <Send className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Enregistrement...' : 'Valider & Débloquer le Corrigé Type'}
        </Button>
      </div>
    </form>
  );
};
