'use client';

import React, { useRef, useState } from 'react';
import { Play, RotateCcw, Copy, Check, Terminal } from 'lucide-react';
import { Button } from '@/ui/Button';

interface PythonEditorProps {
  value: string;
  onChange: (val: string) => void;
  onExecute: () => void;
  onReset: () => void;
  isRunning?: boolean;
}

const PYTHON_QUICK_SNIPPETS = [
  'import pandas as pd',
  'df.head()',
  'df.shape',
  'df.groupby()',
  "['montant_total_fcfa']",
  '.sum()',
  'print()',
  '==',
  '&',
  '[]'
];

export const PythonEditor: React.FC<PythonEditorProps> = ({
  value,
  onChange,
  onExecute,
  onReset,
  isRunning = false
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);

  const insertSnippet = (snippet: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const before = value.substring(0, start);
    const after = value.substring(end);
    const textToInsert = snippet === 'print()' ? 'print(df.head())' : snippet;

    const newValue = `${before}${before.endsWith(' ') || before.length === 0 ? '' : ' '}${textToInsert} ${after}`;
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      const newCursor = start + textToInsert.length + 1;
      textarea.setSelectionRange(newCursor, newCursor);
    }, 10);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = value.split('\n');

  return (
    <div className="flex flex-col bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs font-mono font-medium text-slate-400 ml-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>script_analysis.py</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copier le script Python"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
            title="Copier le code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onReset}
            aria-label="Réinitialiser l'exercice"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
            title="Réinitialiser le code"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Code Textarea with line numbers */}
      <div className="relative flex min-h-[180px] sm:min-h-[220px] max-h-[380px] font-mono text-xs sm:text-sm bg-slate-900">
        {/* Line Numbers */}
        <div
          aria-hidden="true"
          className="select-none py-3 pl-3 pr-2.5 text-right font-mono text-slate-600 bg-slate-950/40 border-r border-slate-800/60 shrink-0 text-xs leading-6"
        >
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          aria-label="Éditeur de code Python"
          className="w-full h-full p-3 bg-transparent text-amber-300 placeholder:text-slate-600 outline-none resize-none font-mono leading-6 selection:bg-amber-500/30 overflow-y-auto"
          placeholder="# Écrivez votre code Python avec Pandas..."
        />
      </div>

      {/* Mobile-First Fast-Input Bar (Tactile shortcuts >= 44px) */}
      <div className="px-2.5 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold uppercase text-slate-500 shrink-0 pl-1">
          Touches rapides :
        </span>
        {PYTHON_QUICK_SNIPPETS.map((snippet) => (
          <button
            key={snippet}
            type="button"
            onClick={() => insertSnippet(snippet)}
            className="min-h-[36px] sm:min-h-[32px] px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono font-semibold transition-colors shrink-0 active:scale-95 border border-slate-700/60"
          >
            {snippet}
          </button>
        ))}
      </div>

      {/* Action Footer Bar */}
      <div className="flex items-center justify-between p-3 bg-slate-950 border-t border-slate-800">
        <span className="text-[11px] text-slate-400 font-sans">
          Moteur client instantané &bull; Données locales en FCFA
        </span>

        <Button
          type="button"
          onClick={onExecute}
          disabled={isRunning}
          variant="primary"
          className="min-h-[44px] px-4 rounded-xl flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm shadow-xs"
        >
          <Play className={`w-4 h-4 fill-current ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Exécution...' : 'Exécuter le script Python'}</span>
        </Button>
      </div>
    </div>
  );
};
