'use client';

import React from 'react';
import { PythonExecutionResult } from '../types';
import { Terminal, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PythonConsoleOutputProps {
  result: PythonExecutionResult | null;
}

export const PythonConsoleOutput: React.FC<PythonConsoleOutputProps> = ({ result }) => {
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-brand-border/70 min-h-[180px]">
        <Terminal className="w-8 h-8 text-slate-300 mb-2" />
        <h4 className="text-xs font-bold text-brand-primary">Console Python prête</h4>
        <p className="text-[11px] text-brand-muted max-w-xs mt-1">
          Exécutez votre script pour afficher la sortie standard (stdout) et inspecter vos DataFrames.
        </p>
      </div>
    );
  }

  if (result.error || result.stderr) {
    return (
      <div
        role="alert"
        className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 shadow-2xs"
      >
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider font-mono">
            Python Traceback (Most recent call last):
          </h4>
          <pre className="text-xs font-mono text-rose-950 mt-1 leading-relaxed whitespace-pre-wrap overflow-x-auto">
            {result.stderr || result.error}
          </pre>
        </div>
      </div>
    );
  }

  const { stdout, outputTable, executionTimeMs } = result;

  return (
    <div className="flex flex-col rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xs text-white">
      {/* Console Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 font-bold text-[11px] border border-emerald-800/60">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sortie Console (stdout)</span>
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{executionTimeMs} ms</span>
        </div>
      </div>

      {/* Raw Stdout Terminal Text */}
      <div className="p-4 font-mono text-xs sm:text-sm text-emerald-300 leading-relaxed overflow-x-auto max-h-[220px]">
        <pre className="whitespace-pre-wrap">{stdout}</pre>
      </div>

      {/* Rendered DataFrame Table Preview (if available) */}
      {outputTable && outputTable.rows.length > 0 && (
        <div className="border-t border-slate-800 bg-slate-900/60 p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-2 font-mono">
            Aperçu Tabulaire DataFrame ({outputTable.rows.length} lignes) :
          </span>

          <div className="overflow-x-auto rounded-xl border border-slate-800 max-h-[200px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-800/90 text-[10px] uppercase font-bold text-slate-300">
                  {outputTable.columns.map((col, idx) => (
                    <th
                      key={col}
                      className={`py-2 px-3 whitespace-nowrap ${
                        idx === 0 ? 'sticky left-0 bg-slate-800 z-10' : ''
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px] text-slate-200">
                {outputTable.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-800/40">
                    {outputTable.columns.map((col, cIdx) => {
                      const val = row[col];
                      const isAmount = col.includes('fcfa') || col.includes('montant') || col.includes('marge');
                      const display =
                        typeof val === 'number' && isAmount
                          ? `${val.toLocaleString('fr-FR')} FCFA`
                          : String(val ?? '');

                      return (
                        <td
                          key={col}
                          className={`py-1.5 px-3 whitespace-nowrap ${
                            cIdx === 0 ? 'sticky left-0 bg-slate-950 z-10 font-bold text-amber-300' : ''
                          }`}
                        >
                          {display}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

