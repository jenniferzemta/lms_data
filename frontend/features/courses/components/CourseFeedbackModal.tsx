'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Star, X, CheckCircle2, MessageSquareHeart, Sparkles } from 'lucide-react';
import { coursesService } from '../services/courses.service';
import { DifficultyLevel, PaceRating } from '../types';

interface CourseFeedbackModalProps {
  courseSlug: string;
  courseTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export const CourseFeedbackModal: React.FC<CourseFeedbackModalProps> = ({
  courseSlug,
  courseTitle,
  isOpen,
  onClose,
  onSubmitted,
}) => {
  const t = useTranslations('Feedback');

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const [clarityRating, setClarityRating] = useState<number>(5);
  const [usefulnessRating, setUsefulnessRating] = useState<number>(5);

  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>('BALANCED');
  const [paceRating, setPaceRating] = useState<PaceRating>('BALANCED');
  const [recommendScore, setRecommendScore] = useState<number>(10);

  const [strengths, setStrengths] = useState<string>('');
  const [improvements, setImprovements] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [isPublicConsent, setIsPublicConsent] = useState<boolean>(true);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load existing feedback if any
  useEffect(() => {
    if (isOpen && courseSlug) {
      coursesService.getMyCourseFeedback(courseSlug).then((res) => {
        if (res.has_feedback && res.feedback) {
          const f = res.feedback;
          setRating(f.rating);
          setClarityRating(f.clarity_rating);
          setUsefulnessRating(f.usefulness_rating);
          setDifficultyLevel(f.difficulty_level);
          setPaceRating(f.pace_rating);
          setRecommendScore(f.recommend_score);
          setStrengths(f.strengths || '');
          setImprovements(f.improvements || '');
          setComment(f.comment || '');
          setIsPublicConsent(f.is_public_testimonial);
        }
      });
    }
  }, [isOpen, courseSlug]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await coursesService.submitCourseFeedback(courseSlug, {
        rating,
        clarity_rating: clarityRating,
        usefulness_rating: usefulnessRating,
        difficulty_level: difficultyLevel,
        pace_rating: paceRating,
        recommend_score: recommendScore,
        strengths,
        improvements,
        comment,
        is_public_testimonial: isPublicConsent,
      });

      setIsSuccess(true);
      if (onSubmitted) {
        onSubmitted();
      }
    } catch {
      setErrorMessage("Une erreur est survenue lors de l'enregistrement de votre avis. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-brand-border overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-brand-border bg-brand-canvas shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center shrink-0">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div>
              <h2 id="feedback-modal-title" className="text-base sm:text-lg font-bold text-brand-primary">
                {t('title')}
              </h2>
              <p className="text-[11px] sm:text-xs text-brand-muted truncate max-w-xs sm:max-w-md">
                {courseTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label={t('close')}
            className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-brand-primary">
                {t('successTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
                {t('successSubtitle')}
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[44px] px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold text-sm transition shadow-xs"
                >
                  {t('close')}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-xs text-brand-muted leading-relaxed">
                {t('subtitle')}
              </p>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* 1. Note globale (Étoiles interactives) */}
              <div className="p-3.5 rounded-xl bg-brand-canvas-alt border border-brand-border/60 space-y-2">
                <label className="text-xs font-bold text-brand-primary block">
                  {t('globalRating')} *
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isActive = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition active:scale-95"
                        aria-label={`${star} étoiles`}
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            isActive
                              ? 'text-amber-400 fill-amber-400 drop-shadow-2xs'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="text-xs font-bold text-amber-700 ml-2">
                    {rating}/5
                  </span>
                </div>
              </div>

              {/* 2. Évaluations secondaires (Clarté & Utilité locale FCFA) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-brand-border space-y-1.5">
                  <label className="text-xs font-medium text-brand-primary block">
                    {t('clarityRating')}
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setClarityRating(star)}
                        className="min-h-[44px] min-w-[36px] flex items-center justify-center rounded transition"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            clarityRating >= star
                              ? 'text-brand-teal fill-brand-teal'
                              : 'text-slate-200'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-semibold text-brand-primary ml-1">
                      {clarityRating}/5
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-brand-border space-y-1.5">
                  <label className="text-xs font-medium text-brand-primary block">
                    {t('usefulnessRating')}
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUsefulnessRating(star)}
                        className="min-h-[44px] min-w-[36px] flex items-center justify-center rounded transition"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            usefulnessRating >= star
                              ? 'text-brand-teal fill-brand-teal'
                              : 'text-slate-200'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-semibold text-brand-primary ml-1">
                      {usefulnessRating}/5
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Difficulté & Rythme (Segmented Controls) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-brand-primary block">
                    {t('difficultyTitle')}
                  </label>
                  <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl">
                    {(['TOO_EASY', 'BALANCED', 'TOO_HARD'] as DifficultyLevel[]).map((level) => {
                      const labelKey = level === 'TOO_EASY' ? 'diffTooEasy' : level === 'BALANCED' ? 'diffBalanced' : 'diffTooHard';
                      const isSelected = difficultyLevel === level;
                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setDifficultyLevel(level)}
                          className={`min-h-[44px] text-[11px] font-semibold rounded-lg transition ${
                            isSelected
                              ? 'bg-white text-brand-primary shadow-2xs font-bold'
                              : 'text-brand-muted hover:text-brand-primary'
                          }`}
                        >
                          {t(labelKey)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-brand-primary block">
                    {t('paceTitle')}
                  </label>
                  <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl">
                    {(['TOO_SLOW', 'BALANCED', 'TOO_FAST'] as PaceRating[]).map((pace) => {
                      const labelKey = pace === 'TOO_SLOW' ? 'paceTooSlow' : pace === 'BALANCED' ? 'paceBalanced' : 'paceTooFast';
                      const isSelected = paceRating === pace;
                      return (
                        <button
                          key={pace}
                          type="button"
                          onClick={() => setPaceRating(pace)}
                          className={`min-h-[44px] text-[11px] font-semibold rounded-lg transition ${
                            isSelected
                              ? 'bg-white text-brand-primary shadow-2xs font-bold'
                              : 'text-brand-muted hover:text-brand-primary'
                          }`}
                        >
                          {t(labelKey)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 4. Score de recommandation NPS (1 à 10) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-brand-primary">
                    {t('recommendTitle')}
                  </label>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-50 text-brand-teal">
                    {recommendScore}/10
                  </span>
                </div>
                <div className="grid grid-cols-10 gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                    const isSelected = recommendScore === num;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRecommendScore(num)}
                        className={`min-h-[44px] rounded-lg text-xs font-bold transition ${
                          isSelected
                            ? 'bg-brand-teal text-white shadow-xs scale-105'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Points forts & Axes d'amélioration (Qualitatif ADDIE) */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brand-primary block">
                    {t('strengthsLabel')}
                  </label>
                  <textarea
                    rows={2}
                    value={strengths}
                    onChange={(e) => setStrengths(e.target.value)}
                    placeholder={t('strengthsPlaceholder')}
                    className="w-full text-xs p-2.5 rounded-xl border border-brand-border focus:border-brand-teal focus:ring-1 focus:ring-brand-teal outline-hidden bg-brand-canvas-alt"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brand-primary block">
                    {t('improvementsLabel')}
                  </label>
                  <textarea
                    rows={2}
                    value={improvements}
                    onChange={(e) => setImprovements(e.target.value)}
                    placeholder={t('improvementsPlaceholder')}
                    className="w-full text-xs p-2.5 rounded-xl border border-brand-border focus:border-brand-teal focus:ring-1 focus:ring-brand-teal outline-hidden bg-brand-canvas-alt"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brand-primary block">
                    {t('commentLabel')}
                  </label>
                  <textarea
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t('commentPlaceholder')}
                    className="w-full text-xs p-2.5 rounded-xl border border-brand-border focus:border-brand-teal focus:ring-1 focus:ring-brand-teal outline-hidden bg-brand-canvas-alt"
                  />
                </div>
              </div>

              {/* 6. Consentement public */}
              <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isPublicConsent}
                  onChange={(e) => setIsPublicConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-brand-border text-brand-teal focus:ring-brand-teal"
                />
                <span className="text-[11px] text-brand-muted leading-tight">
                  {t('publicConsent')}
                </span>
              </label>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[48px] rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold text-sm flex items-center justify-center gap-2 transition shadow-xs active:scale-[0.99] disabled:opacity-60"
                >
                  <Sparkles className="w-4 h-4 text-brand-teal" />
                  <span>{isSubmitting ? t('submitting') : t('submitAction')}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

