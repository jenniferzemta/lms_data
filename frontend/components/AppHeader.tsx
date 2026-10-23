'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { LanguageSwitcher } from './LanguageSwitcher';
import { User, Search, Bell } from 'lucide-react';
import { useAuth } from '@/features/auth';

export const AppHeader: React.FC = () => {
  const tCommon = useTranslations('Common');
  const tNav = useTranslations('Navigation');
  const tCatalog = useTranslations('Catalog');
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-brand-border shadow-2xs transition-all lg:pl-64 xl:pl-72">
      <div className="w-full h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left Slot: Mobile Logo (visible < lg) OR Desktop Search Bar (visible >= lg) */}
        <div className="flex items-center gap-3">
          {/* Mobile Logo Brand */}
          <Link
            href="/"
            className="flex lg:hidden items-center gap-2.5 min-h-[44px] focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white font-black text-xs shadow-xs">
              DM
            </div>
            <span className="font-extrabold text-base text-brand-primary tracking-tight">
              DataMboa
            </span>
          </Link>

          {/* Desktop Global Search (Douala Student Portal Style) */}
          <div className="hidden lg:flex items-center relative w-72 xl:w-96">
            <Search className="w-4 h-4 text-brand-muted absolute left-3.5 pointer-events-none" />
            <input
              type="search"
              placeholder={tCatalog('searchPlaceholder')}
              aria-label="Recherche rapide"
              className="w-full h-10 pl-10 pr-12 rounded-xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs text-brand-text placeholder:text-brand-muted border border-brand-border/70 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none"
            />
            <kbd className="absolute right-3 hidden xl:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-brand-muted bg-white border border-brand-border shadow-2xs">
              Ctrl K
            </kbd>
          </div>
        </div>

        {/* Right Slot: Network Status + Language + Notifications + User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Synchronized Network Badge */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/50 text-teal-900 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
            <span className="text-[11px] font-bold tracking-wide">
              {tCommon('online')}
            </span>
          </div>

          {/* Language Switcher Button */}
          <LanguageSwitcher />

          {/* Desktop Notification Bell Icon */}
          <button
            type="button"
            aria-label="Notifications"
            className="hidden sm:flex min-w-[40px] min-h-[40px] rounded-xl items-center justify-center text-brand-muted hover:text-brand-primary hover:bg-slate-100 transition-colors border border-brand-border/60 relative"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-brand-amber absolute top-2 right-2 ring-2 ring-white" />
          </button>

          {/* User Profile / Auth Link */}
          {user ? (
            <Link
              href="/profile"
              aria-label={tNav('profile')}
              className="flex items-center gap-2.5 min-h-[44px] p-1 sm:px-2 rounded-xl hover:bg-slate-50 transition-colors border border-transparent sm:border-brand-border/60"
            >
              <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                {user.first_name ? user.first_name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-brand-primary leading-tight truncate max-w-[120px]">
                  {user.first_name || user.email.split('@')[0]}
                </span>
                <span className="text-[10px] text-brand-muted">
                  {user.is_learner ? 'Apprenant' : user.role}
                </span>
              </div>
            </Link>
          ) : (
            <Link
              href="/login"
              className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-brand-primary text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs hover:bg-brand-primary-dark transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>{tNav('login')}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
