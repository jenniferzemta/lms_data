'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  FileSpreadsheet,
  FileCode,
  FileText,
  FileDown,
  Download,
  FolderArchive,
} from 'lucide-react';
import { LessonAttachment, AttachmentType } from '../types';
import { coursesService } from '../services/courses.service';

interface LessonAttachmentsListProps {
  attachments: LessonAttachment[];
  fallbackPdfUrl?: string;
}

export const LessonAttachmentsList: React.FC<LessonAttachmentsListProps> = ({
  attachments,
  fallbackPdfUrl,
}) => {
  const tLesson = useTranslations('Lesson');

  // If no attachments from backend but fallbackPdfUrl is provided (legacy field)
  const items: LessonAttachment[] =
    attachments && attachments.length > 0
      ? attachments
      : fallbackPdfUrl
      ? [
          {
            id: 0,
            title: tLesson('downloadFiles'),
            description: tLesson('supportDocumentDesc'),
            attachment_type: 'CHEATSHEET',
            file_format: 'pdf',
            file_size_bytes: 0,
            file_size_display: '—',
            download_url: fallbackPdfUrl,
            is_free_preview: true,
            download_count: 0,
            order: 1,
          },
        ]
      : [];

  if (items.length === 0) {
    return null;
  }

  const getFormatIcon = (format: string) => {
    const f = format.toLowerCase().trim();
    if (['xlsx', 'xls', 'csv'].includes(f)) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-600" aria-hidden="true" />;
    }
    if (['py', 'sql', 'ipynb', 'r', 'json'].includes(f)) {
      return <FileCode className="w-5 h-5 text-indigo-600" aria-hidden="true" />;
    }
    if (['pdf', 'doc', 'docx'].includes(f)) {
      return <FileText className="w-5 h-5 text-red-600" aria-hidden="true" />;
    }
    if (['zip', 'rar', 'gz', 'tar'].includes(f)) {
      return <FolderArchive className="w-5 h-5 text-amber-600" aria-hidden="true" />;
    }
    return <FileDown className="w-5 h-5 text-brand-primary" aria-hidden="true" />;
  };

  const getTypeBadge = (type: AttachmentType) => {
    switch (type) {
      case 'STARTER':
        return {
          label: tLesson('typeStarter'),
          className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'SOLUTION':
        return {
          label: tLesson('typeSolution'),
          className: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      case 'DATASET':
        return {
          label: tLesson('typeDataset'),
          className: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      case 'CHEATSHEET':
        return {
          label: tLesson('typeCheatsheet'),
          className: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      default:
        return {
          label: tLesson('typeOther'),
          className: 'bg-slate-50 text-slate-700 border-slate-200',
        };
    }
  };

  return (
    <section
      aria-labelledby="attachments-heading"
      className="mb-8 p-4 sm:p-5 rounded-2xl bg-white border border-brand-border shadow-2xs"
    >
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-brand-border/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-primary-light text-brand-primary flex items-center justify-center">
            <Download className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 id="attachments-heading" className="text-sm font-bold text-brand-primary">
              {tLesson('downloadableResourcesTitle')}
            </h3>
            <p className="text-xs text-brand-muted">
              {tLesson('downloadableResourcesSubtitle')}
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
          {items.length} {items.length > 1 ? tLesson('filesCountPlural') : tLesson('filesCountSingular')}
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const typeBadge = getTypeBadge(item.attachment_type);
          const downloadHref =
            item.id > 0
              ? coursesService.getAttachmentDownloadUrl(item.id)
              : item.download_url;

          return (
            <div
              key={item.id || item.title}
              className="p-3.5 sm:p-4 rounded-xl border border-slate-200 hover:border-brand-primary/40 transition-colors bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              {/* File details */}
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0">
                  {getFormatIcon(item.file_format)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${typeBadge.className}`}
                    >
                      {typeBadge.label}
                    </span>
                    {item.file_format && (
                      <span className="text-[11px] font-mono uppercase font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                        .{item.file_format}
                      </span>
                    )}
                    {item.file_size_display && item.file_size_display !== '—' && (
                      <span className="text-[11px] font-medium text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                        {item.file_size_display}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-semibold text-slate-900 leading-snug break-words">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-xs text-brand-muted mt-0.5 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action download button */}
              <div className="sm:self-center shrink-0">
                <a
                  href={downloadHref}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] min-w-[44px] w-full sm:w-auto px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white font-medium text-xs inline-flex items-center justify-center gap-2 transition-all active:scale-95 shadow-2xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                  aria-label={`${tLesson('downloadAction')} ${item.title}`}
                >
                  <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{tLesson('downloadAction')}</span>
                  {item.file_size_display && item.file_size_display !== '—' && (
                    <span className="opacity-80 text-[10px]">({item.file_size_display})</span>
                  )}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
