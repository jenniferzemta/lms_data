'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface NetworkInformation extends EventTarget {
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  saveData?: boolean;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

interface DataSaverContextType {
  isDataSaver: boolean;
  toggleDataSaver: () => void;
  setDataSaver: (enabled: boolean) => void;
  effectiveType: string;
  isAutoDetected: boolean;
  estimatedMbSaved: number;
}

const DataSaverContext = createContext<DataSaverContextType | undefined>(undefined);

const STORAGE_KEY = 'datamboa_data_saver';
const SAVED_MB_STORAGE_KEY = 'datamboa_data_saver_saved_mb';

export const DataSaverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDataSaver, setIsDataSaverState] = useState<boolean>(true); // Default to data saver ON for African low bandwidth context
  const [effectiveType, setEffectiveType] = useState<string>('3g');
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(false);
  const [estimatedMbSaved, setEstimatedMbSaved] = useState<number>(145);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Check localStorage preference
    const savedPref = localStorage.getItem(STORAGE_KEY);
    const savedMb = localStorage.getItem(SAVED_MB_STORAGE_KEY);
    if (savedMb) {
      const parsed = parseFloat(savedMb);
      if (!isNaN(parsed)) setEstimatedMbSaved(parsed);
    }

    const nav = navigator as NavigatorWithConnection;
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;

    if (conn) {
      if (conn.effectiveType) {
        setEffectiveType(conn.effectiveType);
      }

      // If user has not explicitly set a preference, auto-enable on slow connections or saveData header
      if (savedPref === null) {
        const shouldEnable = conn.saveData || conn.effectiveType === '2g' || conn.effectiveType === '3g' || conn.effectiveType === 'slow-2g';
        setIsDataSaverState(shouldEnable);
        setIsAutoDetected(true);
      } else {
        setIsDataSaverState(savedPref === 'true');
      }

      const handleConnectionChange = () => {
        if (conn.effectiveType) {
          setEffectiveType(conn.effectiveType);
          if (localStorage.getItem(STORAGE_KEY) === null) {
            setIsDataSaverState(conn.saveData || conn.effectiveType !== '4g');
            setIsAutoDetected(true);
          }
        }
      };

      conn.addEventListener('change', handleConnectionChange);
      return () => {
        conn.removeEventListener('change', handleConnectionChange);
      };
    } else if (savedPref !== null) {
      setIsDataSaverState(savedPref === 'true');
    }
  }, []);

  const setDataSaver = useCallback((enabled: boolean) => {
    setIsDataSaverState(enabled);
    setIsAutoDetected(false);
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
    } catch {
      // storage unavailable
    }
  }, []);

  const toggleDataSaver = useCallback(() => {
    setIsDataSaverState((prev) => {
      const next = !prev;
      setIsAutoDetected(false);
      try {
        localStorage.setItem(STORAGE_KEY, next ? 'true' : 'false');
        // Add arbitrary 25MB savings on each eco lesson session
        if (next) {
          setEstimatedMbSaved((curr) => {
            const updated = curr + 25;
            localStorage.setItem(SAVED_MB_STORAGE_KEY, updated.toString());
            return updated;
          });
        }
      } catch {
        // storage unavailable
      }
      return next;
    });
  }, []);

  return (
    <DataSaverContext.Provider
      value={{
        isDataSaver,
        toggleDataSaver,
        setDataSaver,
        effectiveType,
        isAutoDetected,
        estimatedMbSaved,
      }}
    >
      {children}
    </DataSaverContext.Provider>
  );
};

export function useDataSaver(): DataSaverContextType {
  const context = useContext(DataSaverContext);
  if (!context) {
    // Graceful fallback if outside provider
    return {
      isDataSaver: true,
      toggleDataSaver: () => {},
      setDataSaver: () => {},
      effectiveType: '3g',
      isAutoDetected: false,
      estimatedMbSaved: 145,
    };
  }
  return context;
}
