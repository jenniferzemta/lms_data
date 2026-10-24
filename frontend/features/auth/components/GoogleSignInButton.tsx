'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

export interface GoogleSignInButtonProps {
  onErrorMessage?: (msg: string) => void;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onErrorMessage }) => {
  const t = useTranslations('Auth');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleClick = async () => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!googleClientId) {
      if (onErrorMessage) {
        onErrorMessage(t('googleNotConfigured'));
      }
      return;
    }

    setIsLoading(true);
    try {
      // If GSI script exists on window
      const google = (window as unknown as { google?: { accounts?: { id?: { prompt: () => void } } } }).google;
      if (google?.accounts?.id) {
        google.accounts.id.prompt();
      } else {
        if (onErrorMessage) {
          onErrorMessage(t('googleNotConfigured'));
        }
      }
    } catch {
      if (onErrorMessage) {
        onErrorMessage(t('genericError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      disabled={isLoading}
      aria-label={t('continueWithGoogle')}
      className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold flex items-center justify-center gap-3 transition-colors shadow-2xs active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed select-none"
    >
      {/* Official Google G Logo */}
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
        />
      </svg>
      <span>{isLoading ? '...' : t('continueWithGoogle')}</span>
    </button>
  );
};
