'use client';

import React, { useState } from 'react';
import { CAMEROON_SALES_DATASET } from '../data/pythonDataset';
import { FileSpreadsheet, Eye, ChevronDown, ChevronRight, Layers } from 'lucide-react';

interface PythonDatasetExplorerProps {
  onInsertText?: (text: string) => void;
}

const DATASET_COLUMNS = [
  { name: 'transaction_id', type: 'object', desc: 'Identifiant unique (ex: TXN-101)' },
  { name: 'client', type: 'object', desc: 'Raison sociale entreprise camerounaise' },
  { name: 'ville', type: 'object', desc: 'Douala, Yaoundé, Bafoussam, Garoua' },
  { name: 'produit', type: 'object', desc: 'Désignation article' },
  { name: 'categorie', type: 'object', desc: 'Informatique, BTP, Agro-alimentaire...' },
  { name: 'quantite', type: 'int64', desc: 'Nombre d\'unités vendues' },
  { name: 'prix_unitaire_fcfa', type: 'int64', desc: 'Prix unitaire en FCFA' },
  { name: 'montant_total_fcfa', type: 'int64', desc: 'Chiffre d\'affaires (quantite * prix)' },
  { name: 'date', type: 'object', desc: 'Date de transaction (AAAA-MM-JJ)' }
];

export const PythonDatasetExplorer: React.FC<PythonDatasetExplorerProps> = ({ onInsertText }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className="flex flex-col rounded-2xl bg-white border border-brand-border p-4 shadow-2xs">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-amber-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-primary">
            Fichier : ventes_cameroun.csv
          </h3>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60">
          {CAMEROON_SALES_DATASET.length} lignes &bull; 9 colonnes
        </span>
      </div>

      <p className="text-[11px] text-brand-muted mb-3 leading-relaxed">
        Cliquez sur un nom de colonne pour l&apos;insérer dans votre code Python.
      </p>

      {/* Columns list */}
      <div className="space-y-1 mb-3">
        {DATASET_COLUMNS.map((col) => (
          <div
            key={col.name}
            className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-slate-50 text-xs font-mono group"
          >
            <button
              type="button"
              onClick={() => onInsertText?.(`'${col.name}'`)}
              className="text-slate-800 group-hover:text-amber-700 text-left font-semibold truncate group-hover:underline flex items-center gap-1.5"
              title="Cliquer pour insérer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>{col.name}</span>
            </button>
            <span className="text-[10px] text-slate-400 font-sans">{col.type}</span>
          </div>
        ))}
      </div>

      {/* Toggle Sample Data */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setIsPreviewOpen((prev) => !prev)}
          className="w-full py-2 flex items-center justify-between text-xs font-bold text-slate-700 hover:text-brand-primary"
        >
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-amber-600" />
            <span>Aperçu des 3 premières lignes</span>
          </div>
          {isPreviewOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {isPreviewOpen && (
          <div className="mt-2 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-[10px] font-mono border-collapse bg-slate-50">
              <thead>
                <tr className="bg-slate-200/70 border-b border-slate-300">
                  <th className="py-1 px-2 text-left font-semibold">ville</th>
                  <th className="py-1 px-2 text-left font-semibold">produit</th>
                  <th className="py-1 px-2 text-left font-semibold">montant_total_fcfa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {CAMEROON_SALES_DATASET.slice(0, 3).map((r) => (
                  <tr key={r.transaction_id}>
                    <td className="py-1 px-2 whitespace-nowrap">{r.ville}</td>
                    <td className="py-1 px-2 whitespace-nowrap">{r.produit}</td>
                    <td className="py-1 px-2 whitespace-nowrap font-bold text-emerald-800">
                      {r.montant_total_fcfa.toLocaleString('fr-FR')} FCFA
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

