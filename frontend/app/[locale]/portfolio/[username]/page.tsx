'use client';

import React, { useEffect, useState, use } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';
import { DesktopSidebar } from '@/components/DesktopSidebar';
import {
  PortfolioHeader,
  PortfolioProjectCard,
  fetchPublicPortfolio,
  fetchMyPortfolio,
  LearnerPortfolioData,
} from '@/features/portfolio';
import { Loader2, FolderKanban } from 'lucide-react';

interface PortfolioPageProps {
  params: Promise<{
    locale: string;
    username: string;
  }>;
}

export default function PortfolioPage({ params }: PortfolioPageProps) {
  const resolvedParams = use(params);
  const username = resolvedParams.username;

  const [portfolio, setPortfolio] = useState<LearnerPortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPortfolio() {
      setIsLoading(true);
      try {
        if (username === 'my') {
          const data = await fetchMyPortfolio();
          setPortfolio(data);
        } else {
          const data = await fetchPublicPortfolio(username);
          setPortfolio(data);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadPortfolio();
  }, [username]);

  return (
    <div className="flex min-h-screen bg-brand-canvas text-brand-text">
      {/* Desktop Persistent Left Sidebar */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 xl:pl-72">
        <AppHeader />

        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pb-12 min-h-[calc(100vh-4rem)] space-y-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-16 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mb-3 text-brand-600" />
              <p className="text-sm">Chargement du portfolio professionnel...</p>
            </div>
          ) : portfolio ? (
            <>
              {/* Profile Card & Bio */}
              <PortfolioHeader portfolio={portfolio} />

              {/* Projects Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderKanban className="w-5 h-5 text-brand-600" />
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      Projets d&apos;entreprise certifiés ({portfolio.projects.length})
                    </h2>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                    Résolution de cas réels en FCFA
                  </span>
                </div>

                {portfolio.projects.length === 0 ? (
                  <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-500">
                    <p className="text-sm">Aucun projet public publié pour le moment.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {portfolio.projects.map((proj) => (
                      <PortfolioProjectCard key={proj.id} project={proj} />
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500">
              <p>Portfolio introuvable ou profil privé.</p>
            </div>
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}

