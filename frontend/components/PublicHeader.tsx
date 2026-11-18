'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { LanguageSwitcher } from './LanguageSwitcher';
import {
  Menu,
  X,
  LogIn,
  Sparkles,
  BookOpen,
  Users,
  Building2,
  GraduationCap,
  ShieldAlert,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

export const PublicHeader: React.FC = () => {
  const t = useTranslations('PublicNav');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: t('courses'), href: '/courses', icon: BookOpen },
    { label: t('recruiter'), href: '/recruiter', icon: Users },
    { label: t('enterprise'), href: '/enterprise', icon: Building2 },
    { label: t('instructor'), href: '/instructor', icon: GraduationCap },
    { label: t('admin'), href: '/admin-portal', icon: ShieldAlert },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white/95 backdrop-blur-md border-b border-brand-border shadow-2xs">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 min-h-[44px] focus:outline-none group"
            >
              <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center text-white font-black text-sm shadow-xs group-hover:bg-brand-primary-dark transition-colors">
                DM
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base sm:text-lg text-brand-primary tracking-tight leading-tight">
                  DataMboa
                </span>
                <span className="text-[10px] text-brand-muted font-medium">
                  {t('regionalBadge')}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Navigation principale">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-brand-primary hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
                >
                  <Icon className="w-3.5 h-3.5 text-brand-teal" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Slot: Language Switcher + Auth Buttons (Desktop) + Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />

            {/* Desktop Auth CTAs */}
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="min-h-[44px] px-4 py-2 rounded-xl border border-brand-border text-xs font-bold text-brand-primary hover:bg-slate-50 transition-all flex items-center gap-1.5 active:scale-95 shadow-2xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('login')}</span>
              </Link>
              <Link
                href="/register"
                className="min-h-[44px] px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-teal" />
                <span>{t('register')}</span>
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? t('closeMenu') : t('openMenu')}
              className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-brand-primary hover:bg-slate-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Backdrop & Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex flex-col bg-slate-900/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="w-full bg-white border-b border-brand-border p-5 space-y-4 shadow-xl pt-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-brand-muted px-3 py-1">
                DataMboa
              </div>
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="min-h-[44px] px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-brand-teal" />
                      </div>
                      <span>{item.label}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </Link>
                );
              })}
            </div>

            {/* Direct WhatsApp Support */}
            <div className="pt-2">
              <a
                href="https://wa.me/237657546259?text=Bonjour%20DataMboa,%20j'ai%20une%20question%20concernant%20les%20formations"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] w-full rounded-xl bg-teal-50 border border-teal-200/80 text-teal-900 text-xs font-bold flex items-center justify-center gap-2 py-2.5 hover:bg-teal-100 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-brand-teal" />
                <span>WhatsApp : 657 54 62 59</span>
              </a>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="min-h-[44px] w-full rounded-xl border border-brand-border text-xs font-bold text-brand-primary flex items-center justify-center gap-2 py-2.5"
              >
                <LogIn className="w-4 h-4" />
                <span>{t('login')}</span>
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="min-h-[44px] w-full rounded-xl bg-brand-primary text-white text-xs font-bold flex items-center justify-center gap-2 py-2.5 shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-brand-teal" />
                <span>{t('createAccount')}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
