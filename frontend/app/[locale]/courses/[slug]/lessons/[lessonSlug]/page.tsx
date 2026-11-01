import React from 'react';
import { notFound } from 'next/navigation';
import { AppHeader } from '@/components/AppHeader';
import { DesktopSidebar } from '@/components/DesktopSidebar';
import { coursesService, LessonReader, LessonDetail, CourseDetail } from '@/features/courses';

interface LessonPageProps {
  params: Promise<{
    slug: string;
    lessonSlug: string;
    locale: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonSlug, locale } = await params;

  let lesson: LessonDetail | null = null;
  let course: CourseDetail | null = null;

  try {
    const [fetchedLesson, fetchedCourse] = await Promise.all([
      coursesService.getLessonDetail(slug, lessonSlug, locale),
      coursesService.getCourseBySlug(slug, locale).catch(() => null),
    ]);
    lesson = fetchedLesson;
    course = fetchedCourse;
  } catch {
    lesson = null;
  }

  if (!lesson) {
    notFound();
  }

  return (
    <div className="flex min-h-screen bg-brand-canvas text-brand-text">
      {/* Desktop Persistent Left Sidebar */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 xl:pl-72">
        <AppHeader />

        <div className="flex-1 w-full pt-16">
          <LessonReader
            lesson={lesson}
            modules={course?.modules || []}
            locale={locale}
          />
        </div>
      </div>
    </div>
  );
}
