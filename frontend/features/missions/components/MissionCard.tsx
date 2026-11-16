'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { MissionSummary } from '../types';
import { Badge } from '@/ui/Badge';
import { Button } from '@/ui/Button';
import { Briefcase, Clock, MapPin, ArrowRight, Building } from 'lucide-react';

interface MissionCardProps {
  mission: MissionSummary;
}

export const MissionCard: React.FC<MissionCardProps> = ({ mission }) => {
  const difficultyVariant =
    mission.difficulty === 'BEGINNER'
      ? 'teal'
      : mission.difficulty === 'INTERMEDIATE'
      ? 'amber'
      : 'primary';

  const difficultyLabel =
    mission.difficulty === 'BEGINNER'
      ? 'Débutant'
      : mission.difficulty === 'INTERMEDIATE'
      ? 'Intermédiaire'
      : 'Avancé';

  return (
    <div className="flex flex-col bg-white border border-brand-border hover:border-brand-accent/50 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200">
      {/* Header: Company, Location & Badges */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Building className="w-4 h-4 text-brand-primary shrink-0" />
          <span className="truncate max-w-[200px]">{mission.company_name}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge variant={difficultyVariant}>
            {difficultyLabel}
          </Badge>
        </div>
      </div>

      {/* Mission Title */}
      <h3 className="font-bold text-base sm:text-lg text-brand-text line-clamp-2 mb-2 leading-snug">
        {mission.title}
      </h3>

      {/* Business Problem Summary */}
      <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed flex-1">
        {mission.business_problem}
      </p>

      {/* Meta details footer: Location, Time, Sector */}
      <div className="pt-3 border-t border-brand-border/60 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-4">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{mission.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>~{mission.estimated_duration_minutes} min</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono font-bold text-brand-primary">
          <span>{mission.currency}</span>
        </div>
      </div>

      {/* Action CTA */}
      <Link href={`/missions/${mission.slug}`} className="w-full">
        <Button variant="primary" className="w-full min-h-[44px] justify-center">
          <span>Démarrer la mission</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </Link>
    </div>
  );
};

