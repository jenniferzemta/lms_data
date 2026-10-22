'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Home, Compass, BookOpen, TrendingUp, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const tNav = useTranslations('Navigation');
  const pathname = usePathname();

  const navItems = [
    {
      key: 'home',
      label: tNav('home'),
      href: '/',
      icon: Home,
      isActive: pathname === '/'
    },
    {
      key: 'explore',
      label: tNav('courses'),
      href: '/courses',
      icon: Compass,
      isActive: pathname.startsWith('/courses')
    },
    {
      key: 'practice',
      label: tNav('practice'),
      href: '/courses',
      icon: BookOpen,
      isActive: false
    },
    {
      key: 'progress',
      label: 'Progrès',
      href: '/courses',
      icon: TrendingUp,
      isActive: false
    },
    {
      key: 'profile',
      label: tNav('profile'),
      href: '/profile',
      icon: User,
      isActive: pathname.startsWith('/profile')
    }
  ];

  return (
    <nav
      aria-label="Navigation principale mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-white/95 backdrop-blur-xl border-t border-brand-border shadow-[0_-2px_10px_rgba(20,43,74,0.06)] pb-safe"
    >
      <div className="flex items-center justify-around h-full max-w-md mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex-1 min-h-[44px] flex flex-col items-center justify-center py-1 rounded-lg transition-colors relative ${
                item.isActive
                  ? 'text-brand-teal font-semibold bg-brand-teal-light'
                  : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              {item.isActive && (
                <span className="absolute top-0 w-8 h-1 bg-brand-teal rounded-full" />
              )}
              <Icon className="w-5 h-5" />
              <span className="text-[11px] mt-0.5 tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
