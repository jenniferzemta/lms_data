'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Compass, 
  Target, 
  Briefcase, 
  Brain, 
  Bell, 
  ArrowRight, 
  Clock 
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { recommendationsService } from '../services/recommendations.service';
import { RecommendationsData, LearnerRecommendation, LearnerReminder } from '../types';

export const RecommendationsFeed: React.FC = () => {
  const [data, setData] = useState<RecommendationsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    recommendationsService.getRecommendations().then((res) => {
      if (isMounted) {
        setData(res);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-3xl border border-brand-border p-5 shadow-xs flex items-center justify-center min-h-[140px]">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <div className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
          Analyse de vos recommandations pédagogiques...
        </div>
      </div>
    );
  }

  if (!data || (data.recommendations.length === 0 && data.reminders.length === 0)) {
    return null;
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'ASSESSMENT':
        return <Target className="w-5 h-5 text-brand-primary" />;
      case 'COURSE':
        return <Compass className="w-5 h-5 text-blue-600" />;
      case 'MISSION':
        return <Briefcase className="w-5 h-5 text-amber-600" />;
      default:
        return <Brain className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Reminders Banner (SRS Due or Inactivity anti-dropoff) */}
      {data.reminders.map((reminder) => (
        <div
          key={reminder.id}
          className={`p-4 sm:p-5 rounded-3xl border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in ${
            reminder.urgency === 'HIGH'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-950'
              : 'bg-brand-primary/10 border-brand-primary/30 text-slate-900'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                reminder.urgency === 'HIGH' ? 'bg-amber-500 text-white' : 'bg-brand-primary text-white'
              }`}
            >
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-wider text-amber-800">
                Rappel Pédagogique
              </span>
              <h4 className="text-sm font-bold text-slate-900">{reminder.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5">{reminder.message}</p>
            </div>
          </div>

          <Link
            href={reminder.action_url}
            className="px-5 py-2.5 rounded-xl bg-brand-primary text-white font-bold text-xs shadow-xs hover:bg-brand-primary/90 active:scale-95 transition-all self-end sm:self-center shrink-0 min-h-[44px] flex items-center gap-1.5"
          >
            {reminder.action_label}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ))}

      {/* Recommendations Cards */}
      {data.recommendations.length > 0 && (
        <div className="bg-white rounded-3xl border border-brand-border p-5 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-primary" />
              Recommandations personnalisées pour vous
            </h3>
            <span className="text-[11px] font-semibold text-brand-primary">
              {data.recommendations.length} action(s)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-brand-primary/40 transition-all flex flex-col justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0">
                    {getRecommendationIcon(rec.type)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      {rec.type}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {rec.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {rec.reason}
                    </p>
                  </div>
                </div>

                <Link
                  href={rec.action_url}
                  className="w-full py-2.5 px-4 rounded-xl bg-white border border-slate-300 text-slate-800 hover:bg-brand-primary hover:text-white hover:border-brand-primary text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[44px] shadow-2xs"
                >
                  {rec.action_label}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
