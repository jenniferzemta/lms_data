'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { SAMPLE_POWERBI_EXERCISES } from '../data/powerBiDataset';
import { PowerBiLabEngine, PowerBiLabState } from '../engines/PowerBiLabEngine';
import { PowerBiLabView } from './PowerBiLabView';
import { LabHintsModal } from './LabHintsModal';
import { LabResult } from '../types';
import { coursesService } from '@/features/courses';
import {
  PieChart,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Download,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface PowerBiLabContainerProps {
  initialExerciseId?: string;
  onAllCompleted?: () => void;
}

type MobileTab = 'instructions' | 'report' | 'results';

export const PowerBiLabContainer: React.FC<PowerBiLabContainerProps> = ({
  initialExerciseId,
  onAllCompleted,
}) => {
  const engine = useMemo(() => new PowerBiLabEngine(), []);

  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number>(() => {
    if (initialExerciseId) {
      const idx = SAMPLE_POWERBI_EXERCISES.findIndex(
        (e) => e.id === initialExerciseId || e.slug === initialExerciseId
      );
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const exercise = SAMPLE_POWERBI_EXERCISES[selectedExerciseIndex];
  const hasNext = selectedExerciseIndex < SAMPLE_POWERBI_EXERCISES.length - 1;

  const [labState, setLabState] = useState<PowerBiLabState | null>(null);
  const [validationResult, setValidationResult] = useState<LabResult | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isHintsModalOpen, setIsHintsModalOpen] = useState<boolean>(false);
  const [consultedHintsCount, setConsultedHintsCount] = useState<number>(0);
  const [mobileTab, setMobileTab] = useState<MobileTab>('report');

  // Load exercise
  useEffect(() => {
    engine.load(exercise).then((loaded) => {
      setLabState(loaded);
      setValidationResult(null);
      setConsultedHintsCount(0);
    });
  }, [engine, exercise]);

  // Validation
  const handleValidate = useCallback(async () => {
    if (!labState) return;
    setIsValidating(true);
    try {
      const res = await engine.check(labState, exercise.rules);
      setValidationResult(res);

      if (res.isSuccess) {
        // Emit xAPI event
        try {
          await coursesService.recordLearningEvent({
            verb: 'completed',
            object_id: `http://datamboa.cm/labs/powerbi/${exercise.slug}`,
            object_type: 'laboratory',
            object_name: `Laboratoire Power BI & DAX — ${exercise.title}`,
            success: true,
            score_scaled: res.score / 100,
          });
        } catch {
          // Ignore event error
        }
      }
    } finally {
      setIsValidating(false);
    }
  }, [engine, labState, exercise]);

  const handleNextExercise = () => {
    if (hasNext) {
      setSelectedExerciseIndex((prev) => prev + 1);
    } else if (onAllCompleted) {
      onAllCompleted();
    }
  };

  const handleExport = async () => {
    if (!labState) return;
    const blob = await engine.export(labState);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Mesures_DAX_${exercise.slug}.dax`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!labState) {
    return <div className="p-12 text-center text-slate-400">Initialisation du moteur DAX...</div>;
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Header */}
      <header className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold text-xs flex items-center gap-1">
              <PieChart className="w-3.5 h-3.5" />
              Laboratoire Power BI & DAX
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">
              Kamer Boissons SARL (FCFA)
            </span>
          </div>

          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {exercise.title}
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Workshop selector */}
          <select
            value={selectedExerciseIndex}
            onChange={(e) => setSelectedExerciseIndex(Number(e.target.value))}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 outline-hidden min-h-[40px]"
          >
            {SAMPLE_POWERBI_EXERCISES.map((ex, idx) => (
              <option key={ex.id} value={idx}>
                {ex.title}
              </option>
            ))}
          </select>

          {/* Hints Button */}
          <button
            onClick={() => setIsHintsModalOpen(true)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 min-h-[40px]"
          >
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Indices ({consultedHintsCount}/{exercise.hints.length})</span>
          </button>

          {/* Export DAX */}
          <button
            onClick={handleExport}
            className="p-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs flex items-center justify-center min-h-[40px] min-w-[40px]"
            title="Exporter les mesures DAX (.dax)"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Run & Validate Check */}
          <button
            onClick={handleValidate}
            disabled={isValidating}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs min-h-[40px]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Valider l&apos;atelier</span>
          </button>
        </div>
      </header>

      {/* Mobile Tabs Switcher */}
      <div className="lg:hidden flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
        <button
          onClick={() => setMobileTab('instructions')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg ${
            mobileTab === 'instructions' ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs' : 'text-slate-500'
          }`}
        >
          Consignes
        </button>
        <button
          onClick={() => setMobileTab('report')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg ${
            mobileTab === 'report' ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs' : 'text-slate-500'
          }`}
        >
          Rapport & DAX
        </button>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Left Column (4 cols): Context & Instructions */}
        <div className={`lg:col-span-4 space-y-4 ${mobileTab === 'instructions' ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-brand-600" />
              Consigne de l&apos;atelier
            </h3>
            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
              {exercise.instruction}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
              {exercise.context}
            </p>
          </div>

          {/* Validation Result Box */}
          {validationResult && (
            <div
              className={`p-4 rounded-2xl border ${
                validationResult.isSuccess
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {validationResult.isSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                )}
                <span className="font-bold text-sm">
                  {validationResult.isSuccess ? 'Atelier Validé !' : 'Des critères manquent'}
                </span>
                <span className="ml-auto font-black text-sm">{validationResult.score}/100</span>
              </div>

              <p className="text-xs mb-3">{validationResult.message}</p>

              {/* Criteria details */}
              <ul className="space-y-1.5 text-xs">
                {validationResult.details.map((det) => (
                  <li key={det.ruleId} className="flex items-center gap-1.5">
                    <span>{det.passed ? '✓' : '✗'}</span>
                    <span className={det.passed ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}>
                      {det.description}
                    </span>
                  </li>
                ))}
              </ul>

              {validationResult.isSuccess && hasNext && (
                <button
                  onClick={handleNextExercise}
                  className="w-full mt-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors min-h-[40px]"
                >
                  <span>Passer à l&apos;atelier suivant</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Column (8 cols): Power BI Canvas View */}
        <div className={`lg:col-span-8 ${mobileTab === 'report' ? 'block' : 'hidden lg:block'}`}>
          <PowerBiLabView
            state={labState}
            engine={engine}
            onStateChange={setLabState}
          />
        </div>
      </div>

      {/* Hints Modal */}
      <LabHintsModal
        isOpen={isHintsModalOpen}
        onClose={() => setIsHintsModalOpen(false)}
        hints={exercise.hints}
        onHintConsulted={() => setConsultedHintsCount((prev) => prev + 1)}
      />
    </div>
  );
};
