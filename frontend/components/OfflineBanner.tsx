'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [wasOffline, setWasOffline] = useState<boolean>(false);

  useEffect(() => {
    // Initial status
    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);

      // Register Service Worker for PWA (F3.10)
      if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[SW] Enregistré avec succès, scope:', registration.scope);
          })
          .catch((err) => {
            console.warn('[SW] Échec enregistrement:', err);
          });
      }
    }

    const handleOnline = () => {
      setIsOffline(false);
      setWasOffline(true);
      const timer = setTimeout(() => setWasOffline(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setWasOffline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (wasOffline && !isOffline) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-20 lg:bottom-4 right-4 z-50 p-3.5 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-2"
      >
        <Wifi className="w-4 h-4 text-emerald-200" />
        <span>Connexion rétablie ! Vos synchronisations reprennent.</span>
      </div>
    );
  }

  if (!isOffline) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed bottom-20 lg:bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50 p-4 rounded-2xl bg-amber-950 text-amber-100 border border-amber-600/50 shadow-2xl flex items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-bottom-3"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <WifiOff className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-amber-200">Mode Hors-ligne Actif (PWA)</span>
          <span className="text-[11px] text-amber-300/80">
            Connexion réseau interrompue. Les pages et exercices mis en cache restent accessibles.
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.location.reload()}
        title="Tester la reconnexion"
        className="p-2 rounded-xl bg-amber-800/60 hover:bg-amber-700/80 text-white shrink-0 active:scale-95 transition-all min-h-[36px]"
      >
        <RefreshCw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

