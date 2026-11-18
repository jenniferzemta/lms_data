'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Table, 
  Terminal, 
  FileCode, 
  BarChart3, 
  ShieldCheck 
} from 'lucide-react';
import { Button } from '@/ui/Button';
import { PlacementQuestion, PlacementResult } from '../types';
import { placementService } from '../services/placement.service';

interface PlacementWizardProps {
  questions: PlacementQuestion[];
  onCompleted: (result: PlacementResult) => void;
}

export const PlacementWizard: React.FC<PlacementWizardProps> = ({ questions, onCompleted }) => {
  const locale = useLocale();
  const isEn = locale === 'en';
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const currentQ = questions[currentIndex];
  const total = questions.length;
  const progressPct = Math.round(((currentIndex + 1) / total) * 100);

  const getToolIcon = (tool: string) => {
    switch (tool) {
      case 'excel':
        return <Table className="w-4 h-4 text-emerald-600" />;
      case 'sql':
        return <Terminal className="w-4 h-4 text-sky-600" />;
      case 'python':
        return <FileCode className="w-4 h-4 text-amber-600" />;
      case 'powerbi':
        return <BarChart3 className="w-4 h-4 text-purple-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-brand-primary" />;
    }
  };

  const getToolLabel = (tool: string) => {
    switch (tool) {
      case 'excel':
        return isEn ? 'Excel Spreadsheet' : 'Tableur Excel';
      case 'sql':
        return isEn ? 'SQL Database' : 'Base SQL';
      case 'python':
        return 'Python & Pandas';
      case 'powerbi':
        return 'Power BI & DAX';
      default:
        return isEn ? 'Data Analytics' : 'Analyse de données';
    }
  };

  const handleSelectOption = (optId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optId,
    }));
  };

  const handleNext = async () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Submit answers
      setIsSubmitting(true);
      try {
        const result = await placementService.submitAnswers(answers);
        onCompleted(result);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const isCurrentAnswered = !!answers[currentQ?.id];

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
      {/* Progress Header */}
      <div className="bg-white rounded-3xl border border-brand-border p-5 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-xs">
              {currentIndex + 1}
            </span>
            {isEn ? `Question ${currentIndex + 1} of ${total}` : `Question ${currentIndex + 1} sur ${total}`}
          </span>
          <span className="text-brand-primary">{progressPct}% {isEn ? 'completed' : 'complété'}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-brand-primary transition-all duration-300 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-xs flex flex-col gap-6">
        {/* Tool Header */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5">
            {getToolIcon(currentQ.tool)}
            {getToolLabel(currentQ.tool)}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold">
            {isEn ? 'Practical Assessment' : 'Évaluation pratique'}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold ml-auto">
            {currentQ.weight} points
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
          {currentQ.question}
        </h2>

        {/* Multiple Choice Options */}
        <div className="space-y-3">
          {currentQ.options.map((option) => {
            const isSelected = answers[currentQ.id] === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelectOption(option.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 min-h-[52px] ${
                  isSelected
                    ? 'bg-brand-primary/10 border-brand-primary text-brand-primary shadow-xs ring-2 ring-brand-primary/20'
                    : 'bg-white border-brand-border hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    isSelected
                      ? 'border-brand-primary bg-brand-primary text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
                  <span className="font-bold uppercase mr-2 text-slate-500">[{option.id}]</span>
                  {option.text}
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentIndex === 0 || isSubmitting}
            className="flex items-center gap-1.5 text-xs font-bold min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            {isEn ? 'Previous' : 'Précédent'}
          </Button>

          <Button
            onClick={handleNext}
            disabled={!isCurrentAnswered || isSubmitting}
            className="flex items-center gap-2 text-xs font-bold min-h-[44px] px-6"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isEn ? 'Evaluating your level...' : 'Évaluation de votre niveau...'}
              </>
            ) : currentIndex === total - 1 ? (
              <>
                <ShieldCheck className="w-4 h-4" />
                {isEn ? 'Get My Diagnostic' : 'Obtenir mon diagnostic'}
              </>
            ) : (
              <>
                {isEn ? 'Next' : 'Suivant'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

