import React from 'react';
import { CourseLevel } from '../types';
import { Layers } from 'lucide-react';

export interface LevelFilterListProps {
  selectedLevel: CourseLevel;
  onSelectLevel: (level: CourseLevel) => void;
}

export const LevelFilterList: React.FC<LevelFilterListProps> = ({
  selectedLevel,
  onSelectLevel
}) => {
  const levels: { id: CourseLevel; label: string }[] = [
    { id: 'all', label: 'Tous' },
    { id: 'debutant', label: 'Débutant' },
    { id: 'intermediaire', label: 'Intermédiaire' },
    { id: 'avance', label: 'Avancé' }
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
      <span className="text-xs font-semibold text-brand-muted shrink-0 mr-1 flex items-center gap-1.5">
        <Layers className="w-3.5 h-3.5 text-brand-muted" />
        <span>Niveau :</span>
      </span>

      {levels.map((level) => {
        const isSelected = selectedLevel === level.id;

        return (
          <button
            key={level.id}
            type="button"
            onClick={() => onSelectLevel(level.id)}
            className={`shrink-0 min-h-[44px] px-3.5 py-1.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all active:scale-95 border ${
              isSelected
                ? 'bg-brand-primary-light text-brand-primary border-brand-primary/30 font-semibold'
                : 'bg-white text-brand-muted hover:text-brand-text border-brand-border'
            }`}
          >
            {isSelected && level.id !== 'all' && (
              <span className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
            )}
            <span>{level.label}</span>
          </button>
        );
      })}
    </div>
  );
};
