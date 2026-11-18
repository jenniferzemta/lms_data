import React from 'react';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';
import { DesktopSidebar } from '@/components/DesktopSidebar';
import { Badge } from '@/ui/Badge';
import { coursesService, CourseSyllabus, CourseDetail, CourseProgress, LearningOutcome } from '@/features/courses';
import {
  Clock,
  BookOpen,
  Play,
  Sparkles,
  Award,
  ChevronLeft,
  Layers,
  CheckCircle2,
  RotateCcw,
  Target,
  UserCheck,
  GraduationCap,
  FileCheck2,
  Check,
  ShieldCheck,
  Zap,
  BarChart3,
} from 'lucide-react';

interface CoursePageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

function getBloomBadge(bloomLevel: string): { label: string; colorClass: string } {
  const norm = (bloomLevel || '').toUpperCase();
  switch (norm) {
    case 'KNOWLEDGE':
    case 'REMEMBER':
      return { label: 'Mémoriser', colorClass: 'bg-slate-100 text-slate-700 border-slate-300' };
    case 'UNDERSTAND':
      return { label: 'Comprendre', colorClass: 'bg-sky-50 text-sky-800 border-sky-300' };
    case 'APPLY':
      return { label: 'Appliquer', colorClass: 'bg-emerald-50 text-emerald-800 border-emerald-300' };
    case 'ANALYZE':
      return { label: 'Analyser', colorClass: 'bg-indigo-50 text-indigo-800 border-indigo-300' };
    case 'EVALUATE':
      return { label: 'Évaluer', colorClass: 'bg-amber-50 text-amber-900 border-amber-300' };
    case 'CREATE':
      return { label: 'Créer', colorClass: 'bg-purple-50 text-purple-900 border-purple-300' };
    default:
      return { label: 'Objectif SMART', colorClass: 'bg-teal-50 text-teal-800 border-teal-300' };
  }
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { slug, locale } = await params;
  const tCourse = await getTranslations({ locale, namespace: 'Course' });

  let course: CourseDetail | null = null;
  let progress: CourseProgress | null = null;

  try {
    const [courseData, progressData] = await Promise.all([
      coursesService.getCourseBySlug(slug, locale),
      coursesService.getCourseProgress(slug),
    ]);
    course = courseData;
    progress = progressData;
  } catch {
    course = null;
  }

  if (!course) {
    notFound();
  }

  // Find the lesson to start or resume
  const firstModule = course.modules?.[0];
  const firstLesson = firstModule?.lessons?.[0];

  const targetLessonSlug = progress?.resume_lesson?.slug || firstLesson?.slug;
  const startLessonUrl = targetLessonSlug
    ? `/courses/${course.slug}/lessons/${targetLessonSlug}`
    : `/courses/${course.slug}`;

  const priceTierNorm = (course.price_tier || '').toLowerCase();
  const isFree = priceTierNorm === 'free';
  const isEnrolled = progress?.is_enrolled ?? false;
  const isCompleted = progress?.status === 'COMPLETED';

  const outcomes: LearningOutcome[] = course.learning_outcomes || [];

  return (
    <div className="flex min-h-screen bg-brand-canvas text-brand-text">
      {/* Desktop Persistent Left Sidebar */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 xl:pl-72">
        <AppHeader />

        <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 pt-20 pb-28 lg:pb-16 min-h-[calc(100vh-4rem)]">
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

          {/* ============================================================= */}
          {/* 1. HERO SECTION                                               */}
          {/* ============================================================= */}
          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-brand-border shadow-2xs mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {isFree ? (
                <Badge variant="teal" icon={<Sparkles className="w-3.5 h-3.5 text-brand-teal" />}>
                  {tCourse('freeBadge')}
                </Badge>
              ) : (
                <Badge variant="amber" icon={<Award className="w-3.5 h-3.5 text-amber-700" />}>
                  {priceTierNorm === 'essential' ? tCourse('essentialBadge') : tCourse('proBadge')}
                </Badge>
              )}

              <Badge variant="neutral">
                {course.level === 'debutant' || course.level === 'BEGINNER'
                  ? tCourse('beginner')
                  : course.level === 'intermediaire' || course.level === 'INTERMEDIATE'
                  ? tCourse('intermediate')
                  : tCourse('advanced')}
              </Badge>

              {course.track?.name && (
                <span className="text-xs font-semibold text-brand-teal bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/50">
                  {course.track.name}
                </span>
              )}

              {isEnrolled && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {isCompleted ? 'Cours validé (100%)' : `En cours (${progress?.progress_percentage}%)`}
                </span>
              )}
            </div>

            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-brand-primary leading-snug mb-2">
              {course.title}
            </h1>

            {course.subtitle && (
              <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium mb-4 max-w-3xl leading-relaxed">
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

              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-900">Certificat vérifiable</span>
              </div>
            </div>

            {/* Learner Progress Bar if enrolled (F1.8) */}
            {isEnrolled && progress && (
              <div className="mb-6 p-4 rounded-2xl bg-[#f8f9ff] border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-bold text-slate-900">Progression globale</span>
                  <span className="font-bold text-[#006b5f]">
                    {progress.completed_lessons_count} / {progress.total_lessons_count} leçons ({progress.progress_percentage}%)
                  </span>
                </div>
                <div className="w-full bg-[#dee9fc] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#13b8a6] h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress.progress_percentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href={startLessonUrl}
                className="min-h-[50px] px-6 rounded-2xl bg-brand-primary hover:bg-brand-primary-dark text-white font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] shadow-xs"
              >
                {isEnrolled ? (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    <span>Reprendre le cours</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>{tCourse('startLearningNow')}</span>
                  </>
                )}
              </Link>
            </div>
          </div>

          {/* ============================================================= */}
          {/* 2. PILIER 1 : OBJECTIFS SMART & BLOOM (F1.16, R2, R3)         */}
          {/* ============================================================= */}
          {outcomes.length > 0 && (
            <section className="bg-white rounded-3xl p-5 sm:p-7 border border-brand-border shadow-2xs mb-8">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-brand-primary">
                    Ce que vous saurez accomplir (Objectifs SMART)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Compétences mesurables alignées sur la taxonomie de Bloom
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {outcomes.map((outcome, idx) => {
                  const badge = getBloomBadge(outcome.bloom_level);
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl border border-slate-200/90 bg-[#fbfcfe] hover:bg-white hover:border-[#13b8a6]/50 transition-all flex flex-col justify-between gap-2.5"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                          ✓
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                          {outcome.statement}
                        </p>
                      </div>
                      <div className="self-start pl-7">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge.colorClass}`}
                        >
                          Bloom : {badge.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ============================================================= */}
          {/* 3. PILIER 2 : PROFIL DU FORMATEUR (F1.15, R9)                 */}
          {/* ============================================================= */}
          <section className="bg-white rounded-3xl p-5 sm:p-7 border border-brand-border shadow-2xs mb-8">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-brand-primary">
                  Formateur Référent & Équipe Pédagogique
                </h2>
                <p className="text-xs text-slate-500">
                  Encadrement professionnel certifié et assistance continue
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-[#f8f9ff] border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Avatar placeholder with initials */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#006b5f] to-[#13b8a6] text-white flex items-center justify-center text-xl sm:text-2xl font-bold font-serif shrink-0 shadow-sm border-2 border-white">
                AF
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {course.instructor_name || 'Alain FOTSO'}
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-300 inline-flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    Formateur Accrédité
                  </span>
                  <span className="text-[11px] text-slate-500">Formateur Senior</span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-[#006b5f]">
                  {course.instructor_role || 'Lead Data Analyst & Formateur Principal DataMboa'}
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                  {course.instructor_bio ||
                    "8+ années d'expérience en Business Intelligence et modélisation financière en Afrique centrale. A formé plus de 1 200 cadres et analystes au Cameroun et dans la sous-région CEMAC."}
                </p>
              </div>
            </div>
          </section>

          {/* ============================================================= */}
          {/* 4. PILIER 3 : PUBLIC CIBLE & PRÉREQUIS (F1.15, R9)             */}
          {/* ============================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Target Audience */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-brand-border shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2 text-[#006b5f]">
                <UserCheck className="w-5 h-5 text-brand-teal" />
                <h3 className="text-base font-bold text-slate-900">Public Cible</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {course.target_audience ||
                  "Comptables, gestionnaires de stock, contrôleurs de gestion, étudiants en gestion/finance et analystes juniors d'Afrique francophone souhaitant structurer et fiabiliser leurs reportings d'entreprise sans erreur."}
              </p>
            </div>

            {/* Prerequisites */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-brand-border shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2 text-amber-700">
                <FileCheck2 className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">Prérequis Nécessaires</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {course.prerequisites ||
                  "Aucun prérequis en analyse de données. Utilisation basique d'un ordinateur (clavier, souris, gestionnaire de fichiers) et accès à Excel 2016 ou plus récent."}
              </p>
            </div>
          </div>

          {/* ============================================================= */}
          {/* 5. PILIER 4 : PROGRAMME DÉTAILLÉ & MODULES (F1.15, R9)        */}
          {/* ============================================================= */}
          <section className="space-y-4 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-brand-primary">
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
              completedLessonSlugs={progress?.completed_lesson_slugs || []}
            />
          </section>

          {/* ============================================================= */}
          {/* 6. PILIER 5 : MODALITÉS & ÉVALUATION CERTIFIANTE (F1.15, R9)  */}
          {/* ============================================================= */}
          <section className="bg-white rounded-3xl p-5 sm:p-7 border border-brand-border shadow-2xs mb-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center border border-purple-200">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-brand-primary">
                  Modalités Pédagogiques & Certification Officielle
                </h2>
                <p className="text-xs text-slate-500">
                  Cadre d'apprentissage conçu pour le contexte africain
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {course.pedagogical_modalities ||
                "Formation 100% pratique orientée cas d'entreprise réels à Douala et Yaoundé. Chaque notion est illustrée en vidéo HD avec mode économie de données, complétée par un jeu de données téléchargeable (XLSX), un quiz formatif immédiat et sanctionnée par un certificat officiel vérifiable."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center space-y-1">
                <Zap className="w-5 h-5 text-amber-600 mx-auto" />
                <div className="text-xs font-bold text-slate-900">Économie de données</div>
                <div className="text-[11px] text-slate-500">Streaming optimisé pour réseaux mobiles 3G/4G</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center space-y-1">
                <BookOpen className="w-5 h-5 text-[#006b5f] mx-auto" />
                <div className="text-xs font-bold text-slate-900">Cas réels d&apos;entreprises</div>
                <div className="text-[11px] text-slate-500">Datasets et cas pratiques authentiques</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center space-y-1">
                <Target className="w-5 h-5 text-indigo-600 mx-auto" />
                <div className="text-xs font-bold text-slate-900">Quiz Bloom (Seuil 70%)</div>
                <div className="text-[11px] text-slate-500">Validation formative avec feedback explicatif immédiat</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center space-y-1">
                <Award className="w-5 h-5 text-purple-600 mx-auto" />
                <div className="text-xs font-bold text-slate-900">Certificat Vérifiable</div>
                <div className="text-[11px] text-slate-500">Code unique infalsifiable et partage LinkedIn / WhatsApp</div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
