'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';
import { DesktopSidebar } from '@/components/DesktopSidebar';
import { useAuth } from '@/features/auth';
import { coursesService, CourseSummary, QualityCheckData } from '@/features/courses';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  AlertTriangle,
  RotateCcw,
  Check,
  Lock,
} from 'lucide-react';

interface CourseCardState {
  course: CourseSummary;
  quality: QualityCheckData | null;
  isLoadingQuality: boolean;
  isToggling: boolean;
  message: string | null;
  isExpanded: boolean;
}

export default function InstructorPage() {
  const t = useTranslations('Instructor');
  const { user, isAuthenticated, isLoading } = useAuth();

  const [courses, setCourses] = useState<CourseCardState[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState<boolean>(true);

  // Load all courses
  useEffect(() => {
    let isMounted = true;
    setIsLoadingCourses(true);

    coursesService
      .getCourses()
      .then(async (fetchedCourses) => {
        if (!isMounted) return;

        const initialCards: CourseCardState[] = fetchedCourses.map((c) => ({
          course: c,
          quality: null,
          isLoadingQuality: true,
          isToggling: false,
          message: null,
          isExpanded: false,
        }));
        setCourses(initialCards);

        // Fetch quality checklist for each course
        for (const item of fetchedCourses) {
          try {
            const qualityData = await coursesService.getCourseQualityCheck(item.slug);
            if (isMounted) {
              setCourses((prev) =>
                prev.map((card) =>
                  card.course.slug === item.slug
                    ? { ...card, quality: qualityData, isLoadingQuality: false }
                    : card
                )
              );
            }
          } catch {
            if (isMounted) {
              setCourses((prev) =>
                prev.map((card) =>
                  card.course.slug === item.slug
                    ? { ...card, isLoadingQuality: false }
                    : card
                )
              );
            }
          }
        }
      })
      .catch(() => {
        if (isMounted) setCourses([]);
      })
      .finally(() => {
        if (isMounted) setIsLoadingCourses(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTogglePublication = async (courseSlug: string, currentPublished: boolean) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.course.slug === courseSlug ? { ...c, isToggling: true, message: null } : c
      )
    );

    try {
      const res = await coursesService.toggleCoursePublication(courseSlug, !currentPublished);
      setCourses((prev) =>
        prev.map((c) =>
          c.course.slug === courseSlug
            ? {
                ...c,
                isToggling: false,
                course: { ...c.course, is_published: res.is_published },
                quality: res.quality,
                message: res.message,
              }
            : c
        )
      );
    } catch {
      setCourses((prev) =>
        prev.map((c) =>
          c.course.slug === courseSlug
            ? {
                ...c,
                isToggling: false,
                message: 'Action refusée : le cours ne remplit pas tous les critères de publication.',
              }
            : c
        )
      );
    }
  };

  const toggleExpand = (courseSlug: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.course.slug === courseSlug ? { ...c, isExpanded: !c.isExpanded } : c
      )
    );
  };

  const isInstructorOrAdmin =
    user?.is_staff || user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR';

  return (
    <div className="flex min-h-screen bg-brand-canvas text-brand-text">
      {/* Desktop Persistent Left Sidebar */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 xl:pl-72">
        <AppHeader />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pb-12 min-h-[calc(100vh-4rem)]">
          <div className="flex flex-col gap-6">
            
            {/* Header Hero Banner */}
            <section className="bg-white rounded-2xl p-5 sm:p-6 border border-brand-border shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/60 text-amber-900 text-[11px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Contrôle Qualité ADDIE & 5 Piliers</span>
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-brand-primary tracking-tight">
                  {t('title')}
                </h1>
                <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-2xl leading-relaxed">
                  {t('subtitle')}
                </p>
              </div>

              {/* Django Admin Access Button */}
              <div className="shrink-0">
                <a
                  href="http://localhost:8000/admin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-300 text-amber-950 text-xs sm:text-sm font-bold flex items-center gap-2 transition shadow-2xs active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>{t('adminLink')}</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1 text-amber-700" />
                </a>
              </div>
            </section>

            {/* Access Warning if not signed in as instructor/admin */}
            {!isLoading && !isInstructorOrAdmin && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <p>
                  <strong>Accès restreint :</strong> Vous consultez cette page en aperçu. La modification et la publication de cours requièrent un compte avec le rôle <code>INSTRUCTOR</code> ou <code>ADMIN</code>.
                </p>
              </div>
            )}

            {/* Courses Quality Checklist Cards List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-brand-primary">
                  {t('qualityChecklistTitle')}
                </h2>
                <span className="text-xs text-brand-muted font-medium">
                  {courses.length} cours répertorié(s)
                </span>
              </div>

              {isLoadingCourses ? (
                <div className="p-12 text-center text-xs text-brand-muted bg-white rounded-2xl border border-brand-border">
                  Chargement des formations et analyse de conformité...
                </div>
              ) : courses.length === 0 ? (
                <div className="p-12 text-center text-xs text-brand-muted bg-white rounded-2xl border border-brand-border">
                  {t('noCourses')}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {courses.map((card) => {
                    const q = card.quality;
                    const isLive = card.course.is_published ?? (q ? q.is_published : true);
                    const canPublish = q ? q.can_publish : false;
                    const score = q ? q.score_percentage : 0;

                    return (
                      <div
                        key={card.course.id}
                        className="bg-white rounded-2xl border border-brand-border shadow-2xs overflow-hidden transition-all"
                      >
                        {/* Course Header Bar */}
                        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                  isLive
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : 'bg-slate-100 text-slate-700 border-slate-300'
                                }`}
                              >
                                {isLive ? t('publishedBadge') : t('draftBadge')}
                              </span>

                              <span className="text-[11px] font-bold uppercase text-brand-teal px-2 py-0.5 rounded bg-teal-50 border border-teal-200/50">
                                {card.course.tool}
                              </span>

                              <span className="text-xs text-brand-muted truncate">
                                /{card.course.slug}
                              </span>
                            </div>

                            <h3 className="text-base sm:text-lg font-bold text-brand-primary truncate">
                              {card.course.title}
                            </h3>
                          </div>

                          {/* Quality Score Badge & Action Toggle Button */}
                          <div className="flex items-center gap-2.5 shrink-0">
                            {/* Score pill */}
                            <div className="text-right mr-1">
                              <span className="text-[11px] text-brand-muted block font-medium">
                                {t('scoreLabel')}
                              </span>
                              <span
                                className={`text-base font-black tabular-nums ${
                                  score === 100
                                    ? 'text-emerald-600'
                                    : score >= 70
                                    ? 'text-amber-600'
                                    : 'text-red-600'
                                }`}
                              >
                                {score}%
                              </span>
                            </div>

                            {/* Publish / Unpublish Toggle Action */}
                            <button
                              type="button"
                              onClick={() => handleTogglePublication(card.course.slug, isLive)}
                              disabled={card.isToggling || (!isLive && !canPublish)}
                              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition active:scale-95 flex items-center gap-2 shadow-2xs ${
                                isLive
                                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                                  : canPublish
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                              }`}
                            >
                              {card.isToggling ? (
                                <span>Mise à jour...</span>
                              ) : isLive ? (
                                <span>{t('unpublishAction')}</span>
                              ) : canPublish ? (
                                <>
                                  <Sparkles className="w-4 h-4 text-emerald-200" />
                                  <span>{t('publishAction')}</span>
                                </>
                              ) : (
                                <>
                                  <Lock className="w-3.5 h-3.5" />
                                  <span>{t('publicationBlocked')}</span>
                                </>
                              )}
                            </button>

                            {/* Expand Checklist Toggle */}
                            <button
                              type="button"
                              onClick={() => toggleExpand(card.course.slug)}
                              className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center hover:bg-slate-100 border border-brand-border text-slate-600 transition"
                              aria-label="Afficher la checklist"
                            >
                              {card.isExpanded ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Inline Feedback Banner if toggled */}
                        {card.message && (
                          <div className="px-5 py-2.5 bg-amber-50/70 border-t border-b border-amber-200 text-xs text-amber-900 font-medium">
                            {card.message}
                          </div>
                        )}

                        {/* Progress Bar of Quality Checklist */}
                        <div className="w-full bg-slate-100 h-1.5 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              score === 100
                                ? 'bg-emerald-500'
                                : score >= 70
                                ? 'bg-amber-500'
                                : 'bg-red-400'
                            }`}
                            style={{ width: `${score}%` }}
                          />
                        </div>

                        {/* Expandable Checklist Details (7 Criteria) */}
                        {card.isExpanded && q && (
                          <div className="p-4 sm:p-5 bg-brand-canvas-alt border-t border-brand-border space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted">
                              Détail des 5 piliers et critères d'accréditation pédagogique :
                            </h4>

                            <div className="grid grid-cols-1 gap-2.5">
                              {q.checklist.map((item) => (
                                <div
                                  key={item.key}
                                  className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                                    item.is_valid
                                      ? 'bg-white border-emerald-200/80 text-emerald-950'
                                      : 'bg-white border-red-200/80 text-red-950'
                                  }`}
                                >
                                  {item.is_valid ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                  ) : (
                                    <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                  )}
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold leading-snug">
                                      {item.title}
                                    </p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                      {item.detail}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}

