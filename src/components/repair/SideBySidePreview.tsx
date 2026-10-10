import React, { useState } from 'react';
import { SandboxedPreview } from '../preview/SandboxedPreview';
import { Monitor, Tablet, Smartphone, Split, ArrowLeftRight, Check, X, ShieldCheck, AlertTriangle } from 'lucide-react';

interface SideBySidePreviewProps {
  originalHtml: string;
  repairedHtml: string;
  originalScore?: number;
  repairedScore?: number;
}

export const SideBySidePreview: React.FC<SideBySidePreviewProps> = ({
  originalHtml,
  repairedHtml,
  originalScore = 65,
  repairedScore = 95,
}) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [layout, setLayout] = useState<'side-by-side' | 'toggle'>('side-by-side');
  const [activeToggle, setActiveToggle] = useState<'before' | 'after'>('after');

  return (
    <div className="rounded-2xl border border-white/10 bg-dark-900 overflow-hidden shadow-2xl flex flex-col space-y-0">
      {/* Viewport Control Bar */}
      <div className="bg-dark-850 px-4 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Split className="w-4 h-4 text-accent-cyan" />
            <span>Before vs After Live Visual Comparison</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
            Health: {originalScore} → {repairedScore} (+{repairedScore - originalScore})
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Layout Mode (Side-by-Side vs Toggle on smaller screens) */}
          <div className="hidden sm:flex bg-dark-900 p-0.5 rounded-lg border border-white/10">
            <button
              onClick={() => setLayout('side-by-side')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                layout === 'side-by-side' ? 'bg-dark-750 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dual Pane
            </button>
            <button
              onClick={() => setLayout('toggle')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                layout === 'toggle' ? 'bg-dark-750 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Toggle A/B
            </button>
          </div>

          {/* Toggle switcher if in toggle mode or mobile */}
          {(layout === 'toggle' || window.innerWidth < 768) && (
            <div className="flex bg-dark-900 p-0.5 rounded-lg border border-white/10">
              <button
                onClick={() => setActiveToggle('before')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  activeToggle === 'before'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Original (Before)
              </button>
              <button
                onClick={() => setActiveToggle('after')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  activeToggle === 'after'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Repaired (After)
              </button>
            </div>
          )}

          {/* Device Dimensions */}
          <div className="flex bg-dark-900 p-0.5 rounded-lg border border-white/10">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded-md transition-all ${
                device === 'desktop' ? 'bg-dark-750 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-1.5 rounded-md transition-all ${
                device === 'tablet' ? 'bg-dark-750 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet View"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded-md transition-all ${
                device === 'mobile' ? 'bg-dark-750 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Frame Rendering Area */}
      {layout === 'side-by-side' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 h-[580px] bg-dark-950">
          {/* Left Pane: Original */}
          <div className="flex flex-col h-full overflow-hidden">
            <div className="px-3 py-1.5 bg-dark-900/80 border-b border-white/5 flex items-center justify-between text-xs">
              <span className="font-bold text-rose-400 flex items-center gap-1.5">
                <X className="w-3.5 h-3.5" />
                <span>Original State (With Flaws)</span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Score: {originalScore}</span>
            </div>
            <div className="flex-1 overflow-hidden relative">
              <SandboxedPreview customHtml={originalHtml} activeDevice={device} />
            </div>
          </div>

          {/* Right Pane: Repaired */}
          <div className="flex flex-col h-full overflow-hidden">
            <div className="px-3 py-1.5 bg-dark-900/80 border-b border-white/5 flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Repaired & Verified State</span>
              </span>
              <span className="text-[11px] text-emerald-400 font-mono font-bold">
                Score: {repairedScore} (Verified)
              </span>
            </div>
            <div className="flex-1 overflow-hidden relative">
              <SandboxedPreview customHtml={repairedHtml} activeDevice={device} />
            </div>
          </div>
        </div>
      ) : (
        /* Toggle Single Pane View */
        <div className="h-[580px] bg-dark-950 flex flex-col">
          <div className="px-3 py-1.5 bg-dark-900/80 border-b border-white/5 flex items-center justify-between text-xs">
            <span
              className={`font-bold flex items-center gap-1.5 ${
                activeToggle === 'after' ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {activeToggle === 'after' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Repaired & Verified State (Score: {repairedScore})</span>
                </>
              ) : (
                <>
                  <X className="w-3.5 h-3.5" />
                  <span>Original Problematic State (Score: {originalScore})</span>
                </>
              )}
            </span>
            <span className="text-[11px] text-slate-500 font-mono capitalize">{device} Viewport</span>
          </div>
          <div className="flex-1 overflow-hidden relative">
            <SandboxedPreview
              customHtml={activeToggle === 'after' ? repairedHtml : originalHtml}
              activeDevice={device}
            />
          </div>
        </div>
      )}
    </div>
  );
};
