import React from 'react';
import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';
import { DesktopSidebar } from '@/components/DesktopSidebar';
import { ProfileView } from '@/features/auth';

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen bg-brand-canvas text-brand-text">
      {/* Desktop Persistent Left Sidebar (Visible only >= lg) */}
      <DesktopSidebar />

      {/* Main Content Area (Offset on Desktop by Sidebar width) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 xl:pl-72">
        {/* Pinned Top Navigation Header */}
        <AppHeader />

        {/* Main Content Viewport (Mobile 360px up to Desktop 1280px) */}
        <main className="flex-1 w-full max-w-7xl mx-auto pt-20 pb-24 lg:pb-12 min-h-[calc(100vh-4rem)]">
          <ProfileView />
        </main>
      </div>

      {/* Mobile Pinned Bottom Navigation (Hidden on Desktop) */}
      <BottomNav />
    </div>
  );
}
