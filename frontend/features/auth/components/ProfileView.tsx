'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '../context/AuthContext';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { 
  User as UserIcon, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  Globe, 
  Zap, 
  Wifi, 
  Smartphone, 
  Save,
  KeyRound
} from 'lucide-react';
import { Button } from '@/ui/Button';
import { ApiError } from '@/lib/api-client';
import { User } from '../types';

interface AccountSettingsFormProps {
  user: User;
}

const AccountSettingsForm: React.FC<AccountSettingsFormProps> = ({ user }) => {
  const tProfile = useTranslations('Profile');
  const tAuth = useTranslations('Auth');
  const { updateProfile } = useAuth();

  const [firstName, setFirstName] = useState(user.first_name || '');
  const [lastName, setLastName] = useState(user.last_name || '');
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number || '');
  const [studyLevel, setStudyLevel] = useState(user.learner_profile?.study_level || '');
  const [learningGoal, setLearningGoal] = useState(user.learner_profile?.learning_goal || '');
  const [whatsappConsent, setWhatsappConsent] = useState(user.learner_profile?.whatsapp_consent ?? true);

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await updateProfile({
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        study_level: studyLevel,
        learning_goal: learningGoal,
        whatsapp_consent: whatsappConsent,
      });
      setSuccessMessage(tProfile('saveSuccess'));
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(tAuth('genericError'));
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-brand-border shadow-xs">
      <div className="mb-6">
        <h2 className="text-base font-bold text-brand-primary font-heading">
          {tProfile('personalInfo')}
        </h2>
        <p className="text-xs text-brand-muted">
          {tProfile('subtitle')}
        </p>
      </div>

      {successMessage && (
        <div className="mb-5 p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-brand-muted mb-1.5">
              {tAuth('firstNameLabel')}
            </label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-brand-border bg-slate-50 focus:bg-white text-xs text-brand-text outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-muted mb-1.5">
              {tAuth('lastNameLabel')}
            </label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-brand-border bg-slate-50 focus:bg-white text-xs text-brand-text outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-brand-muted mb-1.5">
            {tAuth('phoneLabel')}
          </label>
          <div className="relative">
            <Smartphone className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+237 6xx xx xx xx"
              className="w-full min-h-[44px] pl-10 pr-3.5 rounded-xl border border-brand-border bg-slate-50 focus:bg-white text-xs text-brand-text outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
            />
          </div>
          <p className="text-[11px] text-brand-muted mt-1">
            {tAuth('phoneHelp')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-brand-muted mb-1.5">
              {tAuth('studyLevelLabel')}
            </label>
            <input
              type="text"
              value={studyLevel}
              onChange={(e) => setStudyLevel(e.target.value)}
              placeholder="Licence, Master, Professionnel..."
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-brand-border bg-slate-50 focus:bg-white text-xs text-brand-text outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-muted mb-1.5">
              {tAuth('learningGoalLabel')}
            </label>
            <input
              type="text"
              value={learningGoal}
              onChange={(e) => setLearningGoal(e.target.value)}
              placeholder="Devenir Data Analyst, Trouver un stage..."
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-brand-border bg-slate-50 focus:bg-white text-xs text-brand-text outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
            />
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={whatsappConsent}
              onChange={(e) => setWhatsappConsent(e.target.checked)}
              className="w-4 h-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary mt-0.5"
            />
            <span className="text-xs text-brand-muted leading-snug">
              {tAuth('whatsappConsent')}
            </span>
          </label>
        </div>

        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={isSaving}
            className="w-full sm:w-auto min-h-[44px] px-6"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? tProfile('saving') : tProfile('saveChanges')}
          </Button>
        </div>
      </form>
    </div>
  );
};

const SecuritySettingsForm: React.FC = () => {
  const tProfile = useTranslations('Profile');
  const tAuth = useTranslations('Auth');
  const { changePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (newPassword !== confirmPassword) {
      setErrorMessage(tProfile('passwordMismatch'));
      return;
    }

    setIsChanging(true);
    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setSuccessMessage(tProfile('passwordSuccess'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(tAuth('genericError'));
      }
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-brand-border shadow-xs">
      <div className="mb-6">
        <h2 className="text-base font-bold text-brand-primary font-heading">
          {tProfile('securityTitle')}
        </h2>
        <p className="text-xs text-brand-muted">
          {tProfile('subtitle')}
        </p>
      </div>

      {successMessage && (
        <div className="mb-5 p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-xs font-bold text-brand-muted mb-1.5">
            {tProfile('currentPassword')}
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full min-h-[44px] pl-10 pr-3.5 rounded-xl border border-brand-border bg-slate-50 focus:bg-white text-xs text-brand-text outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-brand-muted mb-1.5">
            {tProfile('newPassword')}
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Au moins 8 caractères"
            className="w-full min-h-[44px] px-3.5 rounded-xl border border-brand-border bg-slate-50 focus:bg-white text-xs text-brand-text outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-brand-muted mb-1.5">
            {tProfile('confirmNewPassword')}
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmer votre nouveau mot de passe"
            className="w-full min-h-[44px] px-3.5 rounded-xl border border-brand-border bg-slate-50 focus:bg-white text-xs text-brand-text outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            disabled={isChanging}
            className="w-full sm:w-auto min-h-[44px] px-6"
          >
            {isChanging ? tProfile('updatingPassword') : tProfile('updatePassword')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export const ProfileView: React.FC = () => {
  const tProfile = useTranslations('Profile');
  const tAuth = useTranslations('Auth');
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'account' | 'app' | 'security'>('account');

  // App settings state
  const [lightweightMode, setLightweightMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('datamboa_data_saver') === 'true';
    }
    return false;
  });

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleToggleLightweight = (enabled: boolean) => {
    setLightweightMode(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem('datamboa_data_saver', enabled ? 'true' : 'false');
    }
  };

  const handleLanguageSwitch = (newLocale: 'fr' | 'en') => {
    router.replace(pathname, { locale: newLocale });
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-6">
        <div className="w-8 h-8 rounded-full border-3 border-brand-teal border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white rounded-2xl border border-brand-border text-center shadow-xs">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-brand-muted">
          <UserIcon className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-brand-primary mb-2">
          {tProfile('mustBeLoggedIn')}
        </h2>
        <p className="text-xs text-brand-muted mb-6">
          {tAuth('loginSubtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full">
              {tAuth('loginButton')}
            </Button>
          </Link>
          <Link href="/register" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full">
              {tAuth('registerButton')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const userInitial = user.first_name ? user.first_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 sm:pb-16 text-brand-text">
      {/* Header Profile Identity Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-brand-border shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-primary text-white flex items-center justify-center text-2xl font-black shrink-0 shadow-xs">
              {userInitial}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl sm:text-2xl font-extrabold text-brand-primary font-heading tracking-tight truncate">
                  {user.full_name || user.email.split('@')[0]}
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-brand-teal border border-teal-200">
                  {user.is_learner ? tProfile('roleLearner') : user.role}
                </span>
              </div>
              <p className="text-xs text-brand-muted truncate">
                {user.email}
              </p>
            </div>
          </div>

          {/* Quick status pill and plan indicator */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
            <span className="text-[11px] font-semibold text-brand-muted">
              {tProfile('planTitle')}
            </span>
            <span className="text-xs font-bold text-brand-primary">
              {tProfile('planFree')}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation (Touch-friendly >= 44px) */}
      <div className="flex items-center gap-2 border-b border-brand-border/80 mb-6 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('account')}
          className={`flex items-center gap-2 px-4 min-h-[44px] rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'account'
              ? 'bg-brand-primary text-white shadow-xs'
              : 'text-brand-muted hover:text-brand-primary hover:bg-slate-100'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>{tProfile('tabAccount')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('app')}
          className={`flex items-center gap-2 px-4 min-h-[44px] rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'app'
              ? 'bg-brand-primary text-white shadow-xs'
              : 'text-brand-muted hover:text-brand-primary hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{tProfile('tabAppSettings')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 min-h-[44px] rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'security'
              ? 'bg-brand-primary text-white shadow-xs'
              : 'text-brand-muted hover:text-brand-primary hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{tProfile('tabSecurity')}</span>
        </button>
      </div>

      {/* TAB 1: Account & Profile Details */}
      {activeTab === 'account' && (
        <AccountSettingsForm key={user.id} user={user} />
      )}

      {/* TAB 2: Application Preferences & Data Saver */}
      {activeTab === 'app' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-brand-border shadow-xs">
            <h2 className="text-base font-bold text-brand-primary font-heading mb-1">
              {tProfile('appSettingsTitle')}
            </h2>
            <p className="text-xs text-brand-muted mb-6">
              {tProfile('appLanguageDesc')}
            </p>

            <div className="space-y-6">
              {/* Language Switcher Setting */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-brand-teal mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-brand-primary block">
                      {tProfile('appLanguage')}
                    </span>
                    <span className="text-[11px] text-brand-muted">
                      Français / English
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleLanguageSwitch('fr')}
                    className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all border border-brand-border hover:border-brand-primary bg-white text-brand-text active:scale-95"
                  >
                    🇫🇷 Français
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLanguageSwitch('en')}
                    className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all border border-brand-border hover:border-brand-primary bg-white text-brand-text active:scale-95"
                  >
                    🇬🇧 English
                  </button>
                </div>
              </div>

              {/* Data Saver Mode (Lightweight Mode F1.14) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-brand-amber mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-brand-primary block">
                      {tProfile('lightweightMode')}
                    </span>
                    <span className="text-[11px] text-brand-muted max-w-md block">
                      {tProfile('lightweightModeDesc')}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleLightweight(!lightweightMode)}
                  aria-pressed={lightweightMode}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    lightweightMode
                      ? 'bg-brand-teal text-white shadow-xs'
                      : 'bg-white border border-brand-border text-brand-muted hover:text-brand-primary'
                  }`}
                >
                  {lightweightMode ? 'Activé (Économie)' : 'Standard'}
                </button>
              </div>

              {/* Connection Status Indicator */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-teal-600 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-brand-primary block">
                      {tProfile('connectionStatus')}
                    </span>
                    <span className="text-[11px] text-teal-700 font-medium">
                      {tProfile('onlineStatus')}
                    </span>
                  </div>
                </div>
                <span className="w-3 h-3 rounded-full bg-teal-500 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Security & Password Update */}
      {activeTab === 'security' && (
        <SecuritySettingsForm />
      )}

      {/* DANGER ZONE: Prominent Logout Button for all devices */}
      <div className="mt-8 pt-6 border-t border-brand-border/60">
        <div className="bg-rose-50/50 rounded-2xl p-5 sm:p-6 border border-rose-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-rose-900 mb-0.5">
              {tProfile('dangerZone')}
            </h3>
            <p className="text-xs text-rose-700/80">
              {tProfile('logoutConfirm')}
            </p>
          </div>

          {showLogoutConfirm ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="min-h-[44px] px-4 rounded-xl text-xs font-semibold bg-white border border-rose-200 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {tProfile('cancel')}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="min-h-[44px] px-4 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors flex items-center gap-2 shadow-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>{isLoggingOut ? '...' : tProfile('logout')}</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="min-h-[44px] px-5 rounded-xl text-xs font-bold text-rose-700 hover:text-white bg-white hover:bg-rose-600 border border-rose-300 hover:border-rose-600 transition-all flex items-center justify-center gap-2 shadow-2xs select-none"
            >
              <LogOut className="w-4 h-4" />
              <span>{tProfile('logout')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
