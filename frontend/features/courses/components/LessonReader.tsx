'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { LessonDetail, ModuleCurriculum } from '../types';
import { FallbackLanguageBanner } from './FallbackLanguageBanner';
import { CourseSyllabus } from './CourseSyllabus';
import { LessonAttachmentsList } from './LessonAttachmentsList';
import { LessonContentRenderer } from './LessonContentRenderer';
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

  // UI state
  const [isSyllabusDrawerOpen, setIsSyllabusDrawerOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [personalNotes, setPersonalNotes] = useState<string[]>([
    "Format monétaire personnalisé FCFA : # ##0 \"FCFA\" sans retaper le texte.",
    "Attention : toujours utiliser le point-virgule (;) sous Excel en français.",
  ]);
  const [newNoteInput, setNewNoteInput] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);

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

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteInput.trim()) return;
    const timeFormatted = formatTime(currentTime);
    setPersonalNotes([...personalNotes, `[${timeFormatted}] ${newNoteInput.trim()}`]);
    setNewNoteInput('');
  };

  // Calculate approximate completion percentage
  const lessonProgressPercent = 68;

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
                {lessonProgressPercent}%
              </span>
            </div>
            <div className="w-full bg-[#dee9fc] h-1 rounded-full overflow-hidden mt-1">
              <div
                className="bg-[#13b8a6] h-full rounded-full transition-all duration-300"
                style={{ width: `${lessonProgressPercent}%` }}
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
                style={{ width: '42%' }}
              />
            </div>
            <span className="text-xs text-slate-500 shrink-0 font-medium">
              42% global
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
              <span>Notes ({personalNotes.length})</span>
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
              <span>Q&R (4)</span>
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
                  Voir les 4
                </button>
              </div>

              <div className="bg-[#f8f9ff] p-3.5 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#d5e3ff] text-[#021c3a] font-bold text-[11px] flex items-center justify-center">
                    SN
                  </div>
                  <span className="text-xs font-semibold text-[#121c2a]">
                    Samuel N. (Étudiant)
                  </span>
                  <span className="text-[11px] text-slate-400 ml-auto">Hier</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 font-medium">
                  &quot;Pourquoi mon Excel m&apos;affiche une erreur #NOM? quand j&apos;écris =SUM() ?&quot;
                </p>

                {/* Instructor Answer */}
                <div className="mt-2 pt-2 bg-white p-3 rounded-lg border border-slate-100 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#006b5f] shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#006b5f]">
                        Alain Fotso (Formateur Douala)
                      </span>
                      <span className="text-[10px] text-slate-400">Coach Data</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                      Si votre logiciel est en version française, la fonction doit obligatoirement s&apos;écrire{' '}
                      <strong className="text-slate-900">=SOMME()</strong> et non en anglais.
                    </p>
                  </div>
                </div>
              </div>

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
                  aria-label="Enregistrer la note"
                  className="h-9 px-3 bg-[#006b5f] text-white rounded-lg text-xs font-bold shrink-0 hover:bg-[#13b8a6] transition-colors"
                >
                  Sauvegarder
                </button>
              </form>
            </div>

            {/* Exercise Challenge Callout (Mini Quiz) */}
            <div className="bg-gradient-to-r from-[#e6eeff] to-[#dee9fc] p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-3 border border-slate-200">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-[#006b5f]">
                  <HelpCircle className="w-4 h-4" />
                  <span className="text-xs font-bold tracking-wider uppercase">
                    MINI QUIZ RAPIDE
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-[#121c2a]">
                  Validez vos acquis (3 questions)
                </h4>
                <p className="text-xs text-slate-600">Temps estimé : 2 minutes</p>
              </div>
              <button
                type="button"
                onClick={() => setQuizStarted(!quizStarted)}
                className="min-h-[44px] px-4 bg-[#4a5f81] text-white rounded-xl text-xs sm:text-sm font-bold shrink-0 active:scale-95 shadow-xs hover:bg-[#324768] transition-colors"
              >
                {quizStarted ? 'Fermer' : 'Démarrer'}
              </button>
            </div>

            {/* Interactive Mini Quiz Drawer / Area */}
            {quizStarted && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <span className="text-xs font-bold text-[#006b5f] uppercase tracking-wider">
                  Question 1 sur 3
                </span>
                <p className="text-sm font-bold text-slate-900">
                  Que se passe-t-il si vous saisissez manuellement &quot;25000 FCFA&quot; dans une cellule Excel ?
                </p>
                <div className="space-y-2">
                  {[
                    "Excel effectue la somme normalement.",
                    "La cellule devient du texte et renvoie une erreur #VALEUR! dans les formules.",
                    "Excel convertit automatiquement le texte en devise FCFA.",
                  ].map((choice, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedQuizAnswer(i)}
                      className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all min-h-[44px] ${
                        selectedQuizAnswer === i
                          ? i === 1
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold'
                            : 'bg-red-50 border-red-500 text-red-900 font-semibold'
                          : 'bg-[#f8f9ff] border-slate-200 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
                {selectedQuizAnswer !== null && (
                  <div className={`p-3 rounded-xl text-xs ${selectedQuizAnswer === 1 ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}>
                    {selectedQuizAnswer === 1 ? (
                      <p><strong>Correct !</strong> Saisir des lettres transforme le nombre en chaîne de caractères, bloquant toute fonction arithmétique.</p>
                    ) : (
                      <p><strong>Incorrect.</strong> Saisir &quot;FCFA&quot; à la main transforme le type en Texte, rendant tout calcul impossible.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: NOTES PERSONNELLES                                     */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'notes' && (
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Vos notes sur cette leçon</h2>
            <div className="space-y-2">
              {personalNotes.map((note, idx) => (
                <div key={idx} className="p-3 bg-[#f8f9ff] rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-800">
                  {note}
                </div>
              ))}
            </div>
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={newNoteInput}
                onChange={(e) => setNewNoteInput(e.target.value)}
                placeholder="Rédiger une nouvelle note..."
                className="flex-1 h-11 px-3 bg-[#f8f9ff] border border-slate-200 rounded-xl text-xs sm:text-sm"
              />
              <button
                type="submit"
                className="h-11 px-4 bg-[#006b5f] text-white rounded-xl text-xs font-bold hover:bg-[#13b8a6]"
              >
                Ajouter
              </button>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: QUESTIONS & RÉPONSES                                    */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'qa' && (
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Forum d'entraide de la leçon</h2>
            <div className="p-3 bg-[#f8f9ff] rounded-xl border border-slate-100 space-y-2">
              <span className="text-xs font-bold text-[#006b5f]">Samuel N.</span>
              <p className="text-xs sm:text-sm text-slate-700">
                &quot;Comment afficher automatiquement le symbole FCFA sur toute une colonne ?&quot;
              </p>
              <div className="bg-white p-2.5 rounded-lg border border-slate-100 text-xs text-slate-600">
                <strong>Réponse du Coach Alain :</strong> Sélectionnez la colonne entière, appuyez sur <code className="bg-slate-100 px-1 py-0.5 rounded">Ctrl+1</code>, puis dans l&apos;onglet Nombre &gt; Personnalisé, appliquez <code className="bg-slate-100 px-1 py-0.5 rounded"># ##0 &quot;FCFA&quot;</code>.
              </div>
            </div>
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

          {lesson.next_lesson ? (
            <Link
              href={`/courses/${lesson.course_slug}/lessons/${lesson.next_lesson.slug}`}
              aria-label="Terminer et passer à la leçon suivante"
              className="flex-1 min-h-[48px] px-4 rounded-xl bg-[#13b8a6] hover:bg-[#006b5f] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
            >
              <span>Terminer &amp; Suivante</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href={`/courses/${lesson.course_slug}`}
              aria-label="Terminer le cours"
              className="flex-1 min-h-[48px] px-4 rounded-xl bg-[#006b5f] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Terminer le cours</span>
            </Link>
          )}
        </div>
      </footer>

      {/* Curriculum Syllabus Drawer Modal */}
      {isSyllabusDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-bold text-sm text-slate-900">
                Sommaire du cours
              </h2>
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
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
