'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Mail, Lock, User as UserIcon, Phone, GraduationCap, Target, UserPlus, AlertCircle } from 'lucide-react';
import { Input } from '@/ui/Input';
import { Button } from '@/ui/Button';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '@/lib/api-client';

export const RegisterForm: React.FC = () => {
  const t = useTranslations('Auth');
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'fr';
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    studyLevel: '',
    learningGoal: '',
    whatsappConsent: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
        study_level: formData.studyLevel,
        learning_goal: formData.learningGoal,
        whatsapp_consent: formData.whatsappConsent,
      });
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
    <div className="w-full max-w-lg mx-auto bg-brand-surface rounded-2xl border border-brand-border p-5 sm:p-8 shadow-xs">
      <div className="mb-6 text-center">
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-brand-text mb-2">
          {t('registerTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted">
          {t('registerSubtitle')}
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="register-first-name"
            name="firstName"
            type="text"
            label={t('firstNameLabel')}
            placeholder={t('firstNamePlaceholder')}
            value={formData.firstName}
            onChange={handleChange}
            required
            autoComplete="given-name"
            leftIcon={<UserIcon className="w-4 h-4" />}
          />
          <Input
            id="register-last-name"
            name="lastName"
            type="text"
            label={t('lastNameLabel')}
            placeholder={t('lastNamePlaceholder')}
            value={formData.lastName}
            onChange={handleChange}
            required
            autoComplete="family-name"
            leftIcon={<UserIcon className="w-4 h-4" />}
          />
        </div>

        <Input
          id="register-email"
          name="email"
          type="email"
          label={t('emailLabel')}
          placeholder={t('emailPlaceholder')}
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <Input
          id="register-password"
          name="password"
          type="password"
          label={t('passwordLabel')}
          placeholder={t('passwordPlaceholder')}
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
          leftIcon={<Lock className="w-4 h-4" />}
        />

        <div className="flex flex-col gap-1">
          <Input
            id="register-phone"
            name="phoneNumber"
            type="tel"
            label={t('phoneLabel')}
            placeholder={t('phonePlaceholder')}
            value={formData.phoneNumber}
            onChange={handleChange}
            autoComplete="tel"
            leftIcon={<Phone className="w-4 h-4" />}
          />
          <p className="text-[11px] text-brand-muted pl-1">
            {t('phoneHelp')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="register-study-level"
            name="studyLevel"
            type="text"
            label={t('studyLevelLabel')}
            placeholder={t('studyLevelPlaceholder')}
            value={formData.studyLevel}
            onChange={handleChange}
            leftIcon={<GraduationCap className="w-4 h-4" />}
          />
          <Input
            id="register-learning-goal"
            name="learningGoal"
            type="text"
            label={t('learningGoalLabel')}
            placeholder={t('learningGoalPlaceholder')}
            value={formData.learningGoal}
            onChange={handleChange}
            leftIcon={<Target className="w-4 h-4" />}
          />
        </div>

        <label
          htmlFor="whatsappConsent"
          className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50/90 hover:bg-slate-100/80 border border-brand-border transition-colors cursor-pointer select-none min-h-[48px]"
        >
          <input
            id="whatsappConsent"
            type="checkbox"
            name="whatsappConsent"
            checked={formData.whatsappConsent}
            onChange={handleChange}
            className="w-5 h-5 shrink-0 rounded border-slate-300 text-brand-teal focus:ring-brand-teal accent-brand-teal cursor-pointer"
          />
          <span className="text-xs text-brand-text font-medium leading-relaxed">
            {t('whatsappConsent')}
          </span>
        </label>

        <Button
          type="submit"
          variant="secondary"
          fullWidth
          isLoading={isLoading}
          className="mt-2"
        >
          <span className="flex items-center justify-center gap-2">
            <UserPlus className="w-4 h-4" />
            <span>{isLoading ? t('registering') : t('registerButton')}</span>
          </span>
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-brand-border text-center text-xs text-brand-muted">
        <span>{t('hasAccount')} </span>
        <Link
          href={`/${locale}/login`}
          className="font-semibold text-brand-teal hover:underline min-h-[44px] inline-flex items-center"
        >
          {t('loginLink')}
        </Link>
      </div>
    </div>
  );
};
