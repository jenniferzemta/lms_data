'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

export const LanguageSwitcher: React.FC = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleToggle = () => {
    const nextLocale = locale === 'fr' ? 'en' : 'fr';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={locale === 'fr' ? 'Switch to English' : 'Passer en français'}
      className="min-w-[44px] min-h-[44px] px-2.5 flex items-center justify-center font-semibold text-xs rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-canvas-alt transition-colors active:scale-95 border border-brand-border"
    >
      <span className="uppercase">{locale}</span>
    </button>
  );
};
