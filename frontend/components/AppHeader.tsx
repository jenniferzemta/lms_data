'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { LanguageSwitcher } from './LanguageSwitcher';
import { User } from 'lucide-react';

export const AppHeader: React.FC = () => {
  const tCommon = useTranslations('Common');
  const tNav = useTranslations('Navigation');
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isCourses = pathname.startsWith('/courses');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white/95 backdrop-blur-md border-b border-brand-border shadow-xs">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 min-h-[44px] focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white font-bold text-sm shadow-xs">
            DM
          </div>
          <span className="font-bold text-lg text-brand-primary tracking-tight">
            DataMboa
          </span>
        </Link>

        {/* Desktop Navigation Links (hidden on mobile, visible from md:) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
          <Link
            href="/"
            className={`transition-colors py-2 border-b-2 ${
              isHome
                ? 'text-brand-primary border-brand-teal'
                : 'text-brand-muted hover:text-brand-primary border-transparent'
            }`}
          >
            {tNav('home')}
          </Link>
          <Link
            href="/courses"
            className={`transition-colors py-2 border-b-2 ${
              isCourses
                ? 'text-brand-primary border-brand-teal'
                : 'text-brand-muted hover:text-brand-primary border-transparent'
            }`}
          >
            {tNav('courses')}
          </Link>
          <Link
            href="/courses"
            className="text-brand-muted hover:text-brand-primary transition-colors py-2 border-b-2 border-transparent"
          >
            {tNav('pricing')}
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200/50 text-teal-900">
            <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
            <span className="text-[11px] font-semibold tracking-wide">
              {tCommon('online')}
            </span>
          </div>

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* User Profile Avatar Link */}
          <Link
            href="/profile"
            aria-label={tNav('profile')}
            className="w-9 h-9 min-h-[44px] min-w-[44px] rounded-full bg-brand-primary-light border border-brand-primary/10 flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-colors"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
};
