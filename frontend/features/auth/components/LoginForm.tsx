'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { Input } from '@/ui/Input';
import { Button } from '@/ui/Button';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '@/lib/api-client';
import { GoogleSignInButton } from './GoogleSignInButton';

export const LoginForm: React.FC = () => {
  const t = useTranslations('Auth');
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'fr';
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await login({ email, password });
      router.push(`/${locale}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(t('genericError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-brand-surface rounded-2xl border border-brand-border p-5 sm:p-8 shadow-xs">
      <div className="mb-6 text-center">
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-brand-text mb-2">
          {t('loginTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted">
          {t('loginSubtitle')}
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Google Sign In Option */}
      <div className="mb-4">
        <GoogleSignInButton onErrorMessage={(msg) => setErrorMessage(msg)} />
      </div>

      <div className="relative my-4 flex items-center justify-center">
        <div className="border-t border-brand-border w-full" />
        <span className="bg-brand-surface px-3 text-[11px] font-semibold uppercase tracking-wider text-brand-muted shrink-0">
          {t('orDivider')}
        </span>
        <div className="border-t border-brand-border w-full" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="login-email"
          type="email"
          label={t('emailLabel')}
          placeholder={t('emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <Input
          id="login-password"
          type="password"
          label={t('passwordLabel')}
          placeholder={t('passwordPlaceholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          leftIcon={<Lock className="w-4 h-4" />}
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          className="mt-2"
        >
          <span className="flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4" />
            <span>{isLoading ? t('loggingIn') : t('loginButton')}</span>
          </span>
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-brand-border text-center text-xs text-brand-muted">
        <span>{t('noAccount')} </span>
        <Link
          href={`/${locale}/register`}
          className="font-semibold text-brand-teal hover:underline min-h-[44px] inline-flex items-center"
        >
          {t('registerLink')}
        </Link>
      </div>
    </div>
  );
};
