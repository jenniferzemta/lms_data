'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SAMPLE_EXCEL_EXERCISES } from '../data/sampleExcelExercises';
import { ExcelLabEngine } from '../engines/ExcelLabEngine';
import { ExcelFormulaBar } from './ExcelFormulaBar';
import { ExcelGrid } from './ExcelGrid';
import { LabHintsModal } from './LabHintsModal';
import { LabResult, ExcelLabState } from '../types';
import { Badge } from '@/ui/Badge';
import { Button } from '@/ui/Button';
import { coursesService } from '@/features/courses';
import {
  Table,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Download,
  Upload,
  Save,
  Check,
  ChevronRight,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface ExcelLabViewProps {
  initialExerciseId?: string;
  onAllCompleted?: () => void;
}

type MobileTab = 'instructions' | 'grid' | 'results';

export const ExcelLabView: React.FC<ExcelLabViewProps> = ({
  initialExerciseId,
  onAllCompleted
}) => {
  const engine = useMemo(() => new ExcelLabEngine(), []);

  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number>(() => {
    if (initialExerciseId) {
      const idx = SAMPLE_EXCEL_EXERCISES.findIndex(
        (e) => e.id === initialExerciseId || e.slug === initialExerciseId
      );
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const exercise = SAMPLE_EXCEL_EXERCISES[selectedExerciseIndex];
  const hasNext = selectedExerciseIndex < SAMPLE_EXCEL_EXERCISES.length - 1;

  // Lab Engine State
  const [labState, setLabState] = useState<ExcelLabState>(() => engine.createInitialState(exercise));
  const [validationResult, setValidationResult] = useState<LabResult | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isHintsModalOpen, setIsHintsModalOpen] = useState<boolean>(false);
  const [consultedHintsCount, setConsultedHintsCount] = useState<number>(0);
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<number | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('grid');
  const [completedExercises, setCompletedExercises] = useState<Record<string, number>>({});

  // Reset or load when exercise changes
  useEffect(() => {
    let isMounted = true;
    engine.load(exercise).then((state) => {
      if (!isMounted) return;
      setLabState(state);
      setValidationResult(null);
      setConsultedHintsCount(0);
    });

    return () => {
      isMounted = false;
    };
  }, [exercise, engine]);

  // Select a cell
  const handleSelectCell = useCallback(
    (coord: string) => {
      setLabState((prev) => engine.setActiveCell(prev, coord));
    },
    [engine]
  );

  // Change formula text in formula bar
  const handleChangeFormula = useCallback((val: string) => {
    setLabState((prev) => ({
      ...prev,
      formulaInput: val
    }));
  }, []);

  // Submit formula on Enter or button click
  const handleSubmitFormula = useCallback(() => {
    setLabState((prev) => {
      const next = engine.setCellValue(prev, prev.activeCell, prev.formulaInput);
      // Auto-save to localStorage
      if (typeof window !== 'undefined') {
        try {
          const snapshot = engine.serialize(next);
          localStorage.setItem(`datamboa_lab_excel_${exercise.id}`, JSON.stringify(snapshot));
          setLastSavedTimestamp(Date.now());
        } catch {
          // ignore
        }
      }
      return next;
    });
  }, [engine, exercise.id]);

  // Reset active cell value
  const handleResetActiveCell = useCallback(() => {
    setLabState((prev) => {
      const next = engine.setCellValue(prev, prev.activeCell, '');
      return next;
    });
  }, [engine]);

  // Reset entire exercise grid to fresh initial state
  const handleResetEntireGrid = useCallback(() => {
    const fresh = engine.createInitialState(exercise);
    setLabState(fresh);
    setValidationResult(null);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(`datamboa_lab_excel_${exercise.id}`);
      } catch {
        // ignore
      }
    }
  }, [engine, exercise]);

  // Save progress manually
  const handleSaveProgress = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const snapshot = engine.serialize(labState);
        localStorage.setItem(`datamboa_lab_excel_${exercise.id}`, JSON.stringify(snapshot));
        setLastSavedTimestamp(Date.now());
      } catch {
        // ignore
      }
    }
  }, [engine, labState, exercise.id]);

  // Evaluate and check solution
  const handleVerifySolution = useCallback(async () => {
    setIsValidating(true);
    try {
      const result = await engine.check(labState, exercise.rules);

      // Score deduction for consulted hints: 10% per hint
      const hintPenaltyRatio = Math.max(0, 1 - consultedHintsCount * 0.1);
      const adjustedScore = Math.round(result.score * hintPenaltyRatio);

      const finalResult: LabResult = {
        ...result,
        score: adjustedScore
      };

      setValidationResult(finalResult);

      if (finalResult.isSuccess) {
        setCompletedExercises((prev) => {
          const updated = {
            ...prev,
            [exercise.id]: adjustedScore
          };
          if (Object.keys(updated).length === SAMPLE_EXCEL_EXERCISES.length) {
            onAllCompleted?.();
          }
          return updated;
        });

        // Emit xAPI learning statement (Master Prompt §4, R23)
        try {
          await coursesService.recordLearningEvent({
            verb: 'completed',
            object_id: `http://datamboa.cm/labs/excel/${exercise.slug}`,
            object_name: exercise.title,
            score_scaled: adjustedScore / 100,
            success: true
          });
        } catch {
          // Fail silently for offline resilience
        }
      }

      // On mobile, show results tab
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setActiveMobileTab('results');
      }
    } finally {
      setIsValidating(false);
    }
  }, [engine, labState, exercise, consultedHintsCount]);

  // Export CSV
  const handleExportCsv = useCallback(async () => {
    const blob = await engine.export(labState);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ETS_MBALLA_${exercise.slug}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [engine, labState, exercise.slug]);

  // Import CSV
  const handleImportFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const imported = await engine.import(file);
        setLabState(imported);
      } catch {
        // ignore
      }
    },
    [engine]
  );

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg select-text">
      {/* Top Banner / Workshop Navigation */}
      <header className="bg-white border-b border-brand-border sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Title & Badge */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs shrink-0">
                <Table className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold text-brand-text truncate">
                    Laboratoire Excel : Tableur Interactif
                  </h1>
                  <Badge variant="teal">
                    {exercise.bloomLevel}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  ETS MBALLA & FRÈRES — Quincaillerie & Matériaux de Construction (Douala, FCFA)
                </p>
              </div>
            </div>

            {/* Actions: Save, Hints, Reset, Verify */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <button
                type="button"
                onClick={() => setIsHintsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold rounded-lg transition-colors min-h-[38px] shrink-0"
              >
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Indices ({3 - consultedHintsCount})</span>
              </button>

              <button
                type="button"
                onClick={handleSaveProgress}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors min-h-[38px] shrink-0"
                title="Enregistrer la feuille"
              >
                <Save className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">
                  {lastSavedTimestamp ? 'Sauvegardé' : 'Sauvegarder'}
                </span>
              </button>

              <label
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors min-h-[38px] shrink-0 cursor-pointer"
                title="Importer un fichier CSV"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Importer</span>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleResetEntireGrid}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors min-h-[38px] shrink-0"
                title="Réinitialiser la feuille"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Réinitialiser</span>
              </button>

              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors min-h-[38px] shrink-0"
                title="Télécharger la feuille au format CSV"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Exporter</span>
              </button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleVerifySolution}
                disabled={isValidating}
                className="bg-emerald-600 hover:bg-emerald-700 text-white min-h-[38px] shrink-0 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                {isValidating ? 'Calcul...' : 'Vérifier la Feuille'}
              </Button>
            </div>
          </div>

          {/* Workshop Selector Tabs */}
          <div className="flex items-center gap-1 mt-3 overflow-x-auto scrollbar-thin pb-1">
            {SAMPLE_EXCEL_EXERCISES.map((ex, idx) => {
              const isSelected = idx === selectedExerciseIndex;
              const isDone = !!completedExercises[ex.id];

              return (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => setSelectedExerciseIndex(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 min-h-[36px] ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {isDone ? (
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-slate-300 text-slate-800 text-[10px] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                  )}
                  <span className="truncate max-w-[170px] sm:max-w-xs">{ex.title.split(':')[1] || ex.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Mobile Tab Switcher (< 1024 px) */}
      <div className="lg:hidden bg-white border-b border-brand-border px-4 py-2 sticky top-[110px] z-20">
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveMobileTab('instructions')}
            className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeMobileTab === 'instructions'
                ? 'bg-white text-brand-primary shadow-xs'
                : 'text-slate-600'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Consigne</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMobileTab('grid')}
            className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeMobileTab === 'grid'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Tableur</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMobileTab('results')}
            className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all relative ${
              activeMobileTab === 'results'
                ? 'bg-white text-brand-accent shadow-xs'
                : 'text-slate-600'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Résultats</span>
            {validationResult && (
              <span
                className={`w-2 h-2 rounded-full absolute top-1.5 right-1.5 ${
                  validationResult.isSuccess ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            )}
          </button>
        </div>
      </div>

      {/* Main Responsive Grid Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Context, Instructions, Validation Rules (Desk: col-span-4) */}
          <div
            className={`lg:col-span-4 flex flex-col gap-4 ${
              activeMobileTab === 'instructions' ? 'block' : 'hidden lg:flex'
            }`}
          >
            {/* Context Card */}
            <div className="bg-white border border-brand-border rounded-xl p-4 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-brand-primary" />
                Mise en situation professionnelle
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {exercise.context}
              </p>
            </div>

            {/* Instruction Card */}
            <div className="bg-white border border-brand-border rounded-xl p-4 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Consigne de l&apos;Atelier
              </h2>
              <div className="text-xs sm:text-sm text-slate-800 font-medium whitespace-pre-line leading-relaxed bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                {exercise.instruction}
              </div>
            </div>

            {/* Criteria & Check Rules List */}
            <div className="bg-white border border-brand-border rounded-xl p-4 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                Critères de validation automatique ({exercise.rules.length})
              </h2>
              <div className="space-y-2">
                {exercise.rules.map((rule) => {
                  const checkDetail = validationResult?.details.find((d) => d.ruleId === rule.id);
                  const isPassed = checkDetail?.passed;

                  return (
                    <div
                      key={rule.id}
                      className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs transition-colors ${
                        isPassed
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : validationResult
                          ? 'bg-rose-50 border-rose-200 text-rose-900'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      )}
                      <span className="leading-snug">{rule.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Formula Bar, Excel Grid, Results (Desk: col-span-8) */}
          <div
            className={`lg:col-span-8 flex flex-col gap-4 ${
              activeMobileTab === 'grid' || activeMobileTab === 'results' ? 'block' : 'hidden lg:flex'
            }`}
          >
            {/* Show Spreadsheet in 'grid' tab on mobile or always on desktop */}
            <div className={`${activeMobileTab === 'grid' ? 'block' : 'hidden lg:block'} space-y-3`}>
              {/* Formula Bar with Quick Inserts */}
              <ExcelFormulaBar
                activeCell={labState.activeCell}
                formulaInput={labState.formulaInput}
                onChangeFormula={handleChangeFormula}
                onSubmitFormula={handleSubmitFormula}
                onResetActiveCell={handleResetActiveCell}
              />

              {/* Editable Spreadsheet Table */}
              <ExcelGrid
                cells={labState.cells}
                activeCell={labState.activeCell}
                rowCount={labState.rowCount}
                colCount={labState.colCount}
                onSelectCell={handleSelectCell}
              />
            </div>

            {/* Validation Feedback Banner / Panel */}
            {validationResult && (
              <div
                className={`border rounded-xl p-4 shadow-xs transition-all ${
                  validationResult.isSuccess
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-amber-50 border-amber-300 text-amber-900'
                } ${activeMobileTab === 'results' ? 'block' : 'block'}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {validationResult.isSuccess ? (
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-sm sm:text-base">
                        {validationResult.isSuccess
                          ? 'Atelier réussi ! Formules validées.'
                          : 'Attention : certaines formules demandent correction'}
                      </h3>
                      <p className="text-xs sm:text-sm mt-0.5 opacity-90">{validationResult.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-[11px] uppercase tracking-wider font-semibold opacity-75">
                        Score final
                      </span>
                      <div className="text-xl font-black font-mono">
                        {validationResult.score} / 100
                      </div>
                    </div>

                    {validationResult.isSuccess && hasNext && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setSelectedExerciseIndex((prev) => prev + 1);
                          setActiveMobileTab('grid');
                        }}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white"
                      >
                        <span>Atelier suivant</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Hints Modal */}
      <LabHintsModal
        isOpen={isHintsModalOpen}
        hints={exercise.hints}
        onHintConsulted={(hintIndex) => setConsultedHintsCount(hintIndex + 1)}
        onClose={() => setIsHintsModalOpen(false)}
      />
    </div>
  );
};
