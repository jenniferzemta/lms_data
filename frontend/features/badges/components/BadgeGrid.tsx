'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { BadgeItem } from '../types';
import { BadgeCard } from './BadgeCard';
import { Zap, Trophy } from 'lucide-react';

interface BadgeGridProps {
  badges: BadgeItem[];
}

export const BadgeGrid: React.FC<BadgeGridProps> = ({ badges }) => {
  const locale = useLocale();
  const isEn = locale === 'en';
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const earnedCount = badges.filter((b) => b.is_earned).length;
  const totalBadges = badges.length || 1;

  const totalXpEarned = badges
    .filter((b) => b.is_earned)
    .reduce((acc, b) => acc + b.points_reward, 0);

  const totalXpPossible = badges.reduce((acc, b) => acc + b.points_reward, 0);

  const filteredBadges =
    selectedCategory === 'ALL'
      ? badges
      : badges.filter((b) => b.category === selectedCategory);

  const categories = [
    { key: 'ALL', label: isEn ? 'All' : 'Tous' },
    { key: 'LAB', label: isEn ? 'Laboratories' : 'Laboratoires' },
    { key: 'COURSE', label: isEn ? 'Courses & Quizzes' : 'Cours & Quiz' },
    { key: 'MISSION', label: isEn ? 'Business Missions' : 'Missions Pro' },
    { key: 'STREAK', label: isEn ? 'Consistency' : 'Assiduité' }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Summary Banner */}
      <div className="bg-gradient-to-r from-brand-primary to-indigo-900 rounded-2xl p-5 sm:p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0">
            <Trophy className="w-8 h-8 text-amber-300" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold">
              {isEn ? 'Your Unlocked Skill Badges & Credentials' : 'Vos Badges & Compétences Débloquées'}
            </h2>
            <p className="text-xs sm:text-sm text-white/80 mt-0.5">
              {isEn
                ? 'Recognition of hands-on analytical skills following the Open Badges standard.'
                : 'Reconnaissance des compétences pratiques selon le standard Open Badges.'}
            </p>
          </div>
        </div>

        {/* Counters & Progression Bar */}
        <div className="flex items-center gap-6 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 shrink-0">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-white/70 block">
              {isEn ? 'Earned Badges' : 'Badges obtenus'}
            </span>
            <div className="text-xl sm:text-2xl font-black font-mono">
              {earnedCount} / {totalBadges}
            </div>
          </div>

          <div className="w-px h-8 bg-white/20" />

          <div>
            <span className="text-[11px] uppercase tracking-wider text-white/70 block">
              {isEn ? 'Total XP Points' : 'Points XP cumulés'}
            </span>
            <div className="text-xl sm:text-2xl font-black font-mono text-amber-300 flex items-center gap-1">
              <Zap className="w-4 h-4 fill-amber-300" />
              <span>{totalXpEarned}</span>
              <span className="text-xs text-white/60 font-normal">/ {totalXpPossible}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin pb-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 min-h-[44px] ${
                isSelected
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-brand-border'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBadges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
      </div>
    </div>
  );
};

