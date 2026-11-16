'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';
import { DesktopSidebar } from '@/components/DesktopSidebar';
import {
  SrsStatsHeader,
  FlashcardReviewSession,
  fetchDueCards,
  submitReview,
  FlashcardItem,
  SrsMetrics,
  ReviewQuality,
} from '@/features/srs';
import { Loader2 } from 'lucide-react';

export default function SrsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [cards, setCards] = useState<FlashcardItem[]>([]);
  const [metrics, setMetrics] = useState<SrsMetrics>({
    due_today: 0,
    total_cards: 0,
    mastered_cards: 0,
    retention_rate: 85,
    streak_days: 1,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = useCallback(async (cat: string) => {
    setIsLoading(true);
    try {
      const data = await fetchDueCards(cat);
      setCards(data.cards);
      setMetrics(data.metrics);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(selectedCategory);
  }, [selectedCategory, loadData]);

  const handleReviewSubmit = async (cardId: number, quality: ReviewQuality) => {
    const res = await submitReview(cardId, quality);
    if (res.success) {
      // Update local metrics
      setMetrics(prev => ({
        ...prev,
        due_today: Math.max(0, prev.due_today - 1),
        mastered_cards: quality >= 4 ? prev.mastered_cards + 1 : prev.mastered_cards,
      }));
    }
  };

  const handleRestart = () => {
    loadData(selectedCategory);
  };

  return (
    <div className="flex min-h-screen bg-brand-canvas text-brand-text">
      {/* Desktop Persistent Left Sidebar */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 xl:pl-72">
        <AppHeader />

        <main className="flex-1 w-full max-w-5xl mx-auto pt-16 pb-24 lg:pb-12 min-h-[calc(100vh-4rem)]">
          <SrsStatsHeader
            metrics={metrics}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mb-3 text-brand-600" />
              <p className="text-sm">Chargement des cartes programmées...</p>
            </div>
          ) : (
            <FlashcardReviewSession
              cards={cards}
              onReviewSubmit={handleReviewSubmit}
              onRestartSession={handleRestart}
            />
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
