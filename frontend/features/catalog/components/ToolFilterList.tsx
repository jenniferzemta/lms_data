import React from 'react';
import { CourseTool } from '../types';
import { LayoutGrid, Table, BarChart3, Database, Code2 } from 'lucide-react';

export interface ToolFilterListProps {
  selectedTool: CourseTool;
  onSelectTool: (tool: CourseTool) => void;
}

export const ToolFilterList: React.FC<ToolFilterListProps> = ({
  selectedTool,
  onSelectTool
}) => {
  const tools: { id: CourseTool; label: string; icon: React.ElementType }[] = [
    { id: 'all', label: 'Tous', icon: LayoutGrid },
    { id: 'excel', label: 'Excel', icon: Table },
    { id: 'powerbi', label: 'Power BI', icon: BarChart3 },
    { id: 'sql', label: 'SQL', icon: Database },
    { id: 'python', label: 'Python', icon: Code2 }
  ];

  return (
    <div
      role="tablist"
      aria-label="Filtrer par outil"
      className="flex items-center gap-2 overflow-x-auto py-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none"
    >
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isSelected = selectedTool === tool.id;

        return (
          <button
            key={tool.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectTool(tool.id)}
            className={`shrink-0 min-h-[44px] px-4 py-2 rounded-full font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 ${
              isSelected
                ? 'bg-brand-teal text-white shadow-xs'
                : 'bg-white text-brand-muted hover:text-brand-text hover:bg-brand-canvas-alt border border-brand-border'
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{tool.label}</span>
          </button>
        );
      })}
    </div>
  );
};
