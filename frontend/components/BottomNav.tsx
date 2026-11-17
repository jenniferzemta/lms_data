'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Home, Compass, TrendingUp, User, Terminal, Menu } from 'lucide-react';
import { useAuth } from '@/features/auth';
import { MobileNavDrawer } from './MobileNavDrawer';

export const BottomNav: React.FC = () => {
  const tNav = useTranslations('Navigation');
  const pathname = usePathname();
  const { user } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
      key: 'labs',
      label: 'Labos & Outils',
      href: '/labs/sql',
      icon: Terminal,
      isActive: pathname.startsWith('/labs') || pathname.startsWith('/audit') || pathname.startsWith('/missions')
    },
    {
      key: 'progress',
      label: 'Progrès',
      href: '/dashboard',
      icon: TrendingUp,
      isActive: pathname.startsWith('/dashboard')
    },
    {
      key: 'menu',
      label: 'Menu',
      icon: Menu,
      action: () => setIsDrawerOpen(true),
      isActive: isDrawerOpen
    }
  ];

  return (
    <>
      <nav
        aria-label="Navigation principale mobile et tablette"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-white/95 backdrop-blur-xl border-t border-brand-border shadow-[0_-2px_10px_rgba(20,43,74,0.06)] pb-safe"
      >
        <div className="flex items-center justify-around h-full max-w-md sm:max-w-xl mx-auto px-1 sm:px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.action) {
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={item.action}
                  className={`flex-1 min-h-[44px] flex flex-col items-center justify-center py-1 rounded-lg transition-colors relative ${
                    item.isActive
                      ? 'text-brand-teal font-semibold bg-brand-teal-light'
                      : 'text-brand-muted hover:text-brand-text'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[11px] mt-0.5 tracking-tight">
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.key}
                href={item.href!}
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

      {/* Mobile Drawer */}
      <MobileNavDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};

