'use client';

import React from 'react';
import { GitBranch, GitCommit as GitCommitIcon, FolderTree, Cloud, CheckCircle2, AlertCircle, FileCode, Layers } from 'lucide-react';
import { GitLabState } from '../types';

interface GitVisualizerGraphProps {
  labState: GitLabState;
}

export const GitVisualizerGraph: React.FC<GitVisualizerGraphProps> = ({ labState }) => {
  const untrackedFiles = Object.keys(labState.workingFiles).filter(
    (f) => !(f in labState.stagedFiles) && !(f in labState.committedFiles)
  );
  const modifiedFiles = Object.keys(labState.workingFiles).filter(
    (f) => f in labState.committedFiles && labState.workingFiles[f] !== labState.committedFiles[f] && !(f in labState.stagedFiles)
  );
  const stagedFiles = Object.keys(labState.stagedFiles);
  const committedFiles = Object.keys(labState.committedFiles);

  return (
    <div className="flex flex-col gap-5 h-full overflow-y-auto pr-1">
      {/* 3 Git Zones Overview Card */}
      <div className="bg-white rounded-2xl border border-brand-border p-4 shadow-xs">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-primary" />
          Les 3 Zones Git en temps réel
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Zone 1: Working Directory */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-700">1. Répertoire de travail</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">
                  {untrackedFiles.length + modifiedFiles.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">Fichiers sur votre disque local</p>

              {untrackedFiles.length === 0 && modifiedFiles.length === 0 ? (
                <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Arbre propre
                </div>
              ) : (
                <div className="space-y-1">
                  {untrackedFiles.map((f) => (
                    <div key={f} className="text-[11px] text-red-600 font-mono flex items-center gap-1 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      <span title={f}>{f}</span>
                      <span className="text-[9px] text-red-400 font-sans ml-auto">(non suivi)</span>
                    </div>
                  ))}
                  {modifiedFiles.map((f) => (
                    <div key={f} className="text-[11px] text-amber-600 font-mono flex items-center gap-1 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span title={f}>{f}</span>
                      <span className="text-[9px] text-amber-500 font-sans ml-auto">(modifié)</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Zone 2: Staging Area */}
          <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-emerald-900">2. Zone de Staging</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-200 text-emerald-800 font-bold">
                  {stagedFiles.length}
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 mb-2">Fichiers prêts pour git commit</p>

              {stagedFiles.length === 0 ? (
                <div className="text-[11px] text-slate-400 italic">Aucun fichier indexé</div>
              ) : (
                <div className="space-y-1">
                  {stagedFiles.map((f) => (
                    <div key={f} className="text-[11px] text-emerald-700 font-mono flex items-center gap-1 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span title={f}>{f}</span>
                      <span className="text-[9px] text-emerald-600 font-sans ml-auto">(staged)</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Zone 3: Local Repository */}
          <div className="p-3 rounded-xl bg-sky-50/50 border border-sky-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-sky-900">3. Dépôt Git (.git)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-sky-200 text-sky-800 font-bold">
                  {labState.commits.length} commits
                </span>
              </div>
              <p className="text-[11px] text-sky-700 mb-2">Historique immuable validé</p>

              <div className="space-y-1">
                <div className="text-[11px] text-sky-800 font-semibold flex items-center gap-1">
                  <GitBranch className="w-3.5 h-3.5 text-sky-600" />
                  {Object.keys(labState.branches).length} branche(s) active(s)
                </div>
                <div className="text-[11px] text-slate-600">
                  {committedFiles.length} fichier(s) sous version
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Commit History Visual Tree (DAG Graph) */}
      <div className="bg-white rounded-2xl border border-brand-border p-4 shadow-xs flex-1 flex flex-col min-h-[300px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <GitCommitIcon className="w-4 h-4 text-brand-primary" />
            Graphe des Commits & Arbre des Branches
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            HEAD : <strong className="text-slate-800">{labState.headHash.substring(0, 7)}</strong>
          </span>
        </div>

        <div className="relative pl-6 space-y-4 border-l-2 border-brand-primary/30 flex-1">
          {labState.commits.slice().reverse().map((commit) => {
            const isHead = commit.hash === labState.headHash;
            const branchPointers = Object.entries(labState.branches).filter(([, hash]) => hash === commit.hash);
            const isRemoteOriginHead = labState.remoteOrigin.branches['main'] === commit.hash;

            return (
              <div key={commit.hash} className="relative group">
                {/* Graph Node Dot */}
                <div
                  className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 transition-all ${
                    isHead
                      ? 'bg-brand-primary border-white ring-4 ring-brand-primary/20 scale-110'
                      : 'bg-white border-brand-primary'
                  }`}
                />

                {/* Commit Bubble */}
                <div
                  className={`p-3 rounded-xl border transition-all ${
                    isHead
                      ? 'bg-brand-canvas/80 border-brand-primary shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                    <span className="font-mono text-xs font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-md">
                      {commit.shortHash}
                    </span>

                    {/* Branch Badges */}
                    {branchPointers.map(([bName]) => (
                      <span
                        key={bName}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          bName === labState.currentBranch
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-700 text-slate-100'
                        }`}
                      >
                        <GitBranch className="w-3 h-3" />
                        {bName} {isHead && bName === labState.currentBranch && '(HEAD)'}
                      </span>
                    ))}

                    {/* Remote Badge */}
                    {isRemoteOriginHead && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-600 text-white flex items-center gap-1">
                        <Cloud className="w-3 h-3" />
                        origin/main
                      </span>
                    )}

                    <span className="text-[10px] text-slate-400 ml-auto">
                      {new Date(commit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-800 leading-snug">
                    {commit.message}
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate max-w-[180px]">{commit.author}</span>
                    <span className="font-mono text-[10px]">
                      {Object.keys(commit.files).length} fichier(s)
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* GitHub Remote Sync Status */}
      <div className="bg-slate-900 text-white rounded-2xl p-3.5 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <Cloud className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold">GitHub Distant (origin/main)</span>
            <span className="text-[10px] text-slate-400 font-mono truncate max-w-[220px] sm:max-w-none">
              {labState.remoteOrigin.url}
            </span>
          </div>
        </div>

        <div>
          {labState.branches['main'] === labState.remoteOrigin.branches['main'] ? (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Synchronisé
            </span>
          ) : (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Non poussé (git push requis)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

