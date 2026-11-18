'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { 
  Table, 
  Database, 
  BarChart3, 
  Code2, 
  GitBranch, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Award, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  GraduationCap, 
  Laptop, 
  PlayCircle,
  Users,
  Compass,
  Star,
  Building2,
  Check,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { DataMboaStudioMockup } from './DataMboaStudioMockup';

export function VisitorLandingView() {
  const t = useTranslations('Landing');
  const locale = useLocale();
  const isEn = locale === 'en';

  const tracks = [
    {
      id: 'excel',
      name: isEn ? 'Professional Excel' : 'Excel Professionnel',
      subtitle: isEn ? 'Fundamentals, Power Query & DAX Modeling' : 'Fondamentaux, Power Query & Modélisation DAX',
      icon: Table,
      color: 'teal',
      badge: isEn ? '3 Levels · 18 Modules' : '3 Niveaux · 18 Modules',
      href: '/login?next=/courses/excel-bases-analyse',
      highlights: isEn
        ? ['Array formulas & XLOOKUP', 'Power Query Automation', 'Financial modeling']
        : ['Formules matricielles & RECHERCHEX', 'Automatisation Power Query', 'Modélisation financière'],
    },
    {
      id: 'sql',
      name: isEn ? 'SQL & Relational Databases' : 'SQL & Bases Relationnelles',
      subtitle: isEn ? 'Queries, Joins & Microfinance Analytics' : 'Extractions, Jointures & Analytics de Microfinance',
      icon: Database,
      color: 'blue',
      badge: isEn ? '3 Levels · Real Portfolio' : '3 Niveaux · Portefeuille Réel',
      href: '/login?next=/courses/sql-debutant-requetes-filtres',
      highlights: isEn
        ? ['SELECT, WHERE filters & aggregations', 'PAR 30 Credit Risk Analysis', 'Window Functions (OVER)']
        : ['SELECT, filtres WHERE & agrégations', 'Calcul du PAR 30 (Crédit)', 'Fonctions de fenêtrage (OVER)'],
    },
    {
      id: 'powerbi',
      name: isEn ? 'Power BI & Business Intelligence' : 'Power BI & Décisionnel',
      subtitle: isEn ? 'Star Schema Modeling & Executive Dashboards' : 'Modélisation en Étoile & Tableaux de Bord de Direction',
      icon: BarChart3,
      color: 'amber',
      badge: isEn ? '3 Levels · DAX & RLS' : '3 Niveaux · DAX & RLS',
      href: '/login?next=/courses/powerbi-debutant-modelisation-etoile',
      highlights: isEn
        ? ['Star Schema Facts vs Dimensions', 'DAX Measures (CALCULATE, DIVIDE)', 'Row-Level Security (RLS)']
        : ['Schéma en étoile Faits vs Dimensions', 'Mesures DAX (CALCULATE, DIVIDE)', 'Sécurité par rôle (RLS) régional'],
    },
    {
      id: 'python',
      name: isEn ? 'Python & Data Science' : 'Python & Data Science',
      subtitle: isEn ? 'Pandas DataFrames, Cleaning & Automated Reports' : 'Manipulation Pandas, Nettoyage & Rapports Automatisés',
      icon: Code2,
      color: 'purple',
      badge: isEn ? '3 Levels · Pandas' : '3 Niveaux · Pandas',
      href: '/login?next=/courses/python-debutant-pandas-exploration',
      highlights: isEn
        ? ['Large DataFrame inspection', 'Missing value imputation', 'Multi-sheet Excel report export']
        : ['Inspection de DataFrames volumineux', 'Imputation de valeurs manquantes', 'Export de rapports multi-onglets Excel'],
    },
    {
      id: 'git',
      name: isEn ? 'Git & GitHub for Analysts' : 'Git & GitHub pour Analystes',
      subtitle: isEn ? 'Version Control, Collaboration & Job Portfolio' : 'Gestion de Versions, Collaboration & Showcase Emploi',
      icon: GitBranch,
      color: 'emerald',
      badge: isEn ? '3 Levels · Pro Portfolio' : '3 Niveaux · Portfolio Pro',
      href: '/login?next=/courses/git-debutant-versioning-local',
      highlights: isEn
        ? ['Local versioning (init, add, commit)', 'Merge conflict resolution', 'Recruiter-verifiable GitHub portfolio']
        : ['Versioning local (init, add, commit)', 'Résolution de conflits de fusion', 'Portfolio GitHub vérifiable par recruteurs'],
    },
  ];

  const testimonials = [
    {
      name: 'Mireille K.',
      role: isEn ? 'Junior Financial Controller · Douala' : 'Contrôleur de Gestion Junior · Douala',
      company: isEn ? 'Agri-food SME' : 'PME Agro-alimentaire',
      comment: isEn
        ? 'Before DataMboa, I spent 4 hours a week copying and pasting sales data in Excel. Thanks to the Power Query course and real business cases, everything is now automated in 1 click.'
        : 'Avant DataMboa, je passais 4 heures par semaine à copier-coller des données de vente sur Excel. Grâce au cours Power Query et aux cas réels, tout est désormais automatisé en 1 clic.',
      rating: 5,
    },
    {
      name: 'Arsène F.',
      role: isEn ? 'Credit & Risk Analyst · Yaoundé' : 'Analyste Crédit & Risques · Yaoundé',
      company: isEn ? 'Microfinance Institution' : 'Établissement de Microfinance',
      comment: isEn
        ? 'The in-browser SQL laboratory allowed me to practice in the evening on my phone without installing heavy software. I earned my promotion thanks to the queries I learned.'
        : 'Le laboratoire SQL directement dans le navigateur m\'a permis de m\'entraîner le soir sur mon téléphone sans installer de logiciel lourd. J\'ai obtenu ma promotion grâce aux requêtes apprises.',
      rating: 5,
    },
    {
      name: 'Dr. Steve T.',
      role: isEn ? 'Financial Auditor · Bafoussam' : 'Auditeur Financier · Bafoussam',
      company: isEn ? 'Accounting & Audit Firm' : 'Cabinet d\'Expertise',
      comment: isEn
        ? 'QR code verification and practical real-world business projects make all the difference with recruiters. A truly professional training program tailored to our economy.'
        : 'La validation par QR code et les projets pratiques réels font toute la différence auprès des recruteurs locaux. Une vraie formation professionnelle taillée pour notre économie.',
      rating: 5,
    },
  ];

  return (
    <div className="flex flex-col gap-10 sm:gap-14 pb-12">
      
      {/* 1. HERO PRINCIPAL 2 COLONNES SUR DESKTOP (PC IMPACTANT) */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-brand-border shadow-xs relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-teal-50/70 blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-amber-50/50 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column (7 cols): Pitch & Call-to-action */}
          <div className="lg:col-span-7 space-y-5">
            {/* Tag de géolocalisation et devise */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-900 text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
                <span>{t('badgeAfro')}</span>
              </span>
              <span className="text-xs font-semibold text-brand-muted px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                {t('badgeLocations')}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-brand-primary tracking-tight leading-snug">
              {t('heroTitle')}
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-brand-muted leading-relaxed">
              {t('heroSubtitle')}
            </p>

            {/* Social Proof Badges Row */}
            <div className="flex flex-wrap items-center gap-4 py-1 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Users className="w-4 h-4 text-brand-teal" />
                <span>{t('learnersCount')}</span>
              </div>
              <div className="flex items-center gap-1 font-bold text-amber-700">
                <div className="flex items-center text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <span>{t('ratingScore')}</span>
              </div>
            </div>

            {/* Action Call Obligatoire (Gate de connexion) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-brand-primary-light border border-brand-primary/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Lock className="w-5 h-5 text-brand-teal" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-brand-primary">
                    {t('loginGateTitle')}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-brand-muted">
                    {t('loginGateSubtitle')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <Link
                  href="/login"
                  className="flex-1 sm:flex-none min-h-[44px] px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition active:scale-95"
                >
                  <span>{t('loginButton')}</span>
                  <ArrowRight className="w-4 h-4 text-brand-teal" />
                </Link>
                <Link
                  href="/register"
                  className="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-brand-border text-brand-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition active:scale-95 shadow-2xs"
                >
                  <Sparkles className="w-4 h-4 text-brand-teal" />
                  <span>{t('registerButton')}</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Live In-Browser Studio Mockup (Visible on Desktop) */}
          <div className="lg:col-span-5">
            <DataMboaStudioMockup />
          </div>

        </div>
      </section>

      {/* 2. RECONNAISSANCE & CAS CONCRETS AFRICAINS (PARTENAIRES PME) */}
      <section className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <Building2 className="w-4 h-4 text-brand-teal shrink-0" />
          <span>{isEn ? 'Real business case studies integrated into the curriculum:' : 'Cas d\'entreprise réels intégrés au cursus :'}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 font-semibold text-slate-700">
          <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
            {isEn ? 'Kamer SARL (Retail Distribution Douala)' : 'Kamer SARL (Quincaillerie Douala)'}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
            {isEn ? 'Microfinance Bafoussam (Loan Portfolio)' : 'Microfinance Bafoussam (Portefeuille Crédits)'}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
            {isEn ? 'Central Logistics Yaoundé' : 'Logistique Centrale Yaoundé'}
          </span>
        </div>
      </section>

      {/* 3. CE QUE FAIT EXACTEMENT DATAMBOA (4 PILIERS DE DIFFÉRENCIATION) */}
      <section className="space-y-4">
        <div className="text-center sm:text-left">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-teal">
            {t('whyBadge')}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-brand-primary mt-0.5">
            {t('whyTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-2xl">
            {t('whySubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pilier 1 */}
          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-2xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 text-brand-teal flex items-center justify-center mb-3">
                <Table className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-brand-primary leading-snug">
                {t('pillar1Title')}
              </h3>
              <p className="text-xs text-brand-muted mt-1.5 leading-relaxed">
                {t('pillar1Desc')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-teal-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal" />
              <span>{t('pillar1Tag')}</span>
            </div>
          </div>

          {/* Pilier 2 */}
          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-2xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 text-blue-700 flex items-center justify-center mb-3">
                <Laptop className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-brand-primary leading-snug">
                {t('pillar2Title')}
              </h3>
              <p className="text-xs text-brand-muted mt-1.5 leading-relaxed">
                {t('pillar2Desc')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-blue-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('pillar2Tag')}</span>
            </div>
          </div>

          {/* Pilier 3 */}
          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-2xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-brand-primary leading-snug">
                {t('pillar3Title')}
              </h3>
              <p className="text-xs text-brand-muted mt-1.5 leading-relaxed">
                {t('pillar3Desc')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-amber-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
              <span>{t('pillar3Tag')}</span>
            </div>
          </div>

          {/* Pilier 4 */}
          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-2xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-brand-primary leading-snug">
                {t('pillar4Title')}
              </h3>
              <p className="text-xs text-brand-muted mt-1.5 leading-relaxed">
                {t('pillar4Desc')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('pillar4Tag')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LES 5 CURSUS PROFESSIONNELS DISPONIBLES */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-teal">
              {t('catalogBadge')}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-brand-primary mt-0.5">
              {t('catalogTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted mt-1">
              {t('catalogSubtitle')}
            </p>
          </div>
          <Link
            href="/login"
            className="text-xs sm:text-sm font-bold text-brand-teal hover:underline flex items-center gap-1 self-start sm:self-auto min-h-[44px]"
          >
            <span>{t('exploreLogin')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tracks.map((trk) => {
            const Icon = trk.icon;
            return (
              <div
                key={trk.id}
                className="bg-white rounded-2xl p-5 border border-brand-border shadow-2xs flex flex-col justify-between hover:border-brand-teal/40 transition-all text-left space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/50 flex items-center justify-center text-brand-teal">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-brand-primary border border-slate-200">
                      {trk.badge}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-brand-primary">
                    {trk.name}
                  </h3>
                  <p className="text-xs text-brand-muted mt-1">
                    {trk.subtitle}
                  </p>

                  <ul className="mt-3.5 space-y-1.5">
                    {trk.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-brand-text">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal shrink-0" />
                        <span className="truncate">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-brand-muted flex items-center gap-1">
                    <PlayCircle className="w-3.5 h-3.5 text-brand-teal" />
                    <span>{t('labIncluded')}</span>
                  </span>
                  <Link
                    href={trk.href}
                    className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-bold flex items-center gap-1 transition"
                  >
                    <span>{t('startTrack')}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Carte Spéciale : Test de Positionnement */}
          <div className="bg-gradient-to-br from-brand-primary to-slate-900 rounded-2xl p-5 text-white flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-brand-teal mb-3">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-teal">
                {t('diagnosticCardBadge')}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                {t('diagnosticCardTitle')}
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {t('diagnosticCardDesc')}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10">
              <Link
                href="/login?next=/placement-test"
                className="w-full min-h-[44px] px-4 py-2 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs"
              >
                <span>{t('diagnosticCardButton')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TÉMOIGNAGES & RETOURS VISITEURS */}
      <section className="space-y-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-teal">
            {t('feedbackBadge')}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-brand-primary mt-0.5">
            {t('feedbackTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((testi, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-brand-border shadow-2xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(testi.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  &ldquo;{testi.comment}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <div className="font-bold text-xs text-slate-900">{testi.name}</div>
                <div className="text-[11px] text-brand-teal font-semibold">{testi.role}</div>
                <div className="text-[10px] text-slate-500">{testi.company}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bloc Retours Visiteurs & Échange WhatsApp Direct */}
        <div className="bg-gradient-to-br from-teal-50/90 via-emerald-50/50 to-white rounded-3xl p-6 sm:p-8 border border-teal-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-teal text-white flex items-center justify-center shrink-0 shadow-xs">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-100/70 text-teal-900 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>{isEn ? 'Course Advisor · 657 54 62 59' : 'Conseiller d\'orientation · 657 54 62 59'}</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {t('visitorFeedbackTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                {t('visitorFeedbackDesc')}
              </p>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <a
              href="https://wa.me/237657546259?text=Bonjour%20DataMboa,%20j'ai%20une%20question%20concernant%20les%20formations"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto min-h-[48px] px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t('visitorFeedbackAction')}</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
            </a>
          </div>
        </div>
      </section>

      {/* 6. BANNIÈRE FINALE : CONÇU POUR TOUTES LES CONNEXIONS */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-brand-primary">
              {t('mobileBannerTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-xl">
              {t('mobileBannerDesc')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          <Link
            href="/login"
            className="flex-1 sm:flex-none min-h-[48px] px-6 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-semibold flex items-center justify-center gap-2 transition active:scale-95 shadow-xs"
          >
            <span>{t('loginButton')}</span>
            <ArrowRight className="w-4 h-4 text-brand-teal" />
          </Link>
        </div>
      </section>

      {/* 7. BOUTON FLOTTANT D'ASSISTANCE WHATSAPP POUR LES VISITEURS */}
      <aside aria-label="Assistance WhatsApp Visiteurs" className="fixed bottom-5 right-5 z-40">
        <a
          href="https://wa.me/237657546259?text=Bonjour%20DataMboa,%20j'ai%20une%20question%20concernant%20les%20formations"
          target="_blank"
          rel="noopener noreferrer"
          title="Poser une question sur WhatsApp au 657 54 62 59"
          className="group flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all active:scale-95 border-2 border-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          <span className="font-bold text-xs sm:text-sm whitespace-nowrap">
            WhatsApp 657 54 62 59
          </span>
        </a>
      </aside>

    </div>
  );
}
