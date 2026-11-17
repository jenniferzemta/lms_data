'use client';

import React, { useState, useEffect } from 'react';
import { PlacementWizard } from './PlacementWizard';
import { PlacementResultView } from './PlacementResultView';
import { placementService } from '../services/placement.service';
import { PlacementQuestion, PlacementResult } from '../types';

export const PlacementContainer: React.FC = () => {
  const [questions, setQuestions] = useState<PlacementQuestion[]>([]);
  const [result, setResult] = useState<PlacementResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRetaking, setIsRetaking] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      placementService.getQuestions(),
      placementService.getResult()
    ]).then(([qList, rData]) => {
      if (isMounted) {
        setQuestions(qList);
        if (rData.has_taken_test && rData.result) {
          setResult(rData.result);
        }
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTestCompleted = (newResult: PlacementResult) => {
    setResult(newResult);
    setIsRetaking(false);
  };

  const handleRetake = () => {
    setIsRetaking(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-500">
            Chargement du test de positionnement adaptatif...
          </span>
        </div>
      </div>
    );
  }

  if (result && !isRetaking) {
    return <PlacementResultView result={result} onRetake={handleRetake} />;
  }

  return (
    <PlacementWizard
      questions={questions}
      onCompleted={handleTestCompleted}
    />
  );
};

