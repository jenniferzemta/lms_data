'use client';

import React, { useState } from 'react';
import { 
  Table, 
  Terminal, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Play, 
  Check, 
  Database,
  BarChart3,
  Cpu
} from 'lucide-react';

export const DataMboaStudioMockup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'excel' | 'sql' | 'powerbi'>('excel');

  return (
    <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
      {/* Glow Backdrop */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-teal-500/20 via-brand-primary/20 to-purple-500/20 blur-xl opacity-75 pointer-events-none" />

      {/* Main Studio Window Frame */}
      <div className="relative bg-white/95 backdrop-blur-md rounded-3xl border border-brand-border/90 shadow-2xl overflow-hidden text-left">
        
        {/* Window Title Bar */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/90" />
            <div className="w-3 h-3 rounded-full bg-amber-500/90" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/90" />
            <span className="ml-2 font-mono text-[11px] text-slate-400 font-semibold truncate">
              datamboa-studio://cas-kamer-sarl.xlsx
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
            <span className="text-[10px] font-mono text-brand-teal uppercase tracking-wider font-bold">
              In-Browser Live
            </span>
          </div>
        </div>

        {/* Studio Tool Switcher Tabs */}
        <div className="px-3 pt-2 bg-slate-100/90 border-b border-slate-200/80 flex items-center gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('excel')}
            className={`min-h-[36px] px-3.5 rounded-t-xl flex items-center gap-1.5 text-xs font-bold transition ${
              activeTab === 'excel'
                ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-emerald-600" />
            <span>Excel (DAX & Formules)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sql')}
            className={`min-h-[36px] px-3.5 rounded-t-xl flex items-center gap-1.5 text-xs font-bold transition ${
              activeTab === 'sql'
                ? 'bg-white text-sky-800 border-t-2 border-sky-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-sky-600" />
            <span>SQL Microfinance</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('powerbi')}
            className={`min-h-[36px] px-3.5 rounded-t-xl flex items-center gap-1.5 text-xs font-bold transition ${
              activeTab === 'powerbi'
                ? 'bg-white text-purple-800 border-t-2 border-purple-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
            <span>Power BI & DAX</span>
          </button>
        </div>

        {/* Tab 1: Live Excel Preview */}
        {activeTab === 'excel' && (
          <div className="p-4 space-y-3">
            {/* Active Formula Bar */}
            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700">
              <span className="font-bold text-slate-400 select-none">fx</span>
              <span className="font-bold text-emerald-700 select-none">E3</span>
              <span className="text-slate-300 select-none">|</span>
              <span className="text-slate-900 font-medium truncate">
                =SOMME.SI.ENS(Ventes[Montant]; Ventes[Ville]; &quot;Douala&quot;)
              </span>
            </div>

            {/* Interactive Miniature Sheet */}
            <div className="border border-slate-200 rounded-xl overflow-hidden font-mono text-[11px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 text-[10px]">
                    <th className="p-2 border-r border-slate-200 w-8 text-center text-slate-400">#</th>
                    <th className="p-2 border-r border-slate-200">Article</th>
                    <th className="p-2 border-r border-slate-200 text-right">Qté</th>
                    <th className="p-2 border-r border-slate-200 text-right">Prix Unitaire</th>
                    <th className="p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-2 border-r border-slate-200 text-center text-slate-400">1</td>
                    <td className="p-2 border-r border-slate-200 font-medium">Ciment Dangote 42.5R</td>
                    <td className="p-2 border-r border-slate-200 text-right">250</td>
                    <td className="p-2 border-r border-slate-200 text-right font-medium">4 900</td>
                    <td className="p-2 text-right font-bold text-slate-900">1 225 000</td>
                  </tr>
                  <tr className="bg-emerald-50/60 transition-colors">
                    <td className="p-2 border-r border-slate-200 text-center text-emerald-700 font-bold">2</td>
                    <td className="p-2 border-r border-slate-200 font-medium text-emerald-950">Fer à béton 12mm FE500</td>
                    <td className="p-2 border-r border-slate-200 text-right">180</td>
                    <td className="p-2 border-r border-slate-200 text-right font-medium">7 500</td>
                    <td className="p-2 text-right font-black text-emerald-700">1 350 000</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-2 border-r border-slate-200 text-center text-slate-400">3</td>
                    <td className="p-2 border-r border-slate-200 font-medium">Tôle ondulée bac alu 6/10e</td>
                    <td className="p-2 border-r border-slate-200 text-right">300</td>
                    <td className="p-2 border-r border-slate-200 text-right font-medium">6 200</td>
                    <td className="p-2 text-right font-bold text-slate-900">1 860 000</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-slate-900 text-white font-bold border-t border-slate-800 text-[11px]">
                    <td colSpan={4} className="p-2.5 text-right font-semibold text-slate-300">
                      Chiffre d&apos;Affaires Consolidé Kamer SARL :
                    </td>
                    <td className="p-2.5 text-right font-black text-brand-teal text-xs">
                      4 435 000
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Live SQL Preview */}
        {activeTab === 'sql' && (
          <div className="p-4 space-y-3 font-mono text-[11px]">
            <div className="p-3 bg-slate-950 text-slate-100 rounded-xl space-y-1">
              <span className="text-slate-500 text-[10px]">-- Analyse du portefeuille de crédit Microfinance Bafoussam</span>
              <div className="text-sky-400">SELECT agence, COUNT(*) AS nb_emprunteurs,</div>
              <div className="text-emerald-400 pl-4">SUM(montant_credit_fcfa) AS total_encours_fcfa</div>
              <div className="text-sky-400">FROM credits_octroyes</div>
              <div className="text-purple-400">WHERE statut_remboursement = &apos;REGULIER&apos;</div>
              <div className="text-sky-400">GROUP BY agence ORDER BY total_encours_fcfa DESC;</div>
            </div>

            <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 flex items-center justify-between text-xs font-sans">
              <span className="font-semibold">Requête compilée en 12 ms</span>
              <span className="font-bold">4 agences · 84 500 000 d&apos;encours</span>
            </div>
          </div>
        )}

        {/* Tab 3: Power BI Preview */}
        {activeTab === 'powerbi' && (
          <div className="p-4 space-y-3 font-mono text-[11px]">
            <div className="p-3 bg-slate-950 text-slate-100 rounded-xl space-y-1">
              <span className="text-slate-500 text-[10px]">-- Mesure DAX de Performance Commerciale</span>
              <div className="text-purple-400">CA_Douala_YoY :=</div>
              <div className="text-sky-400 pl-4">CALCULATE(</div>
              <div className="text-emerald-400 pl-8">[Chiffre_Affaires_FCFA],</div>
              <div className="text-amber-400 pl-8">SAMEPERIODLASTYEAR(Dim_Calendrier[Date]),</div>
              <div className="text-emerald-400 pl-8">Dim_Agences[Ville] = &quot;Douala&quot;</div>
              <div className="text-sky-400 pl-4">)</div>
            </div>

            <div className="p-2.5 bg-purple-50 text-purple-900 rounded-xl border border-purple-200 flex items-center justify-between text-xs font-sans">
              <span className="font-semibold">Modélisation en Étoile Validée</span>
              <span className="font-bold text-purple-800">+18.4% Croissance annuelle</span>
            </div>
          </div>
        )}

        {/* Bottom Floating Proof Badge */}
        <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-teal-50/60 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-800 text-[11px]">
              Certificat Infalsifiable avec QR Code
            </span>
          </div>

          <span className="font-mono text-[10px] font-bold text-brand-teal px-2 py-0.5 rounded bg-white border border-teal-200 shadow-2xs">
            DM-EXC-2026-X892
          </span>
        </div>
      </div>
    </div>
  );
};
