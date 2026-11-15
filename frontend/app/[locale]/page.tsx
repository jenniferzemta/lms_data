'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';
import { DesktopSidebar } from '@/components/DesktopSidebar';
import { useAuth } from '@/features/auth';
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
  Lightbulb, 
  Clock, 
  Award,
  BookOpen,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';

export default function HomePage() {
  const tHome = useTranslations('Home');
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <div className="flex min-h-screen bg-brand-canvas text-brand-text">
      {/* Desktop Persistent Left Sidebar (Visible only >= lg) */}
      <DesktopSidebar />

      {/* Main Content Area (Offset on Desktop by Sidebar width) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 xl:pl-72">
        {/* Top Header / Topbar */}
        <AppHeader />

        {/* Content Viewport */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pb-12 min-h-[calc(100vh-4rem)]">
          <div className="flex flex-col gap-5 sm:gap-6">
            
            {/* Header Welcome & Hero Section */}
            <section className="bg-white rounded-2xl p-5 sm:p-6 border border-brand-border shadow-2xs relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200/50 text-teal-800 text-[11px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
                      <span>{tHome('syncLightMode')}</span>
                    </span>
                    <span className="text-[11px] text-brand-muted font-medium">
                      Douala, Cameroun · FCFA
                    </span>
                  </div>

                  {isAuthenticated && user ? (
                    <>
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-primary tracking-tight">
                        {tHome('learnerGreeting', { name: user.first_name || user.full_name || 'Apprenant' })}
                      </h1>
                      <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-xl">
                        {tHome('welcomeBack')}
                      </p>
                    </>
                  ) : (
                    <>
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-primary tracking-tight">
                        {tHome('visitorGreeting')}
                      </h1>
                      <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-xl">
                        {tHome('visitorSubtitle')}
                      </p>
                    </>
                  )}
                </div>

                {/* Streak Badge Widget (if authenticated) or Quick Start CTA (if visitor) */}
                {isAuthenticated ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                      <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-amber-900 block leading-tight">
                        4 {tHome('daysStreak')}
                      </span>
                      <span className="text-[11px] text-amber-800/80">
                        {tHome('streakTitle')}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 pt-2 sm:pt-0">
                    <Link
                      href="/register"
                      className="min-h-[44px] px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition shadow-xs active:scale-95"
                    >
                      <Sparkles className="w-4 h-4 text-brand-teal" />
                      <span>{tHome('startFree')}</span>
                    </Link>
                    <Link
                      href="/courses"
                      className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-brand-border text-brand-primary text-xs sm:text-sm font-semibold flex items-center gap-2 transition shadow-2xs active:scale-95"
                    >
                      <span>{tHome('exploreCatalog')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </section>

            {/* Desktop Metrics Row (Adaptive for Learner vs Visitor) */}
            {isAuthenticated ? (
              <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Stat 1: Formations actives */}
                <div className="bg-white rounded-2xl p-4 border border-brand-border shadow-2xs flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 text-brand-teal flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-brand-muted font-medium block">
                      Formations
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg sm:text-xl font-bold text-brand-primary tabular-nums">
                        1
                      </span>
                      <span className="text-[11px] text-brand-teal font-semibold">
                        en cours
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stat 2: Heures de pratique */}
                <div className="bg-white rounded-2xl p-4 border border-brand-border shadow-2xs flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary-light border border-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-brand-muted font-medium block">
                      {tHome('studyTime')}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg sm:text-xl font-bold text-brand-primary tabular-nums">
                        4h30
                      </span>
                      <span className="text-[11px] text-brand-muted">
                        {tHome('total')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stat 3: Quiz validés */}
                <div className="bg-white rounded-2xl p-4 border border-brand-border shadow-2xs flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-brand-muted font-medium block">
                      {tHome('quizzesPassed')}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg sm:text-xl font-bold text-brand-primary tabular-nums">
                        3/3
                      </span>
                      <span className="text-[11px] text-emerald-600 font-semibold">
                        100%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stat 4: Formule active */}
                <div className="bg-white rounded-2xl p-4 border border-brand-border shadow-2xs flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-brand-muted font-medium block">
                      Formule
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm sm:text-base font-bold text-brand-primary truncate">
                        Découverte
                      </span>
                      <span className="text-[10px] text-brand-teal font-semibold">
                        Gratuit
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-white rounded-2xl p-4 border border-brand-border shadow-2xs flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 text-brand-teal flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-brand-primary">100% Cas Pratiques Africains</h3>
                    <p className="text-[11px] text-brand-muted mt-0.5">Données réelles en FCFA (Kamer SARL, microfinance, logistique).</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-brand-border shadow-2xs flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary-light border border-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-brand-primary">Laboratoires dans le Navigateur</h3>
                    <p className="text-[11px] text-brand-muted mt-0.5">Exécutez formules, SQL et Python sans installer de logiciel lourd.</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-brand-border shadow-2xs flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-brand-primary">Mode Éco-Data Intégré</h3>
                    <p className="text-[11px] text-brand-muted mt-0.5">Optimisé pour Android d'entrée de gamme et connexions 3G/2G.</p>
                  </div>
                </div>
              </section>
            )}

            {/* Asymmetric 2-Column Grid (Main 7/12 + Sidebar 5/12 on Desktop) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
              
              {/* Left Main Column (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6">
                
                {/* Carte Mise en Avant : Reprendre le cours (ou Découvrir le cours vitrine) */}
                <section className="bg-white rounded-2xl p-5 border border-brand-border shadow-2xs relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200/60 flex items-center justify-center text-brand-teal">
                        <Table className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
                        Excel · Niveau 1 Débutant
                      </span>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-primary-light text-brand-primary">
                      {isAuthenticated ? 'En cours' : 'Gratuit'}
                    </span>
                  </div>

                  <h2 className="font-bold text-lg sm:text-xl text-brand-primary leading-snug">
                    {tHome('currentCourseTitle')}
                  </h2>

                  <div className="flex items-center gap-2 mt-2 text-brand-muted text-xs sm:text-sm">
                    <PlayCircle className="w-4 h-4 text-brand-teal shrink-0" />
                    <p className="truncate">
                      <span>{tHome('nextStep')} </span>
                      <strong className="text-brand-primary font-semibold">
                        {tHome('nextLessonDetail')}
                      </strong>
                    </p>
                  </div>

                  {/* Barre de Progression */}
                  <div className="mt-4 space-y-1.5">
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-brand-teal rounded-full transition-all duration-500"
                        style={{ width: isAuthenticated ? '25%' : '0%' }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-brand-muted text-xs">
                      <span>{isAuthenticated ? '3 sur 12 leçons' : '12 leçons pratiques'}</span>
                      <span>~ 3h30 au total</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-1">
                    <Link
                      href="/courses/excel-bases-analyse/lessons/nettoyer-donnees-ventes-douala"
                      className="w-full min-h-[48px] px-5 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.99]"
                    >
                      <Play className="w-4 h-4" />
                      <span>{isAuthenticated ? tHome('continueCourseAction') : 'Démarrer la formation gratuite'}</span>
                    </Link>
                  </div>
                </section>

                {/* Section Mes parcours 2x2 */}
                <section className="space-y-3">
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

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {/* Carte 1: Excel */}
                    <Link
                      href="/courses/excel-bases-analyse"
                      className="flex flex-col justify-between p-4 rounded-2xl bg-white border border-brand-border shadow-2xs hover:shadow-xs transition-all text-left min-h-[140px]"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-8 h-8 rounded-lg bg-teal-50 text-brand-teal flex items-center justify-center border border-teal-200/50">
                            <Table className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-brand-teal border border-teal-200/50">
                            3 niveaux
                          </span>
                        </div>
                        <h3 className="font-bold text-sm sm:text-base text-brand-primary truncate">Excel</h3>
                        <p className="text-[11px] sm:text-xs text-brand-muted mt-0.5">Bases, Power Query & DAX</p>
                      </div>
                      <div className="flex items-center text-brand-teal text-xs font-semibold mt-3">
                        <span>Explorer</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </div>
                    </Link>

                    {/* Carte 2: SQL */}
                    <Link
                      href="/courses/premiers-pas-sql"
                      className="flex flex-col justify-between p-4 rounded-2xl bg-white border border-brand-border shadow-2xs hover:shadow-xs transition-all text-left min-h-[140px]"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-8 h-8 rounded-lg bg-brand-primary-light text-brand-primary flex items-center justify-center border border-brand-primary/10">
                            <Database className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-brand-primary-light text-brand-primary">
                            Microfinance
                          </span>
                        </div>
                        <h3 className="font-bold text-sm sm:text-base text-brand-primary truncate">SQL</h3>
                        <p className="text-[11px] sm:text-xs text-brand-muted mt-0.5">Niveau 1 · Requêtes relationnelles</p>
                      </div>
                      <div className="flex items-center text-brand-teal text-xs font-semibold mt-3">
                        <span>Découvrir</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </div>
                    </Link>

                    {/* Carte 3: Power BI */}
                    <Link
                      href="/courses/decouvrir-power-bi"
                      className="flex flex-col justify-between p-4 rounded-2xl bg-white border border-brand-border shadow-2xs hover:shadow-xs transition-all text-left min-h-[140px]"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200/50">
                            <BarChart3 className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/50">
                            Direction
                          </span>
                        </div>
                        <h3 className="font-bold text-sm sm:text-base text-brand-primary truncate">Power BI</h3>
                        <p className="text-[11px] sm:text-xs text-brand-muted mt-0.5">Niveau 1 · Tableaux de bord</p>
                      </div>
                      <div className="flex items-center text-brand-teal text-xs font-semibold mt-3">
                        <span>Explorer</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </div>
                    </Link>

                    {/* Carte 4: Python */}
                    <Link
                      href="/courses/python-data-pandas"
                      className="flex flex-col justify-between p-4 rounded-2xl bg-white border border-brand-border shadow-2xs hover:shadow-xs transition-all text-left min-h-[140px]"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200/50">
                            <Code2 className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200/50">
                            Pandas
                          </span>
                        </div>
                        <h3 className="font-bold text-sm sm:text-base text-brand-primary truncate">Python</h3>
                        <p className="text-[11px] sm:text-xs text-brand-muted mt-0.5">Niveau 1 · Pandas & Data</p>
                      </div>
                      <div className="flex items-center text-brand-teal text-xs font-semibold mt-3">
                        <span>Explorer</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </div>
                    </Link>
                  </div>
                </section>

              </div>

              {/* Right Sidebar Column (5 cols on Desktop) */}
              <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6">
                
                {/* Rythme Hebdomadaire (si connecté) ou Avantages de la plateforme (si visiteur) */}
                {isAuthenticated ? (
                  <section className="bg-white rounded-2xl p-5 border border-brand-border shadow-2xs">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-brand-border/60">
                      <span className="text-sm font-bold text-brand-primary">
                        {tHome('weeklyPace')}
                      </span>
                      <span className="text-xs font-bold text-brand-teal">
                        {tHome('weeklyGoal')}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-brand-canvas-alt border border-brand-border/40">
                        <div className="flex items-center gap-1">
                          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span className="font-bold text-base text-brand-primary">4j</span>
                        </div>
                        <span className="text-[11px] text-brand-muted mt-0.5">{tHome('streakTitle')}</span>
                      </div>

                      <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-brand-canvas-alt border border-brand-border/40">
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-brand-teal" />
                          <span className="font-bold text-base text-brand-primary">3</span>
                        </div>
                        <span className="text-[11px] text-brand-muted mt-0.5">{tHome('lessonsFinished')}</span>
                      </div>

                      <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-brand-canvas-alt border border-brand-border/40">
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-teal-600" />
                          <span className="font-bold text-base text-brand-primary">3/3</span>
                        </div>
                        <span className="text-[11px] text-brand-muted mt-0.5">{tHome('quizzesPassed')}</span>
                      </div>
                    </div>
                  </section>
                ) : (
                  <section className="bg-white rounded-2xl p-5 border border-brand-border shadow-2xs space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 text-brand-teal flex items-center justify-center">
                        <Award className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-brand-primary">Certificats Vérifiables</h3>
                    </div>
                    <p className="text-xs text-brand-muted leading-relaxed">
                      Chaque formation terminée débloque un certificat officiel avec QR code unique, partageable directement sur LinkedIn et WhatsApp pour valoriser ton profil auprès des recruteurs.
                    </p>
                    <Link
                      href="/register"
                      className="inline-flex items-center text-xs font-semibold text-brand-teal hover:underline pt-1"
                    >
                      <span>Créer mon compte apprenant gratuit</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </section>
                )}

                {/* Section Pour continuer (Recommandation contextualisée) */}
                <section className="bg-white rounded-2xl p-5 border border-brand-border shadow-2xs space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200/50 text-teal-900 text-xs font-semibold">
                    <Lightbulb className="w-3.5 h-3.5 text-brand-teal" />
                    <span>{tHome('suggestedAfterQuiz')}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-brand-primary leading-snug">
                      {tHome('practiceTitle')}
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-muted mt-1 leading-relaxed">
                      {tHome('practiceDesc')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5 text-brand-muted text-xs font-medium">
                      <Clock className="w-4 h-4" />
                      <span>{tHome('tenMinChrono')}</span>
                    </div>

                    <Link
                      href="/courses/excel-bases-analyse"
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-2xs"
                    >
                      <span>{tHome('startExercise')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </section>

                {/* Bannière Formule Active (Mobile Money FCFA) */}
                <section className="rounded-2xl p-4 bg-brand-primary-light border border-brand-primary/10 shadow-2xs flex flex-col gap-3">
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
                    className="w-full min-h-[44px] px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-brand-primary border border-brand-border flex items-center justify-center gap-1.5 text-xs font-semibold shadow-2xs transition active:scale-95"
                  >
                    <span>{tHome('upgradeToEssential')}</span>
                    <span className="text-brand-teal font-bold">{tHome('essentialPriceMonthly')}</span>
                  </Link>
                </section>

              </div>

            </div>

          </div>
        </main>
      </div>

      {/* Mobile Pinned Bottom Navigation (Hidden on Desktop) */}
      <BottomNav />
    </div>
  );
}
