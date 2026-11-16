'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { coursesService } from '../services/courses.service';
import { LearnerDashboardData } from '../types';
import {
  BookOpen,
  Award,
  Clock,
  Zap,
  Play,
  ArrowRight,
  CheckCircle2,
  Share2,
  TrendingUp,
  FileSpreadsheet,
  Database,
  Code2,
  Sparkles,
  Loader2,
  Compass,
} from 'lucide-react';
import { RecommendationsFeed } from '@/features/recommendations';

interface LearnerDashboardViewProps {
  locale: string;
}

export const LearnerDashboardView: React.FC<LearnerDashboardViewProps> = ({ locale }) => {
  const router = useRouter();
  const tCommon = useTranslations('Common');
  const tNav = useTranslations('Navigation');

  const [data, setData] = useState<LearnerDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareSuccessCode, setShareSuccessCode] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    coursesService
      .getDashboardSummary()
      .then((res) => {
        if (isMounted) {
          setData(res);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          // If 401 unauthorized, router push to login
          if (err?.status === 401 || err?.status === 403) {
            router.push('/login');
            return;
          }
          setError('Impossible de charger le tableau de bord pour le moment.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleShareCertificate = (code: string, courseTitle: string) => {
    const certUrl = `${window.location.origin}/verify/${code}`;
    const text = `🎓 J'ai obtenu ma certification DataMboa en ${courseTitle} ! Vérifiez mon diplôme ici : ${certUrl}`;

    if (navigator.share) {
      navigator
        .share({
          title: `Certification DataMboa - ${courseTitle}`,
          text: text,
          url: certUrl,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(certUrl);
      setShareSuccessCode(code);
      setTimeout(() => setShareSuccessCode(null), 3000);
    }
  };

  const getToolIcon = (tool: string) => {
    const t = tool.toUpperCase();
    if (t.includes('EXCEL')) return <FileSpreadsheet className="w-5 h-5 text-emerald-700" />;
    if (t.includes('SQL')) return <Database className="w-5 h-5 text-blue-700" />;
    if (t.includes('PYTHON')) return <Code2 className="w-5 h-5 text-amber-700" />;
    return <BookOpen className="w-5 h-5 text-[#006b5f]" />;
  };

  // ---------------------------------------------------------------------------
  // SKELETON LOADING STATE
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="h-28 bg-slate-200/60 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-200/60 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-44 bg-slate-200/60 rounded-2xl animate-pulse" />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // ERROR STATE
  // ---------------------------------------------------------------------------
  if (error || !data) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-[#121c2a]">Tableau de bord indisponible</h2>
        <p className="text-sm text-slate-600 mt-2">{error || 'Veuillez vous reconnecter pour accéder à vos progrès.'}</p>
        <Link
          href="/login"
          className="mt-5 inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#006b5f] text-white font-bold text-sm min-h-[44px]"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  const { user, stats, resume_lesson, enrolled_courses, certificates, recommendations } = data;
  const learningHours = (stats.total_learning_time_minutes / 60).toFixed(1);

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* --------------------------------------------------------------------- */}
      {/* 1. WELCOME BANNER (Salutation + Points XP)                             */}
      {/* --------------------------------------------------------------------- */}
      <section className="bg-gradient-to-r from-[#006b5f] via-[#00574d] to-[#121c2a] rounded-3xl p-5 sm:p-7 text-white shadow-sm relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-[#13b8a6]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#13b8a6] bg-teal-950/60 px-2.5 py-0.5 rounded-full border border-teal-500/30">
                Espace Apprenant DataMboa
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-2 leading-tight">
              Bienvenue, {user.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-teal-100/90 mt-1 max-w-xl">
              Votre progression dans le cursus d&apos;analyse de données concrète pour l&apos;entreprise africaine.
            </p>
          </div>

          {/* Gamification XP pill */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 shrink-0 self-start sm:self-auto">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold shadow-xs">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-amber-200">Total Points XP</div>
              <div className="text-lg font-black tracking-tight text-white">{stats.xp_points} pts</div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* 2. STATS OVERVIEW CARDS (Où j'en suis)                                 */}
      {/* --------------------------------------------------------------------- */}
      <section aria-label="Statistiques d'apprentissage" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Formations en cours */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Formations</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#006b5f] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#121c2a] mt-2">
            {stats.enrolled_courses_count}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
            {stats.completed_courses_count} validée{stats.completed_courses_count > 1 ? 's' : ''} à 100%
          </p>
        </div>

        {/* Leçons validées */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Leçons Validées</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#121c2a] mt-2">
            {stats.completed_lessons_count}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
            Ateliers & Cas pratiques résolus
          </p>
        </div>

        {/* Temps d'apprentissage */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Temps d&apos;étude</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#121c2a] mt-2">
            {learningHours} h
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
            Cumul de pratique et vidéos
          </p>
        </div>

        {/* Certifications validées */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Certificats</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#7c5800] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#7c5800] mt-2">
            {stats.certificates_count}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
            Vérifiables avec sceau officiel
          </p>
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* 2.5 RECOMMANDATIONS & RAPPELS INTELLIGENTS (F3.8, F3.9)               */}
      {/* --------------------------------------------------------------------- */}
      <RecommendationsFeed />

      {/* --------------------------------------------------------------------- */}
      {/* 3. 1-CLICK RESUME CARD (Qu'est-ce que je fais)                         */}
      {/* --------------------------------------------------------------------- */}
      {resume_lesson ? (
        <section aria-label="Reprendre l'apprentissage" className="bg-white rounded-3xl border border-teal-200/80 p-5 sm:p-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#13b8a6] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#006b5f]">
                Reprendre en un clic
              </span>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {resume_lesson.progress_percentage}% du cours validé
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mt-2">
            <div className="space-y-1.5 min-w-0">
              <div className="text-xs text-slate-500 font-semibold truncate">
                {resume_lesson.course_title} • {resume_lesson.module_title}
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#121c2a] leading-snug">
                {resume_lesson.lesson_title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-600 pt-1">
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {resume_lesson.duration_minutes} min
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[#006b5f] font-semibold">
                  +25 pts XP à la clé
                </span>
              </div>
            </div>

            <Link
              href={`/courses/${resume_lesson.course_slug}/lessons/${resume_lesson.lesson_slug}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#006b5f] hover:bg-[#00574d] text-white font-bold rounded-2xl min-h-[44px] shadow-sm transition shrink-0 group text-sm"
            >
              <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
              <span>Continuer la leçon</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#dee9fc] h-1.5 rounded-full overflow-hidden mt-5">
            <div
              className="bg-[#13b8a6] h-full rounded-full transition-all duration-300"
              style={{ width: `${resume_lesson.progress_percentage}%` }}
            />
          </div>
        </section>
      ) : enrolled_courses.length === 0 ? (
        <section className="bg-white rounded-3xl border border-dashed border-slate-200 p-8 text-center space-y-4">
          <div className="w-12 h-12 bg-teal-50 text-[#006b5f] rounded-2xl flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#121c2a]">Aucune formation en cours pour l&apos;instant</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
              Démarrez gratuitement votre première formation pratique en analyse de données (Excel Fondamentaux Kamer SARL).
            </p>
          </div>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#006b5f] text-white font-bold text-sm rounded-xl min-h-[44px]"
          >
            <span>Explorer le Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      ) : null}

      {/* --------------------------------------------------------------------- */}
      {/* 4. ENROLLED COURSES (Mes Formations Actives)                            */}
      {/* --------------------------------------------------------------------- */}
      {enrolled_courses.length > 0 && (
        <section aria-label="Mes formations">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#006b5f]" />
              <h2 className="text-base sm:text-lg font-bold text-[#121c2a]">
                Mes Formations ({enrolled_courses.length})
              </h2>
            </div>
            <Link
              href="/courses"
              className="text-xs font-bold text-[#006b5f] hover:underline flex items-center gap-1 min-h-[44px]"
            >
              <span>Catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrolled_courses.map((c) => {
              const isDone = c.progress_percentage >= 100;
              return (
                <div
                  key={c.enrollment_id}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-[#006b5f] bg-[#e6eeff] px-2.5 py-1 rounded-full">
                        {getToolIcon(c.tool)}
                        <span>{c.tool} • {c.level}</span>
                      </span>
                      {isDone ? (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Certifié
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-600">
                          {c.progress_percentage}%
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-sm sm:text-base text-[#121c2a] leading-snug">
                      {c.course_title}
                    </h3>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span>{c.completed_lessons_count} / {c.total_lessons_count} leçons validées</span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-[#dee9fc] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isDone ? 'bg-emerald-600' : 'bg-[#13b8a6]'
                        }`}
                        style={{ width: `${c.progress_percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    {c.certificate_code ? (
                      <Link
                        href={`/verify/${c.certificate_code}`}
                        className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-[#7c5800] border border-amber-200 text-xs font-bold rounded-xl flex items-center gap-1.5 min-h-[44px]"
                      >
                        <Award className="w-4 h-4" />
                        <span>Voir mon diplôme</span>
                      </Link>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">En progression</span>
                    )}

                    <Link
                      href={
                        c.next_lesson_slug
                          ? `/courses/${c.course_slug}/lessons/${c.next_lesson_slug}`
                          : `/courses/${c.course_slug}`
                      }
                      className="px-4 py-2 bg-[#006b5f] hover:bg-[#00574d] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 min-h-[44px] ml-auto"
                    >
                      <span>{isDone ? 'Revoir' : 'Continuer'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 5. OFFICIAL CERTIFICATES (Mes Certifications & Partage)                */}
      {/* --------------------------------------------------------------------- */}
      {certificates.length > 0 && (
        <section aria-label="Mes certifications officielles" className="bg-gradient-to-br from-amber-50/50 via-white to-teal-50/40 rounded-3xl p-5 sm:p-6 border border-amber-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#ffdea7] text-[#7c5800] flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#121c2a]">
                Mes Certifications Officielles DataMboa ({certificates.length})
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/70 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#7c5800] bg-amber-100/60 px-2 py-0.5 rounded-md font-mono">
                      CODE : {cert.certificate_code}
                    </span>
                    {cert.final_grade && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Moyenne : {cert.final_grade}%
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-sm sm:text-base text-[#121c2a]">
                    {cert.course_title}
                  </h3>

                  <p className="text-xs text-slate-500">
                    Formateur référent : {cert.instructor_name}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    href={cert.verification_path}
                    className="px-3.5 py-2 bg-[#006b5f] hover:bg-[#00574d] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 min-h-[44px]"
                  >
                    <span>Afficher le diplôme</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleShareCertificate(cert.certificate_code, cert.course_title)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 min-h-[44px]"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{shareSuccessCode === cert.certificate_code ? 'Copié !' : 'Partager'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 6. RECOMMENDED COURSES (Prochaine Étape de la Roadmap)                */}
      {/* --------------------------------------------------------------------- */}
      {recommendations.length > 0 && (
        <section aria-label="Recommandations">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#13b8a6]" />
            <h2 className="text-base sm:text-lg font-bold text-[#121c2a]">
              Prochaine Étape : Poursuivre le Cursus
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#006b5f] bg-[#e6eeff] px-2 py-0.5 rounded-full">
                      {rec.tool} • {rec.level}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      ~{rec.duration_hours}h d&apos;apprentissage
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm sm:text-base text-[#121c2a]">
                    {rec.title}
                  </h3>
                </div>

                <Link
                  href={`/courses/${rec.slug}`}
                  className="w-full mt-2 py-2.5 bg-slate-50 hover:bg-[#006b5f] hover:text-white text-[#006b5f] border border-slate-200 hover:border-[#006b5f] rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
                >
                  <span>Découvrir le syllabus</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

