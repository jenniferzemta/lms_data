'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, CornerDownLeft, Play, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { GitLabState } from '../types';

interface GitTerminalViewProps {
  labState: GitLabState;
  onExecuteCommand: (cmd: string) => void;
  onClearLogs?: () => void;
}

export const GitTerminalView: React.FC<GitTerminalViewProps> = ({
  labState,
  onExecuteCommand,
  onClearLogs
}) => {
  const [inputVal, setInputVal] = useState<string>('');
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const logEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Command history extracted from logs
  const commandHistory = React.useMemo(() => {
    return labState.logs
      .filter((l) => l.type === 'command')
      .map((l) => l.text.replace(/^\$\s*/, ''));
  }, [labState.logs]);

  // Auto-scroll to bottom of logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [labState.logs]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    onExecuteCommand(inputVal.trim());
    setInputVal('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx < commandHistory.length) {
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  const quickCommands = [
    'git status',
    'git add .',
    'git commit -m "feat: nettoyage ventes FCFA"',
    'git checkout -b feature/indicateurs-kpi',
    'git checkout main',
    'git merge feature/indicateurs-kpi',
    'git log --oneline',
    'git push origin main'
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-xl overflow-hidden font-mono text-sm">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs text-slate-400 font-semibold ml-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-brand-primary" />
            Terminal Git interactif — bash
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-brand-primary/20 text-brand-primary font-bold">
            branche : {labState.currentBranch}
          </span>
          {onClearLogs && (
            <button
              type="button"
              onClick={onClearLogs}
              title="Effacer l'écran (clear)"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Action Touch Chips (Mobile-First Rule 360px & touch >= 44px) */}
      <div className="px-3 py-2 bg-slate-900/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[11px] text-slate-400 font-bold shrink-0 uppercase tracking-wider mr-1">
          Touches rapides :
        </span>
        {quickCommands.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => {
              setInputVal(cmd);
              inputRef.current?.focus();
            }}
            className="shrink-0 px-2.5 py-1 text-xs rounded-lg bg-slate-800 text-slate-200 border border-slate-700/80 hover:bg-brand-primary/20 hover:border-brand-primary hover:text-brand-primary active:scale-95 transition-all min-h-[36px] flex items-center font-mono whitespace-nowrap"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Terminal Output Logs */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2 select-text font-mono text-xs sm:text-sm leading-relaxed">
        {labState.logs.map((log, idx) => {
          if (log.type === 'command') {
            return (
              <div key={idx} className="flex items-center gap-2 text-brand-primary font-bold pt-1">
                <span className="text-emerald-400">kamer@data:</span>
                <span className="text-sky-400">~/{labState.currentBranch}</span>
                <span className="text-slate-300">{log.text}</span>
              </div>
            );
          }
          if (log.type === 'error') {
            return (
              <div key={idx} className="text-red-400 bg-red-950/30 border-l-2 border-red-500 pl-3 py-1 whitespace-pre-wrap">
                {log.text}
              </div>
            );
          }
          if (log.type === 'success') {
            return (
              <div key={idx} className="text-emerald-400 bg-emerald-950/20 border-l-2 border-emerald-500 pl-3 py-1 whitespace-pre-wrap">
                {log.text}
              </div>
            );
          }
          return (
            <div key={idx} className="text-slate-300 whitespace-pre-wrap">
              {log.text}
            </div>
          );
        })}
        <div ref={logEndRef} />
      </div>

      {/* Interactive Command Input Prompt */}
      <form onSubmit={handleSubmit} className="px-4 py-3 bg-slate-900 border-t border-slate-800 shrink-0 flex items-center gap-2">
        <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold shrink-0 hidden sm:flex">
          <span>kamer@data:</span>
          <span className="text-sky-400">~/{labState.currentBranch}$</span>
        </div>
        <span className="text-brand-primary font-bold sm:hidden">$</span>

        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Entrez une commande (ex: git status, git commit -m "...")'
          className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 outline-hidden font-mono text-xs sm:text-sm"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck="false"
        />

        <button
          type="submit"
          disabled={!inputVal.trim()}
          className="px-3 py-2 rounded-xl bg-brand-primary text-white font-bold text-xs flex items-center gap-1.5 hover:bg-brand-primary/90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all min-h-[44px] shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">Exécuter</span>
        </button>
      </form>
    </div>
  );
};

