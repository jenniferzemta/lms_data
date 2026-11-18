'use client';

import React, { useRef } from 'react';
import { useLocale } from 'next-intl';
import { Play, RotateCcw, Copy, Check } from 'lucide-react';
import { Button } from '@/ui/Button';

interface SqlEditorProps {
  value: string;
  onChange: (val: string) => void;
  onExecute: () => void;
  onReset: () => void;
  isRunning?: boolean;
}

const SQL_QUICK_KEYWORDS = [
  'SELECT',
  'FROM',
  'WHERE',
  'AND',
  'GROUP BY',
  'ORDER BY',
  'JOIN',
  'ON',
  'COUNT(*)',
  'SUM()',
  ';'
];

export const SqlEditor: React.FC<SqlEditorProps> = ({
  value,
  onChange,
  onExecute,
  onReset,
  isRunning = false
}) => {
  const locale = useLocale();
  const isEn = locale === 'en';
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = React.useState(false);

  const insertSnippet = (snippet: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const before = value.substring(0, start);
    const after = value.substring(end);
    const textToInsert = snippet === 'SUM()' ? 'SUM(montant_emprunte_fcfa)' : snippet;

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
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs font-mono font-medium text-slate-400 ml-2">
            query.sql
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copier le code SQL"
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

      {/* Code Textarea Area with line numbers */}
      <div className="relative flex min-h-[160px] sm:min-h-[200px] max-h-[360px] font-mono text-xs sm:text-sm bg-slate-900">
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
          aria-label={isEn ? 'SQL Code Editor' : 'Éditeur de code SQL'}
          className="w-full h-full p-3 bg-transparent text-emerald-300 placeholder:text-slate-600 outline-none resize-none font-mono leading-6 selection:bg-emerald-500/30 overflow-y-auto"
          placeholder={isEn ? '-- Enter your SQL query here...' : '-- Saisissez votre requête SQL ici...'}
        />
      </div>

      {/* Mobile-First Fast-Input Bar */}
      <div className="px-2.5 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold uppercase text-slate-500 shrink-0 pl-1">
          {isEn ? 'Quick Keys:' : 'Touches rapides :'}
        </span>
        {SQL_QUICK_KEYWORDS.map((kw) => (
          <button
            key={kw}
            type="button"
            onClick={() => insertSnippet(kw)}
            className="min-h-[36px] sm:min-h-[32px] px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono font-semibold transition-colors shrink-0 active:scale-95 border border-slate-700/60"
          >
            {kw}
          </button>
        ))}
      </div>

      {/* Action Footer Bar */}
      <div className="flex items-center justify-between p-3 bg-slate-950 border-t border-slate-800">
        <span className="text-[11px] text-slate-400 font-sans">
          {isEn
            ? 'Shortcut: Run to preview live query results.'
            : 'Raccourci : Exécutez pour prévisualiser les résultats en direct.'}
        </span>

        <Button
          type="button"
          onClick={onExecute}
          disabled={isRunning}
          variant="primary"
          className="min-h-[44px] px-4 rounded-xl flex items-center gap-2 bg-brand-teal hover:bg-brand-teal-dark text-white font-bold text-xs sm:text-sm shadow-xs"
        >
          <Play className={`w-4 h-4 fill-current ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? (isEn ? 'Running...' : 'Exécution...') : (isEn ? 'Run Query' : 'Exécuter la requête')}</span>
        </Button>
      </div>
    </div>
  );
};

