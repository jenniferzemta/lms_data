'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { NavigationLesson } from '../types';
import { ChevronLeft, ChevronRight, Menu, CheckCircle2 } from 'lucide-react';

interface LessonBottomBarProps {
  courseSlug: string;
  previousLesson: NavigationLesson | null;
  nextLesson: NavigationLesson | null;
  onOpenSyllabus?: () => void;
}

export const LessonBottomBar: React.FC<LessonBottomBarProps> = ({
  courseSlug,
  previousLesson,
  nextLesson,
  onOpenSyllabus,
}) => {
  const tLesson = useTranslations('Lesson');

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-brand-border shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        {/* Previous Lesson Button */}
        {previousLesson ? (
          <Link
            href={`/courses/${courseSlug}/lessons/${previousLesson.slug}`}
            className="min-h-[44px] min-w-[44px] px-3 sm:px-4 rounded-xl border border-brand-border bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm inline-flex items-center gap-1.5 transition-all active:scale-[0.98] shadow-2xs"
            aria-label={`${tLesson('previous')}: ${previousLesson.title}`}
          >
            <ChevronLeft className="w-4 h-4 text-brand-muted shrink-0" />
            <span className="hidden xs:inline">{tLesson('previous')}</span>
          </Link>
        ) : (
          <div
            aria-hidden="true"
            className="min-h-[44px] min-w-[44px] px-3 sm:px-4 rounded-xl border border-slate-100 bg-slate-50 text-slate-300 font-medium text-xs sm:text-sm inline-flex items-center gap-1.5 cursor-not-allowed select-none"
          >
            <ChevronLeft className="w-4 h-4 text-slate-300 shrink-0" />
            <span className="hidden xs:inline">{tLesson('previous')}</span>
          </div>
        )}

        {/* Center Syllabus Drawer / Modal trigger */}
        {onOpenSyllabus && (
          <button
            type="button"
            onClick={onOpenSyllabus}
            className="min-h-[44px] px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs inline-flex items-center gap-1.5 transition-colors"
          >
            <Menu className="w-3.5 h-3.5 text-brand-teal" />
            <span>{tLesson('syllabusDrawerButton')}</span>
          </button>
        )}

        {/* Next Lesson or Finish Button */}
        {nextLesson ? (
          <Link
            href={`/courses/${courseSlug}/lessons/${nextLesson.slug}`}
            className="min-h-[44px] min-w-[44px] px-4 sm:px-5 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-1.5 transition-all active:scale-[0.98] shadow-xs"
            aria-label={`${tLesson('next')}: ${nextLesson.title}`}
          >
            <span className="truncate max-w-[140px] sm:max-w-[200px]">
              {tLesson('next')}
            </span>
            <ChevronRight className="w-4 h-4 text-white shrink-0" />
          </Link>
        ) : (
          <Link
            href={`/courses/${courseSlug}`}
            className="min-h-[44px] min-w-[44px] px-4 sm:px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-1.5 transition-all active:scale-[0.98] shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
            <span>{tLesson('finishCourse')}</span>
          </Link>
        )}
      </div>
    </footer>
  );
};
