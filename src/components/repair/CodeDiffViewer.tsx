import React, { useState } from 'react';
import { DiffLine, computeLineDiff, getDiffHunks } from '../../services/diffService';
import { Check, X, FileCode, Copy, Layers, Eye } from 'lucide-react';

interface CodeDiffViewerProps {
  originalCode: string;
  repairedCode: string;
  originalLabel?: string;
  repairedLabel?: string;
}

export const CodeDiffViewer: React.FC<CodeDiffViewerProps> = ({
  originalCode,
  repairedCode,
  originalLabel = 'Original Version (Before Repair)',
  repairedLabel = 'Repaired Version (After Verification)',
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [filterHunks, setFilterHunks] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const fullDiff = computeLineDiff(originalCode, repairedCode);
  const displayDiff = filterHunks ? getDiffHunks(fullDiff, 4) : fullDiff;

  const addedCount = fullDiff.filter((d) => d.type === 'added').length;
  const removedCount = fullDiff.filter((d) => d.type === 'removed').length;

  const handleCopyRepaired = () => {
    navigator.clipboard.writeText(repairedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-dark-900 overflow-hidden shadow-2xl flex flex-col">
      {/* Diff Toolbar */}
      <div className="bg-dark-850 px-4 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <FileCode className="w-4 h-4 text-accent-cyan" />
            <span>Structured Line Diff</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold text-[11px]">
              +{addedCount} added
            </span>
            <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono font-bold text-[11px]">
              -{removedCount} removed
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Hunk vs Full View */}
          <button
            onClick={() => setFilterHunks(!filterHunks)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
              filterHunks
                ? 'bg-dark-750 text-accent-cyan border-accent-cyan/30'
                : 'bg-dark-900 text-slate-400 border-white/5 hover:text-white'
            }`}
          >
            {filterHunks ? 'Showing Changed Regions' : 'Showing Entire File'}
          </button>

          {/* Split vs Unified */}
          <div className="flex bg-dark-900 p-0.5 rounded-lg border border-white/10">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                viewMode === 'split' ? 'bg-dark-750 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('unified')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                viewMode === 'unified' ? 'bg-dark-750 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Unified View
            </button>
          </div>

          <button
            onClick={handleCopyRepaired}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-dark-800 hover:bg-dark-750 border border-white/10 text-slate-300 hover:text-white text-[11px] font-semibold"
            title="Copy repaired code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Split View */}
      {viewMode === 'split' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 font-mono text-[11px] max-h-[520px] overflow-auto">
          {/* Left Column: Original */}
          <div className="bg-dark-950/60 p-2 overflow-x-auto">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-400/90 mb-1 border-b border-rose-500/20 flex items-center justify-between">
              <span>{originalLabel}</span>
              <span className="text-slate-500">Before</span>
            </div>
            {displayDiff
              .filter((d) => d.type !== 'added')
              .map((line, idx) => (
                <div
                  key={`orig-${idx}`}
                  className={`flex items-start px-2 py-0.5 rounded ${
                    line.type === 'removed'
                      ? 'bg-rose-950/30 text-rose-300 font-medium'
                      : 'text-slate-400 hover:bg-white/[0.02]'
                  }`}
                >
                  <span className="w-8 select-none text-slate-600 text-right pr-3 font-mono text-[10px]">
                    {line.originalLineNumber || ''}
                  </span>
                  <span className="w-4 select-none text-rose-500 font-bold font-mono">
                    {line.type === 'removed' ? '-' : ' '}
                  </span>
                  <span className="whitespace-pre-wrap flex-1 break-all">{line.content || ' '}</span>
                </div>
              ))}
          </div>

          {/* Right Column: Repaired */}
          <div className="bg-dark-950/40 p-2 overflow-x-auto">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400/90 mb-1 border-b border-emerald-500/20 flex items-center justify-between">
              <span>{repairedLabel}</span>
              <span className="text-emerald-400 font-semibold">Repaired</span>
            </div>
            {displayDiff
              .filter((d) => d.type !== 'removed')
              .map((line, idx) => (
                <div
                  key={`rep-${idx}`}
                  className={`flex items-start px-2 py-0.5 rounded ${
                    line.type === 'added'
                      ? 'bg-emerald-950/30 text-emerald-300 font-medium'
                      : 'text-slate-400 hover:bg-white/[0.02]'
                  }`}
                >
                  <span className="w-8 select-none text-slate-600 text-right pr-3 font-mono text-[10px]">
                    {line.repairedLineNumber || ''}
                  </span>
                  <span className="w-4 select-none text-emerald-400 font-bold font-mono">
                    {line.type === 'added' ? '+' : ' '}
                  </span>
                  <span className="whitespace-pre-wrap flex-1 break-all">{line.content || ' '}</span>
                </div>
              ))}
          </div>
        </div>
      ) : (
        /* Unified View */
        <div className="bg-dark-950 p-2 font-mono text-[11px] max-h-[520px] overflow-auto">
          {displayDiff.map((line, idx) => (
            <div
              key={`unified-${idx}`}
              className={`flex items-start px-2 py-0.5 rounded ${
                line.type === 'added'
                  ? 'bg-emerald-950/30 text-emerald-300 font-medium'
                  : line.type === 'removed'
                  ? 'bg-rose-950/30 text-rose-300 font-medium line-through opacity-85'
                  : 'text-slate-400 hover:bg-white/[0.02]'
              }`}
            >
              <span className="w-8 select-none text-slate-600 text-right pr-2 font-mono text-[10px]">
                {line.originalLineNumber || ''}
              </span>
              <span className="w-8 select-none text-slate-600 text-right pr-2 font-mono text-[10px]">
                {line.repairedLineNumber || ''}
              </span>
              <span
                className={`w-4 select-none font-bold font-mono ${
                  line.type === 'added'
                    ? 'text-emerald-400'
                    : line.type === 'removed'
                    ? 'text-rose-400'
                    : 'text-transparent'
                }`}
              >
                {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
              </span>
              <span className="whitespace-pre-wrap flex-1 break-all">{line.content || ' '}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
