'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PYTHON_PANDAS_EXERCISES } from '../data/samplePythonExercises';
import { PythonLabEngine } from '../engines/PythonLabEngine';
import { PythonEditor } from './PythonEditor';
import { PythonConsoleOutput } from './PythonConsoleOutput';
import { PythonDatasetExplorer } from './PythonDatasetExplorer';
import { LabHintsModal } from './LabHintsModal';
import { LabResult, PythonExecutionResult, PythonLabState } from '../types';
import { Badge } from '@/ui/Badge';
import { Button } from '@/ui/Button';
import { coursesService } from '@/features/courses';
import {
  FileCode,
  Terminal,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Download,
  Upload,
  Save,
  Check,
  ChevronRight,
  Layers,
  Database
} from 'lucide-react';

interface PythonLabViewProps {
  initialExerciseId?: string;
  onAllCompleted?: () => void;
}

type MobileTab = 'instructions' | 'editor' | 'results';

export const PythonLabView: React.FC<PythonLabViewProps> = ({
  initialExerciseId,
  onAllCompleted
}) => {
  const engine = useMemo(() => new PythonLabEngine(), []);

  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number>(() => {
    if (initialExerciseId) {
      const idx = PYTHON_PANDAS_EXERCISES.findIndex(
        (e) => e.id === initialExerciseId || e.slug === initialExerciseId
      );
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const exercise = PYTHON_PANDAS_EXERCISES[selectedExerciseIndex];
  const hasNext = selectedExerciseIndex < PYTHON_PANDAS_EXERCISES.length - 1;

  // Lab State
  const [code, setCode] = useState<string>(exercise.initialCode);
  const [executionResult, setExecutionResult] = useState<PythonExecutionResult | null>(null);
  const [validationResult, setValidationResult] = useState<LabResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isHintsModalOpen, setIsHintsModalOpen] = useState<boolean>(false);
  const [consultedHintsCount, setConsultedHintsCount] = useState<number>(0);
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<number | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('editor');
  const [completedExercises, setCompletedExercises] = useState<Record<string, number>>({});

  // Reset/Load when changing exercise
  useEffect(() => {
    let isMounted = true;
    engine.load(exercise).then((state) => {
      if (isMounted) {
        setCode(state.code);
        setExecutionResult(null);
        setValidationResult(null);
        setConsultedHintsCount(0);
        setLastSavedTimestamp(Date.now());
      }
    });

    return () => {
      isMounted = false;
    };
  }, [exercise, engine]);

  // Auto-save debounce
  useEffect(() => {
    if (!code) return;
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const snapshot = engine.serialize({
          code,
          history: [],
          lastResult: executionResult,
          activeExercise: exercise
        });
        localStorage.setItem(`datamboa_lab_python_${exercise.id}`, JSON.stringify(snapshot));
        setLastSavedTimestamp(Date.now());
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [code, exercise, engine, executionResult]);

  // Execute Python Code
  const handleExecute = useCallback(() => {
    const res = engine.executeCode(code);
    setExecutionResult(res);
    if (window.innerWidth < 768) {
      setActiveMobileTab('results');
    }
  }, [code, engine]);

  // Verify Solution
  const handleVerify = async () => {
    setIsEvaluating(true);
    try {
      const currentState: PythonLabState = {
        code,
        history: [],
        lastResult: executionResult,
        activeExercise: exercise
      };

      const result = await engine.check(currentState, exercise.rules);
      setValidationResult(result);

      const penalty = consultedHintsCount * 10;
      const finalScore = Math.max(0, result.score - penalty);

      // Record xAPI statement
      try {
        await coursesService.recordLearningEvent({
          verb: result.isSuccess ? 'passed' : 'answered',
          object_id: `lab-python-${exercise.id}`,
          object_type: 'interactive_exercise',
          object_name: exercise.title,
          success: result.isSuccess,
          score_scaled: finalScore / 100,
          payload: {
            lab_type: 'python',
            exercise_slug: exercise.slug,
            code_length: code.length,
            hints_used: consultedHintsCount,
            passed_rules_count: result.details.filter((d) => d.passed).length,
            total_rules_count: exercise.rules.length
          }
        });
      } catch {
        // Offline safe
      }

      if (result.isSuccess) {
        setCompletedExercises((prev) => ({ ...prev, [exercise.id]: finalScore }));
        if (Object.keys(completedExercises).length + 1 >= PYTHON_PANDAS_EXERCISES.length) {
          onAllCompleted?.();
        }
      }

      if (window.innerWidth < 768) {
        setActiveMobileTab('results');
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextExercise = () => {
    if (hasNext) {
      setSelectedExerciseIndex((prev) => prev + 1);
    }
  };

  const handleExport = async () => {
    const blob = await engine.export({
      code,
      history: [],
      lastResult: executionResult,
      activeExercise: exercise
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exercise.slug || 'script'}.py`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      engine.import(file).then((newState) => {
        setCode(newState.code);
      });
    }
  };

  const handleReset = () => {
    setCode(exercise.initialCode);
    setExecutionResult(null);
    setValidationResult(null);
  };

  const handleInsertSnippet = (snippet: string) => {
    setCode((prev) => `${prev} ${snippet}`);
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-4 text-brand-text">
      {/* Exercise Pill Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted shrink-0 flex items-center gap-1.5 pl-1">
          <FileCode className="w-3.5 h-3.5 text-amber-600" />
          <span>Ateliers Python :</span>
        </span>

        {PYTHON_PANDAS_EXERCISES.map((ex, idx) => {
          const isCurrent = idx === selectedExerciseIndex;
          const isDone = completedExercises[ex.id] !== undefined;

          return (
            <button
              key={ex.id}
              type="button"
              onClick={() => setSelectedExerciseIndex(idx)}
              className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 border ${
                isCurrent
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : isDone
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-white text-slate-700 border-brand-border hover:bg-slate-50'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              ) : (
                <span className="w-5 h-5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
              )}
              <span className="truncate max-w-[140px] sm:max-w-xs">
                {ex.title.split(':')[1]?.trim() || ex.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Top Laboratory Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 bg-white rounded-3xl border border-brand-border shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 border border-amber-500/20 shadow-2xs">
            <Terminal className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                Laboratoire Python (Pandas Navigateur)
              </span>
              <Badge variant="amber">
                Atelier pratique
              </Badge>
            </div>
            <h1 className="text-base sm:text-xl font-bold font-heading text-brand-primary leading-tight mt-0.5">
              {exercise.title}
            </h1>
          </div>
        </div>

        {/* Controls : Export, Import, Hints, Auto-Save */}
        <div className="flex items-center flex-wrap gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          {lastSavedTimestamp && (
            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] text-brand-muted font-medium bg-slate-50 px-2.5 py-1 rounded-xl border border-brand-border/60">
              <Save className="w-3.5 h-3.5 text-brand-teal" />
              <span>Sauvegardé auto</span>
            </span>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() => setIsHintsModalOpen(true)}
            className="min-h-[44px] px-3 rounded-xl flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition-colors"
          >
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>Indices ({consultedHintsCount}/{exercise.hints.length})</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleExport}
            title="Télécharger le script (.py)"
            className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-brand-border"
          >
            <Download className="w-4 h-4" />
          </Button>

          <label
            htmlFor="py-file-upload"
            title="Importer un fichier Python"
            className="min-h-[44px] min-w-[44px] px-2.5 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 border border-brand-border cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4" />
            <input
              id="py-file-upload"
              type="file"
              accept=".py"
              onChange={handleImport}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      {/* Mobile Targeted Adaptive Switcher (< 768px Tabs, R23) */}
      <div className="flex md:hidden bg-white p-1 rounded-2xl border border-brand-border shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveMobileTab('instructions')}
          className={`flex-1 min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeMobileTab === 'instructions'
              ? 'bg-brand-primary text-white shadow-xs'
              : 'text-brand-muted hover:text-brand-primary'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Consigne</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMobileTab('editor')}
          className={`flex-1 min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeMobileTab === 'editor'
              ? 'bg-brand-primary text-white shadow-xs'
              : 'text-brand-muted hover:text-brand-primary'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Script Python</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMobileTab('results')}
          className={`flex-1 min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all relative ${
            activeMobileTab === 'results'
              ? 'bg-brand-primary text-white shadow-xs'
              : 'text-brand-muted hover:text-brand-primary'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Console</span>
          {executionResult && (
            <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-2 right-2" />
          )}
        </button>
      </div>

      {/* Main Targeted Adaptive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Context, Instruction & Dataset Explorer */}
        <div
          className={`lg:col-span-4 flex flex-col gap-4 ${
            activeMobileTab !== 'instructions' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-brand-border shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">
              {exercise.context}
            </span>
            <h2 className="text-sm sm:text-base font-bold text-brand-primary mt-1 mb-2 font-heading">
              Consigne de l&apos;Atelier
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
              {exercise.instruction}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <h3 className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">
                Critères de validation :
              </h3>
              <ul className="space-y-2">
                {exercise.rules.map((rule) => {
                  const checkDetail = validationResult?.details.find((d) => d.ruleId === rule.id);
                  const isPassed = checkDetail?.passed;

                  return (
                    <li
                      key={rule.id}
                      className="flex items-start gap-2 text-xs text-slate-700 leading-snug"
                    >
                      {checkDetail ? (
                        isPassed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        )
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0 mt-1.5" />
                      )}
                      <span className={isPassed ? 'text-emerald-950 font-medium' : ''}>
                        {rule.description}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <PythonDatasetExplorer onInsertText={handleInsertSnippet} />
        </div>

        {/* Right Column: Code Editor, Console Output and Validation Feedback */}
        <div
          className={`lg:col-span-8 flex flex-col gap-4 ${
            activeMobileTab === 'instructions' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className={activeMobileTab === 'results' ? 'hidden md:block' : 'block'}>
            <PythonEditor
              value={code}
              onChange={setCode}
              onExecute={handleExecute}
              onReset={handleReset}
              isRunning={isEvaluating}
            />
          </div>

          {/* Validation Feedback Banner */}
          {validationResult && (
            <div
              role="alert"
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                validationResult.isSuccess
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              <div className="flex items-start gap-3">
                {validationResult.isSuccess ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-sm sm:text-base font-heading">
                      {validationResult.isSuccess
                        ? 'Atelier Python Validé avec Succès !'
                        : 'Vérification du script'}
                    </h4>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white shadow-2xs">
                      Score : {validationResult.score}%
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm mt-1 leading-relaxed">
                    {validationResult.message}
                  </p>

                  {!validationResult.isSuccess && (
                    <ul className="mt-2.5 space-y-1 text-xs text-amber-900/90 list-disc list-inside">
                      {validationResult.details
                        .filter((d) => !d.passed)
                        .map((d) => (
                          <li key={d.ruleId}>
                            <span className="font-semibold">{d.description}</span>
                            {d.message && ` : ${d.message}`}
                          </li>
                        ))}
                    </ul>
                  )}

                  {validationResult.isSuccess && hasNext && (
                    <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-end">
                      <Button
                        type="button"
                        onClick={handleNextExercise}
                        variant="primary"
                        className="min-h-[44px] px-4 rounded-xl flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs"
                      >
                        <span>Passer à l&apos;atelier suivant</span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Console Output Area */}
          <div className={activeMobileTab === 'editor' ? 'hidden md:block' : 'block'}>
            <PythonConsoleOutput result={executionResult} />
          </div>

          {/* Sticky Bottom Verification Toolbar (>= 44px) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-brand-border flex items-center justify-between gap-3 shadow-xs">
            <span className="text-xs text-brand-muted hidden sm:inline">
              Cliquez sur Vérifier pour valider votre code face aux exigences du cas pratique.
            </span>

            <Button
              type="button"
              onClick={handleVerify}
              disabled={isEvaluating}
              variant="primary"
              className="w-full sm:w-auto min-h-[48px] px-6 rounded-xl flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white font-extrabold text-sm shadow-md active:scale-[0.99] transition-all ml-auto"
            >
              <Check className="w-5 h-5 text-amber-400" />
              <span>{isEvaluating ? 'Vérification...' : 'Vérifier la solution'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Hints Modal */}
      <LabHintsModal
        isOpen={isHintsModalOpen}
        onClose={() => setIsHintsModalOpen(false)}
        hints={exercise.hints}
        onHintConsulted={(count) => setConsultedHintsCount(count + 1)}
      />
    </div>
  );
};

