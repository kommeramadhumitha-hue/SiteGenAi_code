import React, { useState, useMemo } from 'react';
import {
  FileCode,
  FileText,
  Copy,
  Download,
  Check,
  FolderArchive,
  Layers,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { generateProjectFiles, downloadProjectAsZip, downloadSingleFile } from '../../services/exportService';

type FileKey = 'index.html' | 'styles.css' | 'script.js' | 'README.md' | 'App.tsx';

export const CodeExplorer: React.FC = () => {
  const { activeProject } = useProject();
  const [activeFile, setActiveFile] = useState<FileKey>('index.html');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const files = useMemo(() => {
    return generateProjectFiles(activeProject);
  }, [activeProject]);

  const fileList: { key: FileKey; name: string; type: string; icon: any }[] = [
    { key: 'index.html', name: 'index.html', type: 'HTML5 Markup', icon: FileCode },
    { key: 'styles.css', name: 'styles.css', type: 'CSS Tokens & Layout', icon: FileCode },
    { key: 'script.js', name: 'script.js', type: 'JavaScript Logic', icon: FileCode },
    { key: 'README.md', name: 'README.md', type: 'Documentation', icon: FileText },
    { key: 'App.tsx', name: 'App.tsx', type: 'React + Tailwind', icon: FileCode },
  ];

  const currentContent = files[activeFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const ext = activeFile.split('.').pop();
    let mime = 'text/plain';
    if (ext === 'html') mime = 'text/html';
    if (ext === 'css') mime = 'text/css';
    if (ext === 'js') mime = 'application/javascript';
    if (ext === 'tsx') mime = 'text/typescript';
    downloadSingleFile(activeFile, currentContent, mime);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      await downloadProjectAsZip(activeProject);
    } catch (e) {
      console.error(e);
    } finally {
      setIsZipping(false);
    }
  };

  const lineCount = currentContent.split('\n').length;
  const byteSize = new Blob([currentContent]).size;

  return (
    <div className="space-y-6">
      {/* Top Export Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
              <FolderArchive className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">Source Code & Bundle Export</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              Production Ready
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Export zero-dependency, semantic HTML/CSS or modern React + Tailwind components. All source files are validated and ready to deploy.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-xs shadow-sm shadow-blue-600/20 transition-all flex-shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{isZipping ? 'Generating Archive...' : 'Download Project ZIP'}</span>
        </button>
      </div>

      {/* Explorer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        {/* Left: File Tree Sidebar */}
        <div className="lg:col-span-4 bg-slate-50 border-r border-slate-200 p-5 space-y-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-200 flex items-center justify-between">
            <span>Project Files</span>
            <span className="text-slate-500 font-mono text-[11px]">5 files</span>
          </div>

          <div className="space-y-1.5">
            {fileList.map((file) => {
              const Icon = file.icon;
              return (
                <button
                  key={file.key}
                  onClick={() => setActiveFile(file.key)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeFile === file.key
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${activeFile === file.key ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="font-mono">{file.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">{file.type}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe Sandbox: No secrets leaked</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Clean code ready to run locally, push to GitHub, or host on Vercel and Netlify.
            </p>
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-8 flex flex-col bg-slate-950 min-h-[550px]">
          {/* Code Viewer Toolbar */}
          <div className="h-12 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-sky-400">{activeFile}</span>
              <span className="text-[11px] text-slate-400 font-mono">
                ({lineCount} lines • {(byteSize / 1024).toFixed(1)} KB)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadSingle}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Code Body */}
          <div className="flex-1 p-4 overflow-auto max-h-[620px] font-mono text-xs text-slate-200 leading-relaxed bg-[#0b1120]">
            <pre className="whitespace-pre overflow-x-auto selection:bg-blue-600/40">
              {currentContent}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
