'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Table, Database, BarChart3, Code2, GitBranch, ShieldCheck, MessageSquare } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  const tNav = useTranslations('PublicNav');
  const tLanding = useTranslations('Landing');

  return (
    <footer className="bg-white border-t border-brand-border py-12 text-xs text-brand-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">

          {/* Brand Presentation */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white font-black text-xs shadow-xs">
                DM
              </div>
              <span className="font-extrabold text-base text-brand-primary tracking-tight">
                DataMboa
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed pr-4 text-xs">
              {tLanding('heroSubtitle')}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-brand-teal font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>{tLanding('pillar4Tag')}</span>
            </div>
          </div>

          {/* Outils & Laboratoires */}
          <div className="space-y-2.5">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              {tNav('courses')}
            </div>
            <ul className="space-y-1.5">
              <li>
                <Link href="/courses/excel-bases-analyse" className="hover:text-brand-primary transition">
                  Excel Professionnel
                </Link>
              </li>
              <li>
                <Link href="/courses/sql-debutant-requetes-filtres" className="hover:text-brand-primary transition">
                  SQL & Analytics Microfinance
                </Link>
              </li>
              <li>
                <Link href="/courses/powerbi-debutant-modelisation-etoile" className="hover:text-brand-primary transition">
                  Power BI & Tableaux de Bord
                </Link>
              </li>
              <li>
                <Link href="/courses/python-debutant-pandas-exploration" className="hover:text-brand-primary transition">
                  Python & Manipulation Pandas
                </Link>
              </li>
              <li>
                <Link href="/courses/git-debutant-versioning-local" className="hover:text-brand-primary transition">
                  Git & GitHub pour Analystes
                </Link>
              </li>
            </ul>
          </div>

          {/* Espaces Professionnels */}
          <div className="space-y-2.5">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Espaces & Portails
            </div>
            <ul className="space-y-1.5">
              <li>
                <Link href="/recruiter" className="hover:text-brand-primary transition">
                  {tNav('recruiter')}
                </Link>
              </li>
              <li>
                <Link href="/enterprise" className="hover:text-brand-primary transition">
                  {tNav('enterprise')}
                </Link>
              </li>
              <li>
                <Link href="/instructor" className="hover:text-brand-primary transition">
                  {tNav('instructor')}
                </Link>
              </li>
              <li>
                <Link href="/placement" className="hover:text-brand-primary transition">
                  {tNav('placement')}
                </Link>
              </li>
              <li>
                <Link href="/verify/DM-EXC-2026-DEMO" className="hover:text-brand-primary transition">
                  Vérification de Certificat
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Assistance WhatsApp */}
          <div className="space-y-2.5">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Assistance & Contact
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Une question avant de vous lancer ? Échangez directement avec un conseiller.
            </p>
            <a
              href="https://wa.me/237657546259?text=Bonjour%20DataMboa,%20j'ai%20une%20question%20concernant%20les%20formations"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 font-bold text-xs hover:bg-teal-100 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-brand-teal" />
              <span>WhatsApp : 657 54 62 59</span>
            </a>
            <ul className="space-y-1.5 pt-2 text-[11px]">
              <li>
                <span className="hover:text-brand-primary cursor-pointer">Conditions Générales (CGU)</span>
              </li>
              <li>
                <span className="hover:text-brand-primary cursor-pointer">Protection des Données</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} DataMboa. Plateforme d&apos;apprentissage pratique.
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Plateforme active · 100% in-browser
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
