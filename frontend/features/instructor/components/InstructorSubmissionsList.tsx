'use client';

import React, { useState } from 'react';
import { InstructorSubmissionItem } from '../types';
import { submitInstructorGrade } from '../services/instructor.service';
import {
  FileText,
  CheckCircle,
  Clock,
  ExternalLink,
  Send,
  Loader2,
  User,
  Sparkles,
} from 'lucide-react';

interface InstructorSubmissionsListProps {
  submissions: InstructorSubmissionItem[];
  onSubmissionGraded: () => void;
}

export const InstructorSubmissionsList: React.FC<InstructorSubmissionsListProps> = ({
  submissions,
  onSubmissionGraded,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'GRADED'>('ALL');
  const [selectedSub, setSelectedSub] = useState<InstructorSubmissionItem | null>(null);
  const [gradeInput, setGradeInput] = useState<number>(85);
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const filtered = submissions.filter((s) => {
    if (filter === 'PENDING') return !s.is_graded;
    if (filter === 'GRADED') return s.is_graded;
    return true;
  });

  const openGrading = (sub: InstructorSubmissionItem) => {
    setSelectedSub(sub);
    setGradeInput(sub.instructor_grade || sub.self_evaluation_score || 80);
    setFeedbackInput(sub.instructor_feedback || '');
    setSuccessMessage(null);
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    setIsSubmitting(true);
    try {
      const res = await submitInstructorGrade(selectedSub.id, gradeInput, feedbackInput);
      setSuccessMessage(res.message);
      onSubmissionGraded();
      setTimeout(() => {
        setSelectedSub(null);
        setSuccessMessage(null);
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl max-w-sm">
        <button
          onClick={() => setFilter('ALL')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all min-h-[36px] ${
            filter === 'ALL'
              ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Toutes ({submissions.length})
        </button>
        <button
          onClick={() => setFilter('PENDING')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all min-h-[36px] ${
            filter === 'PENDING'
              ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          À corriger ({submissions.filter((s) => !s.is_graded).length})
        </button>
        <button
          onClick={() => setFilter('GRADED')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all min-h-[36px] ${
            filter === 'GRADED'
              ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Corrigées ({submissions.filter((s) => s.is_graded).length})
        </button>
      </div>

      {/* Submissions List */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map((sub) => (
          <div
            key={sub.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-brand-300 dark:hover:border-brand-700/60 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {sub.company_name}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    sub.is_graded
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}
                >
                  {sub.is_graded ? `Noté ${sub.instructor_grade}/100` : 'En attente de notation'}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-white truncate">
                {sub.mission_title}
              </h4>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                  <User className="w-3.5 h-3.5 text-brand-600" />
                  {sub.learner_name} ({sub.learner_email})
                </span>
                <span>•</span>
                <span>Auto-évaluation : <strong>{sub.self_evaluation_score}/100</strong></span>
              </div>

              {sub.learner_notes && (
                <p className="text-xs text-slate-600 dark:text-slate-400 italic line-clamp-2 pt-1">
                  « {sub.learner_notes} »
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {sub.deliverable_link && (
                <a
                  href={sub.deliverable_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 min-h-[40px]"
                >
                  <FileText className="w-3.5 h-3.5 text-brand-600" />
                  <span>Livrable</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}

              <button
                onClick={() => openGrading(sub)}
                className={`px-4 py-2 rounded-xl text-xs font-bold min-h-[40px] flex items-center gap-1.5 transition-colors ${
                  sub.is_graded
                    ? 'border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    : 'bg-brand-600 hover:bg-brand-700 text-white shadow-xs'
                }`}
              >
                <span>{sub.is_graded ? 'Modifier la note' : 'Évaluer & Noter'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Grading Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Évaluation & Feedback Formateur
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedSub.learner_name} — {selectedSub.mission_title}
                </p>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {successMessage ? (
              <div className="p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {successMessage}
                </p>
              </div>
            ) : (
              <form onSubmit={handleGradeSubmit} className="space-y-4">
                {/* Score Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Note finale sur 100</span>
                    <span className="text-brand-600 font-extrabold text-sm">{gradeInput} / 100</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={gradeInput}
                    onChange={(e) => setGradeInput(Number(e.target.value))}
                    className="w-full accent-brand-600 cursor-pointer"
                  />
                  <div className="flex gap-2 pt-1">
                    {[60, 70, 80, 85, 90, 95, 100].map((quick) => (
                      <button
                        key={quick}
                        type="button"
                        onClick={() => setGradeInput(quick)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-semibold border ${
                          gradeInput === quick
                            ? 'bg-brand-600 text-white border-brand-600'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        {quick}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Commentaire constructif et recommandations (R24)
                  </label>
                  <textarea
                    rows={4}
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder="Points forts observés, rigueur des calculs FCFA, axes d'amélioration méthodologiques..."
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-hidden"
                  />
                </div>

                {/* Submit Action */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSub(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold min-h-[44px]"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold min-h-[44px] flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>Valider l&apos;évaluation</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
