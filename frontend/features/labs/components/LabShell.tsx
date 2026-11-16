'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  LabExercise,
  LabResult,
  SqlLabState,
  SqlQueryResult
} from '../types';
import { SqlLabEngine } from '../engines/SqlLabEngine';
import { SqlEditor } from './SqlEditor';
import { SqlResultsTable } from './SqlResultsTable';
import { SqlSchemaExplorer } from './SqlSchemaExplorer';
import { LabHintsModal } from './LabHintsModal';
import { Badge } from '@/ui/Badge';
import { Button } from '@/ui/Button';
import { coursesService } from '@/features/courses';
import {
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
  Terminal,
  FileCode2
} from 'lucide-react';

interface LabShellProps {
  exercise: LabExercise;
  onExerciseComplete?: (score: number) => void;
  onNextExercise?: () => void;
  hasNextExercise?: boolean;
}

type MobileTab = 'instructions' | 'editor' | 'results';

export const LabShell: React.FC<LabShellProps> = ({
  exercise,
  onExerciseComplete,
  onNextExercise,
  hasNextExercise = false
}) => {
  const engine = useMemo(() => new SqlLabEngine(), []);

  // State
  const [code, setCode] = useState<string>(exercise.initialCode);
  const [queryResult, setQueryResult] = useState<SqlQueryResult | null>(null);
  const [validationResult, setValidationResult] = useState<LabResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isHintsModalOpen, setIsHintsModalOpen] = useState<boolean>(false);
  const [consultedHintsCount, setConsultedHintsCount] = useState<number>(0);
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<number | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('editor');

  // Initialize engine & restore saved snapshot if any
  useEffect(() => {
    let isMounted = true;
    engine.load(exercise).then((state) => {
      if (isMounted) {
        setCode(state.code);
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
          lastResult: queryResult,
          activeExercise: exercise,
          selectedTable: 'clients'
        });
        localStorage.setItem(`datamboa_lab_sql_${exercise.id}`, JSON.stringify(snapshot));
        setLastSavedTimestamp(Date.now());
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [code, exercise, engine, queryResult]);

  // Execute SQL in browser
  const handleExecuteQuery = useCallback(() => {
    const res = engine.executeQuery(code);
    setQueryResult(res);
    // On mobile, auto-switch to results tab so learner sees the outcome
    if (window.innerWidth < 768) {
      setActiveMobileTab('results');
    }
  }, [code, engine]);

  // Check / Verify Solution against criteria
  const handleVerifySolution = async () => {
    setIsEvaluating(true);
    try {
      const currentState: SqlLabState = {
        code,
        history: [],
        lastResult: queryResult,
        activeExercise: exercise,
        selectedTable: 'clients'
      };

      const result = await engine.check(currentState, exercise.rules);
      setValidationResult(result);

      // Deduct points for hints (10 pts per hint consulted)
      const penalty = consultedHintsCount * 10;
      const finalScore = Math.max(0, result.score - penalty);

      // Record xAPI statement via standard learning event service (R15)
      try {
        await coursesService.recordLearningEvent({
          verb: result.isSuccess ? 'passed' : 'answered',
          object_id: `lab-sql-${exercise.id}`,
          object_type: 'interactive_exercise',
          object_name: exercise.title,
          success: result.isSuccess,
          score_scaled: finalScore / 100,
          payload: {
            lab_type: 'sql',
            exercise_slug: exercise.slug,
            code_length: code.length,
            hints_used: consultedHintsCount,
            passed_rules_count: result.details.filter((d) => d.passed).length,
            total_rules_count: exercise.rules.length
          }
        });
      } catch {
        // Continue even if offline
      }

      if (result.isSuccess) {
        onExerciseComplete?.(finalScore);
      }

      // Switch tab on mobile to review feedback
      if (window.innerWidth < 768) {
        setActiveMobileTab('results');
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  // Export SQL file
  const handleExportSql = async () => {
    const blob = await engine.export({
      code,
      history: [],
      lastResult: queryResult,
      activeExercise: exercise,
      selectedTable: 'clients'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exercise.slug || 'requete'}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import SQL file
  const handleImportSql = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      engine.import(file).then((newState) => {
        setCode(newState.code);
      });
    }
  };

  const handleReset = () => {
    setCode(exercise.initialCode);
    setQueryResult(null);
    setValidationResult(null);
  };

  const handleInsertSnippet = (snippet: string) => {
    setCode((prev) => `${prev} ${snippet}`);
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-4 text-brand-text">
      {/* Top Laboratory Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 bg-white rounded-3xl border border-brand-border shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-teal-500/10 text-brand-teal flex items-center justify-center shrink-0 border border-teal-500/20 shadow-2xs">
            <Terminal className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-teal">
                Laboratoire SQL Intégré (SQLite Navigateur)
              </span>
              <Badge variant="teal">
                Bloom : {exercise.bloomLevel}
              </Badge>
            </div>
            <h1 className="text-base sm:text-xl font-bold font-heading text-brand-primary leading-tight mt-0.5">
              {exercise.title}
            </h1>
          </div>
        </div>

        {/* Action Controls : Export, Import, Hints, Auto-Save */}
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
            onClick={handleExportSql}
            title="Télécharger la requête (.sql)"
            className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-brand-border"
          >
            <Download className="w-4 h-4" />
          </Button>

          <label
            htmlFor="sql-file-upload"
            title="Importer un fichier SQL"
            className="min-h-[44px] min-w-[44px] px-2.5 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 border border-brand-border cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4" />
            <input
              id="sql-file-upload"
              type="file"
              accept=".sql"
              onChange={handleImportSql}
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
          <FileCode2 className="w-3.5 h-3.5" />
          <span>Éditeur SQL</span>
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
          <span>Résultats</span>
          {queryResult && (
            <span className="w-2 h-2 rounded-full bg-brand-teal absolute top-2 right-2" />
          )}
        </button>
      </div>

      {/* Main Targeted Adaptive Grid Layout (Desktop: 2 columns, Mobile: Tabbed) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Context, Instruction, Pedagogic Rules & Database Schema Explorer */}
        <div
          className={`lg:col-span-4 flex flex-col gap-4 ${
            activeMobileTab !== 'instructions' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Mission Instruction Card */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-brand-border shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">
              {exercise.context}
            </span>
            <h2 className="text-sm sm:text-base font-bold text-brand-primary mt-1 mb-2 font-heading">
              Objectif Métier
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
              {exercise.instruction}
            </p>

            {/* Criteria Checklist */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <h3 className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">
                Critères de validation attendus :
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

          {/* Database Schema Explorer (Collapsible accordion) */}
          <SqlSchemaExplorer onInsertText={handleInsertSnippet} />
        </div>

        {/* Right Column: SQL Code Editor, Results Table, and Validation Feedback */}
        <div
          className={`lg:col-span-8 flex flex-col gap-4 ${
            activeMobileTab === 'instructions' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* SQL Editor Area */}
          <div className={activeMobileTab === 'results' ? 'hidden md:block' : 'block'}>
            <SqlEditor
              value={code}
              onChange={setCode}
              onExecute={handleExecuteQuery}
              onReset={handleReset}
              isRunning={isEvaluating}
            />
          </div>

          {/* Validation Feedback Banner (if user verified) */}
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
                        ? 'Atelier SQL Réussi avec Succès !'
                        : 'Vérification en cours'}
                    </h4>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white shadow-2xs">
                      Score : {validationResult.score}%
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm mt-1 leading-relaxed">
                    {validationResult.message}
                  </p>

                  {/* Failed criteria details */}
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

                  {/* Next Step / Next Exercise Button */}
                  {validationResult.isSuccess && hasNextExercise && (
                    <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-end">
                      <Button
                        type="button"
                        onClick={onNextExercise}
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

          {/* Results Table Area */}
          <div className={activeMobileTab === 'editor' ? 'hidden md:block' : 'block'}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                Résultat de la requête SQL
              </span>
              <span className="text-[11px] text-brand-muted">
                Moteur relationnel in-memory
              </span>
            </div>

            <SqlResultsTable result={queryResult} />
          </div>

          {/* Sticky Bottom Verification Toolbar (>= 44px Touch Target) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-brand-border flex items-center justify-between gap-3 shadow-xs">
            <span className="text-xs text-brand-muted hidden sm:inline">
              Vérifiez votre solution lorsque vous êtes satisfait du résultat affiché.
            </span>

            <Button
              type="button"
              onClick={handleVerifySolution}
              disabled={isEvaluating}
              variant="primary"
              className="w-full sm:w-auto min-h-[48px] px-6 rounded-xl flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white font-extrabold text-sm shadow-md active:scale-[0.99] transition-all ml-auto"
            >
              <Check className="w-5 h-5 text-brand-teal" />
              <span>{isEvaluating ? 'Vérification en cours...' : 'Vérifier la solution'}</span>
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
