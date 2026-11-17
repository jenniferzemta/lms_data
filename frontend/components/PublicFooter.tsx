'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { Table, Database, BarChart3, Code2, GitBranch, ShieldCheck } from 'lucide-react';

export const PublicFooter: React.FC = () => {
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
              Première plateforme d&apos;apprentissage de l&apos;analyse de données conçue pour l&apos;Afrique centrale. Pratique immédiate sur Excel, SQL, Power BI, Python et Git avec des données réelles chiffrées en FCFA.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-brand-teal font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Conforme pédagogiquement · Certificats infalsifiables</span>
            </div>
          </div>

          {/* Outils & Laboratoires */}
          <div className="space-y-2.5">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Outils & Formations
            </div>
            <ul className="space-y-1.5">
              <li>
                <Link href="/courses/excel-bases-analyse" className="hover:text-brand-primary transition">
                  Excel Professionnel (FCFA)
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
              Espaces Métiers
            </div>
            <ul className="space-y-1.5">
              <li>
                <Link href="/recruiter" className="hover:text-brand-primary transition">
                  Espace Recruteurs & Talents
                </Link>
              </li>
              <li>
                <Link href="/enterprise" className="hover:text-brand-primary transition">
                  Espace Entreprises (B2B)
                </Link>
              </li>
              <li>
                <Link href="/instructor" className="hover:text-brand-primary transition">
                  Espace Formateurs & Auteurs
                </Link>
              </li>
              <li>
                <Link href="/admin-portal" className="hover:text-brand-primary transition">
                  Portail Administration
                </Link>
              </li>
              <li>
                <Link href="/verify/DM-EXC-2026-DEMO" className="hover:text-brand-primary transition">
                  Vérification de Certificat
                </Link>
              </li>
            </ul>
          </div>

          {/* Mentions & Territoire */}
          <div className="space-y-2.5">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Territoire & Légal
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Douala · Yaoundé · Bafoussam · Garoua
            </p>
            <p className="text-slate-600 text-[11px]">
              Devise officielle : <strong>FCFA (XAF)</strong>
            </p>
            <ul className="space-y-1.5 pt-1 text-[11px]">
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
            © {new Date().getFullYear()} DataMboa. Tous droits réservés. L&apos;analyse de données par la pratique, chez nous.
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Plateforme active · 100% hébergée
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
