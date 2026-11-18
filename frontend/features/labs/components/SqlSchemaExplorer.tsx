'use client';

import React, { useState } from 'react';
import { MICROFINANCE_SCHEMAS } from '../data/microfinanceDb';
import { Table, Key, ChevronDown, ChevronRight, Eye, Layers } from 'lucide-react';

interface SqlSchemaExplorerProps {
  onInsertText?: (text: string) => void;
}

export const SqlSchemaExplorer: React.FC<SqlSchemaExplorerProps> = ({ onInsertText }) => {
  const [expandedTable, setExpandedTable] = useState<string>('clients');
  const [previewTable, setPreviewTable] = useState<string | null>(null);

  const toggleTable = (name: string) => {
    setExpandedTable((curr) => (curr === name ? '' : name));
  };

  return (
    <div className="flex flex-col rounded-2xl bg-white border border-brand-border p-4 shadow-2xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-teal" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-primary">
            Base Microfinance Cameroun
          </h3>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
          4 tables relationnelles
        </span>
      </div>

      <p className="text-[11px] text-brand-muted mb-3 leading-relaxed">
        Cliquez sur une table pour inspecter ses champs ou sur un nom pour l&apos;insérer dans votre éditeur.
      </p>

      {/* Accordion List of Tables */}
      <div className="space-y-2">
        {MICROFINANCE_SCHEMAS.map((table) => {
          const isExpanded = expandedTable === table.name;
          const isPreviewing = previewTable === table.name;

          return (
            <div
              key={table.name}
              className="rounded-xl border border-brand-border/70 overflow-hidden bg-slate-50/50"
            >
              {/* Table Bar Header */}
              <div className="w-full min-h-[44px] px-3 py-2 flex items-center justify-between text-left hover:bg-slate-100/70 transition-colors">
                <button
                  type="button"
                  onClick={() => toggleTable(table.name)}
                  className="flex items-center gap-2 min-w-0 flex-1 text-left"
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-brand-teal shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <Table className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                  <span className="font-mono font-bold text-xs text-brand-primary truncate">
                    {table.name}
                  </span>
                  <span className="text-[10px] text-brand-muted hidden sm:inline">
                    ({table.rowCount} lignes)
                  </span>
                </button>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewTable(isPreviewing ? null : table.name);
                    }}
                    title="Aperçu des 3 premières lignes"
                    aria-label={`Aperçu de la table ${table.name}`}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-brand-teal hover:bg-white transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Expanded Columns Details */}
              {isExpanded && (
                <div className="px-3 py-2.5 bg-white border-t border-brand-border/60 text-xs">
                  <div className="flex flex-col gap-1.5">
                    {table.columns.map((col) => (
                      <div
                        key={col.name}
                        className="flex items-center justify-between text-[11px] font-mono py-0.5 group"
                      >
                        <button
                          type="button"
                          onClick={() => onInsertText?.(col.name)}
                          className="flex items-center gap-1.5 text-slate-700 hover:text-brand-teal text-left font-medium group-hover:underline"
                          title="Cliquer pour insérer dans l'éditeur"
                        >
                          {col.isPrimaryKey ? (
                            <Key className="w-3 h-3 text-amber-500 shrink-0" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                          )}
                          <span>{col.name}</span>
                        </button>

                        <div className="flex items-center gap-1.5 text-[10px] text-brand-muted">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            {col.type}
                          </span>
                          {col.isForeignKey && (
                            <span className="text-[9px] text-amber-700 font-sans">
                              FK {col.references}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Sample rows drawer */}
                  {isPreviewing && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Échantillon de données :
                      </span>
                      <div className="overflow-x-auto rounded-lg border border-slate-200">
                        <table className="w-full text-[10px] font-mono border-collapse bg-slate-50">
                          <thead>
                            <tr className="bg-slate-200/70 border-b border-slate-300">
                              {table.columns.slice(0, 4).map((c) => (
                                <th key={c.name} className="py-1 px-2 text-left font-semibold">
                                  {c.name}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {table.sampleRows.map((row, idx) => (
                              <tr key={idx} className="border-b border-slate-200/50">
                                {table.columns.slice(0, 4).map((c) => (
                                  <td key={c.name} className="py-1 px-2 whitespace-nowrap">
                                    {String(row[c.name])}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

