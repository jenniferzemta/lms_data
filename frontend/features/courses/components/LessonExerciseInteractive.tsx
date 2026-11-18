'use client';

import React, { useState } from 'react';
import { InteractiveExercise, ExerciseVerificationResult } from '../types';
import { coursesService } from '../services/courses.service';
import {
  Code2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface LessonExerciseInteractiveProps {
  exercise: InteractiveExercise;
  onSuccess?: () => void;
}

export const LessonExerciseInteractive: React.FC<LessonExerciseInteractiveProps> = ({
  exercise,
  onSuccess,
}) => {
  // Parsing prompt_template to extract placeholders like {{blank_1}} or {{cause}}
  const placeholderRegex = /\{\{([^}]+)\}\}/g;
  const placeholders: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = placeholderRegex.exec(exercise.prompt_template)) !== null) {
    placeholders.push(match[1]);
  }

  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    placeholders.forEach((p) => {
      initial[p] = '';
    });
    return initial;
  });

  const [activePlaceholder, setActivePlaceholder] = useState<string>(placeholders[0] || '');
  const [showHints, setShowHints] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ExerciseVerificationResult | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(exercise.is_completed ?? false);

  const handleInputChange = (key: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [key]: val }));
    setActivePlaceholder(key);
  };

  const handleChipClick = (token: string) => {
    if (!activePlaceholder && placeholders.length > 0) {
      setAnswers((prev) => ({ ...prev, [placeholders[0]]: token }));
      return;
    }
    setAnswers((prev) => ({ ...prev, [activePlaceholder]: token }));
    // Move to next empty placeholder if available
    const nextEmpty = placeholders.find((p) => p !== activePlaceholder && !answers[p]);
    if (nextEmpty) {
      setActivePlaceholder(nextEmpty);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const res = await coursesService.verifyExercise(exercise.id, answers);
      setResult(res);
      if (res.is_correct) {
        setIsCompleted(true);
        if (onSuccess) onSuccess();
      }
    } catch {
      setResult({
        is_correct: false,
        feedback: "Une erreur de réseau s'est produite lors de la vérification. Veuillez réessayer.",
        explanation: '',
        details: {},
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    const empty: Record<string, string> = {};
    placeholders.forEach((p) => {
      empty[p] = '';
    });
    setAnswers(empty);
    setResult(null);
    if (placeholders.length > 0) {
      setActivePlaceholder(placeholders[0]);
    }
  };

  // Render template parts interleaved with input fields
  const renderInteractiveTemplate = () => {
    const parts = exercise.prompt_template.split(/\{\{[^}]+\}\}/);
    return (
      <div className="font-mono text-sm sm:text-base leading-loose flex flex-wrap items-center gap-1.5 p-4 rounded-xl bg-[#121c2a] text-[#70f8e4] border border-slate-800 shadow-inner">
        {parts.map((part, index) => {
          const phKey = placeholders[index];
          const hasError = result && result.details[phKey] && !result.details[phKey].is_correct;
          const isCorrect = result && result.details[phKey] && result.details[phKey].is_correct;

          return (
            <React.Fragment key={index}>
              <span className="whitespace-pre select-none text-slate-200">{part}</span>
              {phKey && (
                <input
                  type="text"
                  value={answers[phKey] || ''}
                  onChange={(e) => handleInputChange(phKey, e.target.value)}
                  onFocus={() => setActivePlaceholder(phKey)}
                  aria-label={`Argument ${phKey}`}
                  placeholder={phKey}
                  className={`min-w-[60px] max-w-[130px] px-2.5 py-1 text-center font-bold font-mono text-sm rounded-lg border-2 transition-all outline-none min-h-[38px] ${
                    hasError
                      ? 'bg-rose-950/80 border-rose-500 text-rose-200 focus:ring-2 focus:ring-rose-400'
                      : isCorrect
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                      : activePlaceholder === phKey
                      ? 'bg-slate-900 border-[#13b8a6] text-[#70f8e4] ring-2 ring-[#13b8a6]/40'
                      : 'bg-slate-900/90 border-slate-700 text-white hover:border-slate-500'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
      {/* Exercise Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#006b5f] flex items-center justify-center border border-teal-200/60">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900">{exercise.title}</h4>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/50">
              Exercice pratique
            </span>
          </div>
        </div>

        {isCompleted && (
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Exercice Validé
          </span>
        )}
      </div>

      {/* Business Scenario / Instruction */}
      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
        {exercise.instruction}
      </p>

      {/* Interactive Code Template */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {renderInteractiveTemplate()}

        {/* Suggested Quick-Fill Tokens */}
        {exercise.options_or_tokens && exercise.options_or_tokens.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Étiquettes disponibles (cliquez pour insérer) :
            </span>
            <div className="flex flex-wrap gap-2">
              {exercise.options_or_tokens.map((token, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChipClick(token)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-[#13b8a6]/15 hover:border-[#13b8a6] border border-slate-200 text-slate-800 font-mono text-xs rounded-lg transition-all active:scale-95 min-h-[36px]"
                >
                  {token}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Progressive Hints Accordion */}
        {exercise.hints && exercise.hints.length > 0 && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowHints(!showHints)}
              className="inline-flex items-center gap-1.5 text-xs text-amber-800 hover:text-amber-900 font-medium py-1 min-h-[36px]"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>{showHints ? 'Masquer les indices' : 'Besoin d’un indice ?'}</span>
              {showHints ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showHints && (
              <div className="mt-2 p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1 text-xs text-amber-950 animate-in fade-in duration-200">
                {exercise.hints.map((hint, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="font-bold text-amber-700">💡 Indice {idx + 1} :</span>
                    <span>{hint}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Verification Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 sm:flex-initial min-h-[44px] px-6 py-2.5 rounded-xl bg-[#006b5f] hover:bg-[#005249] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm disabled:opacity-75"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Vérification...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Vérifier ma formule</span>
              </>
            )}
          </button>

          {result && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 min-h-[44px] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recommencer</span>
            </button>
          )}
        </div>
      </form>

      {/* Immediate Pedagogical Feedback (R24) */}
      {result && (
        <div
          className={`p-4 rounded-xl border transition-all text-xs sm:text-sm space-y-2 animate-in fade-in duration-200 ${
            result.is_correct
              ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
              : 'bg-rose-50/90 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            {result.is_correct ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Excellente réponse ! Formule validée.</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>Formule incomplète ou erronée</span>
              </>
            )}
          </div>

          <p className="leading-relaxed">{result.feedback}</p>

          {result.explanation && (
            <div className="pt-2 border-t border-emerald-200/80 text-xs text-emerald-900 leading-relaxed font-medium">
              <span className="font-bold">Analyse du formateur : </span>
              {result.explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

