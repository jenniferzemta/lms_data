'use client';

import React, { useState } from 'react';
import { FlashcardItem, ReviewQuality } from '../types';
import {
  RotateCcw,
  Lightbulb,
  Check,
  Copy,
  Sparkles,
  ArrowRight,
  Trophy,
  Code2,
  HelpCircle,
} from 'lucide-react';

interface FlashcardReviewSessionProps {
  cards: FlashcardItem[];
  onReviewSubmit: (cardId: number, quality: ReviewQuality) => Promise<void>;
  onRestartSession: () => void;
}

export const FlashcardReviewSession: React.FC<FlashcardReviewSessionProps> = ({
  cards,
  onReviewSubmit,
  onRestartSession,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);

  const activeCard = cards[currentIndex];
  const isCompleted = currentIndex >= cards.length || cards.length === 0;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleCopyCode = (snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRating = async (quality: ReviewQuality) => {
    if (isSubmitting || !activeCard) return;
    setIsSubmitting(true);

    try {
      await onReviewSubmit(activeCard.id, quality);
      setReviewedCount(prev => prev + 1);
      setEarnedXp(prev => prev + (quality >= 3 ? 5 : 2));

      // Reset state for next card
      setIsFlipped(false);
      setShowHint(false);
      setCurrentIndex(prev => prev + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Completion screen
  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center p-6 sm:p-10 text-center max-w-lg mx-auto min-h-[400px]">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mb-5 text-emerald-600 dark:text-emerald-400 animate-bounce">
          <Trophy className="w-10 h-10" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Micro-Session Terminée !
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
          Toutes les cartes programmées pour aujourd&apos;hui ont été révisées. L&apos;algorithme SM-2 a ajusté leurs intervalles de rétention.
        </p>

        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 w-full mb-6 flex justify-around">
          <div>
            <span className="block text-xs text-slate-500 dark:text-slate-400">Cartes révisées</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">{reviewedCount}</span>
          </div>
          <div className="border-r border-slate-200 dark:border-slate-700" />
          <div>
            <span className="block text-xs text-slate-500 dark:text-slate-400">XP Gagnés</span>
            <span className="text-xl font-bold text-amber-600 dark:text-amber-400">+{earnedXp} XP</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={onRestartSession}
            className="flex-1 min-h-[48px] px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Recommencer une séance
          </button>
          <a
            href="/courses"
            className="flex-1 min-h-[48px] px-4 py-2.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors"
          >
            Retour aux cours
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  const categoryColorMap: Record<string, string> = {
    SQL: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900/40',
    PYTHON: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/40',
    EXCEL: 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-900/40',
    POWERBI: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900/40',
    CONCEPT: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-900/40',
  };

  const difficultyColorMap: Record<string, string> = {
    BEGINNER: 'text-emerald-600 dark:text-emerald-400',
    INTERMEDIATE: 'text-amber-600 dark:text-amber-400',
    ADVANCED: 'text-rose-600 dark:text-rose-400',
  };

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 space-y-4">
      {/* Progress Counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Carte {currentIndex + 1} sur {cards.length}</span>
        <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>+{earnedXp} XP</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-600 transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* Main Flashcard Container */}
      <div
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            handleFlip();
          }
        }}
        className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700/60 rounded-2xl p-5 sm:p-7 shadow-sm transition-all duration-200 cursor-pointer min-h-[300px] flex flex-col justify-between relative group select-none"
      >
        {/* Card Header: Category & Difficulty */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryColorMap[activeCard.category] || 'bg-slate-100 text-slate-800'}`}>
              {activeCard.category_display || activeCard.category}
            </span>
            <span className={`text-xs font-medium ${difficultyColorMap[activeCard.difficulty] || 'text-slate-500'}`}>
              {activeCard.difficulty_display || activeCard.difficulty}
            </span>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-300" />
            <span>{isFlipped ? 'Réponse' : 'Question'}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="my-auto py-2">
          {!isFlipped ? (
            /* FRONT: Question */
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                {activeCard.question}
              </h3>

              {activeCard.hint && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHint(!showHint);
                  }}
                  className="mt-3 p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 rounded-xl cursor-pointer hover:bg-amber-100/50 transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-300">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>{showHint ? 'Masquer l’indice' : 'Afficher un indice'}</span>
                  </div>
                  {showHint && (
                    <p className="text-xs text-amber-900 dark:text-amber-200 mt-1 pl-6">
                      {activeCard.hint}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* BACK: Answer & Snippet */
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-base text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {activeCard.answer}
              </div>

              {activeCard.code_snippet && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="relative bg-slate-950 text-slate-100 rounded-xl p-3 sm:p-4 text-xs font-mono overflow-x-auto border border-slate-800 group/code"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5 font-sans">
                      <Code2 className="w-3.5 h-3.5 text-brand-400" />
                      Extrait illustratif
                    </span>
                    <button
                      onClick={() => handleCopyCode(activeCard.code_snippet!)}
                      className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] transition-colors"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copié' : 'Copier'}</span>
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap">{activeCard.code_snippet}</pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card Footer prompt */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400">
          {!isFlipped ? (
            <span className="flex items-center justify-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              Touchez la carte pour révéler la réponse
            </span>
          ) : (
            <span>Évaluez votre souvenir ci-dessous pour planifier la prochaine révision</span>
          )}
        </div>
      </div>

      {/* Action Rating Bar (Visible when flipped) */}
      {isFlipped ? (
        <div className="space-y-2 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Comment vous en souveniez-vous ?
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => handleRating(1)}
              disabled={isSubmitting}
              className="min-h-[48px] p-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/70 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-0.5 transition-colors disabled:opacity-50"
            >
              <span>1 • Oublié</span>
              <span className="text-[10px] text-rose-500 dark:text-rose-400 font-normal">Revoir de suite</span>
            </button>

            <button
              onClick={() => handleRating(3)}
              disabled={isSubmitting}
              className="min-h-[48px] p-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-950/70 border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-300 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-0.5 transition-colors disabled:opacity-50"
            >
              <span>3 • Difficile</span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">+1 jour</span>
            </button>

            <button
              onClick={() => handleRating(4)}
              disabled={isSubmitting}
              className="min-h-[48px] p-2 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-950/70 border border-teal-200 dark:border-teal-900/50 text-teal-700 dark:text-teal-300 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-0.5 transition-colors disabled:opacity-50"
            >
              <span>4 • Bon</span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-normal">+3 à 6 jours</span>
            </button>

            <button
              onClick={() => handleRating(5)}
              disabled={isSubmitting}
              className="min-h-[48px] p-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-0.5 transition-colors disabled:opacity-50"
            >
              <span>5 • Facile</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">+10 à 21 jours</span>
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleFlip}
          className="w-full min-h-[48px] bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Révéler la réponse (Espace)
        </button>
      )}
    </div>
  );
};
