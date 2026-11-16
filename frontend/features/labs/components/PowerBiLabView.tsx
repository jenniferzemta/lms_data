'use client';

import React, { useState } from 'react';
import { PowerBiLabState, PowerBiLabEngine } from '../engines/PowerBiLabEngine';
import {
  PieChart,
  BarChart3,
  TrendingUp,
  Coins,
  Building,
  Check,
  Play,
  Layers,
  Sparkles,
  MapPin,
  Filter,
} from 'lucide-react';

interface PowerBiLabViewProps {
  state: PowerBiLabState;
  engine: PowerBiLabEngine;
  onStateChange: (newState: PowerBiLabState) => void;
}

export const PowerBiLabView: React.FC<PowerBiLabViewProps> = ({
  state,
  engine,
  onStateChange,
}) => {
  const [daxCode, setDaxCode] = useState(state.activeCode);
  const [activeTab, setActiveTab] = useState<'canvas' | 'data' | 'measures'>('canvas');

  const handleApplyDax = () => {
    const nextState = engine.evaluateDax(state, daxCode);
    onStateChange(nextState);
  };

  const insertToken = (token: string) => {
    setDaxCode(prev => prev + token);
  };

  const handleCityFilter = (city: string) => {
    const nextState = {
      ...state,
      selectedCityFilter: city,
    };
    nextState.evaluationResult = engine.computeReportVisuals(nextState);
    onStateChange(nextState);
  };

  const kpis = state.evaluationResult?.kpis || {
    totalVentesFcfa: 1034000,
    totalMargeFcfa: 412000,
    totalQuantite: 1990,
    panierMoyenFcfa: 86166,
    tauxMargePct: 39.8,
  };

  const salesByCity = state.evaluationResult?.salesByCity || [];
  const salesByCategory = state.evaluationResult?.salesByCategory || [];
  const lastMeasure = state.evaluationResult?.lastEvaluatedMeasure;

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* DAX Formula Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 space-y-2 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 rounded-lg text-xs font-mono font-bold shrink-0">
            fx DAX
          </span>
          <input
            type="text"
            value={daxCode}
            onChange={(e) => setDaxCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleApplyDax();
              }
            }}
            placeholder='Ex: Total Ventes = SUM(Ventes[chiffre_affaires_fcfa])'
            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-amber-500"
          />
          <button
            onClick={handleApplyDax}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors min-h-[40px] shrink-0 shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Appliquer</span>
          </button>
        </div>

        {/* Quick Tokens */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0">Insérer :</span>
          {['CALCULATE(', 'SUM(', 'DIVIDE(', 'FILTER(', 'ALL(', 'AVERAGE(', '[Total Ventes]', 'Ventes[ville] = "Douala"'].map((token) => (
            <button
              key={token}
              onClick={() => insertToken(token)}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-colors min-h-[36px]"
            >
              {token}
            </button>
          ))}
        </div>
      </div>

      {/* Last Evaluated Measure Banner */}
      {lastMeasure && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-xl flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>
              Mesure recalculée : <strong>[{lastMeasure.name}]</strong>
            </span>
          </div>
          <span className="font-extrabold text-sm text-amber-700 dark:text-amber-300 font-mono">
            = {lastMeasure.value}
          </span>
        </div>
      )}

      {/* Slicer / City Filter Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
          <Filter className="w-3.5 h-3.5 text-amber-600" />
          <span>Filtre Région / Ville :</span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto">
          {['ALL', 'Douala', 'Yaoundé', 'Bafoussam', 'Garoua'].map((c) => (
            <button
              key={c}
              onClick={() => handleCityFilter(c)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors min-h-[32px] ${
                state.selectedCityFilter === c
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {c === 'ALL' ? 'Toutes les villes' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Main Power BI Visual Canvas */}
      <div className="space-y-4">
        {/* KPI Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 text-center">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
              Chiffre d&apos;Affaires
            </span>
            <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">
              {kpis.totalVentesFcfa.toLocaleString('fr-FR')} FCFA
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 text-center">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
              Marge Brute Réalisée
            </span>
            <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
              {kpis.totalMargeFcfa.toLocaleString('fr-FR')} FCFA
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 text-center">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
              Volume Vendu
            </span>
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {kpis.totalQuantite.toLocaleString('fr-FR')} caisses
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 text-center">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
              Taux de Marge Moyen
            </span>
            <span className="text-base sm:text-lg font-black text-indigo-600 dark:text-indigo-400">
              {kpis.tauxMargePct}%
            </span>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* City Bar Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-amber-600" />
                Ventes par Ville (Cameroun)
              </span>
              <span className="text-slate-400">En FCFA</span>
            </div>

            <div className="space-y-2.5 pt-1">
              {salesByCity.map((c) => (
                <div key={c.city} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{c.city}</span>
                    <span className="font-mono text-slate-900 dark:text-white font-bold">
                      {c.totalFcfa.toLocaleString('fr-FR')} FCFA ({c.sharePct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(10, c.sharePct))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-emerald-600" />
                Répartition par Gamme de Produits
              </span>
              <span className="text-slate-400">Kamer Boissons</span>
            </div>

            <div className="space-y-2 pt-1">
              {salesByCategory.map((cat) => (
                <div
                  key={cat.category}
                  className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs"
                >
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{cat.category}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {cat.totalFcfa.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Defined DAX Measures List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Mesures DAX actives dans le modèle ({state.measures.length})</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {state.measures.map((m) => (
              <div
                key={m.name}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono flex items-center gap-2"
              >
                <span className="text-amber-700 dark:text-amber-300 font-semibold">[{m.name}]</span>
                <span className="text-slate-400">=</span>
                <span className="text-slate-900 dark:text-white font-bold">{m.formattedValue || 'Évalué'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
