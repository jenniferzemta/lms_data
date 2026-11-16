'use client';

import React from 'react';
import { VideoChapter } from '../types';
import { ListOrdered, Play, Clock } from 'lucide-react';

interface VideoChaptersListProps {
  chapters: VideoChapter[];
  currentTime: number;
  onSeekTo: (seconds: number) => void;
}

export const VideoChaptersList: React.FC<VideoChaptersListProps> = ({
  chapters,
  currentTime,
  onSeekTo
}) => {
  if (!chapters || chapters.length === 0) return null;

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-brand-border p-4 shadow-2xs">
      <div className="flex items-center gap-2 mb-3">
        <ListOrdered className="w-4 h-4 text-brand-teal" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-primary">
          Chapitres de la Leçon Vidéo
        </h4>
      </div>

      <div className="space-y-1.5">
        {chapters.map((chap, idx) => {
          const nextChap = chapters[idx + 1];
          const isCurrent =
            currentTime >= chap.timecodeSeconds &&
            (!nextChap || currentTime < nextChap.timecodeSeconds);

          const minutes = Math.floor(chap.timecodeSeconds / 60);
          const seconds = Math.floor(chap.timecodeSeconds % 60);
          const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

          return (
            <button
              key={chap.id}
              type="button"
              onClick={() => onSeekTo(chap.timecodeSeconds)}
              className={`w-full min-h-[44px] px-3 py-2 rounded-xl text-left flex items-center justify-between gap-3 transition-all ${
                isCurrent
                  ? 'bg-brand-primary-light text-brand-primary font-bold border border-teal-200 shadow-2xs'
                  : 'hover:bg-slate-50 text-slate-700 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center shrink-0 ${
                  isCurrent ? 'bg-brand-teal text-white font-bold' : 'bg-slate-100 text-slate-600'
                }`}>
                  {idx + 1}
                </span>
                <span className="text-xs truncate">{chap.title}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 text-[11px] font-mono text-brand-muted">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{formatted}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

