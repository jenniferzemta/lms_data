'use client';

import React from 'react';
import { FunctionSquare, Check, RotateCcw } from 'lucide-react';

interface ExcelFormulaBarProps {
  activeCell: string;
  formulaInput: string;
  onChangeFormula: (val: string) => void;
  onSubmitFormula: () => void;
  onResetActiveCell: () => void;
}

export const ExcelFormulaBar: React.FC<ExcelFormulaBarProps> = ({
  activeCell,
  formulaInput,
  onChangeFormula,
  onSubmitFormula,
  onResetActiveCell
}) => {
  const quickFormulas = [
    { label: '=SOMME(', value: '=SOMME(' },
    { label: '=MOYENNE(', value: '=MOYENNE(' },
    { label: '=SI(', value: '=SI(' },
    { label: '=SOMME.SI(', value: '=SOMME.SI(' },
    { label: '=RECHERCHEV(', value: '=RECHERCHEV(' },
    { label: ';', value: '; ' },
    { label: '*', value: '*' },
    { label: '/', value: '/' },
    { label: '+', value: '+' },
    { label: '-', value: '-' }
  ];

  const handleQuickInsert = (snippet: string) => {
    let nextValue: string;
    if (snippet.startsWith('=')) {
      // Replace or set formula start
      nextValue = snippet;
    } else {
      nextValue = formulaInput + snippet;
    }
    onChangeFormula(nextValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmitFormula();
    }
  };

  return (
    <div className="flex flex-col bg-white border border-brand-border rounded-xl shadow-xs overflow-hidden">
      {/* Formula Input Bar */}
      <div className="flex items-center gap-2 p-2 bg-slate-50 border-b border-brand-border">
        {/* Active Cell Coordinate Badge */}
        <div className="px-3 py-1.5 bg-brand-primary text-white font-mono font-bold text-xs rounded-lg shadow-xs min-w-[54px] text-center shrink-0">
          {activeCell || 'A1'}
        </div>

        {/* fx symbol */}
        <div className="flex items-center justify-center w-7 h-7 text-slate-500 shrink-0 font-serif italic font-bold">
          <FunctionSquare className="w-5 h-5 text-brand-primary" />
        </div>

        {/* Formula Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={formulaInput}
            onChange={(e) => onChangeFormula(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Saisissez une valeur ou une formule (ex: =SOMME(F2:F11))..."
            className="w-full px-3 py-2 bg-white border border-brand-border rounded-lg font-mono text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent/40 focus:border-brand-accent transition-all"
          />
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={onSubmitFormula}
          className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs min-h-[40px] shrink-0"
          title="Valider la formule (Entrée)"
        >
          <Check className="w-4 h-4" />
          <span className="hidden sm:inline">Valider</span>
        </button>

        {/* Clear Button */}
        <button
          type="button"
          onClick={onResetActiveCell}
          className="inline-flex items-center justify-center p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-200/60 rounded-lg transition-colors shrink-0"
          title="Effacer la cellule"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Tactile Quick-Insert Formula Bar */}
      <div className="flex items-center gap-1.5 p-2 bg-white overflow-x-auto scrollbar-thin text-xs">
        <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider shrink-0 mr-1 hidden md:inline">
          Formules rapides :
        </span>
        {quickFormulas.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => handleQuickInsert(item.value)}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 text-slate-700 font-mono font-medium rounded-md whitespace-nowrap text-xs transition-colors shrink-0 min-h-[36px]"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
