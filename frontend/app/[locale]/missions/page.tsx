import React from 'react';
import { getLocale } from 'next-intl/server';
import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';
import { DesktopSidebar } from '@/components/DesktopSidebar';
import { MissionCard, missionsService } from '@/features/missions';
import { Briefcase, Target } from 'lucide-react';

export default async function MissionsCatalogPage() {
  const locale = await getLocale();
  const isEn = locale === 'en';
  const missions = await missionsService.getMissions();

  return (
    <div className="flex min-h-screen bg-brand-canvas text-brand-text">
      {/* Desktop Persistent Left Sidebar */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 xl:pl-72">
        <AppHeader />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pb-12 min-h-[calc(100vh-4rem)]">
          {/* Header Banner */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold rounded-full mb-3">
              <Briefcase className="w-3.5 h-3.5 text-amber-600" />
              <span>{isEn ? 'Real Enterprise Scenarios' : "Scénarios d'Entreprises Locales"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text tracking-tight">
              {isEn ? 'Business Case Missions & Real-World Studies' : 'Missions & Études de Cas Réelles'}
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              {isEn
                ? 'Solve concrete analytical challenges from real enterprises (microfinance, retail distribution, logistics), download genuine datasets, and self-evaluate your deliverables with our reference model solutions.'
                : "Résolvez des défis analytiques concrets d'entreprises locales (microfinance, grande distribution, Mobile Money), téléchargez les données réelles et auto-évaluez vos livrables avec nos corrigés de référence."}
            </p>
          </div>

          {/* Missions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {missions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>

          {missions.length === 0 && (
            <div className="p-8 text-center bg-white border border-brand-border rounded-2xl max-w-md mx-auto">
              <Target className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="font-bold text-base text-slate-700">
                {isEn ? 'No missions available' : 'Aucune mission disponible'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isEn ? 'Enterprise missions are currently being deployed.' : "Les missions d'entreprise sont en cours de déploiement."}
              </p>
            </div>
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}

