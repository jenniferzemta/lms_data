import React from 'react';
import { notFound } from 'next/navigation';
import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';
import { DesktopSidebar } from '@/components/DesktopSidebar';
import { MissionWorkspaceView, missionsService } from '@/features/missions';

interface MissionWorkspacePageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export default async function MissionWorkspacePage({ params }: MissionWorkspacePageProps) {
  const { slug } = await params;
  const mission = await missionsService.getMissionDetail(slug);

  if (!mission) {
    notFound();
  }

  return (
    <div className="flex min-h-screen bg-brand-canvas text-brand-text">
      {/* Desktop Persistent Left Sidebar */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 xl:pl-72">
        <AppHeader />

        <main className="flex-1 w-full pt-16">
          <MissionWorkspaceView mission={mission} />
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
