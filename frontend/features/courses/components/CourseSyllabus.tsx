'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ModuleCurriculum, LessonType } from '../types';
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  PlayCircle,
  Code,
  HelpCircle,
  Award,
  Sparkles,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface CourseSyllabusProps {
  courseSlug: string;
  modules: ModuleCurriculum[];
  activeLessonSlug?: string;
  isCompact?: boolean;
  completedLessonSlugs?: string[];
}

const getLessonIcon = (type: LessonType) => {
  switch (type) {
    case 'video':
      return <PlayCircle className="w-4 h-4 text-brand-teal" />;
    case 'exercise':
      return <Code className="w-4 h-4 text-brand-primary" />;
    case 'quiz':
      return <HelpCircle className="w-4 h-4 text-amber-600" />;
    case 'project':
      return <Award className="w-4 h-4 text-emerald-600" />;
    case 'text':
    default:
      return <BookOpen className="w-4 h-4 text-slate-600" />;
  }
};

export const CourseSyllabus: React.FC<CourseSyllabusProps> = ({
  courseSlug,
  modules,
  activeLessonSlug,
  isCompact = false,
  completedLessonSlugs = [],
}) => {
  const tLesson = useTranslations('Lesson');
  const tCommon = useTranslations('Common');

  // By default, expand all modules or the module containing activeLesson
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>(() => {
    const initialState: Record<number, boolean> = {};
    modules.forEach((mod) => {
      const hasActive = mod.lessons.some((l) => l.slug === activeLessonSlug);
      initialState[mod.id] = hasActive || mod.order <= 2;
    });
    return initialState;
  });

  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {modules.map((moduleItem, index) => {
        const isExpanded = !!expandedModules[moduleItem.id];
        const totalDuration = moduleItem.lessons.reduce((acc, l) => acc + l.duration_minutes, 0);

        return (
          <div
            key={moduleItem.id}
            className={`rounded-2xl border transition-all ${
              isCompact
                ? 'bg-white border-brand-border/80'
                : 'bg-white border-brand-border shadow-2xs hover:border-brand-teal/40'
            }`}
          >
            {/* Module Accordion Header */}
            <button
              type="button"
              onClick={() => toggleModule(moduleItem.id)}
              aria-expanded={isExpanded}
              className="w-full text-left p-3.5 sm:p-4 flex items-center justify-between gap-3 min-h-[52px] select-none rounded-2xl hover:bg-slate-50/70 transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0">
                <span className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200/60 text-brand-teal font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-brand-primary leading-snug truncate">
                    {moduleItem.title}
                  </h3>
                  {moduleItem.description && !isCompact && (
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {moduleItem.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 text-slate-400">
                <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {totalDuration} {tCommon('minutes')}
                  </span>
                </span>
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-slate-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                )}
              </div>
            </button>

            {/* Lessons List inside Module */}
            {isExpanded && (
              <div className="px-2 pb-2.5 pt-1 space-y-1 border-t border-slate-100">
                {moduleItem.lessons.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2 px-3">
                    {tLesson('noLessonsInModule')}
                  </p>
                ) : (
                  moduleItem.lessons.map((lesson) => {
                    const isActive = lesson.slug === activeLessonSlug;
                    const isCompleted = completedLessonSlugs.includes(lesson.slug);

                    return (
                      <Link
                        key={lesson.id}
                        href={`/courses/${courseSlug}/lessons/${lesson.slug}`}
                        className={`group flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-xl min-h-[48px] transition-all ${
                          isActive
                            ? 'bg-teal-50/80 text-brand-teal border border-brand-teal/20 font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-700'
                                : isActive
                                ? 'bg-brand-teal text-white'
                                : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              getLessonIcon(lesson.lesson_type)
                            )}
                          </div>

                          <div className="min-w-0">
                            <span
                              className={`text-xs sm:text-sm line-clamp-1 ${
                                isActive ? 'text-brand-teal font-bold' : 'text-slate-800'
                              }`}
                            >
                              {lesson.title}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {lesson.is_free_preview && (
                            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                              <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                              {tLesson('freePreviewBadge')}
                            </span>
                          )}

                          <span className="text-[11px] text-brand-muted font-medium tabular-nums">
                            {lesson.duration_minutes} {tCommon('minutes')}
                          </span>

                          {isCompleted ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          ) : isActive ? (
                            <span className="w-2 h-2 rounded-full bg-brand-teal shrink-0" />
                          ) : null}
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
