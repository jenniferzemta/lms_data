import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';
import { 
  Flame, 
  Table, 
  Database, 
  BarChart3, 
  Code2, 
  CheckCircle2, 
  Play, 
  PlayCircle, 
  ArrowRight, 
  Lock, 
  Lightbulb, 
  Clock, 
  Award 
} from 'lucide-react';

export default function HomePage() {
  const tHome = useTranslations('Home');
  const tCommon = useTranslations('Common');

  return (
    <div className="flex flex-col min-h-screen bg-brand-canvas text-brand-text">
      {/* Pinned Top Navigation */}
      <AppHeader />

      {/* Main Container Viewport (Mobile 360px up to Desktop 1280px) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-18 pb-24 md:pb-12 min-h-[calc(100vh-3.5rem)]">
        <div className="flex flex-col gap-4 sm:gap-6 max-w-3xl mx-auto">
          
          {/* Section 1: Salutation & Statut Réseau */}
          <section className="flex flex-col pt-1">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-primary-light border border-brand-primary/10 text-brand-primary">
                <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
                <span className="text-xs font-semibold text-brand-teal">
                  {tHome('syncLightMode')}
                </span>
              </div>

              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-900">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold">4 {tHome('daysStreak')}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-primary tracking-tight">
              {tHome('greeting')}
            </h1>
            <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
              {tHome('greetingSubtitle')}
            </p>
          </section>

          {/* Section 2: Carte Mise en Avant : Reprendre le cours */}
          <section className="w-full">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-border shadow-xs relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-teal-50 pointer-events-none" />

              {/* En-tête de carte */}
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200/60 flex items-center justify-center text-brand-teal">
                    <Table className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
                    Excel · Niveau Débutant
                  </span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-primary-light text-brand-primary">
                  45% {tCommon('appName') ? 'terminé' : ''}
                </span>
              </div>

              {/* Titre & Prochaine Étape */}
              <div className="relative z-10">
                <h2 className="font-bold text-lg sm:text-xl text-brand-primary leading-snug">
                  {tHome('currentCourseTitle')}
                </h2>

                <div className="flex items-center gap-2 mt-1.5 text-brand-muted text-xs sm:text-sm">
                  <PlayCircle className="w-4 h-4 text-brand-teal shrink-0" />
                  <p className="truncate">
                    <span className="text-brand-muted">{tHome('nextStep')} </span>
                    <strong className="text-brand-primary font-semibold">
                      {tHome('nextLessonDetail')}
                    </strong>
                  </p>
                </div>
              </div>

              {/* Barre de Progression */}
              <div className="mt-4 space-y-1.5 relative z-10">
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-brand-teal rounded-full transition-all duration-500"
                    style={{ width: '45%' }}
                  />
                </div>
                <div className="flex justify-between items-center text-brand-muted text-xs">
                  <span>4 sur 9 leçons</span>
                  <span>{tHome('remainingTime')}</span>
                </div>
              </div>

              {/* Bouton d'action tactile 48px */}
              <div className="mt-4 pt-1 relative z-10">
                <Link
                  href="/courses/excel-fondamentaux"
                  className="w-full min-h-[48px] px-4 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.99]"
                >
                  <Play className="w-4 h-4" />
                  <span>{tHome('continueCourseAction')}</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Section 3: Synthèse Hebdomadaire Simple & Économe en Bande Passante */}
          <section className="w-full">
            <div className="bg-white rounded-2xl p-4 border border-brand-border shadow-xs">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-brand-border/60">
                <span className="text-xs sm:text-sm font-bold text-brand-primary">
                  {tHome('weeklyPace')}
                </span>
                <span className="text-xs font-semibold text-brand-teal">
                  {tHome('weeklyGoal')}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-brand-canvas-alt min-h-[64px] border border-brand-border/40">
                  <div className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-base sm:text-lg text-brand-primary">4j</span>
                  </div>
                  <span className="text-[11px] text-brand-muted mt-0.5">{tHome('streakTitle')}</span>
                </div>

                <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-brand-canvas-alt min-h-[64px] border border-brand-border/40">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-brand-teal" />
                    <span className="font-bold text-base sm:text-lg text-brand-primary">7</span>
                  </div>
                  <span className="text-[11px] text-brand-muted mt-0.5">{tHome('lessonsFinished')}</span>
                </div>

                <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-brand-canvas-alt min-h-[64px] border border-brand-border/40">
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-teal-600" />
                    <span className="font-bold text-base sm:text-lg text-brand-primary">5/5</span>
                  </div>
                  <span className="text-[11px] text-brand-muted mt-0.5">{tHome('quizzesPassed')}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Mes parcours 2x2 */}
          <section className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-brand-primary">
                {tHome('myTracks')}
              </h2>
              <Link
                href="/courses"
                className="min-h-[44px] inline-flex items-center text-xs sm:text-sm font-semibold text-brand-teal hover:underline px-1"
              >
                {tHome('viewAll')}
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
              {/* Carte 1: Excel */}
              <Link
                href="/courses/excel-fondamentaux"
                className="flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-white border border-brand-border shadow-xs hover:shadow-sm transition-all text-left min-h-[130px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-brand-teal flex items-center justify-center border border-teal-200/50">
                      <Table className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-brand-teal border border-teal-200/50">
                      45%
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-brand-primary truncate">Excel</h3>
                  <p className="text-[11px] sm:text-xs text-brand-muted mt-0.5">Niveau 1 · En cours</p>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
                  <div className="bg-brand-teal h-full rounded-full" style={{ width: '45%' }} />
                </div>
              </Link>

              {/* Carte 2: SQL */}
              <Link
                href="/courses/premiers-pas-sql"
                className="flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-white border border-brand-border shadow-xs hover:shadow-sm transition-all text-left min-h-[130px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-primary-light text-brand-primary flex items-center justify-center border border-brand-primary/10">
                      <Database className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-brand-primary-light text-brand-primary">
                      Conseillé
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-brand-primary truncate">SQL</h3>
                  <p className="text-[11px] sm:text-xs text-brand-muted mt-0.5">Niveau 1 · Recommandé</p>
                </div>
                <div className="flex items-center text-brand-teal text-xs font-semibold mt-3">
                  <span>Découvrir</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>

              {/* Carte 3: Power BI */}
              <Link
                href="/courses/decouvrir-power-bi"
                className="flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-white border border-brand-border shadow-xs hover:shadow-sm transition-all text-left min-h-[130px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200/50">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-brand-canvas-alt text-brand-muted">
                      Libre
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-brand-primary truncate">Power BI</h3>
                  <p className="text-[11px] sm:text-xs text-brand-muted mt-0.5">Découverte visuelle</p>
                </div>
                <div className="flex items-center text-brand-muted text-xs font-semibold mt-3">
                  <span>Explorer</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>

              {/* Carte 4: Python */}
              <div className="flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-brand-border/60 shadow-none text-left min-h-[130px] opacity-80">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-200/70 text-slate-600 flex items-center justify-center">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                      Bientôt
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-brand-muted truncate">Python</h3>
                  <p className="text-[11px] sm:text-xs text-brand-muted mt-0.5">Analyse avancée</p>
                </div>
                <div className="flex items-center text-slate-500 text-xs font-medium mt-3">
                  <Lock className="w-3.5 h-3.5 mr-1" />
                  <span>Prochainement</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Pour continuer (Recommandation contextualisée) */}
          <section className="w-full space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-brand-primary">
              {tHome('toContinue')}
            </h2>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-border shadow-xs space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200/50 text-teal-900">
                <Lightbulb className="w-3.5 h-3.5 text-brand-teal" />
                <span className="text-xs font-semibold">
                  {tHome('suggestedAfterQuiz')}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm sm:text-base text-brand-primary leading-snug">
                  {tHome('practiceTitle')}
                </h3>
                <p className="text-xs sm:text-sm text-brand-muted mt-1 leading-relaxed">
                  {tHome('practiceDesc')}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 text-brand-muted text-xs font-medium">
                  <Clock className="w-4 h-4" />
                  <span>{tHome('tenMinChrono')}</span>
                </div>

                <Link
                  href="/courses/excel-fondamentaux"
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-xs"
                >
                  <span>{tHome('startExercise')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* Section 6: Bannière Formule Active (Modèle camerounais en FCFA) */}
          <section className="w-full pt-1">
            <div className="rounded-2xl p-4 bg-brand-primary-light border border-brand-primary/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">
                    {tHome('activePlan')}
                  </span>
                </div>
                <p className="font-bold text-sm sm:text-base text-brand-primary">
                  {tHome('freePlanTitle')}
                </p>
                <p className="text-xs text-brand-muted">
                  {tHome('freePlanDesc')}
                </p>
              </div>

              <Link
                href="/courses"
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-brand-primary border border-brand-border flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold shadow-xs transition active:scale-95"
              >
                <span>{tHome('upgradeToEssential')}</span>
                <span className="text-brand-teal font-bold">{tHome('essentialPriceMonthly')}</span>
              </Link>
            </div>
          </section>

        </div>
      </main>

      {/* Pinned Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
