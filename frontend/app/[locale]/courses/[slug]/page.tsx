import React from 'react';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';
import { DesktopSidebar } from '@/components/DesktopSidebar';
import { Badge } from '@/ui/Badge';
import { coursesService, CourseSyllabus, CourseDetail } from '@/features/courses';
import {
  Clock,
  BookOpen,
  Play,
  Sparkles,
  Award,
  ChevronLeft,
  Layers,
} from 'lucide-react';

interface CoursePageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { slug, locale } = await params;
  const tCourse = await getTranslations({ locale, namespace: 'Course' });

  let course: CourseDetail | null = null;
  try {
    course = await coursesService.getCourseBySlug(slug, locale);
  } catch {
    // If backend isn't ready or course slug not found
    course = null;
  }

  if (!course) {
    notFound();
  }

  // Find the first lesson to start the course
  const firstModule = course.modules?.[0];
  const firstLesson = firstModule?.lessons?.[0];
  const startLessonUrl = firstLesson
    ? `/courses/${course.slug}/lessons/${firstLesson.slug}`
    : `/courses/${course.slug}`;

  const isFree = course.price_tier === 'free';

  return (
    <div className="flex min-h-screen bg-brand-canvas text-brand-text">
      {/* Desktop Persistent Left Sidebar */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 xl:pl-72">
        <AppHeader />

        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pb-12 min-h-[calc(100vh-4rem)]">
          {/* Breadcrumb back to Catalog */}
          <div className="mb-4">
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-teal hover:underline min-h-[44px] px-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{tCourse('backToCatalog')}</span>
            </Link>
          </div>

          {/* Hero Section */}
          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-brand-border shadow-2xs mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {isFree ? (
                <Badge variant="teal" icon={<Sparkles className="w-3.5 h-3.5 text-brand-teal" />}>
                  {tCourse('freeBadge')}
                </Badge>
              ) : (
                <Badge variant="amber" icon={<Award className="w-3.5 h-3.5 text-amber-700" />}>
                  {course.price_tier === 'essential'
                    ? tCourse('essentialBadge')
                    : tCourse('proBadge')}
                </Badge>
              )}

              <Badge variant="neutral">
                {course.level === 'debutant'
                  ? tCourse('beginner')
                  : course.level === 'intermediaire'
                  ? tCourse('intermediate')
                  : tCourse('advanced')}
              </Badge>

              {course.track?.name && (
                <span className="text-xs font-semibold text-brand-teal bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/50">
                  {course.track.name}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-primary leading-tight mb-3">
              {course.title}
            </h1>

            {course.subtitle && (
              <p className="text-base sm:text-lg text-slate-600 font-medium mb-5 max-w-3xl leading-relaxed">
                {course.subtitle}
              </p>
            )}

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 py-3 border-y border-slate-100 text-xs sm:text-sm text-slate-600 mb-6">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-teal" />
                <span className="font-semibold text-slate-900">{course.duration_hours}h</span>
                <span>{tCourse('estimatedDuration')}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-brand-primary" />
                <span className="font-semibold text-slate-900">{course.lessons_count}</span>
                <span>{tCourse('lessonsTotal')}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-600" />
                <span className="font-semibold text-slate-900">{course.modules_count}</span>
                <span>{tCourse('modulesTotal')}</span>
              </div>
            </div>

            {/* CTA Start Course Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href={startLessonUrl}
                className="min-h-[50px] px-6 rounded-2xl bg-brand-primary hover:bg-brand-primary-dark text-white font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] shadow-xs"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{tCourse('startLearningNow')}</span>
              </Link>
            </div>
          </div>

          {/* Description & Learning Outcomes */}
          {course.description && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-brand-border shadow-2xs mb-8">
              <h2 className="text-lg sm:text-xl font-bold text-brand-primary mb-3">
                {tCourse('aboutThisCourse')}
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {course.description}
              </p>
            </div>
          )}

          {/* Syllabus Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-brand-primary">
                  {tCourse('curriculumTitle')}
                </h2>
                <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
                  {tCourse('curriculumSubtitle', {
                    modules: course.modules_count,
                    lessons: course.lessons_count,
                  })}
                </p>
              </div>
            </div>

            <CourseSyllabus
              courseSlug={course.slug}
              modules={course.modules || []}
            />
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
