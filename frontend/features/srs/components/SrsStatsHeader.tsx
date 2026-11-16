'use client';

import React from 'react';
import { SrsMetrics, FlashcardCategory } from '../types';
import { Flame, CheckCircle, Brain, Calendar } from 'lucide-react';

interface SrsStatsHeaderProps {
  metrics: SrsMetrics;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

const CATEGORIES: { id: string; label: string }[] = [
  { id: 'ALL', label: 'Toutes' },
  { id: 'SQL', label: 'SQL' },
  { id: 'PYTHON', label: 'Python' },
  { id: 'EXCEL', label: 'Excel' },
  { id: 'POWERBI', label: 'Power BI' },
  { id: 'CONCEPT', label: 'Concepts' },
];

export const SrsStatsHeader: React.FC<SrsStatsHeaderProps> = ({
  metrics,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-4">
      {/* Title & Micro-Learning badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Révision Flash (SM-2)
            </h1>
            <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Série {metrics.streak_days}j
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Micro-séances de 3 minutes ancrées dans la mémoire long terme grâce à l&apos;algorithme SuperMemo-2.
          </p>
        </div>

        {/* Global Progress pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <Brain className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Rétention : <strong className="text-brand-600 dark:text-brand-400">{metrics.retention_rate}%</strong>
          </span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-brand-50/60 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900/40 rounded-xl p-2.5 sm:p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-brand-700 dark:text-brand-400 text-xs font-medium mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>À revoir</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-brand-900 dark:text-brand-200">
            {metrics.due_today}
          </div>
        </div>

        <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-2.5 sm:p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-emerald-700 dark:text-emerald-400 text-xs font-medium mb-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Maîtrisées</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-900 dark:text-emerald-200">
            {metrics.mastered_cards}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 sm:p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-slate-600 dark:text-slate-400 text-xs font-medium mb-1">
            <Brain className="w-3.5 h-3.5" />
            <span>Total Deck</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {metrics.total_cards}
          </div>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all min-h-[36px] ${
                isSelected
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
