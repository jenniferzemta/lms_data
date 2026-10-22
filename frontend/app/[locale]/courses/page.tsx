import React from 'react';
import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';
import { CatalogView } from '@/features/catalog';

export default function CoursesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-canvas text-brand-text">
      {/* Pinned Top Navigation Header */}
      <AppHeader />

      {/* Main Content Viewport (Mobile 360px up to Desktop 1280px) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-18 pb-24 md:pb-12 min-h-[calc(100vh-3.5rem)]">
        <CatalogView />
      </main>

      {/* Mobile Pinned Bottom Navigation (Hidden on Tablet / Desktop) */}
      <BottomNav />
    </div>
  );
}
