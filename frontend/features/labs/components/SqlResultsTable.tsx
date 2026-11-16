'use client';

import React from 'react';
import { SqlQueryResult } from '../types';
import { AlertCircle, Clock, Database, CheckCircle2 } from 'lucide-react';

interface SqlResultsTableProps {
  result: SqlQueryResult | null;
}

export const SqlResultsTable: React.FC<SqlResultsTableProps> = ({ result }) => {
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-brand-border/70 min-h-[180px]">
        <Database className="w-8 h-8 text-slate-300 mb-2" />
        <h4 className="text-xs font-bold text-brand-primary">Aucun résultat pour le moment</h4>
        <p className="text-[11px] text-brand-muted max-w-xs mt-1">
          Rédigez votre requête SQL et cliquez sur « Exécuter la requête » pour afficher les données.
        </p>
      </div>
    );
  }

  if (result.error) {
    return (
      <div
        role="alert"
        className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 shadow-2xs"
      >
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider">Erreur SQL</h4>
          <p className="text-xs font-mono text-rose-900 mt-1 leading-relaxed whitespace-pre-wrap">
            {result.error}
          </p>
        </div>
      </div>
    );
  }

  const { columns, rows, rowCount, executionTimeMs } = result;

  return (
    <div className="flex flex-col rounded-2xl bg-white border border-brand-border overflow-hidden shadow-xs">
      {/* Table Header Meta */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-brand-border text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{rowCount} {rowCount > 1 ? 'lignes retournées' : 'ligne retournée'}</span>
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-brand-muted">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{executionTimeMs} ms</span>
        </div>
      </div>

      {/* Responsive Table with Sticky First Column (Rule 20 / Rule 4.2) */}
      <div className="overflow-x-auto max-h-[340px] relative">
        {rows.length === 0 ? (
          <div className="p-8 text-center text-xs text-brand-muted">
            La requête a été exécutée avec succès mais ne retourne aucun enregistrement.
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-brand-border text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                {columns.map((col, idx) => (
                  <th
                    key={col}
                    scope="col"
                    className={`py-2.5 px-3.5 whitespace-nowrap ${
                      idx === 0
                        ? 'sticky left-0 z-10 bg-slate-100 border-r border-brand-border/60 shadow-xs'
                        : ''
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/50 text-slate-800 font-mono text-[11px]">
              {rows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className="hover:bg-slate-50/80 transition-colors odd:bg-white even:bg-slate-50/30"
                >
                  {columns.map((col, cIdx) => {
                    const rawVal = row[col];
                    const isAmount = col.includes('fcfa') || col.includes('solde') || col.includes('montant');
                    const displayVal =
                      rawVal === null || rawVal === undefined
                        ? <span className="text-slate-400 italic">NULL</span>
                        : isAmount && typeof rawVal === 'number'
                        ? `${rawVal.toLocaleString('fr-FR')} FCFA`
                        : String(rawVal);

                    return (
                      <td
                        key={`${rIdx}-${col}`}
                        className={`py-2 px-3.5 whitespace-nowrap ${
                          cIdx === 0
                            ? 'sticky left-0 z-10 bg-inherit border-r border-brand-border/50 font-semibold text-brand-primary'
                            : ''
                        }`}
                      >
                        {displayVal}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

