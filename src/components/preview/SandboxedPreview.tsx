import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RotateCw,
  ExternalLink,
  Laptop,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  ShieldCheck,
  Maximize2,
  Code2,
} from 'lucide-react';
import { WebsiteProject } from '../../types';
import { generateProjectHtml } from '../../services/htmlRenderer';

interface SandboxedPreviewProps {
  project?: WebsiteProject;
  customHtml?: string;
  activeDevice?: 'desktop' | 'tablet' | 'mobile';
  isLoading?: boolean;
}

export const SandboxedPreview: React.FC<SandboxedPreviewProps> = ({
  project,
  customHtml,
  activeDevice = 'desktop',
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  const htmlContent = useMemo(() => {
    if (customHtml) return customHtml;
    if (project) return generateProjectHtml(project);
    return '<!DOCTYPE html><html><body><h1 style="color:#fff;text-align:center;padding:50px;">No preview available</h1></body></html>';
  }, [project, customHtml, refreshKey]);

  const handleOpenFullTab = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const getDeviceWidthClass = () => {
    switch (activeDevice) {
      case 'mobile':
        return 'w-[375px] max-w-full h-[667px] shadow-lg rounded-[32px] border-[10px] border-slate-800';
      case 'tablet':
        return 'w-[768px] max-w-full h-[900px] shadow-lg rounded-[24px] border-[8px] border-slate-800';
      case 'desktop':
      default:
        return 'w-full h-full rounded-b-xl';
    }
  };

  const simulatedUrl = project
    ? `https://${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.sitegen.preview`
    : 'https://preview.sitegen.ai';

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      {/* Browser chrome header */}
      <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between gap-3 flex-shrink-0">
        {/* Window controls */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
        </div>

        {/* Address bar */}
        <div className="flex-1 max-w-md mx-auto flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 font-mono shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span className="truncate">{simulatedUrl}</span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate('/export')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-300 shadow-2xs transition-colors cursor-pointer"
            title="Inspect Generated Source Code"
          >
            <Code2 className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">View Code</span>
          </button>

          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            title="Reload Preview"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors hidden sm:inline-block"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] text-slate-600 font-semibold hidden sm:inline-block">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.3, z + 0.1))}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors hidden sm:inline-block"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleOpenFullTab}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            title="Open In New Window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Frame container */}
      <div className="flex-1 overflow-auto bg-slate-100/70 p-2 sm:p-4 flex items-center justify-center relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs z-30 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold text-slate-700">Updating Live Preview...</p>
          </div>
        )}

        <div
          className={`transition-all duration-300 flex flex-col items-center justify-center ${getDeviceWidthClass()}`}
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
        >
          {/* Real sandboxed iframe */}
          <iframe
            key={refreshKey}
            title="SiteGen Sandboxed Preview"
            srcDoc={htmlContent}
            sandbox="allow-scripts allow-forms"
            className="w-full h-full border-none bg-white rounded-inherit shadow-xs"
            style={{ minHeight: activeDevice === 'desktop' ? '700px' : undefined }}
          />
        </div>
      </div>
    </div>
  );
};
