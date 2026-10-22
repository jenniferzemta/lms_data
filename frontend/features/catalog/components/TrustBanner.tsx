import React from 'react';
import { Banknote, CheckCircle2 } from 'lucide-react';

export const TrustBanner: React.FC = () => {
  return (
    <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-brand-primary-light border border-brand-primary/10 shadow-xs">
      <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
        <Banknote className="w-5 h-5 text-brand-teal" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-bold text-xs sm:text-sm text-brand-primary leading-tight">
          Cas pratiques ancrés sur le continent
        </p>
        <p className="text-[11px] sm:text-xs text-brand-muted mt-0.5 leading-snug">
          Tous nos exercices utilisent des jeux de données réalistes en FCFA (commerce, microfinance, logistique).
        </p>
      </div>

      <CheckCircle2 className="w-5 h-5 text-brand-teal shrink-0 hidden min-[360px]:block" />
    </div>
  );
};
