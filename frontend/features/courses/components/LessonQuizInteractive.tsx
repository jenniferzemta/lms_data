'use client';

import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Send,
  Loader2,
  Award,
} from 'lucide-react';
import { QuizDetail, QuizAttemptResponse } from '../types';
import { coursesService } from '../services/courses.service';

interface LessonQuizInteractiveProps {
  courseSlug: string;
  lessonSlug: string;
  onQuizPassed?: () => void;
}

const BLOOM_LABELS: Record<string, { label: string; color: string }> = {
  REMEMBER: { label: 'Mémoriser', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  UNDERSTAND: { label: 'Comprendre', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  APPLY: { label: 'Appliquer', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ANALYZE: { label: 'Analyser', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  EVALUATE: { label: 'Évaluer', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  CREATE: { label: 'Créer', color: 'bg-purple-50 text-purple-700 border-purple-200' },
};

export const LessonQuizInteractive: React.FC<LessonQuizInteractiveProps> = ({
  courseSlug,
  lessonSlug,
  onQuizPassed,
}) => {
  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [result, setResult] = useState<QuizAttemptResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setResult(null);
    setAnswers({});
    setErrorMessage(null);

    coursesService
      .getLessonQuiz(courseSlug, lessonSlug)
      .then((data) => {
        if (isMounted) {
          setQuiz(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setQuiz(null);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [courseSlug, lessonSlug]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-center gap-3 text-slate-500 py-12">
        <Loader2 className="w-5 h-5 animate-spin text-[#006b5f]" />
        <span className="text-sm font-medium">Chargement du quiz d&apos;évaluation...</span>
      </div>
    );
  }

  if (!quiz || quiz.questions.length === 0) {
    return null;
  }

  const handleSingleChoiceSelect = (questionId: number, optionId: number) => {
    if (result) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId.toString()]: optionId,
    }));
  };

  const handleMultipleChoiceToggle = (questionId: number, optionId: number) => {
    if (result) return;
    const qKey = questionId.toString();
    const current = Array.isArray(answers[qKey]) ? (answers[qKey] as number[]) : [];
    const updated = current.includes(optionId)
      ? current.filter((id) => id !== optionId)
      : [...current, optionId];
    setAnswers((prev) => ({
      ...prev,
      [qKey]: updated,
    }));
  };

  const handleNumericChange = (questionId: number, value: string) => {
    if (result) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId.toString()]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate that at least one question is answered
    const answeredCount = Object.keys(answers).length;
    if (answeredCount === 0) {
      setErrorMessage('Veuillez répondre aux questions avant de valider.');
      return;
    }

    try {
      setIsSubmitting(true);
      const attemptResponse = await coursesService.submitLessonQuiz(courseSlug, lessonSlug, answers);
      setResult(attemptResponse);
      if (attemptResponse.is_passed && onQuizPassed) {
        onQuizPassed();
      }
    } catch {
      setErrorMessage(
        'Impossible de soumettre le quiz. Assurez-vous d&apos;être connecté à votre compte apprenant.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setAnswers({});
    setErrorMessage(null);
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-6">
      {/* Quiz Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#006b5f]">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base leading-tight">
              {quiz.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Évaluation formative • Seuil de validation : {quiz.passing_score_percentage}%
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <Award className="w-3.5 h-3.5 text-emerald-600" />
          {quiz.total_questions} question{quiz.total_questions > 1 ? 's' : ''}
        </span>
      </div>

      {quiz.description && (
        <p className="text-xs sm:text-sm text-slate-600 my-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
          {quiz.description}
        </p>
      )}

      {/* Result Summary Banner */}
      {result && (
        <div
          className={`my-5 p-4 rounded-xl border ${
            result.is_passed
              ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
              : 'bg-amber-50/90 border-amber-300 text-amber-950'
          }`}
        >
          <div className="flex items-start gap-3">
            {result.is_passed ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold text-sm sm:text-base">
                  {result.is_passed
                    ? 'Félicitations ! Objectif atteint'
                    : 'Tentative terminée — Besoin de révision'}
                </h4>
                <span className="text-base sm:text-lg font-black tracking-tight">
                  {result.score_percentage}%
                </span>
              </div>
              <p className="text-xs sm:text-sm mt-1 leading-relaxed opacity-90">
                {result.is_passed
                  ? `Vous avez obtenu ${result.score_percentage}%, dépassant le seuil requis de ${quiz.passing_score_percentage}%. Votre progression a été enregistrée avec succès.`
                  : `Score obtenu : ${result.score_percentage}% (seuil minimal : ${quiz.passing_score_percentage}%). Examinez attentivement les explications ci-dessous avant de retenter.`}
              </p>
              {!result.is_passed && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition shadow-sm min-h-[44px]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Recommencer le quiz
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="my-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Questions Form */}
      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        {quiz.questions.map((q, idx) => {
          const feedback = result?.feedback_summary.find(
            (f) => f.question_id === q.id
          );
          const bloom = BLOOM_LABELS[q.bloom_level] || {
            label: q.bloom_level,
            color: 'bg-slate-100 text-slate-700 border-slate-200',
          };

          return (
            <div
              key={q.id}
              className={`p-4 rounded-xl border transition-all ${
                feedback
                  ? feedback.is_correct
                    ? 'bg-emerald-50/30 border-emerald-200'
                    : 'bg-rose-50/30 border-rose-200'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Question Header & Bloom Tag */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-slate-400">
                  Question {idx + 1} / {quiz.questions.length}
                </span>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${bloom.color}`}
                >
                  {bloom.label}
                </span>
              </div>

              {/* Prompt */}
              <h4 className="text-sm font-semibold text-slate-900 leading-snug mb-3">
                {q.prompt}
              </h4>

              {/* Options by Question Type */}
              {(q.question_type === 'SINGLE_CHOICE' ||
                q.question_type === 'TRUE_FALSE') && (
                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const isSelected =
                      answers[q.id.toString()] === opt.id;

                    return (
                      <label
                        key={opt.id}
                        onClick={() => handleSingleChoiceSelect(q.id, opt.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-xs sm:text-sm cursor-pointer transition min-h-[44px] ${
                          isSelected
                            ? 'bg-teal-50 border-[#006b5f] text-teal-950 font-medium ring-1 ring-[#006b5f]/30'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                        } ${result ? 'pointer-events-none opacity-90' : ''}`}
                      >
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={opt.id}
                          checked={isSelected}
                          onChange={() => handleSingleChoiceSelect(q.id, opt.id)}
                          disabled={!!result}
                          className="w-4 h-4 text-[#006b5f] focus:ring-[#006b5f] border-slate-300"
                        />
                        <span className="flex-1 leading-relaxed">{opt.text}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {q.question_type === 'MULTIPLE_CHOICE' && (
                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const currentArr = Array.isArray(answers[q.id.toString()])
                      ? (answers[q.id.toString()] as number[])
                      : [];
                    const isChecked = currentArr.includes(opt.id);

                    return (
                      <label
                        key={opt.id}
                        onClick={() => handleMultipleChoiceToggle(q.id, opt.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-xs sm:text-sm cursor-pointer transition min-h-[44px] ${
                          isChecked
                            ? 'bg-teal-50 border-[#006b5f] text-teal-950 font-medium ring-1 ring-[#006b5f]/30'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                        } ${result ? 'pointer-events-none opacity-90' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleMultipleChoiceToggle(q.id, opt.id)}
                          disabled={!!result}
                          className="w-4 h-4 rounded text-[#006b5f] focus:ring-[#006b5f] border-slate-300"
                        />
                        <span className="flex-1 leading-relaxed">{opt.text}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {q.question_type === 'NUMERIC' && (
                <div className="mt-2">
                  <div className="relative max-w-xs">
                    <input
                      type="text"
                      inputMode="decimal"
                      disabled={!!result}
                      placeholder="Ex: 3 460 000"
                      value={(answers[q.id.toString()] as string) || ''}
                      onChange={(e) => handleNumericChange(q.id, e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-[#006b5f]/30 min-h-[44px] ${
                        result ? 'bg-slate-100 text-slate-600' : 'bg-white border-slate-300'
                      }`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      FCFA
                    </span>
                  </div>
                </div>
              )}

              {/* Formative Feedback Card */}
              {feedback && (
                <div
                  className={`mt-3.5 p-3 rounded-lg border text-xs leading-relaxed ${
                    feedback.is_correct
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50/80 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    {feedback.is_correct ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Bonne réponse !</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Réponse incorrecte</span>
                      </>
                    )}
                  </div>

                  {!feedback.is_correct && feedback.correct_answer && (
                    <p className="mb-1 font-medium text-slate-700">
                      Réponse attendue :{' '}
                      <span className="font-bold text-slate-900">
                        {feedback.correct_answer}
                      </span>
                    </p>
                  )}

                  <p className="text-slate-600 italic mt-1 border-t border-slate-200/50 pt-1.5">
                    💡 <span className="font-semibold not-italic">Explication :</span> {feedback.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {/* Submit Actions */}
        {!result && (
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#006b5f] text-white rounded-xl text-sm font-bold hover:bg-[#005249] transition shadow-sm disabled:opacity-50 min-h-[44px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Évaluation en cours...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Valider mes réponses
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </section>
  );
};
