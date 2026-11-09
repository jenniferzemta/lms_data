'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { LessonDetail, ModuleCurriculum, CourseProgress, LessonNote, LessonQuestion, Certificate } from '../types';
import { coursesService } from '../services/courses.service';
import { FallbackLanguageBanner } from './FallbackLanguageBanner';
import { CourseSyllabus } from './CourseSyllabus';
import { LessonAttachmentsList } from './LessonAttachmentsList';
import { LessonContentRenderer } from './LessonContentRenderer';
import { LessonQuizInteractive } from './LessonQuizInteractive';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  Maximize,
  Check,
  Copy,
  Zap,
  Clock,
  BookOpen,
  Edit3,
  MessageSquare,
  Share2,
  List,
  CheckCircle2,
  Lightbulb,
  FileSpreadsheet,
  FileText,
  Download,
  Send,
  HelpCircle,
  Sparkles,
  Loader2,
  Trash2,
  Plus,
  Award,
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
  const router = useRouter();
  const tLesson = useTranslations('Lesson');
  const tCommon = useTranslations('Common');

  // Interactive tab state
  const [activeTab, setActiveTab] = useState<'content' | 'notes' | 'qa'>('content');

  // Video state
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isDataSaver, setIsDataSaver] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem('datamboa_data_saver') === 'true';
    } catch {
      return false;
    }
  });

  // UI state & Progression
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [earnedCertificate, setEarnedCertificate] = useState<Certificate | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [isSyllabusDrawerOpen, setIsSyllabusDrawerOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Notes state (F1.9)
  const [notes, setNotes] = useState<LessonNote[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteInput, setNewNoteInput] = useState('');

  // Questions & Answers state (F1.10)
  const [questions, setQuestions] = useState<LessonQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const [showAskQuestionForm, setShowAskQuestionForm] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [replyInputs, setReplyInputs] = useState<Record<number, string>>({});
  const [isSubmittingReply, setIsSubmittingReply] = useState<Record<number, boolean>>({});

  // Fetch course progression, notes and community questions
  useEffect(() => {
    let isMounted = true;
    coursesService.getCourseProgress(lesson.course_slug).then((prog) => {
      if (isMounted) setProgress(prog);
    });

    coursesService.getCourseCertificate(lesson.course_slug).then((cert) => {
      if (isMounted) setEarnedCertificate(cert);
    }).catch(() => {});

    setIsLoadingNotes(true);
    coursesService.getLessonNotes(lesson.course_slug, lesson.slug).then((res) => {
      if (isMounted) {
        setNotes(res);
        setIsLoadingNotes(false);
      }
    });

    setIsLoadingQuestions(true);
    coursesService.getLessonQuestions(lesson.course_slug, lesson.slug).then((res) => {
      if (isMounted) {
        setQuestions(res);
        setIsLoadingQuestions(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [lesson.course_slug, lesson.slug]);

  const translation = lesson.translation || {
    language: locale,
    title: lesson.title,
    summary: '',
    content: '',
    video_url: '',
    audio_url: '',
    pdf_url: '',
    code_snippet: '',
    status: 'REVIEWED',
  };

  // Video time formatting (MM:SS)
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Video playback toggling
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const cyclePlaybackRate = () => {
    const rates = [1.0, 1.25, 1.5, 0.75];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextRate;
    }
  };

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleCopyCode = async () => {
    if (!translation.code_snippet) return;
    try {
      await navigator.clipboard.writeText(translation.code_snippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Clipboard fallback
    }
  };

  const handleShare = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: translation.title || lesson.title,
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

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteInput.trim() || isAddingNote) return;
    try {
      setIsAddingNote(true);
      const timestamp = Math.floor(currentTime);
      const newNote = await coursesService.createLessonNote(
        lesson.course_slug,
        lesson.slug,
        newNoteInput.trim(),
        timestamp
      );
      setNotes((prev) => [...prev, newNote]);
      setNewNoteInput('');
    } catch {
      // Fallback local note if unauthenticated or offline
      const timeFormatted = formatTime(currentTime);
      setNotes((prev) => [
        ...prev,
        {
          id: Date.now(),
          content: newNoteInput.trim(),
          video_timestamp_seconds: Math.floor(currentTime),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
      setNewNoteInput('');
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    await coursesService.deleteLessonNote(noteId);
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const handleJumpToTimestamp = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionTitle.trim() || isAskingQuestion) return;
    try {
      setIsAskingQuestion(true);
      const newQ = await coursesService.createLessonQuestion(
        lesson.course_slug,
        lesson.slug,
        newQuestionTitle.trim(),
        newQuestionContent.trim()
      );
      setQuestions((prev) => [newQ, ...prev]);
      setNewQuestionTitle('');
      setNewQuestionContent('');
      setShowAskQuestionForm(false);
    } catch {
      // Fallback
    } finally {
      setIsAskingQuestion(false);
    }
  };

  const handleReplyQuestion = async (questionId: number) => {
    const replyText = replyInputs[questionId]?.trim();
    if (!replyText || isSubmittingReply[questionId]) return;
    try {
      setIsSubmittingReply((prev) => ({ ...prev, [questionId]: true }));
      const newAns = await coursesService.createLessonAnswer(questionId, replyText);
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id === questionId) {
            return {
              ...q,
              answers_count: (q.answers_count || 0) + 1,
              answers: [...(q.answers || []), newAns],
            };
          }
          return q;
        })
      );
      setReplyInputs((prev) => ({ ...prev, [questionId]: '' }));
    } catch {
      // Fallback
    } finally {
      setIsSubmittingReply((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  const handleCompleteAndNext = async () => {
    setIsCompleting(true);
    try {
      const res = await coursesService.completeLesson(lesson.course_slug, lesson.slug);
      setProgress(res.summary);

      if (res.summary.progress_percentage >= 100 || !lesson.next_lesson) {
        try {
          const cert = await coursesService.getCourseCertificate(lesson.course_slug);
          setEarnedCertificate(cert);
          setShowCertificateModal(true);
          return;
        } catch {
          // If certificate fetch fails, proceed with normal navigation
        }
      }

      if (lesson.next_lesson) {
        router.push(`/courses/${lesson.course_slug}/lessons/${lesson.next_lesson.slug}`);
      } else {
        router.push(`/courses/${lesson.course_slug}`);
      }
    } catch {
      // Fallback navigation
      if (lesson.next_lesson) {
        router.push(`/courses/${lesson.course_slug}/lessons/${lesson.next_lesson.slug}`);
      } else {
        router.push(`/courses/${lesson.course_slug}`);
      }
    } finally {
      setIsCompleting(false);
    }
  };

  const handleQuizPassed = () => {
    coursesService.getCourseProgress(lesson.course_slug).then((prog) => {
      setProgress(prog);
    });
  };

  // Progression display
  const currentProgressPercent = progress?.progress_percentage ?? (lesson.is_completed ? 100 : 42);

  return (
    <div className="relative min-h-screen bg-[#f8f9ff] text-[#121c2a] flex flex-col font-sans pb-28">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP STICKY HEADER (Exact Stitch Bar)                        */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 w-full bg-[#f8f9ff]/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="h-14 px-3 sm:px-4 max-w-4xl mx-auto flex items-center justify-between gap-2">
          {/* Back button */}
          <Link
            href={`/courses/${lesson.course_slug}`}
            aria-label="Retour au cours"
            className="w-11 h-11 flex items-center justify-center -ml-1 rounded-xl text-slate-700 hover:text-[#006b5f] hover:bg-slate-100 transition-colors shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>

          {/* Centered lesson progress bar & title */}
          <div className="flex-1 flex flex-col justify-center min-w-0 px-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-xs sm:text-sm text-[#121c2a] truncate leading-tight">
                {translation.title || lesson.title}
              </span>
              <span className="text-xs font-bold text-[#006b5f] shrink-0">
                {currentProgressPercent}%
              </span>
            </div>
            <div className="w-full bg-[#dee9fc] h-1 rounded-full overflow-hidden mt-1">
              <div
                className="bg-[#13b8a6] h-full rounded-full transition-all duration-300"
                style={{ width: `${currentProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Right actions: Curriculum drawer toggle & Share */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setIsSyllabusDrawerOpen(true)}
              aria-label="Sommaire du cours"
              className="w-11 h-11 flex items-center justify-center rounded-xl text-slate-700 hover:text-[#006b5f] hover:bg-slate-100 transition-colors"
            >
              <List className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleShare}
              aria-label="Partager la leçon"
              className="w-11 h-11 flex items-center justify-center rounded-xl text-slate-700 hover:text-[#006b5f] hover:bg-slate-100 transition-colors"
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
      {/* ------------------------------------------------------------- */}
      {/* 1.1 CERTIFICATE EARNED TOP BANNER (F1.11)                     */}
      {/* ------------------------------------------------------------- */}
      {earnedCertificate && (
        <div className="bg-gradient-to-r from-amber-500/15 via-teal-500/15 to-amber-500/15 border-b border-amber-300 px-3 py-2.5 flex items-center justify-between text-xs text-amber-950 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#7c5800] shrink-0" />
            <span className="font-semibold">
              Félicitations ! Vous avez validé 100% de la formation. Votre Certificat Officiel est disponible.
            </span>
          </div>
          <Link
            href={`/verify/${earnedCertificate.certificate_code}`}
            className="px-3.5 py-1.5 bg-[#006b5f] hover:bg-[#005249] text-white font-bold rounded-lg shrink-0 ml-2 shadow-xs transition text-xs flex items-center gap-1"
          >
            <span>Voir mon Certificat</span>
          </Link>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. STATUS CONTEXT BAR (Low Data / 3G Indicator)                */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#e6eeff] px-4 py-1.5 flex items-center justify-between border-b border-slate-200/50">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#d29b24] animate-pulse shrink-0" />
            <span className="text-xs text-slate-700 truncate font-medium">
              Mode Éco 3G actif • Optimisé pour connexions douces
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#7c5800] bg-[#ffdea7] px-2 py-0.5 rounded-full shrink-0">
            360p
          </span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto w-full px-3 sm:px-4 pt-4 flex-1">
        {/* Fallback translation banner if needed */}
        {lesson.is_fallback_language && (
          <div className="mb-4">
            <FallbackLanguageBanner currentLang={locale} />
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 3. LESSON PROGRESSION HEADER                                   */}
        {/* ------------------------------------------------------------- */}
        <section className="mb-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#006b5f]">
              {lesson.module_title}
            </span>
            <div className="flex items-center gap-1 text-[#7c5800] bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-bold">+25 pts XP</span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-[#121c2a] mt-1 leading-snug">
            {translation.title || lesson.title}
          </h1>

          <div className="flex items-center gap-3 mt-2">
            <div className="w-full bg-[#dee9fc] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#13b8a6] h-full rounded-full transition-all duration-300"
                style={{ width: `${currentProgressPercent}%` }}
              />
            </div>
            <span className="text-xs text-slate-500 shrink-0 font-medium">
              {currentProgressPercent}% global
            </span>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* 4. VIDEO PLAYER SECTION (16:9 Stitch Styled Frame)            */}
        {/* ------------------------------------------------------------- */}
        <section className="mb-5">
          <div
            ref={videoContainerRef}
            className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between group border border-slate-800"
          >
            {/* Real HTML5 Video element */}
            {translation.video_url ? (
              <video
                ref={videoRef}
                src={translation.video_url}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                onClick={togglePlay}
                playsInline
                className="w-full h-full object-cover cursor-pointer"
              >
                <track kind="captions" />
                Votre navigateur ne prend pas en charge la lecture vidéo.
              </video>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-4 text-center">
                <FileSpreadsheet className="w-12 h-12 text-[#13b8a6] mb-2" />
                <p className="text-sm font-semibold text-slate-200">
                  Démonstration interactive en direct
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Suivez les étapes ci-dessous sur votre classeur Excel.
                </p>
              </div>
            )}

            {/* Top Video Overlay Bar */}
            <div className="absolute top-0 left-0 right-0 z-10 p-2.5 sm:p-3 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
              <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs text-white">
                <span className="w-2 h-2 rounded-full bg-[#13b8a6] animate-pulse" />
                <span className="font-medium text-[11px] sm:text-xs">
                  Vidéo 360p Fluide
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Sous-titres FR"
                  className="h-8 px-2 rounded-lg bg-black/50 text-white hover:bg-black/70 text-xs font-semibold backdrop-blur-sm"
                >
                  CC
                </button>
                <button
                  type="button"
                  onClick={cyclePlaybackRate}
                  aria-label="Vitesse de lecture"
                  className="h-8 px-2.5 rounded-lg bg-black/50 text-white hover:bg-black/70 text-xs font-bold backdrop-blur-sm"
                >
                  {playbackRate}x
                </button>
              </div>
            </div>

            {/* Center Big Play / Pause Button (Min 44px, Stitch 56px) */}
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Mettre en pause' : 'Lire la vidéo'}
                className="w-14 h-14 rounded-full bg-[#13b8a6] text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform pointer-events-auto hover:bg-[#006b5f]"
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 fill-current" />
                ) : (
                  <Play className="w-7 h-7 fill-current ml-1" />
                )}
              </button>
            </div>

            {/* Bottom Controls Bar & Scrubber */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-2.5 sm:p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-1.5">
              {/* Scrubber input */}
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleScrubberChange}
                aria-label="Progression de la vidéo"
                className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#13b8a6]"
              />

              <div className="flex items-center justify-between text-xs text-white pt-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] sm:text-xs">
                    {formatTime(currentTime)} / {formatTime(duration || 690)}
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold bg-[#006b5f]/80 text-[#70f8e4] px-2 py-0.5 rounded-full">
                    FCFA Cas Douala
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label="Plein écran"
                  className="w-9 h-9 -mr-1 flex items-center justify-center text-white hover:text-[#13b8a6]"
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* 5. INTERACTIVE CONTENT TABS (Stitch Design)                   */}
        {/* ------------------------------------------------------------- */}
        <section className="mb-5">
          <div className="flex items-center bg-[#e6eeff] rounded-xl p-1 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('content')}
              className={`flex-1 min-h-[44px] rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'content'
                  ? 'bg-white text-[#006b5f] shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Leçon & Cas</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('notes')}
              className={`flex-1 min-h-[44px] rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'notes'
                  ? 'bg-white text-[#006b5f] shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>Notes ({notes.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('qa')}
              className={`flex-1 min-h-[44px] rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'qa'
                  ? 'bg-white text-[#006b5f] shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Q&R ({questions.length})</span>
            </button>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: LEÇON & CAS CONCRET (Stitch Rich Pedagogical Flow)     */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'content' && (
          <div className="space-y-5">
            {/* Intro Card */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-[#13b8a6]">
                Application PME & Commerce Camerounais
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#121c2a] mt-1">
                Calculer le chiffre d'affaires et le panier moyen en FCFA
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Dans les entreprises camerounaises et d'Afrique Centrale, l'analyse des bilans quotidiens de caisse
                nécessite d'agréger rapidement les volumes vendus sans erreurs manuelles de calculatrice.
              </p>

              {/* Checked Objectives */}
              <div className="mt-4 bg-[#f8f9ff] p-3.5 rounded-xl space-y-2 border border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#006b5f] shrink-0" />
                  <span className="text-xs sm:text-sm text-[#121c2a] font-medium">
                    Syntaxe rigoureuse en version française
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#006b5f] shrink-0" />
                  <span className="text-xs sm:text-sm text-[#121c2a] font-medium">
                    Exclusion automatique des cellules vides ou textuelles
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#006b5f] shrink-0" />
                  <span className="text-xs sm:text-sm text-[#121c2a] font-medium">
                    Formatage monétaire FCFA avec séparateur de milliers
                  </span>
                </div>
              </div>
            </div>

            {/* Formula Syntax Card (Stitch Breakdown) */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#006b5f]">
                  SYNTAXE OFFICIELLE EXCEL
                </span>
                <span className="bg-[#d5e3ff] text-[#021c3a] text-[11px] font-bold px-2 py-0.5 rounded-full">
                  FR / CEMAC
                </span>
              </div>

              {/* Formula 1: SOMME */}
              <div className="bg-[#f8f9ff] p-3.5 rounded-xl border border-slate-100 mb-3">
                <div className="flex items-center justify-between">
                  <code className="font-mono text-sm font-bold text-[#121c2a] bg-white px-2 py-1 rounded-md border border-slate-200">
                    {translation.code_snippet || '=SOMME(C2:C25)'}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    aria-label="Copier la formule"
                    className="w-10 h-10 flex items-center justify-center rounded-lg text-[#006b5f] hover:bg-slate-100 transition-colors"
                  >
                    {copiedCode ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-2">
                  Additionne toutes les valeurs monétaires situées entre la ligne 2 et la ligne 25 de la colonne C (Ventes en FCFA).
                </p>
              </div>

              {/* Formula 2: MOYENNE */}
              <div className="bg-[#f8f9ff] p-3.5 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <code className="font-mono text-sm font-bold text-[#121c2a] bg-white px-2 py-1 rounded-md border border-slate-200">
                    =MOYENNE(D2:D25)
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText('=MOYENNE(D2:D25)');
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2000);
                    }}
                    aria-label="Copier la formule MOYENNE"
                    className="w-10 h-10 flex items-center justify-center rounded-lg text-[#006b5f] hover:bg-slate-100 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-2">
                  Calcule le panier moyen des transactions en ignorant automatiquement les cellules vides.
                </p>
              </div>
            </div>

            {/* Live Practice Mini-Table Mockup ("Extrait : Rapprochement Douala") */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#13b8a6]" />
                  <span className="text-xs sm:text-sm font-bold text-[#121c2a]">
                    Extrait : Rapprochement Douala
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium">Feuille 1</span>
              </div>

              {/* Styled Sheet Table */}
              <div className="w-full bg-[#eff4ff] rounded-xl overflow-hidden border border-slate-200/80 text-left text-xs sm:text-sm">
                <div className="grid grid-cols-12 bg-[#dee9fc] py-2 px-3 font-bold text-slate-700 border-b border-slate-200">
                  <div className="col-span-2">RÉF</div>
                  <div className="col-span-6">SITE / POINT DE VENTE</div>
                  <div className="col-span-4 text-right">MONTANT (FCFA)</div>
                </div>
                <div className="grid grid-cols-12 py-2 px-3 items-center bg-white border-b border-slate-100">
                  <div className="col-span-2 font-mono text-slate-500 font-medium">A01</div>
                  <div className="col-span-6 font-medium text-slate-800">Boutique Akwa</div>
                  <div className="col-span-4 text-right font-mono font-semibold text-slate-900">
                    1 450 000
                  </div>
                </div>
                <div className="grid grid-cols-12 py-2 px-3 items-center bg-[#f8f9ff] border-b border-slate-100">
                  <div className="col-span-2 font-mono text-slate-500 font-medium">A02</div>
                  <div className="col-span-6 font-medium text-slate-800">Dépôt Bonabéri</div>
                  <div className="col-span-4 text-right font-mono font-semibold text-slate-900">
                    890 000
                  </div>
                </div>
                <div className="grid grid-cols-12 py-2 px-3 items-center bg-white border-b border-slate-100">
                  <div className="col-span-2 font-mono text-slate-500 font-medium">A03</div>
                  <div className="col-span-6 font-medium text-slate-800">Agence Bafoussam</div>
                  <div className="col-span-4 text-right font-mono font-semibold text-slate-900">
                    1 120 000
                  </div>
                </div>
                {/* Calculated Summary Row */}
                <div className="grid grid-cols-12 py-2.5 px-3 bg-[#13b8a6] text-white font-bold text-xs sm:text-sm">
                  <div className="col-span-8 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    TOTAL CONSOLIDÉ SOMME
                  </div>
                  <div className="col-span-4 text-right font-mono">
                    3 460 000 FCFA
                  </div>
                </div>
              </div>
            </div>

            {/* Alert / Point Clé Callout Box (Stitch Amber Callout) */}
            <div className="bg-[#ffdea7]/60 border border-amber-300 p-4 sm:p-5 rounded-2xl flex items-start gap-3.5 shadow-2xs">
              <div className="w-9 h-9 rounded-full bg-[#7c5800] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-[#271900] leading-tight">
                  Attention au séparateur régional !
                </h3>
                <p className="text-xs sm:text-sm text-[#5e4200] mt-1 leading-relaxed">
                  Sur Excel paramétré en français (Cameroun/France), utilisez toujours le{' '}
                  <strong>point-virgule (;)</strong> pour séparer les plages disjointes, et non la virgule anglo-saxonne :
                  <br />
                  <code className="font-mono text-xs font-bold bg-amber-200/60 px-1.5 py-0.5 rounded mt-1 inline-block">
                    =SOMME(C2:C10 ; C15:C20)
                  </code>
                </p>
              </div>
            </div>

            {/* Rich Markdown Lesson Content Body */}
            {translation.content && (
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xs border border-slate-100">
                <LessonContentRenderer content={translation.content} />
              </div>
            )}

            {/* Downloadable Resources (Lesson Attachments F1.6) */}
            {lesson.attachments && lesson.attachments.length > 0 && (
              <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm sm:text-base font-bold text-[#121c2a]">
                    Ressources téléchargeables
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {lesson.attachments.length} fichier{lesson.attachments.length > 1 ? 's' : ''}
                  </span>
                </div>
                <LessonAttachmentsList attachments={lesson.attachments} />
              </div>
            )}

            {/* Community Q&A Preview */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm sm:text-base font-bold text-[#121c2a]">
                  Question de la communauté
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('qa')}
                  className="text-xs font-bold text-[#006b5f] hover:underline min-h-[44px] flex items-center"
                >
                  Voir les {questions.length}
                </button>
              </div>

              {questions.length > 0 ? (
                <div className="bg-[#f8f9ff] p-3.5 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#d5e3ff] text-[#021c3a] font-bold text-[11px] flex items-center justify-center">
                      {questions[0].user_name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold text-[#121c2a]">
                      {questions[0].user_name}
                    </span>
                    <span className="text-[11px] text-slate-400 ml-auto">
                      {new Date(questions[0].created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR')}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium">
                    &quot;{questions[0].title}&quot;
                  </p>

                  {/* Instructor / First Answer */}
                  {questions[0].answers && questions[0].answers.length > 0 && (
                    <div className="mt-2 pt-2 bg-white p-3 rounded-lg border border-slate-100 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#006b5f] shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#006b5f]">
                            {questions[0].answers[0].user_name}
                          </span>
                          {questions[0].answers[0].is_endorsed_by_instructor && (
                            <span className="text-[10px] bg-teal-50 text-[#006b5f] px-1.5 py-0.5 rounded-md font-semibold border border-teal-200">
                              Formateur
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                          {questions[0].answers[0].content}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-500 bg-[#f8f9ff] rounded-xl border border-dashed border-slate-200">
                  Aucune question posée pour l&apos;instant. Soyez le premier à demander de l&apos;aide !
                </div>
              )}

              {/* Quick Add Personal Note Trigger */}
              <form onSubmit={handleAddNote} className="mt-4 flex items-center gap-2 bg-[#f8f9ff] px-3 py-1 rounded-xl border border-slate-200">
                <Edit3 className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={newNoteInput}
                  onChange={(e) => setNewNoteInput(e.target.value)}
                  placeholder={`Ajouter une note personnelle à ${formatTime(currentTime)}...`}
                  className="w-full h-11 bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={isAddingNote || !newNoteInput.trim()}
                  aria-label="Enregistrer la note"
                  className="h-9 px-3 bg-[#006b5f] text-white rounded-lg text-xs font-bold shrink-0 hover:bg-[#13b8a6] transition-colors disabled:opacity-50"
                >
                  {isAddingNote ? 'Enregistrement...' : 'Sauvegarder'}
                </button>
              </form>
            </div>

            {/* Interactive Formative Assessment Quiz (F1.7) */}
            <LessonQuizInteractive
              courseSlug={lesson.course_slug}
              lessonSlug={lesson.slug}
              onQuizPassed={handleQuizPassed}
            />
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: NOTES PERSONNELLES (F1.9)                               */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'notes' && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xs border border-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#006b5f] flex items-center justify-center font-bold">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 leading-tight">
                    Vos notes d&apos;apprentissage
                  </h2>
                  <p className="text-xs text-slate-500">
                    Synchronisées automatiquement • Liées aux timecodes de la vidéo
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
                {notes.length} note{notes.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Note Creation Form */}
            <form onSubmit={handleAddNote} className="space-y-3 bg-[#f8f9ff] p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#006b5f]" />
                  Horodatage actuel : <strong className="text-[#006b5f] font-mono">{formatTime(currentTime)}</strong>
                </span>
                <span className="text-[11px] text-slate-400">Cliquez sur un timecode pour revoir l&apos;extrait</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNoteInput}
                  onChange={(e) => setNewNoteInput(e.target.value)}
                  placeholder={`Écrire une note à ${formatTime(currentTime)}...`}
                  className="flex-1 h-11 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#006b5f]/30"
                />
                <button
                  type="submit"
                  disabled={isAddingNote || !newNoteInput.trim()}
                  className="h-11 px-4 bg-[#006b5f] hover:bg-[#13b8a6] text-white rounded-xl text-xs font-bold shrink-0 transition-colors disabled:opacity-50 flex items-center gap-1.5 min-h-[44px]"
                >
                  {isAddingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Enregistrer</span>
                </button>
              </div>
            </form>

            {/* Notes List */}
            {isLoadingNotes ? (
              <div className="py-8 flex items-center justify-center gap-2 text-xs text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin text-[#006b5f]" />
                <span>Chargement de vos notes...</span>
              </div>
            ) : notes.length > 0 ? (
              <div className="space-y-2.5">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3.5 bg-[#f8f9ff] rounded-xl border border-slate-100 flex items-start justify-between gap-3 group hover:border-slate-300 transition-all"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleJumpToTimestamp(note.video_timestamp_seconds)}
                          className="px-2 py-0.5 rounded-md bg-teal-50 hover:bg-teal-100 text-[#006b5f] text-xs font-mono font-bold border border-teal-200 flex items-center gap-1 transition-colors"
                          title="Sauter à ce moment dans la vidéo"
                        >
                          <Play className="w-2.5 h-2.5 fill-current" />
                          <span>{formatTime(note.video_timestamp_seconds)}</span>
                        </button>
                        <span className="text-[11px] text-slate-400">
                          {new Date(note.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR')}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium pt-0.5">
                        {note.content}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteNote(note.id)}
                      aria-label="Supprimer la note"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 px-4 text-center bg-[#f8f9ff] rounded-xl border border-dashed border-slate-200">
                <Lightbulb className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                <p className="text-xs sm:text-sm font-semibold text-slate-700">
                  Vous n&apos;avez pas encore de notes sur cette leçon.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Mettez la vidéo en pause à tout moment et saisissez un point clé pour le retrouver instantanément !
                </p>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: QUESTIONS & RÉPONSES (F1.10)                           */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'qa' && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xs border border-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#006b5f] flex items-center justify-center font-bold">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 leading-tight">
                    Forum d&apos;entraide de la leçon
                  </h2>
                  <p className="text-xs text-slate-500">
                    Posez vos questions et échangez avec les formateurs et apprenants
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAskQuestionForm(!showAskQuestionForm)}
                className="px-3 py-1.5 bg-[#006b5f] hover:bg-[#13b8a6] text-white text-xs font-bold rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 min-h-[44px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Poser une question</span>
              </button>
            </div>

            {/* Ask Question Form */}
            {showAskQuestionForm && (
              <form onSubmit={handleAskQuestion} className="bg-[#f8f9ff] p-4 rounded-xl border border-teal-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Nouvelle question sur cette leçon
                </h3>
                <input
                  type="text"
                  value={newQuestionTitle}
                  onChange={(e) => setNewQuestionTitle(e.target.value)}
                  placeholder="Ex: Pourquoi la formule SOMME renvoie #VALEUR! ?"
                  className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#006b5f]/30"
                  required
                />
                <textarea
                  value={newQuestionContent}
                  onChange={(e) => setNewQuestionContent(e.target.value)}
                  rows={3}
                  placeholder="Décrivez votre problème ou collez votre formule..."
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#006b5f]/30"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAskQuestionForm(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isAskingQuestion || !newQuestionTitle.trim()}
                    className="px-4 py-2 bg-[#006b5f] hover:bg-[#13b8a6] text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isAskingQuestion ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Publier ma question</span>
                  </button>
                </div>
              </form>
            )}

            {/* Questions List */}
            {isLoadingQuestions ? (
              <div className="py-8 flex items-center justify-center gap-2 text-xs text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin text-[#006b5f]" />
                <span>Chargement des échanges...</span>
              </div>
            ) : questions.length > 0 ? (
              <div className="space-y-4">
                {questions.map((q) => (
                  <div key={q.id} className="p-4 bg-[#f8f9ff] rounded-2xl border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#d5e3ff] text-[#021c3a] font-bold text-xs flex items-center justify-center">
                          {q.user_name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-xs font-bold text-slate-800">{q.user_name}</span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(q.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR')}
                        </span>
                      </div>
                      {q.is_resolved && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                          Résolu
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{q.title}</h4>
                      {q.content && <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">{q.content}</p>}
                    </div>

                    {/* Answers Thread */}
                    {q.answers && q.answers.length > 0 && (
                      <div className="space-y-2 pt-1 border-t border-slate-200/60">
                        {q.answers.map((ans) => (
                          <div
                            key={ans.id}
                            className={`p-3 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                              ans.is_endorsed_by_instructor
                                ? 'bg-white border-teal-200 text-slate-800 shadow-2xs'
                                : 'bg-white/80 border-slate-100 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-[#006b5f]">{ans.user_name}</span>
                              {ans.is_endorsed_by_instructor && (
                                <span className="inline-flex items-center gap-1 text-[10px] bg-teal-50 text-[#006b5f] px-1.5 py-0.5 rounded font-bold border border-teal-200">
                                  <CheckCircle2 className="w-3 h-3 text-[#006b5f]" />
                                  Certifié Formateur
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400 ml-auto">
                                {new Date(ans.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR')}
                              </span>
                            </div>
                            <p className="text-slate-600">{ans.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick Reply Form */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleReplyQuestion(q.id);
                      }}
                      className="pt-1 flex gap-2"
                    >
                      <input
                        type="text"
                        value={replyInputs[q.id] || ''}
                        onChange={(e) => setReplyInputs((prev) => ({ ...prev, [q.id]: e.target.value }))}
                        placeholder="Apporter une réponse ou un conseil..."
                        className="flex-1 h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#006b5f]"
                      />
                      <button
                        type="submit"
                        disabled={isSubmittingReply[q.id] || !replyInputs[q.id]?.trim()}
                        className="h-9 px-3 bg-slate-800 hover:bg-[#006b5f] text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 shrink-0"
                      >
                        {isSubmittingReply[q.id] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Répondre'}
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 px-4 text-center bg-[#f8f9ff] rounded-xl border border-dashed border-slate-200">
                <MessageSquare className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p className="text-xs sm:text-sm font-semibold text-slate-700">
                  Aucune question posée pour l&apos;instant.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Une question sur la syntaxe ou un calcul ? Posez-la pour échanger avec la communauté !
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ------------------------------------------------------------- */}
      {/* 6. STICKY BOTTOM NAVIGATION BAR (Thumb Friendly Stitch Bar)   */}
      {/* ------------------------------------------------------------- */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#f8f9ff]/95 backdrop-blur-md px-3 sm:px-4 py-2.5 shadow-[0_-2px_10px_rgba(0,0,0,0.04)] border-t border-slate-200">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {lesson.previous_lesson ? (
            <Link
              href={`/courses/${lesson.course_slug}/lessons/${lesson.previous_lesson.slug}`}
              aria-label="Leçon précédente"
              className="min-h-[48px] px-3 sm:px-4 rounded-xl bg-[#e6eeff] text-slate-800 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 active:scale-95 shrink-0 hover:bg-slate-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden xs:inline">Précédente</span>
            </Link>
          ) : (
            <div className="w-12 shrink-0" />
          )}

          {/* Primary Action Button: Complete & Next (F1.8) */}
          <button
            type="button"
            onClick={handleCompleteAndNext}
            disabled={isCompleting}
            aria-label={lesson.next_lesson ? 'Terminer et passer à la suite' : 'Terminer le cours'}
            className="flex-1 min-h-[48px] px-4 rounded-xl bg-[#13b8a6] hover:bg-[#006b5f] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all disabled:opacity-75"
          >
            {isCompleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enregistrement...</span>
              </>
            ) : lesson.next_lesson ? (
              <>
                <span>Terminer &amp; Suivante</span>
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Terminer le cours</span>
              </>
            )}
          </button>
        </div>
      </footer>

      {/* Curriculum Syllabus Drawer Modal with completion checkmarks */}
      {isSyllabusDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-sm text-slate-900">
                  Sommaire du cours
                </h2>
                {progress && (
                  <p className="text-xs text-[#006b5f] font-semibold mt-0.5">
                    {progress.completed_lessons_count} sur {progress.total_lessons_count} leçons terminées ({progress.progress_percentage}%)
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsSyllabusDrawerOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <CourseSyllabus
                modules={modules}
                courseSlug={lesson.course_slug}
                activeLessonSlug={lesson.slug}
                completedLessonSlugs={progress?.completed_lesson_slugs || []}
              />
            </div>
          </div>
        </div>
      )}
      {/* ------------------------------------------------------------- */}
      {/* 8. CERTIFICATE CELEBRATION MODAL (F1.11)                      */}
      {/* ------------------------------------------------------------- */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-amber-200 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto border-2 border-amber-300">
              <Award className="w-9 h-9" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Formation 100% Validée !</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Toutes nos félicitations ! Vous avez validé l'intégralité du parcours pratique. Votre certificat officiel DataMboa est prêt et inscrit au registre académique.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              {earnedCertificate && (
                <Link
                  href={`/verify/${earnedCertificate.certificate_code}`}
                  className="w-full py-3 bg-[#006b5f] hover:bg-[#005249] text-white font-bold rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  <span>Consulter et Partager mon Certificat</span>
                </Link>
              )}
              <button
                type="button"
                onClick={() => setShowCertificateModal(false)}
                className="w-full py-2.5 text-slate-600 hover:bg-slate-100 font-medium rounded-xl text-sm transition"
              >
                Continuer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
