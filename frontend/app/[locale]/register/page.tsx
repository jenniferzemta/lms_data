import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { RegisterForm } from '@/features/auth';
import { ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const tNav = useTranslations('Navigation');
  const tCommon = useTranslations('Common');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-brand-text">
      {/* Minimal Auth Header: Back link + Brand Logo + Language Switcher */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 min-h-[44px] text-xs font-semibold text-brand-muted hover:text-brand-primary transition-colors focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{tNav('home')}</span>
        </Link>

        {/* Center Brand */}
        <Link href="/" className="flex items-center gap-2.5 min-h-[44px] focus:outline-none">
          <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center text-white font-black text-xs shadow-xs">
            DM
          </div>
          <span className="font-extrabold text-lg text-brand-primary tracking-tight font-heading">
            {tCommon('appName')}
          </span>
        </Link>

        {/* Language Switcher */}
        <div className="flex items-center">
          <LanguageSwitcher />
        </div>
      </header>

      {/* Centered Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
        <RegisterForm />
      </main>

      {/* Minimal Footer */}
      <footer className="w-full py-4 text-center text-[11px] text-brand-muted">
        <p>{tCommon('footerCopyright', { year: new Date().getFullYear() })}</p>
      </footer>
    </div>
  );
}
