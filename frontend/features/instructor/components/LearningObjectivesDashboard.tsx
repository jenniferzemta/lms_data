'use client';

import React from 'react';
import { LearningObjectivesAnalytics } from '../types';
import {
  Brain,
  Target,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Users,
  Award,
} from 'lucide-react';

interface LearningObjectivesDashboardProps {
  analytics: LearningObjectivesAnalytics;
}

export const LearningObjectivesDashboard: React.FC<LearningObjectivesDashboardProps> = ({
  analytics,
}) => {
  return (
    <div className="space-y-6">
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Tentatives évaluées</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">{analytics.total_attempts} quiz</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Taux de réussite global</span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {analytics.overall_pass_rate}% (Moy. {analytics.average_score_percentage}%)
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Missions corrigées</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {analytics.graded_missions_count} / {analytics.total_missions_submitted}
            </span>
          </div>
        </div>
      </div>

      {/* Bloom Taxonomy Attainment Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-brand-600" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Matrice d&apos;atteinte des objectifs pédagogiques (Taxonomie de Bloom)
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-900/40">
            Critère R18
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Suivi statistique de l&apos;acquisition des compétences par niveau cognitif sur l&apos;ensemble de la cohorte.
        </p>

        <div className="space-y-4 pt-2">
          {analytics.bloom_levels.map((bloom) => {
            const isAcquired = bloom.actual_rate >= bloom.target_rate;
            return (
              <div key={bloom.level} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200">{bloom.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px]">Cible : {bloom.target_rate}%</span>
                    <span className={isAcquired ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                      {bloom.actual_rate}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isAcquired ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${bloom.actual_rate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Remediation & Notions à retravailler (R18) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Notions critiques à retravailler (Taux d&apos;échec &gt; 30%)
          </h3>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Points de blocage identifiés automatiquement nécessitant un renforcement ou une clarification par le formateur.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {analytics.notions_to_review.map((notion, idx) => (
            <div
              key={idx}
              className="bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl p-4 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                    {notion.tool}
                  </span>
                  <span className="text-xs font-extrabold text-rose-600">
                    {notion.failure_rate}% d&apos;échec
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {notion.concept}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {notion.impact}
                </p>
              </div>

              <div className="pt-2 border-t border-amber-200/50 dark:border-amber-900/30 flex items-start gap-1.5 text-xs text-brand-900 dark:text-brand-300 font-medium">
                <Lightbulb className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span>Action : {notion.recommended_action}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
