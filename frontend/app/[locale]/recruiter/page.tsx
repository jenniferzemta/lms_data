'use client';

import React, { useState } from 'react';
import { Link, useRouter } from '@/i18n/routing';
import { PublicHeader, PublicFooter } from '@/components';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Award, 
  FolderKanban, 
  ArrowRight, 
  Briefcase, 
  CheckCircle2, 
  Building2, 
  Mail, 
  Star,
  ExternalLink,
  Table,
  Database,
  BarChart3,
  Code2,
  GitBranch
} from 'lucide-react';

export default function RecruiterPage() {
  const router = useRouter();
  const [certCode, setCertCode] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [contactSuccess, setContactSuccess] = useState(false);

  const sampleTalents = [
    {
      id: 'tal-1',
      name: 'Junior N. (Douala)',
      title: 'Data Analyst Junior · Spécialiste Excel & SQL',
      score: '96%',
      tools: ['Excel DAX', 'SQL Microfinance', 'Power BI'],
      verifiedCourses: 3,
      certCode: 'DM-EXC-2026-N104',
      badge: 'Major de cohorte',
      portfolioSlug: 'junior-douala',
    },
    {
      id: 'tal-2',
      name: 'Carine M. (Yaoundé)',
      title: 'Business Intelligence & Reporting Financier',
      score: '94%',
      tools: ['Power BI', 'SQL', 'Excel Avancé'],
      verifiedCourses: 3,
      certCode: 'DM-PBI-2026-K921',
      badge: 'Certifiée Expert',
      portfolioSlug: 'carine-yaounde',
    },
    {
      id: 'tal-3',
      name: 'Rodrigue T. (Bafoussam)',
      title: 'Data Scientist & Développeur Python',
      score: '91%',
      tools: ['Python Pandas', 'SQL', 'Git & GitHub'],
      verifiedCourses: 2,
      certCode: 'DM-PYT-2026-R411',
      badge: 'Portfolio GitHub Actif',
      portfolioSlug: 'rodrigue-bafoussam',
    },
  ];

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certCode.trim()) return;
    router.push(`/verify/${encodeURIComponent(certCode.trim())}`);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-canvas text-brand-text">
      {/* Public Header */}
      <PublicHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-10">
        
        {/* 1. HERO RECRUTEUR */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-border shadow-xs relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bold">
                <Users className="w-3.5 h-3.5 text-purple-700" />
                <span>Espace Recruteurs & Partenaires RH</span>
              </span>
              <span className="text-xs text-brand-muted font-semibold bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                Cameroun & CEMAC
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-brand-primary tracking-tight leading-snug">
              Recrutez des Data Analysts immédiatement opérationnels sur vos outils d&apos;entreprise.
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-brand-muted leading-relaxed">
              Les apprenants DataMboa sont formés sur des cas réels chiffrés en FCFA, testés dans nos laboratoires in-browser (Excel, SQL, Power BI, Python, Git) et certifiés après auto-évaluation et correction stricte.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#talents"
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition active:scale-95"
              >
                <Search className="w-4 h-4 text-brand-teal" />
                <span>Consulter le vivier de talents</span>
              </a>
              <a
                href="#verifier"
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-brand-border text-brand-primary font-semibold text-xs sm:text-sm flex items-center gap-2 transition"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Vérifier un certificat</span>
              </a>
            </div>
          </div>
        </section>

        {/* 2. OUTIL DE VÉRIFICATION RAPIDE DE CERTIFICAT */}
        <section id="verifier" className="bg-gradient-to-br from-brand-primary to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2 text-brand-teal">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs uppercase font-bold tracking-wider">Authentification Instantanée</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold">
              Vérifier l&apos;authenticité d&apos;un certificat candidat
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Un candidat vous présente un certificat DataMboa ? Entrez son code unique (ex: DM-EXC-2026-DEMO) pour vérifier son authenticité, ses compétences SMART validées et la date d&apos;obtention.
            </p>

            <form onSubmit={handleVerify} className="flex flex-col sm:flex-row items-stretch gap-2.5 pt-2">
              <input
                type="text"
                value={certCode}
                onChange={(e) => setCertCode(e.target.value)}
                placeholder="Code du certificat (ex: DM-EXC-2026-DEMO)"
                className="flex-1 min-h-[44px] px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:border-brand-teal focus:bg-white/20 transition"
              />
              <button
                type="submit"
                className="min-h-[44px] px-5 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition active:scale-95 shrink-0"
              >
                <span>Vérifier en direct</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </section>

        {/* 3. VIVIER DES PROFILS CERTIFIÉS */}
        <section id="talents" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-teal">
                Vivier de Compétences
              </span>
              <h2 className="text-base sm:text-lg font-bold text-brand-primary mt-0.5">
                Profils Récemment Certifiés & Disponibles
              </h2>
              <p className="text-xs text-brand-muted mt-0.5">
                Chaque profil dispose d&apos;un portfolio de projets réels vérifiable en ligne.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sampleTalents.map((tal) => (
              <div
                key={tal.id}
                className="bg-white rounded-2xl p-5 border border-brand-border shadow-2xs flex flex-col justify-between hover:border-brand-teal/50 transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{tal.name}</h3>
                      <p className="text-xs text-brand-teal font-semibold mt-0.5">{tal.title}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                      Score : {tal.score}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {tal.tools.map((tool, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 text-xs text-slate-600 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Award className="w-3.5 h-3.5 text-brand-teal" />
                      <span>{tal.verifiedCourses} certifications validées</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-mono text-[10px] text-slate-500">{tal.certCode}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/verify/${tal.certCode}`}
                    className="min-h-[40px] px-3 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-bold flex items-center gap-1 transition"
                  >
                    <span>Voir le certificat</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <a
                    href="#contact"
                    className="min-h-[40px] px-3 rounded-lg border border-brand-border hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <span>Contacter</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. FORMULAIRE DE CONTACT ENTREPRISE / DÉPÔT D'OFFRE */}
        <section id="contact" className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-xs">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-2 text-brand-teal">
              <Building2 className="w-5 h-5" />
              <span className="text-xs uppercase font-bold tracking-wider">Partenariats & Recrutement</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-brand-primary">
              Vous cherchez un profil spécifique pour votre entreprise ?
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted">
              Laissez-nous votre besoin (stage, CDD, CDI ou mission freelance à Douala, Yaoundé ou à distance). Notre équipe pédagogique vous transmettra une sélection de candidats qualifiés.
            </p>

            {contactSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Merci ! Votre demande a été enregistrée. Notre responsable des partenariats vous contactera sous 24h ouvrées.</span>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Votre Nom & Prénom</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Paul Moukoko"
                      className="w-full min-h-[44px] px-3.5 rounded-xl bg-slate-50 border border-brand-border text-xs focus:bg-white focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Entreprise / Organisation</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Cameroun Logistique SA"
                      className="w-full min-h-[44px] px-3.5 rounded-xl bg-slate-50 border border-brand-border text-xs focus:bg-white focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email professionnel</label>
                    <input
                      type="email"
                      required
                      placeholder="rh@entreprise.cm"
                      className="w-full min-h-[44px] px-3.5 rounded-xl bg-slate-50 border border-brand-border text-xs focus:bg-white focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Numéro WhatsApp / Téléphone</label>
                    <input
                      type="tel"
                      required
                      placeholder="+237 6XX XX XX XX"
                      className="w-full min-h-[44px] px-3.5 rounded-xl bg-slate-50 border border-brand-border text-xs focus:bg-white focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Compétences recherchées & détails du poste</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Ex: Recherche d'un Data Analyst pour automatiser nos reportings de vente Excel et Power BI en FCFA à Douala..."
                    className="w-full p-3 rounded-xl bg-slate-50 border border-brand-border text-xs focus:bg-white focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="min-h-[44px] px-6 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition active:scale-95"
                >
                  <Mail className="w-4 h-4 text-brand-teal" />
                  <span>Envoyer ma demande de recrutement</span>
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
