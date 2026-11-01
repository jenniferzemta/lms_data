'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Globe, AlertCircle } from 'lucide-react';

interface FallbackLanguageBannerProps {
  currentLang: string;
}

export const FallbackLanguageBanner: React.FC<FallbackLanguageBannerProps> = ({ currentLang }) => {
  const t = useTranslations('Lesson');

  return (
    <div
      role="alert"
      className="flex items-center gap-3 p-3.5 mb-6 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm"
    >
      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
        <Globe className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold leading-tight flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 inline shrink-0" />
          <span>{t('fallbackBannerTitle')}</span>
        </p>
        <p className="text-amber-800 text-xs mt-0.5 leading-relaxed">
          {t('fallbackBannerText', { lang: currentLang === 'fr' ? 'anglaise' : 'French' })}
        </p>
      </div>
    </div>
  );
};
