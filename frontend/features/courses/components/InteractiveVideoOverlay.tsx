'use client';

import React, { useState } from 'react';
import { VideoCheckpointQuestion } from '../types';
import { HelpCircle, CheckCircle2, AlertCircle, Play, Sparkles } from 'lucide-react';
import { Button } from '@/ui/Button';

interface InteractiveVideoOverlayProps {
  checkpoint: VideoCheckpointQuestion;
  onAnswerSubmitted: (isCorrect: boolean) => void;
  onResumeVideo: () => void;
}

export const InteractiveVideoOverlay: React.FC<InteractiveVideoOverlayProps> = ({
  checkpoint,
  onAnswerSubmitted,
  onResumeVideo
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [hasEvaluated, setHasEvaluated] = useState<boolean>(false);

  const selectedOption = checkpoint.options.find((o) => o.id === selectedOptionId);
  const isCorrect = Boolean(selectedOption?.isCorrect);

  const handleSubmit = () => {
    if (!selectedOptionId) return;
    setHasEvaluated(true);
    setIsAnswered(true);
    onAnswerSubmitted(isCorrect);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-quiz-title"
      className="absolute inset-0 z-30 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-sm animate-in fade-in select-none"
    >
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-4 sm:p-6 shadow-2xl text-white flex flex-col max-h-full overflow-y-auto">
        {/* Header Tag */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-teal/20 text-brand-teal flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              Quiz Incrusté en Direct ({checkpoint.title})
            </span>
          </div>

          <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
            Vidéo en pause
          </span>
        </div>

        {/* Question Statement */}
        <h3
          id="video-quiz-title"
          className="text-sm sm:text-base font-bold text-slate-100 font-heading leading-snug mb-3.5"
        >
          {checkpoint.question}
        </h3>

        {/* Answer Options */}
        <div className="space-y-2 mb-4">
          {checkpoint.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            let optionStyles = 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700';

            if (hasEvaluated) {
              if (option.isCorrect) {
                optionStyles = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
              } else if (isSelected && !option.isCorrect) {
                optionStyles = 'bg-rose-950/80 border-rose-500 text-rose-200';
              } else {
                optionStyles = 'opacity-50 bg-slate-800/50 border-slate-700 text-slate-400';
              }
            } else if (isSelected) {
              optionStyles = 'bg-emerald-900/40 border-emerald-500 text-white ring-1 ring-emerald-500/50';
            }

            return (
              <button
                key={option.id}
                type="button"
                disabled={hasEvaluated}
                onClick={() => setSelectedOptionId(option.id)}
                className={`w-full min-h-[44px] p-3 rounded-xl border text-left text-xs sm:text-sm font-medium flex items-center justify-between gap-3 transition-all active:scale-[0.99] ${optionStyles}`}
              >
                <span>{option.text}</span>
                {hasEvaluated && option.isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                {hasEvaluated && isSelected && !option.isCorrect && (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Alert */}
        {hasEvaluated && (
          <div
            role="status"
            className={`p-3 rounded-xl mb-4 text-xs leading-relaxed border ${
              isCorrect
                ? 'bg-emerald-950/60 border-emerald-600/70 text-emerald-200'
                : 'bg-amber-950/60 border-amber-600/70 text-amber-200'
            }`}
          >
            <div className="flex items-start gap-2">
              {isCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold block mb-0.5">
                  {isCorrect ? 'Exactement !' : 'Explication pédagogique :'}
                </span>
                <span>{checkpoint.explanation}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-end gap-2 mt-auto pt-2 border-t border-slate-800">
          {!hasEvaluated ? (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedOptionId}
              variant="primary"
              className="min-h-[44px] px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs"
            >
              <span>Valider ma réponse</span>
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onResumeVideo}
              variant="primary"
              className="min-h-[44px] px-5 rounded-xl bg-brand-primary text-white font-bold text-xs flex items-center gap-2 shadow-xs hover:bg-brand-primary-dark"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Reprendre la vidéo</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

