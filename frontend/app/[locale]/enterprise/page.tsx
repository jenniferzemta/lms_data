'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { PublicHeader, PublicFooter } from '@/components';
import { 
  Building2, 
  Users, 
  CheckCircle2, 
  Table, 
  BarChart3, 
  Database, 
  Award, 
  FileSpreadsheet, 
  ShieldCheck, 
  Clock, 
  Mail, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function EnterprisePage() {
  const t = useTranslations('Enterprise');
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  const packs = [
    {
      title: 'Pack Reporting & Excel Avancé',
      subtitle: 'Contrôle de gestion, finance & logistique',
      icon: Table,
      color: 'teal',
      hours: '30 heures de pratique',
      audience: 'Comptables, contrôleurs, gestionnaires de stock',
      features: [
        'Automatisation Power Query sans coder',
        'Formules matricielles & RECHERCHEX',
        'Modélisation de bilans et trésorerie en FCFA',
        'Tableaux de bord dynamiques prêts pour la direction',
      ],
      priceEst: 'À partir de 250 000 FCFA / cohorte (jusqu\'à 10 collaborateurs)',
    },
    {
      title: 'Pack Décisionnel Power BI',
      subtitle: 'Tableaux de bord de direction & KPIs',
      icon: BarChart3,
      color: 'amber',
      hours: '40 heures de pratique',
      audience: 'Responsables financiers, auditeurs, directeurs opérationnels',
      features: [
        'Modélisation en étoile (Faits & Dimensions)',
        'Mesures DAX avancées (CALCULATE, DIVIDE)',
        'Sécurité par rôle (RLS) pour directeurs régionaux',
        'Publication de rapports interactifs en ligne',
      ],
      priceEst: 'À partir de 450 000 FCFA / cohorte (jusqu\'à 10 collaborateurs)',
    },
    {
      title: 'Pack Data Analytics (SQL & Python)',
      subtitle: 'Extraction de données massives & automatisation',
      icon: Database,
      color: 'blue',
      hours: '50 heures de pratique',
      audience: 'Analystes data, informaticiens, auditeurs SI',
      features: [
        'Requêtes SQL complexes sur bases microfinance/banque',
        'Nettoyage et manipulation de millions de lignes en Python',
        'Gestion de versions de scripts sous Git & GitHub',
        'Export automatisé de rapports vers Excel',
      ],
      priceEst: 'À partir de 600 000 FCFA / cohorte (jusqu\'à 10 collaborateurs)',
    },
  ];

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSuccess(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-canvas text-brand-text">
      {/* Public Header */}
      <PublicHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-10">
        
        {/* 1. HERO ENTREPRISE */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-border shadow-xs relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold">
                <Building2 className="w-3.5 h-3.5 text-blue-700" />
                <span>{t('badge')}</span>
              </span>
              <span className="text-xs text-brand-muted font-semibold bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                {t('subBadge')}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-brand-primary tracking-tight leading-snug">
              {t('heroTitle')}
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-brand-muted leading-relaxed">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#packs"
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition active:scale-95"
              >
                <span>{t('ctaPacks')}</span>
                <ArrowRight className="w-4 h-4 text-brand-teal" />
              </a>
              <a
                href="#devis"
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-brand-border text-brand-primary font-semibold text-xs sm:text-sm flex items-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4 text-brand-teal" />
                <span>{t('ctaQuote')}</span>
              </a>
            </div>
          </div>
        </section>

        {/* 2. AVANTAGES ENTREPRISE */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 text-brand-teal flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">{t('benefit1Title')}</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              {t('benefit1Desc')}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">{t('benefit2Title')}</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              {t('benefit2Desc')}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200/60 text-purple-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">{t('benefit3Title')}</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              {t('benefit3Desc')}
            </p>
          </div>
        </section>

        {/* 3. PACKS DE FORMATION */}
        <section id="packs" className="space-y-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-teal">
              {t('packsBadge')}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-brand-primary mt-0.5">
              {t('packsTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {packs.map((pk, idx) => {
              const Icon = pk.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-brand-border shadow-2xs flex flex-col justify-between hover:border-brand-teal/40 transition-all space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200/60 text-brand-teal flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {pk.hours}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-slate-900">{pk.title}</h3>
                      <p className="text-xs text-brand-teal font-semibold mt-0.5">{pk.subtitle}</p>
                    </div>

                    <p className="text-[11px] text-slate-500 pt-1">
                      <strong>Public :</strong> {pk.audience}
                    </p>

                    <ul className="space-y-2 pt-2 border-t border-slate-100">
                      {pk.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="text-[11px] font-semibold text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                      {pk.priceEst}
                    </div>
                    <a
                      href="#devis"
                      className="w-full min-h-[42px] px-4 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs"
                    >
                      <span>Demander un devis pour ce pack</span>
                      <ArrowRight className="w-3.5 h-3.5 text-brand-teal" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. FORMULAIRE DE DEVIS B2B */}
        <section id="devis" className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-xs">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-2 text-brand-teal">
              <Mail className="w-5 h-5" />
              <span className="text-xs uppercase font-bold tracking-wider">{t('quoteBadge')}</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-brand-primary">
              {t('quoteTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted">
              {t('quoteSubtitle')}
            </p>

            {quoteSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{t('quoteSuccess')}</span>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t('labelCompany')}</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Banque Atlantique Cameroun"
                      className="w-full min-h-[44px] px-3.5 rounded-xl bg-slate-50 border border-brand-border text-xs focus:bg-white focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t('labelCity')}</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Douala, Cameroun"
                      className="w-full min-h-[44px] px-3.5 rounded-xl bg-slate-50 border border-brand-border text-xs focus:bg-white focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t('labelContact')}</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Directrice des Ressources Humaines"
                      className="w-full min-h-[44px] px-3.5 rounded-xl bg-slate-50 border border-brand-border text-xs focus:bg-white focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t('labelTeamSize')}</label>
                    <select
                      className="w-full min-h-[44px] px-3.5 rounded-xl bg-slate-50 border border-brand-border text-xs focus:bg-white focus:outline-none focus:border-brand-primary"
                    >
                      <option>1 à 5 collaborateurs</option>
                      <option>6 à 15 collaborateurs</option>
                      <option>16 à 50 collaborateurs</option>
                      <option>Plus de 50 collaborateurs</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t('labelEmail')}</label>
                    <input
                      type="email"
                      required
                      placeholder="formation@banque.cm"
                      className="w-full min-h-[44px] px-3.5 rounded-xl bg-slate-50 border border-brand-border text-xs focus:bg-white focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t('labelPhone')}</label>
                    <input
                      type="tel"
                      required
                      placeholder="+237 6XX XX XX XX"
                      className="w-full min-h-[44px] px-3.5 rounded-xl bg-slate-50 border border-brand-border text-xs focus:bg-white focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('labelGoal')}</label>
                  <textarea
                    rows={3}
                    placeholder="Ex: Automatiser les reportings de succursales, former nos contrôleurs de gestion sur Power BI..."
                    className="w-full p-3 rounded-xl bg-slate-50 border border-brand-border text-xs focus:bg-white focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="min-h-[44px] px-6 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-brand-teal" />
                  <span>{t('submitQuote')}</span>
                </button>
              </form>
            )}
          </div>
        </section>

      </main>

      {/* Public Footer */}
      <PublicFooter />
    </div>
  );
}
