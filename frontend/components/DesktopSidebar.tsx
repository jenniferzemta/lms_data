'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { 
  Home, 
  Compass, 
  BookOpen, 
  Award, 
  CreditCard, 
  MessageSquare, 
  User, 
  LogOut,
  Sparkles,
  ExternalLink,
  LogIn
} from 'lucide-react';
import { useAuth } from '@/features/auth';

export const DesktopSidebar: React.FC = () => {
  const tNav = useTranslations('Navigation');
  const tCommon = useTranslations('Common');
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isHome = pathname === '/';
  const isCourses = pathname.startsWith('/courses');

  const navLinks = [
    {
      key: 'home',
      label: tNav('home'),
      href: '/',
      icon: Home,
      isActive: isHome
    },
    {
      key: 'courses',
      label: tNav('courses'),
      href: '/courses',
      icon: Compass,
      isActive: isCourses
    },
    {
      key: 'my-courses',
      label: tNav('practice'),
      href: '/courses',
      icon: BookOpen,
      isActive: false
    },
    {
      key: 'progress',
      label: 'Progrès & Certificats',
      href: '/courses',
      icon: Award,
      isActive: false
    },
    {
      key: 'pricing',
      label: tNav('pricing'),
      href: '/courses',
      icon: CreditCard,
      isActive: false
    }
  ];

  return (
    <aside className="hidden lg:flex flex-col justify-between w-64 xl:w-72 fixed inset-y-0 left-0 bg-white border-r border-brand-border z-40 select-none shadow-xs overflow-y-auto">
      {/* Top Branding Section */}
      <div className="flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-brand-border/60">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center text-white font-black text-sm shadow-xs">
              DM
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-brand-primary tracking-tight leading-tight">
                DataMboa
              </span>
              <span className="text-[11px] text-brand-muted font-medium">
                Plateforme e-learning
              </span>
            </div>
          </Link>
        </div>

        {/* Institution Badge / Local Anchor */}
        <div className="px-6 py-3.5 bg-brand-canvas border-b border-brand-border/40 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">
            Cameroun · FCFA
          </span>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200/50 text-teal-800 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
            <span>{tCommon('online')}</span>
          </div>
        </div>

        {/* Vertical Navigation Links */}
        <nav className="p-4 space-y-1" aria-label="Menu principal">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.key}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all min-h-[44px] ${
                  link.isActive
                    ? 'bg-brand-primary-light text-brand-primary font-bold shadow-2xs border-l-4 border-brand-teal pl-2.5'
                    : 'text-brand-muted hover:text-brand-primary hover:bg-slate-50 font-medium'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    link.isActive ? 'text-brand-teal' : 'text-brand-muted'
                  }`}
                />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Help Card & User Profile Footer */}
      <div className="p-4 space-y-3 border-t border-brand-border/60 shrink-0 mt-auto bg-white">
        {/* Support Card */}
        <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/60 text-xs">
          <div className="flex items-center gap-2 mb-1.5 text-teal-900 font-bold">
            <MessageSquare className="w-4 h-4 text-brand-teal" />
            <span>Assistance WhatsApp</span>
          </div>
          <p className="text-[11px] text-teal-800 leading-snug mb-2.5">
            Validation manuelle sous 2h et entraide sur les cas pratiques.
          </p>
          <a
            href="https://wa.me/237690000000"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[36px] py-1.5 px-3 rounded-lg bg-brand-teal hover:bg-brand-teal-dark text-white font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs text-[11px]"
          >
            <span>Ouvrir WhatsApp</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* User Profile Mini Bar / Auth Links */}
        {user ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-brand-border/40">
            <Link href="/profile" className="flex items-center gap-2.5 min-w-0 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
                {user.first_name ? user.first_name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-xs text-brand-primary truncate">
                  {user.first_name || user.email.split('@')[0]}
                </span>
                <span className="text-[10px] text-brand-muted truncate">
                  {user.is_learner ? 'Apprenant' : user.role}
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => logout()}
              aria-label="Déconnexion"
              title="Déconnexion"
              className="p-1.5 rounded-lg text-brand-muted hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full min-h-[38px] px-3 py-1.5 rounded-xl bg-brand-primary text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-brand-primary-dark transition-colors shadow-2xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{tNav('login')}</span>
            </Link>
            <Link
              href="/register"
              className="w-full min-h-[36px] px-3 py-1 rounded-xl bg-brand-canvas text-brand-primary border border-brand-border text-xs font-semibold flex items-center justify-center hover:bg-slate-100 transition-colors"
            >
              <span>{tNav('register')}</span>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};
