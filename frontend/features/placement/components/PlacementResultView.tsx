'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  Compass, 
  Table, 
  Terminal, 
  FileCode, 
  BarChart3, 
  Sparkles,
  Share2
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Button } from '@/ui/Button';
import { PlacementResult } from '../types';

interface PlacementResultViewProps {
  result: PlacementResult;
  onRetake: () => void;
}

export const PlacementResultView: React.FC<PlacementResultViewProps> = ({ result, onRetake }) => {
  const t = useTranslations('Placement');

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'N3':
        return 'from-purple-600 to-indigo-700 text-white';
      case 'N2':
        return 'from-blue-600 to-cyan-600 text-white';
      default:
        return 'from-emerald-600 to-teal-700 text-white';
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'N3':
        return t('levelN3');
      case 'N2':
        return t('levelN2');
      default:
        return t('levelN1');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Hero Recommendation Header */}
      <div className={`rounded-3xl p-6 sm:p-8 shadow-lg bg-gradient-to-br ${getLevelColor(result.recommended_level)} flex flex-col md:flex-row md:items-center justify-between gap-6`}>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div className="flex flex-col text-white">
            <span className="text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              {t('badge')}
            </span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">
              {getLevelBadge(result.recommended_level)}
            </h1>
            <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-xl leading-relaxed">
              {t('congrats', { score: Math.round(result.score_total) })}
            </p>
          </div>
        </div>

        {/* Global Score Circle */}
        <div className="self-end md:self-center shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col items-center justify-center text-white min-w-[120px]">
          <span className="text-3xl font-black">{Math.round(result.score_total)}%</span>
          <span className="text-[11px] font-bold text-white/80 uppercase">{t('globalScore')}</span>
        </div>
      </div>

      {/* Tool Breakdown Gauges (Grid 4 tools) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Excel */}
        <div className="bg-white rounded-2xl border border-brand-border p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Table className="w-4 h-4 text-emerald-600" />
              {t('toolExcel')}
            </span>
            <span className="text-xs font-black text-slate-900">{Math.round(result.score_excel)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${result.score_excel}%` }}
            />
          </div>
        </div>

        {/* SQL */}
        <div className="bg-white rounded-2xl border border-brand-border p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-sky-600" />
              {t('toolSql')}
            </span>
            <span className="text-xs font-black text-slate-900">{Math.round(result.score_sql)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full"
              style={{ width: `${result.score_sql}%` }}
            />
          </div>
        </div>

        {/* Python */}
        <div className="bg-white rounded-2xl border border-brand-border p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-amber-600" />
              {t('toolPython')}
            </span>
            <span className="text-xs font-black text-slate-900">{Math.round(result.score_python)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${result.score_python}%` }}
            />
          </div>
        </div>

        {/* Power BI */}
        <div className="bg-white rounded-2xl border border-brand-border p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              {t('toolPowerbi')}
            </span>
            <span className="text-xs font-black text-slate-900">{Math.round(result.score_powerbi)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${result.score_powerbi}%` }}
            />
          </div>
        </div>
      </div>

      {/* Recommended Main Course Card */}
      {result.recommended_course && (
        <div className="bg-white rounded-3xl border border-brand-primary/40 p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0">
              <Compass className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t('mainCourseBadge')}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                {result.recommended_course.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                {result.recommended_course.description || 'Apprenez par la pratique sur des cas réels d\'entreprises avec nos laboratoires intégrés.'}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link
              href={`/courses/${result.recommended_course.slug}`}
              className="px-6 py-3.5 rounded-2xl bg-brand-primary text-white font-bold text-sm shadow-md hover:bg-brand-primary/95 active:scale-95 transition-all flex items-center gap-2 min-h-[48px]"
            >
              {t('joinCourse')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Target Courses Grid (All tools for this level) */}
      {result.target_courses && result.target_courses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-teal">
                {t('targetCoursesBadge')}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-brand-primary mt-0.5">
                {t('targetCoursesTitle', { level: result.recommended_level })}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.target_courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl p-5 border border-brand-border shadow-2xs flex flex-col justify-between hover:border-brand-teal/50 transition-all space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-brand-teal bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/50">
                      {course.track_name || 'Analyse de données'}
                    </span>
                    {course.duration_hours && (
                      <span className="text-[11px] font-semibold text-slate-500">
                        {course.duration_hours}h
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {course.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <Link
                    href={`/courses/${course.slug}`}
                    className="w-full min-h-[40px] px-3.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
                  >
                    <span>{t('startCourse')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Retake & Info Footer */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          {t('xapiSync')}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={onRetake}
          className="flex items-center gap-1.5 text-xs font-semibold self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {t('retakeTest')}
        </Button>
      </div>
    </div>
  );
};

