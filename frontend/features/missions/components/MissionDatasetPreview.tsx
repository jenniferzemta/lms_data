'use client';

import React from 'react';
import { Database, Download, FileSpreadsheet } from 'lucide-react';

interface MissionDatasetPreviewProps {
  description: string;
  sampleRows: Record<string, unknown>[];
  downloadUrl?: string;
}

export const MissionDatasetPreview: React.FC<MissionDatasetPreviewProps> = ({
  description,
  sampleRows,
  downloadUrl
}) => {
  if (!sampleRows || sampleRows.length === 0) {
    return null;
  }

  const columns = Object.keys(sampleRows[0]);

  const handleDownloadCsv = () => {
    // Generate CSV on the fly from sample data or download link
    const headers = columns.join(';');
    const rows = sampleRows.map((row) =>
      columns.map((c) => `"${String(row[c] ?? '').replace(/"/g, '""')}"`).join(';')
    );
    const csvContent = '\uFEFF' + [headers, ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dataset_mission.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col bg-white border border-brand-border rounded-xl p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-brand-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Données de l&apos;entreprise (Échantillon & Structure)
          </h3>
        </div>

        <button
          type="button"
          onClick={handleDownloadCsv}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors min-h-[44px] shrink-0 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-emerald-600" />
          <span>Télécharger le jeu de données (CSV)</span>
        </button>
      </div>

      {description && (
        <p className="text-xs text-slate-600 mb-3 leading-relaxed">
          {description}
        </p>
      )}

      {/* Responsive Table with Sticky First Column (R4.2) */}
      <div className="overflow-x-auto border border-brand-border rounded-lg max-h-[320px] scrollbar-thin">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-brand-border sticky top-0 z-20 shadow-xs">
              {columns.map((col, idx) => (
                <th
                  key={col}
                  className={`p-2.5 whitespace-nowrap border-r border-brand-border last:border-r-0 ${
                    idx === 0 ? 'sticky left-0 bg-slate-200 z-30 shadow-xs' : ''
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sampleRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50/60 border-b border-slate-100 transition-colors">
                {columns.map((col, cIdx) => (
                  <td
                    key={col}
                    className={`p-2.5 whitespace-nowrap font-mono text-slate-700 border-r border-slate-100 last:border-r-0 ${
                      cIdx === 0 ? 'sticky left-0 bg-white font-bold text-brand-primary z-10 shadow-xs' : ''
                    }`}
                  >
                    {String(row[col] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-slate-500 mt-2 italic">
        * Échantillon représentatif de 5 lignes affiché ci-dessus. Téléchargez le fichier complet pour vos analyses SQL / Python / Excel.
      </p>
    </div>
  );
};
