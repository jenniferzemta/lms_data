'use client';

import React, { useState } from 'react';
import { SQL_MICROFINANCE_EXERCISES } from '../data/sampleExercises';
import { LabShell } from './LabShell';
import { Database, CheckCircle } from 'lucide-react';

interface SqlLabViewProps {
  initialExerciseId?: string;
  onAllCompleted?: () => void;
}

export const SqlLabView: React.FC<SqlLabViewProps> = ({
  initialExerciseId,
  onAllCompleted
}) => {
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number>(() => {
    if (initialExerciseId) {
      const idx = SQL_MICROFINANCE_EXERCISES.findIndex((e) => e.id === initialExerciseId || e.slug === initialExerciseId);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const [completedExercises, setCompletedExercises] = useState<Record<string, number>>({});

  const currentExercise = SQL_MICROFINANCE_EXERCISES[selectedExerciseIndex];
  const hasNext = selectedExerciseIndex < SQL_MICROFINANCE_EXERCISES.length - 1;

  const handleExerciseComplete = (score: number) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [currentExercise.id]: score
    }));

    if (Object.keys(completedExercises).length + 1 >= SQL_MICROFINANCE_EXERCISES.length) {
      onAllCompleted?.();
    }
  };

  const handleNextExercise = () => {
    if (hasNext) {
      setSelectedExerciseIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Exercise Navigation Pill Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted shrink-0 flex items-center gap-1.5 pl-1">
          <Database className="w-3.5 h-3.5 text-brand-teal" />
          <span>Ateliers SQL :</span>
        </span>

        {SQL_MICROFINANCE_EXERCISES.map((ex, idx) => {
          const isCurrent = idx === selectedExerciseIndex;
          const isDone = completedExercises[ex.id] !== undefined;

          return (
            <button
              key={ex.id}
              type="button"
              onClick={() => setSelectedExerciseIndex(idx)}
              className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 border ${
                isCurrent
                  ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                  : isDone
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-white text-slate-700 border-brand-border hover:bg-slate-50'
              }`}
            >
              {isDone ? (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              ) : (
                <span className="w-5 h-5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
              )}
              <span className="truncate max-w-[140px] sm:max-w-xs">{ex.title.split(':')[1]?.trim() || ex.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main LabShell Component */}
      <LabShell
        exercise={currentExercise}
        onExerciseComplete={handleExerciseComplete}
        onNextExercise={handleNextExercise}
        hasNextExercise={hasNext}
      />
    </div>
  );
};

