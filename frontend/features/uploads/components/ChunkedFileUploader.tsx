'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Pause,
  Play,
  X,
  Wifi,
  Sparkles,
} from 'lucide-react';
import { ResumableChunkedUploader } from '../services/chunkedUploader';
import { UploadProgressInfo, ChunkedUploadStatus } from '../types';

interface ChunkedFileUploaderProps {
  accept?: string;
  maxSizeMb?: number;
  onUploadSuccess?: (result: ChunkedUploadStatus) => void;
  title?: string;
  description?: string;
}

export const ChunkedFileUploader: React.FC<ChunkedFileUploaderProps> = ({
  accept = '.xlsx,.xls,.pbix,.csv,.sql,.pdf',
  maxSizeMb = 100,
  onUploadSuccess,
  title = "Dépôt résilient de livrable",
  description = "Fichiers Excel, Power BI (.pbix), SQL ou rapports. Découpage par morceaux pour connexions lentes et instables.",
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progressInfo, setProgressInfo] = useState<UploadProgressInfo | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploader, setUploader] = useState<ResumableChunkedUploader | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Ko';
    const k = 1024;
    const sizes = ['Octets', 'Ko', 'Mo', 'Go'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > maxSizeMb * 1024 * 1024) {
        alert(`Le fichier dépasse la taille maximale autorisée de ${maxSizeMb} Mo.`);
        return;
      }
      setSelectedFile(file);
      setProgressInfo(null);
    }
  };

  const startUpload = async () => {
    if (!selectedFile) return;

    const newUploader = new ResumableChunkedUploader(selectedFile);
    setUploader(newUploader);
    setIsUploading(true);

    newUploader.setOnProgress((info) => {
      setProgressInfo(info);
    });

    try {
      const res = await newUploader.start();
      if (res.is_completed && onUploadSuccess) {
        onUploadSuccess(res);
      }
    } catch {
      // Error handled via setOnProgress
    } finally {
      setIsUploading(false);
    }
  };

  const handlePauseResume = () => {
    if (!uploader || !progressInfo) return;
    if (progressInfo.isPaused) {
      uploader.resume();
    } else {
      uploader.pause();
    }
  };

  const handleCancel = () => {
    if (uploader) {
      uploader.cancel();
    }
    setSelectedFile(null);
    setProgressInfo(null);
    setIsUploading(false);
    setUploader(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            {title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {description}
          </p>
        </div>

        {/* Resilient African 3G badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40 text-[11px] font-medium self-start sm:self-auto">
          <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Reprise auto 2G/3G</span>
        </div>
      </div>

      {/* Dropzone or File Picker */}
      {!selectedFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/60"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-12 h-12 mx-auto mb-3 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
            Cliquez pour sélectionner votre fichier ou glissez-le ici
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Formats acceptés : Excel (.xlsx), Power BI (.pbix), SQL, CSV (max {maxSizeMb} Mo)
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* File Card */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>

            {!isUploading && !progressInfo?.isCompleted && (
              <button
                onClick={handleCancel}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 transition-colors"
                title="Changer de fichier"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Progress Section */}
          {progressInfo && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  {progressInfo.isCompleted ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Fichier téléversé et intègre
                    </span>
                  ) : progressInfo.isPaused ? (
                    <span className="text-amber-600 dark:text-amber-400">En pause (reprise possible)</span>
                  ) : (
                    <span>
                      Envoi du morceau {progressInfo.uploadedChunks}/{progressInfo.totalChunks}
                    </span>
                  )}
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {progressInfo.progressPercentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    progressInfo.isCompleted
                      ? 'bg-emerald-500'
                      : progressInfo.isPaused
                      ? 'bg-amber-500'
                      : 'bg-brand-600'
                  }`}
                  style={{ width: `${progressInfo.progressPercentage}%` }}
                />
              </div>

              {/* Metrics footer: speed & ETA */}
              {!progressInfo.isCompleted && (
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                  <span>Vitesse : {progressInfo.speedKoS} Ko/s</span>
                  {progressInfo.remainingSeconds > 0 && (
                    <span>Temps restant estimé : ~{progressInfo.remainingSeconds}s</span>
                  )}
                </div>
              )}

              {/* Error message if any */}
              {progressInfo.error && (
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-lg text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{progressInfo.error}</span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-1">
            {!isUploading && !progressInfo?.isCompleted && (
              <button
                onClick={startUpload}
                className="flex-1 min-h-[44px] px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <UploadCloud className="w-4 h-4" />
                Démarrer l&apos;envoi sécurisé
              </button>
            )}

            {isUploading && (
              <button
                onClick={handlePauseResume}
                className="flex-1 min-h-[44px] px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                {progressInfo?.isPaused ? (
                  <>
                    <Play className="w-4 h-4 text-emerald-600" />
                    Reprendre l&apos;envoi
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 text-amber-600" />
                    Mettre en pause
                  </>
                )}
              </button>
            )}

            {progressInfo?.isCompleted && (
              <div className="flex-1 p-3 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl flex items-center justify-between">
                <span className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Livrable prêt pour évaluation
                </span>
                <button
                  onClick={handleCancel}
                  className="text-xs text-emerald-700 dark:text-emerald-400 underline font-medium"
                >
                  Remplacer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
