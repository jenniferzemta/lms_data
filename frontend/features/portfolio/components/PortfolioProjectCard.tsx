'use client';

import React from 'react';
import { PortfolioProjectItem } from '../types';
import {
  Building2,
  TrendingUp,
  Database,
  ExternalLink,
  Star,
  FileSpreadsheet,
  Terminal,
  FileCode,
  PieChart,
} from 'lucide-react';
import { Link } from '@/i18n/routing';

interface PortfolioProjectCardProps {
  project: PortfolioProjectItem;
}

export const PortfolioProjectCard: React.FC<PortfolioProjectCardProps> = ({ project }) => {
  const toolBadgeConfig: Record<string, { label: string; bg: string; icon: React.ReactNode }> = {
    EXCEL: {
      label: 'Excel',
      bg: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/40',
      icon: <FileSpreadsheet className="w-3.5 h-3.5" />,
    },
    SQL: {
      label: 'SQL',
      bg: 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/40',
      icon: <Terminal className="w-3.5 h-3.5" />,
    },
    PYTHON: {
      label: 'Python',
      bg: 'bg-teal-50 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300 border-teal-200 dark:border-teal-900/40',
      icon: <FileCode className="w-3.5 h-3.5" />,
    },
    POWERBI: {
      label: 'Power BI',
      bg: 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-900/40',
      icon: <PieChart className="w-3.5 h-3.5" />,
    },
  };

  return (
    <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700/60 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
      <div className="space-y-3">
        {/* Top bar: Company & Star/Featured */}
        <div className="flex items-center justify-between gap-2">
          {project.company_name ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Building2 className="w-3.5 h-3.5 text-brand-600" />
              {project.company_name}
            </span>
          ) : (
            <span className="text-xs font-semibold text-slate-400">Cas Pratique Entreprise</span>
          )}

          {project.featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40 text-[11px] font-bold">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              Projet Phare
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
          {project.title}
        </h3>

        {/* Problem Statement */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {project.problem_statement}
        </p>

        {/* Impact Metrics Callout (FCFA / KPI) */}
        {project.impact_metrics && (
          <div className="p-3 bg-brand-50/60 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900/40 rounded-xl flex items-center gap-2.5">
            <TrendingUp className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
            <span className="text-xs font-bold text-brand-900 dark:text-brand-200">
              Impact : {project.impact_metrics}
            </span>
          </div>
        )}

        {/* Solution summary */}
        {project.solution_summary && (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
            Démarche : {project.solution_summary}
          </p>
        )}
      </div>

      {/* Footer: Tools badges & Link */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Tools pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {project.tools_used.map((tool) => {
            const conf = toolBadgeConfig[tool] || {
              label: tool,
              bg: 'bg-slate-100 text-slate-700',
              icon: null,
            };
            return (
              <span
                key={tool}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${conf.bg}`}
              >
                {conf.icon}
                {conf.label}
              </span>
            );
          })}
        </div>

        {/* Original Mission link */}
        {project.mission_slug ? (
          <Link
            href={`/missions/${project.mission_slug}`}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 flex items-center gap-1 min-h-[36px]"
          >
            <span>Voir l&apos;étude de cas</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Database className="w-3.5 h-3.5" />
            {project.dataset_name}
          </span>
        )}
      </div>
    </article>
  );
};
