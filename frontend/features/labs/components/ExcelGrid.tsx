'use client';

import React from 'react';
import { ExcelGridMap } from '../types';

interface ExcelGridProps {
  cells: ExcelGridMap;
  activeCell: string;
  rowCount: number;
  colCount: number;
  onSelectCell: (coord: string) => void;
}

export const ExcelGrid: React.FC<ExcelGridProps> = ({
  cells,
  activeCell,
  rowCount,
  colCount,
  onSelectCell
}) => {
  const getColLetter = (index: number): string => String.fromCharCode(64 + index);

  // Column letters from A to K
  const columns = Array.from({ length: colCount }, (_, i) => getColLetter(i + 1));
  const rows = Array.from({ length: rowCount }, (_, i) => i + 1);

  return (
    <div className="relative border border-brand-border rounded-xl bg-white shadow-xs overflow-hidden flex flex-col">
      {/* Scrollable Container with sticky headers */}
      <div className="overflow-auto max-h-[560px] scrollbar-thin">
        <table className="w-full border-collapse text-xs select-none">
          {/* Header Row: Column Letters */}
          <thead>
            <tr className="bg-slate-100 text-slate-600 font-semibold sticky top-0 z-20 shadow-xs border-b border-brand-border">
              {/* Corner header (Empty top-left) */}
              <th className="w-10 min-w-[40px] p-2 text-center bg-slate-200 border-r border-b border-brand-border sticky left-0 z-30 text-[11px]">
                #
              </th>
              {columns.map((col) => {
                const isColActive = activeCell.startsWith(col);
                return (
                  <th
                    key={col}
                    className={`min-w-[100px] max-w-[160px] p-2 text-center border-r border-brand-border transition-colors ${
                      isColActive ? 'bg-emerald-100/70 text-emerald-800 font-bold' : ''
                    }`}
                  >
                    {col}
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Body: Rows & Data Cells */}
          <tbody>
            {rows.map((row) => {
              const isRowActive = activeCell.endsWith(String(row));

              return (
                <tr key={row} className="hover:bg-slate-50/50 transition-colors">
                  {/* Sticky Row Number Column */}
                  <td
                    className={`w-10 min-w-[40px] p-1.5 text-center font-mono text-[11px] font-semibold border-r border-b border-brand-border sticky left-0 z-10 select-none ${
                      isRowActive ? 'bg-emerald-100/70 text-emerald-800 font-bold' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {row}
                  </td>

                  {/* Columns */}
                  {columns.map((col) => {
                    const coord = `${col}${row}`;
                    const cell = cells[coord];
                    const isActive = activeCell === coord;
                    const isHeaderCell = cell?.isHeader || row === 1;

                    // Numeric alignment vs text alignment
                    const isNumber = typeof cell?.value === 'number';
                    const hasError = !!cell?.error;

                    return (
                      <td
                        key={coord}
                        onClick={() => onSelectCell(coord)}
                        className={`min-w-[100px] max-w-[180px] px-2 py-1.5 border-r border-b border-slate-200 cursor-pointer font-sans transition-all truncate ${
                          isActive
                            ? 'bg-emerald-50/80 ring-2 ring-emerald-600 ring-inset font-semibold z-10 shadow-xs'
                            : ''
                        } ${
                          isHeaderCell
                            ? 'bg-slate-50 font-bold text-slate-800'
                            : 'text-slate-700'
                        } ${
                          hasError
                            ? 'text-rose-600 font-semibold bg-rose-50/60'
                            : ''
                        } ${
                          isNumber ? 'text-right font-mono' : 'text-left'
                        }`}
                        title={`${coord}: ${cell?.raw || ''}${cell?.formatted ? ` (${cell.formatted})` : ''}`}
                      >
                        {hasError ? (
                          <span className="text-rose-600 font-bold">{cell.error}</span>
                        ) : cell?.formatted !== undefined ? (
                          cell.formatted
                        ) : (
                          cell?.raw || ''
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Grid Status Footer */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border-t border-brand-border text-[11px] text-slate-500">
        <span className="font-mono">
          Cellule active : <strong className="text-brand-primary">{activeCell}</strong>
          {cells[activeCell]?.formula && (
            <span className="ml-2 text-slate-600 italic">({cells[activeCell]?.formula})</span>
          )}
        </span>
        <span className="hidden sm:inline text-slate-600">
          Double-clic ou saisie directe dans la barre de formule (fx)
        </span>
      </div>
    </div>
  );
};
