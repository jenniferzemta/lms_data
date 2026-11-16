'use client';

import React, { useState } from 'react';
import { MissionDetail, MissionSubmission } from '../types';
import { missionsService } from '../services/missions.service';
import { MissionDatasetPreview } from './MissionDatasetPreview';
import { MissionRubricEvaluation } from './MissionRubricEvaluation';
import { MissionSolutionReveal } from './MissionSolutionReveal';
import { Badge } from '@/ui/Badge';
import { Link } from '@/i18n/routing';
import {
  Briefcase,
  Building,
  MapPin,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  Terminal,
  BookOpen,
  Sparkles,
  ChevronRight,
  Target
} from 'lucide-react';

interface MissionWorkspaceViewProps {
  mission: MissionDetail;
}

type WorkspaceTab = 'brief' | 'deliverables' | 'solution';

export const MissionWorkspaceView: React.FC<MissionWorkspaceViewProps> = ({ mission }) => {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('brief');
  const [submission, setSubmission] = useState<MissionSubmission | null>(mission.user_submission);
  const [modelSolution, setModelSolution] = useState<string>(mission.model_solution_summary || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleSubmitEvaluation = async (data: {
    self_evaluation: Record<string, number>;
    learner_notes: string;
    deliverable_link: string;
  }) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    try {
      const res = await missionsService.submitMissionEvaluation(mission.slug, data);
      setSubmission(res.submission);
      setModelSolution(res.model_solution_summary);
      setActiveTab('solution');
    } catch {
      setSubmissionError('Une erreur est survenue lors de l\'enregistrement. Assurez-vous d\'être connecté(e).');
    } finally {
      setIsSubmitting(false);
    }
  };

  const difficultyVariant =
    mission.difficulty === 'BEGINNER'
      ? 'teal'
      : mission.difficulty === 'INTERMEDIATE'
      ? 'amber'
      : 'primary';

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg select-text pb-20">
      {/* Top Mission Header Banner */}
      <header className="bg-white border-b border-brand-border sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-brand-primary" />
                  {mission.company_name} · {mission.sector}
                </span>
                <Badge variant={difficultyVariant}>
                  {mission.difficulty}
                </Badge>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-brand-text">
                {mission.title}
              </h1>
            </div>

            {/* Quick Meta */}
            <div className="flex items-center gap-3 text-xs text-slate-500 shrink-0">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {mission.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {mission.estimated_duration_minutes} min
              </span>
            </div>
          </div>

          {/* Navigation Tabs (Mobile-friendly, >= 44px touch targets) */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl mt-4 max-w-md">
            <button
              type="button"
              onClick={() => setActiveTab('brief')}
              className={`py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all min-h-[40px] ${
                activeTab === 'brief'
                  ? 'bg-white text-brand-primary shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Contexte & Données</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('deliverables')}
              className={`py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all min-h-[40px] ${
                activeTab === 'deliverables'
                  ? 'bg-white text-brand-primary shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Auto-Évaluation</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('solution')}
              className={`py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all min-h-[40px] ${
                activeTab === 'solution'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Corrigé Type</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {submissionError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl">
            {submissionError}
          </div>
        )}

        {/* TAB 1: BRIEF & DONNÉES */}
        {activeTab === 'brief' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (8 cols): Context, Problem, Tasks */}
            <div className="lg:col-span-8 flex flex-col gap-5">
              {/* Context Brief */}
              <div className="bg-white border border-brand-border rounded-xl p-5 shadow-xs">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-brand-primary" />
                  Mise en situation professionnelle
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {mission.context_brief}
                </p>
              </div>

              {/* Business Problem */}
              <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-5 shadow-xs">
                <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-amber-700" />
                  Problématique de la Direction Générale
                </h2>
                <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                  {mission.business_problem}
                </p>
              </div>

              {/* Tasks List */}
              <div className="bg-white border border-brand-border rounded-xl p-5 shadow-xs">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Tâches d&apos;analyse demandées ({mission.tasks.length})
                </h2>
                <div className="space-y-2.5">
                  {mission.tasks.map((task, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800"
                    >
                      <span className="w-5 h-5 rounded-full bg-brand-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dataset Table Preview */}
              <MissionDatasetPreview
                description={mission.dataset_description}
                sampleRows={mission.dataset_sample}
                downloadUrl={mission.dataset_download_url}
              />
            </div>

            {/* Right Column (4 cols): Deliverables & Practice Quick Launch */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              {/* Deliverables Card */}
              <div className="bg-white border border-brand-border rounded-xl p-5 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Livrables professionnels attendus
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {mission.deliverables.map((deliv, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                      <span>{deliv}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => setActiveTab('deliverables')}
                  className="w-full mt-5 py-2.5 px-4 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-primary/90 transition-colors min-h-[44px]"
                >
                  Passer à l&apos;auto-évaluation
                </button>
              </div>

              {/* Quick Launch Lab Tools Callout */}
              <div className="bg-slate-50 border border-brand-border rounded-xl p-5 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Laboratoires d&apos;analyse recommandés
                </h4>
                <p className="text-xs text-slate-600 mb-3">
                  Utilisez les laboratoires intégrés de DataMboa pour exécuter vos requêtes SQL, scripts Pandas ou feuilles de calcul Excel.
                </p>
                <div className="space-y-2">
                  <Link
                    href="/labs/sql"
                    className="flex items-center justify-between p-2.5 bg-white border border-brand-border rounded-lg text-xs font-semibold text-slate-700 hover:border-brand-primary hover:text-brand-primary transition-colors min-h-[44px]"
                  >
                    <span className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-indigo-600" />
                      Laboratoire SQL
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>

                  <Link
                    href="/labs/excel"
                    className="flex items-center justify-between p-2.5 bg-white border border-brand-border rounded-lg text-xs font-semibold text-slate-700 hover:border-emerald-600 hover:text-emerald-700 transition-colors min-h-[44px]"
                  >
                    <span className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      Laboratoire Tableur Excel
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DELIVERABLES & AUTO-EVALUATION */}
        {activeTab === 'deliverables' && (
          <div className="max-w-4xl mx-auto">
            <MissionRubricEvaluation
              rubric={mission.evaluation_rubric}
              existingSubmission={submission}
              onSubmit={handleSubmitEvaluation}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        {/* TAB 3: CORRIGÉ TYPE */}
        {activeTab === 'solution' && (
          <div className="max-w-4xl mx-auto">
            <MissionSolutionReveal
              modelSolution={modelSolution}
              submission={submission}
            />
          </div>
        )}
      </main>
    </div>
  );
};
