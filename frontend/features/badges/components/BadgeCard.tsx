'use client';

import React from 'react';
import { BadgeItem } from '../types';
import { Badge } from '@/ui/Badge';
import {
  Award,
  Terminal,
  Table,
  FileCode,
  Briefcase,
  CheckCircle2,
  Flame,
  Sparkles,
  Lock,
  Calendar
} from 'lucide-react';

interface BadgeCardProps {
  badge: BadgeItem;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge }) => {
  const renderIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6' };
    switch (iconName.toLowerCase()) {
      case 'terminal': return <Terminal {...props} />;
      case 'table': return <Table {...props} />;
      case 'file-code': return <FileCode {...props} />;
      case 'briefcase': return <Briefcase {...props} />;
      case 'check-circle': return <CheckCircle2 {...props} />;
      case 'flame': return <Flame {...props} />;
      case 'sparkles': return <Sparkles {...props} />;
      default: return <Award {...props} />;
    }
  };

  const categoryLabel: Record<string, string> = {
    LAB: 'Laboratoire',
    COURSE: 'Cours & Quiz',
    MISSION: 'Mission Pro',
    STREAK: 'Assiduité',
    SPECIAL: 'Spécial'
  };

  const formattedDate = badge.earned_at
    ? new Date(badge.earned_at).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : null;

  return (
    <div
      className={`flex flex-col rounded-2xl p-5 border transition-all duration-200 relative select-text ${
        badge.is_earned
          ? 'bg-white border-brand-accent/50 shadow-xs hover:shadow-md'
          : 'bg-slate-50/70 border-slate-200 opacity-75 hover:opacity-100'
      }`}
    >
      {/* Top Header: Category Tag & XP Reward */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {categoryLabel[badge.category] || badge.category}
        </span>
        <Badge variant={badge.is_earned ? 'teal' : 'neutral'}>
          +{badge.points_reward} XP
        </Badge>
      </div>

      {/* Main Badge Icon & Name */}
      <div className="flex items-start gap-3.5 mb-3">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform ${
            badge.is_earned
              ? 'bg-gradient-to-br from-brand-primary to-indigo-800 text-white shadow-xs'
              : 'bg-slate-200 text-slate-400'
          }`}
        >
          {badge.is_earned ? renderIcon(badge.icon) : <Lock className="w-5 h-5 text-slate-400" />}
        </div>

        <div>
          <h3 className="font-bold text-sm sm:text-base text-brand-text leading-snug">
            {badge.name}
          </h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
            {badge.description}
          </p>
        </div>
      </div>

      {/* Footer: Earned Date or Unlock Condition */}
      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
        {badge.is_earned ? (
          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Débloqué {formattedDate ? `le ${formattedDate}` : ''}</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-slate-500">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>À débloquer par la pratique</span>
          </span>
        )}
      </div>
    </div>
  );
};
