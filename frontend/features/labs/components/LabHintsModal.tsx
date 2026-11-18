'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { Lightbulb, X, HelpCircle, CheckCircle, Lock } from 'lucide-react';
import { Button } from '@/ui/Button';

interface LabHintsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hints: string[];
  onHintConsulted?: (hintIndex: number) => void;
}

export const LabHintsModal: React.FC<LabHintsModalProps> = ({
  isOpen,
  onClose,
  hints,
  onHintConsulted
}) => {
  const locale = useLocale();
  const isEn = locale === 'en';
  const [unlockedCount, setUnlockedCount] = useState<number>(1);

  if (!isOpen) return null;

  const handleUnlockNext = () => {
    if (unlockedCount < hints.length) {
      const nextIndex = unlockedCount + 1;
      setUnlockedCount(nextIndex);
      onHintConsulted?.(nextIndex - 1);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="hints-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl border border-brand-border shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-amber-50/80 border-b border-amber-200/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 id="hints-modal-title" className="font-bold text-sm text-amber-950 font-heading">
                {isEn ? 'Step-by-Step Workshop Hints' : 'Indices & Pistes de Résolution'}
              </h3>
              <p className="text-[11px] text-amber-800">
                {isEn
                  ? 'Each hint guides you step by step without giving away the full answer immediately.'
                  : 'Chaque indice vous guide étape par étape sans donner immédiatement la solution complète.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={isEn ? 'Close hints modal' : "Fermer la boîte d'indices"}
            className="w-11 h-11 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-amber-900 hover:bg-amber-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hints List */}
        <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
          {hints.map((hintText, index) => {
            const isUnlocked = index < unlockedCount;

            return (
              <div
                key={index}
                className={`p-4 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'bg-amber-50/40 border-amber-200 text-slate-800'
                    : 'bg-slate-50 border-slate-200/80 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    {isUnlocked ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span className="text-amber-900">
                          {isEn ? `Hint ${index + 1} / ${hints.length}` : `Indice ${index + 1} / ${hints.length}`}
                        </span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {isEn ? `Hint ${index + 1} (Locked)` : `Indice ${index + 1} (Verrouillé)`}
                        </span>
                      </>
                    )}
                  </span>

                  {isUnlocked && (
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
                      {isEn ? 'Viewed (-10 pts)' : 'Consulté (-10 pts)'}
                    </span>
                  )}
                </div>

                {isUnlocked ? (
                  <p className="text-xs leading-relaxed text-slate-700 font-medium">
                    {hintText}
                  </p>
                ) : (
                  <p className="text-xs italic text-slate-400">
                    {isEn
                      ? 'Unlock this additional hint if you need a more specific clue.'
                      : "Débloquez cet indice supplémentaire si vous avez besoin d'une piste plus précise."}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer with Unlock Next button */}
        <div className="p-4 bg-slate-50 border-t border-brand-border flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="min-h-[44px] text-xs font-semibold text-brand-muted"
          >
            {isEn ? 'Close' : 'Fermer'}
          </Button>

          {unlockedCount < hints.length ? (
            <Button
              type="button"
              variant="accent"
              onClick={handleUnlockNext}
              className="min-h-[44px] px-4 rounded-xl flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{isEn ? `Unlock Hint ${unlockedCount + 1}` : `Débloquer l'indice ${unlockedCount + 1}`}</span>
            </Button>
          ) : (
            <span className="text-[11px] font-semibold text-emerald-700">
              {isEn ? 'All available hints are unlocked.' : 'Tous les indices disponibles sont débloqués.'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
