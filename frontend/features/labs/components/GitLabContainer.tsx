'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  GitBranch, 
  CheckCircle2, 
  HelpCircle, 
  Download, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  Play, 
  ShieldCheck, 
  Layers, 
  Terminal, 
  Eye 
} from 'lucide-react';
import { Button } from '@/ui/Button';
import { GitLabEngine } from '../engines/GitLabEngine';
import { GitTerminalView } from './GitTerminalView';
import { GitVisualizerGraph } from './GitVisualizerGraph';
import { LabHintsModal } from './LabHintsModal';
import { SAMPLE_GIT_EXERCISES } from '../data/sampleGitExercises';
import { GitLabState, LabExercise, LabResult } from '../types';
import { coursesService } from '@/features/courses/services/courses.service';

export const GitLabContainer: React.FC = () => {
  const [engine] = useState(() => new GitLabEngine());
  const [exerciseIndex, setExerciseIndex] = useState<number>(0);
  const exercise: LabExercise = SAMPLE_GIT_EXERCISES[exerciseIndex];

  const [labState, setLabState] = useState<GitLabState | null>(null);
  const [validationResult, setValidationResult] = useState<LabResult | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isHintsModalOpen, setIsHintsModalOpen] = useState<boolean>(false);
  const [consultedHintsCount, setConsultedHintsCount] = useState<number>(0);
  const [activeTabMobile, setActiveTabMobile] = useState<'terminal' | 'visualizer'>('terminal');

  // Initialize engine state on exercise change
  useEffect(() => {
    let isMounted = true;
    engine.load(exercise).then((state) => {
      if (isMounted) {
        setLabState(state);
        setValidationResult(null);
        setConsultedHintsCount(0);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [engine, exercise]);

  // Execute terminal command
  const handleExecuteCommand = useCallback(
    (cmd: string) => {
      if (!labState) return;
      const updated = engine.executeCommand(labState, cmd);
      setLabState(updated);
      setValidationResult(null); // Reset validation state on new command
    },
    [engine, labState]
  );

  // Clear logs
  const handleClearLogs = useCallback(() => {
    if (!labState) return;
    setLabState({ ...labState, logs: [] });
  }, [labState]);

  // Validate solution
  const handleValidate = useCallback(async () => {
    if (!labState) return;
    setIsValidating(true);
    try {
      const result = await engine.check(labState, exercise.rules);
      setValidationResult(result);

      if (result.isSuccess) {
        // Emit xAPI learning event
        try {
          await coursesService.recordLearningEvent({
            verb: 'completed',
            object_id: `http://datamboa.cm/labs/git/${exercise.slug}`,
            object_type: 'laboratory',
            object_name: `Laboratoire Git — ${exercise.title}`,
            success: true,
            score_scaled: result.score / 100
          });
        } catch {
          // Ignore offline errors
        }
      }
    } finally {
      setIsValidating(false);
    }
  }, [engine, labState, exercise]);

  // Reset exercise
  const handleReset = useCallback(async () => {
    const refreshed = await engine.load(exercise);
    setLabState(refreshed);
    setValidationResult(null);
  }, [engine, exercise]);

  // Export git history
  const handleExport = useCallback(async () => {
    if (!labState) return;
    const blob = await engine.export(labState);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `datamboa_git_history_${exercise.slug}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [engine, labState, exercise.slug]);

  if (!labState) {
    return (
      <div className="flex items-center justify-center p-12 min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Initialisation du dépôt Git virtuel...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-brand-border p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0 shadow-xs">
            <GitBranch className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-primary text-white">
                V3 — Intelligence (F3.3)
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Atelier pratique
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                100% Côté Client (Aucun serveur requis)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-brand-text tracking-tight">
              Laboratoire Git & GitHub interactif dans le navigateur
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Simulateur Git complet avec terminal bash, zone de staging et graphe de commits visuel pour analystes de données.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsHintsModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold"
          >
            <HelpCircle className="w-4 h-4 text-amber-500" />
            Indices {consultedHintsCount > 0 && `(${consultedHintsCount})`}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-1.5 text-xs font-bold"
            title="Exporter l'historique des commits"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exporter</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-bold"
            title="Réinitialiser l'atelier"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Workshop Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {SAMPLE_GIT_EXERCISES.map((ex, idx) => (
          <button
            key={ex.id}
            type="button"
            onClick={() => setExerciseIndex(idx)}
            className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-2 min-h-[44px] ${
              idx === exerciseIndex
                ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                : 'bg-white text-slate-700 border-brand-border hover:bg-slate-50'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
              {idx + 1}
            </span>
            <span>{ex.title}</span>
          </button>
        ))}
      </div>

      {/* Instructions & Context Banner */}
      <div className="bg-white rounded-3xl border border-brand-border p-5 shadow-xs flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mise en situation :</span>
            <span className="text-xs font-semibold text-slate-700">{exercise.context}</span>
          </div>
          <span className="text-xs font-bold text-brand-primary">
            Atelier {exerciseIndex + 1} sur {SAMPLE_GIT_EXERCISES.length}
          </span>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-brand-primary/10 text-brand-primary shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Consigne de l'atelier :</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {exercise.instruction}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Tab Switcher (Terminal vs Graph) */}
      <div className="flex lg:hidden rounded-2xl bg-slate-200 p-1">
        <button
          type="button"
          onClick={() => setActiveTabMobile('terminal')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all min-h-[40px] ${
            activeTabMobile === 'terminal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          <Terminal className="w-4 h-4" />
          Terminal Git
        </button>
        <button
          type="button"
          onClick={() => setActiveTabMobile('visualizer')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all min-h-[40px] ${
            activeTabMobile === 'visualizer' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          <Layers className="w-4 h-4" />
          Graphe & 3 Zones Git
        </button>
      </div>

      {/* Main Workspace Split (Terminal + Visualizer Graph) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
        {/* Left Column: Interactive Terminal (7 cols) */}
        <div
          className={`lg:col-span-7 h-[550px] lg:h-[620px] ${
            activeTabMobile === 'terminal' ? 'block' : 'hidden lg:block'
          }`}
        >
          <GitTerminalView
            labState={labState}
            onExecuteCommand={handleExecuteCommand}
            onClearLogs={handleClearLogs}
          />
        </div>

        {/* Right Column: Visualizer DAG Graph (5 cols) */}
        <div
          className={`lg:col-span-5 h-[550px] lg:h-[620px] ${
            activeTabMobile === 'visualizer' ? 'block' : 'hidden lg:block'
          }`}
        >
          <GitVisualizerGraph labState={labState} />
        </div>
      </div>

      {/* Bottom Evaluation & Criteria Bar */}
      <div className="bg-white rounded-3xl border border-brand-border p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Critères d'évaluation de l'atelier :
          </h4>

          <div className="space-y-1.5">
            {exercise.rules.map((rule) => {
              const detail = validationResult?.details.find((d) => d.ruleId === rule.id);
              const isPassed = detail ? detail.passed : false;

              return (
                <div key={rule.id} className="flex items-center gap-2 text-xs">
                  {isPassed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
                  )}
                  <span className={isPassed ? 'text-emerald-800 font-semibold' : 'text-slate-600'}>
                    {rule.description}
                  </span>
                </div>
              );
            })}
          </div>

          {validationResult && (
            <div
              className={`mt-3 p-3 rounded-2xl text-xs font-semibold flex items-center justify-between ${
                validationResult.isSuccess
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-amber-50 text-amber-900 border border-amber-200'
              }`}
            >
              <span>{validationResult.message}</span>
              <span className="font-bold text-sm">{validationResult.score} / 100</span>
            </div>
          )}
        </div>

        {/* Validation Button & Next Exercise */}
        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
          <Button
            size="lg"
            onClick={handleValidate}
            disabled={isValidating}
            className="flex items-center gap-2 text-sm font-bold min-h-[48px] px-6"
          >
            {isValidating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Vérification...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Vérifier mes commandes Git
              </>
            )}
          </Button>

          {validationResult?.isSuccess && exerciseIndex < SAMPLE_GIT_EXERCISES.length - 1 && (
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setExerciseIndex((prev) => prev + 1)}
              className="flex items-center gap-2 text-sm font-bold min-h-[48px] px-5 animate-pulse"
            >
              Atelier suivant
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
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

