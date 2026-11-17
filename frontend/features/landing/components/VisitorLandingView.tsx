'use client';

import React from 'react';
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
  Coins,
  PlayCircle,
  Users,
  Compass
} from 'lucide-react';

export function VisitorLandingView() {
  const tracks = [
    {
      id: 'excel',
      name: 'Excel Professionnel',
      subtitle: 'Fondamentaux, Power Query & Modélisation DAX',
      icon: Table,
      color: 'teal',
      badge: '3 Niveaux · 18 Modules',
      href: '/login?next=/courses/excel-bases-analyse',
      highlights: ['Formules matricielles & RECHERCHEX', 'Automatisation Power Query', 'Modélisation financière en FCFA'],
    },
    {
      id: 'sql',
      name: 'SQL & Bases Relationnelles',
      subtitle: 'Extractions, Jointures & Analytics de Microfinance',
      icon: Database,
      color: 'blue',
      badge: '3 Niveaux · Portefeuille Réel',
      href: '/login?next=/courses/sql-debutant-requetes-filtres',
      highlights: ['SELECT, filtres WHERE & agrégations', 'Calcul du PAR 30 (Crédit)', 'Fonctions de fenêtrage (OVER)'],
    },
    {
      id: 'powerbi',
      name: 'Power BI & Décisionnel',
      subtitle: 'Modélisation en Étoile & Tableaux de Bord de Direction',
      icon: BarChart3,
      color: 'amber',
      badge: '3 Niveaux · DAX & RLS',
      href: '/login?next=/courses/powerbi-debutant-modelisation-etoile',
      highlights: ['Schéma en étoile Faits vs Dimensions', 'Mesures DAX (CALCULATE, DIVIDE)', 'Sécurité par rôle (RLS) régional'],
    },
    {
      id: 'python',
      name: 'Python & Data Science',
      subtitle: 'Manipulation Pandas, Nettoyage & Rapports Automatisés',
      icon: Code2,
      color: 'purple',
      badge: '3 Niveaux · Pandas',
      href: '/login?next=/courses/python-debutant-pandas-exploration',
      highlights: ['Inspection de DataFrames volumineux', 'Imputation de valeurs manquantes', 'Export de rapports multi-onglets Excel'],
    },
    {
      id: 'git',
      name: 'Git & GitHub pour Analystes',
      subtitle: 'Gestion de Versions, Collaboration & Showcase Emploi',
      icon: GitBranch,
      color: 'emerald',
      badge: '3 Niveaux · Portfolio Pro',
      href: '/login?next=/courses/git-debutant-versioning-local',
      highlights: ['Versioning local (init, add, commit)', 'Résolution de conflits de fusion', 'Portfolio GitHub vérifiable par recruteurs'],
    },
  ];

  return (
    <div className="flex flex-col gap-6 sm:gap-8 pb-12">
      
      {/* 1. HERO PRINCIPAL AVEC PROMESSE CLAIRE */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-border shadow-xs relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-teal-50/60 blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-amber-50/40 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          {/* Tag de géolocalisation et devise */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-900 text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
              <span>Plateforme E-learning Data Africaine</span>
            </span>
            <span className="text-xs font-semibold text-brand-muted px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
              Douala · Yaoundé · Bafoussam · FCFA (XAF)
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-brand-primary tracking-tight leading-[1.15]">
            Formez-vous à l'analyse de données par la pratique sur des cas réels africains.
          </h1>

          <p className="mt-4 text-sm sm:text-base lg:text-lg text-brand-muted leading-relaxed">
            DataMboa est la plateforme conçue pour les réalités du Cameroun et d'Afrique centrale. Maîtrisez <strong>Excel, SQL, Power BI, Python et Git</strong> directement dans votre navigateur, sans configuration complexe, avec des jeux de données d'entreprises locales chiffrés en FCFA.
          </p>

          {/* Action Call Obligatoire (Gate) */}
          <div className="mt-6 sm:mt-8 p-4 sm:p-5 rounded-2xl bg-brand-primary-light border border-brand-primary/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-brand-teal" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-brand-primary">
                  Connexion requise pour démarrer
                </h3>
                <p className="text-[11px] sm:text-xs text-brand-muted">
                  Connectez-vous pour accéder à vos cours, quiz et laboratoires interactifs.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                href="/login"
                className="flex-1 sm:flex-none min-h-[44px] px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition active:scale-95"
              >
                <span>Se connecter</span>
                <ArrowRight className="w-4 h-4 text-brand-teal" />
              </Link>
              <Link
                href="/register"
                className="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-brand-border text-brand-primary font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition active:scale-95 shadow-2xs"
              >
                <Sparkles className="w-4 h-4 text-brand-teal" />
                <span>Créer un compte</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CE QUE FAIT EXACTEMENT DATAMBOA (4 PILIERS DE DIFFÉRENCIATION) */}
      <section className="space-y-4">
        <div className="text-center sm:text-left">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-teal">
            Pourquoi DataMboa est différent
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-brand-primary mt-0.5">
            Ce que fait DataMboa exactement
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-2xl">
            La plupart des formations data utilisent des cours magistraux passifs avec des données de la Silicon Valley en dollars. Voici notre méthode 100% concrète :
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pilier 1 */}
          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-2xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 text-brand-teal flex items-center justify-center mb-3">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-brand-primary leading-snug">
                100% Cas d'Entreprises Réelles en FCFA
              </h3>
              <p className="text-xs text-brand-muted mt-1.5 leading-relaxed">
                Pas de données abstraites. Vous analysez des ventes de supermarchés à Akwa, le portefeuille d'une microfinance à Bafoussam ou la logistique d'une brasserie.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-teal-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal" />
              <span>Montants XAF & réalités PME</span>
            </div>
          </div>

          {/* Pilier 2 */}
          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-2xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 text-blue-700 flex items-center justify-center mb-3">
                <Laptop className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-brand-primary leading-snug">
                Laboratoires Intégrés au Navigateur
              </h3>
              <p className="text-xs text-brand-muted mt-1.5 leading-relaxed">
                Pratiquez immédiatement sans avoir à installer de logiciel lourd. Écrivez et exécutez vos requêtes SQL, scripts Pandas et calculs DAX directement en ligne.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-blue-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Zéro installation requise</span>
            </div>
          </div>

          {/* Pilier 3 */}
          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-2xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center mb-3">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-brand-primary leading-snug">
                Pédagogie Active & Correction Immédiate
              </h3>
              <p className="text-xs text-brand-muted mt-1.5 leading-relaxed">
                Fini les vidéos passives sans pratique. Chaque notion est validée par un atelier pratique, un quiz avec feedback Bloom instantané et des missions professionnelles.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-amber-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Feedback pédagogique immédiat</span>
            </div>
          </div>

          {/* Pilier 4 */}
          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-2xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-brand-primary leading-snug">
                Certificats Infalsifiables & Portfolio GitHub
              </h3>
              <p className="text-xs text-brand-muted mt-1.5 leading-relaxed">
                Chaque cursus achevé délivre un certificat officiel vérifiable par QR code et vous guide pour créer votre portfolio de projets concrets pour séduire les employeurs.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Code unique vérifiable en ligne</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LES 5 CURSUS PROFESSIONNELS DISPONIBLES */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-teal">
              Catalogue Cursus Métier
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-brand-primary mt-0.5">
              5 Parcours Complets du Débutant à l'Expert
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted mt-1">
              Chaque parcours est découpé en 3 niveaux progressifs (N1, N2, N3) avec vidéos légères (~1 Mo) et fichiers téléchargeables.
            </p>
          </div>
          <Link
            href="/login"
            className="text-xs sm:text-sm font-bold text-brand-teal hover:underline flex items-center gap-1 self-start sm:self-auto min-h-[44px]"
          >
            <span>Se connecter pour explorer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tracks.map((trk) => {
            const Icon = trk.icon;
            return (
              <div
                key={trk.id}
                className="bg-white rounded-2xl p-5 border border-brand-border shadow-2xs flex flex-col justify-between hover:border-brand-teal/40 transition-all text-left"
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

                  <h3 className="text-base font-bold text-brand-primary">
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

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-brand-muted flex items-center gap-1">
                    <PlayCircle className="w-3.5 h-3.5 text-brand-teal" />
                    <span>Vidéos & Labos inclus</span>
                  </span>
                  <Link
                    href={trk.href}
                    className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-bold flex items-center gap-1 transition"
                  >
                    <span>Démarrer</span>
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
                Diagnostic Adaptatif
              </span>
              <h3 className="text-base font-bold text-white mt-1">
                Quel est votre niveau actuel ?
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Passez notre test rapide de 5 minutes pour évaluer vos compétences en Excel, SQL, Python et Power BI et obtenir votre plan de formation personnalisé.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10">
              <Link
                href="/login?next=/placement-test"
                className="w-full min-h-[44px] px-4 py-2 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <span>Faire le test de positionnement</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BANNIÈRE FINALE : CONÇU POUR LES CONNEXIONS AFRICAINES */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-brand-primary">
              Optimisé pour les réseaux mobiles 3G et smartphones modestes
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-xl">
              Pages inférieures à 300 Ko, vidéos compressées à ~1 Mo, mode économiseur de données activable en 1 clic et support PWA pour continuer à réviser même en cas de coupure réseau.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          <Link
            href="/login"
            className="flex-1 sm:flex-none min-h-[48px] px-6 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-semibold flex items-center justify-center gap-2 transition active:scale-95 shadow-xs"
          >
            <span>Se connecter</span>
            <ArrowRight className="w-4 h-4 text-brand-teal" />
          </Link>
        </div>
      </section>

    </div>
  );
}
