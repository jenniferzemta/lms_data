'use client';

import React from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  Coins,
  Calendar,
  Type
} from 'lucide-react';

interface LessonContentRendererProps {
  content: string;
}

/**
 * Parses markdown inline formatting (bold, italic, inline code) safely into React elements.
 */
function parseInlineFormatting(text: string): React.ReactNode {
  // Regex to split by bold (**text**), code (`text`), or italic (*text*)
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-bold text-slate-900">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={match.index}
          className="font-mono text-xs sm:text-sm px-1.5 py-0.5 rounded-md bg-teal-50 text-teal-900 border border-teal-200/60 font-semibold"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="italic text-slate-800">
          {token.slice(1, -1)}
        </em>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

/**
 * Beautiful, human-designed pedagogical content renderer.
 * Converts raw markdown into rich, highly readable magazine-style course sections
 * without raw symbols (#, **, >).
 */
export const LessonContentRenderer: React.FC<LessonContentRendererProps> = ({ content }) => {
  if (!content) return null;

  const rawBlocks = content.split(/\n\s*\n/);

  return (
    <div className="space-y-6 text-slate-700 leading-relaxed font-normal">
      {rawBlocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // 1. Callout / Quote Block (> **Règle d'or** : ...)
        if (trimmed.startsWith('>')) {
          const calloutText = trimmed.replace(/^>\s*/, '').replace(/\n>\s*/g, ' ');
          const isGoldenRule = calloutText.toLowerCase().includes("règle d'or") || calloutText.toLowerCase().includes("golden rule");
          const isWarning = calloutText.toLowerCase().includes('attention') || calloutText.toLowerCase().includes('important');

          return (
            <div
              key={idx}
              className={`p-4 sm:p-5 rounded-2xl border flex items-start gap-3.5 sm:gap-4 shadow-2xs my-6 ${
                isGoldenRule
                  ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                  : isWarning
                  ? 'bg-red-50/80 border-red-200 text-red-950'
                  : 'bg-teal-50/80 border-teal-200 text-teal-950'
              }`}
            >
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                  isGoldenRule
                    ? 'bg-amber-500 text-white'
                    : isWarning
                    ? 'bg-red-500 text-white'
                    : 'bg-brand-teal text-white'
                }`}
              >
                {isGoldenRule ? (
                  <Sparkles className="w-5 h-5 fill-current" aria-hidden="true" />
                ) : isWarning ? (
                  <AlertCircle className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Lightbulb className="w-5 h-5" aria-hidden="true" />
                )}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <span
                  className={`text-xs font-bold uppercase tracking-wider block mb-1 ${
                    isGoldenRule
                      ? 'text-amber-800'
                      : isWarning
                      ? 'text-red-800'
                      : 'text-brand-teal'
                  }`}
                >
                  {isGoldenRule
                    ? "Règle d'or du Data Analyst"
                    : isWarning
                    ? 'Point de vigilance'
                    : 'Conseil pratique'}
                </span>
                <p className="text-sm sm:text-[15px] leading-relaxed font-medium">
                  {parseInlineFormatting(calloutText.replace(/^\*\*.*?\*\*\s*:\s*/, ''))}
                </p>
              </div>
            </div>
          );
        }

        // 2. Main Title (# Heading 1)
        if (trimmed.startsWith('# ')) {
          return (
            <div key={idx} className="pt-2 pb-3 border-b border-brand-border/60 mb-6">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-primary-light text-brand-primary text-[11px] font-bold uppercase tracking-wider mb-2">
                <FileSpreadsheet className="w-3.5 h-3.5 text-brand-teal" />
                <span>Cas d&apos;entreprise concret</span>
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-brand-primary tracking-tight">
                {trimmed.replace(/^#\s+/, '')}
              </h2>
            </div>
          );
        }

        // 3. Section Title (## Heading 2)
        if (trimmed.startsWith('## ')) {
          return (
            <div key={idx} className="pt-4 pb-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-teal" />
                <span>{trimmed.replace(/^##\s+/, '')}</span>
              </h3>
            </div>
          );
        }

        // 4. Subsection (### Heading 3)
        if (trimmed.startsWith('### ')) {
          return (
            <h4
              key={idx}
              className="text-base sm:text-lg font-bold text-slate-900 pt-2"
            >
              {trimmed.replace(/^###\s+/, '')}
            </h4>
          );
        }

        // 5. Unordered List with Definition Items (- **Item**: Description)
        if (trimmed.startsWith('- ')) {
          const listItems = trimmed
            .split(/\n-\s+/)
            .map((item) => item.replace(/^- /, '').trim())
            .filter(Boolean);

          // Check if items look like data type definitions
          const isDefinitionList = listItems.every((item) => item.includes('**'));

          if (isDefinitionList) {
            return (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
                {listItems.map((item, itemIdx) => {
                  const titleMatch = item.match(/\*\*(.*?)\*\*/);
                  const title = titleMatch ? titleMatch[1] : `Point ${itemIdx + 1}`;
                  const rest = item.replace(/\*\*.*?\*\*\s*:\s*/, '');

                  // Pick a nice icon based on keyword
                  let IconComponent = CheckCircle2;
                  let iconColor = 'text-brand-teal bg-teal-50 border-teal-200';
                  const lowerTitle = title.toLowerCase();

                  if (lowerTitle.includes('texte')) {
                    IconComponent = Type;
                    iconColor = 'text-indigo-600 bg-indigo-50 border-indigo-200';
                  } else if (lowerTitle.includes('nombre')) {
                    IconComponent = FileSpreadsheet;
                    iconColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
                  } else if (lowerTitle.includes('devise') || lowerTitle.includes('fcfa')) {
                    IconComponent = Coins;
                    iconColor = 'text-amber-600 bg-amber-50 border-amber-200';
                  } else if (lowerTitle.includes('date')) {
                    IconComponent = Calendar;
                    iconColor = 'text-blue-600 bg-blue-50 border-blue-200';
                  }

                  return (
                    <div
                      key={itemIdx}
                      className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-brand-teal/40 transition-colors flex items-start gap-3"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${iconColor}`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {title}
                        </h5>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {parseInlineFormatting(rest)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }

          return (
            <ul key={idx} className="space-y-2 my-4 pl-1">
              {listItems.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-teal mt-2 shrink-0" />
                  <span className="flex-1">{parseInlineFormatting(item)}</span>
                </li>
              ))}
            </ul>
          );
        }

        // 6. Numbered Steps (1. Step one...)
        if (/^\d+\.\s+/.test(trimmed)) {
          const stepItems = trimmed
            .split(/\n\d+\.\s+/)
            .map((item) => item.replace(/^\d+\.\s+/, '').trim())
            .filter(Boolean);

          return (
            <div key={idx} className="space-y-2.5 my-4">
              {stepItems.map((step, stepIdx) => (
                <div
                  key={stepIdx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-lg bg-brand-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {stepIdx + 1}
                  </span>
                  <div className="text-xs sm:text-sm text-slate-800 pt-0.5 flex-1">
                    {parseInlineFormatting(step)}
                  </div>
                </div>
              ))}
            </div>
          );
        }

        // 7. Standard Paragraph with clean typography
        return (
          <p key={idx} className="text-sm sm:text-base text-slate-700 leading-relaxed">
            {parseInlineFormatting(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

