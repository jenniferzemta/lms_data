'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { CourseTool, CourseLevel } from '../types';
import { mockCourses } from '../data/mockCourses';
import { CourseCard } from './CourseCard';
import { ToolFilterList } from './ToolFilterList';
import { LevelFilterList } from './LevelFilterList';
import { TrustBanner } from './TrustBanner';
import { Input } from '@/ui/Input';
import { Sparkles, Search, SlidersHorizontal, SearchX, RotateCcw } from 'lucide-react';

export const CatalogView: React.FC = () => {
  const tCatalog = useTranslations('Catalog');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState<CourseTool>('all');
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({
    'course-excel-1': true
  });

  const handleBookmarkToggle = (courseId: string) => {
    setBookmarkedIds((prev) => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTool('all');
    setSelectedLevel('all');
  };

  const filteredCourses = useMemo(() => {
    return mockCourses.filter((course) => {
      // Tool filter
      if (selectedTool !== 'all' && course.tool !== selectedTool) {
        return false;
      }
      // Level filter
      if (selectedLevel !== 'all' && course.level !== selectedLevel) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = course.title.toLowerCase().includes(query);
        const matchesDesc = course.description.toLowerCase().includes(query);
        const matchesContext = course.localContext?.toLowerCase().includes(query);
        const matchesTool = course.tool.toLowerCase().includes(query);

        if (!matchesTitle && !matchesDesc && !matchesContext && !matchesTool) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, selectedTool, selectedLevel]);

  return (
    <div className="flex flex-col gap-4 sm:gap-6 pb-6">
      {/* View Header */}
      <div className="flex flex-col pt-1">
        <div className="flex items-center gap-1.5 text-brand-teal mb-1.5">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
            {tCatalog('certifyingBadge')}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-primary tracking-tight">
          {tCatalog('exploreTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted mt-1 leading-relaxed">
          {tCatalog('exploreSubtitle')}
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="w-full">
        <Input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={tCatalog('searchPlaceholder')}
          aria-label={tCatalog('searchPlaceholder')}
          leftIcon={<Search className="w-5 h-5 text-brand-muted" />}
          rightIcon={
            <button
              type="button"
              onClick={() => {}}
              aria-label="Filtrer"
              className="p-1 text-brand-muted hover:text-brand-primary active:scale-95 transition-transform"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          }
          className="shadow-xs bg-white text-sm"
        />
      </div>

      {/* Horizontal Tool Filters */}
      <ToolFilterList
        selectedTool={selectedTool}
        onSelectTool={setSelectedTool}
      />

      {/* Horizontal Level Filters */}
      <LevelFilterList
        selectedLevel={selectedLevel}
        onSelectLevel={setSelectedLevel}
      />

      {/* Local African Market Reassurance Banner */}
      <TrustBanner />

      {/* Course Cards Gallery Container (Responsive 1 col mobile, 2 col tablet, 3 col desktop) */}
      <div className="pt-2">
        {filteredCourses.length > 0 ? (
          <div className="flex flex-col gap-3.5 sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isBookmarked={!!bookmarkedIds[course.id]}
                onBookmarkToggle={handleBookmarkToggle}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-brand-border text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-brand-muted mb-3">
              <SearchX className="w-6 h-6" />
            </div>
            <p className="font-semibold text-sm text-brand-primary mb-1">
              {tCatalog('noResults')}
            </p>
            <p className="text-xs text-brand-muted mb-4 max-w-xs">
              {tCatalog('noResultsSubtitle')}
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold flex items-center gap-2 hover:bg-brand-primary-dark transition active:scale-95 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{tCatalog('resetFilters')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
