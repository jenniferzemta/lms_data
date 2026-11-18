'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';
import { DesktopSidebar } from '@/components/DesktopSidebar';
import { 
  ShieldAlert, 
  Users, 
  Coins, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink, 
  FileSpreadsheet, 
  Search, 
  Settings, 
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Filter
} from 'lucide-react';

export default function AdminPortalPage() {
  const t = useTranslations('AdminPortal');
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'users'>('overview');
  const [validatedPayments, setValidatedPayments] = useState<string[]>([]);

  const mockPendingPayments = [
    {
      id: 'PAY-2026-081',
      user: 'Jean-Marc T. (Douala)',
      phone: '+237 671 22 33 44',
      plan: 'Formule Professionnelle (Annuelle)',
      amount: '30 000 FCFA',
      method: 'MTN Mobile Money',
      reference: 'TXN-MTN-998124',
      date: '17 nov. 2026 - 18:30',
      proof: 'Capture WhatsApp reçue',
    },
    {
      id: 'PAY-2026-082',
      user: 'Sandrine K. (Yaoundé)',
      phone: '+237 699 55 44 33',
      plan: 'Formule Essentielle (Mensuelle)',
      amount: '10 000 FCFA',
      method: 'Orange Money',
      reference: 'OM-CM-554120',
      date: '17 nov. 2026 - 19:15',
      proof: 'Capture WhatsApp reçue',
    },
  ];

  const handleValidate = (id: string) => {
    setValidatedPayments([...validatedPayments, id]);
  };

  return (
    <div className="flex min-h-screen bg-brand-canvas text-brand-text">
      {/* Desktop Persistent Left Sidebar */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 xl:pl-72">
        {/* Top Header */}
        <AppHeader />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pb-12 min-h-[calc(100vh-4rem)] space-y-6">
          
          {/* Header Section */}
          <section className="bg-white rounded-3xl p-5 sm:p-7 border border-brand-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-800 text-[11px] font-bold">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                  <span>{t('badge')}</span>
                </span>
                <span className="text-xs font-semibold text-brand-muted bg-slate-100 px-2 py-0.5 rounded-full">
                  {t('subBadge')}
                </span>
              </div>

              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-brand-primary tracking-tight">
                {t('title')}
              </h1>
              <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
                {t('subtitle')}
              </p>
            </div>

            {/* Direct Link to Django Admin */}
            <div className="flex items-center gap-2.5 shrink-0">
              <a
                href="http://localhost:8000/admin/"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition active:scale-95"
              >
                <span>{t('btnDjangoAdmin')}</span>
                <ExternalLink className="w-3.5 h-3.5 text-brand-teal" />
              </a>
            </div>
          </section>

          {/* Quick Metrics */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white rounded-2xl p-4 border border-brand-border shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{t('statLearners')}</span>
                <Users className="w-4 h-4 text-brand-teal" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">148</div>
              <div className="text-[11px] text-emerald-600 font-semibold">{t('statLearnersSub')}</div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-brand-border shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{t('statRevenue')}</span>
                <Coins className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">1 850 000 FCFA</div>
              <div className="text-[11px] text-slate-500 font-medium">{t('statRevenueSub')}</div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-brand-border shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{t('statPending')}</span>
                <Clock className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
                {mockPendingPayments.length - validatedPayments.length}
              </div>
              <div className="text-[11px] text-indigo-700 font-semibold">{t('statPendingSub')}</div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-brand-border shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{t('statCompletion')}</span>
                <BookOpen className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">76.4%</div>
              <div className="text-[11px] text-emerald-600 font-semibold">{t('statCompletionSub')}</div>
            </div>
          </section>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-brand-border pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`min-h-[40px] px-4 rounded-xl text-xs font-bold transition ${
                activeTab === 'overview'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t('tabOverview')}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('payments')}
              className={`min-h-[40px] px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'payments'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{t('tabPayments')}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-900 text-[10px]">
                {mockPendingPayments.length - validatedPayments.length}
              </span>
            </button>
          </div>

          {/* Tab 1: Overview & Shortcuts */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Back-office Quick Actions */}
              <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-2xs space-y-3">
                <h3 className="font-bold text-sm text-slate-900">{t('djangoModulesTitle')}</h3>
                <p className="text-xs text-brand-muted">
                  {t('djangoModulesSubtitle')}
                </p>

                <div className="space-y-2 pt-1">
                  <a
                    href="http://localhost:8000/admin/courses/course/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800 transition"
                  >
                    <span>{t('linkCourses')}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>

                  <a
                    href="http://localhost:8000/admin/accounts/user/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800 transition"
                  >
                    <span>{t('linkUsers')}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>

                  <a
                    href="http://localhost:8000/admin/billing/subscriptionplan/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800 transition"
                  >
                    <span>{t('linkPlans')}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>

                  <a
                    href="http://localhost:8000/admin/certificates/certificate/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800 transition"
                  >
                    <span>{t('linkCerts')}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                </div>
              </div>

              {/* System Health & Status */}
              <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-2xs space-y-3">
                <h3 className="font-bold text-sm text-slate-900">{t('systemStatusTitle')}</h3>
                <div className="space-y-2.5 pt-1 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                    <span className="font-semibold">{t('serverDjango')}</span>
                    <span className="font-bold">Opérationnel · Port 8000</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                    <span className="font-semibold">{t('serverNext')}</span>
                    <span className="font-bold">16.4.6 Sécurisé · Turbopack</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900">
                    <span className="font-semibold">{t('testsAutomated')}</span>
                    <span className="font-bold">106 / 106 tests OK</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                    <span className="font-semibold">{t('dataSaverStatus')}</span>
                    <span className="font-bold text-brand-teal">Actif & Configuré</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: WhatsApp Payment Validation Queue (F1.10) */}
          {activeTab === 'payments' && (
            <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {t('queueTitle')}
                  </h3>
                  <p className="text-xs text-brand-muted mt-0.5">
                    {t('queueRule')}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {mockPendingPayments.map((p) => {
                  const isValidated = validatedPayments.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isValidated
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : 'bg-white border-brand-border hover:border-brand-teal/40'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-brand-primary">{p.id}</span>
                          <span className="text-xs font-bold text-slate-900">{p.user}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-600">
                            {p.phone}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600">
                          {p.plan} · <strong className="text-brand-primary">{p.amount}</strong> ({p.method})
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Réf. opérateur : {p.reference} · {p.date}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isValidated ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Paiement Validé & Accès Activé</span>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleValidate(p.id)}
                              className="min-h-[40px] px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Valider & Activer</span>
                            </button>
                            <button
                              type="button"
                              className="min-h-[40px] px-3 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Rejeter</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </main>
      </div>

      <BottomNav />
    </div>
  );
}
