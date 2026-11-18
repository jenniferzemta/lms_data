'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { 
  Home, 
  Compass, 
  Award, 
  CreditCard, 
  MessageSquare, 
  User, 
  LogOut,
  ExternalLink,
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
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '@/features/auth';

export const DesktopSidebar: React.FC = () => {
  const tNav = useTranslations('Navigation');
  const tCommon = useTranslations('Common');
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.is_admin_role || user?.is_staff;

  const sections = [
    {
      title: 'Cursus & Orientation',
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
          label: 'Test de positionnement',
          href: '/placement-test',
          icon: Target,
          isActive: pathname.startsWith('/placement-test')
        },
      ]
    },
    {
      title: 'Laboratoires Interactifs',
      links: [
        {
          key: 'labs-excel',
          label: 'Labo Excel (Formules)',
          href: '/labs/excel',
          icon: Table,
          isActive: pathname.startsWith('/labs/excel')
        },
        {
          key: 'labs-sql',
          label: 'Labo SQL (Relationnel)',
          href: '/labs/sql',
          icon: Terminal,
          isActive: pathname.startsWith('/labs/sql')
        },
        {
          key: 'labs-python',
          label: 'Labo Python & Pandas',
          href: '/labs/python',
          icon: FileCode,
          isActive: pathname.startsWith('/labs/python')
        },
        {
          key: 'labs-powerbi',
          label: 'Labo Power BI & DAX',
          href: '/labs/powerbi',
          icon: BarChart3,
          isActive: pathname.startsWith('/labs/powerbi')
        },
        {
          key: 'labs-git',
          label: 'Labo Git & GitHub',
          href: '/labs/git',
          icon: GitBranch,
          isActive: pathname.startsWith('/labs/git')
        },
      ]
    },
    {
      title: 'Pratique Réelle & Outils',
      links: [
        {
          key: 'missions',
          label: 'Missions d\'Entreprise',
          href: '/missions',
          icon: Briefcase,
          isActive: pathname.startsWith('/missions')
        },
        {
          key: 'audit',
          label: 'Audit Intelligent (Code/Formules)',
          href: '/audit',
          icon: FileCheck2,
          isActive: pathname.startsWith('/audit')
        },
        {
          key: 'srs',
          label: 'Révision Flashcard (SRS)',
          href: '/srs',
          icon: Brain,
          isActive: pathname.startsWith('/srs')
        },
      ]
    },
    {
      title: 'Carrière & Succès',
      links: [
        {
          key: 'dashboard',
          label: 'Progrès & Certificats',
          href: '/dashboard',
          icon: Award,
          isActive: pathname.startsWith('/dashboard')
        },
        {
          key: 'badges',
          label: 'Badges de Compétences',
          href: '/badges',
          icon: Sparkles,
          isActive: pathname.startsWith('/badges')
        },
        {
          key: 'portfolio',
          label: 'Mon Portfolio Public',
          href: '/portfolio/my',
          icon: FolderKanban,
          isActive: pathname.startsWith('/portfolio')
        },
      ]
    },
    {
      title: 'Espaces Professionnels',
      links: [
        {
          key: 'recruiter',
          label: 'Espace Recruteur',
          href: '/recruiter',
          icon: Users,
          isActive: pathname.startsWith('/recruiter')
        },
        {
          key: 'enterprise',
          label: 'Espace Entreprise B2B',
          href: '/enterprise',
          icon: Building2,
          isActive: pathname.startsWith('/enterprise')
        },
        {
          key: 'instructor',
          label: 'Espace Formateur',
          href: '/instructor',
          icon: GraduationCap,
          isActive: pathname.startsWith('/instructor')
        },
        ...(isAdmin
          ? [
              {
                key: 'admin-portal',
                label: 'Portail Administration',
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
    <aside className="hidden lg:flex flex-col justify-between w-64 xl:w-72 fixed inset-y-0 left-0 bg-white border-r border-brand-border z-40 select-none shadow-xs">
      
      {/* 1. Header de Marque (Fixe en haut) */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-brand-border/60 shrink-0">
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

      {/* 2. Statut Espace de Travail */}
      <div className="px-6 py-2 bg-brand-canvas border-b border-brand-border/40 flex items-center justify-between shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">
          Espace Apprenant
        </span>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200/50 text-teal-800 text-[10px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
          <span>Actif</span>
        </div>
      </div>

      {/* 3. Navigation Verticale Défilable (Indépendante et fluide) */}
      <nav className="flex-1 overflow-y-auto px-4 py-3 space-y-4 overscroll-contain" aria-label="Menu principal">
        {sections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-brand-muted/80 block">
              {sec.title}
            </span>
            {sec.links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all min-h-[40px] ${
                    link.isActive
                      ? 'bg-brand-primary-light text-brand-primary font-bold shadow-2xs border-l-4 border-brand-teal pl-2'
                      : 'text-brand-muted hover:text-brand-primary hover:bg-slate-50'
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

        {/* Espace Formateur / Admin */}
        {(user?.role === 'ADMIN' || user?.is_staff || user?.role === 'INSTRUCTOR') && (
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <span className="px-3 text-[10px] uppercase font-bold text-amber-800 tracking-wider block">
              Espace Formateur
            </span>
            <Link
              href="/instructor"
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[40px] ${
                pathname.startsWith('/instructor')
                  ? 'bg-amber-100 text-amber-950 border border-amber-300 shadow-xs'
                  : 'bg-amber-50/80 text-amber-900 border border-amber-200/80 hover:bg-amber-100/90'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="truncate">Checklist Qualité Cours</span>
            </Link>
            <a
              href="http://localhost:8000/admin/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[40px] bg-slate-50 text-slate-800 border border-slate-200 hover:bg-slate-100 shadow-2xs"
            >
              <ExternalLink className="w-4 h-4 text-slate-600 shrink-0" />
              <span className="truncate">Admin Django</span>
            </a>
          </div>
        )}
      </nav>

      {/* 4. Pied de Page : Assistance WhatsApp (Fixe en bas) */}
      <div className="p-3.5 border-t border-brand-border/60 shrink-0 bg-white space-y-2.5">
        {/* Support Direct */}
        <a
          href="https://wa.me/237657546259"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full min-h-[36px] py-1 px-3 rounded-lg bg-teal-50 hover:bg-teal-100 border border-teal-200/60 text-teal-900 font-semibold flex items-center justify-center gap-1.5 transition-colors text-[11px]"
        >
          <MessageSquare className="w-3.5 h-3.5 text-brand-teal" />
          <span>Assistance WhatsApp (657 54 62 59)</span>
          <ExternalLink className="w-3 h-3 text-teal-700" />
        </a>

        {/* User Profile Mini Bar */}
        {user ? (
          <div className="flex items-center justify-between p-1.5 rounded-xl bg-slate-50 border border-brand-border/40">
            <Link href="/profile" className="flex items-center gap-2 min-w-0 hover:opacity-80 transition-opacity">
              <div className="w-7 h-7 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
                {user.first_name ? user.first_name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-xs text-brand-primary truncate max-w-[120px]">
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
              className="p-1 rounded-lg text-brand-muted hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1.5">
            <Link
              href="/login"
              className="min-h-[36px] px-2.5 py-1 rounded-xl bg-brand-primary text-white text-xs font-semibold flex items-center justify-center gap-1 hover:bg-brand-primary-dark transition shadow-2xs"
            >
              <LogIn className="w-3 h-3" />
              <span>Connexion</span>
            </Link>
            <Link
              href="/register"
              className="min-h-[36px] px-2.5 py-1 rounded-xl bg-brand-canvas text-brand-primary border border-brand-border text-xs font-semibold flex items-center justify-center hover:bg-slate-100 transition"
            >
              <span>S'inscrire</span>
            </Link>
          </div>
        )}
      </div>

    </aside>
  );
};
