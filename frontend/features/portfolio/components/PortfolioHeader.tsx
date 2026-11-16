'use client';

import React, { useState } from 'react';
import { LearnerPortfolioData } from '../types';
import {
  MapPin,
  Share2,
  Check,
  Award,
  Briefcase,
  ShieldCheck,
  MessageCircle,
  Globe,
  Code2,
} from 'lucide-react';

interface PortfolioHeaderProps {
  portfolio: LearnerPortfolioData;
}

export const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({ portfolio }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareText = encodeURIComponent(
    `Découvrez les projets d'analyse de données certifiés de ${portfolio.user.name} sur DataMboa :\n`
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Profile Info */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-700 text-white font-extrabold text-2xl sm:text-3xl flex items-center justify-center shadow-md relative">
            {portfolio.user.name.slice(0, 2).toUpperCase()}
            <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center text-white text-[10px]" title="Profil vérifié">
              ✓
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {portfolio.user.name}
              </h1>
              <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Certifié DataMboa
              </span>
            </div>

            <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">
              {portfolio.headline}
            </p>

            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {portfolio.city}, {portfolio.country}
              </span>
            </div>
          </div>
        </div>

        {/* Share & Social CTAs */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {portfolio.linkedin_url && (
            <a
              href={portfolio.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Profil LinkedIn"
            >
              <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
            </a>
          )}

          {portfolio.github_url && (
            <a
              href={portfolio.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Profil GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>
          )}

          <a
            href={`https://wa.me/?text=${shareText}${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors min-h-[44px]"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>

          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors min-h-[44px]"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Lien copié' : 'Partager'}</span>
          </button>
        </div>
      </div>

      {/* Bio paragraph */}
      {portfolio.bio && (
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
          {portfolio.bio}
        </p>
      )}

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-3 gap-3 pt-2">
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 text-xs mb-0.5">
            <Briefcase className="w-3.5 h-3.5 text-brand-600" />
            <span>Cas résolus</span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {portfolio.stats.projects_count}
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 text-xs mb-0.5">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Badges acquis</span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {portfolio.stats.badges_count}
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 text-xs mb-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Diplômes</span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {portfolio.stats.certificates_count}
          </span>
        </div>
      </div>
    </div>
  );
};
