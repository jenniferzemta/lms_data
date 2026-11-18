'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { 
  Home, 
  Compass, 
  Award, 
  MessageSquare, 
  User, 
  LogOut,
  LogIn,
  ShieldCheck,
  Terminal,
  FileCode,
  Table,
  Briefcase,
  Brain,
  FolderKanban,
  BarChart3,
  GitBranch,
  Target,
  FileCheck2,
  Sparkles,
  Users,
  Building2,
  GraduationCap,
  ShieldAlert,
  X
} from 'lucide-react';
import { useAuth } from '@/features/auth';

export interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ isOpen, onClose }) => {
  const tNav = useTranslations('Navigation');
  const locale = useLocale();
  const isEn = locale === 'en';
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.is_admin_role || user?.is_staff;

  if (!isOpen) return null;

  const sections = [
    {
      title: isEn ? 'Curriculum & Guidance' : 'Cursus & Orientation',
      links: [
        {
          key: 'home',
          label: tNav('home'),
          href: '/',
          icon: Home,
          isActive: pathname === '/'
        },
        {
          key: 'courses',
          label: tNav('courses'),
          href: '/courses',
          icon: Compass,
          isActive: pathname.startsWith('/courses')
        },
        {
          key: 'placement-test',
          label: isEn ? 'Placement Test' : 'Test de positionnement',
          href: '/placement-test',
          icon: Target,
          isActive: pathname.startsWith('/placement-test')
        },
      ]
    },
    {
      title: isEn ? 'Interactive Laboratories' : 'Laboratoires Interactifs',
      links: [
        {
          key: 'labs-excel',
          label: isEn ? 'Excel Lab (Formulas)' : 'Labo Excel (Formules)',
          href: '/labs/excel',
          icon: Table,
          isActive: pathname.startsWith('/labs/excel')
        },
        {
          key: 'labs-sql',
          label: isEn ? 'SQL Lab (Relational)' : 'Labo SQL (Relationnel)',
          href: '/labs/sql',
          icon: Terminal,
          isActive: pathname.startsWith('/labs/sql')
        },
        {
          key: 'labs-python',
          label: isEn ? 'Python & Pandas Lab' : 'Labo Python & Pandas',
          href: '/labs/python',
          icon: FileCode,
          isActive: pathname.startsWith('/labs/python')
        },
        {
          key: 'labs-powerbi',
          label: isEn ? 'Power BI & DAX Lab' : 'Labo Power BI & DAX',
          href: '/labs/powerbi',
          icon: BarChart3,
          isActive: pathname.startsWith('/labs/powerbi')
        },
        {
          key: 'labs-git',
          label: isEn ? 'Git & GitHub Lab' : 'Labo Git & GitHub',
          href: '/labs/git',
          icon: GitBranch,
          isActive: pathname.startsWith('/labs/git')
        },
      ]
    },
    {
      title: isEn ? 'Hands-on Practice & Tools' : 'Pratique Réelle & Outils',
      links: [
        {
          key: 'missions',
          label: isEn ? 'Business Case Missions' : 'Missions d\'Entreprise',
          href: '/missions',
          icon: Briefcase,
          isActive: pathname.startsWith('/missions')
        },
        {
          key: 'audit',
          label: isEn ? 'Code & Formula Audit' : 'Audit de Code & Formules',
          href: '/audit',
          icon: FileCheck2,
          isActive: pathname.startsWith('/audit')
        },
        {
          key: 'srs',
          label: isEn ? 'Flashcard Review (SRS)' : 'Révision Flashcard (SRS)',
          href: '/srs',
          icon: Brain,
          isActive: pathname.startsWith('/srs')
        },
      ]
    },
    {
      title: isEn ? 'Career & Credentials' : 'Carrière & Succès',
      links: [
        {
          key: 'dashboard',
          label: isEn ? 'Progress & Certificates' : 'Progrès & Certificats',
          href: '/dashboard',
          icon: Award,
          isActive: pathname.startsWith('/dashboard')
        },
        {
          key: 'badges',
          label: isEn ? 'Skill Badges' : 'Badges de Compétences',
          href: '/badges',
          icon: Sparkles,
          isActive: pathname.startsWith('/badges')
        },
        {
          key: 'portfolio',
          label: isEn ? 'My Public Portfolio' : 'Mon Portfolio Public',
          href: '/portfolio/my',
          icon: FolderKanban,
          isActive: pathname.startsWith('/portfolio')
        },
      ]
    },
    {
      title: isEn ? 'Professional Spaces' : 'Espaces Professionnels',
      links: [
        {
          key: 'recruiter',
          label: isEn ? 'Recruiter Space' : 'Espace Recruteur',
          href: '/recruiter',
          icon: Users,
          isActive: pathname.startsWith('/recruiter')
        },
        {
          key: 'enterprise',
          label: isEn ? 'Enterprise B2B Space' : 'Espace Entreprise B2B',
          href: '/enterprise',
          icon: Building2,
          isActive: pathname.startsWith('/enterprise')
        },
        {
          key: 'instructor',
          label: isEn ? 'Instructor Space' : 'Espace Formateur',
          href: '/instructor',
          icon: GraduationCap,
          isActive: pathname.startsWith('/instructor')
        },
        ...(isAdmin
          ? [
              {
                key: 'admin-portal',
                label: isEn ? 'Administration Portal' : 'Portail Administration',
                href: '/admin-portal',
                icon: ShieldAlert,
                isActive: pathname.startsWith('/admin-portal')
              }
            ]
          : [])
      ]
    }
  ];

  return (
    <div className="lg:hidden fixed inset-0 z-50 flex">
      {/* Backdrop overlay with blur */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer content sliding from left */}
      <div className="relative w-4/5 max-w-xs h-full bg-white flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-left duration-250 select-none">
        
        {/* Top Header of Drawer */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-brand-border/70 shrink-0 bg-slate-50/60">
          <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-primary flex items-center justify-center text-white font-black text-xs shadow-xs">
              DM
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base text-brand-primary tracking-tight leading-tight">
                DataMboa
              </span>
              <span className="text-[10px] text-brand-muted font-medium">
                {isEn ? 'Full Navigation' : 'Navigation complète'}
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label={isEn ? 'Close menu' : 'Fermer le menu'}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-brand-muted hover:text-brand-primary hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 overscroll-contain">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-brand-muted/90 block">
                {sec.title}
              </span>
              {sec.links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.key}
                    href={link.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all min-h-[44px] ${
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
                    <span className="truncate">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}

          {/* Admin / Formateur Link */}
          {(user?.role === 'ADMIN' || user?.is_staff || user?.role === 'INSTRUCTOR') && (
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                {isEn ? 'Instructor Space' : 'Espace Formateur'}
              </span>
              <Link
                href="/instructor"
                onClick={onClose}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold min-h-[44px] bg-amber-50 text-amber-900 border border-amber-200"
              >
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{isEn ? 'Course Quality Checklist' : 'Checklist Qualité Cours'}</span>
              </Link>
            </div>
          )}
        </div>

        {/* Footer Area: WhatsApp + Profile */}
        <div className="p-3.5 border-t border-brand-border/70 shrink-0 bg-slate-50/70 space-y-2.5">
          <a
            href="https://wa.me/237657546259"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-900 font-semibold flex items-center justify-center gap-2 transition text-xs active:scale-98"
          >
            <MessageSquare className="w-4 h-4 text-brand-teal" />
            <span>{isEn ? 'WhatsApp Support (657 54 62 59)' : 'Assistance WhatsApp (657 54 62 59)'}</span>
          </a>

          {user ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-brand-border/60">
              <Link href="/profile" onClick={onClose} className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {user.first_name ? user.first_name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-xs text-brand-primary truncate max-w-[120px]">
                    {user.first_name || user.email.split('@')[0]}
                  </span>
                  <span className="text-[10px] text-brand-muted truncate">
                    {user.is_learner ? (isEn ? 'Learner' : 'Apprenant') : user.role}
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  logout();
                }}
                aria-label={isEn ? 'Sign Out' : 'Déconnexion'}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-brand-muted hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={onClose}
                className="min-h-[44px] px-3 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-brand-primary-dark transition shadow-2xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{isEn ? 'Sign In' : 'Connexion'}</span>
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="min-h-[44px] px-3 py-2 rounded-xl bg-white text-brand-primary border border-brand-border text-xs font-semibold flex items-center justify-center hover:bg-slate-50 transition shadow-2xs"
              >
                <span>{isEn ? 'Sign Up' : 'Inscription'}</span>
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
