'use client';

import React from 'react';
import { useDataSaver } from './DataSaverContext';
import { Zap, Wifi, ShieldCheck, Check } from 'lucide-react';

interface DataSaverToggleProps {
  variant?: 'badge' | 'full' | 'compact';
  className?: string;
}

export const DataSaverToggle: React.FC<DataSaverToggleProps> = ({
  variant = 'badge',
  className = '',
}) => {
  const { isDataSaver, toggleDataSaver, effectiveType, estimatedMbSaved } = useDataSaver();

  if (variant === 'badge') {
    return (
      <button
        type="button"
        onClick={toggleDataSaver}
        aria-label={isDataSaver ? 'Désactiver le mode économiseur de données' : 'Activer le mode économiseur de données'}
        title="Cliquer pour basculer entre le Mode Éco (360p basse consommation) et le Mode Standard (HD)"
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all min-h-[44px] cursor-pointer active:scale-95 select-none ${
          isDataSaver
            ? 'bg-[#ffdea7]/60 hover:bg-[#ffdea7] text-[#7c5800] border border-amber-300'
            : 'bg-teal-50 hover:bg-teal-100 text-[#006b5f] border border-teal-200'
        } ${className}`}
      >
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            isDataSaver ? 'bg-[#d29b24] animate-pulse' : 'bg-[#13b8a6]'
          }`}
        />
        <span className="truncate">
          {isDataSaver ? 'Mode Éco 3G actif' : 'Mode Standard HD'}
        </span>
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
            isDataSaver ? 'bg-[#ffdea7] text-[#7c5800]' : 'bg-teal-100 text-[#006b5f]'
          }`}
        >
          {isDataSaver ? '360p' : '720p'}
        </span>
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={toggleDataSaver}
        aria-label="Basculer le mode éco"
        className={`w-11 h-11 flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
          isDataSaver
            ? 'bg-amber-100/70 text-[#7c5800] hover:bg-amber-200/80'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        } ${className}`}
      >
        <Zap className={`w-4 h-4 ${isDataSaver ? 'fill-current' : ''}`} />
      </button>
    );
  }

  // Variant "full" for Profile / Settings View
  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
        isDataSaver
          ? 'bg-gradient-to-r from-amber-50/70 via-white to-teal-50/50 border-amber-300'
          : 'bg-slate-50 border-slate-200/80'
      } ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isDataSaver
                ? 'bg-[#ffdea7] text-[#7c5800]'
                : 'bg-slate-200 text-slate-700'
            }`}
          >
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-[#121c2a]">
                Mode Économiseur de Données (3G / Data Saver)
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  isDataSaver
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {isDataSaver ? 'Actif' : 'Désactivé'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-xl">
              Optimisé pour les connexions douces et forfaits mobiles africains : bloque le préchargement vidéo automatique, sert les flux 360p allégés et limite le poids des pages à moins de 300 Ko.
            </p>
            {isDataSaver && (
              <div className="flex items-center gap-2 mt-2 text-[11px] font-semibold text-[#006b5f]">
                <Check className="w-3.5 h-3.5" />
                <span>Environ {estimatedMbSaved} Mo de forfait économisés ce mois-ci</span>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={toggleDataSaver}
          aria-label={isDataSaver ? 'Désactiver le mode économiseur' : 'Activer le mode économiseur'}
          className={`min-h-[44px] px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs ${
            isDataSaver
              ? 'bg-[#006b5f] hover:bg-[#005249] text-white'
              : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
          }`}
        >
          {isDataSaver ? 'Mode Éco Actif (360p)' : 'Activer le Mode Éco'}
        </button>
      </div>
    </div>
  );
};
