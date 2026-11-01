'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { LessonDetail, ModuleCurriculum } from '../types';
import { FallbackLanguageBanner } from './FallbackLanguageBanner';
import { CourseSyllabus } from './CourseSyllabus';
import { LessonBottomBar } from './LessonBottomBar';
import {
  Clock,
  Sparkles,
  BookOpen,
  FileDown,
  Copy,
  Check,
  Zap,
  Volume2,
  X,
  ChevronLeft,
  Share2,
} from 'lucide-react';

interface LessonReaderProps {
  lesson: LessonDetail;
  modules?: ModuleCurriculum[];
  locale: string;
}

export const LessonReader: React.FC<LessonReaderProps> = ({
  lesson,
  modules = [],
  locale,
}) => {
  const tLesson = useTranslations('Lesson');
  const tCommon = useTranslations('Common');

  const [copiedCode, setCopiedCode] = useState(false);
  const [isDataSaver, setIsDataSaver] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem('datamboa_data_saver') === 'true';
    } catch {
      return false;
    }
  });
  const [isSyllabusDrawerOpen, setIsSyllabusDrawerOpen] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleCopyCode = async () => {
    if (!lesson.translation?.code_snippet) return;
    try {
      await navigator.clipboard.writeText(lesson.translation.code_snippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Clipboard write failed
    }
  };

  const handleShare = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: lesson.translation?.title || lesson.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      }
    } catch {
      // Ignored
    }
  };

  const { translation } = lesson;

  return (
    <div className="relative min-h-screen pb-24 sm:pb-28">
      {/* Top Header / Breadcrumb */}
      <header className="sticky top-16 z-20 bg-white/90 backdrop-blur-md border-b border-brand-border py-2.5 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <Link
            href={`/courses/${lesson.course_slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-teal hover:underline min-h-[44px] px-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="truncate max-w-[160px] sm:max-w-[260px]">
              {lesson.course_title}
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              aria-label="Partager cette leçon"
              className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-brand-muted hover:text-brand-primary hover:bg-slate-100 transition-colors"
            >
              {shareSuccess ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        {/* Bilingual Fallback Banner if translation is not finalized in requested locale */}
        {lesson.is_fallback_language && (
          <FallbackLanguageBanner currentLang={locale} />
        )}

        {/* Lesson Header Information */}
        <section className="mb-6 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {lesson.module_title}
            </span>

            {lesson.is_free_preview && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                {tLesson('freePreviewBadge')}
              </span>
            )}

            <div className="flex items-center gap-1 text-xs text-brand-muted ml-auto">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {lesson.duration_minutes} {tCommon('minutes')}
              </span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-primary leading-tight">
            {translation.title || lesson.title}
          </h1>

          {translation.summary && (
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {translation.summary}
            </p>
          )}
        </section>

        {/* Video Player or Data Saver Audio Mode */}
        {translation.video_url && (
          <section className="mb-8 rounded-2xl overflow-hidden border border-brand-border bg-slate-900 shadow-sm">
            {isDataSaver ? (
              <div className="p-6 text-white text-center space-y-3 bg-gradient-to-br from-slate-900 to-brand-primary">
                <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center mx-auto">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base">
                  {tLesson('lightModeNotice')}
                </h3>
                {translation.audio_url && (
                  <div className="pt-2 max-w-md mx-auto">
                    <audio
                      controls
                      src={translation.audio_url}
                      className="w-full h-10 rounded-lg"
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setIsDataSaver(false)}
                  className="mt-2 text-xs text-teal-300 hover:underline min-h-[44px] px-3 inline-flex items-center"
                >
                  {tLesson('showVideoAnyway')}
                </button>
              </div>
            ) : (
              <div className="relative aspect-video w-full bg-black">
                {translation.video_url.includes('youtube.com') ||
                translation.video_url.includes('youtu.be') ? (
                  <iframe
                    src={translation.video_url}
                    title={translation.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <video
                    controls
                    src={translation.video_url}
                    poster={translation.pdf_url}
                    className="w-full h-full object-contain"
                  >
                    <track kind="captions" />
                    Votre navigateur ne prend pas en charge la lecture vidéo.
                  </video>
                )}
              </div>
            )}
          </section>
        )}

        {/* Audio Player (if video is not present or supplementary audio) */}
        {!translation.video_url && translation.audio_url && (
          <section className="mb-6 p-4 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-teal text-white flex items-center justify-center shrink-0">
              <Volume2 className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-brand-teal block">
                {tLesson('audioVersionTitle')}
              </span>
              <audio
                controls
                src={translation.audio_url}
                className="w-full h-9 mt-1.5"
              />
            </div>
          </section>
        )}

        {/* Rich Lesson Body Content */}
        {translation.content && (
          <article className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-4 mb-8">
            {translation.content.split('\n\n').map((paragraph, idx) => {
              const trimmed = paragraph.trim();
              if (trimmed.startsWith('## ')) {
                return (
                  <h2
                    key={idx}
                    className="text-lg sm:text-xl font-bold text-brand-primary mt-6 mb-2 border-b border-slate-100 pb-2"
                  >
                    {trimmed.replace('## ', '')}
                  </h2>
                );
              }
              if (trimmed.startsWith('### ')) {
                return (
                  <h3
                    key={idx}
                    className="text-base sm:text-lg font-semibold text-brand-primary mt-4 mb-1"
                  >
                    {trimmed.replace('### ', '')}
                  </h3>
                );
              }
              if (trimmed.startsWith('- ')) {
                const items = trimmed.split('\n- ').map((item) => item.replace(/^- /, ''));
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-1 my-2">
                    {items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="text-slate-700">
                  {trimmed}
                </p>
              );
            })}
          </article>
        )}

        {/* Formula / Code Snippet Block */}
        {translation.code_snippet && (
          <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 text-slate-100 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/80 border-b border-slate-700/60">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400">
                {tLesson('codeSnippetTitle')}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="min-h-[44px] px-3 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{tLesson('codeCopied')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{tLesson('copyCode')}</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-xs sm:text-sm font-mono overflow-x-auto text-teal-200 leading-normal">
              <code>{translation.code_snippet}</code>
            </pre>
          </section>
        )}

        {/* Downloadable Exercise Files / PDF */}
        {translation.pdf_url && (
          <section className="mb-8 p-4 sm:p-5 rounded-2xl bg-white border border-brand-border shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-brand-primary-light text-brand-primary flex items-center justify-center shrink-0">
                <FileDown className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-brand-primary">
                  {tLesson('downloadFiles')}
                </h4>
                <p className="text-xs text-brand-muted">
                  Fichier d&apos;exercice au format pratique (Excel / PDF)
                </p>
              </div>
            </div>

            <a
              href={translation.pdf_url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-4 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold text-xs inline-flex items-center gap-2 transition-all active:scale-95 shadow-2xs"
            >
              <FileDown className="w-4 h-4" />
              <span>Télécharger</span>
            </a>
          </section>
        )}
      </main>

      {/* Slide-over Syllabus Drawer for Course Modules */}
      {isSyllabusDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity"
        >
          <div className="w-full max-w-md bg-brand-canvas h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-brand-border flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-teal" />
                <h3 className="font-bold text-sm text-brand-primary">
                  {tLesson('syllabusDrawerTitle')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSyllabusDrawerOpen(false)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100"
                aria-label="Fermer le sommaire"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <CourseSyllabus
                courseSlug={lesson.course_slug}
                modules={modules}
                activeLessonSlug={lesson.slug}
                isCompact
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Fixed Thumb-Navigation Bottom Bar */}
      <LessonBottomBar
        courseSlug={lesson.course_slug}
        previousLesson={lesson.previous_lesson}
        nextLesson={lesson.next_lesson}
        onOpenSyllabus={modules.length > 0 ? () => setIsSyllabusDrawerOpen(true) : undefined}
      />
    </div>
  );
};
